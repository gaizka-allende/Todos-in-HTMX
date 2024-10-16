import { test, expect } from '@playwright/test'

test('redirects to /todos when already logged in and trying to browser /login', async ({
  page,
}) => {
  //create a mock session cookie (no expires)

  await page.goto('http://localhost:3000')

  await expect(page).toHaveTitle(/Todos/)

  await page.getByLabel(/username/i).pressSequentially('success_login')

  await page.getByLabel(/password/i).pressSequentially('success_password')

  await page.getByRole('button', { name: /submit/i }).click()

  await page.waitForSelector('text=Todo')

  await page.goto('http://localhost:3000')

  await page.waitForURL('http://localhost:3000/todos')
})
