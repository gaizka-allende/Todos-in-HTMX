import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { JSONFilePreset } from "lowdb/node";
import { HTTPException } from "hono/http-exception";
import { setSignedCookie, getSignedCookie } from "hono/cookie";

import { renderer } from "./components/renderer";
import { LoginForm } from "./components/LoginForm";
import { Todos, Item } from "./components/Todos";
import { timer } from "./utils";

const secret = "secret ingredient";

const Auth = createMiddleware(async (c, next) => {
  const session = await getSignedCookie(c, secret, "session");
  if (session) {
    const [username, sessionDateTimestamp] = session.split(",");
    const sessionDate = new Date(parseInt(sessionDateTimestamp));
    console.log(username, sessionDate);
    c.set("username", username);
    c.set("sessionDate", sessionDate);
    await next();
    return;
  }
  console.log("no session cookie");
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
  await next();
});

interface Login {
  username: string;
  password: string;
  realm?: string | undefined;
  hashFunction?: Function | undefined;
}

(async () => {
  const app = new Hono();

  const db = await JSONFilePreset("db.json", {
    todos: [],
    logins: Array<Login>,
  });

  app.use("*", Auth);

  app.get("*", renderer);

  app.get("/", async (c) => {
    return c.render(<LoginForm />);
  });

  app.get("/todos", async (c) => {
    const username = c.get("username");
    return c.render(<Todos todos={db.data.todos[username]} />);
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
      //console.log(c.get("username"));
      //const json = await c.req.json();
      //console.log(json);
      //console.log(c.req.parseBody());
      const formData = await c.req.formData();
      const username = formData.get("username");
      const password = formData.get("password");
      //console.log(username, password);

      const user = db.data.logins.find((login) => login.username === username);

      if (!user) return c.render(<LoginForm invalidUsernameOrPassword />);

      if (user.password !== password)
        return c.render(<LoginForm invalidUsernameOrPassword />);

      await setSignedCookie(c, "session", `${username},${Date.now()}`, secret, {
        path: "/",
        secure: true,
        //domain: "example.com",
        httpOnly: true,
        maxAge: 1000,
        expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
        sameSite: "Strict",
      });

      if (!db.data.todos[username]) db.data.todos[username] = [];
      c.res.headers.set("Location", "/todos");
      return c.render(<Todos todos={db.data.todos[username]} />);

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
      const username = c.get("username");
      //const json = await c.req.json();
      //console.log(json);
      //console.log(c.req.parseBody());
      const formData = await c.req.formData();
      const title = formData.get("title");
      //const { title } = c.req.valid("form");
      //console.log(title);
      const id = crypto.randomUUID();
      db.data.todos[username].push({
        id,
        title,
        completed: false,
      });
      await db.write();
      await timer(5);
      return c.html(
        <>
          <div id="done" hx-swap-oob="true">
            {
              db.data.todos[username].filter(
                ({ completed }) => completed === true
              ).length
            }{" "}
            done
          </div>
          <Item title={title} id={id} checked={false} />
        </>
      );
    }
  );

  app.delete("/todo/:id", async (c) => {
    const id = c.req.param("id");
    const username = c.get("username");
    db.data.todos[username] = db.data.todos[username].filter(
      (todo) => todo.id !== id
    );
    await db.write();

    c.status(200);
    return c.body(
      <>
        <div id="done" hx-swap-oob="true">
          {
            db.data.todos[username].filter(
              ({ completed }) => completed === true
            ).length
          }{" "}
          done
        </div>
      </>
    );
  });

  app.patch("/todo/:id", async (c) => {
    const username = c.get("username");
    const id = c.req.param("id");
    const formData = await c.req.formData();
    //console.log(formData);
    const checkbox = formData.get("checkbox");
    const title = formData.get("title");
    //console.log(id, title, checkbox);
    const todo = db.data.todos[username].find((todo) => todo.id === id);

    db.data.todos[username] = [
      ...db.data.todos[username].filter((todo) => todo.id !== id),
      { ...todo, title, completed: checkbox === "on" },
    ];
    await db.write();
    c.status(200);
    return c.body(
      <>
        <div id="done" hx-swap-oob="true">
          {
            db.data.todos[username].filter(
              ({ completed }) => completed === true
            ).length
          }{" "}
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
