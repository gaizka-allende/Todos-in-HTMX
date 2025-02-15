import { Context } from 'hono'
import { formatISO } from 'date-fns'

import { renderTodos } from '../../fragments/todo'
import html from '../../utils/html'
import knex from '../../utils/database'

export const response = (id: string) => `PUT /todo/${id}`

export default async (c: Context) => {
  const id = c.req.param('id')
  const formData = await c.req.formData()
  const title = formData.get(id) as string

  if (!knex) {
    throw new Error('knex is not defined')
  }

  const todo = await knex('todos').where('id', id).first()
  await knex('todos')
    .where('id', id)
    .update({
      title,
      created_modified: formatISO(new Date()),
    })
  c.status(200)

  const userTodos = await knex('todos')
    .where('user_id', todo.user_id)
    .orderBy('title')
  return c.body(html`${renderTodos.bind(c)(userTodos)}`)
}
