import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { checkSpecTemplates } from '../../scripts/check-spec-template.mjs'
import { TEMPLATE_2_SECTIONS } from '../../../../.claude/hooks/_lib/spec.mjs'

const filled = TEMPLATE_2_SECTIONS.map((h) => `## ${h}\n\n- Filled in for this component.\n`).join(
  '\n'
)
const spec = (fm, body) => `---\n${fm}\n---\n\n## Purpose\n\nx\n\n${body}`

test('older specs are exempt, template 2 specs must fill the new sections', () => {
  const dir = mkdtempSync(join(tmpdir(), 'spec-template-'))
  try {
    writeFileSync(join(dir, 'old.md'), spec('name: old\ncreated: 2026-05-22', ''))
    writeFileSync(join(dir, 'new.md'), spec('name: new\ntemplate: 2\ncreated: 2030-01-01', filled))
    writeFileSync(
      join(dir, 'partial.md'),
      spec('name: partial\ntemplate: 2\ncreated: 2030-01-01', '## Internationalization\n\nTBD\n')
    )
    writeFileSync(join(dir, 'unmarked.md'), spec('name: unmarked\ncreated: 2030-01-01', filled))
    writeFileSync(join(dir, '_template.md'), spec('name: x\ntemplate: 2', ''))

    const { findings, current, legacy } = checkSpecTemplates(dir)
    assert.equal(current, 2)
    assert.equal(legacy, 2)
    const byName = (n) => findings.filter((f) => f.name === n).map((f) => f.error)
    assert.deepEqual(byName('old.md'), [])
    assert.deepEqual(byName('new.md'), [])
    assert.equal(byName('partial.md').length, 4)
    assert.match(byName('partial.md')[0], /Internationalization: section is empty/)
    assert.match(byName('unmarked.md')[0], /must declare `template: 2`/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('every spec in the repository passes the template check', () => {
  assert.deepEqual(checkSpecTemplates().findings, [])
})
