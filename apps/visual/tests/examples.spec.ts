import { expect, test } from '@playwright/test'

import { DOCS, exampleGroups, label, type Mode, prepare, query, settle, stem, shot } from './lib'

const MODES: Mode[] = [
  { theme: 'light', width: 1280 },
  { theme: 'dark', width: 1280 },
  { theme: 'light', width: 390 }
]

for (const group of exampleGroups()) {
  const [first] = group.examples
  if (!first) continue
  for (const mode of MODES) {
    test(`example ${group.dir}/${stem(first.file)} ${label(mode)}`, async ({ page }) => {
      await prepare(page, mode)
      await page.goto(`${DOCS}/example/${group.dir}/${stem(first.file)}${query(mode)}`)
      await settle(page)
      await expect(page).toHaveScreenshot(shot(`examples/${group.dir}/${stem(first.file)}--${label(mode)}.png`))
    })
  }
}
