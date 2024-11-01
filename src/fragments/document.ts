import html from '../utils/html'

export default function document(
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
  return html`
    <!doctype html>
    <html
      _="on load 
        if localStorage.theme is not empty
          -- set @class to localStorage.theme
          if localStorage.theme equals 'dark'
            set @class to 'dark'
          else if localStorage.theme equals 'light'
            set @class to 'light'
          else if localStorage.theme equals 'system'
            if window.matchMedia('(prefers-color-scheme: dark)').matches
              set @class to 'dark'
            end
          end
        else if window.matchMedia('(prefers-color-scheme: dark)').matches
          set @class to 'dark'
        end
      end
    "
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://unpkg.com/htmx.org@1.9.12/dist/htmx.min.js"></script>
        <script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/response-targets.js"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12/dist/_hyperscript.min.js"></script>
        <title>Todos</title>
        <link href="/static/index.css" rel="stylesheet" />
      </head>
      <body class="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">
        <header class="flex justify-end m-2">
          <div>
            <label for="theme">Select a theme:</label>
            <select
              name="theme"
              id="theme"
              _="on load 
                if localStorage.theme is not empty
                  add @selected to <option/> when its value equals localStorage.theme
                else if window.matchMedia('(prefers-color-scheme: dark)').matches
                  add @selected to <option/> when its value equals 'system'
                end
            end
            on change 
              log event.target.value
              if event.target.value equals 'dark' 
                set @class of document.documentElement to 'dark' 
              else if event.target.value equals 'light'  
                set @class of document.documentElement to 'light'
              else if event.target.value equals 'system'  
                if window.matchMedia('(prefers-color-scheme: dark)').matches
                  set @class of document.documentElement to 'dark' 
                else 
                  set @class of document.documentElement to 'light' 
                end
              end
              set localStorage.theme to event.target.value
            end
            "
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </header>
        <main>${out}</main>
      </body>
    </html>
  `
}
