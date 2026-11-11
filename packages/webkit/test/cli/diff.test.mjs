import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { lineDiff, unifiedDiff } from '../../src/cli/text-diff.js'
import { cleanup, cli, cliJson, makeProject } from './_helpers/cli-project.mjs'

const BLOCK = 'platform/delete/delete-with-confirmation'

test('unifiedDiff renders hunks with context and line ranges', () => {
  const a = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'].join('\n')
  const b = ['one', 'two', 'THREE', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'].join(
    '\n'
  )
  assert.equal(unifiedDiff(a, a), '')
  assert.equal(
    unifiedDiff(a, b, { oldLabel: 'a', newLabel: 'b', context: 1 }),
    [
      '--- a',
      '+++ b',
      '@@ -2,3 +2,3 @@',
      ' two',
      '-three',
      '+THREE',
      ' four',
      '@@ -9 +9,2 @@',
      ' nine',
      '+ten',
      ''
    ].join('\n')
  )
  assert.deepEqual(
    lineDiff('x\ny\n', 'y\n').map((op) => op.t),
    ['-', ' ']
  )
})

test('diff reports identical copies with exit 0 and edits as a unified diff with exit 1', () => {
  const dir = makeProject()
  try {
    assert.equal(cli(dir, 'add', BLOCK).code, 0)
    const same = cli(dir, 'diff', BLOCK)
    assert.equal(same.code, 0, same.stderr)
    assert.match(same.stdout, /identical/)

    const file = join(dir, 'src/views/DeleteWithConfirmation.vue')
    const src = readFileSync(file, 'utf8')
    writeFileSync(file, src.replace('<template>', '<template>\n  <!-- local -->'))
    const changed = cli(dir, 'diff', 'src/views/DeleteWithConfirmation.vue')
    assert.equal(changed.code, 1)
    assert.match(changed.stdout, /\+1 -0/)
    assert.match(changed.stdout, /^\+  <!-- local -->$/m)
    assert.ok(!changed.stdout.includes('\x1b['), 'no colour when not a TTY')

    const json = cliJson(dir, 'diff', 'delete-with-confirmation')
    assert.equal(json.code, 1)
    assert.equal(json.json.differs, true)
    assert.equal(json.json.files[0].status, 'modified')
    assert.equal(json.json.files[0].editedLocally, true)
    assert.equal(json.json.files[0].upstreamChanged, false)
  } finally {
    cleanup(dir)
  }
})

test('diff flags a canonical block that changed since the copy, and unknown targets', () => {
  const dir = makeProject()
  try {
    assert.equal(cli(dir, 'add', BLOCK).code, 0)
    const manifestPath = join(dir, 'webkit.blocks.json')
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
    manifest.blocks[BLOCK].version = '0.0.1'
    manifest.blocks[BLOCK].files[0].checksum = 'sha256:old'
    writeFileSync(manifestPath, JSON.stringify(manifest))
    const r = cli(dir, 'diff', BLOCK)
    assert.match(r.stdout, /changed since it was copied \(0\.0\.1 →/)

    const missing = cli(dir, 'diff', 'platform/auth/sign-in')
    assert.equal(missing.code, 2)
    assert.match(missing.stderr, /not recorded in webkit\.blocks\.json/)
  } finally {
    cleanup(dir)
  }
})
