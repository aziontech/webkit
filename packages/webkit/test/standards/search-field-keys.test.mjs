import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const SEARCH_SLOT = /<template\s+#search\s*>([\s\S]*?)<\/template>/g

function vueFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return vueFiles(path)
    return entry.name.endsWith('.vue') ? [path] : []
  })
}

const files = () => [...vueFiles(join(ROOT, 'blocks')), ...vueFiles(join(ROOT, 'examples'))]

test('a picker search field lets its keys reach the panel, so Escape closes it', () => {
  const swallowed = []
  for (const file of files()) {
    const source = readFileSync(file, 'utf8')
    for (const match of source.matchAll(SEARCH_SLOT)) {
      if (!/@keydown\.stop\b/.test(match[1])) continue
      const line = source.slice(0, match.index).split('\n').length
      swallowed.push(`${relative(ROOT, file)}:${line}`)
    }
  }
  assert.deepEqual(
    swallowed,
    [],
    `@keydown.stop in a #search slot swallows Escape:\n${swallowed.join('\n')}`
  )
})
