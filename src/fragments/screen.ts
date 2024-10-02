import html from '../utils/html'

export default function screen(
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
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://unpkg.com/htmx.org@1.9.12/dist/htmx.min.js"></script>
        <script src="https://unpkg.com/htmx.org@1.9.12/dist/ext/response-targets.js"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.12/dist/_hyperscript.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Todos</title>
      </head>
      <body>
        <div
          id="screen"
          class="mt-[50px] lg:mt-[100px] mb-0 mx-auto md:w-[450px]"
          hx-ext="response-targets"
        >
          ${out}
        </div>
      </body>
    </html>
  `
}
