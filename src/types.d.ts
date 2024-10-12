import { Low } from 'lowdb'

export type Database = {
  todos: { [username: string]: Array<Todo> }
  logins: Array<Login>
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
  realm?: string | undefined
  hashFunction?: Function | undefined
}

export type ContextConstants = {
  db: Low<Database>
  username: string
}
