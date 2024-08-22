import { test, expect } from "@playwright/test";

import { renderTodo } from "../src/components/todo";

/*

/*<div id="done" hx-swap-oob="true">0 done</div>
        <form>
          <div class="item flex row items-center mb-2">
            <input
              type="checkbox"
              class="mr-2"
              id="checked"
              name="checkbox"
              hx-patch="/todo/5d686f21-8775-42c6-ae9a-2cd88bdfb6d2"
            /><input
              id="5d686f21-8775-42c6-ae9a-2cd88bdfb6d2"
              class="font-medium py-1 px-4 my-1 rounded-lg text-lg border bg-gray-100 text-gray-600 mr-2"
              value="buy milk"
              hx-put="/todo/5d686f21-8775-42c6-ae9a-2cd88bdfb6d2"
              name="title"
            /><button
              class="font-medium "
              hx-delete="/todo/5d686f21-8775-42c6-ae9a-2cd88bdfb6d2"
              hx-swap="outerHTML"
              hx-target="closest div"
            >
              Delete
            </button>
          </div>
        </form>

*/

test("add a todo", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await expect(page).toHaveTitle(/Todos/);

  await page.getByLabel(/username/i).pressSequentially("success_login");

  await page.getByLabel(/password/i).pressSequentially("success_password");

  await page.getByRole("button", { name: /submit/i }).click();

  await page.waitForSelector("text=Todo");

  await page.getByTestId("add-todo").pressSequentially("buy milk");

  await page.route("*/**/todo", async (route) => {
    if (route.request().method() !== "POST") {
      await route.fallback();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: "application/text",
      body: /*html*/ `<div id="done" hx-swap-oob="true">1 done</div>
        ${renderTodo({
          title: "buy milk",
          id: "5d686f21-8775-42c6-ae9a-2cd88bdfb6d2",
          completed: false,
        })}`,
    });
  });

  await page.getByRole("button", { name: /add/i }).click();

  await expect(page.getByRole("button", { name: /delete/i })).toBeVisible();
});
