import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { colorModeScript } from '../../src/composables/use-color-mode/use-color-mode.ts'

const skill = readFileSync(
  new URL('../../../../skills/azion-ui-theming-dark-mode/SKILL.md', import.meta.url),
  'utf8'
)

test('the theming skill publishes the CSP hash of colorModeScript', () => {
  const hash = `sha256-${createHash('sha256').update(colorModeScript).digest('base64')}`
  assert.ok(skill.includes(`script-src 'self' '${hash}'`), `the skill must name '${hash}'`)
})
