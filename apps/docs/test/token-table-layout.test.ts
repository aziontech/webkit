import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const source = (file: string) =>
  readFileSync(resolve(HERE, '../src/components/tokens', file), 'utf8')

test('token tables and palette strips skip layout while off screen, with a sized placeholder', () => {
  for (const file of ['token-table.vue', 'palette-strips.vue']) {
    const markup = source(file)
    assert.match(markup, /\[content-visibility:auto\]/, `${file} lays out every row on load`)
    assert.match(
      markup,
      /\[contain-intrinsic-block-size:auto_/,
      `${file} has no placeholder height`
    )
  }
})
