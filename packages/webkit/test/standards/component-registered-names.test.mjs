import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const COMPONENTS = join(PKG, 'src/components')
const pascal = (kebab) => kebab.replace(/(?:^|-)([a-z0-9])/g, (_, c) => c.toUpperCase())

const files = readdirSync(COMPONENTS, { recursive: true })
  .map(String)
  .filter((file) => file.endsWith('.vue') && !file.split('/').includes('parts'))

test('every public component registers under the PascalCase of its file name', () => {
  assert.ok(files.length > 400, `found only ${files.length}`)
  const wrong = []
  for (const file of files) {
    const source = readFileSync(join(COMPONENTS, file), 'utf8')
    const name = source.match(/defineOptions\(\{\s*name:\s*'([A-Za-z0-9]+)'/)?.[1]
    const want = pascal(basename(file, '.vue'))
    if (name !== want) wrong.push(`${relative(PKG, join(COMPONENTS, file))}: ${name} → ${want}`)
  }
  assert.deepEqual(wrong, [])
})
