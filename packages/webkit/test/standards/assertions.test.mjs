import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'

import { MAX_ASSERTIONS, scan, scanSource, verdict } from '../../scripts/check-assertions.mjs'

const kinds = (found) => found.map((f) => f.kind)

test('as never and as unknown as are reported, other assertions are counted', () => {
  const found = scanSource(
    `const a = x as never
const b = y as unknown as Date
const c = z as string
const d = <number>w`,
    'file.ts'
  )
  assert.deepEqual(kinds(found), ['as-never', 'as-unknown-as', 'assertion', 'assertion'])
  assert.deepEqual(
    found.map((f) => f.line),
    [1, 2, 3, 4]
  )
})

test('only the unbound default of a defineModel may be undefined as never', () => {
  const found = scanSource(
    `const open = defineModel<boolean>('open', { default: undefined as never })
const other = { default: undefined as never }
const value = defineModel<string>({ default: '' as never })`,
    'file.ts'
  )
  assert.deepEqual(kinds(found), ['as-never', 'as-never'])
  assert.deepEqual(
    found.map((f) => f.line),
    [2, 3]
  )
})

test('as const and satisfies are not assertions', () => {
  const found = scanSource(
    `const a = ['x', 'y'] as const
const b = { size: 1 } satisfies Record<string, number>`,
    'file.ts'
  )
  assert.deepEqual(found, [])
})

test('a .vue file is read in its scripts and its template expressions', () => {
  const found = scanSource(
    `<script setup lang="ts">
const model = defineModel<boolean>('open', { default: null as never })
</script>
<template>
  <div :data-testid="($attrs['data-testid'] as string) ?? 'x'">{{ (count as number) + 1 }}</div>
</template>
`,
    'file.vue'
  )
  assert.deepEqual(kinds(found), ['as-never', 'assertion', 'assertion'])
  assert.deepEqual(
    found.map((f) => f.line),
    [2, 5, 5]
  )
})

function fixture(files) {
  const dir = mkdtempSync(join(tmpdir(), 'check-assertions-'))
  for (const [rel, text] of Object.entries(files)) {
    mkdirSync(join(dir, rel, '..'), { recursive: true })
    writeFileSync(join(dir, rel), text)
  }
  return dir
}

test('a banned assertion in src, blocks or examples fails; tests are skipped', () => {
  const dir = fixture({
    'src/a.ts': 'export const a = 1 as unknown as string\n',
    'blocks/b/b.vue': '<script setup lang="ts">\nconst b = 1 as never\n</script>\n',
    'examples/c/c.vue': '<script setup lang="ts">\nconst c = 1 as number\n</script>\n',
    'src/a.test.ts': 'export const t = 1 as never\n',
    'src/test/helper.ts': 'export const h = 1 as never\n'
  })
  try {
    const result = scan(dir)
    assert.deepEqual(result.banned, ['src/a.ts:1 as unknown as', 'blocks/b/b.vue:2 as never'])
    assert.equal(result.counted, 1)
    const { ok, errors } = verdict(result, 10)
    assert.equal(ok, false)
    assert.match(errors[0], /2 assertion\(s\) that hide a type mismatch/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('the count of assertions in src may not grow past the committed number', () => {
  const dir = fixture({ 'src/a.ts': 'export const a = (1 as number) + (2 as number)\n' })
  try {
    const result = scan(dir)
    assert.equal(result.counted, 2)
    assert.deepEqual(verdict(result, 2), { ok: true, errors: [], lower: false })
    assert.equal(verdict(result, 3).lower, true)
    const over = verdict(result, 1)
    assert.equal(over.ok, false)
    assert.match(over.errors[0], /2 type assertions in src, more than the 1 allowed/)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})

test('the committed number is the count of assertions in src today', () => {
  assert.equal(scan().counted, MAX_ASSERTIONS)
})
