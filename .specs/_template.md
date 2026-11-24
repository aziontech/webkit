---
name: <kebab-case-name>
category: <action|ai|chart|code|content|data|docs|feedback|input|layout|marketing|navigation|overlay|provider|section>
structure: <monolithic|composition>
status: draft
stability: preview
spec_version: 1
template: 2
figma:
  url: <https://figma.com/design/...>
  node_id: <e.g. 10:42>
checksum: 9f6a5dfc5b1dde68851607a090f837d733fdc4a3fb7a847083aa781c187133ca
created: <YYYY-MM-DD>
last_updated: 2026-11-15
---

# <Name> — Component Spec

## Purpose

<1–3 sentences. What the component is, when to use it, what makes it different from siblings in the same category.>

## When to use

<!-- Bullets: the concrete situations this component is the right choice for. Extracted
     into the catalog (useWhen) + surfaced by the MCP (get_best_practices / suggest_component).
     Write them in the words of the product task: the usage check (`check:usage`, step 8 of
     /component-new) only passes when a fresh agent finds the component from its intent. -->

- <use case>

## When NOT to use

<!-- Bullets: situations where a sibling/other component fits better — name it. This is
     what resolves "X vs Y" (e.g. badge vs tag, dialog vs drawer). Extracted as avoidWhen. -->

- <anti-case → use `<other-component>` instead>

## Related

<!-- Sibling / commonly-paired components, each with one-line "why/when". Extracted as related. -->

- `<component>` — <how it differs / when to reach for it instead>

## Best practices

<!-- Bullets: do/don't guidance specific to this component. Extracted as bestPractices. -->

- <practice>

## Usage

<!-- ONE fenced ```vue block with:
       • the canonical import path from packages/webkit/package.json#exports
       • a minimal <script setup> that imports the component
       • a minimal <template> showing the public API
     For structure: composition, the template MUST render the full anatomy
     (every sub-component listed in the Sub-components section, in the order
     the consumer would compose them). For structure: monolithic, render the
     root with the most representative props.
     The catalog and the docs page show this block as the usage of the
     component; the examples in examples/<name>/ are separate files. -->

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
<!-- For structure: composition, list every public sub-component AND the folder layout the component-scaffolder must emit. Each sub-component lives in its own folder under the root component, one folder per part. The file name keeps the full prefix (e.g. `dialog-trigger.vue`, never `index.vue`) so traces and editor breadcrumbs stay unambiguous. -->
<!-- Composition components ship a COMPOUND API: an `index.ts` that uses `Object.assign` to attach every sub-component to the root (vue-tsc generates the adjacent `index.d.ts`, so `<Root.Part>` is typed; never hand-write the `.d.ts` — it is gitignored). Consumers reach `<Root.Part>` with one import, while the standalone sub-component imports remain for tree-shaking. Member names mirror THIS component's anatomy (`SortButton`, not a generic `Trigger`); `Trigger`/`Content` are for overlay/disclosure components only. See `.claude/rules/compound-api.md`. -->

<!-- Part words come from the closed list in `.claude/rules/naming.md` § 2 (Trigger, Content,
     Header, Body, Footer, Title, Description, Close, Item, Group, Label, Separator, List) or a
     domain part the root declares. There is no Portal or Overlay part: Content renders both. -->

- `<name>-trigger/<name>-trigger.vue` — purpose
- `<name>-content/<name>-content.vue` — purpose
- `<name>-title/<name>-title.vue` — purpose
- `<name>-description/<name>-description.vue` — purpose
- `<name>-close/<name>-close.vue` — purpose

<!-- Resulting layout (composition, canonical):

  packages/webkit/src/components/<category>/<name>/
  ├── <name>.vue
  ├── index.ts                    (compound: Object.assign attaches every sub-component; vue-tsc emits index.d.ts)
  ├── injection-key.ts            (shared by every sub-component; one directory up from each sub-component)
  ├── composables/
  │   └── use-<name>-context.ts   (exported, with its context type: CODE_QUALITY.md § 3.5)
  ├── <name>-trigger/
  │   └── <name>-trigger.vue
  ├── <name>-content/
  │   └── <name>-content.vue
  └── ...

  No per-component package.json. The root export (`./<name>`) points at
  `index.ts`, NOT the root `.vue`, and a standalone `./<name>-root` points at
  the root `.vue`. Sub-component exports stay flat (`./<name>-trigger`) and
  point at their `.vue` regardless of the folder nesting. Run
  `pnpm --filter @aziontech/webkit build:exports` after adding them. -->

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
| `label` | `string` | `''` | false | Text content rendered inside the component. |
| `variant` | `'primary' \| 'secondary' \| 'outline' \| 'ghost'` | `'primary'` | false | Visual variant. |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | false | Size token; affects height, padding, typography. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |

<!-- Rules enforced by spec-validator:
     - camelCase prop names (consumers write the kebab attribute); no `is`/`has` prefix on booleans;
       names and value sets from `.claude/rules/prop-vocabulary.md`.
     - At most 20 props on a root (`.claude/docs/CODE_QUALITY.md` § 3.4); past that, a feature
       becomes a companion part. The `.vue` declares them as an exported `interface <Component>Props`.
     - Visual variants always named `variant` (a sort of part is `type`). Sizes always named `size`.
     - Every prop has a JSDoc one-liner; no empty cells.
     - Types are union literals or primitives; no `any`.
     - Required is `true` / `false` — never `yes` / `no`, so the column reads as the
       boolean it is, like the Type and Default columns beside it.
     - Escape every `|` inside a union type (`'a' \| 'b'`), or the pipe closes the cell
       and the row renders with extra columns.
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
| `click` | `(event: MouseEvent)` | Fires on activation. |
| `update:open` | `(value: boolean)` | v-model:open. |

<!-- Rules:
     - Event names in kebab-case (or `update:<prop>` for v-model, declared with defineModel).
     - An activation event's payload is the DOM event first, then the subject:
       `(event: MouseEvent, item: <Component>Item)` (`.claude/rules/event-payloads.md`).
     - A model or value event carries the new value only; no `<x>-change` echo of `update:<x>`. -->

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
- Loading / empty / error / readonly / invalid as the component owns them (`.claude/rules/component-states.md`); a component that shows a list takes the list state contract of `.claude/docs/CODE_QUALITY.md` § 3.7

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| open (overlay / popover) | `animate-popup-scale-in` | semantic (150ms · cubic-bezier) | `motion-reduce:animate-none` (instant) |
| close (overlay / popover) | `animate-popup-scale-out` | semantic (110ms · cubic-bezier) | `motion-reduce:animate-none` (instant) |
| hover/focus state change | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |
| loading indicator | component (`Spinner`) | semantic (`animate-spin-settle`) | `aria-hidden="true"` + `motion-reduce:animate-none` |

<!-- Rules:
     - Every animation MUST come from packages/theme/src/tokens/primitives/animations/animate.js.
     - Every motion-bearing transition pairs with `motion-reduce:transition-none` (or `motion-reduce:transform-none` / `motion-reduce:animate-none`).
     - No `@keyframes` declared inside the component.
     - Decorative spinners/loaders use `aria-hidden="true"`.
     - If the component is static (no motion), write `_none_` in this section. Do not omit the section. -->

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (label) | `.text-button-lg` |
| surface | `var(--bg-surface)` |
| spacing.x | `var(--spacing-md)` |
| shape | `var(--shape-button)` |
| ring | `var(--ring-color)` |

<!-- Every token here must exist in .claude/docs/DESIGN.md.
     spec-validator and token-mapper independently verify this. Spacing is semantic
     (`--spacing-2xs` … `--spacing-2xl`), never the primitive `--spacing-1` … `--spacing-96`.
     A status icon on a surface takes its `-mark` token, never `-foreground` or the fill. -->

## Theme gaps

<!-- One row per Figma variable that has no DESIGN.md equivalent yet. -->

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `<figma var>` | `<closest primitive>` | `TODO: tokenizar` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `<Tab focuses; Enter/Space activates; Esc closes; arrows navigate; ...>`
- ARIA: `<aria-label / aria-busy / aria-disabled / aria-hidden / aria-current / aria-expanded as applicable>`
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state, and the APCA targets: only documented token pairs (`rules/webkit-tokens.md` § Contrast)
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states
- Touch target ≥40×40 px (or justified deviation)

## Internationalization

<!-- Required on template 2 (every spec created by spec-create from 2026-11-12 on).
     List every built-in string the component renders or announces (visible text, aria-label,
     aria-live text, placeholder, title) as a message key, its English source and the
     prop that overrides it. Dates, numbers, currency, relative time and plurals go through
     `Intl` with the locale from `ConfigProvider`. Write "No built-in strings" when that is true.
     Keys sit in the camelCase component namespace (`<componentName>.<key>`; shared words in
     `common`) and are added to all three catalogs, `packages/webkit/src/locales/en.ts`, `pt-BR.ts`
     and `es.ts` (`.claude/rules/naming.md` § 13). -->

| Key | English source | Override prop |
|---|---|---|
| `<name>.<part>` | `<English text>` | `<prop or —>` |

- Formatting: `<Intl API used, or "none">`

## Right-to-left

<!-- Required on template 2. How the component renders under `dir="rtl"`. -->

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`); `<any exception and why>`
- Icons: `<mirrored icons (arrows, chevrons) / non-mirrored icons (play, logos, code)>`
- Keyboard: `<which arrow key moves where under rtl (ArrowLeft = next in rtl, ...)>`
- User data: `<bdi> / dir="auto" around <domains, IDs, code, or "none">`

## Responsive

<!-- Required on template 2. Behaviour from 320 px to 2560 px and in narrow containers. -->

- Container queries: `<@container breakpoints the component reacts to, or "none: fixed size">`
- Narrow (≤ 640 px or a narrow container): `<what changes: stacking, sheet, truncation, ...>`
- Touch: targets ≥ 24 px (44 px on `pointer: coarse`); `<hover-only affordances and their touch alternative>`
- Reflow: no horizontal scroll at 320 px and 200 % zoom (WCAG 1.4.10, 1.4.12); `<exceptions such as data tables>`

## Performance

<!-- Required on template 2. The budgets CI and review hold the component to. -->

- Bundle budget: `<gzip kB for the tree-shakeable entry; it becomes the .size-limit.json entry>`
- Runtime budget: `<interaction or render budget, e.g. "1k options open in < 100 ms", or "none: static">`
- Heavy parts: `<lazy-loaded parts (editor, charts), virtualization, or "none">`

## Examples

Canonical layout — composite examples (`variants.vue`, `sizes.vue`) render every variant of one axis side-by-side in a single frame; state examples (`loading.vue`, `disabled.vue`) change only the prop they demonstrate.

- Default — the first example, file `default.vue`.
- Variants — composite example rendering every `variant` value side-by-side. Omit when the component has only one `variant`.
- Sizes — composite example rendering every `size` value side-by-side. Omit when the component has only one `size`.
- Loading — only when the component has a `loading` prop.
- Disabled — only when the component has a `disabled` prop.

<!-- Rules:
     - DO NOT add LightDark, Accessibility (with play), Playground, WithSlots, WithComposition, Controlled, Uncontrolled examples unless the spec explicitly justifies them in writing here.
     - File names follow `.claude/rules/naming.md` § 4 (`variants.vue`, `sizes.vue`, `disabled.vue`; never `types`, `basic`, `playground`, `demo`). examples.json ships at least every example listed here (`check:complete`).
     - The harnesses (a11y, hydration, server render) and the styled visual suite cover every example automatically.
     - For each additional state example (Loading/Disabled), the prop delta is the prop being demonstrated — nothing else.
     - Do NOT replace Variants/Sizes with one-example-per-variant (Primary/Secondary/...). The composite examples are the canonical pattern. -->


## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/primitives/animations/animate.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Variants + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Variants/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
