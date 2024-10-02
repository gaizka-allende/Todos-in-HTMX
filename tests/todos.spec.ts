import { test, expect } from '@playwright/test'
import { serializeSigned } from 'hono/utils/cookie'

import { secret } from '../src/utils/utils'
import html from '../src/utils/html'
import todos from '../src/screens/todos'
import { renderTodos } from '../src/fragments/todo'
import { response } from '../src/routes/todo/put'

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
      body: html`${todos`${renderTodos([])}`}`,
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
      body: html`${renderTodos([
        {
          title: 'buy milka',
          id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
          completed: false,
        },
      ])}`,
    })
  })

  await page.goto('http://localhost:3000/todos')

  await page.getByTestId('add-todo').pressSequentially('buy milk')

  await page.getByRole('button', { name: /add/i }).click()

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
      body: html`${todos`
        ${renderTodos([
          {
            title: 'buy milk',
            id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
            completed: false,
          },
        ])}
      `}`,
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
      body: renderTodos([]),
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
      body: html`${todos`
        ${renderTodos([
          {
            title: 'buy milk',
            id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
            completed: false,
          },
        ])}
      `}`,
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
      body: renderTodos([
        {
          title: 'buy milk',
          id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
          completed: true,
        },
      ]),
    })
  })

  await page.goto('http://localhost:3000/todos')

  await page.waitForSelector('text=Todo')

  await page.click('input[type="checkbox"]')

  await page.getByTestId('show-completed').click()

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
      body: html`${todos`
        ${renderTodos([
          {
            title: 'buy milk',
            id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
            completed: true,
          },
        ])}
      `}`,
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
      body: html`${renderTodos([
        {
          title: 'buy milk',
          id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
          completed: false,
        },
      ])}`,
    })
  })

  await page.goto('http://localhost:3000/todos')

  await page.waitForSelector('text=Todo')

  await page.getByTestId('show-completed').click()
  await page.click('input[type="checkbox"]')

  await expect(page.getByRole('checkbox')).not.toBeChecked()
})

test('edit a todo', async ({ page }) => {
  await page.route('*/**/todos', async route => {
    if (route.request().method() !== 'GET') {
      await route.fallback()
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      body: html`${todos`
        ${renderTodos([
          {
            title: 'buy milk',
            id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
            completed: false,
          },
        ])}
      `}`,
    })
  })

  await page.route('*/**/todo/*', async route => {
    if (route.request().method() !== 'PUT') {
      await route.fallback()
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/text',
      body: response('5d686f21-8775-42c6-ae9a-2cd88bdfb6d2'),
    })
  })

  await page.goto('http://localhost:3000/todos')

  await page.waitForSelector('text=Todo')

  await page
    .locator('[name="5d686f21-8775-42c6-ae9a-2cd88bdfb6d2"]')
    .fill('buy chocolate')
})
