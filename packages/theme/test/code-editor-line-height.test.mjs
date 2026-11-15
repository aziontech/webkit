import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { code } from '../src/tokens/semantic/code.js'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const css = readFileSync(join(ROOT, 'dist/globals.css'), 'utf8')

test('the editor code line height is the console 16 px', () => {
  assert.equal(code['code-editor-line-height'], '1rem')
})

test('the built bundle declares the editor code line height on the root', () => {
  assert.match(css, /--code-editor-line-height: 1rem;/)
})
