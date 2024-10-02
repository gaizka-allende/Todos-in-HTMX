import { Context } from 'hono'
import { Low } from 'lowdb'

import { Database } from '../../types'
import screen from '../../fragments/screen'
import { renderTodosContainer } from '../../fragments/todo'

export const response = (id: string) => `PUT /todo/${id}`

export default async (c: Context) => {
  const db = c.get('db') as Low<Database>
  const username = c.get('username') as string
  return c.html(screen`${renderTodosContainer(db.data.todos[username])}`)
}
