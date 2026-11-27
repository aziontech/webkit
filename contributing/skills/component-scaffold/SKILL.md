---
name: component-scaffold
description: Write the `.vue` file(s) for a component, plus the entry in `packages/ui/package.json#exports`. Strictly spec-bound — every prop/event/slot must come from the spec. For composition pattern, each sub-component lives in its own folder.
status: active
last_updated: 2026-11-23
scope: ui
enforced_by: [no-invention, compound-api, styling, testing]
---

# Skill: component-scaffold

## Purpose

Convert an approved `.specs/<name>.md` into:

- `packages/ui/src/components/<category>/<name>/<name>.vue` (TypeScript, JSDoc on every public prop).
- (Composition only) **One folder per sub-component** under the root component directory — `<name>/<name>-<part>/<name>-<part>.vue`. The full file name is preserved (`dialog-trigger.vue`, not `index.vue`) so error traces and editor breadcrumbs are unambiguous.
- (Composition only) `packages/ui/src/components/<category>/<name>/injection-key.ts` at the root level (shared by every sub-component).
- (Composition only) `packages/ui/src/components/<category>/<name>/index.ts` — the **compound API** that attaches every sub-component to the root (`<Root.Part>`) via `Object.assign`; because it is a `.ts` file, `vue-tsc` generates the adjacent `index.d.ts` (do not hand-write it — `.d.ts` is gitignored). See [`contributing/rules/compound-api.md`](../../rules/compound-api.md).
- New entry/entries in `packages/ui/package.json#exports` — one per public component (root + each public sub-component). The public path keeps the short, flat form (`./dialog-trigger`) regardless of the folder nesting. For composition, the **root** export points at `index.ts` (the compound), **plus** a standalone `./<name>-root` export pointing at the root `.vue` for tree-shaking — see [`contributing/rules/compound-api.md`](../../rules/compound-api.md) and [`contributing/rules/imports.md`](../../rules/imports.md).
- The starter `<name>.test.ts` next to the root `.vue` (step 6): `enforce-test-exists.mjs` blocks a root `.vue` without one.

Nothing else. The full test, the examples, the `.size-limit.json` entry, the locale keys, the Code Connect file, and the validation pass are later steps of `/component-create` and `/component-new`.

**Folder layout — composition pattern (canonical, one folder per part):**

```
packages/ui/src/components/<category>/<name>/
├── <name>.vue                          # root
├── <name>.test.ts                      # the root's test (testing.md)
├── index.ts                            # compound (Object.assign → <Name>.Trigger, ...); vue-tsc emits index.d.ts at publish
├── injection-key.ts                    # shared InjectionKey<<Name>Context>
├── composables/                        # use-*.ts only, e.g. use-<name>-context.ts (composables.md)
├── lib/                                # private helpers that are not composables
├── parts/                              # private sub-components that are not exported
├── <name>-trigger/
│   └── <name>-trigger.vue
├── <name>-content/
│   └── <name>-content.vue
├── <name>-title/
│   └── <name>-title.vue
└── <name>-close/
    └── <name>-close.vue
```

Part words come from the closed list in [`contributing/rules/naming.md`](../../rules/naming.md) § 2 (`Trigger`, `Content`, `Header`, `Body`, `Footer`, `Title`, `Description`, `Close`, `Item`, `Group`, `Label`, `Separator`, `List`, plus the domain parts a root declares). There is no `Portal` or `Overlay` part: `Content` renders both.

**Folder layout — monolithic (unchanged):**

```
packages/ui/src/components/<category>/<name>/
├── <name>.vue
└── <name>.test.ts
```

> Some existing composition components (`dialog`, `drawer`, and others) still use the older flat layout (`dialog-trigger.vue` directly under `dialog/`). Do **not** migrate them as part of a new-component scaffold. The folder-per-part layout applies to components scaffolded from a `status: approved` spec going forward.

## When to invoke

- Step 4 of `/component-create`, after `spec-validator` passed and reconciliation succeeded.

## Inputs

- The full text of `.specs/<name>.md` (verbatim).
- The Constraints block (verbatim).
- [`contributing/rules/no-invention.md`](../../rules/no-invention.md), [`contributing/rules/compound-api.md`](../../rules/compound-api.md) (composition only), the construction rules the orchestrator injects (`component-structure`, `props`, `emits`, `event-payloads`, `slots`, `v-model`, `root-element`, `styling`, `testid`, `accessibility`, `comments`), [`contributing/docs/CODE_QUALITY.md`](../../docs/CODE_QUALITY.md) § 3, [`contributing/docs/COMPONENT_REQUIREMENTS.md`](../../docs/COMPONENT_REQUIREMENTS.md), [`contributing/docs/TOKENS.md`](../../docs/TOKENS.md).
- The reference components for cross-reference (read-only): `button`, `icon-button` and `pricing-card`. Find them through the Azion UI MCP (`get_component` for the contract, `get_import` for the source its `target` points at); never hardcode a source path, because a component can move between category folders.

## Workflow

1. **Read the spec.** Extract Props / Events / Slots / Sub-components / States / Tokens / Accessibility tables.
2. **Write the root `.vue`.** Follow this skeleton and substitute spec values. Variants are switched via `data-*` attributes consumed by Tailwind's `data-[attr=value]:` prefix. **No `variantClasses` / `sizeClasses` / `sharedClasses` JS presets, no `<style>` block, no `.css` file inside the component.** A class string up to 200 characters stays inline on the root's `class`; a longer one (the usual case for a root with variants and sizes) is **one `ROOT_CLASS` constant** in the script, written as string literals joined with `+`, one group per line in this order: layout, states and focus, one line per variant, one line per size ([`CODE_QUALITY.md`](../../docs/CODE_QUALITY.md) § 3.3, CQ-04). Never a multi-line `class` in the template: the formatter collapses it past the 200-character line limit. Full rationale: [styling.md](../../rules/styling.md).

   ```vue
   <script setup lang="ts">
     import { computed, useAttrs } from 'vue'
     import { cn } from '@aziontech/ui/utils/cn'

     defineOptions({ name: 'PascalName', inheritAttrs: false })

     export type PascalNameVariant = 'primary' | 'secondary'
     export type PascalNameSize = 'small' | 'medium' | 'large'

     export interface PascalNameProps {
       /** From spec */
       variant?: PascalNameVariant
       /** From spec */
       size?: PascalNameSize
       /** From spec */
       disabled?: boolean
     }

     const props = withDefaults(defineProps<PascalNameProps>(), {
       variant: 'primary',
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
     const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? '<name>')

     const ROOT_CLASS =
       'relative inline-flex items-center justify-center whitespace-nowrap rounded-(--shape-button) ' +
       'transition-colors duration-150 ease-out motion-reduce:transition-none ' +
       'focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) ' +
       'data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) data-[disabled]:cursor-not-allowed ' +
       'data-[variant=primary]:bg-(--primary) data-[variant=primary]:text-(--primary-foreground) ' +
       'data-[variant=secondary]:bg-(--secondary) data-[variant=secondary]:text-(--secondary-foreground) ' +
       'data-[size=small]:h-7 data-[size=small]:px-(--spacing-xs) data-[size=small]:text-button-md ' +
       'data-[size=medium]:h-8 data-[size=medium]:px-(--spacing-sm) data-[size=medium]:text-button-md ' +
       'data-[size=large]:h-10 data-[size=large]:px-(--spacing-md) data-[size=large]:text-button-lg'
   </script>

   <template>
     <button
       type="button"
       v-bind="$attrs"
       :data-testid="testId"
       :data-variant="variant"
       :data-size="size"
       :data-disabled="disabled || null"
       :disabled="disabled"
       :class="cn(ROOT_CLASS, attrs.class as string)"
     >
       <slot />
     </button>
   </template>
   ```

   `<name>` in the `testId` fallback is the component's own kebab name (`'button'`; a part `'dialog-header'`), never a category-prefixed id; inner parts a test must reach are `` `${testId}__<part>` `` ([`testid.md`](../../rules/testid.md)). Spacing comes from the semantic scale (`--spacing-2xs` … `--spacing-2xl`); the primitive `--spacing-1` … `--spacing-96` is forbidden in components ([`TOKENS.md`](../../docs/TOKENS.md)).

   `cn` from `@aziontech/ui/utils/cn` merges the consumer `class` so it wins over internal token choices ([`root-element.md`](../../rules/root-element.md)); its first argument is one flat literal or the `ROOT_CLASS` constant, never a class map.

   **A component named after a native tag** (`Button`, `Table`, `Input`) cannot render `<component :is="'button'">` inside itself: the tag resolves to the component and recurses. Render its root through a small functional root that calls `h(tag, attrs, slots)` ([`CODE_QUALITY.md`](../../docs/CODE_QUALITY.md) § 3.3). A link-or-button root reuses the shared `useButtonRoot` composable (`src/composables/use-button-root`, which Button, IconButton and HighlightButton share) instead of writing its own.

   **Size and extension points.** Stay within the limits of [`CODE_QUALITY.md`](../../docs/CODE_QUALITY.md) § 3.1 (`.vue` 400 lines, `<script setup>` 200, function 60 lines and complexity 12, 200 characters a line, 20 props and 5 models a root); `check:maintainability` fails over them, with no exemption. Over a limit, split by feature (§ 3.2: `composables/use-<name>-<feature>.ts`, `parts/`, `lib/`). Ship the extension points of § 3.5: `data-slot="<part>"` on every part, exported `<Component>Props` and variant unions, and (composition) the exported context composable and context type.

   **Native controls and widget roles have an owner.** A native control (`button`, `input`, `select`, `textarea`, …) or an ARIA widget role rendered by a new component needs the component's folder listed as an owner of that element in `packages/ui/src/eslint-plugin/owners.json`, or `azion-ui/no-unowned-element` fails (CQ-E9). Prefer composing the existing owner (`Button`, `Input`, …) over adding one.

   Never write a `<style>` block. Never declare a `.css`/`.scss` file inside the component directory. Never declare any JavaScript variable that holds a class string (`const variantClasses = {...}`, `const sharedClasses = [...]`, etc.). Variants are HTML data-attributes, not JS dictionaries.

   **Never use backtick template literals inside `<template> :class="cn(\`...\`)"`** — the Vue HTML parser throws `Element is missing end tag`and Vite fails to load the component. Put the flat class string in`<script setup>`as`const ROOT_CLASS = '...'`and bind`:class="cn(ROOT_CLASS, attrs.class)"`, or use a plain multiline `class="..."` on the root. See [`contributing/rules/styling.md`](../../rules/styling.md) § "Vue SFC pitfall".

   **Never put HTML-like tags in script JSDoc** (e.g. `` `<a>` ``, `<template>`) — a build that runs `@vitejs/plugin-vue` twice re-parses compiled JS and fails with the same error. Use plain language ("anchor link") instead.

3. **(Composition only) Write each sub-component into its own folder.** For each sub-component `<name>-<part>` listed in the spec's Sub-components section, create:

   - `packages/ui/src/components/<category>/<name>/<name>-<part>/<name>-<part>.vue`

   Inside the `.vue`:
   - `defineOptions({ name: '<PascalRoot><PascalPart>', inheritAttrs: false })`.
   - Relative import for the shared injection key: `import { <PascalRoot>InjectionKey } from '../injection-key'` (one directory up — sibling of the root `.vue`).
   - `inject(<PascalRoot>InjectionKey)` to read shared state.
   - Local `testId` per [`testid.md`](../../rules/testid.md): the fallback is the sub-component's own name (e.g. `'<name>-trigger'`), never the parent's id.
   - `data-slot="<part>"` on the part's root ([`CODE_QUALITY.md`](../../docs/CODE_QUALITY.md) § 3.5).

4. **(Composition only) Write `injection-key.ts`** at the **root** level of the component (sibling of `<name>.vue`, **not** inside any sub-component folder). Replace `Dialog` with the PascalCase name of your component:

   ```ts
   // packages/ui/src/components/<category>/<name>/injection-key.ts
   import type { InjectionKey, Ref } from 'vue'

   export interface DialogContext {
     testId: string
     close: () => void
     isOpen: Readonly<Ref<boolean>>
   }

   export const DialogInjectionKey: InjectionKey<DialogContext> = Symbol('Dialog')
   ```

   Root `.vue` imports it via `import { DialogInjectionKey } from './injection-key'`. Sub-components import it via `import { DialogInjectionKey } from '../injection-key'`.

4b. **(Composition only) Write the compound `index.ts`** at the root level (sibling of `<name>.vue`). The root is the default export with every public sub-component attached via `Object.assign`. Member names mirror the spec's Sub-components section — strip the `<name>-` prefix and PascalCase (`dialog-trigger` → `Trigger`). Use a generic name only when the spec does (`SortButton`, not `Trigger`, when the part opens no `Content`). See [`contributing/rules/compound-api.md`](../../rules/compound-api.md).

```ts
// index.ts — one source of truth; vue-tsc derives index.d.ts from it.
import Dialog from './dialog.vue'
import DialogTrigger from './dialog-trigger/dialog-trigger.vue'
import DialogContent from './dialog-content/dialog-content.vue'

export default Object.assign(Dialog, {
  Trigger: DialogTrigger,
  Content: DialogContent
})
```

**The index is `.ts`, not `.js`** — `vue-tsc` cannot derive declarations from a plain `.js` (no `allowJs`), so `<Dialog.Trigger>` would be untyped. **Do not hand-write `index.d.ts`** — it is gitignored and generated at publish time (by the publish workflow), not in dev. The package is consumed as source (the exports map points at `./src/...`, and `.vue` files already import `.ts` like `injection-key.ts`), so the consumer transpiles `index.ts` the same way.

5. **Update `packages/ui/package.json#exports`** — add one entry per public component (the compound root, the standalone root, and each public sub-component). The **public export path stays flat** (`./<name>-<part>`, never `./<category>/<name>`) so consumers don't see the folder nesting; only the right-hand side changes. Write each entry with its source target, then run `pnpm --filter @aziontech/ui build:exports`: it rewrites every entry into the typed shape (`{ "types": "./types/components/<category>/<name>/<name>.vue.d.ts", "default": "./src/components/<category>/<name>/<name>.vue" }`) and refreshes `typesVersions`. The `exports` gate (`build-exports.mjs --check`) fails until it has run.

   The **composition root** points at `index.ts` (the compound); monolithic roots point at `<name>.vue`. Composition also gets a **standalone `./<name>-root`** key pointing straight at the root `.vue` — the tree-shaking path, since the compound `index.ts` retains every sub-component through `Object.assign` (see [`contributing/rules/compound-api.md`](../../rules/compound-api.md)):

   ```json
   "./<name>": "./src/components/<category>/<name>/index.ts",
   "./<name>-root": "./src/components/<category>/<name>/<name>.vue",
   "./<name>-trigger": "./src/components/<category>/<name>/<name>-trigger/<name>-trigger.vue",
   "./<name>-content": "./src/components/<category>/<name>/<name>-content/<name>-content.vue"
   ```

   After `build:exports`, the compound root entry reads:

   ```json
   "./<name>": {
     "types": "./types/components/<category>/<name>/index.d.ts",
     "default": "./src/components/<category>/<name>/index.ts"
   }
   ```

6. **Write the starter test** `<name>.test.ts` next to the root `.vue`, using the template below. Fill the root's **required** props (spec Props with no default) so the render doesn't throw. This is a **FLOOR** — render + `data-testid` fallback + consumer override + axe. It uses `render(Component)` directly because the examples are written later (`examples/<name>/`); the author expands it (every event with payload, `disabled`/`loading` suppression, `v-model`, ARIA/`data-state`, keyboard, the `dir="rtl"` case, and the examples as fixtures) per [`contributing/rules/testing.md`](../../rules/testing.md). [`enforce-test-exists.mjs`](../../hooks/enforce-test-exists.mjs) blocks the root `.vue` while this file is missing, so write it in the same step.

   ```ts
   // packages/ui/src/components/<category>/<name>/<name>.test.ts
   import { render } from '@testing-library/vue'
   import { describe, expect, it } from 'vitest'

   import { expectNoA11yViolations } from '../../../test/axe'
   import <PascalName> from './<name>.vue'

   // Starter suite emitted by the scaffold — a FLOOR, not the ceiling. Expand per
   // contributing/rules/testing.md: mount the examples from examples/<name>/, then
   // assert every event with its payload, disabled/loading suppression, v-model
   // round-trip, ARIA / data-state, and keyboard interaction.
   describe('<PascalName>', () => {
     it('renders and exposes the fallback data-testid', () => {
       const { getByTestId } = render(<PascalName>, { props: { /* required spec props */ } })
       expect(getByTestId('<name>')).toBeTruthy()
     })

     it('lets a consumer override data-testid', () => {
       const { getByTestId } = render(<PascalName>, {
         props: { /* required spec props */ },
         attrs: { 'data-testid': 'custom-testid' }
       })
       expect(getByTestId('custom-testid')).toBeTruthy()
     })

     it('has no axe violations on the default render', async () => {
       const { container } = render(<PascalName>, { props: { /* required spec props */ } })
       await expectNoA11yViolations(container)
     })
   })
   ```

   For a **composition** root, expand the starter to render a realistic composed tree (root + its sub-components) instead of the bare root, since the root alone may render empty. Still a floor — the author fills events / `provide`-`inject` / `v-model`.

7. **Stop.** Do not expand the starter test; do not write the examples, the `.size-limit.json` entry or the locale keys; do not write the `.figma.ts`. The only pnpm command you run is `build:exports` (step 5).

## Outputs

- The files listed above, including the starter `<name>.test.ts` (step 6). No prose, no commentary, no edits to other paths.

## Rules

- Every prop, event, slot, and sub-component MUST come from the spec — no inventions. (`validate-spec-compliance.mjs` enforces this on Write; it will reject the run if you stray.)
- (Composition only) Emit the compound `index.ts` (vue-tsc generates `index.d.ts` at publish; never hand-write it) and point the root export → `index.ts`; **also add the standalone `./<name>-root` export → root `.vue`** for tree-shaking. Member names mirror the component's anatomy. Never invent overlay part names (`Trigger`/`Content`) on a component with no open/closed state. See [`contributing/rules/compound-api.md`](../../rules/compound-api.md).
- Built-in strings (visible text, `aria-label`, announcements) come from the locale catalogs through `useLocale` / `useTranslate`, never a literal in the template or an English prop default (`check-authoring` blocks both); the keys are the ones the spec's `## Internationalization` lists. Adding them to `src/locales/*.ts` is a later step.
- No prose comments in the `.vue`: only API JSDoc and tool directives ([`comments.md`](../../rules/comments.md)).
- Use the reference components (`button`, `pricing-card`, found through the MCP) as the **shape** guide — but substitute spec content, never copy spec content from a canonical.
- `withDefaults` mirrors the spec's Default column **exactly**. An optional string prop that holds renderable text defaults to `''` (`value: ''`, `label: ''`) — never `value: undefined`, never the literal `'undefined'`. Reserve `undefined` (unquoted) for props where absence ≠ empty: controlled state (`open`, `modelValue`) or an optional resource whose presence toggles rendering (`src`). When the spec's Default cell is wrong on this point, stop with `BLOCKED: prop <name> defaults to 'undefined' — should be '' (empty string)`; do not silently copy it.
- All visual tokens come from [`contributing/docs/TOKENS.md`](../../docs/TOKENS.md). No HEX, no Tailwind palette, no raw typography.
- A zero length carries **no unit**: `0`, never `0px` / `0rem` / `0em` — in arbitrary values (`p-[0px]`), inline `style`, or any emitted value. Units that mean something at zero (`0%`, `0s`, `0deg`, `0fr`) are fine, and inside `calc()`/`min()`/`max()`/`clamp()` — where CSS requires a unit — the zero is `0rem`. See [`contributing/rules/styling.md`](../../rules/styling.md).
- TypeScript only (`<script setup lang="ts">`); no `any`; no `@ts-ignore`; no `class` in `defineProps`.
- `<script setup>` always before `<template>`.
- `data-testid` per [`testid.md`](../../rules/testid.md): the own kebab name, inner parts `${testId}__<part>`.
- Naming per [`naming.md`](../../rules/naming.md) and [`prop-vocabulary.md`](../../rules/prop-vocabulary.md) (`validate-naming.mjs` blocks a violation at write time).
- Accessibility per [`accessibility.md`](../../rules/accessibility.md) (focus-visible ring, ARIA, keyboard map, `useId`, `ariaLabel` optional with a `''` default).

## Animations — apply the spec's Motion & Animations table verbatim

- Every animation class **must** come from `packages/theme/src/tokens/primitives/animations/animate.js` (for example `animate-fade-in`, `animate-fade-out`, `animate-slide-down`, `animate-popup-scale-in`, `animate-popup-scale-out`, `animate-highlight-fade`, `animate-blink-settle`, `animate-spin-settle`; read the file for the full list) — see the Animations section of [`contributing/docs/TOKENS.md`](../../docs/TOKENS.md#animations).
- A transition on a transform names the property the utility sets (`transition-[translate,opacity]`, `transition-[scale,opacity]`), never `transform` ([`styling.md`](../../rules/styling.md)).
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
- Loading indicators reuse `@aziontech/ui/spinner` (see the reuse-audit output) and carry `aria-hidden="true"` + `motion-reduce:animate-none`.
- Set `--popup-origin` per instance when using `animate-popup-scale-*`, anchored to the trigger:
  ```html
  :style="{ '--popup-origin': originFromTrigger }"
  ```
- If the spec's Motion & Animations section is `_none_`, the `.vue` must contain **zero** `animate-*` or `transition-*` classes; `validate-spec-compliance.mjs` enforces this.

## Fallbacks

- Spec lists a token not in TOKENS.md → stop with `BLOCKED: token <name> not in TOKENS.md`. Do not write a fallback HEX.
- Spec references an import that doesn't exist → stop with `BLOCKED: phantom import <path>`. The `validate-references.mjs` hook would block anyway.
- Sub-component listed in spec but ambiguous purpose → stop with `BLOCKED: sub-component <name> purpose unclear`.

## Definition of Done

- [ ] Root `.vue` written with every spec prop/event/slot, no extras.
- [ ] Composition: every sub-component is **its own folder** under the component root — `<name>/<name>-<part>/<name>-<part>.vue`.
- [ ] Composition: `injection-key.ts` written at the root level (sibling of `<name>.vue`), not inside any sub-component folder. Root imports it via `./injection-key`; sub-components via `../injection-key`.
- [ ] Composition: `index.ts` written at the root level (sibling of `<name>.vue`), attaching every sub-component to the root via `Object.assign` (no hand-written `index.d.ts` — vue-tsc generates it at publish). Member names mirror the spec's anatomy (no invented `Trigger`/`Content` on a non-overlay component).
- [ ] New entries added to `packages/ui/package.json#exports`. Public paths stay flat (`./<name>-<part>`); right-hand paths reflect the folder nesting. The composition root export points at `index.ts`; a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). `build:exports` has run, so every entry has the typed shape.
- [ ] A class string over 200 characters is a `ROOT_CLASS` constant of `+`-joined literals; no file, script, function, line, prop or model count over the CODE_QUALITY.md § 3.1 limits.
- [ ] Every part carries `data-slot`; `<Component>Props`, the variant unions and (composition) the context composable and type are exported.
- [ ] Every native control or widget role the component renders has its owner entry in `owners.json`.
- [ ] No HEX / Tailwind palette / raw typography / `any` / `@ts-ignore`.
- [ ] No zero with a length unit (`0px` / `0rem` / `0em`) anywhere in the emitted files — a zero is written `0`, except inside `calc()`/`min()`/`max()`/`clamp()`, where it is `0rem`.
- [ ] `defineOptions.name` is PascalCase and matches the directory.
- [ ] `data-testid` fallback equals `'<name>'` on the root and each sub-component's own name on it (`'<name>-<part>'`); inner elements use `${testId}__<part>`.
- [ ] Starter `<name>.test.ts` written next to the root `.vue` (render + `data-testid` fallback + consumer override + axe; required props filled from the spec) — satisfies `enforce-test-exists.mjs`.
- [ ] No example, size budget, locale key or `.figma.ts` written; no pnpm command run besides `build:exports`.
