#!/usr/bin/env node
// Copy diff between two block inventories produced by extract-blocks.mjs.
//
//   node diff-inventories.mjs <source/blocks.json> <ours/blocks.json>
//
// Answers one question: does our page say everything the source page says, and
// nothing else? It compares the SET of copy lines, not their order or their band —
// a line that moved from one band to another is not a content loss, and holding the
// band index constant would flag every legitimate re-shaping as a difference.
//
// Normalization is deliberately shallow: case, whitespace, and the punctuation that
// differs between an <h1> that wraps ("...applications.Everywhere.") and the two
// lines a reader sees. It does NOT stem, fuzzy-match, or drop words — a paraphrase
// must show up as one missing line and one extra line, which is exactly the signal
// this script exists to produce.
//
// Exit code is 1 when anything is missing, so it can gate a run.

import { readFileSync } from 'node:fs'

const [, , aPath, bPath] = process.argv
if (!aPath || !bPath) {
  console.error('usage: node diff-inventories.mjs <source/blocks.json> <ours/blocks.json>')
  process.exit(2)
}

const load = (p) => JSON.parse(readFileSync(p, 'utf8'))

// One line of copy, comparable. Curly quotes and the various dashes and spaces a CMS
// emits are folded to their ASCII form so a typographic difference is not read as a
// content difference; everything else about the words is preserved.
const norm = (s) =>
  String(s)
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[‐-―−]/g, '-')
    .replace(/[    ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

// Every line of copy a page renders, from the structured fields rather than from
// innerText: innerText carries the chrome (nav, footer, cookie bar) that is not part
// of the band language and would swamp the diff.
function lines(doc) {
  const out = new Map() // normalized -> first verbatim form seen
  const add = (raw) => {
    const t = norm(raw)
    // Single glyphs (a stat's `x`, a `%`, a `//` prefix) carry no content on their own
    // and appear in wildly different element shapes on the two sides.
    if (t.length < 3) return
    if (!out.has(t)) out.set(t, String(raw).trim())
  }
  for (const band of doc.bands) {
    for (const h of band.headings) add(h.text)
    for (const e of band.eyebrows || []) add(e)
    for (const p of band.paragraphs) add(p)
    for (const li of band.listItems) add(li)
    for (const l of band.links) add(l.label)
    for (const b of band.buttons) add(b)
    for (const m of band.marks?.names || []) add(m)
    for (const n of band.bigNumbers || []) add(n)
  }
  return out
}

const a = load(aPath)
const b = load(bPath)
const A = lines(a)
const B = lines(b)

const missing = [...A].filter(([k]) => !B.has(k)).map(([, v]) => v)
const extra = [...B].filter(([k]) => !A.has(k)).map(([, v]) => v)

const bandsOf = (d) => d.bands.length
const spacersOf = (d) => d.bands.filter((x) => x.empty).length

console.log(`source : ${a.url}`)
console.log(`ours   : ${b.url}`)
console.log('')
console.log(
  `bands  : ${bandsOf(a)} source (${spacersOf(a)} spacers) vs ${bandsOf(b)} ours (${spacersOf(b)} spacers)`
)
console.log(`copy   : ${A.size} source lines, ${B.size} ours`)
console.log('')

if (missing.length === 0) console.log('MISSING (in source, not in ours): none')
else {
  console.log(`MISSING (in source, not in ours) — ${missing.length}:`)
  for (const m of missing) console.log(`  - ${m}`)
}
console.log('')
if (extra.length === 0) console.log('EXTRA (in ours, not in source): none')
else {
  console.log(`EXTRA (in ours, not in source) — ${extra.length}:`)
  for (const e of extra) console.log(`  + ${e}`)
}

process.exit(missing.length > 0 ? 1 : 0)
