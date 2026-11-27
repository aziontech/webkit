// Unit tests for the authoring-docs engine (contributing/hooks/lib/authoring-docs-checks.mjs) —
// the shared definition behind the write-time hook (validate-authoring-docs.mjs) and the CI
// ratchet (scripts/check-authoring-docs.mjs). A conforming doc must pass clean; a
// deliberately out-of-standard doc must be flagged on every axis.

import test from 'node:test'
import assert from 'node:assert/strict'

import { scanDoc, docFileKind } from '../../../../contributing/hooks/lib/authoring-docs-checks.mjs'

const ids = (rel, content) =>
  scanDoc(rel, content)
    .map((v) => v.id)
    .sort()

test('docFileKind resolves each population and skips non-governed paths', () => {
  assert.deepEqual(docFileKind('contributing/skills/animation-add/SKILL.md'), {
    kind: 'skill',
    variant: 'internal',
    scope: 'ui',
    unit: 'animation-add'
  })
  assert.deepEqual(docFileKind('contributing/agents/component-scaffolder.md'), {
    kind: 'agent',
    variant: 'internal',
    scope: 'ui',
    unit: 'component-scaffolder'
  })
  assert.deepEqual(docFileKind('skills/azion-ui-usage/SKILL.md'), {
    kind: 'skill',
    variant: 'consumer',
    scope: 'general',
    unit: 'azion-ui-usage'
  })
  assert.deepEqual(docFileKind('agents/azion-ui-advisor.md'), {
    kind: 'agent',
    variant: 'consumer',
    scope: 'general',
    unit: 'azion-ui-advisor'
  })
  // not governed
  assert.equal(docFileKind('contributing/agents/_README.md'), null)
  assert.equal(docFileKind('contributing/skills/animation-add/references/foo.md'), null)
  assert.equal(docFileKind('contributing/rules/authoring-docs.md'), null)
})

test('a conforming internal skill passes clean', () => {
  const rel = 'contributing/skills/good-skill/SKILL.md'
  const content = [
    '---',
    'name: good-skill',
    'description: A perfectly fine internal skill that finds components via the MCP/catalog.',
    'scope: ui',
    'enforced_by: [no-invention]',
    '---',
    '',
    '# Skill: good-skill',
    '',
    'Discover components through the Azion UI MCP (get_component). Never hardcode a path.'
  ].join('\n')
  assert.deepEqual(scanDoc(rel, content), [])
})

test('a conforming consumer skill (ui- prefix + status + last_updated) passes clean', () => {
  const rel = 'skills/azion-ui-good/SKILL.md'
  const content = [
    '---',
    'name: azion-ui-good',
    'description: A conforming consumer skill.',
    'scope: general',
    'status: active',
    'last_updated: 2026-07-20',
    'enforced_by: [azion-ui-tokens, ui-verify]',
    '---',
    '',
    'Body prose.'
  ].join('\n')
  assert.deepEqual(scanDoc(rel, content), [])
})

test('a conforming agent (name + description + scope only) passes clean', () => {
  const rel = 'contributing/agents/good-agent.md'
  const content = [
    '---',
    'name: good-agent',
    'description: A conforming agent role doc.',
    'scope: ui',
    '---',
    '',
    'Role prose.'
  ].join('\n')
  assert.deepEqual(scanDoc(rel, content), [])
})

test('a bad consumer skill is flagged on every axis', () => {
  const rel = 'skills/bad-fixture/SKILL.md'
  const content = [
    '---',
    'name: not-the-folder-name',
    'description:',
    '---',
    '',
    '# Skill: bad fixture',
    '',
    'Read the exemplar at `packages/ui/src/components/action/button/button.vue`.',
    'Use the canonicals (`button.vue`, `pricing-card.vue`) as the shape reference.',
    'To pick a component, find it in packages/ui/package.json#exports.',
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
  const skillNoEB = ['---', 'name: x', 'description: d.', 'scope: ui', '---', 'body'].join('\n')
  assert.ok(
    ids('contributing/skills/x/SKILL.md', skillNoEB).includes('enforced-by-missing'),
    'a skill with no enforced_by must be flagged'
  )
  const skillEB = [
    '---',
    'name: x',
    'description: d.',
    'scope: ui',
    'enforced_by: [styling]',
    '---',
    'body'
  ].join('\n')
  assert.ok(
    !ids('contributing/skills/x/SKILL.md', skillEB).includes('enforced-by-missing'),
    'a skill WITH enforced_by must not be flagged'
  )
  const agent = ['---', 'name: x', 'description: d.', 'scope: ui', '---', 'role'].join('\n')
  assert.ok(
    !ids('contributing/agents/x.md', agent).includes('enforced-by-missing'),
    'agents are not skills — enforced_by is not required'
  )
})

test('scope-mismatch fires when scope disagrees with the file location', () => {
  const rel = 'agents/azion-ui-x.md'
  const content = [
    '---',
    'name: azion-ui-x',
    'description: consumer agent wrongly claiming ui scope.',
    'scope: ui',
    '---',
    'prose'
  ].join('\n')
  assert.deepEqual(ids(rel, content), ['scope-mismatch'])
})

test('scope-invalid fires on a non-enum scope value', () => {
  const rel = 'contributing/agents/x.md'
  const content = ['---', 'name: x', 'description: d.', 'scope: internal', '---', 'prose'].join(
    '\n'
  )
  assert.deepEqual(ids(rel, content), ['scope-invalid'])
})

test('frontmatter-missing fires when there is no --- block', () => {
  const rel = 'contributing/skills/x/SKILL.md'
  assert.deepEqual(ids(rel, '# just a body, no frontmatter'), ['frontmatter-missing'])
})

test('agents are not scanned for file-as-example refs', () => {
  const rel = 'contributing/agents/component-scaffolder.md'
  const content = [
    '---',
    'name: component-scaffolder',
    'description: writes components.',
    'scope: ui',
    '---',
    'Reference packages/ui/src/components/action/button/button.vue as the canonical.'
  ].join('\n')
  assert.deepEqual(scanDoc(rel, content), [])
})
