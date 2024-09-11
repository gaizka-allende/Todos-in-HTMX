export const renderLoginForm = () => /*html*/ `
  <form
    hx-post="/login"
    hx-target="#screen"
    hx-swap="innerHTML"
    class="mb-4 md:w-[300px]"
    hx-target-401="#invalid-username-or-password"
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
        _="
        -- on focusin debounced at 50ms
          -- remove .border-red-500 .text-red-500 from me
          -- remove @invalid from me
          -- add .hidden to #passport-too-short 
        -- end
        on keyup debounced at 50ms
          if event.target.value.length < 8
            log 'Password is too short'
            -- add .border-red-500 .text-red-500 to me
            -- add @invalid to me
            add @disabled to #submit
            remove .hidden from #passport-too-short 
          else
            log 'Password is at least 8 characters long'
            remove @disabled from #submit
          end
        "
      />
    </div>
    <div class="mt-6 mb-2 flex justify-end">
      <button
        id="submit"
        type="submit"
        class="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2 text-center disabled:cursor-not-allowed disabled:opacity-25"
        disabled
      >
        Submit
      </button>
    </div>
    <div id="validation-errors" class="text-red-500">
      <p id="invalid-username-or-password" class="text-sm" />
      <p id="passport-too-short"   class="text-sm hidden">
        Password must be at least 8 characters long
      </p>
    </div>
  </form>
`;
