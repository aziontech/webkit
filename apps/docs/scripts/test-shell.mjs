import { chromium } from 'playwright'

import { probeScript } from './lib/shell-probes.mjs'
import { serve } from './serve.mjs'

const server = await serve(0)
const origin = `http://localhost:${server.address().port}`
const browser = await chromium.launch()
const failures = []
const results = []

async function check(name, viewport, run, options = {}) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce', ...options })
  await context.addInitScript({ content: probeScript })
  const page = await context.newPage()
  const open = async (path) => {
    await page.goto(origin + path, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1200)
  }
  try {
    const problem = await run(page, open)
    if (problem) failures.push(`${name}: ${problem}`)
    results.push(`${problem ? '✗' : '✓'} ${name}`)
  } catch (error) {
    failures.push(`${name}: ${error.message.split('\n')[0]}`)
    results.push(`✗ ${name}`)
  }
  await context.close()
}

const DESKTOP = { width: 1280, height: 800 }
const PHONE = { width: 390, height: 844 }
const TOUCH = { isMobile: true, hasTouch: true }

await check('landmarks of one role never share a name', DESKTOP, async (page, open) => {
  await open('/components/data-table')
  const list = await page.evaluate(() => window.__docsProbe.landmarks())
  const seen = new Map()
  for (const { role, name } of list)
    seen.set(`${role} "${name}"`, (seen.get(`${role} "${name}"`) ?? 0) + 1)
  const shared = [...seen].filter(([key, count]) => count > 1 && !key.endsWith('""'))
  const generic = list.filter((entry) => entry.name === 'Documentation')
  if (shared.length) return `shared names ${shared.map(([key]) => key).join(', ')}`
  if (generic.length) return `${generic.length} landmarks still named "Documentation"`
})

await check(
  'a client navigation focuses the new page and announces it',
  DESKTOP,
  async (page, open) => {
    await open('/')
    await page.keyboard.press('Control+k')
    await page.keyboard.type('dialog')
    await page.keyboard.press('Enter')
    await page.waitForURL('**/components/dialog')
    await page.waitForTimeout(500)
    const state = await page.evaluate(() => ({
      inMain: Boolean(document.activeElement?.closest('#main')),
      said: document.querySelector('[data-docs-announcer]')?.textContent?.trim() ?? ''
    }))
    if (!state.inMain) return 'focus stayed outside the main region'
    if (!/Dialog/.test(state.said)) return `the live region said "${state.said}"`
  }
)

await check(
  'in right-to-left the drawer opens on the edge of its button',
  { width: 768, height: 800 },
  async (page, open) => {
    await open('/components/button')
    await page.locator('header [data-docs-direction]').click()
    await page.getByRole('button', { name: 'Open navigation' }).click()
    await page.waitForTimeout(400)
    const box = await page.getByRole('dialog').boundingBox()
    if (!box || box.x + box.width < 760) return `drawer at x=${box?.x} w=${box?.width}`
  }
)

await check(
  'the phone drawer holds the language, direction and theme switches',
  PHONE,
  async (page, open) => {
    await open('/')
    await page.getByRole('button', { name: 'Open navigation' }).click()
    const settings = page.getByRole('dialog').locator('[data-docs-drawer-settings]')
    await settings.waitFor()
    if (!(await settings.locator('[data-testid="language-select"]').count()))
      return 'no language switch'
    if (!(await settings.locator('[data-docs-direction]').count())) return 'no direction switch'
  }
)

await check(
  'at 320 the brand never runs under the header controls',
  { width: 320, height: 640 },
  async (page, open) => {
    await open('/')
    const brand = await page.locator('header a[href="/"]').first().boundingBox()
    const search = await page.locator('header [data-testid="search-trigger"]').first().boundingBox()
    if (brand && search && brand.x + brand.width > search.x)
      return `brand ends at ${brand.x + brand.width}, search starts at ${search.x}`
  }
)

await check('a blocks filter with no match says so', PHONE, async (page, open) => {
  await open('/blocks')
  await page.getByRole('textbox', { name: 'Filter' }).fill('zzqx')
  if (!(await page.locator('[data-docs-empty][role="status"]').count())) return 'no empty state'
})

await check('block cards carry a short purpose', DESKTOP, async (page, open) => {
  await open('/blocks')
  const words = await page.$$eval('[data-testid="doc-card"]', (cards) =>
    Math.max(...cards.map((card) => (card.textContent ?? '').trim().split(/\s+/).length))
  )
  if (words > 26) return `a card holds ${words} words`
})

await check('the sidebar shows the page you are on', DESKTOP, async (page, open) => {
  await open('/components/hero-section')
  await page.waitForTimeout(500)
  const box = await page
    .locator('[data-testid="sidebar"] [aria-current="page"]')
    .first()
    .boundingBox()
  if (!box || box.y < 0 || box.y + box.height > DESKTOP.height) return `active item at y=${box?.y}`
})

await check('a block page opens on its preview', DESKTOP, async (page, open) => {
  await open('/blocks/dashboard/dashboard-alerts')
  const box = await page.locator('#preview').boundingBox()
  if (!box || box.y > DESKTOP.height) return `preview starts at y=${box?.y}`
})

await check('an example heading is not smaller than its summary', DESKTOP, async (page, open) => {
  await open('/components/button')
  const sizes = await page.evaluate(() => {
    const size = (el) => (el ? parseFloat(getComputedStyle(el).fontSize) : 0)
    return [
      size(document.querySelector('[data-docs-example-title]')),
      size(document.querySelector('[data-docs-example-summary] p'))
    ]
  })
  if (sizes[0] < sizes[1]) return `heading ${sizes[0]}px, summary ${sizes[1]}px`
})

await check('foundation prose keeps a reading measure', DESKTOP, async (page, open) => {
  await open('/foundations/accessibility')
  const widest = await page.$$eval('#main [data-testid="doc-prose"] p', (list) => {
    const probe = document.createElement('span')
    probe.textContent = '0'
    return Math.max(
      ...list.map((p) => {
        p.append(probe)
        const ch = probe.getBoundingClientRect().width
        probe.remove()
        return p.getBoundingClientRect().width / ch
      })
    )
  })
  if (widest > 70) return `a paragraph is ${widest.toFixed(0)}ch wide`
})

await check(
  'a long foundation page has an outline, anchors and copyable code',
  { width: 1600, height: 900 },
  async (page, open) => {
    await open('/foundations/getting-started')
    const outline = await page.locator('[data-docs-toc] a').count()
    const anchors = await page.locator('#main h2[id]').count()
    const blocks = await page.locator('[data-docs-code]').count()
    const copies = await page.locator('[data-docs-code] [data-testid="copy-button"]').count()
    if (outline < 3 || anchors < 3) return `${outline} outline links, ${anchors} h2 anchors`
    if (!blocks || copies < blocks) return `${blocks} code blocks, ${copies} copy buttons`
  }
)

await check(
  'below 2xl the outline is a collapsible list',
  { width: 768, height: 900 },
  async (page, open) => {
    await open('/components/data-table')
    if (!(await page.locator('[data-docs-toc-compact]').isVisible())) return 'no compact outline'
  }
)

await check('icon names break only at hyphens', DESKTOP, async (page, open) => {
  await open('/foundations/icon')
  const bad = await page.$$eval('[data-docs-icon-name]', (list) =>
    list.filter((el) => !window.__docsProbe.breaksOnlyAtHyphens(el)).map((el) => el.textContent)
  )
  if (bad.length) return `split mid-word: ${bad.slice(0, 3).join(', ')}`
})

await check(
  'code in a phone table breaks only at hyphens',
  { width: 320, height: 640 },
  async (page, open) => {
    await open('/foundations/devices')
    const bad = await page.$$eval('#main td code', (list) =>
      list.filter((el) => !window.__docsProbe.breaksOnlyAtHyphens(el)).map((el) => el.textContent)
    )
    if (bad.length) return `split mid-word: ${bad.slice(0, 3).join(', ')}`
  }
)

await check('every z-index token says when to use it', DESKTOP, async (page, open) => {
  await open('/foundations/z-index')
  if (!(await page.getByText('The layer of overlays', { exact: false }).count()))
    return 'no purpose text'
})

await check('shadow samples show the light and the dark theme', DESKTOP, async (page, open) => {
  await open('/foundations/shadow')
  const themes = await page.$$eval('[data-docs-shadow-sample] [data-theme]', (list) =>
    list.map((el) => el.dataset.theme)
  )
  if (!themes.includes('light') || !themes.includes('dark')) return `themes ${themes.join(',')}`
})

await check(
  'touch category chips are at least 40px tall',
  PHONE,
  async (page, open) => {
    await open('/components')
    const box = await page.locator('[data-docs-category-chip]').first().boundingBox()
    if (!box || box.height < 40) return `chip ${box?.height}px`
  },
  TOUCH
)

await check(
  'phone search uses the height of the sheet',
  PHONE,
  async (page, open) => {
    await open('/')
    await page.locator('header [data-testid="search-trigger"]').first().click()
    await page.keyboard.type('a')
    await page.waitForTimeout(300)
    const box = await page.locator('[data-testid="command-list"]').boundingBox()
    if (!box || box.height < PHONE.height * 0.6) return `list ${box?.height}px of ${PHONE.height}px`
  },
  TOUCH
)

await browser.close()
server.close()
console.log(results.join('\n'))
if (failures.length) console.log(`\n${failures.join('\n')}`)
process.exit(failures.length ? 1 : 0)
