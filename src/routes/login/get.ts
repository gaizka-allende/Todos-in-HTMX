import { Context } from 'hono'

import screen from '../../components/document'
import { renderLoginForm } from '../../components/login'

export const response = (id: string) => `PUT /todo/${id}`

export default async (c: Context) => {
  return c.html(screen`${renderLoginForm()}`)
}
