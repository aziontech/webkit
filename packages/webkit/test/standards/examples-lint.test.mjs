import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import {
  compareToBaseline,
  consumerConfigSource,
  countMessages,
  lintExamples,
  loadConsumerConfig,
  resolveConfigImports,
  sortCounts,
  total
} from '../../scripts/check-examples-lint.mjs'
import { GATES } from '../../scripts/gates.mjs'
import { _internals } from '../../src/cli/plan.js'

const baseline = JSON.parse(
  readFileSync(new URL('../../scripts/examples-lint-baseline.json', import.meta.url), 'utf-8')
)

test('the gate lints with the exact config `webkit init` writes (strict preset)', async () => {
  const source = consumerConfigSource()
  assert.equal(source, _internals.eslintFlatConfig('strict'))
  const rewritten = resolveConfigImports(source, (spec) => `resolved:${spec}`)
  assert.equal(rewritten.replace(/'resolved:([^']+)'/g, "'$1'"), source)
  assert.match(rewritten, /from 'resolved:@aziontech\/webkit\/eslint-plugin'/)
  const config = await loadConsumerConfig()
  const rules = Object.assign({}, ...config.map((c) => c.rules || {}))
  assert.equal(rules['webkit/prefer-tree-shakeable-root'], 'error')
  assert.equal(rules['webkit/no-style-override'], 'error')
  assert.equal(rules['vuejs-accessibility/label-has-for'], 'error')
})

test('the gate is wired into gates.mjs', () => {
  const gate = GATES.find((g) => g.id === 'examples-lint')
  assert.ok(gate)
  assert.deepEqual(gate.steps, [['node', 'scripts/check-examples-lint.mjs']])
})

test('countMessages counts every finding per file and rule, never deduplicating', () => {
  const root = '/x/examples'
  const msg = (ruleId) => ({ ruleId, line: 1, column: 1, message: 'm' })
  const { counts } = countMessages(
    [
      {
        filePath: '/x/examples/a/default.vue',
        messages: [msg('webkit/r'), msg('webkit/r'), msg(null)]
      },
      { filePath: '/x/examples/b/default.vue', messages: [] }
    ],
    root
  )
  assert.deepEqual(counts, { 'a/default.vue': { 'webkit/r': 2, 'parse-error': 1 } })
  assert.equal(total(counts), 3)
})

test('compareToBaseline fails on growth and reports what shrank', () => {
  const base = { 'a/x.vue': { r: 2 }, 'b/y.vue': { r: 1 } }
  const { regressions, fixed } = compareToBaseline(
    { 'a/x.vue': { r: 3 }, 'c/z.vue': { s: 1 } },
    base
  )
  assert.deepEqual(regressions, [
    { file: 'a/x.vue', rule: 'r', count: 3, allowed: 2 },
    { file: 'c/z.vue', rule: 's', count: 1, allowed: 0 }
  ])
  assert.deepEqual(fixed, [{ file: 'b/y.vue', rule: 'r', count: 0, allowed: 1 }])
  assert.deepEqual(compareToBaseline({ 'a/x.vue': { r: 2 } }, { 'a/x.vue': { r: 2 } }), {
    regressions: [],
    fixed: []
  })
})

test('the baseline is sorted and holds positive integer counts', () => {
  assert.deepEqual(Object.keys(baseline), Object.keys(sortCounts(baseline)))
  for (const [file, rules] of Object.entries(baseline)) {
    assert.match(file, /^[a-z0-9-]+\/.+\.(vue|ts|js)$/)
    for (const [rule, n] of Object.entries(rules)) {
      assert.ok(Number.isInteger(n) && n > 0, `${file} ${rule}: ${n}`)
    }
  }
})

test('a copied example that breaks the consumer lint is caught', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'examples-lint-'))
  try {
    mkdirSync(join(dir, 'demo'))
    writeFileSync(
      join(dir, 'demo/bad.vue'),
      [
        '<script setup lang="ts">',
        "  import Button from '@aziontech/webkit/button'",
        "  import ChatMessage from '@aziontech/webkit/chat-message'",
        '</script>',
        '',
        '<template>',
        '  <ChatMessage>Hi</ChatMessage>',
        '  <Button class="bg-red-500 mt-4" label="Go" />',
        '</template>',
        ''
      ].join('\n')
    )
    writeFileSync(
      join(dir, 'demo/good.vue'),
      [
        '<script setup lang="ts">',
        "  import Button from '@aziontech/webkit/button'",
        '</script>',
        '',
        '<template>',
        '  <Button class="w-full" label="Go" />',
        '</template>',
        ''
      ].join('\n')
    )
    const { counts } = await lintExamples({ dir })
    assert.deepEqual(Object.keys(counts), ['demo/bad.vue'])
    assert.equal(counts['demo/bad.vue']['webkit/prefer-tree-shakeable-root'], 1)
    assert.equal(counts['demo/bad.vue']['webkit/no-style-override'], 1)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})
