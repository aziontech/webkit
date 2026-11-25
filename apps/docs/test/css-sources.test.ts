import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  DOCS_SOURCES,
  frameGroups,
  sourceClosure,
  writeDocsSources,
  writeFrameStyles
} from '../plugins/css-sources.ts'
import { WEBKIT } from '../plugins/paths.ts'

const HERE = dirname(fileURLToPath(import.meta.url))

const sources = (file: string) =>
  [...readFileSync(file, 'utf8').matchAll(/@source '([^']+)'/g)].map((match) =>
    resolve(dirname(file), match[1])
  )

const styles = (file: string) => readFileSync(resolve(HERE, '../src/styles', file), 'utf8')
const vue = (file: string) => readFileSync(resolve(HERE, '../src', file), 'utf8')

test('the app stylesheet holds no utilities: each page loads one utility sheet, or nested ones', () => {
  assert.doesNotMatch(styles('main.css'), /tailwindcss\/utilities|@source/)
  const docs = styles('docs-utilities.css')
  const full = styles('full-utilities.css')
  assert.doesNotMatch(docs, /@aziontech\/webkit\/styles\/all|packages\/webkit\/(examples|blocks)/)
  for (const line of docs.split('\n').filter((entry) => /^@(source|import '\.\.)/.test(entry)))
    assert.ok(
      full.includes(line),
      `full-utilities.css must hold everything docs-utilities.css does: ${line}`
    )
  assert.match(vue('components/docs-shell.vue'), /import '\.\.\/styles\/docs-utilities\.css'/)
  for (const file of ['pages/component-page.vue', 'components/component-grid.vue'])
    assert.match(vue(file), /import '\.\.\/styles\/full-utilities\.css'/, file)
  for (const file of ['pages/example-frame-page.vue', 'pages/block-frame-page.vue'])
    assert.doesNotMatch(vue(file), /utilities\.css/, `${file} must load only its frame sheet`)
})

test('the docs utility sheet scans only the docs app and the WebKit files it imports', () => {
  writeDocsSources()
  const files = sources(DOCS_SOURCES)
  assert.ok(files.some((file) => file.endsWith('/components/action/button/button.vue')))
  assert.ok(files.every((file) => !file.includes('/packages/webkit/examples/')))
})

test('a frame compiles only its own example folder, the frame page and what they import', () => {
  const files = sources(writeFrameStyles('examples', 'button').replace(/\.vue$/, '.css'))
  assert.equal(files[0], join(WEBKIT, 'examples/button'))
  assert.ok(files.includes(join(WEBKIT, 'src/components/action/button/button.vue')))
  assert.ok(
    files.every((path) => !path.includes('/data-table/')),
    'button pulls in unrelated parts'
  )
  assert.ok(files.some((path) => path.endsWith('/src/pages/example-frame-page.vue')))
  const groups = frameGroups()
  assert.ok(groups.some(([kind, dir]) => kind === 'examples' && dir === 'button'))
  assert.ok(groups.some(([kind]) => kind === 'blocks'))
})

test('the source closure follows relative and package imports', () => {
  const closure = sourceClosure([join(WEBKIT, 'examples/button/default.vue')])
  assert.ok(closure.includes(join(WEBKIT, 'src/components/action/button/button.vue')))
  assert.ok(closure.every((path) => !/\.(test|spec)\.[jt]s$/.test(path)))
})
