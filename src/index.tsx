import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { JSONFilePreset } from "lowdb/node";

import { renderer, AddTodo, Item } from "./components";

(async () => {
  const app = new Hono();
  app.use(logger());

  const db = await JSONFilePreset("db.json", { todos: [] });

  app.get("*", renderer);

  app.get("/", async (c) => {
    //return c.text("Hello Hono!");
    //const messages = ["Good Mornings", "Good Evening", "Good Night"];
    //return c.html(<Top messages={messages} />);
    //return c.render(<Top messages={messages} />);

    //const { results } = await c.env.DB.prepare(`SELECT id, title FROM todo;`).all<Todo>()

    //const todos = results
    return c.render(
      <div>
        <AddTodo />
        {db.data.todos.map((todo) => {
          return <Item title={todo.title} id={todo.id} />;
        })}
        <div id="todo"></div>
      </div>
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
      //const id = crypto.randomUUID();
      //await c.env.DB.prepare(`INSERT INTO todo(id, title) VALUES(?, ?);`)
      //.bind(id, title)
      //.run();
      const lastId = Number(db.data.todos.slice(-1)[0].id);
      db.data.todos.push({
        id: lastId + 1,
        title,
        completed: false,
      });
      await db.write();
      return c.html(<Item title={title} id={lastId} />);
    }
  );

  app.delete("/todo/:id", async (c) => {
    const id = c.req.param("id");
    //await c.env.DB.prepare(`DELETE FROM todo WHERE id = ?;`).bind(id).run();
    //console.log(db.data.todos.filter((todo) => todo.id !== Number(id)));
    //await db.update(({ todos }) => {
    //console.log(todos.filter((todo) => todo.id !== Number(id)));
    //return todos.filter((todo) => todo.id !== Number(id));
    //});
    db.data.todos = db.data.todos.filter((todo) => todo.id !== Number(id));
    await db.write();

    c.status(200);
    return c.body(null);
  });

  const port = 3000;
  console.log(`Server is running on port ${port}`);

  serve({
    fetch: app.fetch,
    port,
  });
})();
