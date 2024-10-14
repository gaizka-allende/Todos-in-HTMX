import { Low } from 'lowdb'

export type Database = {
  todos: { [username: string]: Array<Todo> }
  suggestions: Array<string>
}
export interface Todo {
  id: string
  title: string
  completed: boolean
}

export interface Login {
  username: string
  password: string
}

export type ContextConstants = {
  db: Low<Database>
  username: string
}
