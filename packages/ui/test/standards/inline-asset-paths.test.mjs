import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')

const MAX_PATHS = 200

const INLINE_ASSETS = [
  { dir: 'src/assets/illustrations', ext: '.svg' },
  { dir: 'src/assets/brands', ext: '.vue' }
]

const countPaths = (source) => (source.match(/<path\b/g) ?? []).length

test(`an asset drawn into the page holds at most ${MAX_PATHS} paths`, () => {
  const over = []
  for (const { dir, ext } of INLINE_ASSETS) {
    for (const file of readdirSync(join(PKG_ROOT, dir)).filter((name) => name.endsWith(ext))) {
      const paths = countPaths(readFileSync(join(PKG_ROOT, dir, file), 'utf8'))
      if (paths > MAX_PATHS) over.push(`${dir}/${file}: ${paths} paths`)
    }
  }
  assert.deepEqual(
    over,
    [],
    'Every path is a DOM node once the asset is drawn. Merge the dots that share a fill into one path.'
  )
})
