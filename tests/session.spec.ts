import { test, expect } from '@playwright/test'
import { serializeSigned } from 'hono/utils/cookie'
import 'dotenv/config'

//type Cookie = {
//name: string;
//value: string;
//url?: string;
//domain?: string;
//path?: string;
//expires?: number;
//httpOnly?: boolean;
//secure?: boolean;
//sameSite?: "Strict" | "Lax" | "None";
//};

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
      expires: new Date(Date.now() + 1000 * 60 * 10),
      sameSite: "Strict",
      partitioned: true,
    }
  );
  const cookie: SignedCookie = await parseSigned(serializedCookie, secret);
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


 */

test('redirects to /todos when already logged in and trying to browser /login', async ({
  page,
}) => {
  //create a mock session cookie (no expires)

  await page.goto('http://localhost:3000')

  await expect(page).toHaveTitle(/Todos/)

  await page.getByLabel(/username/i).pressSequentially('success_login')

  await page.getByLabel(/password/i).pressSequentially('success_password')

  await page.getByRole('button', { name: /login/i }).click()

  await page.waitForSelector('text=Todo')

  await page.goto('http://localhost:3000')

  await page.waitForURL('http://localhost:3000/todos')
})

test('redirects to /login when not logged in and trying to browser /todos', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/todos')

  await page.waitForURL('http://localhost:3000/login')
})

test('redirect to /login when trying to hijack session', async ({
  page,
  context,
}) => {
  const secret = process.env.SECRET
  if (!secret) {
    throw new Error('SECRET environment variable is required')
  }
  const serializedCookie = await serializeSigned(
    'session',
    `rogue_login,${Date.now()}`,
    secret,
    {
      path: '/',
      secure: true,
      domain: 'localhost',
      httpOnly: true,
      maxAge: 1000,
      expires: new Date(Date.now() + 1000 * 60 * 10),
      sameSite: 'Strict',
      partitioned: true,
    },
  )
  await context.addCookies([
    {
      name: 'session',
      value: serializedCookie.split(';')[0].split('=')[1],
      path: '/',
      secure: true,
      domain: 'localhost',
      httpOnly: true,
      sameSite: 'Strict',
    },
  ])

  await page.goto('http://localhost:3000/todos')

  await page.waitForSelector('text=Invalid user name in session')
})
