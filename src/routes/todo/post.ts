import { Context } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { renderTodos } from '../../fragments/todo'
import html from '../../utils/html'

const schema = z.object({
  id: z.string().min(1).optional(),
  title: z
    .string()
    .min(5, { message: 'Task must be at least 5 characters long' }),
  completed: z.boolean().optional(),
})

export const validator = zValidator('form', schema, (result, c) => {
  if (!result.success) {
    return c.text(result.error.issues[0].message, 403)
  }
  return
})

export default async (c: Context) => {
  const username = c.get('username')
  const formData = await c.req.formData()
  const title = formData.get('title') as string

  const knex = c.get('knex')
  const userId = (await knex('logins').where('username', username).first()).id
  await knex('todos').insert({
    user_id: userId,
    title,
    completed: false,
  })
  const todos = await knex('todos').where('user_id', userId).orderBy('title')

  return c.body(html`${renderTodos(todos)}`)
}
