import { Context } from 'hono'
import { Low } from 'lowdb'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { setSignedCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'

import { Database } from '../../types'
import { renderHTMLDocument } from '../../components/document'
import { renderTodosContainer } from '../../components/todo'
import { secret } from '../../utils/utils'

const schema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
    })
    .regex(/^[A-Za-z0-9_-]+$/, {
      message: 'Username must contain only letters or numbers',
    })
    .min(6, { message: 'Username must be at least 6 characters long' })
    .max(20, { message: 'Username must be at most 20 characters long' }),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(20, { message: 'Password must be at most 20 characters long' }),
})

export const validatior = zValidator('form', schema, (result, c) => {
  if (!result.success) {
    return c.text(result.error.issues[0].message, 400)
  }
  return
})

export default async (c: Context) => {
  const db = c.get('db') as Low<Database>
  const formData = await c.req.formData()
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const user = db.data.logins.find(login => login.username === username)

  if (!user || user.password !== password) {
    const res = new Response('Invalid username or password', {
      status: 401,
      headers: {
        Authenticate: 'error="invalid_invalid_username_or_password"',
      },
    })

    throw new HTTPException(401, { res })
  }

  //'login successful'

  await setSignedCookie(c, 'session', `${username},${Date.now()}`, secret, {
    path: '/',
    secure: true,
    httpOnly: true,
    maxAge: 1000,
    expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
    sameSite: 'Strict',
  })

  if (!db.data.todos[username]) db.data.todos[username] = []
  c.res.headers.set('HX-Redirect', '/todos')
  return c.html(
    renderHTMLDocument(renderTodosContainer(db.data.todos[username])),
  )
}
