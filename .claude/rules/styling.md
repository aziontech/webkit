# Rule: styling — classes on the root, never as JS presets

Styles live on the **template root element's `class` attribute**, not in JavaScript variables, not in `<style>` blocks, not in component-local CSS files. Variants are driven by `data-*` attributes on the same root, consumed by Tailwind's `data-[attr=value]:` variants.

## The rule

> **Não crie presets de classe CSS** (objetos `kindClasses` / `sizeClasses` / `sharedClasses` no script). **Não crie classes dentro do componente** (sem `<style>` block, sem CSS local, sem utility custom). Tudo vai inline no `class` do root, usando `data-*` para alternar variantes.

## What this means in practice

### ❌ Forbidden — JS class presets

```vue
<!-- DO NOT DO THIS -->
<script setup lang="ts">
  const sharedClasses = ['flex', 'items-center', 'transition-colors' /* ... */]
  const kindClasses: Record<Kind, string> = {
    primary: 'bg-[var(--primary)] text-[var(--primary-contrast)]',
    secondary: 'bg-[var(--secondary)] text-[var(--secondary-contrast)]',
    outlined: 'border border-[var(--border-default)]',
    text: 'bg-transparent'
  }
  const sizeClasses: Record<Size, string> = {
    small: 'h-7 px-[var(--spacing-2)] text-button-md',
    medium: 'h-8 px-[var(--spacing-3)] text-button-md',
    large: 'h-10 px-[var(--spacing-4)] text-button-lg'
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
      rounded-[var(--shape-button)]
      focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]

      data-[kind=primary]:bg-[var(--primary)] data-[kind=primary]:text-[var(--primary-contrast)]
      data-[kind=secondary]:bg-[var(--secondary)] data-[kind=secondary]:text-[var(--secondary-contrast)]
      data-[kind=outlined]:border data-[kind=outlined]:border-[var(--border-default)] data-[kind=outlined]:bg-transparent
      data-[kind=text]:bg-transparent

      data-[size=small]:h-7 data-[size=small]:px-[var(--spacing-2)] data-[size=small]:text-button-md
      data-[size=medium]:h-8 data-[size=medium]:px-[var(--spacing-3)] data-[size=medium]:text-button-md
      data-[size=large]:h-10 data-[size=large]:px-[var(--spacing-4)] data-[size=large]:text-button-lg

      data-[disabled]:bg-[var(--bg-disabled)] data-[disabled]:text-[var(--text-disabled)] data-[disabled]:cursor-not-allowed
    "
  >
    <slot />
  </button>
</template>
```

Key choices:

- **One `class` attribute on the root.** All utilities live there.
- **`data-*` attributes mirror props** — `data-kind`, `data-size`, `data-disabled`, `data-state`, `data-orientation`.
- **Tailwind variants do the switching.** `data-[kind=primary]:bg-[var(--primary)]` is one utility, not a JS branch.
- **`v-bind="$attrs"`** flows consumer-passed `class` (and other attrs) onto the root; Vue merges class strings automatically. No `cn()` needed for the basic case.
- **No `computed` returning class arrays.** Computed values are reserved for derived state (e.g. `isAnchor`, `testId`), not for styles.

### When consumer classes must take precedence

Some components let the consumer override internal token choices (e.g. `<Card class="bg-[var(--bg-canvas)]" />`). Tailwind class merging via `cn` solves this:

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
        'rounded-[var(--shape-card)] bg-[var(--bg-surface)] p-[var(--spacing-4)]',
        attrs.class as string
      )
    "
  />
</template>
```

`cn` (clsx + tailwind-merge) is the **only** acceptable helper for class composition. Even then, the string passed to `cn` is a flat literal — not a JS variable holding a class preset.

### Sub-components (Composition Pattern)

The same rule applies to each sub-component. Each renders its own root with its own inline `class`. No shared `*Classes` import between siblings.

## Hard prohibitions

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
      data-[kind=primary]:bg-[var(--primary)]
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
