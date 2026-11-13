import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  BASELINE,
  CHECKS,
  collectFindings,
  compareBaseline,
  parseSpecExamples,
  summarize
} from '../../scripts/check-complete.mjs'
import {
  baseRef,
  hasBudgetRaise,
  limitToBytes,
  raisedBudgets
} from '../../scripts/check-size-ratchet.mjs'

const FIXTURES = join(dirname(fileURLToPath(import.meta.url)), 'fixtures/complete-examples')
const fixture = (name) => readFileSync(join(FIXTURES, name), 'utf-8')

test('parseSpecExamples counts top-level bullets, skipping nested bullets, notes and comments', () => {
  assert.deepEqual(parseSpecExamples(fixture('bullets.md')), [
    'Default',
    'Sizes',
    'Form submit (type)'
  ])
})

test('parseSpecExamples reads the inline list, keeping commas inside parentheses', () => {
  assert.deepEqual(parseSpecExamples(fixture('inline.md')), ['Command', 'Irreversible', 'Resolved'])
})

test('parseSpecExamples reads table rows after the header', () => {
  assert.deepEqual(parseSpecExamples(fixture('table.md')), ['Default', 'Loading'])
})

test('parseSpecExamples returns nothing for prose or a missing section', () => {
  assert.deepEqual(parseSpecExamples(fixture('prose.md')), [])
  assert.deepEqual(parseSpecExamples(null), [])
})

const write = (root, rel, content) => {
  mkdirSync(dirname(join(root, rel)), { recursive: true })
  writeFileSync(join(root, rel), typeof content === 'string' ? content : JSON.stringify(content))
}

const spec = (name, status, examples) =>
  `---\nname: ${name}\nstatus: ${status}\n---\n\n## Purpose\n\nx\n\n## Examples\n\n${examples}\n\n## Constraints — DO NOT\n\n- x\n`

function fixtureRepo() {
  const root = mkdtempSync(join(tmpdir(), 'complete-'))
  const pkg = 'packages/webkit'
  write(root, `${pkg}/catalog.json`, {
    imports: {
      button: { kind: 'component' },
      tabs: { kind: 'component' },
      'tabs-item': { kind: 'subcomponent', parent: 'tabs' },
      accordion: { kind: 'component' },
      'accordion-root': { kind: 'root', rootOf: 'accordion' },
      chart: { kind: 'component' },
      panel: { kind: 'component' }
    }
  })
  write(root, `${pkg}/package.json`, {
    exports: {
      './button': {
        types: './types/b.d.ts',
        default: './src/components/actions/button/button.vue'
      },
      './tabs': './src/components/navigation/tabs/index.ts',
      './tabs-item': './src/components/navigation/tabs/tabs-item/tabs-item.vue',
      './accordion': './src/components/content/accordion/index.ts',
      './accordion-root': './src/components/content/accordion/accordion.vue',
      './chart': './src/components/data/chart/chart.vue',
      './panel': './src/components/overlay/panel/panel.vue'
    }
  })
  write(root, `${pkg}/.size-limit.json`, [
    { name: 'button', path: 'src/components/actions/button/button.vue', limit: '2 KB' },
    { name: 'acc', path: 'src/components/content/accordion/accordion.vue', limit: '3 KB' },
    { name: 'panel-root', path: 'src/components/overlay/panel/panel.vue', limit: '3 KB' }
  ])
  write(root, '.specs/button.md', spec('button', 'implemented', '- Default\n- Types\n- Sizes'))
  write(root, '.specs/tabs.md', spec('tabs', 'implemented', '- Default'))
  write(root, '.specs/accordion.md', spec('accordion', 'implemented', '- Default'))
  write(root, '.specs/chart.md', spec('chart', 'approved', '- Default'))
  write(root, '.specs/panel.md', spec('panel', 'implemented', '- Default'))
  write(root, '.specs/ghost.md', spec('ghost', 'implemented', '- Default'))
  write(root, '.specs/future.md', spec('future', 'approved', '- Default'))
  write(root, '.specs/_template.md', spec('x', 'implemented', '- Default'))
  const group = (name, files) =>
    write(root, `${pkg}/examples/${name}/examples.json`, {
      component: name,
      examples: files.map((file) => ({ name: file, file }))
    })
  group('button', ['default.vue', 'types.vue'])
  group('tabs', ['default.vue'])
  group('accordion', ['default.vue'])
  group('chart', ['default.vue'])
  group('assets-scene', [])
  for (const name of ['button', 'accordion', 'chart']) {
    write(root, `apps/visual/baselines/examples/${name}/default--light-1280.png`, '')
  }
  return root
}

test('collectFindings reports each missing piece once, keyed by subject and check', () => {
  const root = fixtureRepo()
  try {
    const keys = [...collectFindings(root).keys()].sort()
    assert.deepEqual(keys, [
      'button::examples-count',
      'chart::size-budget',
      'chart::spec-status',
      'examples/assets-scene::visual-baseline',
      'examples/tabs::visual-baseline',
      'ghost::export',
      'panel::examples',
      'tabs::root-export',
      'tabs::size-budget'
    ])
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('compareBaseline fails new findings and stale baseline entries alike', () => {
  const { introduced, stale } = compareBaseline(['a::x', 'c::y'], ['a::x', 'b::x'])
  assert.deepEqual(introduced, ['c::y'])
  assert.deepEqual(stale, ['b::x'])
  assert.deepEqual(compareBaseline(['a::x'], ['a::x']), { introduced: [], stale: [] })
})

test('summarize counts findings per check', () => {
  assert.deepEqual(summarize(['a::size-budget', 'b::size-budget', 'examples/c::visual-baseline']), {
    'size-budget': 2,
    'visual-baseline': 1
  })
})

test('the committed baseline is sorted and names only known checks', () => {
  const baseline = JSON.parse(readFileSync(BASELINE, 'utf-8'))
  assert.deepEqual(baseline, [...baseline].sort())
  for (const key of baseline) {
    assert.ok(CHECKS[key.slice(key.lastIndexOf('::') + 2)], `unknown check in baseline: ${key}`)
  }
})

test('limitToBytes parses B, KB and MB', () => {
  assert.equal(limitToBytes('512 B'), 512)
  assert.equal(limitToBytes('2.5 KB'), 2560)
  assert.equal(limitToBytes('1MB'), 1024 * 1024)
  assert.throws(() => limitToBytes('2 kilobytes'), /unparseable/)
})

test('raisedBudgets flags only a raised limit, not a lowered, unchanged or new one', () => {
  const base = [
    { name: 'a', limit: '2 KB' },
    { name: 'b', limit: '2 KB' },
    { name: 'c', limit: '2 KB' },
    { name: 'gone', limit: '1 KB' }
  ]
  const head = [
    { name: 'a', limit: '2.5 KB' },
    { name: 'b', limit: '1 KB' },
    { name: 'c', limit: '2048 B' },
    { name: 'new', limit: '90 KB' }
  ]
  assert.deepEqual(raisedBudgets(base, head), [{ name: 'a', from: '2 KB', to: '2.5 KB' }])
})

test('raisedBudgets keys entries by measured path, so a renamed entry is compared with its own path', () => {
  const base = [
    { name: 'shell', path: 'src/shell.vue', limit: '66 KB' },
    { name: 'other', path: 'src/index.ts', limit: '10 KB' }
  ]
  const head = [
    { name: 'shell-root', path: 'src/shell.vue', limit: '66 KB' },
    { name: 'shell', path: 'src/index.ts', limit: '72 KB' }
  ]
  assert.deepEqual(raisedBudgets(base, head), [{ name: 'shell', from: '10 KB', to: '72 KB' }])
})

test('hasBudgetRaise needs a line starting Budget-raise: with a reason', () => {
  assert.equal(hasBudgetRaise('Summary\r\nBudget-raise: the chart gained a brush'), true)
  assert.equal(hasBudgetRaise('  Budget-raise: indented is fine'), true)
  assert.equal(hasBudgetRaise('Budget-raise:'), false)
  assert.equal(hasBudgetRaise('No Budget-raise: mid-line'), false)
  assert.equal(hasBudgetRaise(undefined), false)
})

test('baseRef uses the PR base, skips non-PR CI runs, falls back locally', () => {
  assert.deepEqual(baseRef({ GITHUB_BASE_REF: 'main', GITHUB_ACTIONS: 'true' }), {
    ref: 'origin/main'
  })
  assert.ok(baseRef({ GITHUB_ACTIONS: 'true' }).skip)
  assert.deepEqual(baseRef({}), { ref: 'origin/feat/webkit-ai-ready' })
})
