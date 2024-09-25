import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

import { ContextConstants } from '../types'
import put from './todo/put'
import deleteHandler from './todo/delete'
import patch from './todo/patch'
import get from './todos/get'
import post from './todo/post'
import loginGet from './login/get'
import postLogin from './login/post'

const schema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
    })
    .regex(/^[a-z0-9]+$/, {
      message: 'Username must contain only letters or numbers',
    })
    .min(6, { message: 'Username must be at least 6 characters long' })
    .max(20, { message: 'Username must be at most 20 characters long' }),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(20, { message: 'Password must be at most 20 characters long' }),
})

export const routes = (app: Hono<{ Variables: ContextConstants }>) => {
  app.get('/login', loginGet)
  app.post(
    '/login',
    zValidator('form', schema, (result, c) => {
      if (!result.success) {
        return c.text(result.error.issues[0].message, 400)
      }
      return
    }),
    postLogin,
  )
  app.get('/todos', get)
  app.put('/todo/:id', put)
  app.delete('/todo/:id', deleteHandler)
  app.patch('/todo/:id', patch)
  app.post(
    '/todo',
    //zValidator(
    //"form",
    //z.object({
    //title: z.string().min(1),
    //})
    //),
    post,
  )
}
