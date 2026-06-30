/**
 * Build Color Catalog Script
 *
 * Colored brand icons (gradients + multiple fills) cannot live in the woff2
 * icon font — a font glyph is single-color. They are delivered instead as a
 * standalone manifest of inline SVG strings that consumers render directly.
 *
 * Reads:  src/svg-raw/ai-cor/*.svg
 * Writes: dist/color-catalog.json  →  [{ icon, name, keywords, svg }]
 *
 * Usage: node scripts/build-color-catalog.mjs
 */

import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const CHARSET = 'utf-8'
const DIST_DIR = './dist'
const COLOR_DIR = './src/svg-raw/ai-cor'

mkdirSync(DIST_DIR, { recursive: true })

const files = readdirSync(COLOR_DIR)
  .filter((f) => f.endsWith('.svg'))
  .sort()

const data = files.map((file) => {
  const name = file.replace('.svg', '')

  return {
    // No font class exists for colored icons — `icon` mirrors `name` so the
    // gallery list shape stays parallel to catalog.json.
    icon: name,
    keywords: '',
    name,
    colored: true,
    svg: readFileSync(join(COLOR_DIR, file), CHARSET).trim()
  }
})

writeFileSync(
  join(DIST_DIR, 'color-catalog.json'),
  JSON.stringify(data, null, 2) + '\n',
  CHARSET
)

console.log(`  ✔ dist/color-catalog.json created (${data.length} colored icons)`)
