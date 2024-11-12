import { Context } from 'hono'

import document from '../../fragments/document'
import login from '../../screens/login'

export default async (c: Context) => {
  return c.html(document.bind(c)`${login.bind(c)``}`)
}
