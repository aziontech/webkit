---
name: component-scaffold
description: Write the `.vue` file(s) and the local `package.json` for a component, plus the entry in `packages/webkit/package.json#exports`. Strictly spec-bound — every prop/event/slot must come from the spec.
status: active
last_updated: 2026-05-22
---

# Skill: component-scaffold

## Purpose

Convert an approved `.specs/<name>.md` into:

- `packages/webkit/src/components/webkit/<category>/<name>/<name>.vue` (TypeScript, JSDoc on every public prop).
- (Composition only) Sibling sub-component `.vue` files in the same directory.
- (Composition only) `packages/webkit/src/components/webkit/<category>/<name>/injection-key.ts`.
- `packages/webkit/src/components/webkit/<category>/<name>/package.json`.
- New entry/entries in `packages/webkit/package.json#exports`.

Nothing else. The story, the Code Connect file, and the validation pass live in other skills.

## When to invoke

- Step 4 of `/component-create`, after `spec-validator` passed and reconciliation succeeded.

## Inputs

- The full text of `.specs/<name>.md` (verbatim).
- The Constraints block (verbatim).
- [`.claude/rules/no-invention.md`](../../rules/no-invention.md), [`.claude/docs/COMPONENT_REQUIREMENTS.md`](../../docs/COMPONENT_REQUIREMENTS.md), [`.claude/docs/COMPONENT_REQUIREMENTS.md`](../../docs/COMPONENT_REQUIREMENTS.md), [`.claude/docs/DESIGN.md`](../../docs/DESIGN.md).
- The canonical files for cross-reference (read-only):
  - `packages/webkit/src/components/webkit/actions/button/button.vue`
  - `packages/webkit/src/components/webkit/actions/icon-button/icon-button.vue`
  - `packages/webkit/src/components/webkit/content/card-pricing/card-pricing.vue`

## Workflow

1. **Read the spec.** Extract Props / Events / Slots / Sub-components / States / Tokens / Accessibility tables.
2. **Write the root `.vue`.** Follow this skeleton verbatim and substitute spec values. Classes live inline on the root `class` attribute; variants are switched via `data-*` attributes consumed by Tailwind's `data-[attr=value]:` prefix. **No `kindClasses` / `sizeClasses` / `sharedClasses` JS presets, no `<style>` block, no `.css` file inside the component.** Full rationale: [styling.md](../../rules/styling.md).

   ```vue
   <script setup lang="ts">
     import { computed, useAttrs } from 'vue'

     defineOptions({ name: 'PascalName', inheritAttrs: false })

     // Variant types — exported for VariantProps
     export type PascalNameKind = 'primary' | 'secondary'
     export type PascalNameSize = 'small' | 'medium' | 'large'

     interface Props {
       /** From spec */
       kind?: PascalNameKind
       /** From spec */
       size?: PascalNameSize
       /** From spec */
       disabled?: boolean
     }

     const props = withDefaults(defineProps<Props>(), {
       kind: 'primary',
       size: 'large',
       disabled: false
     })

     const emit = defineEmits<{
       click: [event: MouseEvent]
     }>()

     defineSlots<{
       default(): unknown
     }>()

     const attrs = useAttrs()
     const testId = computed<string>(
       () => (attrs['data-testid'] as string | undefined) ?? 'category-name'
     )
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

   When the consumer must be able to override internal token choices, wrap the static class string with `cn` from `@aziontech/webkit/utils/cn`:

   ```vue
   <template>
     <div
       :data-testid="testId"
       :class="
         cn('rounded-[var(--shape-card)] bg-[var(--bg-surface)] p-[var(--spacing-4)]', attrs.class)
       "
     />
   </template>
   ```

   Never write a `<style>` block. Never declare a `.css`/`.scss` file inside the component directory. Never declare any JavaScript variable that holds a class string (`const kindClasses = {...}`, `const sharedClasses = [...]`, etc.). Variants are HTML data-attributes, not JS dictionaries.

   **Never use backtick template literals inside `<template> :class="cn(\`...\`)"`** — the Vue HTML parser throws `Element is missing end tag` and Storybook/Vite fail to load the story. Put the flat class string in `<script setup>` as `const ROOT_CLASS = '...'` and bind `:class="cn(ROOT_CLASS, attrs.class)"`, or use a plain multiline `class="..."` on the root. See [`.claude/rules/styling.md`](../../rules/styling.md) § "Vue SFC pitfall".

   **Never put HTML-like tags in script JSDoc** (e.g. `` `<a>` ``, `<template>`) — Storybook runs two `@vitejs/plugin-vue` passes; the second re-parses compiled JS and fails with the same error. Use plain language ("anchor link") instead.

3. **(Composition only) Write each sub-component.** Each sub-component:
   - `defineOptions({ name: '<PascalRoot><PascalPart>', inheritAttrs: false })`.
   - `inject(<PascalRoot>InjectionKey)` to read shared state.
   - Local `testId` derived from `ctx.testId` per [`bem-testid.md`](../../docs/COMPONENT_REQUIREMENTS.md).
4. **(Composition only) Write `injection-key.ts`:**

   ```ts
   import type { InjectionKey, Ref } from 'vue'

   export interface <PascalName>Context {
     testId: string
     close: () => void
     isOpen: Readonly<Ref<boolean>>
   }

   export const <PascalName>InjectionKey: InjectionKey<<PascalName>Context> = Symbol('<PascalName>Context')
   ```

5. **Write `package.json`:**

   ```json
   {
     "name": "@aziontech/webkit-<category>-<name>",
     "main": "./<name>.vue",
     "module": "./<name>.vue",
     "types": "./<name>.vue.d.ts",
     "browser": { "./sfc": "./<name>.vue" },
     "sideEffects": ["*.vue"]
   }
   ```

6. **Update `packages/webkit/package.json#exports`** — add one entry per public component (root + each public sub-component) preserving alphabetical order inside the category:

   ```json
   "./<category>/<name>": "./src/components/webkit/<category>/<name>/<name>.vue",
   "./<category>/<name>-trigger": "./src/components/webkit/<category>/<name>/<name>-trigger.vue"
   ```

7. **Stop.** Do not write the story file. Do not write the `.figma.ts`. Do not run any pnpm command.

## Outputs

- The files listed above. No prose, no commentary, no edits to other paths.

## Rules

- Every prop, event, slot, and sub-component MUST come from the spec — no inventions. (`validate-spec-compliance.mjs` enforces this on Write; it will reject the run if you stray.)
- Use the canonicals (`button.vue`, `card-pricing.vue`) as the **shape** reference — but substitute spec content, never copy spec content from a canonical.
- All visual tokens come from [`.claude/docs/DESIGN.md`](../../docs/DESIGN.md). No HEX, no Tailwind palette, no raw typography.
- TypeScript only (`<script setup lang="ts">`); no `any`; no `@ts-ignore`; no `class` in `defineProps`.
- `<script setup>` always before `<template>`.
- BEM `data-testid` per [`.claude/docs/COMPONENT_REQUIREMENTS.md`](../../docs/COMPONENT_REQUIREMENTS.md).
- Naming per [`.claude/docs/COMPONENT_REQUIREMENTS.md`](../../docs/COMPONENT_REQUIREMENTS.md).
- Accessibility per [`.claude/docs/COMPONENT_REQUIREMENTS.md`](../../docs/COMPONENT_REQUIREMENTS.md) (focus-visible ring, ARIA, keyboard map).

## Animations — apply the spec's Motion & Animations table verbatim

- Every animation class **must** come from `packages/theme/src/tokens/semantic/animations.js` (`animate-fade-in`, `animate-fade-out`, `animate-slide-down`, `animate-popup-scale-in`, `animate-popup-scale-out`, `animate-blink`, `animate-highlight-fade`) — see [`.claude/docs/DESIGN.md`](../../docs/DESIGN.md#animations--semanticanimationsjs).
- Every motion-bearing class pairs with the reduced-motion escape in the same class string:
  ```
  transition-colors duration-150 ease-out motion-reduce:transition-none
  animate-popup-scale-in motion-reduce:animate-none
  ```
- `<style>` blocks are forbidden; **never** declare component-local `@keyframes`.
- For data-state-driven animations, use Tailwind variants on the same element:
  ```html
  data-[state=open]:animate-popup-scale-in data-[state=closed]:animate-popup-scale-out
  motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none
  ```
- Loading indicators reuse `@aziontech/webkit/utils/spinner` when present (see the reuse-audit output) and carry `aria-hidden="true"` + `motion-reduce:animate-none`.
- Set `--popup-origin` per instance when using `animate-popup-scale-*`, anchored to the trigger:
  ```html
  :style="{ '--popup-origin': originFromTrigger }"
  ```
- If the spec's Motion & Animations section is `_none_`, the `.vue` must contain **zero** `animate-*` or `transition-*` classes; `validate-spec-compliance.mjs` enforces this.

## Fallbacks

- Spec lists a token not in DESIGN.md → stop with `BLOCKED: token <name> not in DESIGN.md`. Do not write a fallback HEX.
- Spec references an import that doesn't exist → stop with `BLOCKED: phantom import <path>`. The `validate-references.mjs` hook would block anyway.
- Sub-component listed in spec but ambiguous purpose → stop with `BLOCKED: sub-component <name> purpose unclear`.

## Definition of Done

- [ ] Root `.vue` written with every spec prop/event/slot, no extras.
- [ ] Composition: every sub-component `.vue` written + `injection-key.ts`.
- [ ] Local `package.json` written.
- [ ] New entries added to `packages/webkit/package.json#exports`.
- [ ] No HEX / Tailwind palette / raw typography / `any` / `@ts-ignore`.
- [ ] `defineOptions.name` is PascalCase and matches the directory.
- [ ] `data-testid` fallback equals `'<category>-<name>'` on the root.
- [ ] No story file written, no `.figma.ts` written, no pnpm command run.
