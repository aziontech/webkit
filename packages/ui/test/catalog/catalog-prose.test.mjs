import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const DOCS_DIR = fileURLToPath(new URL('../../catalog/components', import.meta.url))
const PROSE_KEYS = ['useWhen', 'avoidWhen', 'related', 'bestPractices']

function proseFiles() {
  return readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => [f, JSON.parse(readFileSync(join(DOCS_DIR, f), 'utf-8'))])
}

test('every guidance string in the built catalog has balanced code spans', () => {
  const odd = []
  for (const [file, docs] of proseFiles()) {
    for (const key of ['purpose', ...PROSE_KEYS]) {
      const value = docs[key]
      for (const text of Array.isArray(value) ? value : value ? [value] : []) {
        if (typeof text !== 'string') continue
        if ((text.match(/`/g) || []).length % 2) odd.push(`${file} ${key}: ${text.slice(0, 80)}`)
      }
    }
  }
  assert.deepEqual(odd, [])
})

test('a related bullet keeps the backticks around its component name', () => {
  const button = JSON.parse(readFileSync(join(DOCS_DIR, 'button.json'), 'utf-8'))
  const line = button.related.find((r) => r.includes('icon-button'))
  assert.ok(line, 'button lists icon-button as related')
  assert.match(line, /^`icon-button` /)
})
