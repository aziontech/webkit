import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { lineHeight } from '../src/tokens/primitives/typography/line-height.js'
import { codeData } from '../src/tokens/semantic/code.data.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const css = readFileSync(join(ROOT, 'dist/v4/globals.css'), 'utf8')

test('the editor code line height is the console 16 px, through the line-height scale', () => {
  assert.equal(codeData['code-editor-line-height'], 'var(--line-height-4)')
  assert.equal(lineHeight[4], '16px')
})

test('the built bundle declares the editor code line height on the root', () => {
  assert.match(css, /--code-editor-line-height: var\(--line-height-4\);/)
  assert.match(css, /--line-height-4: 16px;/)
})
