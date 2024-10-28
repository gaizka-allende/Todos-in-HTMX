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
      _="on keydown 
       if event.key == 'Enter'
          -- prevent the default form submission and trigger the put request
          event.preventDefault()
          trigger change 
        "
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

export const renderTodos = (todos: Array<Todo>) =>
  html` <div id="todos">
    <ul>
      ${todos
        .filter(({ completed }) => completed === 0)
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
            .filter(({ completed }) => completed === 1)
            .length.toString()})
        </span>
      </summary>

      <article class="px-4 pb-4">
        <ul id="todos-done">
          ${todos
            .filter(({ completed }) => completed === 1)
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
