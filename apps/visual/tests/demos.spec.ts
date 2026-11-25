import { expect, type Page, test } from '@playwright/test'

import { DEMOS, label, type Mode, prepare, query, settle, shot } from './lib'

const FIRST = '1020655'
const TICKET = '4812'
const CUSTOMER = 'alex-morgan'

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
  { name: 'assistant', path: '/assistant' },
  { name: 'api-keys', path: '/settings/api-keys' },
  { name: 'support', path: '/support' },
  { name: 'support-ticket-create', path: '/support/tickets/new' },
  { name: 'support-ticket', path: `/support/tickets/${TICKET}` },
  { name: 'support-customer', path: `/support/customers/${CUSTOMER}` },
  { name: 'support-canned-responses', path: '/support/settings/canned-responses' }
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

const toastTitle = (page: Page, text: string) =>
  page.getByTestId('toast-title').filter({ hasText: text })

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
    await page.getByRole('button', { name: 'Create resource', exact: true }).click()
    await expect(page).toHaveURL(/\/resources\/\d+$/)
    await expect(page.getByText('shop.example.com').first()).toBeVisible()
    await expect(toastTitle(page, 'shop-api was created.')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1, name: 'shop-api' })).toBeVisible()
    await expect(page.getByText('No deployment yet')).toBeVisible()
    await expect(page.getByText('Inactive', { exact: true }).first()).toBeVisible()
    await expect(page.getByText(/^now by Amy Chen$/)).toBeVisible()
  })

  test('detail → edit → save', async ({ page }) => {
    await page.goto(`${DEMOS}/resources/${FIRST}/edit`)
    const name = page.locator('#resource-name')
    await name.fill('resource-01-renamed')
    await page.getByRole('button', { name: 'Save', exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`/resources/${FIRST}$`))
    await expect(toastTitle(page, 'resource-01-renamed was saved.')).toBeVisible()
  })

  test('list → delete with confirmation', async ({ page }) => {
    await page.goto(`${DEMOS}/resources/${FIRST}/delete`)
    const dialog = page.getByRole('alertdialog', { name: 'Delete resource' })
    await expect(dialog).toBeVisible()
    await expect(
      dialog.getByRole('textbox', { name: 'Type resource-01 to confirm.' })
    ).toBeVisible()
    await expect(dialog.getByRole('button', { name: /^Copy/ })).toHaveCount(0)
    await dialog.getByRole('textbox').fill('resource-01')
    await dialog.getByRole('button', { name: 'Delete resource' }).click()
    await expect(page).toHaveURL(/\/resources$/)
    await expect(toastTitle(page, 'resource-01 was deleted.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'resource-01', exact: true })).toHaveCount(0)
  })

  test('detail and edit are headed by the resource name', async ({ page }) => {
    await page.goto(`${DEMOS}/resources/${FIRST}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('resource-01')
    await page.goto(`${DEMOS}/resources/${FIRST}/edit`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('resource-01')
  })

  test('edit saves with Control+S', async ({ page }) => {
    await page.goto(`${DEMOS}/resources/${FIRST}/edit`)
    await page.locator('#resource-name').fill('resource-01-keyboard')
    await page.keyboard.press('Control+S')
    await expect(page).toHaveURL(new RegExp(`/resources/${FIRST}$`))
    await expect(toastTitle(page, 'resource-01-keyboard was saved.')).toBeVisible()
  })

  test('the row menu opens the same delete dialog as the delete route', async ({ page }) => {
    await page.goto(`${DEMOS}/resources`)
    await page.locator('[data-testid="table-cell-actions"]').first().getByRole('button').click()
    await page.getByRole('menuitem', { name: 'Delete' }).click()
    await expect(page).toHaveURL(new RegExp(`/resources/${FIRST}/delete$`))
    const dialog = page.getByRole('alertdialog', { name: 'Delete resource' })
    await expect(dialog.getByRole('button', { name: 'Copy resource-01' })).toBeVisible()
  })

  test('focus lands on a row after the delete dialog closes', async ({ page }) => {
    await page.goto(`${DEMOS}/resources/${FIRST}/delete`)
    await expect(page.getByRole('alertdialog', { name: 'Delete resource' })).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page).toHaveURL(/\/resources$/)
    await expect(page.getByRole('link', { name: 'resource-01', exact: true })).toBeFocused()

    await page.goto(`${DEMOS}/resources/${FIRST}/delete`)
    const dialog = page.getByRole('alertdialog', { name: 'Delete resource' })
    await dialog.getByRole('textbox').fill('resource-01')
    await dialog.getByRole('button', { name: 'Delete resource' }).click()
    await expect(page).toHaveURL(/\/resources$/)
    await expect(page.getByRole('link', { name: 'resource-02', exact: true })).toBeFocused()
  })

  test('Clone adds a copy of the row', async ({ page }) => {
    await page.goto(`${DEMOS}/resources`)
    await page.locator('[data-testid="table-cell-actions"]').first().getByRole('button').click()
    await page.getByRole('menuitem', { name: 'Clone' }).click()
    await expect(page.getByRole('link', { name: 'resource-01-copy', exact: true })).toBeVisible()
  })

  test('the account menu and the create page avatar lead to Account settings', async ({ page }) => {
    await page.goto(`${DEMOS}/resources`)
    await page
      .getByRole('button', { name: /account menu/ })
      .first()
      .click()
    await page.getByRole('menuitem', { name: 'Account settings' }).click()
    await expect(page).toHaveURL(/\/settings$/)
    await page.goto(`${DEMOS}/resources/new`)
    await page.getByRole('button', { name: 'Account settings' }).click()
    await expect(page).toHaveURL(/\/settings$/)
  })

  test('the sidebar lists only rows that lead to a page', async ({ page }) => {
    await page.goto(`${DEMOS}/resources`)
    await expect(page.getByRole('link', { name: 'Resources' }).first()).toBeVisible()
    await expect(page.getByRole('button', { name: /Projects/ })).toHaveCount(0)
    await expect(page.locator('nav').getByText('Soon', { exact: true })).toHaveCount(0)
  })

  test('leaving the profile with unsaved edits asks first', async ({ page }) => {
    await page.goto(`${DEMOS}/settings`)
    await page.locator('#full-name').fill('Amy Chen-Park')
    await page
      .getByRole('button', { name: /account menu/ })
      .first()
      .click()
    await page.getByRole('menuitem', { name: 'Integration keys' }).click()
    await expect(page.getByRole('alertdialog', { name: 'Unsaved changes' })).toBeVisible()
    await page.getByRole('button', { name: 'Keep editing' }).click()
    await expect(page.locator('#full-name')).toHaveValue('Amy Chen-Park')
  })

  test('the profile opens on the signed-in account and saves with Control+S', async ({ page }) => {
    await page.goto(`${DEMOS}/settings`)
    await expect(page.locator('#full-name')).toHaveValue('Amy Chen')
    await expect(page.locator('#email')).toHaveValue('amy.chen@example.com')
    await page.locator('#full-name').fill('Amy Chen-Park')
    await page.keyboard.press('Control+S')
    await expect(page.getByText('This field is required.')).toHaveCount(0)
  })

  test('each plan card prints its description once', async ({ page }) => {
    await page.goto(`${DEMOS}/onboarding/plan`)
    await expect(
      page.getByText('Start free for personal projects and experimentation')
    ).toHaveCount(1)
  })

  test('an unknown address shows a not-found page and keeps the URL', async ({ page }) => {
    await page.goto(`${DEMOS}/nope-404`)
    await expect(page).toHaveURL(/\/nope-404$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()
  })

  test('a customer link from the block sample opens, and an unknown one is titled', async ({
    page
  }) => {
    await page.goto(`${DEMOS}/support/customers/cus_1042`)
    await expect(page.getByRole('heading', { level: 1, name: 'Alex Morgan' })).toBeVisible()
    await page.goto(`${DEMOS}/support/customers/nobody`)
    await expect(page.getByRole('heading', { level: 1, name: 'Customer not found' })).toBeVisible()
  })

  test('in right to left a phone page is no wider than the screen', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    for (const path of ['/settings', '/resources/new', '/support/tickets/new']) {
      await page.goto(`${DEMOS}${path}?dir=rtl`)
      await expect(page.locator('main, form').first()).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        390
      )
    }
  })

  test('on a phone the list shows each row status', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(`${DEMOS}/resources`)
    await expect(page.locator('[data-stacked]').getByText('Inactive').first()).toBeVisible()
  })

  for (const width of [390, 1280]) {
    test(`the demo controls cover no control at ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: width < 600 ? 844 : 900 })
      await page.goto(`${DEMOS}/settings`)
      await page.locator('#full-name').fill('Amy Chen-Park')
      const bar = await page.locator('[data-demo-bar]').boundingBox()
      const covered = await page.evaluate((top) => {
        const controls = [
          ...document.querySelectorAll('main button, main a, main input, nav button')
        ]
        return controls
          .filter((el) => !el.closest('[data-demo-bar]'))
          .map((el) => el.getBoundingClientRect())
          .filter((box) => box.width > 0 && box.bottom > top && box.top < innerHeight)
          .map((box) => `${box.left},${box.top}`)
      }, bar?.y ?? 0)
      expect(covered).toEqual([])
    })
  }

  test('deploy → toast with Edit and Redeploy', async ({ page }) => {
    await page.goto(`${DEMOS}/resources/${FIRST}/deploy`)
    await page.getByRole('button', { name: 'Deploy', exact: true }).first().click()
    await expect(toastTitle(page, 'Deploying resource-01…')).toBeVisible()
    await page.getByRole('link', { name: 'Resources', exact: true }).first().click()
    await expect(page).toHaveURL(/\/resources$/)
    await expect(toastTitle(page, 'resource-01 is live.')).toBeVisible({ timeout: 15_000 })
    const toast = page.locator('[data-severity="success"]', { hasText: 'resource-01 is live.' })
    await expect(toast.getByRole('button', { name: 'Redeploy' })).toBeVisible()
    await toast.getByRole('button', { name: 'Edit' }).click()
    await expect(page).toHaveURL(new RegExp(`/resources/${FIRST}/edit$`))
  })

  test('inbox → ticket → send reply', async ({ page }) => {
    await page.goto(`${DEMOS}/support`)
    await page.getByRole('link', { name: 'Custom domain returns a certificate error' }).click()
    await expect(page).toHaveURL(new RegExp(`/support/tickets/${TICKET}$`))
    await expect(page.getByRole('heading', { level: 1, name: /certificate error/ })).toBeVisible()
    await page.getByRole('textbox', { name: 'Reply to the customer' }).click()
    await page.keyboard.type('A hard refresh picks up the new certificate.')
    await page.getByRole('button', { name: 'Send', exact: true }).first().click()
    await expect(toastTitle(page, 'Reply sent.')).toBeVisible()
    await expect(
      page.getByText('A hard refresh picks up the new certificate.').first()
    ).toBeVisible()
  })

  test('onboarding → plan', async ({ page }) => {
    await page.goto(`${DEMOS}/onboarding`)
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(page).toHaveURL(/\/onboarding$/)
    await page.getByRole('textbox').nth(0).fill('Alex Doe')
    await page.getByRole('textbox').nth(1).fill('Acme')
    await page.getByRole('button', { name: 'Next', exact: true }).click()
    await expect(page).toHaveURL(/\/onboarding\/plan$/)
  })

  test('an empty Create focuses the first invalid field', async ({ page }) => {
    await page.goto(`${DEMOS}/resources/new`)
    await page.getByRole('button', { name: /^Create resource/ }).click()
    await expect(page.getByText('This field is required.')).toHaveCount(2)
    await expect(page.getByRole('textbox', { name: 'Name', exact: true })).toBeFocused()
  })

  test('arrow keys move between table rows and Enter opens one', async ({ page }) => {
    await page.goto(`${DEMOS}/resources`)
    const rows = page.locator('[data-focus-row]')
    await expect(rows.first()).toHaveAttribute('tabindex', '0')
    await expect(rows.nth(1)).toHaveAttribute('tabindex', '-1')
    await rows.first().focus()
    await page.keyboard.press('ArrowDown')
    await expect(rows.nth(1)).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/resources\/\d+$/)
  })

  test('a Documentation button says it opens a new tab', async ({ page }) => {
    await page.goto(`${DEMOS}/resources`)
    await expect(
      page.getByRole('link', { name: 'Documentation (opens in a new tab)' }).first()
    ).toBeVisible()
  })

  test('System stays selected in the account menu', async ({ page }) => {
    await page.goto(`${DEMOS}/resources`)
    const menu = page.getByRole('button', { name: /account menu/ }).first()
    await menu.click()
    await page.getByRole('menuitemradio', { name: 'System' }).click()
    await menu.click()
    await expect(page.getByRole('menuitemradio', { name: 'System' })).toHaveAttribute(
      'aria-checked',
      'true'
    )
  })

  test('one name per place: Agent, Integration keys, Profile', async ({ page }) => {
    await page.goto(`${DEMOS}/assistant`)
    await expect(page.getByRole('heading', { level: 1, name: 'Agent' })).toBeAttached()
    await page.goto(`${DEMOS}/settings/api-keys`)
    await expect(page.getByRole('heading', { level: 1, name: 'Integration keys' })).toBeVisible()
    await page.goto(`${DEMOS}/settings`)
    await expect(page.getByRole('heading', { level: 1, name: 'Profile' })).toBeVisible()
  })

  test('the sidebar Home never drops a signed-in user into onboarding', async ({ page }) => {
    await page.goto(`${DEMOS}/resources`)
    await expect(page.locator('nav a[href="/onboarding"]')).toHaveCount(0)
  })

  test('in right to left the author line keeps its own direction', async ({ page }) => {
    await page.goto(`${DEMOS}/resources/${FIRST}?dir=rtl`)
    const created = page.getByTestId('resource-detail__created')
    await expect(created).toHaveAttribute('dir', 'auto')
    expect(await created.evaluate((el) => getComputedStyle(el).direction)).toBe('ltr')
  })

  test('assistant answers a prompt', async ({ page }) => {
    await page.goto(`${DEMOS}/assistant`)
    await page.getByRole('textbox', { name: 'Prompt' }).fill('How do I purge one URL?')
    await page.keyboard.press('Enter')
    await expect(page.getByText('from the products menu').first()).toBeVisible({ timeout: 15_000 })
  })

  test('assistant asks before it deploys and reports the result', async ({ page }) => {
    await page.goto(`${DEMOS}/assistant`)
    await page.getByRole('textbox', { name: 'Prompt' }).fill('Deploy storefront to production')
    await page.keyboard.press('Enter')
    const deploy = page.getByRole('button', { name: 'Deploy', exact: true })
    await expect(deploy).toBeEnabled({ timeout: 15_000 })
    await deploy.click()
    await expect(page.getByTestId('tool-approval__outcome__label')).toHaveText('Approved')
    await expect(page.getByText('is live on production').first()).toBeVisible({ timeout: 15_000 })
  })
})
