import { Context } from 'hono'
import { z } from 'zod'
import { formatISO } from 'date-fns'

import { renderTodos } from '../../fragments/todo'
import html from '../../utils/html'
import knex from '../../utils/database'

function generateSchemaWithTranslations(c: Context) {
  const t = c.get('t')
  return z.object({
    id: z.string().min(1).optional(),
    title: z
      .string()
      .min(5, { message: t('Task must be at least 5 characters long') }),
    completed: z.boolean().optional(),
  })
}

export default async (c: Context) => {
  const username = c.get('username')
  const formData = await c.req.formData()
  const title = formData.get('title') as string

  const result = await generateSchemaWithTranslations(c).safeParseAsync({
    title,
  })

  if (!result.success) {
    return c.text(result.error.issues[0].message, 403)
  }

  if (!knex) {
    throw new Error('knex is not defined')
  }

  const userId = (await knex('logins').where('username', username).first()).id
  await knex('todos').insert({
    user_id: userId,
    title,
    completed: 0,
    created_modified: formatISO(new Date()),
  })
  const todos = await knex('todos').where('user_id', userId).orderBy('title')

  return c.body(html`${renderTodos.bind(c)(todos)}`)
}
