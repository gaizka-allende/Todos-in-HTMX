import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { logger } from "hono/logger";
import { createMiddleware } from "hono/factory";
import { JSONFilePreset } from "lowdb/node";
import { HTTPException } from "hono/http-exception";

import { renderer, AddTodo, Item } from "./components";
import { timer } from "./utils";
import { LoginForm } from "./components/LoginForm";
import { setSignedCookie, getSignedCookie } from "hono/cookie";

const secret = "secret ingredient";

const Auth = createMiddleware(async (c, next) => {
  const session = await getSignedCookie(c, secret, "session");
  if (session) {
    const sessionDate = new Date(parseInt(session));
  } else {
    if (c.req.method === "GET") {
      if (c.req.path !== "/") {
        return c.redirect("/");
      }
    } else {
      if (c.req.path !== "/login") {
        const res = new Response("Unauthorized", {
          status: 401,
          headers: {
            //...
          },
        });
        throw new HTTPException(400, { res });
      }
    }
  }
  await next();
});

type Login = {
  username: string;
  password: string;
  realm?: string | undefined;
  hashFunction?: Function | undefined;
};

(async () => {
  const app = new Hono();

  const db = await JSONFilePreset("db.json", {
    todos: [],
    logins: Array<Login>,
  });
  app.use(logger());

  //console.log(db.data.logins);
  //app.use("*", basicAuth(...db.data.logins));
  app.use("*", Auth);

  //app.get(
  //"/",
  //basicAuth((username, password, c) => {
  //console.log(username, password);
  //const user = db.data.logins.find((user) => user.username === username);
  //if (!user) return false;
  //return user.password === password;
  //})
  //);

  app.get("*", renderer);

  app.get("/", async (c) => {
    return c.render(<LoginForm />);
  });

  app.get("/todos", async (c) => {
    return c.render(
      <>
        <h1 class="text-4xl font-bold mb-4">
          <a href="/">Todo</a>
        </h1>
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
    "/login",
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
      const username = formData.get("username");
      const password = formData.get("password");
      //console.log(username, password);

      const user = db.data.logins.find((login) => login.username === username);
      //console.log(user);
      if (!user) return c.redirect("/");

      //setCookie(c, "delicious_cookie", "macha");
      // Signed cookies
      await setSignedCookie(c, "session", `${Date.now()}`, secret, {
        path: "/",
        secure: true,
        //domain: "example.com",
        httpOnly: true,
        maxAge: 1000,
        expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
        sameSite: "Strict",
      });

      return c.redirect("/todos");

      //const { title } = c.req.valid("form");
      //console.log(title);
      //const id = crypto.randomUUID();
      //db.data.todos.push({
      //id,
      //title,
      //completed: false,
      //});
      //await db.write();
      //await timer(5);
      //return c.html(
      //<>
      //<div id="done" hx-swap-oob="true">
      //{db.data.todos.filter(({ completed }) => completed === true).length}{" "}
      //done
      //</div>
      //<Item title={title} id={id} checked={false} />
      //</>
      //);
    }
  );

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
