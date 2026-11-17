import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { entryKeywords } from './lib/icon-keywords.mjs'
import { classOf, describe, glyphName, loadManifest } from './lib/icons-manifest.mjs'

const manifest = loadManifest()

const data = manifest.icons
  .filter((entry) => entry.set === 'mono')
  .map((entry) => ({
    icon: classOf(entry),
    keywords: entryKeywords(entry).join(', '),
    name: glyphName(entry),
    ...describe(entry, manifest)
  }))

writeFileSync(join('./dist', 'catalog.json'), JSON.stringify(data, null, 2) + '\n', 'utf-8')
