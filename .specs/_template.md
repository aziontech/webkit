---
name: <kebab-case-name>
category: <actions|content|data|feedback|inputs|layout|navigation|overlay|utils>
structure: <monolithic|composition>
status: draft
spec_version: 1
figma:
  url: <https://figma.com/design/...>
  node_id: <e.g. 10:42>
checksum: <sha256-of-body — filled by spec-validator on approval>
created: <YYYY-MM-DD>
last_updated: <YYYY-MM-DD>
---

# <Name> — Component Spec

## Purpose

<1–3 sentences. What the component is, when to use it, what makes it different from siblings in the same category.>

## Usage

<!-- ONE fenced ```vue block with:
       • the canonical import path from packages/webkit/package.json#exports
       • a minimal <script setup> that imports the component
       • a minimal <template> showing the public API
     For structure: composition, the template MUST render the full anatomy
     (every sub-component listed in the Sub-components section, in the order
     the consumer would compose them). For structure: monolithic, render the
     root with the most representative props.
     This block is injected verbatim into the Storybook
     parameters.docs.description.component by the storybook-write skill;
     do NOT also paste it into the Storybook story by hand. -->

```vue
<script setup>
import MyComponent from '@aziontech/webkit/<name>'
</script>

<template>
  <MyComponent label="Click me" />
</template>
```

<!-- Composition example (structure: composition):
     LEAD with the compound dot-notation form — one import of the root, every
     sub-component reached as `<Root.Part>`. The standalone imports remain
     available (and are the tree-shaking path) — the root via `<name>-root`,
     each sub-component via `<name>-<part>` — but the docs lead with compound.
     The root binding MUST be PascalCase (`Dialog`); a lowercase root would
     collide with a native element and not resolve. See
     `.claude/rules/compound-api.md`.

```vue
<script setup>
import Dialog from '@aziontech/webkit/dialog'
import DialogTrigger from '@aziontech/webkit/dialog-trigger'
import DialogContent from '@aziontech/webkit/dialog-content'
import DialogTitle from '@aziontech/webkit/dialog-title'
import DialogDescription from '@aziontech/webkit/dialog-description'
import DialogClose from '@aziontech/webkit/dialog-close'
</script>

<template>
  <Dialog>
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Content>
      <Dialog.Title>Confirm action</Dialog.Title>
      <Dialog.Description>This cannot be undone.</Dialog.Description>
      <Dialog.Close>Cancel</Dialog.Close>
    </Dialog.Content>
  </Dialog>
</template>
```

Tree-shaking alternative — the standalone root + each sub-component from its own
entry (no `Object.assign` compound pulled in):

```vue
<script setup>
import Dialog from '@aziontech/webkit/dialog-root'
import DialogTrigger from '@aziontech/webkit/dialog-trigger'
import DialogContent from '@aziontech/webkit/dialog-content'
</script>
```
-->

## Sub-components

<!-- Omit this section when structure: monolithic. -->
<!-- For structure: composition, list every public sub-component AND the folder layout the scaffolder must emit. Each sub-component lives in its own folder under the root component, one folder per part. The file name keeps the full prefix (e.g. `dialog-trigger.vue`, never `index.vue`) so traces and editor breadcrumbs stay unambiguous. -->
<!-- Composition components ship a COMPOUND API: an `index.ts` that uses `Object.assign` to attach every sub-component to the root (vue-tsc generates the adjacent `index.d.ts`, so `<Root.Part>` is typed; never hand-write the `.d.ts` — it is gitignored). Consumers reach `<Root.Part>` with one import, while the standalone sub-component imports remain for tree-shaking. Member names mirror THIS component's anatomy (`SortButton`, not a generic `Trigger`); `Trigger`/`Content` are for overlay/disclosure components only. See `.claude/rules/compound-api.md`. -->

- `<name>-trigger/<name>-trigger.vue` — purpose
- `<name>-portal/<name>-portal.vue` — purpose
- `<name>-overlay/<name>-overlay.vue` — purpose
- `<name>-content/<name>-content.vue` — purpose
- `<name>-title/<name>-title.vue` — purpose
- `<name>-description/<name>-description.vue` — purpose
- `<name>-close/<name>-close.vue` — purpose

<!-- Resulting layout (composition, canonical):

  packages/webkit/src/components/webkit/<category>/<name>/
  ├── <name>.vue
  ├── index.ts                    (compound: Object.assign attaches every sub-component; vue-tsc emits index.d.ts)
  ├── package.json                (main/module → ./index.ts, types → ./index.d.ts)
  ├── injection-key.ts            (shared by every sub-component; one directory up from each sub-component)
  ├── <name>-trigger/
  │   ├── <name>-trigger.vue
  │   └── package.json
  ├── <name>-content/
  │   ├── <name>-content.vue
  │   └── package.json
  └── ...

  The root export (`./<name>`) points at `index.ts`, NOT the root
  `.vue`. Sub-component exports stay flat (`./<name>-trigger`) and
  point at their `.vue` regardless of the folder nesting. -->

<!-- Compound API file (composition only), beside `<name>.vue` — one `.ts`; vue-tsc derives index.d.ts:

```ts
// index.ts
import Root from './<name>.vue'
import RootPart from './<name>-part/<name>-part.vue'
export default Object.assign(Root, { Part: RootPart })
```
-->


## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `label` | `string` | `''` | no | Text content rendered inside the component. |
| `kind` | `'primary' \| 'secondary' \| 'outlined' \| 'text'` | `'primary'` | no | Visual variant. |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | no | Size token; affects height, padding, typography. |
| `disabled` | `boolean` | `false` | no | Disables interaction and applies disabled tokens. |

<!-- Rules enforced by spec-validator:
     - kebab-case prop names; no `is`/`has` prefix on booleans.
     - Visual variants always named `kind`. Sizes always named `size`.
     - Every prop has a JSDoc one-liner; no empty cells.
     - Types are union literals or primitives; no `any`.
     - Defaults — pick the value that makes rendering predictable, never the word "undefined":
         • An optional string holding renderable text (`label`, `value`, `placeholder`,
           `description`, `icon`, `href`) defaults to `''` (empty string).
         • An optional boolean defaults to `false`; an optional number to its neutral value.
         • Reserve `undefined` — written UNQUOTED — only for props where absence ≠ empty:
           controlled state (`open`, `modelValue`) or an optional resource whose presence
           toggles rendering (`src`).
         • NEVER write the literal `` `'undefined'` `` (quoted) in the Default column — that is the
           string "undefined", not the absence of a value. The matching `.vue` must use the same
           value in `withDefaults` (`label: ''`, never `label: undefined`). -->

## Events

| Event | Payload | Notes |
|---|---|---|
| `click` | `MouseEvent` | Fires on activation. |
| `update:open` | `boolean` | v-model:open. |

<!-- Rules:
     - Event names in kebab-case (or `update:<prop>` for v-model).
     - Payload is a single TypeScript type or `void`. -->

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Main content. |
| `actions` | — | Trailing action area. |

<!-- Use `—` (em-dash) in Scope when the slot has no scoped props. -->

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `loading`
- `data-state` values (when applicable): `open` | `closed`
- `data-disabled` mirrors the `disabled` prop
- `data-orientation` (when applicable): `horizontal` | `vertical`

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| open (overlay / popover) | `animate-popup-scale-in` | semantic (150ms · cubic-bezier) | `motion-reduce:animate-none` (instant) |
| close (overlay / popover) | `animate-popup-scale-out` | semantic (110ms · cubic-bezier) | `motion-reduce:animate-none` (instant) |
| hover/focus state change | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |
| loading indicator | `animate-blink` or component (`Spinner`) | semantic (1s step-end) | `aria-hidden="true"` + `motion-reduce:animate-none` |

<!-- Rules:
     - Every animation MUST come from packages/theme/src/tokens/semantic/animations.js.
     - Every motion-bearing transition pairs with `motion-reduce:transition-none` (or `motion-reduce:transform-none` / `motion-reduce:animate-none`).
     - No `@keyframes` declared inside the component.
     - Decorative spinners/loaders use `aria-hidden="true"`.
     - If the component is static (no motion), write `_none_` in this section. Do not omit the section. -->

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (label) | `.text-button-lg` |
| surface | `var(--bg-surface)` |
| spacing.x | `var(--spacing-4)` |
| shape | `var(--shape-button)` |
| ring | `var(--ring-color)` |

<!-- Every token here must exist in .claude/docs/DESIGN.md.
     spec-validator and token-mapper independently verify this. -->

## Theme gaps

<!-- One row per Figma variable that has no DESIGN.md equivalent yet. -->

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `<figma var>` | `<closest primitive>` | `TODO: tokenizar` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]`
- Keyboard map: `<Tab focuses; Enter/Space activates; Esc closes; arrows navigate; ...>`
- ARIA: `<aria-label / aria-busy / aria-disabled / aria-hidden / aria-current / aria-expanded as applicable>`
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states
- Touch target ≥40×40 px (or justified deviation)

## Stories (Storybook)

Canonical layout — matches `apps/storybook/src/stories/webkit/actions/button/Button.stories.js`. Composite stories (`Types`, `Sizes`) render every variant side-by-side in a single frame; state stories use the reusable `Template` with an args delta.

- Default
- Types — composite story rendering every `kind` value side-by-side. Omit when the component has only one `kind`.
- Sizes — composite story rendering every `size` value side-by-side. Omit when the component has only one `size`.
- Loading — only when the component has a `loading` prop.
- Disabled — only when the component has a `disabled` prop.

<!-- Rules:
     - DO NOT add LightDark, Accessibility (with play), Playground, WithSlots, WithComposition, Controlled, Uncontrolled stories unless the spec explicitly justifies them in writing here.
     - Storybook addons (a11y, docs autodocs, backgrounds) cover the rest automatically without a dedicated story.
     - For each additional state story (Loading/Disabled), the args delta is the prop being demonstrated — nothing else.
     - Do NOT replace Types/Sizes with one-story-per-variant (Primary/Secondary/...). The composite stories are the canonical pattern. -->


## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
