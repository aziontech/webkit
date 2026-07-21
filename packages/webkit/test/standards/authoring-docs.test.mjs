// Unit tests for the authoring-docs engine (.claude/hooks/_lib/authoring-docs-checks.mjs) —
// the shared definition behind the write-time hook (validate-authoring-docs.mjs) and the CI
// ratchet (scripts/check-authoring-docs.mjs). A conforming doc must pass clean; a
// deliberately out-of-standard doc must be flagged on every axis.

import test from 'node:test'
import assert from 'node:assert/strict'

import { scanDoc, docFileKind } from '../../../../.claude/hooks/_lib/authoring-docs-checks.mjs'

const ids = (rel, content) => scanDoc(rel, content).map((v) => v.id).sort()

test('docFileKind resolves each population and skips non-governed paths', () => {
  assert.deepEqual(docFileKind('.claude/skills/add-animation/SKILL.md'), {
    kind: 'skill',
    variant: 'internal',
    scope: 'webkit',
    unit: 'add-animation'
  })
  assert.deepEqual(docFileKind('.claude/agents/scaffolder.md'), {
    kind: 'agent',
    variant: 'internal',
    scope: 'webkit',
    unit: 'scaffolder'
  })
  assert.deepEqual(
    docFileKind('packages/webkit/cli-templates/claude/skills/webkit-usage/SKILL.md'),
    { kind: 'skill', variant: 'consumer', scope: 'general', unit: 'webkit-usage' }
  )
  assert.deepEqual(
    docFileKind('packages/webkit/cli-templates/claude/agents/webkit-expert.md'),
    { kind: 'agent', variant: 'consumer', scope: 'general', unit: 'webkit-expert' }
  )
  // not governed
  assert.equal(docFileKind('.claude/agents/_README.md'), null)
  assert.equal(docFileKind('.claude/skills/add-animation/references/foo.md'), null)
  assert.equal(docFileKind('.claude/rules/authoring-docs.md'), null)
})

test('a conforming internal skill passes clean', () => {
  const rel = '.claude/skills/good-skill/SKILL.md'
  const content = [
    '---',
    'name: good-skill',
    'description: A perfectly fine internal skill that finds components via the MCP/catalog.',
    'scope: webkit',
    'enforced_by: [no-invention]',
    '---',
    '',
    '# Skill: good-skill',
    '',
    'Discover components through the webkit MCP (get_component). Never hardcode a path.'
  ].join('\n')
  assert.deepEqual(scanDoc(rel, content), [])
})

test('a conforming consumer skill (webkit- prefix + status + last_updated) passes clean', () => {
  const rel = 'packages/webkit/cli-templates/claude/skills/webkit-good/SKILL.md'
  const content = [
    '---',
    'name: webkit-good',
    'description: A conforming consumer skill.',
    'scope: general',
    'status: active',
    'last_updated: 2026-07-20',
    'enforced_by: [webkit-tokens, ui-verify]',
    '---',
    '',
    'Body prose.'
  ].join('\n')
  assert.deepEqual(scanDoc(rel, content), [])
})

test('a conforming agent (name + description + scope only) passes clean', () => {
  const rel = '.claude/agents/good-agent.md'
  const content = [
    '---',
    'name: good-agent',
    'description: A conforming agent role doc.',
    'scope: webkit',
    '---',
    '',
    'Role prose.'
  ].join('\n')
  assert.deepEqual(scanDoc(rel, content), [])
})

test('a bad consumer skill is flagged on every axis', () => {
  const rel = 'packages/webkit/cli-templates/claude/skills/bad-fixture/SKILL.md'
  const content = [
    '---',
    'name: not-the-folder-name',
    'description:',
    '---',
    '',
    '# Skill: bad fixture',
    '',
    'Read the exemplar at `packages/webkit/src/components/actions/button/button.vue`.',
    'Use the canonicals (`button.vue`, `card-pricing.vue`) as the shape reference.',
    'To pick a component, find it in packages/webkit/package.json#exports.',
    'Or climb to ../../../src/components/ to see the source.'
  ].join('\n')
  // distinct axes flagged (the src-path line trips both component-src-path and, via its
  // "exemplar" trigger word, file-as-exemplar — occurrence counting is exercised by the
  // real baseline; here we assert every violation TYPE is caught).
  const distinct = [...new Set(ids(rel, content))].sort()
  assert.deepEqual(distinct, [
    'component-src-path',
    'consumer-skill-last-updated',
    'consumer-skill-prefix',
    'consumer-skill-status',
    'description-empty',
    'enforced-by-missing',
    'exports-as-lookup',
    'file-as-exemplar',
    'name-mismatch',
    'scope-missing',
    'src-escape'
  ])
})

test('enforced_by is required on skills and exempt on agents', () => {
  const skillNoEB = ['---', 'name: x', 'description: d.', 'scope: webkit', '---', 'body'].join('\n')
  assert.ok(
    ids('.claude/skills/x/SKILL.md', skillNoEB).includes('enforced-by-missing'),
    'a skill with no enforced_by must be flagged'
  )
  const skillEB = [
    '---',
    'name: x',
    'description: d.',
    'scope: webkit',
    'enforced_by: [styling]',
    '---',
    'body'
  ].join('\n')
  assert.ok(
    !ids('.claude/skills/x/SKILL.md', skillEB).includes('enforced-by-missing'),
    'a skill WITH enforced_by must not be flagged'
  )
  const agent = ['---', 'name: x', 'description: d.', 'scope: webkit', '---', 'role'].join('\n')
  assert.ok(
    !ids('.claude/agents/x.md', agent).includes('enforced-by-missing'),
    'agents are not skills — enforced_by is not required'
  )
})

test('scope-mismatch fires when scope disagrees with the file location', () => {
  const rel = 'packages/webkit/cli-templates/claude/agents/webkit-x.md'
  const content = [
    '---',
    'name: webkit-x',
    'description: consumer agent wrongly claiming webkit scope.',
    'scope: webkit',
    '---',
    'prose'
  ].join('\n')
  assert.deepEqual(ids(rel, content), ['scope-mismatch'])
})

test('scope-invalid fires on a non-enum scope value', () => {
  const rel = '.claude/agents/x.md'
  const content = ['---', 'name: x', 'description: d.', 'scope: internal', '---', 'prose'].join(
    '\n'
  )
  assert.deepEqual(ids(rel, content), ['scope-invalid'])
})

test('frontmatter-missing fires when there is no --- block', () => {
  const rel = '.claude/skills/x/SKILL.md'
  assert.deepEqual(ids(rel, '# just a body, no frontmatter'), ['frontmatter-missing'])
})

test('agents are not scanned for file-as-example refs', () => {
  const rel = '.claude/agents/scaffolder.md'
  const content = [
    '---',
    'name: scaffolder',
    'description: writes components.',
    'scope: webkit',
    '---',
    'Reference packages/webkit/src/components/actions/button/button.vue as the canonical.'
  ].join('\n')
  assert.deepEqual(scanDoc(rel, content), [])
})
