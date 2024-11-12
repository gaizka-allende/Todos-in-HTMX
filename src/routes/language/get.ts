import { Context } from 'hono'

export default async (c: Context) => {
  const currentURL = c.req.header('Hx-Current-Url')
  if (currentURL === undefined) {
    throw new Error('Hx-Current-Url header is required')
  }
  const currentPath = new URL(currentURL).pathname

  return c.redirect(currentPath)
}
