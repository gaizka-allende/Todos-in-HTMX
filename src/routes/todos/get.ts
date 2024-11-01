import { Context } from 'hono'

import document from '../../fragments/document'
import todos from '../../screens/todos'
import { renderTodos } from '../../fragments/todo'

export default async (c: Context) => {
  const username = c.get('username') as string
  const knex = c.get('knex')
  const userId = (await knex('logins').where('username', username).first()).id
  const userTodos = await knex('todos')
    .where({ user_id: userId })
    .orderBy('title')
  return c.html(document`${todos`${renderTodos(userTodos)}`}`)
}
