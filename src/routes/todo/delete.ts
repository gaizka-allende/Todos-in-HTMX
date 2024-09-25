import { Context } from 'hono'
import { Low } from 'lowdb'

import { Database } from '../../types'
import { renderTodos } from '../../components/todo'
import html from '../../utils/html'

export const response = (id: string) => `PUT /todo/${id}`

export default async (c: Context) => {
  const db = c.get('db') as Low<Database>
  const id = c.req.param('id')
  const username = c.get('username')
  db.data.todos[username] = db.data.todos[username].filter(
    todo => todo.id !== id,
  )
  await db.write()

  c.status(200)

  return c.body(html`${renderTodos(db.data.todos[username])}`)
}
