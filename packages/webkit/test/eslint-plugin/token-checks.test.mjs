// Pins the zero-with-unit / zero-unit-in-calc checks — the most intricate regexes in
// the token-checks engine (variable-length lookbehinds balancing parens), including
// their documented one-level nesting limit — plus the tokenChecksApply file filter
// both enforcement surfaces (write-time hook + CI ratchet) scope with.

import { test } from 'node:test'
import assert from 'node:assert/strict'

import { scanTokens, tokenChecksApply } from '../../src/eslint-plugin/token-checks.js'

/** All violated check ids for a snippet. */
const ids = (content) => scanTokens(content)

test('zero-with-unit fires on a zero length carrying a unit', () => {
  for (const content of [
    'margin: 0px',
    '--tracking-normal: 0rem',
    "const tracking = { normal: '0em' }",
    'class="p-[0px] translate-y-[0rem]"',
    "node.style.height = '0px'",
    'margin: 0PX' // CSS units are case-insensitive
  ]) {
    assert.ok(ids(content).includes('zero-with-unit'), `expected zero-with-unit for: ${content}`)
  }
})

test('the completed unit list catches the logical/root-relative units (ENG-46996)', () => {
  // Representative new units; the theme test (zero-unit.test.mjs) pins the full set. Kept
  // in sync with LENGTH_UNITS in packages/theme/src/scripts/zero-unit.mjs.
  for (const unit of ['vi', 'vb', 'svi', 'dvb', 'rex', 'rch', 'ric', 'rcap']) {
    assert.ok(ids(`x: 0${unit}`).includes('zero-with-unit'), `0${unit} slipped through`)
  }
})

test('a newly-covered unit inside a math function is zero-unit-in-calc, not zero-with-unit', () => {
  const found = ids('inset: max(0vi, var(--x))')
  assert.ok(found.includes('zero-unit-in-calc'), 'expected zero-unit-in-calc for 0vi in max()')
  assert.ok(!found.includes('zero-with-unit'), 'expected no zero-with-unit for 0vi in max()')
})

test('zero-with-unit stays silent for bare zeros, non-zero lengths and meaningful units', () => {
  for (const content of [
    'margin: 0',
    'width: 10px',
    'padding: 0.5rem',
    'flex-basis: 0%',
    'transition-duration: 0s',
    'rotate: 0deg',
    'grid-template-columns: 0fr',
    'class="p-0 translate-y-0"'
  ]) {
    assert.ok(!ids(content).includes('zero-with-unit'), `expected silence for: ${content}`)
  }
})

test('a zero inside a math function is zero-unit-in-calc territory, not zero-with-unit', () => {
  for (const content of [
    'width: calc(100% - 0px)',
    'height: min(0em, 1rem)',
    'width: clamp(0px, 2vw, 1rem)',
    'width: calc(var(--x) - 0px)' // one nested call before the zero
  ]) {
    const found = ids(content)
    assert.ok(found.includes('zero-unit-in-calc'), `expected zero-unit-in-calc for: ${content}`)
    assert.ok(!found.includes('zero-with-unit'), `expected no zero-with-unit for: ${content}`)
  }
})

test('0rem inside a math function is the sanctioned form — both checks stay silent', () => {
  for (const content of ['width: calc(100% - 0rem)', 'height: max(0rem, var(--h))']) {
    const found = ids(content)
    assert.ok(!found.includes('zero-with-unit'), `expected no zero-with-unit for: ${content}`)
    assert.ok(!found.includes('zero-unit-in-calc'), `expected no zero-unit-in-calc for: ${content}`)
  }
})

test('a closed math function does not leak its exemption to a later zero', () => {
  const found = ids('width: calc(100% - 1px); margin: 0px')
  assert.ok(found.includes('zero-with-unit'), 'the zero after the closed calc() is a bare zero')
  assert.ok(!found.includes('zero-unit-in-calc'), 'nothing inside the calc() misuses a unit')
})

// Known limit, documented on the regexes: the math-function lookbehind balances parens
// one level deep, so a zero sitting ≥2 nested calls in is reported as zero-with-unit
// (bare-zero guidance) instead of zero-unit-in-calc. If this assertion ever flips, the
// regexes learned deeper nesting — move the case into the zero-unit-in-calc test above.
test('the one-level nesting limit is pinned', () => {
  const found = ids('width: calc(min(max(1px, 2px), 3px) - 0px)')
  assert.ok(found.includes('zero-with-unit'), 'expected the depth-limited fallback report')
  assert.ok(!found.includes('zero-unit-in-calc'), 'zero-unit-in-calc cannot see this deep')
})

test('the arbitrary-value guardrails catch the paren spelling as well as the bracket spelling', () => {
  const cases = [
    ['typography-raw-length', 'text-[length:var(--text-body-md)]', 'text-(length:--text-body-md)'],
    ['leading-raw', 'leading-[1.5]', 'leading-(--leading-body)'],
    ['tracking-raw', 'tracking-[0.5px]', 'tracking-(--tracking-tight)'],
    ['font-family-raw', 'font-[family-name:var(--font-sora)]', 'font-(family-name:--font-sora)'],
    ['animate-arbitrary', 'animate-[spin_1s]', 'animate-(--animation-spin)'],
    ['motion-hardcoded', 'duration-[200ms]', 'duration-(--duration-fast)']
  ]
  for (const [id, bracket, paren] of cases) {
    assert.ok(ids(bracket).includes(id), `expected ${id} for bracket form: ${bracket}`)
    assert.ok(ids(paren).includes(id), `expected ${id} for paren form: ${paren}`)
  }
})

test('the paren spellings named in ENG-47001 acceptance are all caught', () => {
  for (const [content, id] of [
    ['duration-(--duration-fast)', 'motion-hardcoded'],
    ['animate-(--x)', 'animate-arbitrary'],
    ['leading-(--y)', 'leading-raw'],
    ['tracking-(--z)', 'tracking-raw'],
    ['text-(length:--text-body-md)', 'typography-raw-length'],
    ['font-(family-name:--font-sora)', 'font-family-raw']
  ]) {
    assert.ok(ids(content).includes(id), `expected ${id} for: ${content}`)
  }
})

test('the widened guardrails do not fire on the canonical whole-value paren token', () => {
  for (const content of [
    'bg-(--primary)',
    'max-w-(--container-2xl)',
    'ring-offset-(--bg-canvas)'
  ]) {
    const found = ids(content)
    for (const id of [
      'typography-raw-length',
      'leading-raw',
      'tracking-raw',
      'font-family-raw',
      'animate-arbitrary',
      'motion-hardcoded'
    ]) {
      assert.ok(!found.includes(id), `expected ${id} silent for canonical token: ${content}`)
    }
  }
})

test('dead-token-shorthand fires on a paren shorthand that emits no CSS', () => {
  for (const content of [
    // The one that shipped: a stray space terminates the candidate.
    'class="data-[kind=filled]:bg-(--bg-surface-raised )"',
    'class="bg-( --bg-surface)"',
    'class="text-(length:--text-body-md )"',
    // A token broken across lines is the same defect.
    'class="bg-(--bg-\n  surface)"',
    // Bracket and paren forms inverted.
    'class="min-h-[--(size-4)]"'
  ]) {
    assert.ok(
      ids(content).includes('dead-token-shorthand'),
      `expected dead-token-shorthand for: ${content}`
    )
  }
})

test('dead-token-shorthand stays silent on every VALID token spelling', () => {
  for (const content of [
    'class="bg-(--bg-surface) text-(--text-default) rounded-(--shape-card)"',
    'class="text-(length:--text-body-md) font-(family-name:--font-sora)"',
    'class="data-[disabled]:bg-(--bg-disabled)"',
    // Declaring a custom property keeps its brackets — the sanctioned form.
    'class="[--table-row-bg:var(--bg-surface)]"',
    'class="data-[state=selected]:[--table-row-bg:var(--bg-selected)]"',
    // Expression values legitimately carry spaces INSIDE brackets, not parens.
    'class="w-[calc(100%_-_var(--x))]"',
    'style="width: calc(var(--a) - (var(--b) * 2))"',
    // A var with a fallback: `-(` never precedes the `--`, so this is not a match.
    'style="background: var(--x, var(--y))"',
    // Ordinary subtraction in script, with and without a space.
    'const gap = width -(padding + border)',
    'const gap = width - (padding + border)'
  ]) {
    assert.ok(
      !ids(content).includes('dead-token-shorthand'),
      `expected dead-token-shorthand silent for: ${content}`
    )
  }
})

test('tokenChecksApply scopes enforcement to component sources', () => {
  assert.ok(tokenChecksApply('packages/webkit/src/components/actions/button/button.vue'))
  assert.ok(tokenChecksApply('packages/webkit/src/components/data/table/injection-key.ts'))
  // Tests assert browser-serialized values (a collapsed height reads back as '0px')
  // and use @ts-expect-error to exercise type surfaces — exempt on both surfaces.
  assert.ok(!tokenChecksApply('packages/webkit/src/components/actions/button/button.test.ts'))
  assert.ok(!tokenChecksApply('packages/webkit/src/components/actions/button/button.spec.ts'))
  assert.ok(!tokenChecksApply('packages/webkit/src/composables/use-controllable.ts'))
})
