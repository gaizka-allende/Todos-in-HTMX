export type Database = {
  todos: { [username: string]: Array<Todo> };
  logins: Array<Login>;
};
export interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export interface Login {
  username: string;
  password: string;
  realm?: string | undefined;
  hashFunction?: Function | undefined;
}

export type RequestVariables = {
  username: string;
};
