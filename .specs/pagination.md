---
name: pagination
category: data
structure: composition
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=483-929
  node_id: 483:929
checksum: aab78d9938a910682bf899d31061d5da4d3bc07d3307b861f118b053eee8e323
created: 2026-06-16
last_updated: 2026-11-12
---

# Pagination — Component Spec

## Purpose

Pagination controls for tables and lists, pixel-perfect to Figma, in two modes. **Composition mode** (default): a three-region landmark — page-info text, navigation buttons (Previous / page numbers / overflow / Next), and a rows-per-page selector — wired by hand through slots, with the consumer owning the current page, total, and page-size state. **Data-driven mode**: pass `total` (and optionally `page` / `pageSize`) and the Pagination renders its own info text, Previous / windowed page numbers / overflow ellipsis / Next, and the rows-per-page selector, emitting `update:page` / `update:pageSize` so the consumer can bind state via `v-model`. This component owns markup, tokens, and a11y; the data engine is a small internal page-window calculation — **no external pagination library**. Pairs with the [`Table`](./table.md) component.

## When to use

- A list or table outside `table`'s own footer needs page navigation and a rows-per-page selector.
- You know the item count — pass `total` and bind `v-model:page` / `v-model:page-size`; the component renders the info text, the windowed page numbers and the selector.
- The page strip needs custom content (a different info line, extra controls) — compose `Pagination.Info`, `Pagination.Button` and `Pagination.PageSize` through the slots.

## When NOT to use

- The rows live in a data-driven `table` → set `paginated` on the table; it renders this pagination in its footer and wires it for you.
- It is the previous / next pair at the end of a documentation page → use `doc-pagination`.
- The content loads more as the reader scrolls or clicks "Load more" → use a `button` at the end of the list.

## Related

- `table` — renders a wired pagination in its footer when `paginated` is set.
- `doc-pagination` — previous / next links between documentation pages, not numbered pages of a list.

## Best practices

- Prefer data-driven mode (`total` set); in composition mode the root emits nothing and you own every button's `selected` / `disabled` state and every click.
- `page` is 1-based. Changing the page size through the selector emits `update:pageSize` and resets the page to `1`.
- Keep `page-size-options` aligned with what your data source accepts; the default is `[10, 25, 50, 100]`.
- Tune `sibling-count` (default `1`) instead of hiding buttons — it controls how many numbers sit on each side of the current page before the overflow ellipsis.
- Set `aria-label` when a page carries more than one pagination, so each navigation landmark has a distinct name.

## Usage

Composition mode — one import of the root; every part is reached via dot-notation (`<Pagination.Button>`, `<Pagination.Info>`, `<Pagination.PageSize>`). The root binding must be PascalCase (`Pagination`).

```vue
<script setup>
  import Pagination from '@aziontech/webkit/pagination'
</script>

<template>
  <Pagination>
    <template #info>
      <Pagination.Info>Showing 1 to 10 of 20 entries</Pagination.Info>
    </template>

    <Pagination.Button
      kind="previous"
      disabled
    />
    <Pagination.Button
      kind="number"
      selected
      >1</Pagination.Button
    >
    <Pagination.Button kind="number">2</Pagination.Button>
    <Pagination.Button kind="number">3</Pagination.Button>
    <Pagination.Button kind="more" />
    <Pagination.Button kind="next" />

    <template #controls>
      <Pagination.PageSize
        :model-value="10"
        :options="[10, 25, 50, 100]"
      />
    </template>
  </Pagination>
</template>
```

Each sub-component is also a standalone import (`import PaginationButton from '@aziontech/webkit/pagination-button'`, …) — the tree-shaking path.

Data-driven mode — pass `total` and bind state; the Pagination renders the controls and emits the page/page-size changes:

```vue
<script setup>
  import { ref } from 'vue'
  import Pagination from '@aziontech/webkit/pagination'

  const page = ref(1)
  const pageSize = ref(10)
</script>

<template>
  <Pagination
    v-model:page="page"
    v-model:page-size="pageSize"
    :total="200"
    :page-size-options="[10, 25, 50, 100]"
  />
</template>
```

## Sub-components

<!-- Each sub-component lives in its own folder under the root.
     The shared injection-key.ts sits one directory up from each sub-component.
     Per-sub-component props/events are listed here (the root Props/Events/Slots tables
     below describe ONLY the root Pagination element).
     Compound API: index.ts (Object.assign; vue-tsc emits the adjacent index.d.ts at publish time) attaches the sub-components
     to the root as `Pagination.Button` (PaginationButton) / `Pagination.Info` / `Pagination.PageSize`
     (PascalCase root required). No per-component package.json — the root packages/webkit/package.json#exports
     map points each public path directly at its source file. See `.claude/rules/compound-api.md`. -->

- `pagination-button/pagination-button.vue` — one segment of the numbers strip, 28px tall with a 28px minimum width and no horizontal padding; it carries no radius of its own except the outer corners at the two ends of the strip (`var(--shape-elements)`). Props `kind?: 'previous' | 'next' | 'number' | 'more'`, `selected?: boolean` (current-page treatment), `disabled?: boolean`. Emits `click: [event: MouseEvent]`. `previous` renders `pi pi-chevron-left`; `next` renders `pi pi-chevron-right`; `more` renders `pi pi-ellipsis-h`; only `number` renders the default slot — `previous` / `next` are icon-only and take their accessible name from `aria-label`; `more` renders as an inert `span` with `aria-hidden="true"` (not focusable, no state layers, never emits `click`). `number` and `more` carry `var(--bg-surface)`; `previous` and `next` have no surface of their own and read against the strip. Hover/active use the DESIGN.md ghost-layer surfaces and are mutually exclusive (pressing replaces the hover layer rather than stacking on it); `selected` uses `var(--bg-selected)` + border; `disabled` keeps the kind's own surface and mutes the foreground to `var(--text-disabled)`.
- `pagination-info/pagination-info.vue` — muted page-info text container (default slot), `.text-body-xs` / `var(--text-muted)`.
- `pagination-page-size/pagination-page-size.vue` — rows-per-page selector (native `<select>`), 64×28 (same height as the numbers strip), `var(--shape-elements)` radius, `var(--bg-canvas)` frame over a `var(--bg-surface)` field with `var(--border-default)` border, value `.text-label-sm` muted, `pi pi-chevron-down`. Props `modelValue?: number`, `options?: number[]` (default `[10, 25, 50, 100]`). Emits `update:modelValue: [value: number]`. Placed in the Pagination `controls` slot.

<!-- Resulting layout:

  packages/webkit/src/components/data/pagination/
  ├── pagination.vue
  ├── index.ts              (compound: Object.assign attaches sub-components; vue-tsc emits index.d.ts at publish)
  ├── injection-key.ts
  ├── pagination-button/    { pagination-button.vue }
  ├── pagination-info/       { pagination-info.vue }
  └── pagination-page-size/  { pagination-page-size.vue }

  No per-component package.json. Public exports stay flat: ./pagination (→ index.ts), ./pagination-button, ./pagination-info, ./pagination-page-size -->

## Props

<!-- Root <Pagination> element only. Sub-component props are listed in the Sub-components section. -->

| Prop              | Type       | Default             | Required | JSDoc                                                                                             |
| ----------------- | ---------- | ------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `page`            | `number`   | `1`                 | false    | Current page, 1-based (data-driven mode). Supports `v-model:page`.                                |
| `total`           | `number`   | `undefined`         | false    | Total item count. When set, the Pagination runs in data-driven mode and renders its own controls. |
| `pageSize`        | `number`   | `10`                | false    | Rows per page (data-driven mode). Supports `v-model:page-size`.                                   |
| `pageSizeOptions` | `number[]` | `[10, 25, 50, 100]` | false    | Page-size options offered in the rows-per-page selector.                                          |
| `siblingCount`    | `number`   | `1`                 | false    | Page numbers shown on each side of the current page before collapsing into an overflow ellipsis.  |
| `ariaLabel`       | `string`   | `''`                | false    | Accessible name for the navigation landmark. Empty uses the locale catalog (`Pagination`).        |

## Events

| Event             | Payload              | Notes                                                                                              |
| ----------------- | -------------------- | -------------------------------------------------------------------------------------------------- |
| `update:page`     | `[page: number]`     | Current page changed in data-driven mode (Previous / Next / page number). Supports `v-model:page`. |
| `update:pageSize` | `[pageSize: number]` | Rows-per-page changed via the internal selector. Supports `v-model:page-size`.                     |

<!-- These events are emitted by the root Pagination only in data-driven mode (when `total` is set). In composition mode the root emits nothing: page changes come from the slotted pagination-button (`click`) and the rows-per-page change from the slotted PaginatorPageSize (`update:modelValue`). -->

## Slots

| Slot       | Scope | Notes                                                                                                                                          |
| ---------- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `info`     | —     | Left region: page-info text (typically PaginatorInfo). In data-driven mode, overrides the default "Showing X to Y of Z entries" text.          |
| `default`  | —     | Center region: pagination navigation buttons (composition mode only — ignored in data-driven mode, where the buttons are rendered internally). |
| `controls` | —     | Right region: rows-per-page selector (PaginatorPageSize). In data-driven mode, overrides the internally-rendered selector.                     |

## States

- Visual states: `default`, `hover`, `active`, `focus-visible`, `selected`, `disabled`
- The page buttons render as one **segmented strip**: a single container carrying the `var(--border-default)` border and the `var(--shape-elements)` radius, with the buttons butted against each other at zero gap. Only the two end buttons round their outer corners.
- `data-kind` on PaginationButton: `previous` | `next` | `number` | `more`. `number` and `more` carry `var(--bg-surface)`; `previous` and `next` have no surface of their own.
- `hover` and `active` are mutually exclusive: pressing a button drops the hover layer and shows the `var(--bg-active)` layer alone, so the pressed surface reads one step below hover.
- `data-selected` on PaginationButton mirrors the current-page `selected` prop; `aria-current="page"` set when selected.
- `data-disabled` on PaginationButton mirrors the `disabled` prop; `disabled` attribute and `aria-disabled` set.
- Data-driven mode: `Previous` is disabled on the first page, `Next` on the last; the current page button is `selected` (`aria-current="page"`); the overflow ellipsis (`more`) is non-interactive: an `aria-hidden` `span`, out of the tab order, that emits nothing.
- Responsive: the root is the `@container/pagination`. The page list stays whole at every width (`siblingCount` already caps it at seven slots, e.g. `1 2 3 4 5 … 60`), so a phone footer reads the same numbered strip as a desktop one, as in the design sample; when the box is too narrow for the info text and the controls on one line, the strip and the page-size control wrap together under the info text, aligned to the end.
- Touch: the buttons and the page-size select are drawn at 28 px on every pointer. On a coarse pointer (`pointer-coarse:`) each button carries an invisible, `aria-hidden` hit area that extends it to 44 px tall (vertical only: the buttons are butted, so the width stays the drawn 28 px), and the select itself grows to 44 px tall inside its 28 px frame, which draws the border, surface and focus ring.

## Motion & Animations

| Trigger               | Animation / Transition                    | Token  | Reduced-motion fallback         |
| --------------------- | ----------------------------------------- | ------ | ------------------------------- |
| button hover / active | `transition-colors duration-150 ease-out` | inline | `motion-reduce:transition-none` |

## Tokens

| Region                                         | Token (DESIGN.md)             |
| ---------------------------------------------- | ----------------------------- |
| button label typography                        | `.text-button-lg`             |
| info typography                                | `.text-body-xs`               |
| select typography                              | `.text-label-sm`              |
| surface (number / overflow button)             | `var(--bg-surface)`           |
| surface (current page)                         | `var(--bg-selected)`          |
| surface (hover)                                | `var(--bg-hover)`             |
| surface (active)                               | `var(--bg-active)`            |
| text                                           | `var(--text-default)`         |
| text muted (info / select)                     | `var(--text-muted)`           |
| text disabled                                  | `var(--text-disabled)`        |
| border (numbers strip / current page / select) | `var(--border-default)`       |
| border width                                   | `var(--border-width-default)` |
| gap (inside the numbers strip)                 | `0`                           |
| gap (strip to rows-per-page)                   | `var(--spacing-xs)`           |
| gap (button content)                           | `var(--spacing-xs)`           |
| shape (numbers strip / select)                 | `var(--shape-elements)`       |
| ring                                           | `var(--ring-color)`           |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on every pagination button.
- Keyboard map: `Tab` moves across buttons and the rows-per-page selector; `Enter`/`Space` activates a button; disabled buttons and the overflow ellipsis are skipped. In data-driven mode, `ArrowRight`/`ArrowLeft` inside the button group go to the next/previous page, swapped under `dir="rtl"` (`useDirection`).
- ARIA: root `<nav>` with `aria-label` (the `ariaLabel` prop); current-page button sets `aria-current="page"`; disabled buttons set the `disabled` attribute and `aria-disabled`; icon glyphs and the overflow ellipsis are `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the disabled state.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target: each button is drawn 28×28 (above the 24×24 minimum of WCAG 2.5.8) so the strip stays compact in a table footer; on a coarse pointer its hit area grows to 28×44 invisibly and the page-size select's to its full width × 44. The width cannot grow because the buttons are butted with no gap; growing the drawn size instead was rejected because it turned the phone footer into an oversized strip that no longer matched the design sample.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the previous/next chevrons mirror (`rtl:-scale-x-100`).
- Keyboard: in data-driven mode `ArrowRight`/`ArrowLeft` go to the next/previous page, swapped under `dir="rtl"` (`logicalArrowKey`).
- User data: none.

## Examples

- Default — full pagination with page-info text, Previous/numbers/overflow/Next, and a rows-per-page selector.
- Buttons — PaginationButton in every `kind` (`previous` / `next` / `number` / `more`) and state (`default` / `selected` / `disabled`); justified because the button kinds and the current-page (`selected`) and `disabled` treatments are the core sub-component API and are not all visible in the Default story.
- DataDriven — `total`-driven pagination with `v-model:page` / `v-model:page-size`; justified because the data-driven mode (internal rendering of info text, windowed page numbers, overflow ellipsis, page-size selector) and its emitted events are a distinct API surface from the slot-composition Default story and cannot be exercised there.

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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export and the root `package.json` main/module point at `index.ts`, `types` at `index.d.ts`. Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
