import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { createMiddleware } from "hono/factory";
import { JSONFilePreset } from "lowdb/node";
import { HTTPException } from "hono/http-exception";
import { setSignedCookie, getSignedCookie } from "hono/cookie";
import { add, isBefore } from "date-fns";

import { renderHTMLDocument } from "./components/document";
import { renderLoginForm } from "./components/login";
import { renderTodo, renderTodos, renderTodosDone } from "./components/todo";
import { secret } from "./utils/utils";
import { Database, Todo, RequestVariables } from "./types";

(async () => {
  const app = new Hono<{ Variables: RequestVariables }>();

  const defaultData = {
    todos: {},
    logins: [],
  };
  const db = await JSONFilePreset<Database>("db.json", defaultData);

  app.use(
    "*",
    createMiddleware(async (c, next) => {
      // TODO handle post from the todos form without a session cookie
      const session = await getSignedCookie(c, secret, "session");
      if (session) {
        const [username, sessionDateTimestamp] = session.split(",");

        const { logins } = db.data;

        if (!logins.find((login) => login.username === username)) {
          console.log("invalid username");
          throw new HTTPException(401, { message: "Invalid user session" });
        }

        const sessionDate = new Date(parseInt(sessionDateTimestamp));
        if (isBefore(add(sessionDate, { minutes: 5 }), new Date())) {
          // session expires after 5 minutes
          // redirect to login screen
          console.log("session expired");
          if (c.req.path !== "/login") {
            return c.redirect("/login");
          }

          await next();
          return;
        }
        console.log("session is valid (not expired)");
        c.set("username", username);
        if (c.req.path === "/" || c.req.path === "/login") {
          console.log(
            "session is valid so redirect to todos if user tries to access login page",
          );
          //c.res.headers.set("HX-Redirect", "/todos");
          //const username = c.get("username");
          return c.redirect("/todos");

          //return c.html(
          //renderHTMLDocument(renderTodos(db.data.todos[username]))
          //);
        }
        await next();
        return;
      }
      console.log("no session cookie");
      //if (c.req.path === "/" || c.req.path === "/login") {
      if (c.req.path === "/login") {
        await next();
        return;
      }
      //await next();
      return c.redirect("/login");
    }),
  );

  //app.get("*", renderer);

  app.get("/login", async (c) => {
    return c.html(renderHTMLDocument(renderLoginForm()));
  });

  app.get("/todos", async (c) => {
    const username = c.get("username") as string;
    console.log(username);
    return c.html(renderHTMLDocument(renderTodos(db.data.todos[username])));
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
      const formData = await c.req.formData();
      const username = formData.get("username") as string;
      const password = formData.get("password") as string;

      const user = db.data.logins.find((login) => login.username === username);

      if (!user || user.password !== password) {
        const res = new Response("Invalid username or password", {
          status: 401,
          headers: {
            Authenticate: 'error="invalid_invalid_username_or_password"',
          },
        });

        throw new HTTPException(401, { res });
      }

      console.log("login successful");

      await setSignedCookie(c, "session", `${username},${Date.now()}`, secret, {
        path: "/",
        secure: true,
        httpOnly: true,
        maxAge: 1000,
        expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
        sameSite: "Strict",
      });

      if (!db.data.todos[username]) db.data.todos[username] = [];
      c.res.headers.set("HX-Redirect", "/todos");
      return c.html(renderHTMLDocument(renderTodos(db.data.todos[username])));
    },
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
      const formData = await c.req.formData();
      const title = formData.get("title") as string;
      const id = crypto.randomUUID();
      db.data.todos[username].push({
        id,
        title,
        completed: false,
      });
      await db.write();
      return c.html(/*html*/ `
          ${renderTodosDone(
            db.data.todos[username].filter(
              ({ completed }) => completed === true,
            ).length,
          )}
          ${renderTodo({ title, id, completed: false })}
        `);
    },
  );

  app.delete("/todo/:id", async (c) => {
    const id = c.req.param("id");
    const username = c.get("username");
    db.data.todos[username] = db.data.todos[username].filter(
      (todo) => todo.id !== id,
    );
    await db.write();

    c.status(200);
    return c.body(/*html*/ `
      ${renderTodosDone(
        db.data.todos[username].filter(({ completed }) => completed === true)
          .length,
      )}
      `);
  });

  app.patch("/todo/:id", async (c) => {
    const username = c.get("username");
    const id = c.req.param("id");
    const formData = await c.req.formData();
    const checkbox = formData.get("checkbox");
    const todo = db.data.todos[username].find((todo) => todo.id === id) as Todo;

    db.data.todos[username] = [
      ...db.data.todos[username].filter((todo) => todo.id !== id),
      { ...todo, completed: checkbox === "on" },
    ];
    await db.write();
    c.status(200);
    return c.body(/*html*/ `
        ${renderTodosDone(
          db.data.todos[username].filter(({ completed }) => completed === true)
            .length,
        )}
        ${renderTodo({
          ...todo,
          completed: checkbox === "on",
        })}
      `);
  });

  const port = 3000;
  console.log(`Server is running on port ${port}`);

  serve({
    fetch: app.fetch,
    port,
  });
})();
