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
import registerGet from './register/get'
import registerPost from './register/post'
import { validator as registerValidator } from './register/post'
import logoutGet from './logout/get'
import suggestionsGet from './suggestions/get'

export const routes = (app: Hono<{ Variables: ContextConstants }>) => {
  app.get('/login', loginGet)
  app.post('/login', loginValidator, postLogin)
  app.get('/register', registerGet)
  app.post('/register', registerValidator, registerPost)
  app.get('/todos', get)
  app.put('/todo/:id', put)
  app.delete('/todo/:id', deleteHandler)
  app.patch('/todo/:id', patch)
  app.post('/todo', postValidator, post)
  app.get('/logout', logoutGet)
  app.get('/suggestions', suggestionsGet)
}
