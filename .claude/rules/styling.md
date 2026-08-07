# Rule: styling — classes on the root, never as JS presets

Styles live on the **template root element's `class` attribute**, not in JavaScript variables, not in `<style>` blocks, not in component-local CSS files. Variants are driven by `data-*` attributes on the same root, consumed by Tailwind's `data-[attr=value]:` variants.

## The rule

> **Do not create CSS class presets** (`kindClasses` / `sizeClasses` / `sharedClasses` objects in the script). **Do not create classes inside the component** (no `<style>` block, no local CSS, no custom utility). Everything goes inline on the root's `class`, using `data-*` to switch variants.

## What this means in practice

### ❌ Forbidden — JS class presets

```vue
<!-- DO NOT DO THIS -->
<script setup lang="ts">
  const sharedClasses = ['flex', 'items-center', 'transition-colors' /* ... */]
  const kindClasses: Record<Kind, string> = {
    primary: 'bg-(--primary) text-(--primary-contrast)',
    secondary: 'bg-(--secondary) text-(--secondary-contrast)',
    outlined: 'border border-(--border-default)',
    text: 'bg-transparent'
  }
  const sizeClasses: Record<Size, string> = {
    small: 'h-7 px-(--spacing-xs) text-button-md',
    medium: 'h-8 px-(--spacing-sm) text-button-md',
    large: 'h-10 px-(--spacing-md) text-button-lg'
  }
  const rootClasses = computed(() => [
    sharedClasses,
    kindClasses[props.kind],
    sizeClasses[props.size],
    attrs.class
  ])
</script>

<template>
  <button :class="rootClasses" />
</template>
```

### ❌ Forbidden — CSS declared inside the component

```vue
<style scoped>
  .button {
    /* never */
  }
  .button--primary {
    /* never */
  }
</style>
```

```ts
// Also forbidden — no inline CSS-in-JS, no styled() helpers, no css\`\` tagged templates.
```

### ✅ Correct — utilities inline on the root, variants via `data-*`

```vue
<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'Button', inheritAttrs: false })

  type ButtonKind = 'primary' | 'secondary' | 'outlined' | 'text'
  type ButtonSize = 'small' | 'medium' | 'large'

  interface Props {
    /** Visual variant. */
    kind?: ButtonKind
    /** Size token. */
    size?: ButtonSize
    /** Disables interaction. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'primary',
    size: 'large',
    disabled: false
  })

  const attrs = useAttrs()
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'actions-button')
</script>

<template>
  <button
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :data-size="size"
    :data-disabled="disabled || null"
    :disabled="disabled"
    class="
      relative inline-flex items-center justify-center whitespace-nowrap
      transition-colors duration-150 ease-out motion-reduce:transition-none
      rounded-(--shape-button)
      focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)

      data-[kind=primary]:bg-(--primary) data-[kind=primary]:text-(--primary-contrast)
      data-[kind=secondary]:bg-(--secondary) data-[kind=secondary]:text-(--secondary-contrast)
      data-[kind=outlined]:border data-[kind=outlined]:border-(--border-default) data-[kind=outlined]:bg-transparent
      data-[kind=text]:bg-transparent

      data-[size=small]:h-7 data-[size=small]:px-(--spacing-xs) data-[size=small]:text-button-md
      data-[size=medium]:h-8 data-[size=medium]:px-(--spacing-sm) data-[size=medium]:text-button-md
      data-[size=large]:h-10 data-[size=large]:px-(--spacing-md) data-[size=large]:text-button-lg

      data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:cursor-not-allowed
    "
  >
    <slot />
  </button>
</template>
```

Key choices:

- **One `class` attribute on the root.** All utilities live there.
- **`data-*` attributes mirror props** — `data-kind`, `data-size`, `data-disabled`, `data-state`, `data-orientation`.
- **Tailwind variants do the switching.** `data-[kind=primary]:bg-(--primary)` is one utility, not a JS branch.
- **`v-bind="$attrs"`** flows consumer-passed `class` (and other attrs) onto the root; Vue merges class strings automatically. No `cn()` needed for the basic case.
- **No `computed` returning class arrays.** Computed values are reserved for derived state (e.g. `isAnchor`, `testId`), not for styles.

### When consumer classes must take precedence

Some components let the consumer override internal token choices (e.g. `<Card class="bg-(--bg-canvas)" />`). Tailwind class merging via `cn` solves this:

```vue
<script setup lang="ts">
  import { cn } from '@aziontech/webkit/utils/cn'
  const attrs = useAttrs()
</script>

<template>
  <div
    :data-testid="testId"
    :class="
      cn(
        'rounded-(--shape-card) bg-(--bg-surface) p-(--spacing-md)',
        attrs.class as string
      )
    "
  />
</template>
```

`cn` (clsx + tailwind-merge) is the **only** acceptable helper for class composition. Even then, the string passed to `cn` is a flat literal — not a JS variable holding a class preset.

### Sub-components (Composition Pattern)

The same rule applies to each sub-component. Each renders its own root with its own inline `class`. No shared `*Classes` import between siblings.

## Token values: the canonical `prop-(--token)` syntax

A design-token value on a utility is written with Tailwind v4's **paren shorthand** — `bg-(--primary)`, not `bg-[var(--primary)]`. This is the **single canonical form** (ENG-47001, decision A): it is what upstream v4 canonicalizes to, so Tailwind IntelliSense no longer flags every styled line with `suggestCanonicalClasses`, and it is what every rule, spec, story, scaffolder output and `cli-templates` copy now teaches. The two spellings compile to byte-identical CSS; we standardize on one so the codebase reads one way.

```html
<!-- ✅ canonical — paren shorthand -->
<div class="bg-(--bg-surface) text-(--text-default) rounded-(--shape-card) focus-visible:ring-(--ring-color)">

<!-- ❌ legacy bracket form — do not author -->
<div class="bg-[var(--bg-surface)] text-[var(--text-default)] rounded-[var(--shape-card)]">
```

Three shapes:

| Concern | Canonical | Notes |
| --- | --- | --- |
| **Whole-value var** | `prop-(--token)` | `bg-(--primary)`, `max-w-(--container-2xl)`, `focus-visible:ring-offset-(--bg-canvas)`. Variants compose (`data-[disabled]:bg-(--bg-disabled)`). |
| **Typed value** | `prop-(type:--token)` | `text-(length:--text-body-md)`, `border-(color:--border-default)`, `font-(family-name:--font-sora)`. |
| **Numeric arbitrary** | `z-1` | The bare-number utility, not `z-[1]`. |

**Two cases stay bracketed — the paren form emits _no CSS_ for them, silently:**

- **Custom-property declarations** — `[--table-row-bg:var(--bg-surface)]`, `data-[state=selected]:[--table-row-bg:var(--bg-selected)]`. There is no paren shorthand for _declaring_ a custom property; `(--x:--y)` compiles to nothing.
- **Expression values** — anything whose arbitrary value is more than a lone `var(--x)`: `w-[calc(var(--a)*2)]`, gradients (`bg-[linear-gradient(...var(--x)...)]`), box-shadows, and a **var with a fallback** (`bg-[var(--x,var(--y))]`, `text-[length:var(--w,1px)]`). These must remain in brackets — converting them drops the style with **no build or lint error**.

The guardrail token-checks (`typography-raw-length`, `leading-raw`, `tracking-raw`, `font-family-raw`, `animate-arbitrary`, `motion-hardcoded`) match **both** spellings, so accepting the IntelliSense suggestion cannot walk a raw value through the typography / motion / animation gates.

## A zero length carries no unit

A zero is the one value that is identical in every unit, so the unit is pure noise — and it makes the same zero read three different ways across the codebase (`0px` here, `0rem` there, `0em` in a token). **Write `0`.**

```js
// ❌ tokens, arbitrary values, inline styles — the unit says nothing
const tracking = { normal: '0em' }
node.style.height = '0px'
class="p-[0rem] translate-y-[0px]"

// ✅
const tracking = { normal: '0' }
node.style.height = '0'
class="p-0 translate-y-0"
```

The rule covers **length** units only — `px`, `rem`, `em`, `ch`, `vw`/`vh`, `cqw`, `cm`/`in`/`pt`, and the rest of the CSS length set. Units that carry meaning (or are required) at zero are untouched: `0%`, `0s` / `0ms`, `0deg`, `0fr`.

### The one place a zero keeps a unit: math functions

Inside `calc()` / `min()` / `max()` / `clamp()` a bare `0` is a **number**, not a length, so the whole expression is invalid — CSS requires the unit there. When the unit is unavoidable it is **`rem`**, the one length unit this system scales in; never `px` / `em`.

```css
/* ✅ the unit is required here, and it is rem */
width: calc(100% - 0rem);
height: max(0rem, var(--content-height));

/* ❌ same requirement, wrong unit */
width: calc(100% - 0px);
height: max(0em, var(--content-height));

/* ✅ outside a math function the zero stays bare */
margin: 0;
padding: 0 var(--spacing-md);
```

## Hard prohibitions

- No zero with a length unit — `0`, never `0px` / `0rem` / `0em` (in tokens, arbitrary Tailwind values, inline `style`, or authored CSS). The single exception is inside `calc()`/`min()`/`max()`/`clamp()`, where CSS requires a unit and that unit is **`rem`**.
- No `const sharedClasses = [...]`, `const kindClasses = {...}`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`. The whole "class map" pattern goes away.
- No `<style>` blocks (scoped or unscoped).
- No `.css` / `.scss` files inside a component directory.
- No CSS-in-JS, no `styled()`, no `css\`\`` tagged templates.
- No utility classes declared in a `tailwind.config.*` plugin specifically for one component. Component utilities live in [`@aziontech/theme`](../../packages/theme/) (`semantic/*` if reusable across components), or as inline composition on the root.
- No `:class="[a, b, c]"` arrays when a flat string + `data-*` would do.

## Vue SFC pitfall — no backticks inside `<template>` `:class`

The Vue HTML parser runs **before** JavaScript. **Do not** pass multiline template literals from the template:

```vue
<!-- ❌ Breaks Vite / Storybook: vite:vue "Element is missing end tag" (often last line, high column) -->
<button
  :class="
    cn(
      `
      data-[kind=primary]:bg-(--primary)
      `,
      attrs.class
    )
  "
/>
```

**Symptoms**

| Signal                                | Meaning                                                 |
| ------------------------------------- | ------------------------------------------------------- |
| `Plugin: vite:vue`                    | SFC compile failed (not runtime)                        |
| `Element is missing end tag`          | HTML tokenizer lost sync inside a bound attribute       |
| Line = last line of file, column ≫ 80 | Error position is end-of-template, not the real mistake |

**Fix (pick one)**

1. **Plain multiline `class` on the root** (no JS quotes) + optional `:class="attrs.class"` for consumer overrides.
2. **Single-quoted `ROOT_CLASS` in `<script setup>`** + `:class="cn(ROOT_CLASS, attrs.class)"` — one flat literal string, not a `kindClasses` / `sizeClasses` map.

`pnpm webkit:lint` and `vue-tsc` may still pass; only the SFC template compiler (Storybook dev, `storybook:build`) catches this.

## Vue SFC pitfall — no HTML-like tags in `<script>` comments

Storybook registers **two** `@vitejs/plugin-vue` instances (`@storybook/vue3-vite` + `viteFinal` in `apps/storybook/.storybook/main.js`). The second pass may call `compiler-sfc` `parse()` on **already-compiled** module code. Any substring that looks like HTML in that output breaks the parse.

```ts
// ❌ Survives compileScript and breaks the second vite:vue pass
/** When set, renders as a link (`<a>`). */

// ✅ Plain language — no angle brackets in script comments
/** When set, renders as an anchor link. */
```

**Symptoms:** same as above (`vite:vue` / `Element is missing end tag` on the `.vue` path, often line past EOF). `compiler-sfc` `parse()` on the raw `.vue` file succeeds; `parse(compiledJs)` fails.

**Debug checklist**

| Step | Command / action                                                                                                                    |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1    | Read Storybook terminal: `Plugin: vite:vue` + `Element is missing end tag`                                                          |
| 2    | Confirm raw SFC parses: `node -e "require('vue/compiler-sfc').parse(fs.readFileSync('…vue','utf8'),{filename:'…'})"` → `errors: []` |
| 3    | Grep script for `` `<…>` ``, `<template`, `</…>` in comments and JSDoc                                                              |
| 4    | Remove backtick multiline literals from `<template> :class="cn(\`…\`)"`(move class string to script`ROOT_CLASS`)                    |
| 5    | Restart `pnpm storybook:dev` after fixing (clear stale HMR descriptor if needed)                                                    |

## When you legitimately need conditional styling

Use a `data-*` attribute + a Tailwind variant. The decision lives in HTML, not in JS:

```vue
<!-- ✅ Loading state -->
<button
  :data-loading="loading || null"
  class="data-[loading]:cursor-wait data-[loading]:opacity-80"
/>

<!-- ✅ Open/closed (overlays) -->
<div
  :data-state="open ? 'open' : 'closed'"
  class="data-[state=open]:animate-popup-scale-in data-[state=closed]:animate-popup-scale-out"
/>

<!-- ❌ Don't do this -->
<button :class="loading ? 'cursor-wait opacity-80' : ''" />
```

## Enforcement

- `scaffolder` (agent) refuses to emit the `kindClasses`/`sizeClasses`/`sharedClasses`/`rootClasses` pattern. The skeleton in [`.claude/skills/component-scaffold/SKILL.md`](../skills/component-scaffold/SKILL.md) uses inline classes + `data-*` variants.
- `validate-tokens.mjs` (PreToolUse hook) already blocks HEX/palette/raw typography regardless of where they appear.
- **Zero-unit** is gated on four surfaces, so no authoring path escapes it: the `zero-with-unit` check in the shared token-checks engine (write-time hook **and** the `check-authoring` CI ratchet, over component sources); `length-zero-no-unit` in [`.stylelintrc.json`](../../.stylelintrc.json) for authored CSS/SCSS/Vue `<style>` — set to plain `true` so the preset's `ignore: ['custom-properties']` does **not** apply, since a design system is authored almost entirely as custom properties; the same rule in the shipped [`stylelint-config.js`](../../packages/webkit/src/stylelint-config.js) so consumers inherit it; and a build-time assertion in the theme's `build:tokens`, which is the only gate that sees token values (they are authored in JS and compiled, so no linter reads them). A `length-zero-no-unit` canary fixture keeps the stylelint side from being relaxed.
- **The `rem`-in-math-function carve-out** is gated by the two engines we own — the `zero-unit-in-calc` token check and the same assertion in `build:tokens`. Stylelint's `length-zero-no-unit` deliberately skips math functions (a unit is required there), so it accepts `calc(100% - 0px)`; the token check is what makes that `0rem`.
- A future PostToolUse hook may grep `.vue` files for `const \w+Classes\s*=\s*[\{[]` and emit `BLOCKED: forbidden class preset` — until then, `echo-reporter` flags the pattern.
- `.claude/docs/COMPONENT_REQUIREMENTS.md` § 13.y "Styling discipline" supersedes any older example in the same file that still shows the JS-presets pattern. **The data-attribute approach is the canonical pattern for new components.**

## Why this rule exists

The old `kindClasses` Record pattern looks clean but rots over time:

- Every new variant adds a JS branch AND a Tailwind class — duplicated edits.
- Tailwind's `data-[attr=value]` variant compiles to the same CSS but reads in one place.
- Designers can scan a `.vue` and see all states without crossing the script/template boundary.
- Code Connect can map Figma variants to `data-*` attributes more naturally than to JS dictionaries.
- Removes the need for `computed` arrays whose only purpose is class composition.

Legacy components (in `.claude/hooks/_lib/legacy-components.json`) still use the old pattern — that's fine, they're whitelisted. **Every new component starts with the new pattern.**
