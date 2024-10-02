import html from '../utils/html'

import { Todo } from '../types'

export const renderTodo = ({ title, id, completed }: Todo) => html`
  <div class="item flex row items-center mb-2">
    <input
      role="checkbox"
      type="checkbox"
      class="mr-2"
      name="checkbox"
      hx-patch="/todo/${id}"
      hx-target="#todos"
      ${completed ? 'checked' : ''}
    />
    <input
      role="textbox"
      id="${id}"
      class="font-medium py-1 px-4 my-1 rounded-lg text-lg border bg-gray-100 text-gray-600 mr-2"
      value="${title}"
      hx-put="/todo/${id}"
      name="${id}"
      ${completed ? 'disabled' : ''}
    />
    ${!completed
      ? html`<button
          class="font-medium"
          hx-delete="/todo/${id}"
          hx-target="#todos"
        >
          Delete
        </button>`
      : ''}
  </div>
`

export const renderTodosDone = (done: number) =>
  html` <span id="done"> Completed (${done.toString()}) </span>`

export const renderTodosContainer = (todos: Array<Todo>) => html`
  <h1 class="text-4xl font-bold mb-4">
    <a href="/">Todo</a>
  </h1>
  <form
    hx-post="/todo"
    hx-target="#todos"
    class="mb-4"
    hx-target-403="#error-add-todo"
  >
    <div class="mb-2 flex">
      <input
        name="title"
        type="text"
        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 mr-2"
        data-testid="add-todo"
      />
      <button
        class="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2 text-center"
        type="submit"
      >
        Add
      </button>
    </div>
    <div id="error-add-todo" class="text-red-500 text-sm"></div>
    ${renderTodos(todos)}
  </form>
`

export const renderTodos = (todos: Array<Todo>) =>
  html` <div id="todos">
    <ul>
      ${todos
        .filter(({ completed }) => completed === false)
        .map(({ title, id, completed }) => {
          return html`<li>
            ${renderTodo({
              title: title,
              id: id,
              completed: completed,
            })}
          </li>`
        })
        .join('')}
    </ul>
    <details class="group" data-testid="show-completed">
      <summary
        class="flex items-center gap-3 font-medium marker:content-none hover:cursor-pointer"
      >
        <svg
          class="w-5 h-5 text-gray-500 transition group-open:rotate-90"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
          ></path>
        </svg>
        <span id="done">
          Completed
          (${todos
            .filter(({ completed }) => completed === true)
            .length.toString()})
        </span>
      </summary>

      <article class="px-4 pb-4">
        <ul id="todos-done">
          ${todos
            .filter(({ completed }) => completed === true)
            .map(({ title, id, completed }) => {
              return html`<li>
                ${renderTodo({
                  title: title,
                  id: id,
                  completed: completed,
                })}
              </li>`
            })
            .join('')}
        </ul>
      </article>
    </details>
  </div>`
