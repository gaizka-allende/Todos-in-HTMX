import { Context } from 'hono'

import document from '../../fragments/document'
import todos from '../../screens/todos'
import { renderTodos } from '../../fragments/todo'
import knex from '../../utils/database'

export default async (c: Context) => {
  const username = c.get('username') as string
  if (!knex) {
    throw new Error('knex is not defined')
  }
  const userId = (await knex('logins').where('username', username).first()).id
  const userTodos = await knex('todos')
    .where({ user_id: userId })
    .orderBy('title')
  return c.html(
    document.bind(c)`${todos.bind(c)`${renderTodos.bind(c)(userTodos)}`}`,
  )
}
