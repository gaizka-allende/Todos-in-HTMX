import { Context } from 'hono'

import { renderTodos } from '../../fragments/todo'
import html from '../../utils/html'

export default async (c: Context) => {
  const id = c.req.param('id')

  const knex = c.get('knex')
  const todo = await knex('todos').where('id', id).first()
  await knex('todos').where('id', id).update({ completed: !todo.completed })

  c.status(200)

  const userTodos = await knex('todos')
    .where('user_id', todo.user_id)
    .orderBy('title')
  return c.body(html`${renderTodos(userTodos)}`)
}
