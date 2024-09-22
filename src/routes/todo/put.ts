import { Context } from 'hono'
import { Low } from 'lowdb'

import { Database, Todo } from '../../types'

export const response = (id: string) => `PUT /todo/${id}`

export default async (c: Context) => {
  const db = c.get('db') as Low<Database>
  const username = c.get('username')
  const id = c.req.param('id')
  const todo = db.data.todos[username].find(todo => todo.id === id) as Todo
  const formData = await c.req.formData()
  const title = formData.get(id) as string

  const todos = [
    ...db.data.todos[username].filter(todo => todo.id !== id),
    { ...todo, title },
  ]

  db.data.todos[username] = todos
  await db.write()
  c.status(200)

  return new Response(response(id))
}
