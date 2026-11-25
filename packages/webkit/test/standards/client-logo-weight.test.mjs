import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR = join(dirname(fileURLToPath(import.meta.url)), '../../src/assets/logos/clients')

const MAX_PATHS = 100
const MAX_BYTES = 40 * 1024

test('every client logo stays a light drawing: at most 100 paths and 40 KB', () => {
  const heavy = readdirSync(DIR)
    .filter((name) => name.endsWith('.svg'))
    .map((name) => {
      const path = join(DIR, name)
      const paths = readFileSync(path, 'utf8').match(/<path\b/g)?.length ?? 0
      return { name, paths, bytes: statSync(path).size }
    })
    .filter(({ paths, bytes }) => paths > MAX_PATHS || bytes > MAX_BYTES)
    .map(({ name, paths, bytes }) => `${name}: ${paths} paths, ${Math.round(bytes / 1024)} KB`)
  assert.deepEqual(
    heavy,
    [],
    'a logo traced into strips (a gradient drawn as hundreds of paths) slows every logo wall: draw each band once with a linearGradient'
  )
})
