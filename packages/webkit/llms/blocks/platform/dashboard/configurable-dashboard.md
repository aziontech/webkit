# ConfigurableDashboard (`platform/dashboard/configurable-dashboard`)

> A configurable dashboard: the reader arranges the cards. The page binds its layout, an array of id, span and height in order, to a Board with v-model:layout; an Edit layout Button turns on the board's editing, which shows the ChartCard drag handle and resize corner on every card. A card snaps to whole columns between 3 and 12 and to a height between 280 and 720 pixels; the board is twelve columns wide from a 48rem container and one column below it. Each card keeps its title with a Hint and nothing else in its header, and shows a Tag with its span while editing. Drop a card on another or press the arrow keys on its handle to move it; the board puts focus back on the moved handle and announces every move and resize in a polite live region. Reset layout appears once the layout differs from the default. Keep the layout wherever the product stores preferences. Built from `PageHeader`, `Button`, `Board`, `ChartCard` (with its drag handle and resize corner), `Hint`, `Tag`, `DonutChart`, `BarList` and `Chart`.

- Surface: product
- Source: `blocks/platform/dashboard/configurable-dashboard/configurable-dashboard.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/dashboard/configurable-dashboard")`
- Components: [Alert](../../../components/alert.md), [BarList](../../../components/bar-list.md), [Board](../../../components/board.md), [Button](../../../components/button.md), [Chart](../../../components/chart.md), `ChartCard`, [DonutChart](../../../components/donut-chart.md), [Hint](../../../components/hint.md), [PageHeader](../../../components/page-header.md), [Tag](../../../components/tag.md)
- Skills: `webkit-data-viz`, `webkit-layout`, `webkit-ui-states`

## Asked as

configurable dashboard; custom dashboard; drag and drop dashboard; resizable cards; edit layout; board; dashboard grid; dashboard builder; painel configurável; painel personalizado; reorganizar cards

A dashboard the reader arranges: they move cards, change how many columns a card spans and how tall it
is, and keep that layout. It serves readers who come back to the same page every day and care about
different cards than the default puts first. The page owns the layout (an array of id, span and
height, in order) and binds it to `Board`, which moves, resizes, clamps and announces; the
`ChartCard` inside each `Board.Item` provides the drag handle and the resize corner.

## When to use

- The same dashboard serves readers with different priorities, and each comes back often.
- The cards are independent: none depends on its position to make sense.
- The product has somewhere to store per-user preferences.

## When not to use

- A dashboard read once to answer one question, or one whose order tells a story: use a static
  dashboard such as `platform/dashboard/analytics-dashboard` or
  `platform/dashboard/executive-summary-dashboard`.
- The reader needs to add or remove widgets from a palette; this block only rearranges and resizes the
  cards it has.
- A single chart with editable settings: use `ChartCard` alone.

## Building blocks

### A. Page heading — `PageHeader` (required)

Title `Traffic overview` and one sentence on what the page shows, over the rest of the page in the standard
`layout-column`.

### B. Edit layout, Done and Reset layout — `Button` (required)

`Edit layout` (outlined) turns editing on and becomes `Done` (primary) with `aria-pressed` reflecting
the mode. `Reset layout` (transparent) appears only once the layout differs from the default. While
editing, one line of help sits beside the buttons: how to drag, resize and use the keyboard.

### C. Grid — `Board` (required)

`v-model:layout` binds the page's layout; `editing` follows the mode button. The bounds are set once
on the board: whole columns between 3 and 12, a height between 280 and 720 pixels. One `Board.Item`
per layout entry, keyed and labelled by the card title, so the board announces `Requests over time
moved to position 2 of 6.` and `… resized to 6 of 12 columns.` and puts focus back on the moved
handle. The board is twelve columns from a 48rem container and one column below it.

### D. Cards — `ChartCard` (required)

Inside a `Board.Item` the card takes its span, height and bounds from the board and shows its handles
only while the board is editing, so it carries no size props or drag events of its own. The header
holds `ChartCard.DragHandle` and the card `ChartCard.ResizeHandle`, each with an `aria-label` naming
the card (`Move Requests over time`, `Resize Requests over time`). The header keeps only the title and
its hint; no menus or toggles compete with the handles.

### E. Card definitions — `Hint` (required)

One sentence beside each title that defines the metric.

### F. Span while editing — `Tag` (required in edit mode)

Shows the card's span (`6/12`) in the header controls while editing, so a resize has a visible result
without counting grid lines.

### G. Split cards — `DonutChart` (optional)

A share of a whole (for example requests by region). Renders its own loading and empty state inside
the card.

### H. Ranked cards — `BarList` (optional)

A ranked list sorted descending (top sources). Renders its own loading and empty state.

### I. Time series cards — `Chart` (optional)

Bars, area or line over time. All time series share one `active-index`, so hovering a moment moves the
crosshair on every card. A legend with totals appears only when a card has more than one series.

## Do

- Keep the layout as data (id, span, height, order) owned by the page, bind it to `Board`, and persist
  it wherever the product stores preferences.
- Give every `Board.Item` the card title as its `label`; it is what moves and resizes announce.
- Announce a reset yourself in a polite live region (`Layout reset to the default.`); the board
  announces only what it did.
- Keep every card at its place and size in loading and empty states, so the reader can arrange it
  before data arrives.

## Don't

- Don't show handles outside edit mode; a dashboard that can be dragged by accident is worse than a static one.
- Don't let a card shrink below a span where its content stops reading (3 columns here).
- Don't put card menus, toggles or exports in the header; they conflict with the drag handle.
- Don't hide Reset layout behind a menu once the layout is customized.

## Copy

- **Title:** `Traffic overview`. **Description:** `Requests, regions, errors and response time for the period, in the layout you set.`
- **Mode button:** `Edit layout`, then `Done`. Never `Save`; changes apply as they happen.
- **Reset:** `Reset layout`.
- **Help line:** two short sentences on how, no layout positions. `Drag a card by its handle to move it, or by its corner to resize it. Focus a handle to use the arrow keys.`
- **Handle labels:** verb plus card title. `Move Requests over time`, `Resize Requests over time`.
- **Announcements:** full sentences with a period. `Layout reset to the default.`
- **Empty state:** `No requests yet` / `Metrics appear here once a service serves requests.`

## Accessibility

- The drag handle moves a card with the arrow keys; the resize corner changes span with Left and Right and height with Up and Down (`Board` handles both and mirrors them under right-to-left).
- Focus returns to the moved card's handle after a reorder.
- `Board` announces every move and resize in its own polite live region; the page announces the reset in an `aria-live="polite"` `sr-only` region.
- The board is a list named `Traffic overview cards`, one item per card.
- `Edit layout` exposes its mode with `aria-pressed`.
- Charts carry an `aria-label` equal to the card title.

## States

- Default: the arranged dashboard, read-only.
- Editing: handles and resize corners on every card, span tags in the headers, help line visible.
- Loading: every chart renders its own `Skeleton` inside its card; the layout holds its shape.
- Empty: nothing recorded yet; each card keeps its place and size and shows its empty state.
- Failed: the request failed; every card keeps its place, size and header with a danger `Alert` that names what did not load and offers Retry.

## Related

- `platform/dashboard/analytics-dashboard` — the static version of the same cards.
- `platform/dashboard/data-dashboard` — a fixed dashboard when the order tells the story.
- `Board` — the grid component: layout model, bounds, reorder, resize and announcements.
- `ChartCard` — the card inside each item, with the drag handle and resize corner.

## Variants

- `Default` — primary (the code below)
- `Editing` — Edit mode. Drag a card by its handle onto another to swap their order, or drag its corner to change the span and the height. Focus the handle and use the arrow keys to move a card, or focus the corner and use Left and Right for the span, Up and Down for the height.
- `Loading` — While the data loads, every chart renders its own Skeleton inside its card, so the layout holds its shape.
- `Empty` — Nothing recorded yet. Each card keeps its place and size and shows its empty state, so the reader can still arrange the dashboard before any data arrives.
- `Failed` — The request for the cards failed: every card keeps its place, size and header, with a danger Alert that names the card that did not load and offers Retry.

Each variant is the same screen in another state: `get_pattern("platform/dashboard/configurable-dashboard", { variant })`, or the file under `blocks/platform/dashboard/configurable-dashboard/variants/`.

## Code (`Default`)

```vue
<script setup>
  import BarList from '@aziontech/webkit/bar-list'
  import Board from '@aziontech/webkit/board'
  import Button from '@aziontech/webkit/button'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DonutChart from '@aziontech/webkit/donut-chart'
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  const loading = false

  const labels = [
    '11:00',
    '13:00',
    '15:00',
    '17:00',
    '19:00',
    '21:00',
    '23:00',
    '01:00',
    '03:00',
    '05:00',
    '07:00',
    '09:00'
  ]

  const cards = {
    requests: {
      title: 'Requests over time',
      hint: 'Requests served by every service, per interval.',
      kind: 'area',
      format: 'count',
      series: [
        {
          id: 'requests',
          name: 'Requests',
          values: [
            2029738, 1799252, 1910217, 1633835, 1757364, 1722765, 2157932, 2151290, 2283541,
            2397218, 2545994, 2347243
          ]
        }
      ]
    },
    regions: {
      title: 'Requests by region',
      hint: 'Share of requests by the region that served them.',
      kind: 'donut',
      format: 'count',
      series: [
        {
          id: 'South America',
          name: 'South America',
          values: [9820000]
        },
        {
          id: 'North America',
          name: 'North America',
          values: [7410000]
        },
        {
          id: 'Europe',
          name: 'Europe',
          values: [4960000]
        },
        {
          id: 'Asia',
          name: 'Asia',
          values: [2230000]
        },
        {
          id: 'Oceania',
          name: 'Oceania',
          values: [610000]
        }
      ]
    },
    transfer: {
      title: 'Data transferred',
      hint: 'Data delivered to clients and received from them, per interval.',
      kind: 'line',
      format: 'bytes',
      series: [
        {
          id: 'out',
          name: 'Out',
          values: [
            7464097327, 8703777359, 8853256007, 10189608468, 10484778433, 10611102405, 9993797117,
            9768346098, 10386911277, 8642195236, 7365365394, 8004529693
          ]
        },
        {
          id: 'in',
          name: 'In',
          values: [
            1991543196, 1861411304, 1899395715, 1528384777, 1319208897, 1269798165, 1261414828,
            1391471001, 1417213338, 1614716457, 1979668469, 2070880025
          ]
        }
      ]
    },
    errors: {
      title: 'Errors by status',
      hint: 'Requests that ended in a client or server error, per interval.',
      kind: 'bar',
      format: 'count',
      series: [
        {
          id: '4xx',
          name: '4xx',
          values: [
            13707, 15864, 14544, 16239, 19681, 24625, 22235, 22216, 22808, 17486, 16275, 15501
          ]
        },
        {
          id: '5xx',
          name: '5xx',
          values: [8144, 8724, 9890, 8837, 7067, 7731, 5015, 3592, 4017, 3975, 5911, 7275]
        }
      ]
    },
    sources: {
      title: 'Top sources',
      hint: 'The services that received the most requests in the period.',
      kind: 'bar-list',
      format: 'count',
      items: [
        {
          id: 'web-app-prod',
          name: 'web-app-prod',
          value: 11420000
        },
        {
          id: 'payments-api',
          name: 'payments-api',
          value: 6240000
        },
        {
          id: 'storefront-checkout',
          name: 'storefront-checkout',
          value: 4910000
        },
        {
          id: 'marketing-site',
          name: 'marketing-site',
          value: 2380000
        },
        {
          id: 'status-page',
          name: 'status-page',
          value: 860000
        }
      ]
    },
    latency: {
      title: 'Response time',
      hint: 'Time to the first byte at the 95th percentile, per interval.',
      kind: 'line',
      format: 'ms',
      series: [
        {
          id: 'p95',
          name: 'p95',
          values: [166, 167, 151, 172, 200, 191, 205, 208, 205, 182, 165, 175]
        }
      ]
    }
  }

  const defaultLayout = [
    {
      id: 'requests',
      span: 8
    },
    {
      id: 'regions',
      span: 4
    },
    {
      id: 'transfer',
      span: 6
    },
    {
      id: 'errors',
      span: 6
    },
    {
      id: 'sources',
      span: 4
    },
    {
      id: 'latency',
      span: 8
    }
  ]

  const formatters = {
    count: (value) =>
      new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(value),
    bytes: (value) => {
      const steps = ['B', 'KB', 'MB', 'GB', 'TB']
      let current = value
      let index = 0
      while (current >= 1000 && index < steps.length - 1) {
        current /= 1000
        index += 1
      }
      return `${current.toFixed(current >= 100 || index === 0 ? 0 : 1)} ${steps[index]}`
    },
    ms: (value) => `${Math.round(value)} ms`
  }

  const editing = ref(false)
  const layout = ref(defaultLayout.map((card) => ({ ...card })))
  const activeIndex = ref(null)
  const announcement = ref('')

  const customized = computed(() => JSON.stringify(layout.value) !== JSON.stringify(defaultLayout))

  const reset = () => {
    layout.value = defaultLayout.map((card) => ({ ...card }))
    announcement.value = 'Layout reset to the default.'
  }
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Traffic overview"
        description="Requests, regions, errors and response time for the period, in the layout you set."
      />
      <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
        <p
          v-if="editing"
          class="m-0 min-w-0 grow text-body-sm text-(--text-muted)"
        >
          Drag a card by its handle to move it, or by its corner to resize it. Focus a handle to use
          the arrow keys.
        </p>
        <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
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
      </div>

      <Board
        v-model:layout="layout"
        :editing="editing"
        aria-label="Traffic overview cards"
        :min-span="3"
        :max-span="12"
        :min-height="280"
        :max-height="720"
      >
        <Board.Item
          v-for="card in layout"
          :key="card.id"
          :item-id="card.id"
          :label="cards[card.id].title"
        >
          <ChartCard>
            <ChartCard.Header>
              <ChartCard.DragHandle :aria-label="'Move ' + cards[card.id].title" />
              <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
                <ChartCard.Title>{{ cards[card.id].title }}</ChartCard.Title>
                <Hint :text="cards[card.id].hint" />
              </span>
              <ChartCard.Controls v-if="editing">
                <Tag
                  :label="card.span + '/12'"
                  severity="secondary"
                  size="small"
                  icon="pi pi-arrows-h"
                />
              </ChartCard.Controls>
            </ChartCard.Header>
            <ChartCard.Content>
              <DonutChart
                v-if="cards[card.id].kind === 'donut'"
                :series="cards[card.id].series"
                :format-value="formatters[cards[card.id].format]"
                empty-title="No requests yet"
                empty-description="Metrics appear here once a service serves requests."
                :loading="loading"
                :aria-label="cards[card.id].title"
              />
              <BarList
                v-else-if="cards[card.id].kind === 'bar-list'"
                :items="cards[card.id].items"
                sort="descending"
                :format-value="formatters[cards[card.id].format]"
                empty-title="No requests yet"
                :loading="loading"
                :aria-label="cards[card.id].title"
              />
              <Chart
                v-else
                v-model:active-index="activeIndex"
                :series="cards[card.id].series"
                :labels="labels"
                :format-value="formatters[cards[card.id].format]"
                empty-title="No requests yet"
                empty-description="Metrics appear here once a service serves requests."
                :loading="loading"
              >
                <Chart.Grid />
                <Chart.Axis kind="y" />
                <Chart.Axis kind="x" />
                <Chart.Bar
                  v-if="cards[card.id].kind === 'bar'"
                  stacked
                />
                <Chart.Area v-else-if="cards[card.id].kind === 'area'" />
                <Chart.Line v-else />
                <Chart.Crosshair />
                <Chart.Tooltip />
                <Chart.Legend
                  v-if="cards[card.id].series.length > 1"
                  totals
                />
              </Chart>
            </ChartCard.Content>
            <ChartCard.ResizeHandle :aria-label="'Resize ' + cards[card.id].title" />
          </ChartCard>
        </Board.Item>
      </Board>

      <p
        class="sr-only"
        aria-live="polite"
      >
        {{ announcement }}
      </p>
    </main>
  </div>
</template>
```
