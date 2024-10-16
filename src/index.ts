import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'
import { getSignedCookie } from 'hono/cookie'
import { add, isBefore } from 'date-fns'

import { ContextConstants } from './types'
import { routes } from './routes/index'
import { knex } from './utils/database'
;(async () => {
  //try {
  //const result = await knex.raw('SELECT * from logins')
  //console.log(result.rows)
  //console.log('Connected to Postgres via Knex')

  ////return knex
  //} catch (error) {
  //console.log(
  //'Unable to connect to Postgres via Knex. Ensure a valid connection.',
  //)
  //console.error(error)
  //}

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

      // TODO handle post from the todos form without a session cookie
      const session = (await getSignedCookie(c, secret, 'session')) as
        | string
        | undefined
        | false

      if (session === undefined || session === false) {
        //no session cookie
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

      const [username, sessionDateTimestamp] = session.split(',')

      const result = await knex
        .select('*')
        .from('logins')
        .where('username', username)
      if (result.length === 0) {
        // invalid session's user name
        throw new HTTPException(401, {
          message: 'Invalid user name in session',
        })
      }

      //session's username is valid
      const sessionDate = new Date(parseInt(sessionDateTimestamp))
      if (isBefore(add(sessionDate, { minutes: 5 }), new Date())) {
        // session expired (after 5 minutes)
        // redirect to login screen
        if (c.req.path !== '/login') {
          return c.redirect('/login')
        }

        await next()
        return
      }
      // session is valid (not expired) so redirect to todos if user tries to access login page
      c.set('username', username)
      if (c.req.path === '/' || c.req.path === '/login') {
        return c.redirect('/todos')
      }
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
