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
  FALLBACK_BASE,
  baseRef,
  budgetRaiseLines,
  justifies,
  limitToBytes,
  raisedBudgets,
  unjustified
} from '../../scripts/check-size-ratchet.mjs'
import { initialOutputs, lazyEntries } from '../../scripts/check-size.mjs'

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
        default: './src/components/action/button/button.vue'
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
    { name: 'button', path: 'src/components/action/button/button.vue', limit: '2 KB' },
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

test('raisedBudgets treats a switch to entryOnly as a raise, even at the same limit', () => {
  const base = [
    { name: 'tabs', path: 'src/tabs.vue', limit: '12 KB' },
    { name: 'table', path: 'src/table.vue', limit: '40 KB', entryOnly: true }
  ]
  const head = [
    { name: 'tabs', path: 'src/tabs.vue', limit: '12 KB', entryOnly: true },
    { name: 'table', path: 'src/table.vue', limit: '40 KB', entryOnly: true }
  ]
  assert.deepEqual(raisedBudgets(base, head), [
    { name: 'tabs', from: '12 KB', to: '12 KB (entryOnly: lazy chunks no longer counted)' }
  ])
  assert.deepEqual(raisedBudgets(head, base), [])
})

test('initialOutputs counts the entry and every chunk it imports statically, not lazy chunks', () => {
  const chunk = (fileName, extra) => ({ type: 'chunk', fileName, imports: [], ...extra })
  const outputs = [
    chunk('entry.js', { isEntry: true, imports: ['shared.js'], dynamicImports: ['lazy.js'] }),
    chunk('shared.js', { imports: ['deep.js'] }),
    chunk('deep.js'),
    chunk('lazy.js', { imports: ['shared.js', 'lazy-only.js'] }),
    chunk('lazy-only.js')
  ]
  assert.deepEqual(
    initialOutputs(outputs).map((o) => o.fileName),
    ['entry.js', 'shared.js', 'deep.js']
  )
})

test('lazyEntries lists each chunk an entryOnly build excludes with what it would load', () => {
  const chunk = (fileName, extra) => ({ type: 'chunk', fileName, imports: [], ...extra })
  const outputs = [
    chunk('entry.js', { isEntry: true, imports: ['shared.js'], dynamicImports: ['scene.js'] }),
    chunk('shared.js', { dynamicImports: ['registry.js'] }),
    chunk('scene.js', { imports: ['shared.js', 'scene-data.js'] }),
    chunk('scene-data.js'),
    chunk('registry.js', { dynamicImports: ['drawing.js'] }),
    chunk('drawing.js')
  ]
  const lazy = lazyEntries(outputs, initialOutputs(outputs))
  assert.deepEqual(
    lazy.map((l) => [l.fileName, l.outputs.map((o) => o.fileName)]),
    [
      ['scene.js', ['scene.js', 'scene-data.js']],
      ['registry.js', ['registry.js']]
    ]
  )
})

test('budgetRaiseLines keeps only lines starting Budget-raise: with a reason', () => {
  assert.deepEqual(
    budgetRaiseLines(
      'Summary\r\n  Budget-raise: a 1 KB → 2 KB: why\nBudget-raise:\nNo Budget-raise: x'
    ),
    ['Budget-raise: a 1 KB → 2 KB: why']
  )
  assert.deepEqual(budgetRaiseLines(undefined), [])
})

test('a raise needs its own line naming the entry and its new limit', () => {
  const raise = { name: 'table-root', from: '1.95 KB', to: '2.3 KB' }
  assert.equal(justifies('Budget-raise: table-root 1.95 KB → 2.3 KB: why', raise), true)
  assert.equal(justifies('Budget-raise: table-root 1.95 → 2.3 KB (measured 2.2 KB)', raise), true)
  assert.equal(justifies('Budget-raise: table-root 1.95 KB -> 2.3 KB', raise), true)
  assert.equal(justifies('Budget-raise: table-root 1.9 KB → 1.95 KB', raise), false)
  assert.equal(justifies('Budget-raise: table-root-extra 1.95 KB → 2.3 KB', raise), false)
  assert.equal(justifies('Budget-raise: the chart gained a brush', raise), false)
  const other = { name: 'data-grid', from: '10.5 KB', to: '11.15 KB' }
  assert.deepEqual(unjustified([raise, other], 'Budget-raise: table-root 1.95 KB → 2.3 KB'), [
    other
  ])
  assert.deepEqual(
    unjustified(
      [raise, other],
      'Budget-raise: table-root 1.95 KB → 2.3 KB',
      'Budget-raise: data-grid 10.5 KB → 11.15 KB'
    ),
    []
  )
})

test('every raise in the 8e86a5b59 to e106f1a04 push has its line in size-budgets-v6.md', () => {
  const record = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), '../../docs/reviews/size-budgets-v6.md'),
    'utf-8'
  )
  for (const [name, from, limit] of [
    ['table-root', '1.95 KB', '2.3 KB'],
    ['data-table', '57.05 KB', '57.45 KB'],
    ['flow-diagram-root', '19.3 KB', '19.75 KB'],
    ['listing-index-section', '40.2 KB', '40.55 KB']
  ]) {
    assert.deepEqual(unjustified([{ name, from, to: limit }], record), [], name)
  }
})

test('baseRef uses the PR base, skips non-PR CI runs, falls back locally', () => {
  assert.deepEqual(baseRef({ GITHUB_BASE_REF: 'main', GITHUB_ACTIONS: 'true' }), {
    ref: 'origin/main'
  })
  assert.ok(baseRef({ GITHUB_ACTIONS: 'true' }).skip)
  assert.deepEqual(baseRef({}), { ref: 'origin/main' })
  assert.equal(FALLBACK_BASE, 'origin/main')
})
