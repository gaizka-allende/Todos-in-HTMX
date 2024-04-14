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

export const AddTodo = () => (
  <form
    hx-post="/todo"
    hx-target="#todos"
    hx-swap="beforeend"
    _="on htmx:afterRequest reset() me"
    class="mb-4"
    hx-indicator="#adding-item"
  >
    <div class="mb-2 flex">
      <input
        name="title"
        type="text"
        class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5 mr-2"
      />
      <button
        class="text-white bg-blue-700 hover:bg-blue-800 rounded-lg px-5 py-2 text-center"
        type="submit"
      >
        Submit
      </button>
    </div>
  </form>
);

export const Item = ({
  title,
  id,
  checked = false,
}: {
  title: string;
  id: string;
  checked: boolean;
}) => {
  //console.log({
  //title,
  //id,
  //checked,
  //});
  return (
    <form>
      <div class="item flex row items-center mb-2">
        <input
          type="checkbox"
          class="mr-2"
          id="checked"
          name="checkbox"
          hx-patch={`/todo/${id}`}
          checked={checked}
        />
        <input
          id={id}
          class="font-medium py-1 px-4 my-1 rounded-lg text-lg border bg-gray-100 text-gray-600 mr-2"
          value={title}
          hx-put={`/todo/${id}`}
          name="title"
          disabled={checked}
        />
        {!checked && (
          <button
            class="font-medium "
            hx-delete={`/todo/${id}`}
            hx-swap="outerHTML"
            hx-target="closest div"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
};
