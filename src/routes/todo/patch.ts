import { Context } from 'hono'
import { Low } from 'lowdb'

import { Database, Todo } from '../../types'
import { renderTodos } from '../../components/todo'
import html from '../../utils/html'

export default async (c: Context) => {
  const db = c.get('db') as Low<Database>
  const username = c.get('username')
  const id = c.req.param('id')
  const todo = db.data.todos[username].find(todo => todo.id === id) as Todo

  const todos = [
    ...db.data.todos[username].filter(todo => todo.id !== id),
    { ...todo, completed: todo.completed ? false : true },
  ]

  db.data.todos[username] = todos
  await db.write()
  c.status(200)

  return c.body(html`${renderTodos(todos)}`)
}
