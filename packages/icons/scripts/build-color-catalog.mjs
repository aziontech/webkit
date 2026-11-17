import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

import { entryKeywords } from './lib/icon-keywords.mjs'
import { COLOR_DIR, classOf, describe, glyphName, loadManifest } from './lib/icons-manifest.mjs'

const DIST_DIR = './dist'
const manifest = loadManifest()

mkdirSync(DIST_DIR, { recursive: true })

const data = manifest.icons
  .filter((entry) => entry.set === 'color')
  .map((entry) => ({
    icon: classOf(entry),
    keywords: entryKeywords(entry).join(', '),
    name: glyphName(entry),
    colored: true,
    ...describe(entry, manifest),
    svg: readFileSync(join(COLOR_DIR, `${glyphName(entry)}.svg`), 'utf-8').trim()
  }))

writeFileSync(join(DIST_DIR, 'color-catalog.json'), JSON.stringify(data, null, 2) + '\n', 'utf-8')

console.log(`  ✔ dist/color-catalog.json created (${data.length} colored icons)`)
