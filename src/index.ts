import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { getSignedCookie, setSignedCookie } from 'hono/cookie'
import { add, isBefore } from 'date-fns'

import { ContextConstants } from './types'
import { routes } from './routes/index'
import knex from './utils/database'

if (!knex || knex === null) {
  console.log(
    'Unable to connect to database via Knex. Ensure a valid connection.',
  )
  process.exit(1)
}

;(async () => {
  const app = new Hono<{ Variables: ContextConstants }>()

  const secret = process.env.SECRET

  if (!secret) {
    throw new Error('SECRET environment variable is required')
  }

  app.use(async (c, next) => {
    c.set('secret', secret)
    await next()
  })

  app.use(
    '*',
    createMiddleware(async (c, next) => {
      c.set('knex', knex)
      const secret = c.get('secret')

      // TODO handle post from the todos form without a session cookie
      const session = (await getSignedCookie(c, secret, 'session')) as
        | string
        | undefined
        | false

      // check if session cookie exists and if not redirect to login screen
      if (session === undefined || session === false) {
        if (
          c.req.path === '/login' ||
          c.req.path === '/register' ||
          c.req.path === '/logout'
        ) {
          await next()
          return
        }
        return c.redirect('/login')
      }

      // check if session's username is valid
      const [username, sessionDateTimestamp] = session.split(',')
      //@ts-ignore knew is not null as it is checked above
      const result = await knex
        .select('*')
        .from('logins')
        .where('username', username)
      if (result.length === 0) {
        throw new HTTPException(401, {
          message: 'Invalid user name in session',
        })
      }

      // check if session is expired
      const sessionDate = new Date(parseInt(sessionDateTimestamp))
      if (isBefore(add(sessionDate, { minutes: 10 }), new Date())) {
        // session expired (after 10 minutes)
        // redirect to login screen
        if (c.req.path !== '/login') {
          return c.redirect('/login')
        }

        await next()
        return
      }
      // session is valid (not expired) so redirect to todos if user tries to access login or register screen
      c.set('username', username)
      if (
        c.req.path === '/' ||
        c.req.path === '/login' ||
        c.req.path === '/register'
      ) {
        return c.redirect('/todos')
      }

      // renew the session timeout to 10 minutes
      const expires = new Date(Date.now() + 1000 * 60 * 10)
      await setSignedCookie(c, 'session', `${username},${expires}`, secret, {
        path: '/',
        secure: true,
        httpOnly: true,
        maxAge: 1000,
        expires,
        sameSite: 'Strict',
      })
      await next()
      return
    }),
  )

  routes(app)

  const port = 3000

  console.log(`Server running at http://localhost:${port}`)
  serve({
    fetch: app.fetch,
    port,
  })
})()
