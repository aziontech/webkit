# Chart Card

> The box a dashboard chart lives in: a header with the title, the description and a controls zone, a content area padded or flush, an optional footer, and two optional handles that let the person move the card and resize it on a dashboard grid. The span (grid columns) and height are two-way models applied through custom properties, so the consumer's grid lays cards out with no script, and the reorder state stays with the page that owns the grid.

- Import: `import ChartCardRoot from '@aziontech/webkit/chart-card-root'`
- Compound import (dot notation, not tree-shakeable): `import ChartCard from '@aziontech/webkit/chart-card'`
- Category: chart · Surface: product · Structure: composition
- API as JSON: [chart-card.json](https://github.com/aziontech/webkit/blob/main/.specs/chart-card.json)

## When to use

- Every chart on a metrics dashboard, so title, description, menu and size read the same everywhere.
- A dashboard the person arranges: drag a card to reorder it, drag a corner to make it wider or taller.

## Do

- Put the aggregation tag (Sum, Average) and the variation tag in `ChartCard.Controls`, before the menu.
- Keep filters and the time range above the grid, never inside a card.
- Use `flush` content for a plot that should run edge to edge, padded for everything else.
- Give the page's grid `--chart-grid-columns` per breakpoint so a 6-column card never overflows a 1-column phone layout.
- Persist `span` and `height` with the dashboard layout; they are plain numbers.

## Don’t

- A KPI figure → use `stat-tile`, which is its own surface.
- A general content card with no chart → use `card`.
- A chart inline in a page section with its own heading → render `chart` alone.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [chart](chart.md), `donut-chart` — what goes inside the content area; a chart inside a card takes its accessible name from the card title.
- [card](card.md) — the general-purpose card; ChartCard shares its surface tokens.
- dropdown` — the "More options" menu (Copy query, Export CSV) composed into the controls zone.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `draggable` | `boolean` | `false` | false | Shows the drag handle and lets the card be dragged to a new position. |
| `resizable` | `boolean` | `false` | false | Shows the resize handle. |
| `minSpan` | `number` | `3` | false | Fewest grid columns the card may span. |
| `maxSpan` | `number` | `12` | false | Most grid columns the card may span. |
| `minHeight` | `number` | `240` | false | Smallest height in pixels the resize handle allows. |
| `maxHeight` | `number` | `960` | false | Largest height in pixels the resize handle allows. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the card when it has no title. |
| `span` | `number` | `6` | false | Two-way value (`v-model:span`). |
| `height` | `number \| undefined` | `undefined` | false | Two-way value (`v-model:height`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `move` | `(event: KeyboardEvent, direction: 'up' \| 'down' \| 'left' \| 'right')` | An arrow key on the drag handle; the page moves the card in its own order. |
| `drag-start` | `(event: DragEvent)` | Native drag began from the handle; the page records the source. |
| `drag-end` | `(event: DragEvent)` | Native drag ended, dropped or cancelled. |
| `resize-start` | `(event: PointerEvent)` | A pointer resize began on the handle. |
| `resize-end` | `(event: PointerEvent \| KeyboardEvent)` | A resize finished: pointer released, or a keyboard nudge committed. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The parts: Header, Description, Content, Footer, ResizeHandle. |

## Sub-component imports

- `@aziontech/webkit/chart-card-content`
- `@aziontech/webkit/chart-card-controls`
- `@aziontech/webkit/chart-card-description`
- `@aziontech/webkit/chart-card-drag-handle`
- `@aziontech/webkit/chart-card-footer`
- `@aziontech/webkit/chart-card-header`
- `@aziontech/webkit/chart-card-resize-handle`
- `@aziontech/webkit/chart-card-title`

## Sub-components

The root `chart-card.vue` renders a `<section>` with the card surface. It provides a context (`injection-key.ts` + `composables/use-chart-card-context.ts`) holding the test id, the title and description ids (picked up by a nested `chart` for `aria-labelledby` / `aria-describedby`), `draggable`, `resizable`, the span and height bounds, the current span and height, and the functions `armDrag`, `move`, `startResize`, `resizeTo` and `endResize`. Every part throws a clear error when used outside `<ChartCard>`.

- `chart-card.vue` — the root: surface, span and height models, native drag arming, resize bookkeeping.
- `chart-card-header/chart-card-header.vue` — the header row, at least 56px tall, hairline under it.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — handle, title and controls in reading order.
- `chart-card-title/chart-card-title.vue` — the title (`.text-label-md`), an `<h3>` whose id names the card and the chart inside.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — plain-text title.
- `chart-card-description/chart-card-description.vue` — one line of context under the header (`.text-body-sm`, `var(--text-muted)`), whose id describes the chart inside.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — plain-text description.
- `chart-card-controls/chart-card-controls.vue` — the trailing zone of the header for tags and the options menu.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — the consumer's tags, buttons and dropdown.
- `chart-card-drag-handle/chart-card-drag-handle.vue` — a grip button that arms native drag on the card while pressed; arrow keys emit the root's `move`. Renders nothing unless the root is `draggable`.
  - Props: `ariaLabel?: string` (default `''`; empty uses the locale catalog, `Move card` in English).
  - Events: _none_ (flows through the root's `move`, `drag-start`, `drag-end`).
  - Slots: _none_.
- `chart-card-content/chart-card-content.vue` — the body; fills the remaining height.
  - Props: `flush?: boolean` (default `false` — no inner padding, for an edge-to-edge plot).
  - Events: _none_.
  - Slots: `default` — the chart.
- `chart-card-footer/chart-card-footer.vue` — an optional row under the content, hairline above it.
  - Props: _none_.
  - Events: _none_.
  - Slots: `default` — period, source, or a link.
- `chart-card-resize-handle/chart-card-resize-handle.vue` — the corner grip that resizes the card: pointer drag with pointer capture, arrow keys from the keyboard. A `role="separator"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax` on the span and `aria-valuetext` naming columns and height. Renders nothing unless the root is `resizable`.
  - Props: `ariaLabel?: string` (default `''`; empty uses the locale catalog, `Resize card` in English).
  - Events: _none_ (flows through the root's `update:span`, `update:height`, `resize-start`, `resize-end`).
  - Slots: _none_.

## v-model

| Model            | Type                  | Default     | Emits           | Notes                                                                                                        |
| ---------------- | --------------------- | ----------- | --------------- | ------------------------------------------------------------------------------------------------------------ |
| `v-model:span`   | `number`              | `6`         | `update:span`   | Grid columns the card spans, applied as `--chart-card-span` and capped by the grid's `--chart-grid-columns`. |
| `v-model:height` | `number \| undefined` | `undefined` | `update:height` | Height in pixels, applied as `--chart-card-height`; absent means the content decides.                        |

## States

- Visual states: `default`, `dragging` (the card dims while it travels), `resizing`, `focus-visible` on each handle
- `data-draggable`, `data-resizable` mirror the props
- `data-dragging` while a native drag runs; `data-resizing` while a pointer resize runs
- `data-flush` on the content mirrors `flush`
- Responsive: the root is the `@container/chart-card`. The header and footer wrap; below `@xs` of the card the controls take their own line at full width.

## Accessibility

- The card is a `<section>` named by its title (`aria-labelledby`) or by `ariaLabel`.
- Drag handle: a real `<button>` named "Move card". Keyboard map: arrow keys emit `move` with the direction; the page reorders and keeps focus on the handle. Dragging never requires a pointer.
- Resize handle: `role="separator"`, one tab stop, `aria-valuenow` / `aria-valuemin` / `aria-valuemax` on the span and `aria-valuetext` such as "6 of 12 columns, 552 pixels tall". Keyboard map: Left / Right change the span by one column, Up / Down change the height by 24 pixels, Home / End jump to the smallest and largest span, Escape cancels a pointer resize in progress.
- Both handles are at least 24px with a visible focus ring `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- `motion-reduce:transition-none` on every transition.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the drag and resize grips are symmetric and do not mirror.
- Keyboard: the drag handle moves the card one slot with the arrow keys and the resize handle grows (`ArrowRight`) or shrinks (`ArrowLeft`) the column span; both swap under `dir="rtl"` (`logicalArrowKey`).
- Pointer: the resize delta is inverted under `rtl` (`useDirection(handleRef)`), so dragging toward the end edge widens the card.
- User data: chart values keep the number format of the locale.

## Examples

### Default

```vue
<script setup>
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Hint from '@aziontech/webkit/hint'

  const labels = [
    '13:05',
    '13:10',
    '13:15',
    '13:20',
    '13:25',
    '13:30',
    '13:35',
    '13:40',
    '13:45',
    '13:50',
    '13:55',
    '14:00'
  ]
  const series = [
    {
      id: 'allowed',
      name: 'WAF requests allowed',
      color: 'success',
      values: [1210, 1340, 1295, 1480, 1530, 1460, 1610, 1580, 1720, 1690, 1810, 1760]
    },
    {
      id: 'blocked',
      name: 'WAF requests blocked',
      color: 'danger',
      values: [320, 410, 380, 520, 470, 430, 610, 580, 540, 690, 650, 720]
    },
    {
      id: 'threat',
      name: 'WAF requests threat',
      color: 'warning',
      values: [80, 95, 70, 120, 110, 90, 140, 130, 115, 160, 150, 170]
    }
  ]
</script>

<template>
  <ChartCard>
    <ChartCard.Header>
      <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
        <ChartCard.Title>Threats vs requests</ChartCard.Title>
        <Hint text="Requests WAF analyzed, split into blocked, logged and allowed." />
      </span>
    </ChartCard.Header>
    <ChartCard.Content>
      <Chart
        :series="series"
        :labels="labels"
      >
        <Chart.Grid />
        <Chart.Axis kind="y" />
        <Chart.Axis kind="x" />
        <Chart.Line />
        <Chart.Crosshair />
        <Chart.Tooltip />
        <Chart.Legend totals />
      </Chart>
    </ChartCard.Content>
    <ChartCard.Footer>Last hour, 5 minute buckets</ChartCard.Footer>
  </ChartCard>
</template>
```

### Content

```vue
<script setup>
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'

  const labels = [
    '13:05',
    '13:10',
    '13:15',
    '13:20',
    '13:25',
    '13:30',
    '13:35',
    '13:40',
    '13:45',
    '13:50',
    '13:55',
    '14:00'
  ]
  const series = [
    {
      id: 'allowed',
      name: 'WAF requests allowed',
      color: 'success',
      values: [1210, 1340, 1295, 1480, 1530, 1460, 1610, 1580, 1720, 1690, 1810, 1760]
    },
    {
      id: 'blocked',
      name: 'WAF requests blocked',
      color: 'danger',
      values: [320, 410, 380, 520, 470, 430, 610, 580, 540, 690, 650, 720]
    },
    {
      id: 'threat',
      name: 'WAF requests threat',
      color: 'warning',
      values: [80, 95, 70, 120, 110, 90, 140, 130, 115, 160, 150, 170]
    }
  ]
</script>

<template>
  <div class="grid grid-cols-1 gap-(--spacing-lg) lg:grid-cols-2">
    <ChartCard>
      <ChartCard.Header>
        <ChartCard.Title>Padded</ChartCard.Title>
      </ChartCard.Header>
      <ChartCard.Content>
        <Chart
          :series="series"
          :labels="labels"
        >
          <Chart.Grid />
          <Chart.Axis kind="y" />
          <Chart.Axis kind="x" />
          <Chart.Line />
          <Chart.Crosshair />
          <Chart.Tooltip />
          <Chart.Legend totals />
        </Chart>
      </ChartCard.Content>
    </ChartCard>
    <ChartCard>
      <ChartCard.Header>
        <ChartCard.Title>Flush</ChartCard.Title>
      </ChartCard.Header>
      <ChartCard.Content flush>
        <Chart
          :series="series"
          :labels="labels"
        >
          <Chart.Grid />
          <Chart.Axis kind="y" />
          <Chart.Axis kind="x" />
          <Chart.Line />
          <Chart.Crosshair />
          <Chart.Tooltip />
          <Chart.Legend totals />
        </Chart>
      </ChartCard.Content>
    </ChartCard>
  </div>
</template>
```

### WithControls

```vue
<script setup>
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'

  const labels = [
    '13:05',
    '13:10',
    '13:15',
    '13:20',
    '13:25',
    '13:30',
    '13:35',
    '13:40',
    '13:45',
    '13:50',
    '13:55',
    '14:00'
  ]
  const series = [
    {
      id: 'xss',
      name: 'WAF requests XSS attacks',
      values: [42, 38, 51, 47, 63, 58, 72, 69, 81, 77, 90, 86]
    }
  ]
</script>

<template>
  <ChartCard class="max-w-(--container-3xl)">
    <ChartCard.Header>
      <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
        <ChartCard.Title>Cross-site scripting threats</ChartCard.Title>
        <Hint text="Requests carrying cross-site scripting attacks against your domains." />
      </span>
      <ChartCard.Controls>
        <Tag
          label="Sum"
          severity="secondary"
          icon="pi pi-calculator"
        />
        <Tag
          label="+12.40%"
          severity="danger"
        />
        <DropdownMenuRoot>
          <DropdownMenuTrigger>
            <IconButton
              kind="transparent"
              size="small"
              icon="pi pi-ellipsis-h"
              aria-label="More options"
            />
          </DropdownMenuTrigger>
          <DropdownMenuGroup>
            <DropdownMenuOption
              value="copy-query"
              label="Copy query"
            />
            <DropdownMenuOption
              value="export-csv"
              label="Export CSV"
            />
            <DropdownMenuOption
              value="mean-line"
              label="Show mean line"
            />
          </DropdownMenuGroup>
        </DropdownMenuRoot>
      </ChartCard.Controls>
    </ChartCard.Header>
    <ChartCard.Content>
      <Chart
        :series="series"
        :labels="labels"
      >
        <Chart.Grid />
        <Chart.Axis kind="y" />
        <Chart.Axis kind="x" />
        <Chart.Line />
        <Chart.Crosshair />
        <Chart.Tooltip />
      </Chart>
    </ChartCard.Content>
  </ChartCard>
</template>
```
