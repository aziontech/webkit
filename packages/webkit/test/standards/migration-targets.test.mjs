import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const migration = JSON.parse(readFileSync(join(PKG, 'src/cli/migrations/v6.json'), 'utf8'))

const sources = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return sources(path)
    return /\.(vue|ts)$/.test(entry.name) && !entry.name.includes('.test.') ? [path] : []
  })

const deprecatedTypes = new Set()
for (const file of sources(join(PKG, 'src'))) {
  const text = readFileSync(file, 'utf8')
  for (const match of text.matchAll(
    /\/\*\*((?:(?!\*\/)[\s\S])*?)\*\/\s*export\s+(?:type|interface)\s+(\w+)/g
  )) {
    if (match[1].includes('@deprecated')) deprecatedTypes.add(match[2])
  }
}

test('the codemod renames each type to its final name, never to a deprecated alias', () => {
  const stale = Object.entries(migration.types)
    .filter(([, to]) => deprecatedTypes.has(to))
    .map(([from, to]) => `${from} -> ${to}`)
  assert.deepEqual(stale, [])
})

const guide = readFileSync(join(PKG, 'MIGRATION_V6.md'), 'utf8')

test('MIGRATION_V6.md names every deprecated type and every retired illustration name', () => {
  const props = JSON.parse(readFileSync(join(PKG, 'src/cli/migrations/v6-props.json'), 'utf8'))
  const retired = Object.keys(props.illustration.name.values)
  const registry = readFileSync(join(PKG, 'src/assets/illustrations/registry.ts'), 'utf8')
  assert.ok(retired.length >= 8)
  assert.deepEqual(
    retired.filter((name) => registry.includes(`'${name}'`)),
    []
  )
  const names = [...deprecatedTypes, ...retired]
  assert.deepEqual(
    names.filter((name) => !guide.includes(`\`${name}\``)),
    []
  )
})

test('MIGRATION_V6.md numbers its sections once each and has one heading per subject', () => {
  const headings = [...guide.matchAll(/^(#{2,3}) (.+)$/gm)].map((match) => match[2])
  const numbers = headings.map((heading) => heading.match(/^(\d+)\./)?.[1]).filter(Boolean)
  assert.deepEqual(
    numbers,
    numbers.map((_, index) => String(index + 1))
  )
  assert.deepEqual(
    headings.filter((heading, index) => headings.indexOf(heading) !== index),
    []
  )
})
