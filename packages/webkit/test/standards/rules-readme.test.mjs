import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const { STANDARDS } = await import(join(ROOT, '.claude/hooks/lib/standards.mjs'))
const readme = readFileSync(join(ROOT, '.claude/rules/README.md'), 'utf8')

const rows = [...readme.matchAll(/^\| \[([a-z-]+)\]\(\.\/\1\.md\) +\| (general|webkit) +\|/gm)].map(
  (match) => ({ id: match[1], scope: match[2] })
)
const count = (scope) => STANDARDS.filter((standard) => standard.scope === scope).length

test('the rules index lists every registered standard once, with its registry scope', () => {
  assert.deepEqual(
    rows.map((row) => row.id).sort(),
    STANDARDS.map((standard) => standard.id).sort()
  )
  for (const row of rows) {
    const standard = STANDARDS.find((entry) => entry.id === row.id)
    assert.equal(row.scope, standard.scope, `${row.id} scope`)
  }
})

test('the rules index states the counts the registry has', () => {
  assert.match(readme, new RegExp(`The ${STANDARDS.length} construction standards`))
  const sections = [...readme.matchAll(/^## \w+ \((\d+)\)$/gm)].map((match) => Number(match[1]))
  assert.equal(
    sections.reduce((sum, n) => sum + n, 0),
    STANDARDS.length
  )
  assert.match(readme, new RegExp(`${count('general')} \`general\``))
  assert.match(readme, new RegExp(`${count('webkit')} \`webkit\``))
})

test('the git-workflow row bases branches on main, as the rule does', () => {
  assert.match(readme, /\[git-workflow\][^\n]*based on `main`/)
})
