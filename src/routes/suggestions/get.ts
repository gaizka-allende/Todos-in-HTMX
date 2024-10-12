import { Context } from 'hono'
import { Low } from 'lowdb'

import { Database } from '../../types'
import html from '../../utils/html'

export default async (c: Context) => {
  const title = c.req.query('title')?.toLocaleLowerCase() as string
  const db = c.get('db') as Low<Database>

  const suggestions = db.data.suggestions.filter(suggestion =>
    suggestion.includes(title),
  ) as string[]

  if (suggestions.length === 0) {
    return c.html('')
  }

  return c.html(html`
    <div
      id="suggestions"
      class="transition-display ease-in-out bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 mr-2
absolute w-[75%] opacity-90 p-2.5 "
    >
      <ul>
        ${suggestions
          .map(suggestion => {
            return html`<li
              class="text-base py-0.5 cursor-pointer border-b border-gray-300"
              _="on click 
                    put '${suggestion}' into value of .todoTitle
                    log 'clicked'
                  end"
            >
              <span>
                ${suggestion.slice(0, suggestion.indexOf(title))}<span
                  class="bg-yellow-300"
                  >${title}</span
                >${suggestion.slice(suggestion.indexOf(title) + title.length)}
              </span>
            </li>`
          })
          .join('')
          .toString()}
      </ul>
    </div>
  `)
}
