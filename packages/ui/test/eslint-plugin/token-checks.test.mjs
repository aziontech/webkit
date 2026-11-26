// Pins the zero-with-unit / zero-unit-in-calc checks — the most intricate regexes in
// the token-checks engine (variable-length lookbehinds balancing parens), including
// their documented one-level nesting limit — plus the tokenChecksApply file filter
// both enforcement surfaces (write-time hook + CI ratchet) scope with.

import { test } from 'node:test'
import assert from 'node:assert/strict'

import {
  scanTokens,
  tokenChecksApply,
  tokenChecksFor
} from '../../src/eslint-plugin/lib/token-checks.js'

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
  // in sync with LENGTH_UNITS in packages/theme/scripts/lib/zero-unit.mjs.
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

test('a var() fallback inside a math function is math-function territory', () => {
  for (const content of [
    'min-h-[calc(100dvh-var(--offset,0rem))]',
    'top-[calc(var(--offset,0rem)+var(--spacing-xl))]'
  ]) {
    const found = ids(content)
    assert.ok(!found.includes('zero-with-unit'), `expected no zero-with-unit for: ${content}`)
    assert.ok(!found.includes('zero-unit-in-calc'), `expected no zero-unit-in-calc for: ${content}`)
  }
  const wrong = ids('h-[calc(100dvh-var(--offset,0px))]')
  assert.ok(wrong.includes('zero-unit-in-calc'), 'a px zero in a var() fallback inside calc()')
  assert.ok(!wrong.includes('zero-with-unit'), 'not reported as a bare zero')
  const after = ids('w-[calc(var(--a,0rem))] m-[0px]')
  assert.ok(after.includes('zero-with-unit'), 'the zero after the closed calc() is a bare zero')
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
    ['font-family-raw', 'font-[family-name:var(--font-sans)]', 'font-(family-name:--font-sans)'],
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
    ['font-(family-name:--font-sans)', 'font-family-raw']
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
    'class="text-(length:--text-body-md) font-(family-name:--font-sans)"',
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

test('container-query-on-container fires when an element queries its own container', () => {
  for (const content of [
    // The one that shipped: Trace declared its name column on the container itself.
    'class="@container/trace flex [--trace-name:9rem] @xl/trace:[--trace-name:13rem]"',
    'class="@xl/panel:grid-cols-2 @container/panel grid"',
    "cn('@container/card p-(--spacing-sm) @max-md/card:hidden', attrs.class)",
    'class="@container/bar @min-[47rem]/bar:flex"'
  ]) {
    assert.ok(
      ids(content).includes('container-query-on-container'),
      `expected container-query-on-container for: ${content}`
    )
  }
})

test('container-query-on-container stays silent when the query sits on a child', () => {
  for (const content of [
    '<div class="@container/trace flex"><div class="[--trace-name:9rem] @xl/trace:[--trace-name:13rem]"></div></div>',
    // Unnamed container queries a parent; a different named container is fine.
    'class="@container @xl:flex"',
    'class="@container/inner @xl/outer:flex"',
    'class="@container/trace-name @xl/trace:flex"'
  ]) {
    assert.ok(
      !ids(content).includes('container-query-on-container'),
      `expected container-query-on-container silent for: ${content}`
    )
  }
})

test('has-on-scroll-frame fires on a :has() variant read from the scroll frame', () => {
  for (const content of [
    // The one that shipped: the table scroll cue hid under a frozen column this way.
    'class="hidden group-data-[overflow-end]/scroll:block group-has-[[data-frozen=end]]/scroll:invisible"',
    'class="peer-has-[:checked]/scroll:hidden"',
    'class="md:group-has-focus/scroll:ring-2"'
  ]) {
    assert.ok(
      ids(content).includes('has-on-scroll-frame'),
      `expected has-on-scroll-frame for: ${content}`
    )
  }
})

test('has-on-scroll-frame stays silent on a data attribute or another group', () => {
  for (const content of [
    'class="group-data-[frozen-end]/scroll:invisible group-data-[overflow-end]/scroll:block"',
    'class="group-has-[a:focus-visible]/row:opacity-100"',
    'class="group-has-[[data-frozen=end]]/scroller-card:invisible"'
  ]) {
    assert.ok(
      !ids(content).includes('has-on-scroll-frame'),
      `expected has-on-scroll-frame silent for: ${content}`
    )
  }
})

test('universal-sibling-selector fires on a sibling variant with a universal subject', () => {
  for (const content of [
    // The one that shipped: the StreamingResponse heading pulled up the block after it.
    'class="mt-(--spacing-xs) [&+*]:-mt-(--spacing-xs)"',
    'class="[&~*]:hidden"',
    'class="md:[&_+_*]:mt-0"',
    'class="[&:not(:last-child)+*]:border-t"',
    'class="flex [&>*+*]:-ms-2 group-hover/item:[&>*+*]:-ms-1.5"'
  ]) {
    assert.ok(
      ids(content).includes('universal-sibling-selector'),
      `expected universal-sibling-selector for: ${content}`
    )
  }
})

test('universal-sibling-selector stays silent on a named sibling or a child variant', () => {
  for (const content of [
    'class="not-last:-mb-(--spacing-xs)"',
    'class="[&+p]:mt-0 [&~li]:border-t"',
    'class="*:min-w-0 [&>*]:shrink-0 [&_*]:pointer-events-none"',
    'class="[&>*:not(:first-child)]:-ms-2 [&+[data-slot=item-content]]:w-auto"',
    'class="peer-checked:block"'
  ]) {
    assert.ok(
      !ids(content).includes('universal-sibling-selector'),
      `expected universal-sibling-selector silent for: ${content}`
    )
  }
})

test('color-logo-interpolated fires on a colour logo class built at runtime', () => {
  for (const content of [
    ':class="`az-color az-${template.logo}`"',
    "const icon = 'az-color az-' + name",
    'const icon = `az-color ${name}`',
    ':class="\'az-color \' + logo"'
  ]) {
    assert.ok(
      ids(content).includes('color-logo-interpolated'),
      `expected color-logo-interpolated for: ${content}`
    )
  }
})

test('color-logo-interpolated stays silent on a whole colour logo class', () => {
  for (const content of [
    "const icon = 'az-color az-react'",
    'class="az-color az-astro"',
    ':class="template.icon"',
    'const icon = `az az-${name}`'
  ]) {
    assert.ok(
      !ids(content).includes('color-logo-interpolated'),
      `expected color-logo-interpolated silent for: ${content}`
    )
  }
})

test('rtl-double-flip fires when a directional icon also rotates under rtl', () => {
  for (const content of [
    'class="az az-arrow-right rtl:rotate-180"',
    'class="az az-chevron-left md:rtl:-rotate-180"',
    "cn('rtl:rotate-180 az az-log-out', attrs.class)",
    'class="az az-circle-arrow-left data-[open]:rtl:rotate-180"'
  ]) {
    assert.ok(ids(content).includes('rtl-double-flip'), `expected rtl-double-flip for: ${content}`)
  }
})

test('rtl-double-flip stays silent on a single flip or a non-directional glyph', () => {
  for (const content of [
    'class="az az-arrow-right rtl:-scale-x-100"',
    'class="az az-chevron-down rtl:rotate-180"',
    'class="az az-arrow-right"',
    'class="az az-arrow-right-left rtl:rotate-180"',
    'class="az az-arrow-right rtl:rotate-180x"',
    '<i class="az az-arrow-right"></i><i class="az az-chevron-down rtl:rotate-180"></i>'
  ]) {
    assert.ok(
      !ids(content).includes('rtl-double-flip'),
      `expected rtl-double-flip silent for: ${content}`
    )
  }
})

test('rtl-double-flip covers exactly DIRECTIONAL_ICONS', async () => {
  const { DIRECTIONAL_ICONS } = await import('../../src/utils/directional-icons.ts')
  for (const icon of DIRECTIONAL_ICONS) {
    assert.ok(
      ids(`class="ai ${icon} rtl:rotate-180"`).includes('rtl-double-flip'),
      `${icon} is directional but rtl-double-flip misses it`
    )
  }
  for (const icon of ['az-chevron-up', 'az-arrow-up', 'az-arrow-down', 'az-refresh', 'az-redo']) {
    assert.ok(!DIRECTIONAL_ICONS.has(icon))
    assert.ok(
      !ids(`class="ai ${icon} rtl:rotate-180"`).includes('rtl-double-flip'),
      `${icon} is not directional but rtl-double-flip fires`
    )
  }
})

test('off-brand-orange fires on an orange text token and on any orange step but the logo orange', () => {
  for (const content of [
    'class="text-(--text-primary)"',
    'class="text-(--text-brand)"',
    'color: var(--text-brand);',
    "colors: ['var(--text-primary)']",
    'color: var(--color-orange-300);',
    'class="bg-(--color-brand-primary-700)"',
    'class="text-brand-primary-300"',
    'fill: var(--color-alpha-orange-200)'
  ]) {
    assert.ok(
      ids(content).includes('off-brand-orange'),
      `expected off-brand-orange for: ${content}`
    )
  }
})

test('off-brand-orange stays silent on the logo orange and on the primary roles', () => {
  for (const content of [
    'class="border-s-2 border-(--primary) text-(--text-default)"',
    'class="bg-(--primary) text-(--primary-foreground)"',
    'class="text-primary"',
    'class="text-(--text-primary-foreground)"',
    'color: var(--color-orange-500);',
    'class="bg-(--primary-mask)"',
    'class="text-(--chart-series-4)"'
  ]) {
    assert.ok(!ids(content).includes('off-brand-orange'), `expected silence for: ${content}`)
  }
})

test('tokenChecksFor runs only the wide checks over blocks, examples and given extra dirs', () => {
  const WIDE = [
    'universal-sibling-selector',
    'rtl-double-flip',
    'off-brand-orange',
    'status-fill-as-text',
    'color-logo-interpolated'
  ]
  const idsFor = (rel, dirs) => tokenChecksFor(rel, dirs).map((c) => c.id)
  assert.ok(idsFor('packages/ui/src/components/action/button/button.vue').includes('hex-color'))
  for (const rel of [
    'packages/ui/blocks/login/login.vue',
    'packages/ui/examples/button/default.vue'
  ]) {
    assert.deepEqual(idsFor(rel), WIDE, rel)
  }
  assert.deepEqual(idsFor('site/src/nav.vue'), [])
  assert.deepEqual(idsFor('site/src/nav.vue', ['site/src/']), WIDE)
  for (const rel of [
    'packages/ui/examples/button/button.test.ts',
    'packages/ui/examples/button/examples.json',
    'packages/ui/src/composables/use-controllable.ts'
  ]) {
    assert.deepEqual(idsFor(rel), [], rel)
  }
  assert.ok(
    !scanTokens('class="text-sm az az-arrow-right"', tokenChecksFor('packages/ui/examples/a/a.vue'))
      .length
  )
})

test('tokenChecksApply scopes enforcement to component sources', () => {
  assert.ok(tokenChecksApply('packages/ui/src/components/action/button/button.vue'))
  assert.ok(tokenChecksApply('packages/ui/src/components/data/table/injection-key.ts'))
  // Tests assert browser-serialized values (a collapsed height reads back as '0px')
  // and use @ts-expect-error to exercise type surfaces — exempt on both surfaces.
  assert.ok(!tokenChecksApply('packages/ui/src/components/action/button/button.test.ts'))
  assert.ok(!tokenChecksApply('packages/ui/src/components/action/button/button.spec.ts'))
  assert.ok(!tokenChecksApply('packages/ui/src/composables/use-controllable.ts'))
})

test('status-fill-as-text fires on a status fill used as text or icon colour', () => {
  for (const content of [
    'class="az az-circle-x text-(--danger)"',
    'class="data-[type=ok]:text-(--success)"',
    'class="text-(color:--warning)"',
    "'text-(--info)'"
  ]) {
    assert.ok(
      ids(content).includes('status-fill-as-text'),
      `expected status-fill-as-text for: ${content}`
    )
  }
})

test('status-fill-as-text stays silent on the mark, foreground and text roles', () => {
  for (const content of [
    'class="text-(--danger-mark)"',
    'class="bg-(--success) text-(--success-foreground)"',
    'class="text-(--text-danger)"',
    'class="bg-(--danger) border-(--danger-border)"'
  ]) {
    assert.ok(!ids(content).includes('status-fill-as-text'), `expected silence for: ${content}`)
  }
})

test('font-family-raw catches the font-code and font-display utilities, which the theme never generates', () => {
  assert.ok(ids('class="w-full font-code"').includes('font-family-raw'))
  assert.ok(ids('class="font-display text-heading-md"').includes('font-family-raw'))
  assert.ok(!ids('font-family: var(--font-code);').includes('font-family-raw'))
  assert.ok(!ids('class="text-label-code-sm"').includes('font-family-raw'))
})
