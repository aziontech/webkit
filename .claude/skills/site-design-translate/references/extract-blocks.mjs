#!/usr/bin/env node
// Block extractor for /site-design-translate.
//
// Navigates a live marketing page and emits an ORDERED block inventory: for every
// band of the page, its verbatim copy (headings, paragraphs, list items, link
// labels, image alts, code) plus the geometry that says what shape the band is
// (width, height, column count, whether it scrolls). That inventory is the input
// to the translation — the page is read once, mechanically, so no block is
// paraphrased from memory and none is dropped.
//
// Two passes, because a marketing page hides content two ways:
//
//   1. IN THE DOM. A carousel duplicates its track for the CSS loop, a tab panel
//      renders all panels, a "show more" list renders every row. Reading the DOM
//      finds all of it; de-duplication (below) is what keeps a doubled track from
//      becoming two blocks.
//   2. BEHIND A CLICK. A tab whose panel mounts on activation, an accordion, a
//      carousel whose slides mount on scroll. `--probe` clicks every
//      [role=tab] / [aria-expanded] control once and re-reads, so those land too.
//
// Usage:
//   node extract-blocks.mjs <url> [--out DIR] [--probe] [--widths 1440,768,375]
//
// Writes to DIR (default ./site-translate/<host><path>):
//   blocks.json    the inventory (ordered, one entry per band)
//   blocks.md      the same thing as a review-able checklist
//   page-<w>.png   a full-page screenshot per width
//
// Playwright is not a root dependency of this repo; it ships inside the storybook
// app's node_modules. Resolve it from there, and say so plainly when it is absent.

import { mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join, resolve } from 'node:path'

const require_ = createRequire(import.meta.url)
const REPO = resolve(new URL('../../../..', import.meta.url).pathname)

function loadPlaywright() {
  for (const id of ['playwright', 'apps/storybook/node_modules/playwright']) {
    try {
      return require_(id.startsWith('apps/') ? join(REPO, id) : id)
    } catch {
      /* try the next location */
    }
  }
  console.error(
    'BLOCKED: playwright is not resolvable. Expected it at apps/storybook/node_modules/playwright.'
  )
  process.exit(2)
}

const argv = process.argv.slice(2)
const url = argv.find((a) => !a.startsWith('--'))
if (!url) {
  console.error('usage: node extract-blocks.mjs <url> [--out DIR] [--probe] [--widths 1440,768]')
  process.exit(2)
}
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`)
  return i === -1 ? fallback : argv[i + 1]
}
const probe = argv.includes('--probe')
const widths = String(flag('widths', '1440,768,375'))
  .split(',')
  .map((n) => Number(n.trim()))
  .filter(Boolean)
const target = new URL(url)
const outDir = resolve(
  flag('out', join(process.cwd(), 'site-translate', target.host + target.pathname.replace(/\/$/, '')))
)
mkdirSync(outDir, { recursive: true })

// ── The in-page reader ────────────────────────────────────────────────────────
// Runs in the page. Everything it returns is either verbatim text from the DOM or
// a measured number; it never interprets. Interpretation is the skill's job.
const READER = () => {
  const text = (el) => (el.textContent || '').replace(/\s+/g, ' ').trim()
  const visible = (el) => {
    const r = el.getBoundingClientRect()
    const s = getComputedStyle(el)
    return r.width > 4 && r.height > 4 && s.visibility !== 'hidden' && s.display !== 'none'
  }

  // A BAND is the outermost element that spans (almost) the full content width and
  // stacks vertically with its siblings. Marketing pages express this as <section>,
  // so prefer those; fall back to the direct children of <main> when a page uses
  // divs. Nested sections are folded into their parent band — the parent is the
  // block a page reads as one.
  const root = document.querySelector('main') || document.body
  const sections = [...root.querySelectorAll('section')].filter(visible)
  // Outermost only: a page nests sections inside sections (a split band is two sections
  // inside one), and the band a reader perceives is the outer one.
  let bands = sections.filter((el) => !sections.some((other) => other !== el && other.contains(el)))
  if (bands.length === 0) bands = [...root.children].filter(visible)

  // De-duplicate a CSS marquee: the track holds its row twice so the loop is
  // seamless, and one of the copies is normally aria-hidden. Read the first copy,
  // and report that the band repeats.
  const marks = (band) => {
    const imgs = [...band.querySelectorAll('img, svg[aria-label], [role=img]')].filter(visible)
    const named = imgs
      .map((el) => el.getAttribute('alt') || el.getAttribute('aria-label') || '')
      .map((s) => s.trim())
      .filter(Boolean)
    const unique = [...new Set(named)]
    return { names: unique, count: named.length, repeats: named.length > unique.length }
  }

  // The EYEBROW is the one piece of copy a heading-only reader always loses. On this
  // page language a band's label is a small uppercase span, not an <h#> — "YOUR STACK,
  // YOUR WAY" and every card's category line are spans, so a reader that only looks at
  // h1..h6/p/li drops the label of the band it is describing. Read them by their
  // rendered form (uppercase, small, leaf) rather than by a class name, so the same
  // reader works on a page whose classes we have never seen.
  const eyebrowsOf = (band) =>
    [
      ...new Set(
        [...band.querySelectorAll('span, p, div, small, strong, em')]
          .filter((el) => el.children.length === 0 && visible(el))
          .filter((el) => {
            const s = getComputedStyle(el)
            const size = parseFloat(s.fontSize)
            const t = text(el)
            if (!t || t.length > 60 || size > 18) return false
            return s.textTransform === 'uppercase' || (t === t.toUpperCase() && /[A-Z]{3}/.test(t))
          })
          .map(text)
      )
    ]

  const codeOf = (band) =>
    [...band.querySelectorAll('pre, code, [data-raw-code]')]
      .filter((el) => visible(el) || el.hasAttribute('data-raw-code'))
      .map((el) => {
        const raw = el.getAttribute('data-raw-code')
        return raw ? decodeURIComponent(raw) : text(el)
      })
      .filter((s) => s.length > 12)
      .slice(0, 3)

  // Column count, measured rather than parsed out of class names: group the band's
  // leaf content cells by their left edge. Two cells sharing a left edge are one
  // column. This is what tells a 4-up hairline grid from a 2-up split band.
  const columnsOf = (band) => {
    const cells = [...band.querySelectorAll(':scope > * > *, :scope > * > * > *')].filter(visible)
    if (cells.length < 2) return 1
    const lefts = new Set(cells.map((el) => Math.round(el.getBoundingClientRect().left / 8) * 8))
    return Math.max(1, Math.min(lefts.size, 6))
  }

  return bands.map((band, index) => {
    const rect = band.getBoundingClientRect()
    const headings = [...band.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      .filter(visible)
      .map((el) => ({ level: el.tagName.toLowerCase(), text: text(el) }))
      .filter((h) => h.text)
    const paragraphs = [
      ...new Set(
        [...band.querySelectorAll('p')]
          .filter(visible)
          .map(text)
          .filter((t) => t.length > 2 && !/^[\d\s%x+.]+$/.test(t))
      )
    ]
    const listItems = [...new Set([...band.querySelectorAll('li')].filter(visible).map(text))]
    const links = [...band.querySelectorAll('a[href]')]
      .filter(visible)
      .map((el) => ({ label: text(el), href: el.getAttribute('href') }))
      .filter((l) => l.label || l.href)
    const buttons = [...new Set([...band.querySelectorAll('button')].filter(visible).map(text))]
      .filter(Boolean)
    // Numerals set large are the page's stat cells — worth flagging separately, since
    // they translate to a different shape than a paragraph.
    // A stat cell is one numeral and one unit set large, usually as two elements — read
    // them as separate entries in DOM order so `7` + `x` + `faster pages` stays legible
    // as one cell. 32px is the floor: below it a large heading word is indistinguishable
    // from a number, above it a `text-big-number` unit glyph would be missed.
    const bigNumbers = [...band.querySelectorAll('p,span,div,strong')]
      .filter(visible)
      .filter((el) => el.children.length === 0 && parseFloat(getComputedStyle(el).fontSize) >= 32)
      .map(text)
      .filter((t) => t && t.length <= 16)
    const scroller = [...band.querySelectorAll('*')].some(
      (el) => el.scrollWidth > el.clientWidth + 32 && /auto|scroll|hidden/.test(getComputedStyle(el).overflowX)
    )
    const style = getComputedStyle(band)
    const eyebrows = eyebrowsOf(band)
    // The verbatim record. Every structured field above is a shape decision waiting to be
    // made; this is the band's copy exactly as a reader sees it, and it is what the
    // finished translation is diffed against.
    const innerText = (band.innerText || '').replace(/\n{3,}/g, '\n\n').trim()
    const headingText = new Set(headings.map((h) => h.text))
    return {
      index,
      tag: band.tagName.toLowerCase(),
      id: band.id || null,
      height: Math.round(rect.height),
      fullBleed: rect.width >= window.innerWidth - 2,
      viewportTall: rect.height >= window.innerHeight * 0.85,
      empty:
        headings.length === 0 &&
        paragraphs.length === 0 &&
        listItems.length === 0 &&
        links.length === 0 &&
        buttons.length === 0 &&
        marks(band).names.length === 0,
      borders: {
        top: style.borderTopWidth !== '0px',
        right: style.borderRightWidth !== '0px',
        bottom: style.borderBottomWidth !== '0px',
        left: style.borderLeftWidth !== '0px'
      },
      columns: columnsOf(band),
      scroller,
      headings,
      paragraphs: paragraphs.filter((t) => !headingText.has(t) && !eyebrows.includes(t)),
      listItems,
      links,
      buttons,
      bigNumbers,
      eyebrows,
      marks: marks(band),
      code: codeOf(band),
      innerText
    }
  })
}

const { chromium } = loadPlaywright()
const browser = await chromium.launch()
const results = {}

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 1000 } })
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 }).catch(() => {})

  // A CONSENT BANNER IS NOT A BLOCK. It is fixed to the viewport, so it covers whichever
  // band happens to be under it in every screenshot and lands its own copy in the
  // inventory. Accept it if there is a button to accept, then suppress anything still
  // pinned to the viewport — a sticky bar, a chat bubble, a promo rail. None of them are
  // part of the page's block language, and all of them ruin a band capture.
  for (const label of [/^accept/i, /^allow/i, /^agree/i, /^got it/i, /^ok$/i]) {
    await page
      .getByRole('button', { name: label })
      .first()
      .click({ timeout: 1200 })
      .catch(() => {})
  }
  await page.addStyleTag({
    content: '[class*=cookie],[id*=cookie],[class*=consent],[id*=consent],[aria-label*=cookie i]{display:none!important}'
  })
  await page.evaluate(() => {
    for (const el of document.body.querySelectorAll('*')) {
      const s = getComputedStyle(el)
      if ((s.position === 'fixed' || s.position === 'sticky') && el.getBoundingClientRect().height > 24) {
        el.setAttribute('data-suppressed-overlay', '')
        el.style.setProperty('display', 'none', 'important')
      }
    }
  })

  // Pages reveal bands on scroll, so walk the whole thing once before reading. WHICH
  // ELEMENT SCROLLS is not a given: a marketing page scrolls the window, but an app
  // shell commonly pins html/body to the viewport and scrolls a container inside it —
  // and on such a page `window.scrollTo` moves nothing, every lazy band stays unmounted,
  // and the inventory comes back missing content that is really there. So find the
  // tallest actual scroller and drive that one, falling back to the window.
  await page.evaluate(async () => {
    const scrollers = [...document.querySelectorAll('*')].filter((el) => {
      const s = getComputedStyle(el)
      return (
        el.scrollHeight > el.clientHeight + 64 &&
        /auto|scroll/.test(s.overflowY) &&
        el.clientHeight > 200
      )
    })
    const target = scrollers.sort((a, b) => b.scrollHeight - a.scrollHeight)[0] || null
    const total = target ? target.scrollHeight : document.body.scrollHeight
    const step = (target ? target.clientHeight : window.innerHeight) / 2
    for (let y = 0; y < total; y += step) {
      if (target) target.scrollTop = y
      else window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 90))
    }
    if (target) target.scrollTop = 0
    else window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 250))
  })

  if (probe) {
    // One click per disclosure control, so content that mounts on activation is in
    // the DOM when the reader runs. Failures are expected (a control may navigate)
    // and are ignored.
    const controls = await page.locator('[role=tab], [aria-expanded], [data-state]').all()
    for (const control of controls.slice(0, 40)) {
      await control.click({ timeout: 800, trial: false }).catch(() => {})
    }
    await page.waitForTimeout(400)
  }

  results[width] = await page.evaluate(READER)
  const shot = join(outDir, `page-${width}.png`)

  // One capture per band, at the primary width only. A band you can look at on its own
  // is what makes the shape call (2-up split, 4-up hairline grid, mosaic, marquee)
  // reviewable — the full-page shot is too long to read a single band out of.
  if (width === widths[0]) {
    const count = await page.evaluate(() => {
      const root = document.querySelector('main') || document.body
      const vis = (el) => {
        const r = el.getBoundingClientRect()
        const c = getComputedStyle(el)
        return r.width > 4 && r.height > 4 && c.visibility !== 'hidden' && c.display !== 'none'
      }
      const sections = [...root.querySelectorAll('section')].filter(vis)
      let bands = sections.filter((el) => !sections.some((o) => o !== el && o.contains(el)))
      if (bands.length === 0) bands = [...root.children].filter(vis)
      bands.forEach((el, i) => el.setAttribute('data-band-index', String(i)))
      return bands.length
    })
    for (let i = 0; i < count; i += 1) {
      await page
        .locator(`[data-band-index="${i}"]`)
        .screenshot({ path: join(outDir, `band-${String(i).padStart(2, '0')}.png`) })
        .catch(() => {})
    }
  }

  // THE FULL-PAGE SHOT GOES LAST, because taking it changes the page. `fullPage`
  // measures the DOCUMENT, and an app shell that pins html/body to the viewport and
  // scrolls a container inside it has a one-viewport document — so `fullPage` there
  // captures the first screen and calls it the page. An element screenshot of the
  // scroller is no better: it captures the element's visible box, not its scrollback.
  // Lifting the height lock lets the document grow to the real content height, which is
  // what `fullPage` then measures. Everything above is already read, so mutating the
  // layout now costs nothing.
  await page.evaluate(() => {
    for (const el of document.querySelectorAll('*')) {
      const s = getComputedStyle(el)
      if (el.scrollHeight > el.clientHeight + 64 && /auto|scroll/.test(s.overflowY)) {
        el.setAttribute('data-unlock-scroller', '')
      }
    }
  })
  await page.addStyleTag({
    content:
      'html,body,#app,#root,[data-unlock-scroller]{height:auto!important;max-height:none!important;overflow:visible!important}'
  })
  await page.waitForTimeout(300)
  await page.screenshot({ path: shot, fullPage: true })

  await page.close()
}

await browser.close()

const primary = widths[0]
const bands = results[primary]
writeFileSync(
  join(outDir, 'blocks.json'),
  JSON.stringify({ url, widths, extractedAt: null, bands, byWidth: results }, null, 2)
)

// The review-able form. This is what a human reads to confirm nothing was dropped,
// and what the translation is diffed against when it is done.
const lines = [`# Block inventory — ${url}`, '', `Bands: **${bands.length}** at ${primary}px.`, '']
for (const b of bands) {
  const shape = [
    b.viewportTall && 'viewport-tall',
    b.fullBleed && 'full-bleed',
    b.empty && 'EMPTY (spacer)',
    b.columns > 1 && `${b.columns} columns`,
    b.scroller && 'horizontal scroller',
    b.marks.repeats && 'repeating track (marquee)'
  ]
    .filter(Boolean)
    .join(' · ')
  lines.push(`## ${b.index}. ${b.headings[0]?.text || b.id || '(no heading)'}`)
  lines.push(`- shape: ${shape || 'plain band'} · height ${b.height}px`)
  for (const e of b.eyebrows) lines.push(`- eyebrow: ${e}`)
  for (const h of b.headings) lines.push(`- ${h.level}: ${h.text}`)
  for (const p of b.paragraphs) lines.push(`- p: ${p}`)
  for (const li of b.listItems) lines.push(`- li: ${li}`)
  for (const n of b.bigNumbers) lines.push(`- number: ${n}`)
  for (const l of b.links) lines.push(`- link: ${l.label || '(icon)'} → ${l.href}`)
  for (const t of b.buttons) lines.push(`- button: ${t}`)
  if (b.marks.names.length) lines.push(`- marks (${b.marks.names.length}): ${b.marks.names.join(', ')}`)
  for (const c of b.code) lines.push(`- code:\n\n\`\`\`\n${c}\n\`\`\`\n`)
  lines.push('')
}
writeFileSync(join(outDir, 'blocks.md'), lines.join('\n'))
console.log(`${bands.length} bands → ${outDir}`)
