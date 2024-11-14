import { test, expect } from '@playwright/test'
import { serializeSigned } from 'hono/utils/cookie'
import 'dotenv/config'
import { formatISO } from 'date-fns'

import html from '../src/utils/html'
import todos from '../src/screens/todos'
import { renderTodos } from '../src/fragments/todo'
import { response } from '../src/routes/todo/put'
import document from '../src/fragments/document'
import { t } from '../src/i18n'

const c = {
  get: () => t,
}

test.beforeEach('create a login session', async ({ context }) => {
  const secret = process.env.SECRET
  if (!secret) {
    throw new Error('SECRET environment variable is required')
  }
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
      //@ts-expect-error c is just mocking the context without the same signature
      body: document.bind(c)`${todos.bind(c)`${renderTodos.bind(c)([])}`}`,
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
      //@ts-expect-error c is just mocking the context without the same signature
      body: html`${renderTodos.bind(c)([
        {
          title: 'buy milka',
          id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
          completed: 0,
          created_modified: formatISO(new Date()),
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
      //@ts-expect-error c is just mocking the context without the same signature
      body: document.bind(c)`${todos.bind(c)`${renderTodos.bind(c)([
        {
          title: 'buy milk',
          id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
          completed: 0,
          created_modified: formatISO(new Date()),
        },
      ])}`}`,
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
      //@ts-expect-error c is just mocking the context without the same signature
      body: renderTodos.bind(c)([]),
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
      //@ts-expect-error c is just mocking the context without the same signature
      body: document.bind(c)`${todos.bind(c)`
        ${
          //@ts-expect-error c is just mocking the context without the same signature
          renderTodos.bind(c)([
            {
              title: 'buy milk',
              id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
              completed: 0,
              created_modified: formatISO(new Date()),
            },
          ])
        }
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
      //@ts-expect-error c is just mocking the context without the same signature
      body: renderTodos.bind(c)([
        {
          title: 'buy milk',
          id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
          completed: 1,
          created_modified: formatISO(new Date()),
        },
      ]),
    })
  })

  await page.goto('http://localhost:3000/todos')

  await page.waitForSelector('text=Todo')

  await page.getByRole('checkbox').click()

  await page.waitForSelector('text=Completed (1)')

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
      //@ts-expect-error c is just mocking the context without the same signature
      body: html`${todos.bind(c)`
        ${
          //@ts-expect-error c is just mocking the context without the same signature
          renderTodos.bind(c)([
            {
              title: 'buy milk',
              id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
              completed: 1,
              created_modified: formatISO(new Date()),
            },
          ])
        }
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
      //@ts-expect-error c is just mocking the context without the same signature
      body: html`${renderTodos.bind(c)([
        {
          title: 'buy milk',
          id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
          completed: 0,
          created_modified: formatISO(new Date()),
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

test.skip('edit a todo', async ({ page }) => {
  await page.route('*/**/todos', async route => {
    if (route.request().method() !== 'GET') {
      await route.fallback()
      return
    }

    await route.fulfill({
      status: 200,
      contentType: 'text/html',
      //@ts-expect-error c is just mocking the context without the same signature
      body: html`${todos.bind(c)`
        ${
          //@ts-expect-error c is just mocking the context without the same signature
          renderTodos.bind(c)([
            {
              title: 'buy milk',
              id: '5d686f21-8775-42c6-ae9a-2cd88bdfb6d2',
              completed: 0,
              created_modified: formatISO(new Date()),
            },
          ])
        }
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
