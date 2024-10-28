import { Context } from 'hono'

import todos from '../../screens/todos'
import { renderTodos } from '../../fragments/todo'

export default async (c: Context) => {
  const username = c.get('username') as string
  const knex = c.get('knex')
  console.log('username', username)
  const user = await knex('logins').where('username', username).first()
  console.log(user)
  const userId = (await knex('logins').where('username', username).first()).id
  console.log('userId', userId)
  const userTodos = await knex('todos')
    .where({ user_id: userId })
    .orderBy('title')
  console.log('userTodos', userTodos)
  console.log('userTodos', userTodos)
  return c.html(todos`${renderTodos(userTodos)}`)
}
