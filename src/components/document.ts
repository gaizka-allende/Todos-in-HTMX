import html from '../utils/html'

export const renderHTMLDocument = (children: string) => html`
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
        ${children}
      </div>
    </body>
  </html>
`
