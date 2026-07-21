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
import { parseEnforcedBy } from '../../../../.claude/hooks/_lib/authoring-docs-checks.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(HERE, '../../../..')

const ruleIds = readdirSync(join(ROOT, '.claude/rules'))
  .filter((f) => f.endsWith('.md') && f !== 'README.md')
  .map((f) => f.replace(/\.md$/, ''))

// The consumer rule population that shipped skills reference in their enforced_by.
const CONSUMER_RULES_DIR = 'packages/webkit/cli-templates/claude/rules'
const consumerRuleIds = readdirSync(join(ROOT, CONSUMER_RULES_DIR))
  .filter((f) => f.endsWith('.md') && f !== 'README.md')
  .map((f) => f.replace(/\.md$/, ''))

const dirNames = (rel) =>
  readdirSync(join(ROOT, rel), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)

// Both skill populations: internal (.claude/skills) and consumer (cli-templates).
const SKILLS = [
  ...dirNames('.claude/skills').map((id) => ({
    id,
    path: join('.claude/skills', id, 'SKILL.md'),
    valid: new Set([...ruleIds, 'review'])
  })),
  ...dirNames('packages/webkit/cli-templates/claude/skills').map((id) => ({
    id,
    path: join('packages/webkit/cli-templates/claude/skills', id, 'SKILL.md'),
    valid: new Set([...consumerRuleIds, 'ui-verify', 'review'])
  }))
]

// Extract the raw frontmatter block so parseEnforcedBy never matches a body line.
const frontmatterOf = (content) => {
  const m = content.match(/^---\n([\s\S]*?)\n---/)
  return m ? m[1] : ''
}
const enforcedByOf = (rel) =>
  parseEnforcedBy(frontmatterOf(readFileSync(join(ROOT, rel), 'utf-8')))

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

test('the token, spec-compliance, and story-source engines are shared by hook AND ratchet', () => {
  const ratchet = readFileSync(join(ROOT, 'packages/webkit/scripts/check-authoring.mjs'), 'utf-8')

  // token engine: package canonical, hook via shim, ratchet direct
  assert.ok(existsSync(join(ROOT, 'packages/webkit/src/eslint-plugin/token-checks.js')))
  const tokenShim = readFileSync(join(ROOT, '.claude/hooks/_lib/token-checks.mjs'), 'utf-8')
  assert.match(tokenShim, /eslint-plugin\/token-checks\.js/, 'token shim does not re-export')
  const tokenHook = readFileSync(join(ROOT, '.claude/hooks/validate-tokens.mjs'), 'utf-8')
  assert.match(tokenHook, /_lib\/token-checks\.mjs/, 'validate-tokens does not import the shim')
  assert.match(ratchet, /token-checks\.js/, 'ratchet does not import the token engine')

  // spec-compliance engine (DS-internal): hook + ratchet share _lib
  assert.ok(existsSync(join(ROOT, '.claude/hooks/_lib/spec-compliance-checks.mjs')))
  const specHook = readFileSync(join(ROOT, '.claude/hooks/validate-spec-compliance.mjs'), 'utf-8')
  assert.match(specHook, /_lib\/spec-compliance-checks\.mjs/, 'spec hook does not use the engine')
  assert.match(ratchet, /spec-compliance-checks\.mjs/, 'ratchet does not import the spec engine')

  // story-source engine: hook + ratchet share _lib
  assert.ok(existsSync(join(ROOT, '.claude/hooks/_lib/story-source-checks.mjs')))
  const storyHook = readFileSync(join(ROOT, '.claude/hooks/validate-story-source.mjs'), 'utf-8')
  assert.match(storyHook, /_lib\/story-source-checks\.mjs/, 'story hook does not use the engine')
  assert.match(ratchet, /story-source-checks\.mjs/, 'ratchet does not import the story engine')
})

test('authoring-docs hook AND ratchet share the single _lib/authoring-docs-checks engine', () => {
  assert.ok(existsSync(join(ROOT, '.claude/hooks/_lib/authoring-docs-checks.mjs')))
  const hook = readFileSync(join(ROOT, '.claude/hooks/validate-authoring-docs.mjs'), 'utf-8')
  assert.match(hook, /_lib\/authoring-docs-checks\.mjs/, 'hook does not import the engine')
  const ratchet = readFileSync(
    join(ROOT, 'packages/webkit/scripts/check-authoring-docs.mjs'),
    'utf-8'
  )
  assert.match(ratchet, /authoring-docs-checks\.mjs/, 'ratchet does not import the engine')
})

// The skill-side invariant: a skill is guidance, so on its own it is advisory. Every skill
// (internal + consumer) declares enforced_by naming what makes it non-optional — the same
// "nothing advisory" guarantee rules already have. Presence is also caught write-time/ratchet
// by the engine; resolution (below) needs both rule populations, so it lives here.
test('every skill declares a non-empty enforced_by (guidance → gate traceability)', () => {
  const missing = SKILLS.filter((s) => enforcedByOf(s.path).length === 0).map((s) => s.id)
  assert.deepEqual(missing, [], `skills with no enforced_by: ${missing.join(', ')}`)
})

test('every enforced_by entry resolves to a rule of its population, ui-verify, or review', () => {
  const bad = []
  for (const s of SKILLS) {
    for (const e of enforcedByOf(s.path)) {
      if (!s.valid.has(e)) bad.push(`${s.id} → "${e}"`)
    }
  }
  assert.deepEqual(
    bad,
    [],
    `unresolved enforced_by entries (not a rule of the skill's population / ui-verify / review): ${bad.join(', ')}`
  )
})

// The gates that may appear as `surface: 'ci'` — a typo or a fictional enforcer here is
// exactly the failure mode that let the toolkit job no-op on a ghost package name.
const CI_ENFORCERS = new Set([
  'check-authoring',
  'commitlint',
  'branch-protection',
  'catalog-drift',
  'size-limit',
  'type-check',
  'vuejs-accessibility',
  'storybook-build',
  'vitest',
  'check-tests',
  'check-authoring-docs'
])

test("every 'ci' enforcer is a known gate (no free-form/fictional names)", () => {
  for (const s of STANDARDS) {
    for (const e of s.enforce || []) {
      if (e.surface === 'ci') {
        assert.ok(CI_ENFORCERS.has(e.by), `standard "${s.id}": unknown ci enforcer "${e.by}"`)
      }
    }
  }
})

test('every shipped eslint rule is claimed by a standard (no orphan gates)', async () => {
  const { rules } = await import('../../src/eslint-plugin/index.js')
  const claimed = new Set()
  for (const s of STANDARDS) {
    for (const e of s.enforce || []) if (e.surface === 'lint') claimed.add(e.by)
  }
  // prefer-webkit-component steers ADOPTION (use webkit instead of a foreign lib) —
  // deliberately not a construction standard.
  const ORPHAN_OK = new Set(['prefer-webkit-component'])
  for (const name of Object.keys(rules)) {
    assert.ok(
      claimed.has(name) || ORPHAN_OK.has(name),
      `eslint rule "${name}" is not claimed by any standard (add it to enforce[] or ORPHAN_OK)`
    )
  }
})
