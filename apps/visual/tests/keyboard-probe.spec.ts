import { expect, test } from '@playwright/test'

import { sweepKeyboard } from './keyboard'

const STRIP = `
<main>
  <button id="previous" type="button" disabled>Previous</button>
  <a href="#one">One</a>
  <a id="two" href="#two">Two</a>
  <button type="button">Next</button>
</main>
<script>
  document.getElementById('two').addEventListener('focus', () => {
    document.getElementById('previous').disabled = false
  })
</script>
`

test('a control enabled only after Tab passed it is not reported as unreached', async ({
  page
}) => {
  await page.setContent(STRIP)
  const result = await sweepKeyboard(page, { entry: 'page' }, { maxStops: 3 })
  expect(result.violations.filter((v) => v.startsWith('reach:'))).toEqual([])
})

test('a control enabled the whole time and skipped by Tab is still reported', async ({ page }) => {
  await page.setContent(`<main><a href="#one">One</a><div role="button">Not focusable</div></main>`)
  const result = await sweepKeyboard(page, { entry: 'page' })
  expect(result.violations.some((v) => v.startsWith('reach:'))).toBe(true)
})
