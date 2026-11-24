import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const BUTTONS = /<(Button|IconButton)\b[^>]*?\/?>/gs
const NEW_TAB = /target="_blank"|'_blank'/

function vueFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return vueFiles(path)
    return entry.name.endsWith('.vue') ? [path] : []
  })
}

test('a block Button that opens a new tab says so in its accessible name', () => {
  const unnamed = []
  for (const file of vueFiles(join(ROOT, 'blocks'))) {
    const source = readFileSync(file, 'utf8')
    for (const match of source.matchAll(BUTTONS)) {
      const element = match[0]
      if (!NEW_TAB.test(element)) continue
      if (/aria-label[^>]*opens in a new tab/s.test(element)) continue
      const line = source.slice(0, match.index).split('\n').length
      unnamed.push(`${relative(ROOT, file)}:${line}`)
    }
  }
  assert.deepEqual(unnamed, [], 'add "(opens in a new tab)" to the aria-label of each Button')
})
