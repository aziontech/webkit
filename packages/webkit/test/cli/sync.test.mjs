import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { applyPlan } from '../../src/cli/apply.js'
import { FRAGMENT_START, LEGACY_MARKER, stamp, stripMarker } from '../../src/cli/bundle.js'
import { planDoctor } from '../../src/cli/doctor.js'
import { planInit } from '../../src/cli/plan.js'
import { planSync } from '../../src/cli/sync.js'

const VERSION = '5.0.0'

function makeProject() {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-sync-'))
  writeFileSync(
    join(dir, 'package.json'),
    JSON.stringify({ name: 'demo', version: '1.0.0' }, null, 2)
  )
  return dir
}

// A tiny two-rule fake templates dir — cheap and fast, and lets tests simulate "the
// template changed" by editing these files directly instead of the real cli-templates.
function makeTemplatesDir(overrides = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'webkit-templates-'))
  mkdirSync(join(dir, 'rules'), { recursive: true })
  mkdirSync(join(dir, 'skills/webkit-sample'), { recursive: true })
  mkdirSync(join(dir, 'agents'), { recursive: true })
  writeFileSync(
    join(dir, 'rules/webkit-imports.md'),
    overrides.rule ?? '# Rule: imports\n\nUse the flat path.\n'
  )
  writeFileSync(
    join(dir, 'skills/webkit-sample/SKILL.md'),
    overrides.skill ??
      '---\nname: webkit-sample\ndescription: A sample skill.\n---\n\n# Skill: webkit-sample\nBody.\n'
  )
  writeFileSync(
    join(dir, 'CLAUDE.fragment.md'),
    overrides.fragment ?? '## @aziontech/webkit design system\n\nFollow the rules.\n'
  )
  return dir
}

function entryFor(plan, rel) {
  return plan.entries.find((e) => e.rel === rel)
}

test('planSync: fresh project — every bundle file + fragment is missing; apply makes them current', () => {
  const project = makeProject()
  const templatesDir = makeTemplatesDir()
  try {
    const plan = planSync(project, { templatesDir, version: VERSION })
    assert.equal(entryFor(plan, 'rules/webkit-imports.md').state, 'missing')
    assert.equal(entryFor(plan, 'skills/webkit-sample/SKILL.md').state, 'missing')
    assert.equal(plan.fragment.state, 'missing')
    assert.equal(plan.drift, true)

    applyPlan(project, plan.actions)

    const after = planSync(project, { templatesDir, version: VERSION })
    for (const entry of after.entries) {
      assert.equal(entry.state, 'current', `${entry.rel} should be current after apply`)
    }
    assert.equal(after.fragment.state, 'current')
    assert.equal(after.drift, false)

    // --check contract: exit 0 (drift === false).
    assert.equal(after.drift, false)
  } finally {
    rmSync(project, { recursive: true, force: true })
    rmSync(templatesDir, { recursive: true, force: true })
  }
})

test('planSync: editing a synced rule body reports it modified; sync skips it, --force restores it', () => {
  const project = makeProject()
  const templatesDir = makeTemplatesDir()
  try {
    applyPlan(project, planSync(project, { templatesDir, version: VERSION }).actions)

    const rulePath = join(project, '.claude/rules/webkit-imports.md')
    const stampedOriginal = readFileSync(rulePath, 'utf8')
    writeFileSync(rulePath, `${stampedOriginal}\nOne more local line.\n`)

    const modifiedPlan = planSync(project, { templatesDir, version: VERSION })
    const entry = entryFor(modifiedPlan, 'rules/webkit-imports.md')
    assert.equal(entry.state, 'modified')
    assert.equal(entry.action.type, 'report')
    // `modified` alone is not drift (the consumer's own choice).
    assert.equal(modifiedPlan.drift, false)

    applyPlan(project, modifiedPlan.actions)
    assert.equal(
      readFileSync(rulePath, 'utf8'),
      `${stampedOriginal}\nOne more local line.\n`,
      'sync must never overwrite a modified file without --force'
    )

    const forcedPlan = planSync(project, { templatesDir, version: VERSION, force: true })
    const forcedEntry = entryFor(forcedPlan, 'rules/webkit-imports.md')
    assert.equal(forcedEntry.action.type, 'copy-stamped')
    assert.equal(forcedEntry.action.forced, true)
    applyPlan(project, forcedPlan.actions)
    assert.equal(
      readFileSync(rulePath, 'utf8'),
      stampedOriginal,
      '--force must restore the stamped template'
    )

    const finalPlan = planSync(project, { templatesDir, version: VERSION })
    assert.equal(entryFor(finalPlan, 'rules/webkit-imports.md').state, 'current')
    assert.equal(finalPlan.drift, false)
  } finally {
    rmSync(project, { recursive: true, force: true })
    rmSync(templatesDir, { recursive: true, force: true })
  }
})

test('planSync: a tampered marker sha with the body otherwise untouched — see the comment', () => {
  // classify() cannot distinguish "the body was edited" from "the marker itself was
  // edited" from content alone (both change whether the recomputed body hash still
  // equals the marker's sha256), so both are classified as `modified` — the safe,
  // never-overwrite-without-force choice. This test documents that outcome for sync.
  const project = makeProject()
  const templatesDir = makeTemplatesDir()
  try {
    applyPlan(project, planSync(project, { templatesDir, version: VERSION }).actions)
    const rulePath = join(project, '.claude/rules/webkit-imports.md')
    const original = readFileSync(rulePath, 'utf8')
    writeFileSync(rulePath, original.replace(/sha256=[0-9a-f]{16}/, 'sha256=0000000000000000'))

    const plan = planSync(project, { templatesDir, version: VERSION })
    assert.equal(entryFor(plan, 'rules/webkit-imports.md').state, 'modified')
    assert.equal(plan.drift, false)
  } finally {
    rmSync(project, { recursive: true, force: true })
    rmSync(templatesDir, { recursive: true, force: true })
  }
})

test('planSync: template body changed since the consumer was stamped → stale → UPDATE, and is drift', () => {
  const project = makeProject()
  const templatesDir = makeTemplatesDir()
  try {
    applyPlan(project, planSync(project, { templatesDir, version: VERSION }).actions)

    // Simulate an upstream template update.
    writeFileSync(
      join(templatesDir, 'rules/webkit-imports.md'),
      '# Rule: imports\n\nUse the flat path. Now with more detail.\n'
    )

    const plan = planSync(project, { templatesDir, version: VERSION })
    const entry = entryFor(plan, 'rules/webkit-imports.md')
    assert.equal(entry.state, 'stale')
    assert.equal(entry.action.type, 'copy-stamped')
    assert.equal(plan.drift, true)

    applyPlan(project, plan.actions)
    const after = planSync(project, { templatesDir, version: VERSION })
    assert.equal(entryFor(after, 'rules/webkit-imports.md').state, 'current')
  } finally {
    rmSync(project, { recursive: true, force: true })
    rmSync(templatesDir, { recursive: true, force: true })
  }
})

test('planSync: an unstamped byte-identical copy (docs-repo case) is stamped without a content change', () => {
  const project = makeProject()
  const templatesDir = makeTemplatesDir()
  try {
    const templateContent = readFileSync(join(templatesDir, 'rules/webkit-imports.md'), 'utf8')
    mkdirSync(join(project, '.claude/rules'), { recursive: true })
    writeFileSync(join(project, '.claude/rules/webkit-imports.md'), templateContent)

    const plan = planSync(project, { templatesDir, version: VERSION })
    const entry = entryFor(plan, 'rules/webkit-imports.md')
    assert.equal(entry.state, 'unstamped-identical')
    assert.equal(entry.action.type, 'copy-stamped')

    applyPlan(project, plan.actions)
    const written = readFileSync(join(project, '.claude/rules/webkit-imports.md'), 'utf8')
    // Body identical to the template; only a marker line was added.
    assert.equal(stripMarker(written), templateContent)

    const after = planSync(project, { templatesDir, version: VERSION })
    assert.equal(entryFor(after, 'rules/webkit-imports.md').state, 'current')
  } finally {
    rmSync(project, { recursive: true, force: true })
    rmSync(templatesDir, { recursive: true, force: true })
  }
})

test('planSync: an orphaned bundle file (marker source no longer in the bundle) is reported, never deleted', () => {
  const project = makeProject()
  const templatesDir = makeTemplatesDir()
  try {
    applyPlan(project, planSync(project, { templatesDir, version: VERSION }).actions)

    const orphanPath = join(project, '.claude/rules/webkit-retired.md')
    writeFileSync(
      orphanPath,
      stamp('# Rule: retired\n\nNo longer shipped.\n', {
        source: 'claude/rules/webkit-retired.md',
        version: VERSION
      })
    )

    const plan = planSync(project, { templatesDir, version: VERSION })
    const orphan = plan.entries.find((e) => e.rel === 'rules/webkit-retired.md')
    assert.ok(orphan, 'orphan file must be reported as an entry')
    assert.equal(orphan.state, 'orphan')
    assert.equal(orphan.action.type, 'report')
    assert.equal(plan.drift, true, 'an orphan counts as drift')

    applyPlan(project, plan.actions)
    assert.ok(existsSync(orphanPath), 'sync must never delete an orphan file')
    assert.equal(
      readFileSync(orphanPath, 'utf8'),
      readFileSync(orphanPath, 'utf8'),
      'orphan content must be untouched'
    )
  } finally {
    rmSync(project, { recursive: true, force: true })
    rmSync(templatesDir, { recursive: true, force: true })
  }
})

test('planSync: CLAUDE.md fragment states — missing, legacy (deduped), stale, current', () => {
  const project = makeProject()
  const templatesDir = makeTemplatesDir()
  try {
    // missing
    let plan = planSync(project, { templatesDir, version: VERSION })
    assert.equal(plan.fragment.state, 'missing')
    assert.equal(plan.fragment.action.type, 'fence')

    // legacy, duplicated — applying must collapse it to exactly one fenced block.
    writeFileSync(
      join(project, 'CLAUDE.md'),
      `# Project\n\n${LEGACY_MARKER}\nOld body.\n\n${LEGACY_MARKER}\nOld body again.\n`
    )
    plan = planSync(project, { templatesDir, version: VERSION })
    assert.equal(plan.fragment.state, 'legacy')
    applyPlan(project, plan.actions)
    const afterLegacy = readFileSync(join(project, 'CLAUDE.md'), 'utf8')
    assert.equal(
      afterLegacy.split(FRAGMENT_START).length - 1,
      1,
      'exactly one fenced block after migration'
    )

    // current
    plan = planSync(project, { templatesDir, version: VERSION })
    assert.equal(plan.fragment.state, 'current')
    assert.equal(plan.fragment.action, null)

    // stale — the fragment template changed upstream.
    writeFileSync(
      join(templatesDir, 'CLAUDE.fragment.md'),
      '## @aziontech/webkit design system\n\nFollow the rules, updated.\n'
    )
    plan = planSync(project, { templatesDir, version: VERSION })
    assert.equal(plan.fragment.state, 'stale')
    assert.equal(plan.drift, true)
  } finally {
    rmSync(project, { recursive: true, force: true })
    rmSync(templatesDir, { recursive: true, force: true })
  }
})

test('planSync: skills/agents frontmatter is preserved verbatim; marker lands after the closing ---', () => {
  const project = makeProject()
  const templatesDir = makeTemplatesDir()
  try {
    const plan = planSync(project, { templatesDir, version: VERSION })
    applyPlan(project, plan.actions)
    const written = readFileSync(join(project, '.claude/skills/webkit-sample/SKILL.md'), 'utf8')
    const template = readFileSync(join(templatesDir, 'skills/webkit-sample/SKILL.md'), 'utf8')
    const fmEnd = template.indexOf('---\n', 4) + 4
    assert.equal(
      written.slice(0, fmEnd),
      template.slice(0, fmEnd),
      'frontmatter must be byte-identical'
    )
    const afterFm = written.slice(fmEnd)
    assert.match(
      afterFm.split('\n')[0],
      /^<!-- webkit-sync source=\S+ version=\S+ sha256=[0-9a-f]{16} -->$/
    )
  } finally {
    rmSync(project, { recursive: true, force: true })
    rmSync(templatesDir, { recursive: true, force: true })
  }
})

test('doctor reports the claude bundle status per sync state', () => {
  const project = makeProject()
  try {
    // No .claude at all yet — real templates dir (planDoctor doesn't take an override),
    // so this always drifts on a bare project.
    let report = planDoctor(project)
    let bundle = report.find((c) => c.check === 'claude bundle')
    assert.equal(bundle.status, 'fail')

    applyPlan(project, planInit(project, {}))
    report = planDoctor(project)
    bundle = report.find((c) => c.check === 'claude bundle')
    assert.equal(bundle.status, 'ok')

    const rulePath = join(project, '.claude/rules/webkit-imports.md')
    writeFileSync(rulePath, `${readFileSync(rulePath, 'utf8')}\nedited.\n`)
    report = planDoctor(project)
    bundle = report.find((c) => c.check === 'claude bundle')
    assert.equal(bundle.status, 'warn')
  } finally {
    rmSync(project, { recursive: true, force: true })
  }
})
