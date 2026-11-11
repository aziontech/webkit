import { expect, test } from '@playwright/test'

import { DEMOS, label, type Mode, prepare, query, settle, shot } from './lib'

const FIRST = '1020655'

const ROUTES = [
  { name: 'resources', path: '/resources' },
  { name: 'resource-create', path: '/resources/new' },
  { name: 'resource-detail', path: `/resources/${FIRST}` },
  { name: 'resource-edit', path: `/resources/${FIRST}/edit` },
  { name: 'resource-delete', path: `/resources/${FIRST}/delete` },
  { name: 'resource-deploy', path: `/resources/${FIRST}/deploy` },
  { name: 'settings', path: '/settings' },
  { name: 'onboarding', path: '/onboarding' },
  { name: 'onboarding-plan', path: '/onboarding/plan' },
  { name: 'onboarding-profile', path: '/onboarding/profile' },
  { name: 'assistant', path: '/assistant' }
]

const MODES: Mode[] = [
  { theme: 'light', width: 1280 },
  { theme: 'dark', width: 1280 },
  { theme: 'dark', width: 390 }
]

const LOCALIZED: Mode = { theme: 'light', width: 1280, dir: 'rtl', locale: 'pt-BR' }

for (const route of ROUTES) {
  for (const mode of [...MODES, ...(route.name.startsWith('resource') ? [LOCALIZED] : [])]) {
    test(`demo ${route.name} ${label(mode)}`, async ({ page }) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      await prepare(page, mode)
      await page.goto(`${DEMOS}${route.path}${query(mode)}`)
      await settle(page)
      await expect(page).toHaveScreenshot(shot(`demos/${route.name}--${label(mode)}.png`))
      expect(errors).toEqual([])
    })
  }
}

test.describe('demo flows', () => {
  test.beforeEach(async ({ page }) => {
    await prepare(page, { theme: 'dark', width: 1280 })
  })

  test('list → create → detail', async ({ page }) => {
    await page.goto(`${DEMOS}/resources`)
    await page.getByRole('button', { name: 'Create Resource' }).first().click()
    await expect(page).toHaveURL(/\/resources\/new$/)
    await page.getByRole('textbox', { name: 'Name', exact: true }).fill('shop-api')
    await page.getByRole('textbox', { name: 'Domain name', exact: true }).fill('shop.example.com')
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await expect(page).toHaveURL(/\/resources\/\d+$/)
    await expect(page.getByText('shop.example.com').first()).toBeVisible()
    await expect(page.getByText('shop-api was created.')).toBeVisible()
  })

  test('detail → edit → save', async ({ page }) => {
    await page.goto(`${DEMOS}/resources/${FIRST}/edit`)
    const name = page.locator('#resource-name')
    await name.fill('resource-01-renamed')
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/resources/${FIRST}$`))
    await expect(page.getByText('resource-01-renamed was saved.')).toBeVisible()
  })

  test('list → delete with confirmation', async ({ page }) => {
    await page.goto(`${DEMOS}/resources/${FIRST}/delete`)
    const dialog = page.getByRole('dialog', { name: 'Delete resource' })
    await expect(dialog).toBeVisible()
    await dialog.getByRole('textbox').fill('resource-01')
    await dialog.getByRole('button', { name: 'Delete resource' }).click()
    await expect(page).toHaveURL(/\/resources$/)
    await expect(page.getByText('resource-01 was deleted.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'resource-01', exact: true })).toHaveCount(0)
  })

  test('deploy → toast with Edit and Redeploy', async ({ page }) => {
    await page.goto(`${DEMOS}/resources/${FIRST}/deploy`)
    await page.getByRole('button', { name: 'Deploy', exact: true }).first().click()
    await expect(page.getByText('Deploying resource-01…')).toBeVisible()
    await page.getByRole('button', { name: 'Resources', exact: true }).first().click()
    await expect(page).toHaveURL(/\/resources$/)
    await expect(page.getByText('resource-01 is live.')).toBeVisible({ timeout: 15_000 })
    const toast = page.locator('[data-type="success"]', { hasText: 'resource-01 is live.' })
    await expect(toast.getByRole('button', { name: 'Redeploy' })).toBeVisible()
    await toast.getByRole('button', { name: 'Edit' }).click()
    await expect(page).toHaveURL(new RegExp(`/resources/${FIRST}/edit$`))
  })

  test('onboarding → plan', async ({ page }) => {
    await page.goto(`${DEMOS}/onboarding`)
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveURL(/\/onboarding$/)
    await page.getByRole('textbox').nth(0).fill('Alex Doe')
    await page.getByRole('textbox').nth(1).fill('Acme')
    await page.getByRole('button', { name: 'Continue' }).click()
    await expect(page).toHaveURL(/\/onboarding\/plan$/)
  })

  test('assistant answers a prompt', async ({ page }) => {
    await page.goto(`${DEMOS}/assistant`)
    await page.getByRole('textbox').first().fill('How do I purge one URL?')
    await page.keyboard.press('Enter')
    await expect(page.getByText('from the products menu')).toBeVisible({ timeout: 15_000 })
  })
})
