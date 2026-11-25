import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')

const SCANNED = ['src/components', 'blocks', 'examples']

const WRAPS =
  /(?:^|\s)(?:[\w-]+:)*(?:break-words|break-all|whitespace-pre-wrap|wrap-break-word|wrap-anywhere)(?=\s|$)/

const ONE_ROW_CODE = /(?:^|\s)((?:[\w-]+:)*text-label-code-(?:sm|md|lg))!?(?=\s|$)/

const PENDING = new Set([
  'src/components/code/trace/parts/trace-detail.vue',
  'src/components/content/timestamp/timestamp.vue',
  'src/components/section/copy-command-section/copy-command-section.vue',
  'src/components/section/feature-widgets-section/feature-widgets-section.vue'
])

const vueFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return vueFiles(path)
    return entry.name.endsWith('.vue') ? [path] : []
  })

const classStrings = (source) =>
  [...source.matchAll(/"([^"\n]*)"|'([^'\n]*)'/g)].map(([, double, single]) => double ?? single)

const offenders = () => {
  const found = new Map()
  for (const dir of SCANNED) {
    for (const file of vueFiles(join(ROOT, dir))) {
      const hits = classStrings(readFileSync(file, 'utf8'))
        .filter((value) => WRAPS.test(value))
        .map((value) => value.match(ONE_ROW_CODE)?.[1])
        .filter(Boolean)
      if (hits.length) found.set(relative(ROOT, file), hits)
    }
  }
  return found
}

test('wrapping monospace text takes a text-body-code-* step, never a one-row text-label-code-* class', () => {
  const fresh = [...offenders()]
    .filter(([file]) => !PENDING.has(file))
    .map(([file, hits]) => `${file}: ${hits.join(', ')}`)
  assert.deepEqual(
    fresh,
    [],
    'text-label-code-* is leading-none: a value that wraps takes text-body-code-sm (or text-body-code-lg at the 16px touch size)'
  )
})

test('the pending list only shrinks: every listed file still has a wrapping one-row code class', () => {
  const found = offenders()
  const fixed = [...PENDING].filter((file) => !found.has(file))
  assert.deepEqual(fixed, [], 'remove the fixed files from PENDING')
})

test('the code editor steps its gutter and text area up to the 16px code step with a real line height on touch', () => {
  const source = readFileSync(
    join(ROOT, 'src/components/code/code-editor/parts/code-editor-pane.vue'),
    'utf8'
  )
  assert.equal(source.match(/pointer-coarse:text-body-code-lg/g)?.length, 2)
  assert.doesNotMatch(source, /pointer-coarse:text-label-code-/)
})
