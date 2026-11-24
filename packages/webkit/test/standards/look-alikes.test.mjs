import assert from 'node:assert/strict'
import test from 'node:test'

import { BASELINE, compareBaseline, findCopies } from '../../scripts/check-look-alikes.mjs'
import {
  baseUtility,
  compare,
  describe,
  FAMILY_SIZE,
  jaccard,
  pairKey
} from '../../scripts/lib/look-alikes.mjs'

const sfc = (script, template) =>
  `<script setup lang="ts">\n${script}\n</script>\n<template>\n${template}\n</template>\n`

const LINK_OR_BUTTON = sfc(
  `import Spinner from '@aziontech/webkit/spinner'
interface Props {
  size?: string
  disabled?: boolean
  loading?: boolean
  href?: string
}
const props = defineProps<Props>()
const isAnchor = computed(() => !!props.href)`,
  `<a v-if="isAnchor" :href="href" rel="noopener" class="inline-flex focus-visible:ring-2 data-[size=small]:h-7"><Spinner /></a>
<button v-else :disabled="disabled" class="inline-flex focus-visible:ring-2 data-[size=small]:h-7"><Spinner /></button>`
)

const BUILT_ON_IT = sfc(
  `import Button from '@aziontech/webkit/button'
interface Props {
  size?: string
  disabled?: boolean
  loading?: boolean
  href?: string
}`,
  `<Button :size="size" :href="href" class="inline-flex focus-visible:ring-2"><slot /></Button>`
)

const UNRELATED = sfc(
  `interface Props {
  columns?: number
}`,
  `<div class="grid gap-4"><slot /></div>`
)

test('jaccard is zero for two empty sets and shrinks with a prior', () => {
  assert.equal(jaccard(new Set(), new Set()), 0)
  assert.equal(jaccard(new Set(['a']), new Set(['a'])), 1)
  assert.equal(jaccard(new Set(['a']), new Set(['a']), 3), 0.25)
})

test('baseUtility drops every variant prefix', () => {
  assert.equal(baseUtility('data-[size=small]:h-7'), 'h-7')
  assert.equal(baseUtility('hover:focus-visible:ring-2'), 'ring-2')
  assert.equal(baseUtility('flex'), 'flex')
})

test('pairKey does not depend on the order', () => {
  assert.equal(pairKey('icon-button', 'button'), pairKey('button', 'icon-button'))
})

test('two components that copy the same job are a copy; one built on the other is reuse', () => {
  const a = describe('button', 'a.vue', LINK_OR_BUTTON)
  const b = describe('icon-button', 'b.vue', LINK_OR_BUTTON)
  const copy = compare(a, b)
  assert.equal(copy.verdict, 'copy')
  assert.ok(copy.sharedBehaviour.includes('feat:link-or-button'))
  assert.ok(copy.sharedBehaviour.includes('feat:spinner'))

  const built = describe('split-button', 'c.vue', BUILT_ON_IT)
  built.imports.add('button')
  assert.equal(compare(a, built).reuse, true)
  assert.notEqual(compare(a, built).verdict, 'copy')

  assert.equal(compare(a, describe('card-grid', 'd.vue', UNRELATED)).verdict, 'distinct')
})

test('two components that import the same private part reuse it, unless the part is shared infrastructure', async () => {
  const { mkdtempSync, mkdirSync, writeFileSync } = await import('node:fs')
  const { tmpdir } = await import('node:os')
  const { join } = await import('node:path')
  const root = mkdtempSync(join(tmpdir(), 'look-alikes-'))
  const parts = join(root, 'src/components/action/button/parts')
  mkdirSync(parts, { recursive: true })
  writeFileSync(join(parts, 'button-frame.vue'), '<template><slot /></template>')
  const withPart = LINK_OR_BUTTON.replace(
    'import Spinner',
    "import ButtonFrame from '../button/parts/button-frame.vue'\nimport Spinner"
  )
  const fileA = join(root, 'src/components/action/a/a.vue')
  const fileB = join(root, 'src/components/action/b/b.vue')
  const a = describe('button', fileA, withPart)
  const b = describe('icon-button', fileB, withPart)
  const users = (n) => new Map([[join(parts, 'button-frame.vue'), n]])
  a.moduleUsers = users(2)
  assert.equal(compare(a, b).verdict, 'reuse')
  a.moduleUsers = users(FAMILY_SIZE + 1)
  assert.equal(compare(a, b).verdict, 'copy')
})

test('compareBaseline reports new pairs and pairs that no longer look alike', () => {
  const pairs = [
    { key: 'a::b', verdict: 'copy' },
    { key: 'c::d', verdict: 'copy' },
    { key: 'e::f', verdict: 'check' }
  ]
  const { introduced, stale } = compareBaseline(pairs, {
    known: ['a::b', 'x::y'],
    accepted: { 'z::w': 'mirror pair' }
  })
  assert.deepEqual(
    introduced.map((p) => p.key),
    ['c::d']
  )
  assert.deepEqual(stale, ['x::y', 'z::w'])
})

test('the repository matches its baseline and knows no look-alike pair', async () => {
  const { readFileSync } = await import('node:fs')
  const baseline = JSON.parse(readFileSync(BASELINE, 'utf8'))
  const { pairs } = findCopies()
  const { introduced, stale } = compareBaseline(pairs, baseline)
  assert.deepEqual(
    introduced.map((p) => p.key),
    []
  )
  assert.deepEqual(stale, [])
  assert.deepEqual(baseline.known, [])
  const icon = pairs.find((p) => p.key === 'button::icon-button')
  assert.ok(!icon || icon.verdict !== 'copy')
  const split = pairs.find((p) => p.key === 'button::split-button')
  assert.ok(!split || split.verdict !== 'copy')
})
