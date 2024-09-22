import { Context } from 'hono'
import { Low } from 'lowdb'

import { Database } from '../../types'
import { renderTodos } from '../../components/todo'

export const response = (id: string) => `PUT /todo/${id}`

export default async (c: Context) => {
  const db = c.get('db') as Low<Database>
  const username = c.get('username')
  const formData = await c.req.formData()
  const title = formData.get('title') as string
  const id = crypto.randomUUID()
  db.data.todos[username].push({
    id,
    title,
    completed: false,
  })
  await db.write()

  return c.body(/*html*/ `${renderTodos(db.data.todos[username])}`)
}
