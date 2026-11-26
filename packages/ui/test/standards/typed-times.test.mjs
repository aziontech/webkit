import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const BASELINE = join(PKG_ROOT, 'scripts', 'typed-times-baseline.json')
const DIRS = ['blocks', 'examples']
const RELATIVE_TIME = /\b\d+ (?:seconds?|minutes?|hours?|days?|weeks?|months?|years?) ago\b/g

function sources(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) sources(path, out)
    else if (/\.(vue|ts)$/.test(entry.name)) out.push(path)
  }
  return out
}

function counts() {
  const found = {}
  for (const dir of DIRS) {
    for (const file of sources(join(PKG_ROOT, dir))) {
      const hits = readFileSync(file, 'utf8').match(RELATIVE_TIME)
      if (hits) found[relative(PKG_ROOT, file)] = hits.length
    }
  }
  return found
}

test('no block or example gains a relative time typed as text', () => {
  const { known } = JSON.parse(readFileSync(BASELINE, 'utf8'))
  const found = counts()
  const added = Object.entries(found)
    .filter(([file, count]) => count > (known[file] ?? 0))
    .map(([file, count]) => `${file}: ${count} (baseline ${known[file] ?? 0})`)
  assert.deepEqual(
    added,
    [],
    'A relative time typed as text ("2 days ago") never updates, does not sort and does not ' +
      'follow the locale. Keep the moment as a Date or an ISO string and show it with Timestamp ' +
      '(in a DataTable column, TableCellTime).'
  )
})

test('the typed-times baseline only shrinks', () => {
  const { known } = JSON.parse(readFileSync(BASELINE, 'utf8'))
  const found = counts()
  const stale = Object.entries(known)
    .filter(([file, count]) => (found[file] ?? 0) < count)
    .map(([file, count]) => `${file}: baseline ${count}, now ${found[file] ?? 0}`)
  assert.deepEqual(
    stale,
    [],
    'Lower these entries in scripts/typed-times-baseline.json (remove an entry that reached 0).'
  )
})
