import { Hono } from 'hono'

import { ContextConstants } from '../types'
import put from './todo/put'
import deleteHandler from './todo/delete'
import patch from './todo/patch'
import get from './todos/get'
import post from './todo/post'
import { validator as postValidator } from './todo/post'
import loginGet from './login/get'
import postLogin from './login/post'
import { validatior as loginValidator } from './login/post'

export const routes = (app: Hono<{ Variables: ContextConstants }>) => {
  app.get('/login', loginGet)
  app.post('/login', loginValidator, postLogin)
  app.get('/todos', get)
  app.put('/todo/:id', put)
  app.delete('/todo/:id', deleteHandler)
  app.patch('/todo/:id', patch)
  app.post('/todo', postValidator, post)
}
