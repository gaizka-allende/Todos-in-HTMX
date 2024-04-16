import { html } from "hono/html";
import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children }) => {
  return html`
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://unpkg.com/htmx.org@1.9.3"></script>
        <script src="https://unpkg.com/hyperscript.org@0.9.9"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <title>Hono + htmx</title>
        <style>
          #adding-item.htmx-request {
            display: flex;
          }
        </style>
      </head>
      <body>
        <div
          id="screen"
          class="mt-[50px] lg:mt-[100px] mb-0 mx-auto md:w-[450px]"
        >
          ${children}
        </div>
      </body>
    </html>
  `;
});
