import { test, expect } from '@playwright/test'

test('sucessful login', async ({ page }) => {
  //await page.goto("http://localhost:3000/");

  //await page.getByLabel(/username/i).pressSequentially("sucess_login");
  //await page.getByLabel(/password/i).pressSequentially("success_password");

  //await expect(
  //page.getByRole("button", { name: /submit/i })
  //).not.toBeDisabled();
  //await page.getByRole("button", { name: /submit/i }).click();

  //await page.waitForSelector("text=Todo");
  await page.goto('http://localhost:3000')

  await expect(page).toHaveTitle(/Todos/)

  await page.getByLabel(/username/i).pressSequentially('success_login')

  await page.getByLabel(/password/i).pressSequentially('success_password')

  await page.getByRole('button', { name: /submit/i }).click()

  await page.waitForSelector('text=Todo')
})

test('unsuccesful login', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  //await page.route("*/**/login", async (route) => {
  //await route.fulfill({
  //body: "Invalid username or password",
  //status: 401,
  //});
  //});

  await expect(page).toHaveTitle(/Todos/)

  await page.getByLabel(/username/i).pressSequentially('failed_login')

  await page.getByLabel(/password/i).pressSequentially('failed_password')

  await page.getByRole('button', { name: /submit/i }).click()

  await page.waitForSelector('text=Invalid username or password')
})

test('sucessful login second attempt', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  //await page.route("*/**/login", async (route) => {
  //await route.fulfill({
  //body: "Invalid username or password",
  //status: 401,
  //});
  //});

  await expect(page).toHaveTitle(/Todos/)

  await page.getByLabel(/username/i).pressSequentially('failed_login')

  await page.getByLabel(/password/i).pressSequentially('failed_password')

  await page.getByRole('button', { name: /submit/i }).click()

  await page.waitForSelector('text=Invalid username or password')

  //await page.route("*/**/login", async (route) => {
  //await route.fulfill({
  //status: 200,
  //contentType: "application/text",
  //});
  //});

  await page.getByLabel(/username/i).clear()
  await page.getByLabel(/username/i).pressSequentially('success_login')

  await page.getByLabel(/password/i).clear()
  await page.getByLabel(/password/i).pressSequentially('success_password')

  await page.getByRole('button', { name: /submit/i }).click()

  await page.waitForSelector('text=Todo')
})

// todo fix this test
// the button is not disabled when submitting
test.skip('ensure button and input are disabled when submitting', async ({
  page,
}) => {
  await page.goto('http://localhost:3000/')

  await expect(page).toHaveTitle(/Todos/)

  await page.getByLabel(/username/i).pressSequentially('sucess_login')
  await page.getByLabel(/password/i).pressSequentially('success_password')

  await page.getByRole('button', { name: /submit/i }).click()

  await expect(page.getByRole('button', { name: /submit/i })).toBeDisabled()

  await page.waitForSelector('text=Todo')
})
