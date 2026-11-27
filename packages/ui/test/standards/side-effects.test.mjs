import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, matchesGlob, relative } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const PKG = join(dirname(fileURLToPath(import.meta.url)), '../..')
const { sideEffects } = JSON.parse(readFileSync(join(PKG, 'package.json'), 'utf-8'))

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]
  )
}

const hasSideEffect = (file, source) => {
  if (file.endsWith('.css')) return true
  if (file.endsWith('.vue')) return /<style[\s>]/.test(source)
  return /^import\s+['"][^'"]+['"]/m.test(source)
}

test('sideEffects lists globs, never false for a package that ships CSS', () => {
  assert.ok(Array.isArray(sideEffects) && sideEffects.length > 0)
  assert.ok(sideEffects.some((glob) => glob.endsWith('*.css')))
})

test('every src file sideEffects marks has a real side effect, so bundlers can drop the rest', () => {
  const marked = walk(join(PKG, 'src'))
    .map((file) => relative(PKG, file))
    .filter((file) => sideEffects.some((glob) => matchesGlob(file, glob)))
  const pure = marked.filter((file) => !hasSideEffect(file, readFileSync(join(PKG, file), 'utf-8')))
  assert.deepEqual(pure.slice(0, 10), [], `${pure.length} side-effect-free file(s) marked`)
})
