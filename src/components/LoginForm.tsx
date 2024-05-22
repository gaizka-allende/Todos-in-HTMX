export const LoginForm = () => (
  <form
    hx-post="/login"
    hx-target="#screen"
    hx-swap="innerHTML"
    class="mb-4"
    hx-target-401="#invalid-username-or-password"
  >
    <div class="mb-2">
      <label for="username" class="md:mr-2">
        Username
      </label>
      <input
        type="text"
        name="username"
        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5"
      />
    </div>
    <div class="mb-2">
      <label for="password" class="md:mr-2">
        Password
      </label>
      <input
        type="password"
        name="password"
        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5"
      />
    </div>
    <div class="mb-2">
      <button
        type="submit"
        class="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2 text-center"
      >
        Submit
      </button>
    </div>
    <div id="invalid-username-or-password" class="text-red-500" />
  </form>
);
