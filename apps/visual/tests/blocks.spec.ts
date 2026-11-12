import { expect, test } from '@playwright/test'

import { advance, blocks, DOCS, label, type Mode, prepare, query, settle, shot } from './lib'

const PRIMARY: Mode[] = [
  { theme: 'light', width: 1280 },
  { theme: 'dark', width: 1280 },
  { theme: 'dark', width: 390 }
]

const EVERY_STATE: Mode[] = [
  { theme: 'light', width: 1280 },
  { theme: 'dark', width: 1280 },
  { theme: 'light', width: 320 },
  { theme: 'dark', width: 320 },
  { theme: 'dark', width: 1280, dir: 'rtl' }
]

const ALL_STATES = /^platform\/ai\//

const DOCS_PAGES = /^shells\/documentation$/

const DOCS_MODES: Mode[] = [
  { theme: 'light', width: 1440 },
  { theme: 'dark', width: 1440 },
  { theme: 'light', width: 390 },
  { theme: 'dark', width: 390 }
]

const TIMED = new Set(['streaming'])

for (const block of blocks()) {
  const docsPages = DOCS_PAGES.test(block.id)
  const everyState = ALL_STATES.test(block.id) || docsPages
  const states = everyState ? block.states : block.states.slice(0, 1)
  const modes = docsPages ? DOCS_MODES : everyState ? EVERY_STATE : PRIMARY
  for (const state of states) {
    for (const mode of modes) {
      test(`block ${block.id} ${state.slug} ${label(mode)}`, async ({ page }) => {
        const timed = TIMED.has(state.slug)
        await prepare(page, mode, { freeze: timed })
        await page.goto(`${DOCS}/frame/${state.slug}/${block.id}${query(mode)}`)
        if (timed) await advance(page, 1500)
        else await settle(page)
        await expect(page).toHaveScreenshot(
          shot(`blocks/${block.id}/${state.slug}--${label(mode)}.png`)
        )
      })
    }
  }
}

for (const mode of DOCS_MODES) {
  test(`block shells/documentation landing agent card ${label(mode)}`, async ({ page }) => {
    await prepare(page, mode)
    await page.goto(`${DOCS}/frame/landing/shells/documentation${query(mode)}`)
    await settle(page)
    await page.getByTestId('documentation-doc-agent-card').scrollIntoViewIfNeeded()
    await settle(page)
    await expect(page).toHaveScreenshot(
      shot(`blocks/shells/documentation/landing-agent-card--${label(mode)}.png`)
    )
  })
}
