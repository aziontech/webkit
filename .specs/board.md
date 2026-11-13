---
name: board
category: layout
structure: composition
status: implemented
spec_version: 1
template: 2
checksum: 6a05a776f49e1e7e6f38b8415fd1e9884bd247f6bb1a7dc6d8977c7f28310c5c
created: 2026-11-11
last_updated: 2026-11-12
---

# Board — Component Spec

## Purpose

A configurable dashboard grid: the reader arranges the cards. `Board` owns the layout, an array of
`{ id, span, height? }` bound with `v-model:layout`, and lays one `Board.Item` per entry on a
column grid that collapses to one column in a narrow container. While `editing`, the `ChartCard`
inside each item shows its drag handle and resize corner, and those handles report to the board
instead of to the page: drag a card onto another or press the arrow keys on its handle to reorder,
drag its corner or press the arrow keys on it to resize. Every move and resize is clamped, written
back to the layout and announced in a polite live region. Taken from Cloudscape's board and board
item, on top of the existing `ChartCard` handles.

## When to use

- A dashboard whose reader chooses the order and the size of its cards, and the product keeps that layout as a preference.
- A grid of cards that must be reorderable from the keyboard and announced to screen readers, not only by mouse.

## When NOT to use

- A fixed dashboard whose layout the product decides → a plain CSS grid of `chart-card`s (see the `platform/dashboard/analytics-dashboard` block).
- Two or three panes whose boundary the reader drags → use `resizable`.
- Reordering the rows of a list or a table → use the table's reorderable rows or `pick-list`.
- A grid of resources the reader selects, not arranges → use `cards`.

## Related

- `chart-card` — the card each `Board.Item` holds; its `DragHandle` and `ResizeHandle` drive the board.
- `resizable` — split panes with a draggable divider, not a grid of cards.
- `cards` — a selectable collection of item cards with a fixed layout.
- `page-header` — the title over the board, with the Edit layout and Reset layout actions beside it.

## Best practices

- Keep the layout in the page and persist it wherever the product stores preferences; the board never stores it.
- Offer an explicit Edit layout toggle (`aria-pressed`) and turn `editing` on with it, so handles do not crowd the read-only view.
- Give every `Board.Item` a `label` (the card's title): it is the name the live region announces.
- Offer Reset layout once the layout differs from the default.
- Bound the sizes (`min-span`, `max-span`, `min-height`, `max-height`) so no card becomes unreadable.

## Usage

```vue
<script setup>
  import Board from '@aziontech/webkit/board'
  import ChartCard from '@aziontech/webkit/chart-card'
  import { ref } from 'vue'

  const editing = ref(true)
  const layout = ref([
    { id: 'requests', span: 8 },
    { id: 'regions', span: 4 }
  ])
  const titles = { requests: 'Requests over time', regions: 'Requests by region' }
</script>

<template>
  <Board
    v-model:layout="layout"
    :editing="editing"
    :min-span="3"
  >
    <Board.Item
      v-for="item in layout"
      :key="item.id"
      :item-id="item.id"
      :label="titles[item.id]"
    >
      <ChartCard>
        <ChartCard.Header>
          <ChartCard.DragHandle :aria-label="'Move ' + titles[item.id]" />
          <ChartCard.Title>{{ titles[item.id] }}</ChartCard.Title>
        </ChartCard.Header>
        <ChartCard.Content>…</ChartCard.Content>
        <ChartCard.ResizeHandle :aria-label="'Resize ' + titles[item.id]" />
      </ChartCard>
    </Board.Item>
  </Board>
</template>
```

Tree-shaking alternative — the standalone root and the item from their own entries:

```vue
<script setup>
  import Board from '@aziontech/webkit/board-root'
  import BoardItem from '@aziontech/webkit/board-item'
</script>
```

## Sub-components

The root ships a compound API: `index.ts` attaches `Item` to the root. The board provides its
context (`injection-key.ts`) to every `Board.Item`, and each item provides a narrower item context
that `ChartCard` reads when it renders inside one: the card's `draggable` and `resizable` follow the
board's `editing`, its span, height and bounds come from the layout entry, and its handles' moves,
drags and resizes go to the board. `ChartCard` keeps working on its own outside a board.

- `board-item/board-item.vue` — One cell of the grid, an `<li>` that spans the entry's columns (capped at the grid's current column count) and, when the entry has a `height`, that many pixels. It is the drop target while another item is dragged (`data-over` while hovered), registers its `label` for announcements, and returns focus to the handle that moved it.
  - Props: `itemId: string` (required — the `id` of its layout entry), `label?: string` (default `''` — the name the live region announces; empty uses `Item <position>` from the locale catalog).
  - Slot: `default` — the item's content, normally one `ChartCard`.
  - `data-testid` fallback: `layout-board-item`.

Resulting layout:

```
packages/webkit/src/components/layout/board/
├── board.vue
├── board.test.ts
├── index.ts
├── injection-key.ts          (BoardContext, BoardItemContext, BoardLayoutItem)
├── composables/
│   └── use-board-context.ts  (injects; throws outside a Board)
└── board-item/
    └── board-item.vue
```

Exports:

```jsonc
"./board": "./src/components/layout/board/index.ts",
"./board-root": "./src/components/layout/board/board.vue",
"./board-item": "./src/components/layout/board/board-item/board-item.vue"
```

Exported types: `BoardLayoutItem = { id: string; span: number; height?: number }`,
`BoardMoveDirection = 'up' | 'down' | 'left' | 'right'`.

## Props

| Prop        | Type      | Default | Required | JSDoc                                                                                    |
| ----------- | --------- | ------- | -------- | ---------------------------------------------------------------------------------------- |
| `columns`   | `number`  | `12`    | false    | Columns of the grid in a wide container; one column below `@3xl`.                        |
| `minSpan`   | `number`  | `3`     | false    | Fewest columns an item may span.                                                         |
| `maxSpan`   | `number`  | `12`    | false    | Most columns an item may span; capped at `columns`.                                      |
| `minHeight` | `number`  | `240`   | false    | Smallest height in pixels a resize allows.                                               |
| `maxHeight` | `number`  | `960`   | false    | Largest height in pixels a resize allows.                                                |
| `editing`   | `boolean` | `false` | false    | Shows the drag and resize handles of every card and lets the reader rearrange the board. |
| `ariaLabel` | `string`  | `''`    | false    | Accessible name of the list of items. Empty uses the locale catalog (`Dashboard`).       |

## v-model

| Model            | Type                | Default | Emits           | Notes                                                                                      |
| ---------------- | ------------------- | ------- | --------------- | ------------------------------------------------------------------------------------------ |
| `v-model:layout` | `BoardLayoutItem[]` | `[]`    | `update:layout` | Order, span and height of every item. The board emits a new array on every move or resize. |

## Events

| Event         | Payload                                                     | Notes                                                      |
| ------------- | ----------------------------------------------------------- | ---------------------------------------------------------- |
| `item-move`   | `{ id: string; from: number; to: number }`                  | An item moved, by drop or by the keyboard; zero-based.     |
| `item-resize` | `{ id: string; span: number; height: number \| undefined }` | A resize ended (pointer up or a resize key on the corner). |

## Slots

| Slot      | Scope | Notes                                               |
| --------- | ----- | --------------------------------------------------- |
| `default` | —     | One `Board.Item` per layout entry, in layout order. |

## States

- Visual states: `default`, `editing`; on `Board.Item`: `over` (a dragged item hovers it), and the card's own `dragging` / `resizing`
- `data-editing` on the root mirrors `editing`
- `data-over` on `Board.Item` while it is the drop target
- `data-item-id` on `Board.Item` carries its `itemId`

## Motion & Animations

| Trigger                 | Animation / Transition                      | Token                                                    | Reduced-motion fallback         |
| ----------------------- | ------------------------------------------- | -------------------------------------------------------- | ------------------------------- |
| drop target highlighted | `transition-shadow` on the item's ring      | inline · `duration-fast-02` · `ease-productive-entrance` | `motion-reduce:transition-none` |
| card dragged            | `ChartCard` owns its own opacity transition | component                                                | handled by `ChartCard`          |

## Tokens

| Region            | Token (DESIGN.md)   |
| ----------------- | ------------------- |
| gap between items | `var(--spacing-md)` |
| drop target ring  | `var(--ring-color)` |
| drop target shape | `var(--shape-card)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| —              | —                   | none      |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the board adds no focus stop; the `ChartCard` handles carry `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: on a card's drag handle, `ArrowUp` / `ArrowLeft` move the item one place earlier and `ArrowDown` / `ArrowRight` one place later (mirrored under `rtl`); focus stays on the moved handle. On the resize corner, `ArrowLeft` / `ArrowRight` change the span by one column, `ArrowUp` / `ArrowDown` the height by 24 px, `Home` / `End` jump to the span bounds, `Escape` cancels a pointer resize.
- ARIA: the grid is a `<ul role="list">` named by `ariaLabel`; each item is an `<li>`. A visually hidden `<p aria-live="polite" aria-atomic="true">` announces each move (`<label> moved to position 2 of 6.`) and each resize (`<label> resized to 6 of 12 columns.`).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the board renders no ink of its own; the drop ring uses `--ring-color`.
- `motion-reduce:transition-none` on the drop ring transition.
- Touch target: the handles are the card's; dragging is a pointer gesture with the keyboard as its alternative.

## Internationalization

| Key                       | English source                                                        | Override prop      |
| ------------------------- | --------------------------------------------------------------------- | ------------------ |
| `board.label`             | Dashboard                                                             | `ariaLabel`        |
| `board.item`              | Item {position}                                                       | `Board.Item label` |
| `board.moved`             | {label} moved to position {position} of {total}.                      | —                  |
| `board.resized`           | {label} resized to {span} of {columns} columns.                       | —                  |
| `board.resizedWithHeight` | {label} resized to {span} of {columns} columns, {height} pixels tall. | —                  |

- Formatting: none; numbers are integers placed in the messages.

## Right-to-left

- Layout: logical utilities only; the grid flows from the inline start, so the first item sits on the right under `rtl`.
- Icons: none of its own.
- Keyboard: the card's handles read arrows logically, so under `rtl` `ArrowLeft` moves an item later and widens it.
- User data: none.

## Responsive

- Container queries: `@container/board`; one column below `@3xl` (876 px), `columns` from `@3xl`. An item spans `min(span, current columns)`.
- Narrow (≤ 640 px or a narrow container): one card a row at full width; reordering still works, span changes take effect once the board is wide again.
- Touch: dragging needs a pointer; the keyboard map is the alternative.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: 2.2 KB gzip for `./board` (root and item) in `.size-limit.json`.
- Runtime budget: a move or resize re-renders only the board; 24 items reorder within one frame.
- Heavy parts: none.

## Examples

- Default — six cards on a 12-column board, read-only.
- Editing — the same board with `editing` on; the args delta is `editing` only.

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
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
