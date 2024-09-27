import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { JSONFilePreset } from 'lowdb/node'
import { HTTPException } from 'hono/http-exception'
import { getSignedCookie } from 'hono/cookie'
import { add, isBefore } from 'date-fns'

import { secret } from './utils/utils'
import { Database, ContextConstants } from './types'
import { routes } from './routes/index'
;(async () => {
  const app = new Hono<{ Variables: ContextConstants }>()

  const defaultData = {
    todos: {},
    logins: [],
  }
  const db = await JSONFilePreset<Database>('db.json', defaultData)

  app.use(
    '*',
    createMiddleware(async (c, next) => {
      c.set('db', db)

      // TODO handle post from the todos form without a session cookie
      const session = await getSignedCookie(c, secret, 'session')
      if (session) {
        const [username, sessionDateTimestamp] = session.split(',')

        const { logins } = db.data

        if (!logins.find(login => login.username === username)) {
          // invalid user name
          throw new HTTPException(401, { message: 'Invalid user session' })
        }

        //login is successful
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
      }
      //no session cookie
      if (c.req.path === '/login') {
        await next()
        return
      }
      return c.redirect('/login')
    }),
  )

  routes(app)

  const port = 3000

  serve({
    fetch: app.fetch,
    port,
  })
})()
