import { Context } from 'hono'
import { deleteCookie } from 'hono/cookie'

export default async (c: Context) => {
  deleteCookie(c, 'session')
  return c.redirect('/login')
}
