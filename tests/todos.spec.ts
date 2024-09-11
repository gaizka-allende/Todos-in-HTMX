import { test, expect } from '@playwright/test'
import { serializeSigned } from 'hono/utils/cookie'

import { secret } from '../src/utils/utils'

import {
  renderTodos,
  renderTodo,
  renderTodosDone,
} from '../src/components/todo'
import { renderHTMLDocument } from '../src/components/document'

test.beforeEach('create a login session', async ({ context }) => {
  const serializedCookie = await serializeSigned(
    'session',
    `success_login,${Date.now()}`,
    secret,
    {
      path: '/',
      secure: true,
      domain: 'localhost',
      httpOnly: true,
      maxAge: 1000,
      expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
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
})

test('add a todo', async ({ page }) => {
  await page.route('*/**/todos', async route => {
    if (route.request().method() !== 'GET') {
      await route.fallback()
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: /*html*/ `${renderHTMLDocument(renderTodos([]))}`,
    })
  })

  await page.route('*/**/todo', async route => {
    if (route.request().method() !== 'POST') {
      await route.fallback()
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/text',
      body: /*html*/ `${renderTodosDone(1)}
    ${renderTodo({
      title: 'buy milka',
      id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
      completed: false,
    })}`,
    })
  })

  await page.goto('http://localhost:3000/todos')

  await page.getByTestId('add-todo').pressSequentially('buy milk')

  await page.getByRole('button', { name: /add/i }).click()

  //await page.waitForTimeout(3 * 1000);

  await expect(page.getByRole('button', { name: /delete/i })).toBeVisible()
})

test('delete a todo', async ({ page }) => {
  await page.route('*/**/todos', async route => {
    if (route.request().method() !== 'GET') {
      await route.fallback()
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: /*html*/ `${renderHTMLDocument(
        renderTodos([
          {
            title: 'buy milk',
            id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
            completed: false,
          },
        ]),
      )}`,
    })
  })

  await page.route('*/**/todo/*', async route => {
    if (route.request().method() !== 'DELETE') {
      await route.fallback()
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/text',
      body: renderTodosDone(0),
    })
  })

  await page.goto('http://localhost:3000/todos')

  await page.waitForSelector('text=Todo')

  await page.getByRole('button', { name: /delete/i }).click()

  await expect(page.getByRole('button', { name: /delete/i })).not.toBeVisible()
})

test('complete a todo', async ({ page }) => {
  await page.route('*/**/todos', async route => {
    if (route.request().method() !== 'GET') {
      await route.fallback()
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: /*html*/ `${renderHTMLDocument(
        renderTodos([
          {
            title: 'buy milk',
            id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
            completed: false,
          },
        ]),
      )}`,
    })
  })

  await page.route('*/**/todo/*', async route => {
    if (route.request().method() !== 'PATCH') {
      await route.fallback()
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/text',
      body: renderTodosDone(1),
    })
  })

  await page.goto('http://localhost:3000/todos')

  await page.waitForSelector('text=Todo')

  await page.getByRole('checkbox').check()

  await expect(page.getByRole('checkbox')).toBeChecked()
})

test('uncomplete a todo', async ({ page }) => {
  await page.route('*/**/todos', async route => {
    if (route.request().method() !== 'GET') {
      await route.fallback()
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: /*html*/ `${renderHTMLDocument(
        renderTodos([
          {
            title: 'buy milk',
            id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
            completed: true,
          },
        ]),
      )}`,
    })
  })

  await page.route('*/**/todo/*', async route => {
    if (route.request().method() !== 'PATCH') {
      await route.fallback()
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/text',
      body: /*html*/ `${renderTodosDone(0)}${renderTodo({
        title: 'buy milk',
        id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
        completed: false,
      })}`,
    })
  })

  await page.goto('http://localhost:3000/todos')

  await page.waitForSelector('text=Todo')

  await page.getByRole('checkbox').uncheck()

  await expect(page.getByRole('checkbox')).not.toBeChecked()
})
