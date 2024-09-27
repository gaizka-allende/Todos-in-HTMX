import { Context } from 'hono'
import { Low } from 'lowdb'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { Database } from '../../types'
import { renderTodos } from '../../components/todo'
import html from '../../utils/html'

const schema = z.object({
  id: z.string().min(1).optional(),
  title: z
    .string()
    .min(5, { message: 'Task must be at least 5 characters long' }),
  completed: z.boolean().optional(),
})

export const validator = zValidator('form', schema, (result, c) => {
  if (!result.success) {
    return c.text(result.error.issues[0].message, 403)
  }
  return
})

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

  return c.body(html`${renderTodos(db.data.todos[username])}`)
}
