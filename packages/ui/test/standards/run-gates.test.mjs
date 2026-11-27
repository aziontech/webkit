import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { GATES, formatTable, parseGateArgs } from '../../scripts/run-gates.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../..')
const workflow = readFileSync(resolve(ROOT, '.github/workflows/governance.yml'), 'utf8')
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'packages/ui/package.json'), 'utf8'))

const scriptsFor = (step) => {
  const file = step.find((a) => a.endsWith('.mjs'))
  if (!file) return []
  return Object.entries(pkg.scripts)
    .filter(([, cmd]) => cmd.includes(file))
    .map(([name]) => name)
}

const ciRuns = [...workflow.matchAll(/^\s+run: (?!\|)(.+)$/gm)].map((m) => m[1].trim())

const ciCovers = (gate, step) => {
  if (gate.root) return ciRuns.includes(step.join(' '))
  if (step[0] === 'git') return true
  const scripts = scriptsFor(step)
  return (
    (step.includes('--test') && workflow.includes('test:toolkit')) ||
    scripts.some(
      (name) =>
        new RegExp(`ui (run )?${name}\\n`).test(workflow) ||
        new RegExp(`pnpm run ${name}\\n\\s+working-directory: packages/ui\\n`).test(workflow)
    )
  )
}

test('every local gate also runs in the governance workflow', () => {
  for (const gate of GATES) {
    for (const step of gate.steps) {
      assert.ok(ciCovers(gate, step), `${gate.id}: ${step.join(' ')} is not in governance.yml`)
    }
  }
})

const CI_ONLY = {
  'pnpm install --frozen-lockfile': 'setup',
  'pnpm exec playwright install --with-deps chromium': 'setup',
  'pnpm run check:audit': 'needs the npm advisory service; run pnpm gates at the root',
  'pnpm run typecheck:docs': 'pnpm gates at the root',
  'pnpm check:pack': 'about 35 s of npm pack',
  'pnpm build:icons':
    'builds the icon font the styled browser tests load; build:docs builds it too',
  'pnpm build:docs': 'a full docs build',
  'pnpm check:docs:links': 'needs the docs build',
  'pnpm test:docs:shell':
    'needs the docs build and Chromium; pnpm test:docs:shell after pnpm build:docs',
  'pnpm test:docs:smoke':
    'needs the docs build and Chromium; pnpm test:docs:smoke after pnpm build:docs',
  'pnpm check:docs:editor-chunks': 'needs the docs build; pnpm test:docs covers its logic',
  'pnpm --filter @aziontech/ui-docs run check:external-links':
    'needs the docs build, lychee and the network (it requests every external link)',
  'pnpm --filter @aziontech/ui-docs run check:lighthouse':
    'needs both built sites, Chromium and the network (npx downloads Lighthouse); about 2 min',
  'pnpm build:demos': 'a full demos build',
  'pnpm --filter @aziontech/ui run test:consume': 'installs and builds a consumer app',
  'pnpm --filter @aziontech/ui run check:package-lint':
    'packs theme, icons and ui and downloads publint and arethetypeswrong (about 40 s)',
  'pnpm --filter @aziontech/ui run check:consumer-types': 'packs and builds a consumer app',
  'pnpm exec vitest run --shard=${{ matrix.shard }}/4': 'the browser suite, minutes long',
  'pnpm --filter @aziontech/ui-visual exec playwright test --shard=${{ matrix.shard }}/4':
    'the styled visual suite, needs the built sites',
  'printf \'%s\\n\' "$PR_TITLE" | pnpm exec commitlint --verbose': 'needs the PR title'
}

const gateCommand = (line) => {
  const filtered = line.match(/^pnpm --filter @aziontech\/ui (?:run )?(\S+)$/)
  const local = line.match(/^pnpm (?:run )?(\S+)$/)
  const name = filtered?.[1] ?? local?.[1]
  return GATES.some((gate) =>
    gate.steps.some((step) =>
      gate.root
        ? step.join(' ') === line
        : (name && scriptsFor(step).includes(name)) ||
          (step.includes('--test') && name === 'test:toolkit')
    )
  )
}

test('every governance workflow step is a local gate or a named CI-only check', () => {
  for (const line of ciRuns) {
    assert.ok(
      gateCommand(line) || line in CI_ONLY,
      `governance.yml runs "${line}": add it to run-gates.mjs, or to CI_ONLY here with the reason`
    )
  }
  for (const line of Object.keys(CI_ONLY)) {
    assert.ok(ciRuns.includes(line), `CI_ONLY lists "${line}", which governance.yml no longer runs`)
  }
})

test('the gates cover the checks that failed CI most often', () => {
  for (const id of ['format', 'types-tests', 'lint', 'typecheck', 'type-coverage', 'ssr']) {
    assert.ok(
      GATES.some((g) => g.id === id),
      `gate ${id} is missing`
    )
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

test('a pre-push hook runs the gates, so a push never skips them', () => {
  const hook = readFileSync(resolve(ROOT, '.husky/pre-push'), 'utf8')
  assert.match(hook, /@aziontech\/ui run gates/)
})

test('the type coverage gate names its scope, .ts files only', () => {
  const gate = GATES.find((g) => g.id === 'type-coverage')
  assert.match(gate.label, /\.ts files/)
})
