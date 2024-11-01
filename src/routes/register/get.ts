import { Context } from 'hono'

import document from '../../fragments/document'
import register from '../../screens/register'

export default async (c: Context) => {
  return c.html(document`${register``}`)
}
