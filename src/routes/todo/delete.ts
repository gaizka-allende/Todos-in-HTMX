import { Context } from 'hono'

import { renderTodos } from '../../fragments/todo'
import knex from '../../utils/database'
import html from '../../utils/html'

export default async (c: Context) => {
  const id = c.req.param('id')
  const username = c.get('username')

  if (!knex) {
    throw new Error('knex is not defined')
  }

  await knex('todos').where('id', id).delete()

  c.status(200)

  const userId = (await knex('logins').where('username', username).first()).id
  const todos = await knex('todos').where('user_id', userId).orderBy('title')
  return c.body(html`${renderTodos.bind(c)(todos)}`)
}
