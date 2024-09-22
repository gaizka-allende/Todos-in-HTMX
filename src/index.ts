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
          console.log('invalid username')
          throw new HTTPException(401, { message: 'Invalid user session' })
        }

        const sessionDate = new Date(parseInt(sessionDateTimestamp))
        if (isBefore(add(sessionDate, { minutes: 5 }), new Date())) {
          // session expires after 5 minutes
          // redirect to login screen
          console.log('session expired')
          if (c.req.path !== '/login') {
            return c.redirect('/login')
          }

          await next()
          return
        }
        console.log('session is valid (not expired)')
        c.set('username', username)
        if (c.req.path === '/' || c.req.path === '/login') {
          console.log(
            'session is valid so redirect to todos if user tries to access login page',
          )
          //c.res.headers.set("HX-Redirect", "/todos");
          //const username = c.get("username");
          return c.redirect('/todos')
        }
        await next()
        return
      }
      console.log('no session cookie')
      //if (c.req.path === "/" || c.req.path === "/login") {
      if (c.req.path === '/login') {
        await next()
        return
      }
      //await next();
      return c.redirect('/login')
    }),
  )

  routes(app)

  const port = 3000
  console.log(`Server is running on port ${port}`)

  serve({
    fetch: app.fetch,
    port,
  })
})()
