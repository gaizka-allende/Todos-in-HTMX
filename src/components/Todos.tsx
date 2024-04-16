export const Item = ({
  title,
  id,
  checked = false,
}: {
  title: string;
  id: string;
  checked: boolean;
}) => {
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

const AddTodo = () => (
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

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export const Todos = ({ todos }: { todos: Array<Todo> }) => (
  <>
    <h1 class="text-4xl font-bold mb-4">
      <a href="/">Todo</a>
    </h1>
    <div id="done">
      {todos.filter(({ completed }) => completed === true).length} done
    </div>
    <AddTodo />
    <div id="todos">
      {todos.map((todo) => {
        return (
          <Item title={todo.title} id={todo.id} checked={todo.completed} />
        );
      })}
    </div>
    <div
      id="adding-item"
      role="status"
      class="transition-[display] ease-in hidden max-w-sm animate-pulse h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"
    ></div>
  </>
);
