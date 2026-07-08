# DOC_LINTS — every lint in the stack, wrong ❌ vs. correct ✅

> **@aziontech/webkit monorepo** · snapshot of July 2026
> Companion doc: [`OVERVIEW_LINT.md`](./OVERVIEW_LINT.md) explains the **architecture** (what runs, when, where).
> This doc is the **practical guide**: every lint rule configured in the stack, one by one, with the code that fails it and the code to write instead.

All examples follow the repo's own conventions (PascalCase components, `<script setup lang="ts">`, design tokens, no `<style>` blocks in webkit components). Remember the zero-warnings policy: ESLint always runs with `--max-warnings 0` — a rule either blocks or doesn't exist.

## Contents

1. [How to run](#1-how-to-run)
2. [ESLint — Vue correctness](#2-eslint--vue-correctness) · [`eslint.config.js`](../eslint.config.js)
3. [ESLint — Accessibility](#3-eslint--accessibility)
4. [ESLint — TypeScript](#4-eslint--typescript)
5. [ESLint — Import hygiene](#5-eslint--import-hygiene)
6. [ESLint — Clean code](#6-eslint--clean-code)
7. [Stylelint](#7-stylelint--cssscss) · [`.stylelintrc.json`](../.stylelintrc.json)
8. [Prettier](#8-prettier--formatting) · [`.prettierrc.json`](../.prettierrc.json)
9. [Type gates — vue-tsc + type-coverage](#9-type-gates--vue-tsc--type-coverage)
10. [commitlint](#10-commitlint--commit-messages) · [`commitlint.config.js`](../commitlint.config.js)
11. [Write-time guardrail hooks (Layer 0)](#11-write-time-guardrail-hooks-layer-0)
12. [Footnotes — configured but currently inert](#12-footnotes--configured-but-currently-inert)

---

## 1. How to run

| Command (repo root) | What it checks |
|---|---|
| `pnpm webkit:lint` / `webkit:lint:fix` | ESLint (§2–§6), zero warnings / with auto-fix |
| `pnpm webkit:lint:style` / `webkit:lint:style:fix` | Stylelint (§7) / with auto-fix |
| `pnpm webkit:format:check` / `webkit:format` | Prettier (§8) check / write |
| `pnpm webkit:type-check` | `vue-tsc --noEmit` (§9) |
| `pnpm webkit:type-coverage` | type-coverage ≥ 95% (§9) |
| `pnpm governance` | lint + type-check + format:check + audit — local mirror of CI |

On `git commit`, husky runs lint-staged (ESLint/Stylelint/Prettier with auto-fix on staged files) and commitlint (§10). Never bypass with `--no-verify` — forbidden by [`git-workflow.md`](../.claude/rules/git-workflow.md).

---

## 2. ESLint — Vue correctness

Applies to `**/*.{js,ts,vue}` via `vue-eslint-parser` + `@typescript-eslint/parser`.

### `vue/component-definition-name-casing` — PascalCase

The registered component name is PascalCase, matching the "one name, everywhere" rule ([`naming.md`](../.claude/rules/naming.md)).

**❌ Wrong**

```vue
<script setup lang="ts">
  defineOptions({ name: 'splitButton' })
  // also wrong: name: 'split-button'
</script>
```

**✅ Correct**

```vue
<script setup lang="ts">
  defineOptions({ name: 'SplitButton' })
</script>
```

### `vue/component-name-in-template-casing` — PascalCase

Component tags in templates are PascalCase. Native HTML elements stay lowercase — which is exactly why a compound root binding must be PascalCase (`Table`, never `table`; see [`compound-api.md`](../.claude/rules/compound-api.md)).

**❌ Wrong**

```vue
<template>
  <split-button label="Deploy" />
</template>
```

**✅ Correct**

```vue
<template>
  <SplitButton label="Deploy" />
</template>
```

### `vue/component-tags-order` — `script[setup]` → `template` → `style`

Every SFC reads in the same order.

**❌ Wrong**

```vue
<template>
  <button>{{ label }}</button>
</template>

<script setup lang="ts">
  defineProps<{ label: string }>()
</script>
```

**✅ Correct**

```vue
<script setup lang="ts">
  defineProps<{ label: string }>()
</script>

<template>
  <button>{{ label }}</button>
</template>
```

> webkit components never reach the third slot: `<style>` blocks are forbidden entirely by [`styling.md`](../.claude/rules/styling.md).

### `vue/multi-word-component-names` — **off, deliberately**

The design system has single-word components (`Button`, `Chip`, `Table`, `Skeleton`). This Vue default is intentionally disabled; do not "fix" single-word names.

### `vue/no-arrow-functions-in-watch`

In the options-API `watch` object, an arrow function has no `this`. (Composition-API `watch()` in `<script setup>` is unaffected — arrows are fine there.)

**❌ Wrong**

```js
export default {
  watch: {
    modelValue: (value) => {
      this.sync(value) // `this` is not the component instance here
    }
  }
}
```

**✅ Correct**

```js
export default {
  watch: {
    modelValue(value) {
      this.sync(value)
    }
  }
}
```

```ts
// or, in <script setup>:
watch(
  () => props.modelValue,
  (value) => sync(value)
)
```

### `vue/no-async-in-computed-properties`

A computed must synchronously return a value. An async computed returns a `Promise`, which the template can't render.

**❌ Wrong**

```ts
const user = computed(async () => await fetchUser(props.id))
```

**✅ Correct**

```ts
const user = ref<User | null>(null)

watchEffect(async () => {
  user.value = await fetchUser(props.id)
})
```

### `vue/no-child-content`

Child content is overwritten by `v-text` / `v-html` — it never renders.

**❌ Wrong**

```vue
<template>
  <span v-text="label">This fallback text is silently thrown away</span>
</template>
```

**✅ Correct**

```vue
<template>
  <span>{{ label }}</span>
</template>
```

### `vue/no-dupe-keys`

A prop, data, computed, or method cannot share one name — the later one silently shadows the earlier.

**❌ Wrong**

```js
export default {
  props: ['label'],
  computed: {
    label() {
      return this.label.toUpperCase() // collides with the prop
    }
  }
}
```

**✅ Correct**

```js
export default {
  props: ['label'],
  computed: {
    formattedLabel() {
      return this.label.toUpperCase()
    }
  }
}
```

### `vue/no-dupe-v-else-if`

A repeated condition in a `v-if` / `v-else-if` chain makes the later branch unreachable.

**❌ Wrong**

```vue
<template>
  <PrimaryBadge v-if="kind === 'primary'" />
  <DangerBadge v-else-if="kind === 'danger'" />
  <NeutralBadge v-else-if="kind === 'primary'" />
  <!-- never renders -->
</template>
```

**✅ Correct**

```vue
<template>
  <PrimaryBadge v-if="kind === 'primary'" />
  <DangerBadge v-else-if="kind === 'danger'" />
  <NeutralBadge v-else />
</template>
```

### `vue/no-duplicate-attributes`

The same attribute twice on one element is a bug — one silently wins. Exception (configured on): static `class` **may** coexist with `:class`, which the styling pattern relies on.

**❌ Wrong**

```vue
<template>
  <Chip
    :label="dynamicLabel"
    label="Static"
  />
</template>
```

**✅ Correct**

```vue
<template>
  <Chip :label="dynamicLabel" />

  <!-- allowed by config: static class + bound class coexist -->
  <div
    class="inline-flex items-center"
    :class="attrs['class']"
  />
</template>
```

### `vue/no-export-in-script-setup`

`<script setup>` compiles to the component's `setup()` body — runtime `export`s don't work there. **Type-only exports are allowed** (they're erased at compile time), and webkit components use them for their prop types.

**❌ Wrong**

```vue
<script setup lang="ts">
  export const FOCUS_RING = 'focus-visible:ring-2' // runtime export — error
</script>
```

**✅ Correct**

```vue
<script setup lang="ts">
  // type-only exports are fine — this is the real pattern in button.vue
  export type ButtonKind = 'primary' | 'secondary' | 'outlined' | 'text' | 'danger'
  export type ButtonSize = 'small' | 'medium' | 'large'
</script>
```

Runtime values that must be shared move to a sibling `.ts` module and are imported.

### `vue/no-empty-component-block`

An empty block is dead weight — delete it.

**❌ Wrong**

```vue
<script setup lang="ts">
  defineProps<{ label: string }>()
</script>

<template>
  <span>{{ label }}</span>
</template>

<style scoped></style>
```

**✅ Correct**

```vue
<script setup lang="ts">
  defineProps<{ label: string }>()
</script>

<template>
  <span>{{ label }}</span>
</template>
```

### `vue/no-irregular-whitespace`

Invisible characters (NBSP `U+00A0`, zero-width space) pasted from Figma/docs break parsing and grep.

**❌ Wrong**

```vue
<template>
  <!-- the space below is U+00A0 pasted from a design doc -->
  <span>Deploy now</span>
</template>
```

**✅ Correct**

```vue
<template>
  <!-- a regular space; if a no-break space is intentional, spell it out -->
  <span>Deploy&nbsp;now</span>
</template>
```

### `vue/no-mutating-props` — deep (`shallowOnly: false`)

Props are read-only **all the way down** — mutating a nested array/object is blocked too. State flows back via `v-model` / events.

**❌ Wrong**

```vue
<script setup lang="ts">
  const props = defineProps<{ modelValue: string; items: Item[] }>()

  function clear() {
    props.modelValue = '' // mutates a prop
  }

  function add(item: Item) {
    props.items.push(item) // deep mutation — also blocked
  }
</script>
```

**✅ Correct**

```vue
<script setup lang="ts">
  const props = defineProps<{ items: Item[] }>()
  const emit = defineEmits<{ 'update:items': [Item[]] }>()

  const model = defineModel<string>()

  function clear() {
    model.value = ''
  }

  function add(item: Item) {
    emit('update:items', [...props.items, item])
  }
</script>
```

### `vue/no-reserved-keys`

Keys starting with `$` or `_` belong to Vue's instance surface — redefining them shadows Vue itself.

**❌ Wrong**

```js
export default {
  data() {
    return { $refs: [] } // collides with the instance's own $refs
  }
}
```

**✅ Correct**

```js
export default {
  data() {
    return { panelRefs: [] }
  }
}
```

### `vue/no-reserved-props` — Vue 3

`key` and `ref` are consumed by Vue itself and never reach your component as props.

**❌ Wrong**

```vue
<script setup lang="ts">
  defineProps({
    key: { type: String, default: '' },
    ref: { type: Object, default: null }
  })
</script>
```

**✅ Correct**

```vue
<script setup lang="ts">
  defineProps({
    itemKey: { type: String, default: '' },
    anchorEl: { type: Object, default: null }
  })
</script>
```

### `vue/no-unused-vars`

Unused `v-for` / scope variables are dead code in the template.

**❌ Wrong**

```vue
<template>
  <li
    v-for="(item, index) in items"
    :key="item.id"
  >
    {{ item.label }}
    <!-- index is never used -->
  </li>
</template>
```

**✅ Correct**

```vue
<template>
  <li
    v-for="item in items"
    :key="item.id"
  >
    {{ item.label }}
  </li>
</template>
```

### `vue/v-if-else-key`

Same component in adjacent `v-if` / `v-else` branches gets **reused** by Vue (state leaks across branches) unless each branch has its own `key`.

**❌ Wrong**

```vue
<template>
  <FieldInput v-if="editing" />
  <FieldInput
    v-else
    disabled
  />
</template>
```

**✅ Correct**

```vue
<template>
  <FieldInput
    v-if="editing"
    key="editing"
  />
  <FieldInput
    v-else
    key="readonly"
    disabled
  />
</template>
```

### `vue/no-ref-as-operand`

A `ref` used directly in an expression operates on the ref **object**, not its value — `if (loading)` is always truthy.

**❌ Wrong**

```ts
const count = ref(0)
const loading = ref(false)

const next = count + 1 // operates on the ref object
if (loading) {
  // always true — the ref object is truthy
}
```

**✅ Correct**

```ts
const count = ref(0)
const loading = ref(false)

const next = count.value + 1
if (loading.value) {
  // actual boolean
}
```

### `vue/no-side-effects-in-computed-properties`

A computed must be pure. The classic trap: `Array.prototype.sort` mutates in place.

**❌ Wrong**

```ts
const sorted = computed(() => items.value.sort(byName)) // mutates items
```

**✅ Correct**

```ts
const sorted = computed(() => [...items.value].sort(byName))
```

### `vue/no-v-html` — security

`v-html` is an XSS injection path. Render text via interpolation; rich content comes in through slots (elements, not strings).

**❌ Wrong**

```vue
<template>
  <div v-html="description" />
</template>
```

**✅ Correct**

```vue
<template>
  <p>{{ description }}</p>

  <!-- rich content: compose elements through a slot instead of an HTML string -->
  <slot name="description" />
</template>
```

### `vue/require-default-prop`

Every optional prop declares its default — the spec's Props table made executable.

**❌ Wrong**

```vue
<script setup lang="ts">
  interface Props {
    kind?: ButtonKind
    disabled?: boolean
  }

  const props = defineProps<Props>() // no defaults declared
</script>
```

**✅ Correct**

```vue
<script setup lang="ts">
  interface Props {
    /** Visual variant. */
    kind?: ButtonKind
    /** Disables interaction. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'primary',
    disabled: false
  })
</script>
```

### `vue/require-explicit-emits`

Every emitted event is declared — the emit surface is always visible in the component's contract (and must match the spec's Events table).

**❌ Wrong**

```vue
<script setup lang="ts">
  const emit = defineEmits<{ click: [MouseEvent] }>()

  function close() {
    emit('close') // never declared
  }
</script>
```

**✅ Correct**

```vue
<script setup lang="ts">
  const emit = defineEmits<{
    click: [MouseEvent]
    close: []
  }>()

  function close() {
    emit('close')
  }
</script>
```

### `vue/template-curly-spacing`

One space inside interpolation braces.

**❌ Wrong**

```vue
<template>
  <span>{{label}}</span>
</template>
```

**✅ Correct**

```vue
<template>
  <span>{{ label }}</span>
</template>
```

---

## 3. ESLint — Accessibility

Static WCAG checks on templates (`eslint-plugin-vuejs-accessibility`). The runtime counterpart is axe-core in every component's browser-mode test — two passes over the same concern.

### `vuejs-accessibility/alt-text`

Every `<img>` carries alternative text; decorative images say so explicitly.

**❌ Wrong**

```vue
<template>
  <img :src="logoUrl" />
</template>
```

**✅ Correct**

```vue
<template>
  <img
    :src="logoUrl"
    alt="Azion logo"
  />

  <!-- decorative image: empty alt tells screen readers to skip it -->
  <img
    :src="dividerUrl"
    alt=""
  />
</template>
```

### `vuejs-accessibility/aria-props`

Only real ARIA attributes — typos produce attributes assistive tech silently ignores.

**❌ Wrong**

```vue
<template>
  <button aria-lable="Close">×</button>
</template>
```

**✅ Correct**

```vue
<template>
  <button aria-label="Close">×</button>
</template>
```

### `vuejs-accessibility/aria-role`

`role` must be a valid, non-abstract ARIA role.

**❌ Wrong**

```vue
<template>
  <div
    role="btn"
    @click="submit()"
  />
</template>
```

**✅ Correct**

```vue
<template>
  <!-- best: the native element, no role needed -->
  <button
    type="button"
    @click="submit()"
  />
</template>
```

### `vuejs-accessibility/click-events-have-key-events`

Anything clickable must be keyboard-operable.

**❌ Wrong**

```vue
<template>
  <div @click="toggle()">Expand</div>
</template>
```

**✅ Correct**

```vue
<template>
  <!-- preferred: a native button is keyboard-operable for free -->
  <button
    type="button"
    @click="toggle()"
  >
    Expand
  </button>

  <!-- only when a native element is truly impossible -->
  <div
    role="button"
    tabindex="0"
    @click="toggle()"
    @keydown.enter="toggle()"
    @keydown.space.prevent="toggle()"
  >
    Expand
  </div>
</template>
```

---

## 4. ESLint — TypeScript

### `@typescript-eslint/no-unused-vars` (`argsIgnorePattern: '^_'`)

Dead imports, variables, and parameters are errors. An **intentionally** unused argument is spelled with a leading underscore. (Core `no-unused-vars` is off in favor of this TS-aware version.)

**❌ Wrong**

```ts
import { computed, ref } from 'vue' // computed never used

function onSelect(event: MouseEvent, item: Item) {
  select(item) // event unused → error
}
```

**✅ Correct**

```ts
import { ref } from 'vue'

function onSelect(_event: MouseEvent, item: Item) {
  select(item)
}
```

### `@typescript-eslint/no-explicit-any`

`any` turns the type checker off for everything it touches. Use a real type, a generic, or `unknown` + narrowing. (`any` is also blocked at write time by `validate-tokens.mjs`, and implicit `any` is caught by the 95% type-coverage gate — §9.)

**❌ Wrong**

```ts
function normalize(value: any) {
  return value.trim()
}
```

**✅ Correct**

```ts
function normalize(value: unknown): string {
  return typeof value === 'string' ? value.trim() : ''
}

// or, when the shape is known, model it:
interface Option {
  label: string
  value: string
}
function labelOf(option: Option) {
  return option.label
}
```

---

## 5. ESLint — Import hygiene

### `simple-import-sort/imports`

Deterministic, auto-fixable order: packages first (alphabetical — `@`-scoped before plain names), then relative imports, groups separated by a blank line. Kills "import shuffle" diff noise. `pnpm webkit:lint:fix` sorts for you.

**❌ Wrong**

```ts
import Spinner from '../../utils/spinner/spinner.vue'
import { computed, useAttrs } from 'vue'
import { cn } from '../../utils/cn'
import { useElementVisibility } from '@vueuse/core'
```

**✅ Correct**

```ts
import { useElementVisibility } from '@vueuse/core'
import { computed, useAttrs } from 'vue'

import { cn } from '../../utils/cn'
import Spinner from '../../utils/spinner/spinner.vue'
```

### `simple-import-sort/exports`

Same determinism for `export` statements.

**❌ Wrong**

```ts
export { toSfc } from './story-source'
export { formatArgs } from './format-args'
```

**✅ Correct**

```ts
export { formatArgs } from './format-args'
export { toSfc } from './story-source'
```

### `import/first`

All imports before any other statement.

**❌ Wrong**

```ts
const DEFAULT_SIZE = 'large'
import { computed } from 'vue'
```

**✅ Correct**

```ts
import { computed } from 'vue'

const DEFAULT_SIZE = 'large'
```

### `import/newline-after-import`

One blank line between the import block and the first statement.

**❌ Wrong**

```ts
import { computed } from 'vue'
const DEFAULT_SIZE = 'large'
```

**✅ Correct**

```ts
import { computed } from 'vue'

const DEFAULT_SIZE = 'large'
```

### `import/no-duplicates`

One import statement per module.

**❌ Wrong**

```ts
import { computed } from 'vue'
import { useAttrs } from 'vue'
```

**✅ Correct**

```ts
import { computed, useAttrs } from 'vue'
```

---

## 6. ESLint — Clean code

### `no-console` (`allow: ['warn', 'error']`)

No stray `console.log` ships in library code. `console.warn` / `console.error` are allowed for genuine diagnostics.

**❌ Wrong**

```ts
function onSubmit(payload: FormPayload) {
  console.log('payload', payload) // leftover debugging
  submit(payload)
}
```

**✅ Correct**

```ts
function onSubmit(payload: FormPayload) {
  submit(payload)
}

function onError(err: unknown) {
  console.error('[webkit] form submission failed', err) // deliberate diagnostic — allowed
}
```

### `no-debugger`

**❌ Wrong**

```ts
function paginate(page: number) {
  debugger // never ships
  return slice(page)
}
```

**✅ Correct**

```ts
function paginate(page: number) {
  return slice(page)
}
```

### `prefer-const`

A binding that is never reassigned is `const` — immutability by default.

**❌ Wrong**

```ts
let testId = attrs['data-testid'] ?? 'actions-button' // never reassigned
```

**✅ Correct**

```ts
const testId = attrs['data-testid'] ?? 'actions-button'
```

---

## 7. Stylelint — CSS/SCSS

Scans `packages/webkit/**/*.{css,scss,vue}`. Context: [`styling.md`](../.claude/rules/styling.md) forbids `<style>` blocks and component-local CSS in webkit components — Stylelint is the **backstop** for the few legitimate stylesheets (theme CSS, `styles/country-flags.css`, legacy components).

### `selector-class-pattern` — kebab-case

Pattern: `^[a-z][a-z0-9]*(-[a-z0-9]+)*$` — class names match component naming.

**❌ Wrong**

```css
.CountryFlag {
  background-position: 0 0;
}
.country_flag {
  background-position: 0 0;
}
.countryFlag {
  background-position: 0 0;
}
```

**✅ Correct**

```css
.country-flag {
  background-position: 0 0;
}
```

### `selector-max-id: 0`

No `#id` selectors — specificity stays flat and overridable.

**❌ Wrong**

```css
#toolbar {
  display: flex;
}
```

**✅ Correct**

```css
.toolbar {
  display: flex;
}
```

### `declaration-block-no-duplicate-properties`

A duplicated property in one block means one of the two values is dead.

**❌ Wrong**

```css
.chip {
  margin: 0;
  padding: var(--spacing-1);
  margin: var(--spacing-2); /* silently wins over the first margin */
}
```

**✅ Correct**

```css
.chip {
  margin: var(--spacing-2);
  padding: var(--spacing-1);
}
```

### `no-duplicate-selectors`

The same selector twice in one sheet is a merge waiting to happen.

**❌ Wrong**

```css
.country-flag {
  background-repeat: no-repeat;
}

.country-flag {
  background-size: contain;
}
```

**✅ Correct**

```css
.country-flag {
  background-repeat: no-repeat;
  background-size: contain;
}
```

### `order/properties-alphabetical-order`

Properties always alphabetical — declaration diffs stay minimal. Auto-fixable (`pnpm webkit:lint:style:fix`).

**❌ Wrong**

```css
.panel {
  display: flex;
  border: 1px solid var(--border-default);
  color: var(--text-primary);
  align-items: center;
}
```

**✅ Correct**

```css
.panel {
  align-items: center;
  border: 1px solid var(--border-default);
  color: var(--text-primary);
  display: flex;
}
```

### `property-no-vendor-prefix` / `value-no-vendor-prefix` — warning

Prefixes belong to autoprefixer (already in the build), not hand-written CSS.

**❌ Wrong**

```css
.panel {
  -webkit-transform: scale(1.02);
  display: -webkit-flex;
}
```

**✅ Correct**

```css
.panel {
  display: flex;
  transform: scale(1.02);
}
```

### `no-descending-specificity` — warning

A less specific selector after a more specific one for the same element makes source order lie about what wins.

**❌ Wrong**

```css
.menu .item {
  color: var(--text-primary);
}

.item {
  color: var(--text-secondary);
}
```

**✅ Correct**

```css
.item {
  color: var(--text-secondary);
}

.menu .item {
  color: var(--text-primary);
}
```

### `at-rule-no-unknown` — disabled on purpose

Tailwind's at-rules are valid input here; do not "fix" them away.

```css
/* ✅ allowed — this is why the rule is off */
@tailwind base;
@tailwind components;

.legacy-badge {
  @apply inline-flex items-center;
}
```

---

## 8. Prettier — formatting

Formatting is Prettier's job alone — never hand-fight it; run `pnpm webkit:format`. The options and what they produce:

| Option | Value |
|---|---|
| `semi` | `false` — no semicolons |
| `singleQuote` | `true` |
| `tabWidth` | `2` |
| `printWidth` | `100` |
| `trailingComma` | `"none"` |
| `singleAttributePerLine` | `true` |
| `vueIndentScriptAndStyle` | `true` |

**❌ Wrong (script)**

```ts
import { computed } from "vue";

const SIZES = [
  "small",
  "medium",
  "large",
];

const label = computed(() => {
  return props.label ?? "Deploy";
});
```

**✅ Correct (what Prettier writes)**

```ts
import { computed } from 'vue'

const SIZES = ['small', 'medium', 'large']

const label = computed(() => {
  return props.label ?? 'Deploy'
})
```

**❌ Wrong (template)** — multiple attributes on one line:

```vue
<template>
  <Button label="Deploy" kind="primary" size="large" :loading="loading" />
</template>
```

**✅ Correct** — `singleAttributePerLine` puts each attribute on its own line (long `data-[…]` class stacks stay readable and diff line-by-line):

```vue
<template>
  <Button
    label="Deploy"
    kind="primary"
    size="large"
    :loading="loading"
  />
</template>
```

**`vueIndentScriptAndStyle`** — content inside `<script setup>` is indented one level:

```vue
<script setup lang="ts">
  import { computed } from 'vue'

  const props = defineProps<{ label: string }>()
</script>
```

---

## 9. Type gates — vue-tsc + type-coverage

Two gates: `vue-tsc --noEmit` (full program check over `.ts` **and** `.vue`, [`tsconfig.base.json`](../tsconfig.base.json)) and `type-coverage --at-least 95` (implicit-`any` hunter).

### `strict` — no implicit `any`

**❌ Wrong**

```ts
function pageCount(total, pageSize) {
  // both params are implicit any
  return Math.ceil(total / pageSize)
}
```

**✅ Correct**

```ts
function pageCount(total: number, pageSize: number): number {
  return Math.ceil(total / pageSize)
}
```

### `strict` — null checks

**❌ Wrong**

```ts
const first = items.find((item) => item.selected)
return first.label // `first` is possibly undefined
```

**✅ Correct**

```ts
const first = items.find((item) => item.selected)
return first?.label ?? ''
```

### `noUnusedLocals` / `noUnusedParameters`

Dead code is a **type error**, not just a lint error. Same underscore convention as ESLint: `_event` marks an intentionally unused parameter.

**❌ Wrong**

```ts
const attrs = useAttrs() // never read → type error
```

**✅ Correct** — remove it, or actually use it.

### `noImplicitReturns`

Every code path returns explicitly.

**❌ Wrong**

```ts
function confirmLabel(kind: ButtonKind) {
  if (kind === 'danger') {
    return 'Delete'
  }
  // falls off the end returning undefined implicitly
}
```

**✅ Correct**

```ts
function confirmLabel(kind: ButtonKind): string {
  if (kind === 'danger') {
    return 'Delete'
  }
  return 'Confirm'
}
```

### `noImplicitOverride`

Overriding a base-class member requires the `override` keyword — renames in the base class can't silently orphan subclasses.

```ts
class FancyEmitter extends BaseEmitter {
  override emit(name: string) {
    /* ... */
  }
}
```

### `noPropertyAccessFromIndexSignature` (webkit package)

Index-signature types (`Record<string, unknown>` — e.g. `useAttrs()`) must be accessed with brackets, making the "this key may not exist" explicit.

**❌ Wrong**

```ts
const attrs = useAttrs()
const testId = attrs.class // dot access on an index signature
```

**✅ Correct** — the real pattern in `button.vue`:

```ts
const attrs = useAttrs()
const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'actions-button')
const consumerClass = attrs['class']
```

### `type-coverage` ≥ 95%

Counts expressions with a real (non-`any`) type. This closes the gap `no-explicit-any` can't see: **implicit** `any` leaking through inference.

**❌ Wrong**

```ts
const config = JSON.parse(raw) // config: any
config.theme.colors.primary // every expression in this chain counts as any
```

**✅ Correct**

```ts
interface ThemeConfig {
  theme: { colors: { primary: string } }
}

const config = JSON.parse(raw) as ThemeConfig
config.theme.colors.primary // fully typed
```

Run `pnpm webkit:type-coverage` — `--detail` lists every offending expression.

---

## 10. commitlint — commit messages

Commits **drive releases**: `semantic-release` parses the same header to compute version bumps ([`release-types.md`](../.claude/rules/release-types.md)). Header anatomy:

```
[ENG-1231] feat(webkit)!: add table export
└───┬────┘ └─┬┘└──┬───┘│  └──────┬───────┘
  ticket   type  scope breaking subject
 (optional)      (opt.) (opt.)
```

**❌ Wrong**

```text
Update button styles                      → no type
Feat(webkit): add table export            → type must be lower-case
feature(webkit): add table export         → "feature" is not in the enum; use feat
feat(Webkit): add table export            → scope must be lower-case
fix(webkit):                              → subject is required
ENG-1231 fix(webkit): focus ring          → ticket must be bracketed: [ENG-1231]
fix(webkit): correct the paginator focus ring so that it stays visible in dark mode and in high-contrast themes
                                          → header over 100 chars (111)
```

**✅ Correct**

```text
fix(webkit): correct paginator focus ring
[ENG-1231] feat(webkit): add table export
[NO-ISSUE] chore: bump tooling
docs: describe compound API exports
feat(webkit)!: drop tone prop
```

Breaking change via footer (equivalent to `!`):

```text
feat(webkit): rework button size scale

BREAKING CHANGE: size "xlarge" was removed; use "large".
```

**Type → release bump** (must stay identical across `commitlint.config.js`, every `packages/*/.releaserc`, `CONTRIBUTING.md`, and the `/open-pr` / `/create-branch` flows):

| Type | Bump |
|---|---|
| `feat` | **minor** |
| `fix` · `hotfix` · `chore` · `docs` · `style` · `refactor` · `perf` | **patch** |
| `test` · `ci` · `revert` | none (hygiene only) |
| any type with `!` or `BREAKING CHANGE:` footer | **major** |

Also enforced: never `Co-Authored-By` / attribution footers, never `--no-verify` ([`git-workflow.md`](../.claude/rules/git-workflow.md)).

---

## 11. Write-time guardrail hooks (Layer 0)

This repo is developed AI-assisted; `.claude/hooks/` lint the **writes themselves** — every `Write`/`Edit` is validated before (or right after) it lands, enforcing design-system invariants ESLint can't express. They flag only **newly introduced** violations (legacy components are whitelisted). Full rationale per rule lives in [`.claude/rules/`](../.claude/rules/).

### `validate-tokens.mjs` — tokens are the palette

Blocks hex/rgb/hsl colors, raw Tailwind palette, raw typography, `any`, `@ts-ignore` in `.vue`/`.css`/`.scss`/`.ts`.

```vue
<!-- ❌ blocked -->
<button class="bg-[#f3652b] text-orange-500 text-sm font-['Inter']" />

<!-- ✅ tokens + generated typography classes from DESIGN.md -->
<button class="bg-[var(--primary)] text-[var(--primary-contrast)] text-button-lg" />
```

### `validate-references.mjs` — imports must exist

Blocks phantom `@aziontech/webkit/*` paths (not in `packages/webkit/package.json#exports`), unresolvable relative imports, uninstalled packages.

```ts
// ❌ blocked — path not in the exports map
import Slot from '@aziontech/webkit/utils/slot'

// ✅ exists in packages/webkit/package.json#exports
import { cn } from '@aziontech/webkit/utils/cn'
```

### `validate-story-source.mjs` — "Show code" must be paste-and-runnable

Blocks dynamic source, `docs` as a function call, lowercase component tags, nested `<template>`, import binding ≠ export subpath. See [`storybook-source.md`](../.claude/rules/storybook-source.md).

```js
// ❌ blocked — dynamic source, lowercase tag, binding ≠ subpath
import Chip from '@aziontech/webkit/chips'
export const Default = {
  parameters: { docs: { source: { type: 'dynamic' } } }
}

// ✅ explicit runnable SFC via toSfc
import Chip from '@aziontech/webkit/chip'
import { toSfc } from '../../../_shared/story-source'

const IMPORT = "import Chip from '@aziontech/webkit/chip'"
export const Default = {
  parameters: { docs: { source: { code: toSfc(IMPORT, '<Chip label="Edge" />') } } }
}
```

### `enforce-spec-exists.mjs` + `enforce-component-create.mjs` — spec is the contract

Component code without an **approved** `.specs/<name>.md` (checksum-verified) is blocked; new components go through `/spec-create` → `/component-create`, never hand-rolled `.vue` files.

### `validate-spec-compliance.mjs` — 1-to-1 with the spec

A `.vue` whose props / events / slots / name / testid / animations diverge from its spec is flagged post-write. Adding a helpful `tone` prop the spec never mentions is exactly what this catches ([`no-invention.md`](../.claude/rules/no-invention.md)).

### `enforce-test-exists.mjs` — every root ships a test

Post-write **warning** when a root `.vue` has no co-located `<name>.test.ts` (browser-mode Vitest, never jsdom — [`testing.md`](../.claude/rules/testing.md)).

---

## 12. Footnotes — configured but currently inert

Honest edges of the config (details in [`OVERVIEW_LINT.md`](./OVERVIEW_LINT.md) §10):

- **`vue/no-restricted-syntax`** is enabled with no selectors — it restricts nothing until selectors are added.
- **`vue/no-reserved-component-names`** is commented out in `eslint.config.js`.
- **`eslint-plugin-unused-imports`** is registered but none of its rules are enabled — unused imports are caught indirectly by `@typescript-eslint/no-unused-vars` (not auto-fixed on `lint:fix`).
- **`packages/webkit` `lint` script** passes `--ext .js,.js,.vue` (`.ts` missing, `.js` doubled) — plain `.ts` files are still covered by lint-staged and CI, which pass explicit extensions.
