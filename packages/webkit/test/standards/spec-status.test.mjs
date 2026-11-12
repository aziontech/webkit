import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { findDraftSpecs } from '../../scripts/check-spec-status.mjs'

const spec = (status) => `---\nname: x\nstatus: ${status}\n---\n\n## Purpose\n\nx\n`

test('findDraftSpecs flags a draft spec and exempts the template and sub-folders', () => {
  const dir = mkdtempSync(join(tmpdir(), 'specs-'))
  try {
    writeFileSync(join(dir, 'button.md'), spec('implemented'))
    writeFileSync(join(dir, 'chip.md'), spec('approved'))
    writeFileSync(join(dir, 'new-thing.md'), spec('draft'))
    writeFileSync(join(dir, '_template.md'), spec('draft'))
    mkdirSync(join(dir, '_examples'))
    writeFileSync(join(dir, '_examples', 'sample.md'), spec('draft'))
    mkdirSync(join(dir, '__fixtures__'))
    writeFileSync(join(dir, '__fixtures__', 'fixture.md'), spec('draft'))

    assert.deepEqual(findDraftSpecs(dir), ['new-thing.md'])
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('the repository main has no spec in status: draft', () => {
  assert.deepEqual(findDraftSpecs(), [])
})
