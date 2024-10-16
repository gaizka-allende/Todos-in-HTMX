import { Context } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { setSignedCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'

import todos from '../../screens/todos'
import { renderTodos } from '../../fragments/todo'

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
  const formData = await c.req.formData()
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const knex = c.get('knex')
  const user = await knex('logins').where('username', username).first()

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

  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
  const secret = c.get('secret')
  await setSignedCookie(c, 'session', `${username},${expires}`, secret, {
    path: '/',
    secure: true,
    httpOnly: true,
    maxAge: 1000,
    expires,
    sameSite: 'Strict',
  })

  c.res.headers.set('HX-Redirect', '/todos')
  const userTodos = await knex('todos').where('user_id', user.id)
  return c.body(todos`${renderTodos(userTodos)}`)
}
