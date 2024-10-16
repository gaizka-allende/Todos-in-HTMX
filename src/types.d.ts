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
  username: string
  knex: any
  secret: string
}
