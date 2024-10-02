import { Context } from 'hono'

import login from '../../screens/login'

export default async (c: Context) => {
  return c.html(login``)
}
