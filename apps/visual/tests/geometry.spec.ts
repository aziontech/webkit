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

  for (const dir of ['ltr', 'rtl'] as const) {
    const mode: Mode = { theme, width: 1280, dir }
    test(`geometry table tree rows ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      const preview = await openExample(page, 'table/tree-rows', mode)
      await preview.locator('[data-tree-row="ws-1"] [data-testid$="__expand-toggle"]').click()
      await expect(preview.locator('[data-tree-row="cl-1"]')).toBeVisible()
      await settle(page)
      const start = async (id: string) => {
        const box = await preview
          .locator(`[data-tree-row="${id}"] [data-tree-gutter] + span`)
          .boundingBox()
        if (!box) throw new Error(`no name for ${id}`)
        return dir === 'rtl' ? -(box.x + box.width) : box.x
      }
      const [org1, org2, ws1, ws2, cl1] = await Promise.all(
        ['org-1', 'org-2', 'ws-1', 'ws-2', 'cl-1'].map(start)
      )
      expect(org2).toBeCloseTo(org1, 1)
      expect(ws2).toBeCloseTo(ws1, 1)
      expect(ws1 - org1).toBeCloseTo(16, 1)
      expect(cl1 - ws1).toBeCloseTo(16, 1)
      await expect(preview).toHaveScreenshot(shot(`geometry/table-tree-rows--${label(mode)}.png`))
    })
  }

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

const BALANCED_ROWS: Record<number, number[][]> = {
  768: [[2], [2, 2], [2, 2, 1]],
  1280: [[2], [2, 2], [3, 2]]
}

for (const theme of THEMES) {
  for (const width of [768, 1280]) {
    const mode: Mode = { theme, width }
    test(`geometry card grid balanced rows ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      const preview = await openExample(page, 'card-grid/balanced', mode)
      const grids = await preview
        .locator('[data-testid="marketing-card-grid"]')
        .evaluateAll((nodes) =>
          nodes.map((grid) => {
            const box = grid.getBoundingClientRect()
            const rows = new Map<number, DOMRect[]>()
            for (const cell of Array.from(grid.children)) {
              const rect = cell.getBoundingClientRect()
              const top = Math.round(rect.top)
              rows.set(top, [...(rows.get(top) ?? []), rect])
            }
            return [...rows.values()].map((cells) => ({
              count: cells.length,
              start: Math.min(...cells.map((c) => c.left)) - box.left,
              end: box.right - Math.max(...cells.map((c) => c.right)),
              spread:
                Math.max(...cells.map((c) => c.width)) - Math.min(...cells.map((c) => c.width))
            }))
          })
        )
      expect(grids.map((rows) => rows.map((row) => row.count))).toEqual(BALANCED_ROWS[width])
      for (const row of grids.flat()) {
        expect(Math.abs(row.start)).toBeLessThanOrEqual(1)
        expect(Math.abs(row.end)).toBeLessThanOrEqual(1)
        expect(row.spread).toBeLessThanOrEqual(1)
        expect(row.heights).toBeLessThanOrEqual(1)
      }
      await expect(preview).toHaveScreenshot(
        shot(`geometry/card-grid-balanced--${label(mode)}.png`)
      )
    })
  }

  for (const width of [390, 1280]) {
    const mode: Mode = { theme, width }
    test(`geometry site footer ends on its bottom bar ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      const preview = await openExample(page, 'site-footer/default', mode)
      const footer = preview.locator('footer[data-testid="layout-footer"]')
      const signature = footer.locator('[data-testid="layout-footer__signature"]')
      const social = footer.locator('[data-testid="layout-footer__social"]')
      const home = 'a[aria-label="Azion home"]'
      if (width >= 1024) {
        await expect(signature).toBeHidden()
        await expect(social.locator(home)).toBeVisible()
        const footerBox = await footer.boundingBox()
        const socialBox = await social.boundingBox()
        if (!footerBox || !socialBox) throw new Error('no footer')
        expect(
          footerBox.y + footerBox.height - (socialBox.y + socialBox.height)
        ).toBeLessThanOrEqual(1)
      } else {
        await expect(signature.locator(home)).toBeVisible()
        await expect(social.locator(home)).toBeHidden()
      }
      await expect(footer).toHaveScreenshot(shot(`geometry/site-footer-end--${label(mode)}.png`))
    })
  }
}
