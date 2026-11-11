import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { GATES, formatTable, parseGateArgs } from '../../scripts/gates.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const workflow = readFileSync(resolve(ROOT, '.github/workflows/governance.yml'), 'utf8')
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'packages/webkit/package.json'), 'utf8'))

const scriptsFor = (step) => {
  const file = step.find((a) => a.endsWith('.mjs'))
  if (!file) return []
  return Object.entries(pkg.scripts)
    .filter(([, cmd]) => cmd.includes(file))
    .map(([name]) => name)
}

test('every local gate also runs in the governance workflow', () => {
  for (const gate of GATES) {
    for (const step of gate.steps) {
      if (step[0] === 'git') continue
      const scripts = scriptsFor(step)
      const direct = step.find((a) => a.includes('gen-block-stories'))
      const ok =
        (direct && workflow.includes('gen-block-stories.mjs --check')) ||
        (step.includes('--test') && workflow.includes('test:toolkit')) ||
        scripts.some((name) => new RegExp(`webkit (run )?${name}\\n`).test(workflow))
      assert.ok(ok, `${gate.id}: ${step.join(' ')} is not in governance.yml`)
    }
  }
})

test('parseGateArgs selects gates and rejects unknown ones', () => {
  assert.deepEqual(parseGateArgs(['--only', 'naming,catalog']).only, ['naming', 'catalog'])
  assert.equal(parseGateArgs(['--bail']).bail, true)
  assert.throws(() => parseGateArgs(['--only', 'nope']), /unknown gate/)
  assert.throws(() => parseGateArgs(['--what']), /unknown argument/)
})

test('formatTable prints one row per gate and the pass count', () => {
  const table = formatTable([
    { label: 'A', steps: [['node', 'a.mjs']], pass: true, seconds: 1 },
    { label: 'B', steps: [['node', 'b.mjs']], pass: false, seconds: 2 }
  ])
  assert.match(table, /\| A \| `node a.mjs` \| pass \| 1.0 s \|/)
  assert.match(table, /\| B \| .* \| \*\*FAIL\*\* \|/)
  assert.match(table, /1 of 2 gates passed\./)
})
