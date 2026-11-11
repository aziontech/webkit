# Board

> A configurable dashboard grid: the reader arranges the cards. `Board` owns the layout, an array of `{ id, span, height? }` bound with `v-model:layout`, and lays one `Board.Item` per entry on a column grid that collapses to one column in a narrow container. While `editing`, the `ChartCard` inside each item shows its drag handle and resize corner, and those handles report to the board instead of to the page: drag a card onto another or press the arrow keys on its handle to reorder, drag its corner or press the arrow keys on it to resize. Every move and resize is clamped, written back to the layout and announced in a polite live region. Taken from Cloudscape's board and board item, on top of the existing `ChartCard` handles.

- Import: `import BoardRoot from '@aziontech/webkit/board-root'`
- Compound import (dot notation, not tree-shakeable): `import Board from '@aziontech/webkit/board'`
- Category: layout · Surface: product · Structure: composition
- API as JSON: [board.json](https://github.com/aziontech/webkit/blob/main/.specs/board.json)

## When to use

- A dashboard whose reader chooses the order and the size of its cards, and the product keeps that layout as a preference.
- A grid of cards that must be reorderable from the keyboard and announced to screen readers, not only by mouse.

## Do

- Keep the layout in the page and persist it wherever the product stores preferences; the board never stores it.
- Offer an explicit Edit layout toggle (`aria-pressed`) and turn `editing` on with it, so handles do not crowd the read-only view.
- Give every `Board.Item` a `label` (the card's title): it is the name the live region announces.
- Offer Reset layout once the layout differs from the default.
- Bound the sizes (`min-span`, `max-span`, `min-height`, `max-height`) so no card becomes unreadable.

## Don’t

- A fixed dashboard whose layout the product decides → a plain CSS grid of `chart-card`s (see the `platform/dashboard/analytics-dashboard` block).
- Two or three panes whose boundary the reader drags → use `resizable`.
- Reordering the rows of a list or a table → use the table's reorderable rows or `pick-list`.
- A grid of resources the reader selects, not arranges → use `cards`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- chart-card` — the card each `Board.Item` holds; its `DragHandle` and `ResizeHandle` drive the board.
- [resizable](resizable.md) — split panes with a draggable divider, not a grid of cards.
- [cards](cards.md) — a selectable collection of item cards with a fixed layout.
- [page-header](page-header.md) — the title over the board, with the Edit layout and Reset layout actions beside it.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `columns` | `number` | `12` | false | Columns of the grid in a wide container; one column below `@3xl`. |
| `minSpan` | `number` | `3` | false | Fewest columns an item may span. |
| `maxSpan` | `number` | `12` | false | Most columns an item may span; capped at `columns`. |
| `minHeight` | `number` | `240` | false | Smallest height in pixels a resize allows. |
| `maxHeight` | `number` | `960` | false | Largest height in pixels a resize allows. |
| `editing` | `boolean` | `false` | false | Shows the drag and resize handles of every card and lets the reader rearrange the board. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list of items. Empty uses the locale catalog (`Dashboard`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `item-move` | `{ id: string; from: number; to: number }` | An item moved, by drop or by the keyboard; zero-based. |
| `item-resize` | `{ id: string; span: number; height: number \| undefined }` | A resize ended (pointer up or a resize key on the corner). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | One `Board.Item` per layout entry, in layout order. |

## Sub-component imports

- `@aziontech/webkit/board-item`

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

## v-model

| Model            | Type                | Default | Emits           | Notes                                                                                      |
| ---------------- | ------------------- | ------- | --------------- | ------------------------------------------------------------------------------------------ |
| `v-model:layout` | `BoardLayoutItem[]` | `[]`    | `update:layout` | Order, span and height of every item. The board emits a new array on every move or resize. |

## States

- Visual states: `default`, `editing`; on `Board.Item`: `over` (a dragged item hovers it), and the card's own `dragging` / `resizing`
- `data-editing` on the root mirrors `editing`
- `data-over` on `Board.Item` while it is the drop target
- `data-item-id` on `Board.Item` carries its `itemId`

## Accessibility

- Visible focus: the board adds no focus stop; the `ChartCard` handles carry `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: on a card's drag handle, `ArrowUp` / `ArrowLeft` move the item one place earlier and `ArrowDown` / `ArrowRight` one place later (mirrored under `rtl`); focus stays on the moved handle. On the resize corner, `ArrowLeft` / `ArrowRight` change the span by one column, `ArrowUp` / `ArrowDown` the height by 24 px, `Home` / `End` jump to the span bounds, `Escape` cancels a pointer resize.
- ARIA: the grid is a `<ul role="list">` named by `ariaLabel`; each item is an `<li>`. A visually hidden `<p aria-live="polite" aria-atomic="true">` announces each move (`<label> moved to position 2 of 6.`) and each resize (`<label> resized to 6 of 12 columns.`).
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): the board renders no ink of its own; the drop ring uses `--ring-color`.
- `motion-reduce:transition-none` on the drop ring transition.
- Touch target: the handles are the card's; dragging is a pointer gesture with the keyboard as its alternative.

## Right-to-left

- Layout: logical utilities only; the grid flows from the inline start, so the first item sits on the right under `rtl`.
- Icons: none of its own.
- Keyboard: the card's handles read arrows logically, so under `rtl` `ArrowLeft` moves an item later and widens it.
- User data: none.

## Internationalization

| Key                       | English source                                                        | Override prop      |
| ------------------------- | --------------------------------------------------------------------- | ------------------ |
| `board.label`             | Dashboard                                                             | `ariaLabel`        |
| `board.item`              | Item {position}                                                       | `Board.Item label` |
| `board.moved`             | {label} moved to position {position} of {total}.                      | —                  |
| `board.resized`           | {label} resized to {span} of {columns} columns.                       | —                  |
| `board.resizedWithHeight` | {label} resized to {span} of {columns} columns, {height} pixels tall. | —                  |

- Formatting: none; numbers are integers placed in the messages.

## Responsive

- Container queries: `@container/board`; one column below `@3xl` (48rem), `columns` from `@3xl`. An item spans `min(span, current columns)`.
- Narrow (≤ 640 px or a narrow container): one card a row at full width; reordering still works, span changes take effect once the board is wide again.
- Touch: dragging needs a pointer; the keyboard map is the alternative.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import Board from '@aziontech/webkit/board'
  import ChartCard from '@aziontech/webkit/chart-card'
  import StatTile from '@aziontech/webkit/stat-tile'
  import { ref } from 'vue'

  const tiles = {
    requests: {
      title: 'Requests',
      value: 24910000,
      unit: '',
      delta: 4.2,
      inverse: false,
      trend: [1.9, 1.8, 1.9, 1.6, 1.8, 1.7, 2.2, 2.2, 2.3, 2.4, 2.5, 2.3]
    },
    bandwidth: {
      title: 'Data transferred',
      value: 1.2,
      unit: 'TB',
      delta: 1.8,
      inverse: false,
      trend: [7.5, 8.7, 8.9, 10.2, 10.5, 10.6, 10, 9.8, 10.4, 8.6, 7.4, 8]
    },
    errors: {
      title: 'Error rate',
      value: 0.41,
      unit: '%',
      delta: -0.3,
      inverse: true,
      trend: [0.5, 0.48, 0.52, 0.47, 0.45, 0.44, 0.46, 0.43, 0.42, 0.44, 0.41, 0.41]
    },
    latency: {
      title: 'Response time p95',
      value: 182,
      unit: 'ms',
      delta: -3.2,
      inverse: true,
      trend: [166, 167, 151, 172, 200, 191, 205, 208, 205, 182, 165, 175]
    }
  }

  const layout = ref([
    { id: 'requests', span: 6 },
    { id: 'bandwidth', span: 6 },
    { id: 'errors', span: 4 },
    { id: 'latency', span: 8 }
  ])
</script>

<template>
  <Board v-model:layout="layout">
    <Board.Item
      v-for="item in layout"
      :key="item.id"
      :item-id="item.id"
      :label="tiles[item.id].title"
    >
      <ChartCard :aria-label="tiles[item.id].title">
        <ChartCard.Content>
          <StatTile
            :label="tiles[item.id].title"
            :value="tiles[item.id].value"
            :unit="tiles[item.id].unit"
            :delta="tiles[item.id].delta"
            delta-label="vs previous 24 hours"
            :inverse="tiles[item.id].inverse"
            :trend="tiles[item.id].trend"
          />
        </ChartCard.Content>
      </ChartCard>
    </Board.Item>
  </Board>
</template>
```

### Editing

```vue
<script setup>
  import Board from '@aziontech/webkit/board'
  import Button from '@aziontech/webkit/button'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  const labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00']

  const cards = {
    requests: {
      title: 'Requests',
      series: [{ id: 'requests', name: 'Requests', values: [1820, 1640, 2210, 2480, 2390, 2050] }]
    },
    errors: {
      title: 'Errors',
      series: [{ id: 'errors', name: 'Errors', values: [42, 38, 61, 57, 49, 44] }]
    },
    latency: {
      title: 'Response time',
      series: [{ id: 'p95', name: 'p95', values: [166, 172, 205, 208, 182, 175] }]
    }
  }

  const defaultLayout = [
    { id: 'requests', span: 12 },
    { id: 'errors', span: 6 },
    { id: 'latency', span: 6 }
  ]

  const editing = ref(true)
  const layout = ref(defaultLayout.map((item) => ({ ...item })))
  const customized = computed(() => JSON.stringify(layout.value) !== JSON.stringify(defaultLayout))

  const reset = () => {
    layout.value = defaultLayout.map((item) => ({ ...item }))
  }
</script>

<template>
  <div class="flex w-full min-w-0 flex-col gap-(--spacing-md)">
    <div class="flex flex-wrap items-center justify-end gap-(--spacing-xs)">
      <Button
        v-if="customized"
        label="Reset layout"
        kind="transparent"
        size="medium"
        icon="pi pi-replay"
        @click="reset"
      />
      <Button
        :label="editing ? 'Done' : 'Edit layout'"
        :kind="editing ? 'primary' : 'outlined'"
        size="medium"
        :icon="editing ? 'pi pi-check' : 'pi pi-th-large'"
        :aria-pressed="editing"
        @click="editing = !editing"
      />
    </div>
    <Board
      v-model:layout="layout"
      :editing="editing"
      :min-span="4"
      :min-height="240"
      :max-height="560"
    >
      <Board.Item
        v-for="item in layout"
        :key="item.id"
        :item-id="item.id"
        :label="cards[item.id].title"
      >
        <ChartCard>
          <ChartCard.Header>
            <ChartCard.DragHandle :aria-label="'Move ' + cards[item.id].title" />
            <ChartCard.Title>{{ cards[item.id].title }}</ChartCard.Title>
            <ChartCard.Controls v-if="editing">
              <Tag
                :label="item.span + '/12'"
                severity="secondary"
                size="small"
                icon="pi pi-arrows-h"
              />
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Chart
              :series="cards[item.id].series"
              :labels="labels"
            >
              <Chart.Grid />
              <Chart.Axis kind="y" />
              <Chart.Axis kind="x" />
              <Chart.Line />
              <Chart.Tooltip />
            </Chart>
          </ChartCard.Content>
          <ChartCard.ResizeHandle :aria-label="'Resize ' + cards[item.id].title" />
        </ChartCard>
      </Board.Item>
    </Board>
  </div>
</template>
```
