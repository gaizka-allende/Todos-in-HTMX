import { Context } from 'hono'

import screen from '../fragments/screen'

export default function register(this: Context, _1?: any, _2?: any) {
  const t = this.get('t')

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
        <label for="username" class="md:mr-2">${t('username')}</label>
        <input
          type="text"
          id="username"
          name="username"
          class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5"
          required
        />
      </div>
      <div class="mb-2 flex items-center justify-between">
        <label for="password" class="md:mr-2">${t('password')}</label>
        <input
          type="password"
          id="password"
          name="password"
          class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5"
          required
        />
      </div>
      <div class="mb-2 flex items-center justify-between">
        <label for="password" class="md:mr-2">${t('re_enter_password')}</label>
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
          ${t('register')} 
        </button>
      </div>
      <div id="error" class="text-red-500 text-sm"></div>
    </form>
  `
}
