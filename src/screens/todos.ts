import screen from '../fragments/screen'

export default function todos(
  strings: TemplateStringsArray,
  ...values: string[]
) {
  let out = ''
  strings.forEach((string, i) => {
    const value = values[i]

    // Array - Join to string and output with value
    if (Array.isArray(value)) {
      out += string + value.join('')
    }
    // String - Output with value
    else if (typeof value === 'string') {
      out += string + value
    }
    // Number - Coerce to string and output with value
    // This would happen anyway, but for clarity's sake on what's happening here
    else if (typeof value === 'number') {
      out += string + String(value)
    }
    // object, undefined, null, boolean - Don't output a value.
    else {
      out += string
    }
  })
  return screen`
    <h1 class="text-4xl font-bold mb-4">
      <a href="/">Todo</a>
    </h1>
    <form
      hx-post="/todo"
      hx-target="#todos"
      class="mb-4"
      hx-target-403="#error-add-todo"
      hx-on::before-request="document.querySelector('#title').value=''"
    >
      <div class="mb-2 flex">
        <input
          _="on keyup 
              debounced at 1000ms
              if event.target.value.length < 3
                remove #suggestions
                exit
              end
              fetch ${'`/suggestions?title=${event.target.value}`'}
              put result after #error-add-todo 
             end"
          value=""
          id="title"
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
      ${out}
    </form>
  `
}
