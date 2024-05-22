import { test, expect } from "@playwright/test";
import axios from "axios";

test("sucessful login", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.route("*/**/login", async (route) => {
    const response = await axios.post("http://localhost:3000/test/todos", {
      data: {},
    });
    await route.fulfill({
      status: 200,
      contentType: "application/text",
      body: response.data,
    });
  });

  await expect(page).toHaveTitle(/Todos/);

  await page.fill("input[name='username']", "sucess_login");
  await page.fill("input[name='password']", "success_password");
  await page.getByRole("button", { name: /submit/i }).click();

  await page.waitForSelector("text=Todo");
});

test("unsuccesful login", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.route("*/**/login", async (route) => {
    await route.fulfill({
      body: "Invalid username or password",
      status: 401,
    });
  });

  await expect(page).toHaveTitle(/Todos/);

  await page.fill("input[name='username']", "failed_login");
  await page.fill("input[name='password']", "failed_password");
  await page.getByRole("button", { name: /submit/i }).click();

  await page.waitForSelector("text=Invalid username or password");
});

test("sucessful login second attempt", async ({ page, request }) => {
  await page.goto("http://localhost:3000/");

  await page.route("*/**/login", async (route) => {
    await route.fulfill({
      body: "Invalid username or password",
      status: 401,
    });
  });

  await expect(page).toHaveTitle(/Todos/);

  await page.fill("input[name='username']", "failed_login");
  await page.fill("input[name='password']", "failed_password");
  await page.getByRole("button", { name: /submit/i }).click();

  await page.waitForSelector("text=Invalid username or password");

  await page.route("*/**/login", async (route) => {
    const response = await axios.post("http://localhost:3000/test/todos", {
      data: {},
    });
    await route.fulfill({
      status: 200,
      contentType: "application/text",
      body: response.data,
    });
  });

  await page.fill("input[name='username']", "sucess_login");
  await page.fill("input[name='password']", "success_password");
  await page.getByRole("button", { name: /submit/i }).click();

  await page.waitForSelector("text=Todo");
});
