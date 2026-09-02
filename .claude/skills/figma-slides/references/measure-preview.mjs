// measure-preview.mjs — turn the running /preview deck into slide coordinates.
//
// THIS IS THE BRIDGE. The Figma build needs absolute x/y for every element on a 1920x1080
// artboard; the preview already lays those elements out on exactly that artboard, so the
// coordinates exist and do not have to be invented. This script reads them off.
//
// It works because the preview keeps the slide at its true 1920x1080 size and only applies a
// CSS `scale()` (see the deck's SlideStage). Dividing every measured box by that scale recovers
// the artboard coordinate exactly — which is why the preview must never be built responsively.
//
// It reports the CLASS LIST with every box, and that is the whole token story: the design
// system's utilities carry their token names (`text-heading-xl`, `text-(--text-muted)`,
// `bg-(--primary)`), so no colour or type value has to be guessed or reverse-mapped from a
// computed pixel. Look the class up in SKILL.md's translation tables.
//
// USAGE
//   1. Serve the sample app:  cd apps/webkit-sample && npx vite build && npx vite preview --port 4319
//      (or `npx vite --port 4319` for the dev server; anything that serves /preview works)
//   2. node .claude/skills/figma-slides/references/measure-preview.mjs > /tmp/deck.json
//   3. Read /tmp/deck.json and build from it.
//
// Playwright is a workspace dev dependency and is not hoisted to the repo root, so resolve it
// from the pnpm store. Override with PLAYWRIGHT=<path to playwright/index.mjs> if the version
// in the path below has moved.
//
// ENV: URL (default http://localhost:4319/preview) · OUT (default stdout)

import { readdirSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'

const URL_ = process.env.URL ?? 'http://localhost:4319/preview'

const resolvePlaywright = () => {
  if (process.env.PLAYWRIGHT) return process.env.PLAYWRIGHT
  const require_ = createRequire(import.meta.url)
  try {
    return require_.resolve('playwright')
  } catch {
    const store = join(process.cwd(), 'node_modules/.pnpm')
    const dir = readdirSync(store).find((d) => d.startsWith('playwright@'))
    if (!dir) throw new Error('playwright not found — pnpm install, or set PLAYWRIGHT=<path>')
    return join(store, dir, 'node_modules/playwright/index.mjs')
  }
}

const { chromium } = await import(resolvePlaywright())

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } })
const problems = []
page.on('pageerror', (e) => problems.push(String(e.message)))
await page.goto(URL_, { waitUntil: 'networkidle' })
// The deck's own entrance motion (staggered code lines, the specimen bars) has to settle, or a
// measured box is a mid-transition box.
await page.waitForTimeout(3500)

const deck = await page.evaluate(() => {
  // Every slide is a scaled 1920x1080 stage. Find them by the frame the design system draws,
  // then walk up to the stage that carries the transform.
  const frames = [...document.querySelectorAll('[data-testid="layout-frame-box"]')]
  const stages = frames.map((f) => f.parentElement)

  const scaleOf = (stage) => {
    const m = new DOMMatrixReadOnly(getComputedStyle(stage).transform)
    return m.a || 1
  }

  // Only report a node that actually paints: text with characters, or a box with a fill, a
  // border or a measurable size. A layout wrapper contributes nothing to a Figma build.
  const paints = (el, style) => {
    const hasText = [...el.childNodes].some(
      (n) => n.nodeType === Node.TEXT_NODE && n.textContent.trim().length > 0
    )
    if (hasText) return 'TEXT'
    const border = ['Top', 'Right', 'Bottom', 'Left'].some(
      (s) => Number.parseFloat(style[`border${s}Width`]) > 0
    )
    const filled = style.backgroundColor !== 'rgba(0, 0, 0, 0)' || style.backgroundImage !== 'none'
    if (border || filled) return 'BOX'
    if (el.tagName === 'SVG' || el.tagName === 'svg' || el.tagName === 'IMG') return 'ASSET'
    return null
  }

  return stages.map((stage, index) => {
    const k = scaleOf(stage)
    const origin = stage.getBoundingClientRect()
    const toCanvas = (r) => ({
      x: Math.round((r.left - origin.left) / k),
      y: Math.round((r.top - origin.top) / k),
      w: Math.round(r.width / k),
      h: Math.round(r.height / k)
    })

    const nodes = []
    for (const el of stage.querySelectorAll('*')) {
      const style = getComputedStyle(el)
      if (style.display === 'none' || style.visibility === 'hidden') continue
      const kind = paints(el, style)
      if (!kind) continue
      const box = toCanvas(el.getBoundingClientRect())
      if (box.w === 0 || box.h === 0) continue
      const node = {
        kind,
        tag: el.tagName.toLowerCase(),
        ...box,
        // The token names live here. Read them; do not re-derive values from computed styles.
        classes: (el.getAttribute('class') ?? '').split(/\s+/).filter(Boolean)
      }
      if (kind === 'TEXT') {
        node.text = el.textContent.trim().replace(/\s+/g, ' ')
        // Resolved values, for a sanity check against the translation tables only.
        node.resolved = {
          fontFamily: style.fontFamily.split(',')[0].replace(/["']/g, ''),
          fontSize: Math.round(Number.parseFloat(style.fontSize) * 100) / 100,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
          letterSpacing: style.letterSpacing,
          textTransform: style.textTransform,
          color: style.color
        }
      }
      nodes.push(node)
    }
    return { index, scale: Math.round(k * 10000) / 10000, nodes }
  })
})

const notes = await page.evaluate(() =>
  [...document.querySelectorAll('details pre')].map((p) => p.textContent)
)

await browser.close()

const out = JSON.stringify({ url: URL_, slides: deck, speakerNotes: notes, problems }, null, 1)
if (process.env.OUT) {
  const { writeFileSync } = await import('node:fs')
  writeFileSync(process.env.OUT, out)
  console.error(`wrote ${process.env.OUT} — ${deck.length} slides`)
} else {
  console.log(out)
}
