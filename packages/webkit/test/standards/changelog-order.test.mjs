import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const PACKAGES = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')

const versions = (text) =>
  [...text.matchAll(/^## \[(\d+)\.(\d+)\.(\d+)\]/gm)].map((match) => match.slice(1, 4).map(Number))
const newer = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]

for (const name of ['webkit', 'theme', 'icons']) {
  test(`the ${name} changelog lists its 4.x and later releases newest first`, () => {
    const text = readFileSync(join(PACKAGES, name, 'CHANGELOG.md'), 'utf8')
    assert.ok(
      text.startsWith('# Changelog\n'),
      'release-please inserts above the first heading after a newline; keep the title on line 1'
    )
    const recent = versions(text).filter((version) => version[0] >= 4)
    assert.deepEqual(
      recent,
      [...recent].sort((a, b) => newer(b, a))
    )
  })
}
