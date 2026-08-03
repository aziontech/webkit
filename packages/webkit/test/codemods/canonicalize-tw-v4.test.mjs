// ENG-47001 — proves the Tailwind v4 canonicalization codemod converts families A/B/E
// and PROVABLY leaves families C and D bracketed. C (`[--x:var(--y)]`) and D
// (`w-[calc(var(--a)*2)]`, gradients, var-with-fallback) compile to NOTHING in the
// paren shorthand, so a greedy rewrite would silently delete styling with no build or
// lint error. This test is the net the acceptance criteria requires.

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { convert } from '../../../../scripts/codemods/canonicalize-tw-v4.mjs'

const only = (s) => convert(s).out

test('family A — whole-value var becomes the paren shorthand', () => {
  for (const [from, to] of [
    ['bg-[var(--primary)]', 'bg-(--primary)'],
    ['focus-visible:ring-offset-[var(--bg-canvas)]', 'focus-visible:ring-offset-(--bg-canvas)'],
    ['max-w-[var(--container-2xl)]', 'max-w-(--container-2xl)'],
    ['data-[disabled]:bg-[var(--bg-disabled)]', 'data-[disabled]:bg-(--bg-disabled)']
  ]) {
    assert.equal(only(from), to)
  }
})

test('family B — typed value keeps its type inside the parens', () => {
  for (const [from, to] of [
    ['text-[length:var(--text-body-md)]', 'text-(length:--text-body-md)'],
    ['border-[color:var(--border-default)]', 'border-(color:--border-default)'],
    ['font-[family-name:var(--font-sora)]', 'font-(family-name:--font-sora)']
  ]) {
    assert.equal(only(from), to)
  }
})

test('family E — numeric z-index arbitrary loses its brackets', () => {
  for (const [from, to] of [
    ['z-[1]', 'z-1'],
    ['z-[2]', 'z-2'],
    ['z-[1002]', 'z-1002']
  ]) {
    assert.equal(only(from), to)
  }
})

test('family C — custom-property declarations stay bracketed (paren form emits no CSS)', () => {
  for (const c of [
    '[--table-row-bg:var(--bg-surface)]',
    '[--menu-item-ring-offset:var(--bg-surface)]',
    'data-[state=selected]:[--table-row-bg:var(--bg-selected)]',
    'data-[hoverable]:hover:[--table-row-bg:var(--bg-canvas)]'
  ]) {
    assert.equal(only(c), c, `family C must be left untouched: ${c}`)
  }
})

test('family D — expression values stay bracketed', () => {
  for (const d of [
    'w-[calc(var(--a)*2)]',
    'shadow-[inset_0_0_0_999px_var(--bg-hover)]',
    'bg-[linear-gradient(90deg,var(--color-base-white),var(--color-blue-500))]',
    '[transform-origin:var(--popup-origin,center)]',
    '[scrollbar-color:var(--border-muted)_transparent]',
    // var WITH a fallback is not a bare whole-value var — the paren shorthand cannot
    // express the comma cleanly, so it must stay bracketed too.
    'bg-[var(--table-row-bg,var(--bg-surface))]',
    'text-[length:var(--border-width-default,1px)]'
  ]) {
    assert.equal(only(d), d, `family D must be left untouched: ${d}`)
  }
})

test('a real mixed line — table-row root — converts A and B while leaving C intact', () => {
  const line =
    '[--table-row-bg:var(--bg-surface)] bg-[var(--table-row-bg)] ' +
    'border-b-[length:var(--border-width-default)] border-[var(--border-default)] ' +
    'data-[state=selected]:[--table-row-bg:var(--bg-selected)] z-[10]'
  const expected =
    '[--table-row-bg:var(--bg-surface)] bg-(--table-row-bg) ' +
    'border-b-(length:--border-width-default) border-(--border-default) ' +
    'data-[state=selected]:[--table-row-bg:var(--bg-selected)] z-10'
  assert.equal(only(line), expected)
})
