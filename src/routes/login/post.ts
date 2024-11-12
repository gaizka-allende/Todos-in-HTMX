import { Context } from 'hono'
import { z } from 'zod'
import { compareSync } from 'bcrypt'
import { setSignedCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'

import todos from '../../screens/todos'
import { renderTodos } from '../../fragments/todo'
import knex from '../../utils/database'

function generateSchemaWithTranslations(c: Context) {
  const t = c.get('t')
  return z.object({
    username: z
      .string({
        required_error: 'Username is required',
      })
      .regex(/^[A-Za-z0-9_-]+$/, {
        message: t('username_must_contain_only_letters_or_numbers'),
      })
      .min(6, { message: t('username_must_be_at_least_6_characters_long') })
      .max(20, { message: t('username_must_be_at_most_20_characters_long') }),
    password: z
      .string({
        required_error: t('password_is_required'),
      })
      .min(8, { message: t('password_must_be_at_least_8_characters_long') })
      .max(20, { message: t('password_must_be_at_most_20_characters_long') }),
  })
}

export default async (c: Context) => {
  const formData = await c.req.formData()
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const result = await generateSchemaWithTranslations(c).safeParseAsync({
    username,
    password,
  })

  if (!result.success) {
    return c.text(result.error.issues[0].message, 400)
  }

  if (!knex) {
    throw new Error('knex is not defined')
  }

  const user = await knex('logins').where('username', username).first()
  const t = c.get('t')

  if (!user || !compareSync(password, user.password)) {
    const res = new Response(t('invalid_username_or_password'), {
      status: 401,
      headers: {
        Authenticate: 'error="invalid_invalid_username_or_password"',
      },
    })

    throw new HTTPException(401, { res })
  }

  //'login successful'

  const expires = new Date(Date.now() + 1000 * 60 * 10)
  const secret = process.env.SECRET
  if (!secret) {
    throw new Error('SECRET is not set')
  }
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
  return c.body(todos.bind(c)`${renderTodos.bind(c)(userTodos)}`)
}
