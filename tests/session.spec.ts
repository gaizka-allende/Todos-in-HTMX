import { test, expect } from "@playwright/test";
import { serializeSigned } from "hono/utils/cookie";

import { secret } from "../src/utils/utils";

type Cookie = {
  name: string;
  value: string;
  url?: string;
  domain?: string;
  path?: string;
  expires?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
};

/*
const serializedCookie = await serializeSigned(
    "session",
    `success_login,${Date.now()}`,
    secret,
    {
      path: "/",
      secure: true,
      domain: "localhost",
      httpOnly: true,
      maxAge: 1000,
      expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
      sameSite: "Strict",
      partitioned: true,
    }
  );
  console.log({ serializedCookie });
  const cookie: SignedCookie = await parseSigned(serializedCookie, secret);
  console.log({ cookie });
  await context.addCookies([
    {
      name: "session",
      value: serializedCookie.split(";")[0].split("=")[1],
      path: "/",
      secure: true,
      domain: "localhost",
      httpOnly: true,
      sameSite: "Strict",
    },
  ]);

  console.log(await context.cookies());

 */

test("redirects to /todos when already logged in and trying to browser /login", async ({
  page,
  context,
  browser,
}) => {
  //create a mock session cookie (no expires)

  await page.goto("http://localhost:3000");

  await expect(page).toHaveTitle(/Todos/);

  await page.getByLabel(/username/i).pressSequentially("success_login");

  await page.getByLabel(/password/i).pressSequentially("success_password");

  await page.getByRole("button", { name: /submit/i }).click();

  await page.waitForSelector("text=Todo");

  await page.goto("http://localhost:3000");

  await page.waitForURL("http://localhost:3000/todos");
});

test("redirects to /login when not logged in and trying to browser /todos", async ({
  page,
}) => {
  await page.goto("http://localhost:3000/todos");

  await page.waitForURL("http://localhost:3000/login");
});

test("redirect to /login when trying to hijack session", async ({
  page,
  context,
}) => {
  const serializedCookie = await serializeSigned(
    "session",
    `rogue_login,${Date.now()}`,
    secret,
    {
      path: "/",
      secure: true,
      domain: "localhost",
      httpOnly: true,
      maxAge: 1000,
      expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
      sameSite: "Strict",
      partitioned: true,
    }
  );
  await context.addCookies([
    {
      name: "session",
      value: serializedCookie.split(";")[0].split("=")[1],
      path: "/",
      secure: true,
      domain: "localhost",
      httpOnly: true,
      sameSite: "Strict",
    },
  ]);

  await page.goto("http://localhost:3000/todos");

  await page.waitForSelector("text=Invalid user session");
});
