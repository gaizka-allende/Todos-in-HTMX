import { Context } from 'hono'

import register from '../../screens/register'

export default async (c: Context) => {
  return c.html(register``)
}
