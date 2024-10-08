import screen from '../fragments/screen'

export default function register(
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
    <form
      hx-post="/register"
      hx-target="#screen"
      hx-swap="innerHTML"
      class="mb-4 md:w-[350px]"
      hx-target-400="#error"
      hx-target-401="#error"
      hx-target-409="#error"
      hx-disabled-elt="input[type='text'], button"
    >
      <div class="mb-2 flex items-center justify-between">
        <label for="username" class="md:mr-2"> Username </label>
        <input
          type="text"
          id="username"
          name="username"
          class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5"
          required
        />
      </div>
      <div class="mb-2 flex items-center justify-between">
        <label for="password" class="md:mr-2"> Password </label>
        <input
          type="password"
          id="password"
          name="password"
          class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5"
          required
        />
      </div>
      <div class="mb-2 flex items-center justify-between">
        <label for="password" class="md:mr-2"> Re-enter password </label>
        <input
          type="password"
          id="reEnterPassword"
          name="reEnterPassword"
          class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5"
          required
        />
      </div>
      <div class="mt-6 mb-2 flex justify-end">
        <button
          id="submit"
          type="submit"
          class="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2 text-center disabled:cursor-not-allowed disabled:opacity-25"
        >
          Submit
        </button>
      </div>
      <div id="error" class="text-red-500 text-sm"></div>
    </form>
  `
}
