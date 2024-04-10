import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { JSONFilePreset } from "lowdb/node";

import { renderer, AddTodo, Item } from "./components";
import { timer } from "./utils";

(async () => {
  const app = new Hono();
  app.use(logger());

  const db = await JSONFilePreset("db.json", { todos: [] });

  app.get("*", renderer);

  app.get("/", async (c) => {
    //console.log(db.data.todos.filter(({ completed }) => completed === true));
    return c.render(
      <>
        <div id="done">
          {db.data.todos.filter(({ completed }) => completed === true).length}{" "}
          done
        </div>
        <AddTodo />
        <div id="todos">
          {db.data.todos.map((todo) => {
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
  });

  app.post(
    "/todo",
    //zValidator(
    //"form",
    //z.object({
    //title: z.string().min(1),
    //})
    //),
    async (c) => {
      //const json = await c.req.json();
      //console.log(json);
      //console.log(c.req.parseBody());
      const formData = await c.req.formData();
      const title = formData.get("title");
      //const { title } = c.req.valid("form");
      //console.log(title);
      const id = crypto.randomUUID();
      db.data.todos.push({
        id,
        title,
        completed: false,
      });
      await db.write();
      await timer(5);
      return c.html(
        <>
          <div id="done" hx-swap-oob="true">
            {db.data.todos.filter(({ completed }) => completed === true).length}{" "}
            done
          </div>
          <Item title={title} id={id} checked={false} />
        </>
      );
    }
  );

  app.delete("/todo/:id", async (c) => {
    const id = c.req.param("id");
    db.data.todos = db.data.todos.filter((todo) => todo.id !== id);
    await db.write();

    c.status(200);
    return c.body(
      <>
        <div id="done" hx-swap-oob="true">
          {db.data.todos.filter(({ completed }) => completed === true).length}{" "}
          done
        </div>
      </>
    );
  });

  app.patch("/todo/:id", async (c) => {
    const id = c.req.param("id");
    const formData = await c.req.formData();
    //console.log(formData);
    const checkbox = formData.get("checkbox");
    const title = formData.get("title");
    //console.log(id, title, checkbox);
    const todo = db.data.todos.find((todo) => todo.id === id);

    db.data.todos = [
      ...db.data.todos.filter((todo) => todo.id !== id),
      { ...todo, title, completed: checkbox === "on" },
    ];
    await db.write();
    c.status(200);
    return c.body(
      <>
        <div id="done" hx-swap-oob="true">
          {db.data.todos.filter(({ completed }) => completed === true).length}{" "}
          done
        </div>
        <Item title={title} id={id} checked={checkbox === "on"} />
      </>
    );
  });

  const port = 3000;
  console.log(`Server is running on port ${port}`);

  serve({
    fetch: app.fetch,
    port,
  });
})();
