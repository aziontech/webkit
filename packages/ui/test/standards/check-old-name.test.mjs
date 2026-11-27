import assert from 'node:assert/strict'
import test from 'node:test'

import { findOldNames } from '../../scripts/check-old-name.mjs'

const OLD = ['web', 'kit'].join('')

test('check:old-name reports the old library name', () => {
  const found = findOldNames([
    `README.md:1:Install ${OLD} with npm`,
    `src/a.js:2:import Button from '@aziontech/${OLD}/button'`
  ])
  assert.deepEqual(
    found.map((f) => f.file),
    ['README.md', 'src/a.js']
  )
})

test('check:old-name keeps CSS prefixes, DOM APIs, the browser engine and the repository URL', () => {
  const found = findOldNames([
    `a.css:1:  -${OLD}-line-clamp: 2;`,
    `a.css:2:::-${OLD}-scrollbar { width: 0 }`,
    `a.vue:3:<input ${OLD}directory />`,
    `a.md:4:the suite on Chromium, Firefox and ${OLD.replace('k', 'K').replace('w', 'W')}`,
    `a.ts:5:const engine = 'chromium' | 'firefox' | '${OLD}'`,
    `package.json:6:"url": "https://github.com/aziontech/${OLD}.git"`
  ])
  assert.deepEqual(found, [])
})

test('check:old-name skips history files', () => {
  assert.deepEqual(findOldNames([`packages/ui/CHANGELOG.md:1:${OLD} 5.13.0`]), [])
})
