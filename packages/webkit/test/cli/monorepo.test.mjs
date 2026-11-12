import { test } from 'node:test'
import assert from 'node:assert/strict'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { ESLint } from 'eslint'

import { applyPlan } from '../../src/cli/apply.js'
import { FRAGMENT_END, FRAGMENT_START } from '../../src/cli/bundle.js'
import { planDoctor } from '../../src/cli/doctor.js'
import { planInit } from '../../src/cli/plan.js'
import { hasBundle, resolveBundleRoot } from '../../src/cli/sync.js'
import webkitPlugin from '../../src/eslint-plugin/index.js'
import { cli, PKG_ROOT } from './_helpers/cli-project.mjs'

const REPO_ROOT = join(PKG_ROOT, '..', '..')

function makeMonorepo({ git = true } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'webkit-monorepo-'))
  if (git) mkdirSync(join(root, '.git'))
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'mono', private: true }))
  const app = join(root, 'apps', 'web')
  mkdirSync(app, { recursive: true })
  writeFileSync(join(app, 'package.json'), JSON.stringify({ name: 'web', version: '1.0.0' }))
  return { root, app }
}

const bundleCheck = (dir) => planDoctor(dir).find((c) => c.check === 'claude bundle')

test('an app with no agent files of its own uses the bundle at the repository root', () => {
  const { root, app } = makeMonorepo()
  try {
    applyPlan(root, planInit(root, {}))
    assert.ok(hasBundle(root))
    assert.equal(hasBundle(app), false)
    assert.deepEqual(resolveBundleRoot(app), { dir: resolveBundleRoot(root).dir, kind: 'ancestor' })

    let check = bundleCheck(app)
    assert.equal(check.status, 'ok')
    assert.match(check.detail, /\.\.\/\.\. are current/)

    rmSync(join(root, '.claude', 'rules', 'webkit-imports.md'))
    check = bundleCheck(app)
    assert.equal(check.status, 'fail')
    assert.match(check.detail, /sync` in \.\.\/\.\./)
    assert.match(check.detail, /missing: \.\.\/\.\.\/\.claude\/rules\/webkit-imports\.md/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('sync run inside the app reconciles the root bundle instead of writing a second copy', () => {
  const { root, app } = makeMonorepo()
  try {
    writeFileSync(join(root, 'CLAUDE.md'), `# Mono\n\n${FRAGMENT_START}\nold\n${FRAGMENT_END}\n`)
    const r = cli(app, 'sync')
    assert.equal(r.code, 0, r.stderr)
    assert.match(r.stdout, /the repository root that owns the agent files/)
    assert.equal(existsSync(join(app, '.claude')), false)
    assert.equal(existsSync(join(root, '.claude', 'rules', 'webkit-imports.md')), true)
    assert.equal(bundleCheck(app).status, 'ok')
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('an app keeps its own bundle, and an ancestor outside the repository is ignored', () => {
  const { root, app } = makeMonorepo({ git: false })
  try {
    applyPlan(root, planInit(root, {}))
    assert.equal(resolveBundleRoot(app).kind, 'own')
    assert.equal(bundleCheck(app).status, 'fail')

    mkdirSync(join(root, '.git'))
    writeFileSync(join(app, 'AGENTS.md'), `${FRAGMENT_START}\n`)
    assert.deepEqual(resolveBundleRoot(app), { dir: app, kind: 'own' })
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('an app inside the WebKit repository reads the bundle sources at the root', () => {
  const demos = join(REPO_ROOT, 'apps', 'demos')
  assert.equal(resolveBundleRoot(demos).kind, 'source')
  const check = bundleCheck(demos)
  assert.equal(check.status, 'ok')
  assert.match(check.detail, /nothing to sync/)
  const r = cli(demos, 'sync', '--check')
  assert.equal(r.code, 0, r.stderr)
  assert.match(r.stdout, /nothing to sync/)
  assert.equal(readFileSync(join(REPO_ROOT, 'AGENTS.md'), 'utf8').includes(FRAGMENT_START), false)
})

test('an app config can spread the repository ESLint config and the strict preset together', async () => {
  const { default: rootConfig } = await import(join(REPO_ROOT, 'eslint.config.js'))
  const eslint = new ESLint({
    cwd: join(REPO_ROOT, 'apps', 'demos'),
    overrideConfigFile: true,
    overrideConfig: [...rootConfig, ...webkitPlugin.configs.strict]
  })
  const [result] = await eslint.lintText('<template><div class="ml-2" /></template>\n', {
    filePath: join(REPO_ROOT, 'apps', 'demos', 'src', 'Probe.vue')
  })
  const direction = result.messages.filter((m) => m.ruleId === 'webkit/no-physical-direction')
  assert.equal(direction.length, 1)
})
