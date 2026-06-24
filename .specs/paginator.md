---
name: paginator
category: data
structure: composition
status: approved
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=483-929
  node_id: 483:929
checksum: 6d1f76b81dfa29640a5a91bec36348ef0e075850ce0aab3d590d211dc75145f4
created: 2026-06-16
last_updated: 2026-06-24
---

# Paginator — Component Spec

## Purpose

Pagination controls for tables and lists, pixel-perfect to Figma, in two modes. **Composition mode** (default): a three-region landmark — page-info text, navigation buttons (Previous / page numbers / overflow / Next), and a rows-per-page selector — wired by hand through slots, with the consumer owning the current page, total, and page-size state. **Data-driven mode**: pass `total` (and optionally `page` / `pageSize`) and the Paginator renders its own info text, Previous / windowed page numbers / overflow ellipsis / Next, and the rows-per-page selector, emitting `update:page` / `update:pageSize` / `page-change` so the consumer can bind state via `v-model`. This component owns markup, tokens, and a11y; the data engine is a small internal page-window calculation — **no external pagination library**. Pairs with the [`Table`](./table.md) component.

## Usage

Composition mode — one import of the root; every part is reached via dot-notation (`<Paginator.Button>`, `<Paginator.Info>`, `<Paginator.PageSize>`). The root binding must be PascalCase (`Paginator`).

```vue
<script setup>
import Paginator from '@aziontech/webkit/paginator'
</script>

<template>
  <Paginator>
    <template #info>
      <Paginator.Info>Showing 1 to 10 of 20 entries</Paginator.Info>
    </template>

    <Paginator.Button kind="previous" disabled>Previous</Paginator.Button>
    <Paginator.Button kind="number" selected>1</Paginator.Button>
    <Paginator.Button kind="number">2</Paginator.Button>
    <Paginator.Button kind="number">3</Paginator.Button>
    <Paginator.Button kind="more" />
    <Paginator.Button kind="next">Next</Paginator.Button>

    <template #controls>
      <Paginator.PageSize :model-value="10" :options="[10, 25, 50, 100]" />
    </template>
  </Paginator>
</template>
```

Each sub-component is also a standalone import (`import PaginationButton from '@aziontech/webkit/pagination-button'`, …) — the tree-shaking path.

Data-driven mode — pass `total` and bind state; the Paginator renders the controls and emits the page/page-size changes:

```vue
<script setup>
import { ref } from 'vue'
import Paginator from '@aziontech/webkit/paginator'

const page = ref(1)
const pageSize = ref(10)
</script>

<template>
  <Paginator
    v-model:page="page"
    v-model:page-size="pageSize"
    :total="200"
    :page-size-options="[10, 25, 50, 100]"
    @page-change="loadPage"
  />
</template>
```

## Sub-components

<!-- Each sub-component lives in its own folder under the root, with its own package.json.
     The shared injection-key.ts sits one directory up from each sub-component.
     Per-sub-component props/events are listed here (the root Props/Events/Slots tables
     below describe ONLY the root Paginator element).
     Compound API: index.ts (Object.assign; vue-tsc emits index.d.ts) attaches the sub-components
     to the root as `Paginator.Button` (PaginationButton) / `Paginator.Info` / `Paginator.PageSize`
     (PascalCase root required). See `.claude/rules/compound-api.md`. -->

- `pagination-button/pagination-button.vue` — a single pagination control, height 28px, `var(--shape-button)` radius. Props `kind?: 'previous' | 'next' | 'number' | 'more'`, `selected?: boolean` (current-page treatment), `disabled?: boolean`. Emits `click: [event: MouseEvent]`. `previous` renders `pi pi-chevron-left` + the default slot; `next` renders the default slot + `pi pi-chevron-right`; `more` renders `pi pi-ellipsis-h`; `number` renders the default slot. Hover/active use the DESIGN.md ghost-layer surfaces; `selected` uses `var(--bg-selected)` + border; `disabled` uses `var(--bg-disabled)` + `var(--text-disabled)`.
- `paginator-info/paginator-info.vue` — muted page-info text container (default slot), `.text-label-sm` / `var(--text-muted)`.
- `paginator-page-size/paginator-page-size.vue` — rows-per-page selector (native `<select>`), 64×32, `var(--bg-canvas)` frame over a `var(--bg-surface)` field with `var(--border-default)` border, value `.text-label-sm` muted, `pi pi-chevron-down`. Props `modelValue?: number`, `options?: number[]` (default `[10, 25, 50, 100]`). Emits `update:modelValue: [value: number]`. Placed in the Paginator `controls` slot.

<!-- Resulting layout:

  packages/webkit/src/components/webkit/data/paginator/
  ├── paginator.vue
  ├── index.ts              (compound: Object.assign attaches sub-components; vue-tsc emits index.d.ts)
  ├── package.json          (main/module → ./index.ts, types → ./index.d.ts)
  ├── injection-key.ts
  ├── pagination-button/    { pagination-button.vue, package.json }
  ├── paginator-info/       { paginator-info.vue, package.json }
  └── paginator-page-size/  { paginator-page-size.vue, package.json }

  Public exports stay flat: ./data/paginator (→ index.ts), ./data/pagination-button, ./data/paginator-info, ./data/paginator-page-size -->

## Props

<!-- Root <Paginator> element only. Sub-component props are listed in the Sub-components section. -->

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `page` | `number` | `1` | no | Current page, 1-based (data-driven mode). Supports `v-model:page`. |
| `total` | `number` | `undefined` | no | Total item count. When set, the Paginator runs in data-driven mode and renders its own controls. |
| `pageSize` | `number` | `10` | no | Rows per page (data-driven mode). Supports `v-model:page-size`. |
| `pageSizeOptions` | `number[]` | `[10, 25, 50, 100]` | no | Page-size options offered in the rows-per-page selector. |
| `siblingCount` | `number` | `1` | no | Page numbers shown on each side of the current page before collapsing into an overflow ellipsis. |
| `ariaLabel` | `string` | `'Pagination'` | no | Accessible name for the navigation landmark. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:page` | `[page: number]` | Current page changed in data-driven mode (Previous / Next / page number). Supports `v-model:page`. |
| `update:pageSize` | `[pageSize: number]` | Rows-per-page changed via the internal selector. Supports `v-model:page-size`. |
| `page-change` | `[page: number]` | Convenience action event fired alongside `update:page` whenever the page changes. |

<!-- These events are emitted by the root Paginator only in data-driven mode (when `total` is set). In composition mode the root emits nothing: page changes come from the slotted pagination-button (`click`) and the rows-per-page change from the slotted PaginatorPageSize (`update:modelValue`). -->

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `info` | — | Left region: page-info text (typically PaginatorInfo). In data-driven mode, overrides the default "Showing X to Y of Z entries" text. |
| `default` | — | Center region: pagination navigation buttons (composition mode only — ignored in data-driven mode, where the buttons are rendered internally). |
| `controls` | — | Right region: rows-per-page selector (PaginatorPageSize). In data-driven mode, overrides the internally-rendered selector. |

## States

- Visual states: `default`, `hover`, `active`, `focus-visible`, `selected`, `disabled`
- `data-kind` on PaginationButton: `previous` | `next` | `number` | `more`.
- `data-selected` on PaginationButton mirrors the current-page `selected` prop; `aria-current="page"` set when selected.
- `data-disabled` on PaginationButton mirrors the `disabled` prop; `disabled` attribute and `aria-disabled` set.
- Data-driven mode: `Previous` is disabled on the first page, `Next` on the last; the current page button is `selected` (`aria-current="page"`); the overflow ellipsis (`more`) is non-interactive.

## Motion & Animations

| Trigger | Animation / Transition | Token | Reduced-motion fallback |
|---|---|---|---|
| button hover / active | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| button label typography | `.text-button-lg` |
| info / select typography | `.text-label-sm` |
| surface (default button) | `var(--bg-surface)` |
| surface (current page) | `var(--bg-selected)` |
| surface (hover) | `var(--bg-hover)` |
| surface (active) | `var(--bg-active)` |
| surface (disabled) | `var(--bg-disabled)` |
| text | `var(--text-default)` |
| text muted (info / select) | `var(--text-muted)` |
| text disabled | `var(--text-disabled)` |
| border (current page) | `var(--border-default)` |
| border width | `var(--border-width-default)` |
| gap (numbers group) | `var(--spacing-xxs)` |
| gap / padding (button) | `var(--spacing-xs)` |
| shape (button) | `var(--shape-button)` |
| ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]` on every pagination button.
- Keyboard map: `Tab` moves across buttons and the rows-per-page selector; `Enter`/`Space` activates a button; disabled buttons are skipped.
- ARIA: root `<nav>` with `aria-label` (the `ariaLabel` prop); current-page button sets `aria-current="page"`; disabled buttons set the `disabled` attribute and `aria-disabled`; icon glyphs are `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target ≥40×40 px or a justified deviation (Figma button height is 28px; pad the hit area).

## Stories (Storybook)

- Default — full paginator with page-info text, Previous/numbers/overflow/Next, and a rows-per-page selector.
- Buttons — PaginationButton in every `kind` (`previous` / `next` / `number` / `more`) and state (`default` / `selected` / `disabled`); justified because the button kinds and the current-page (`selected`) and `disabled` treatments are the core sub-component API and are not all visible in the Default story.
- DataDriven — `total`-driven paginator with `v-model:page` / `v-model:page-size` and the `page-change` action; justified because the data-driven mode (internal rendering of info text, windowed page numbers, overflow ellipsis, page-size selector) and its emitted events are a distinct API surface from the slot-composition Default story and cannot be exercised there.

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
- Do not add bespoke Storybook stories beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Stories (Storybook)" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export and the root `package.json` main/module point at `index.ts`, `types` at `index.d.ts`. Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
