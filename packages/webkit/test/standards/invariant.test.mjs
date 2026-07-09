// The standards invariant — the mechanical guarantee that "what we suggest to the AI"
// (a .claude/rules/<id>.md) and "what the pipeline blocks" (a hook/lint/ratchet) are the
// SAME set of definitions. If someone adds a rule without a gate, a gate without a rule,
// or splits the write-time and CI engines, this test fails in CI.

import test from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

import { STANDARDS, STANDARDS_BY_ID } from '../../../../.claude/hooks/_lib/standards.mjs'
import {
  CONTENT_CHECKS,
  STANDARD_BY_CHECK,
  MESSAGES
} from '../../../../.claude/hooks/_lib/authoring-checks.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '../../../..')

const ruleIds = readdirSync(join(ROOT, '.claude/rules'))
  .filter((f) => f.endsWith('.md') && f !== 'README.md')
  .map((f) => f.replace(/\.md$/, ''))

test('every rule doc is registered as a standard, and every standard has a rule doc', () => {
  const rules = new Set(ruleIds)
  const regs = new Set(STANDARDS.map((s) => s.id))
  const rulesWithNoStandard = [...rules].filter((r) => !regs.has(r))
  const standardsWithNoRule = [...regs].filter((r) => !rules.has(r))
  assert.deepEqual(
    rulesWithNoStandard,
    [],
    `rules missing from standards.mjs: ${rulesWithNoStandard}`
  )
  assert.deepEqual(standardsWithNoRule, [], `standards with no rule doc: ${standardsWithNoRule}`)
})

test('every standard is blocking — at least one enforcement surface, nothing advisory', () => {
  for (const s of STANDARDS) {
    assert.ok(
      Array.isArray(s.enforce) && s.enforce.length > 0,
      `standard "${s.id}" has no enforce[] — every standard must block (auto or mandatory review)`
    )
  }
})

test('every standard is classified general (ships to projects) or webkit (internal)', () => {
  for (const s of STANDARDS) {
    assert.ok(
      s.scope === 'general' || s.scope === 'webkit',
      `standard "${s.id}" has invalid scope: ${JSON.stringify(s.scope)}`
    )
  }
})

test('every enforcer reference resolves to a real hook or eslint rule', () => {
  for (const s of STANDARDS) {
    for (const e of s.enforce || []) {
      if (e.surface === 'write-time') {
        assert.ok(
          existsSync(join(ROOT, `.claude/hooks/${e.by}.mjs`)),
          `standard "${s.id}": write-time hook not found: ${e.by}`
        )
      } else if (e.surface === 'lint') {
        assert.ok(
          existsSync(join(ROOT, `packages/webkit/src/eslint-plugin/rules/${e.by}.js`)),
          `standard "${s.id}": eslint rule not found: ${e.by}`
        )
      }
    }
  }
})

test('every mechanized check maps to a standard enforced write-time by validate-authoring', () => {
  const checkIds = [...CONTENT_CHECKS.map((c) => c.id), 'composable-js']
  for (const id of checkIds) {
    const standardId = STANDARD_BY_CHECK[id]
    assert.ok(standardId, `check "${id}" has no STANDARD_BY_CHECK mapping`)
    const s = STANDARDS_BY_ID[standardId]
    assert.ok(s, `check "${id}" maps to unknown standard "${standardId}"`)
    const wt = (s.enforce || []).some(
      (e) => e.surface === 'write-time' && e.by === 'validate-authoring'
    )
    assert.ok(
      wt,
      `standard "${standardId}" (check "${id}") is not enforced write-time by validate-authoring`
    )
    assert.ok(MESSAGES[id], `check "${id}" has no message`)
  }
})

test('hook, CI ratchet, and consumer lint all share the single authoring-checks engine', () => {
  const ENGINE = 'packages/webkit/src/eslint-plugin/authoring-checks.js'
  assert.ok(existsSync(join(ROOT, ENGINE)), 'canonical engine missing from the package')

  // write-time hook → the _lib shim → the package engine
  const hook = readFileSync(join(ROOT, '.claude/hooks/validate-authoring.mjs'), 'utf-8')
  assert.match(hook, /_lib\/authoring-checks\.mjs/, 'hook does not import the shim')
  const shim = readFileSync(join(ROOT, '.claude/hooks/_lib/authoring-checks.mjs'), 'utf-8')
  assert.match(
    shim,
    /packages\/webkit\/src\/eslint-plugin\/authoring-checks\.js/,
    'shim does not re-export the package engine'
  )

  // DS CI ratchet → the package engine
  const ratchet = readFileSync(join(ROOT, 'packages/webkit/scripts/check-authoring.mjs'), 'utf-8')
  assert.match(ratchet, /authoring-checks\.js/, 'CI ratchet does not import the engine')

  // consumer lint rule → the package engine
  const rule = readFileSync(
    join(ROOT, 'packages/webkit/src/eslint-plugin/rules/authoring-standards.js'),
    'utf-8'
  )
  assert.match(rule, /\.\.\/authoring-checks\.js/, 'consumer lint rule does not import the engine')
})
