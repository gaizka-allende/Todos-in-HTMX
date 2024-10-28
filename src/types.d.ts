export interface Todo {
  id: string
  title: string
  completed: 0 | 1
}

export interface Login {
  username: string
  password: string
}

export type ContextConstants = {
  username: string
  knex: any
  secret: string
}
