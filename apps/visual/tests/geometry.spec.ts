import { expect, type Page, test } from '@playwright/test'

import { DOCS, label, type Mode, prepare, query, settle, shot } from './lib'

const THEMES = ['light', 'dark'] as const

async function openExample(page: Page, example: string, mode: Mode) {
  await page.goto(`${DOCS}/example${query(mode)}&path=${example}`)
  await page.locator('[data-example][data-ready]').waitFor()
  await settle(page)
  return page.locator('[data-example]')
}

for (const theme of THEMES) {
  for (const width of [360, 768, 1280]) {
    const mode: Mode = { theme, width }
    test(`geometry table cell presets ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      const preview = await openExample(page, 'table/cell-presets', mode)
      await expect(preview).toHaveScreenshot(
        shot(`geometry/table-cell-presets--${label(mode)}.png`)
      )
    })
  }

  test(`geometry table reorder mid-drag with frozen columns ${theme}`, async ({ page }) => {
    const mode: Mode = { theme, width: 1280 }
    await prepare(page, mode)
    const preview = await openExample(page, 'table/reorderable-frozen', mode)
    await preview.evaluate((el) => el.scrollIntoView({ block: 'center' }))
    const grips = preview.locator('[data-reorder-handle]')
    const first = await grips.nth(0).boundingBox()
    const third = await grips.nth(2).boundingBox()
    if (!first || !third) throw new Error('no grips')
    await page.mouse.move(first.x + first.width / 2, first.y + first.height / 2)
    await page.mouse.down()
    await page.mouse.move(third.x + third.width / 2, third.y + third.height / 2 + 4, { steps: 6 })
    await expect(preview.locator('[data-dragging]')).toHaveCount(1)
    await expect(preview.locator('[data-drop]')).not.toHaveCount(0)
    const box = await preview.boundingBox()
    if (!box) throw new Error('no preview')
    await expect(page).toHaveScreenshot(shot(`geometry/table-reorder-drag--${label(mode)}.png`), {
      clip: box
    })
    await page.mouse.up()
  })

  test(`geometry table reorder frozen columns scrolled ${theme}`, async ({ page }) => {
    const mode: Mode = { theme, width: 768 }
    await prepare(page, mode)
    const preview = await openExample(page, 'table/reorderable-frozen', mode)
    await preview
      .locator('[data-testid$="__viewport"]')
      .first()
      .evaluate((el) => {
        el.scrollLeft = 160
      })
    await expect(preview).toHaveScreenshot(
      shot(`geometry/table-reorder-scrolled--${label(mode)}.png`)
    )
  })

  test(`geometry overflow count open ${theme}`, async ({ page }) => {
    const mode: Mode = { theme, width: 1280 }
    await prepare(page, mode)
    const preview = await openExample(page, 'overflow-count/long-list', mode)
    await preview.getByRole('button').first().click()
    const dialog = page.getByRole('dialog').last()
    await expect(dialog).toBeVisible()
    await expect(page).toHaveScreenshot(shot(`geometry/overflow-count-open--${label(mode)}.png`))
  })

  for (const width of [320, 1280]) {
    const mode: Mode = { theme, width }
    test(`geometry otp input grouped ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      const preview = await openExample(page, 'otp-input/grouped', mode)
      await preview.locator('input').first().focus()
      await expect(preview).toHaveScreenshot(shot(`geometry/otp-input-grouped--${label(mode)}.png`))
    })
  }

  for (const [id, state] of [
    ['platform/account/team-permissions', 'default'],
    ['platform/account/tokens', 'created'],
    ['shells/console', 'account-switch']
  ] as const) {
    for (const mode of [
      { theme, width: 320 },
      { theme, width: 1920 },
      { theme, width: 1280, dir: 'rtl' }
    ] as Mode[]) {
      test(`geometry ${id} ${state} ${label(mode)}`, async ({ page }) => {
        await prepare(page, mode)
        await page.goto(`${DOCS}/frame/${state}/${id}${query(mode)}`)
        await settle(page)
        if (state === 'account-switch') {
          await page
            .getByRole('button', { name: /Switch account/ })
            .first()
            .click()
          await expect(page.getByRole('dialog').last()).toBeVisible()
          await settle(page)
        }
        await expect(page).toHaveScreenshot(
          shot(`geometry/${id.split('/').pop()}-${state}--${label(mode)}.png`)
        )
      })
    }
  }
}

for (const example of [
  'button/default',
  'checkbox/default',
  'switch/default',
  'tabs/default',
  'status-indicator/default',
  'chart/default',
  'spark-chart/default',
  'gauge-chart/default'
]) {
  test(`forced colors ${example}`, async ({ page }) => {
    const mode: Mode = { theme: 'dark', width: 1280 }
    await prepare(page, mode)
    await page.emulateMedia({ forcedColors: 'active', colorScheme: 'dark' })
    const preview = await openExample(page, example, mode)
    await expect(preview).toHaveScreenshot(
      shot(`forced-colors/${example.replace('/', '-')}--${label(mode)}.png`)
    )
  })
}
