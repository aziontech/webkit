import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const SPECS = join(ROOT, '.specs')
const exportsMap = JSON.parse(
  readFileSync(join(ROOT, 'packages/webkit/package.json'), 'utf8')
).exports
const files = readdirSync(SPECS).filter((name) => /^[a-z].*\.md$/.test(name))
const known = new Set([
  ...Object.keys(exportsMap).map((key) => key.slice(2)),
  ...files.map((name) => name.slice(0, -3))
])
const kebab = (name) => name.replace(/(?<!^)([A-Z])/g, '-$1').toLowerCase()
const read = (name) => readFileSync(join(SPECS, name), 'utf8')

test('a spec sends the reader only to components that exist', () => {
  const unknown = []
  for (const name of files) {
    const spec = read(name)
    const section = spec.match(/## When NOT to use\n([\s\S]*?)\n## /)?.[1] ?? ''
    for (const match of section.matchAll(/(?:use|→)\s+`([a-z][a-z0-9-]+|[A-Z][A-Za-z]+)`/g)) {
      const target = match[1]
      const purpose = spec.match(/## Purpose\n([\s\S]*?)\n## /)?.[1] ?? ''
      if (known.has(kebab(target)) || purpose.includes(`\`${target}\``)) continue
      unknown.push(`${name}: ${target}`)
    }
  }
  assert.deepEqual(unknown, [])
})

test('every Purpose says what the component is for, not where its file lives', () => {
  const stubs = files.filter((name) =>
    /## Purpose\n\n[^\n]*Lives at `packages\/webkit\/src\//.test(read(name))
  )
  assert.deepEqual(stubs, [])
})

test('no spec table cell carries a double-escaped pipe', () => {
  assert.deepEqual(
    files.filter((name) => /^\|.*\\\\\s*\|/m.test(read(name))),
    []
  )
})
