import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  DOCS_SOURCES,
  sourceClosure,
  writeDocsSources,
  writeExampleSources
} from '../plugins/css-sources.ts'
import { WEBKIT } from '../plugins/paths.ts'

const HERE = dirname(fileURLToPath(import.meta.url))

const sources = (file: string) =>
  [...readFileSync(file, 'utf8').matchAll(/@source '([^']+)'/g)].map((match) =>
    resolve(dirname(file), match[1])
  )

test('the docs stylesheet scans only the docs app and the WebKit files it imports', () => {
  const main = readFileSync(resolve(HERE, '../src/styles/main.css'), 'utf8')
  assert.doesNotMatch(main, /@aziontech\/webkit\/styles\/all/)
  assert.doesNotMatch(main, /@source '[^']*packages\/webkit\/(examples|blocks)/)
  assert.match(main, /@import '\.\.\/\.\.\/\.build\/css\/docs\.css'/)
  writeDocsSources()
  const files = sources(DOCS_SOURCES)
  assert.ok(files.some((file) => file.endsWith('/components/action/button/button.vue')))
  assert.ok(files.every((file) => !file.includes('/packages/webkit/examples/')))
})

test('an example folder compiles only its own files and what they import', () => {
  const file = writeExampleSources('button')
  const files = sources(file)
  assert.equal(files[0], join(WEBKIT, 'examples/button'))
  assert.ok(files.includes(join(WEBKIT, 'src/components/action/button/button.vue')))
  assert.ok(
    files.every((path) => !path.includes('/data-table/')),
    'button pulls in unrelated parts'
  )
})

test('the source closure follows relative and package imports', () => {
  const closure = sourceClosure([join(WEBKIT, 'examples/button/default.vue')])
  assert.ok(closure.includes(join(WEBKIT, 'src/components/action/button/button.vue')))
  assert.ok(closure.every((path) => !/\.(test|spec)\.[jt]s$/.test(path)))
})
