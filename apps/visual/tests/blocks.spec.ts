import { expect, test } from '@playwright/test'

import { blocks, DOCS, label, type Mode, prepare, query, settle, shot } from './lib'

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

for (const block of blocks()) {
  const everyState = ALL_STATES.test(block.id)
  const states = everyState ? block.states : block.states.slice(0, 1)
  const modes = everyState ? EVERY_STATE : PRIMARY
  for (const state of states) {
    for (const mode of modes) {
      test(`block ${block.id} ${state.slug} ${label(mode)}`, async ({ page }) => {
        await prepare(page, mode)
        await page.goto(`${DOCS}/frame/${state.slug}/${block.id}${query(mode)}`)
        await settle(page)
        await expect(page).toHaveScreenshot(shot(`blocks/${block.id}/${state.slug}--${label(mode)}.png`))
      })
    }
  }
}
