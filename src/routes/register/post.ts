import { Context } from 'hono'
import { z } from 'zod'
import { hashSync } from 'bcrypt'
import { setSignedCookie } from 'hono/cookie'

import { renderTodos } from '../../fragments/todo'
import knex from '../../utils/database'
import todos from '../../screens/todos'

function generateSchemaWithTranslations(c: Context) {
  const t = c.get
  return z
    .object({
      username: z
        .string({
          required_error: 'Username is required',
        })
        .regex(/^[A-Za-z0-9_-]+$/, {
          message: 'Username must contain only letters or numbers',
        })
        .min(6, { message: t('username_must_be_at_least_6_characters_long') })
        .max(20, { message: t('username_must_be_at_most_20_characters_long') }),
      password: z
        .string({
          required_error: t('password_is_required'),
        })
        .min(8, { message: t('password_must_be_at_least_8_characters_long') })
        .max(20, { message: t('password_must_be_at_most_20_characters_long') }),
      reEnterPassword: z
        .string({
          required_error: t('re_enter_password_is_required'),
        })
        .min(8, { message: t('password_must_be_at_least_8_characters_long') })
        .max(20, { message: t('password_must_be_at_most_20_characters_long') }),
    })
    .superRefine(({ password, reEnterPassword }, ctx) => {
      if (password !== reEnterPassword) {
        ctx.addIssue({
          code: 'custom',
          message: t('the_passwords_did_not_match'),
          path: ['reEnterPassword'],
        })
      }
    })
}

export default async (c: Context) => {
  const formData = await c.req.formData()
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  const result = await generateSchemaWithTranslations(c).safeParseAsync({
    username,
    password,
    reEnterPassword: formData.get('reEnterPassword'),
  })

  if (!result.success) {
    return c.text(result.error.issues[0].message, 400)
  }

  if (!knex) {
    throw new Error('knex is not defined')
  }

  const user = await knex('logins').where('username', username).first()

  const t = c.get('t')

  if (user) {
    return c.text(t('user_already_exists'), 409)
  }

  const hash = hashSync(password, 10)
  await knex('logins').insert({ username, password: hash })

  //register successful

  const secret = process.env.SECRET
  if (!secret) {
    throw new Error('SECRET environment variable is required')
  }
  const expires = new Date(Date.now() + 1000 * 60 * 10)
  await setSignedCookie(c, 'session', `${username},${Date.now()}`, secret, {
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
