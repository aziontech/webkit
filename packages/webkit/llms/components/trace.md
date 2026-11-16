# Trace

> A span waterfall: one row per span of a run (a function invocation, a request through several services), indented under the span it ran inside and drawn as a bar placed against the run's own clock. The rows form a tree grid that expands and collapses, a search narrows them to the spans whose name or service matches, and selecting a row opens its details (service, start, duration, share of the run, outcome message and attributes) under the waterfall. It reads a flat `spans` list with `parentId` links and never fetches anything. With `zoomable`, a minimap under the axis draws the whole run and a window the reader drags or resizes (or moves from the keyboard) to zoom the waterfall into part of it, through `v-model:range`. A span can carry `events` — moments inside it, drawn as markers on its bar and listed in its details — and `highlightSlowest` flags the span that took longest.

- Import: `import Trace from '@aziontech/webkit/trace'`
- Category: code · Surface: app · Structure: monolithic
- API as JSON: [trace.json](trace.json)

## When to use

- Use Trace for the timed span waterfall of one request or invocation; a nested data hierarchy without timing is a Tree.
- The test run of a function or the detail of one invocation, to show where the time went.
- A request that crossed several services, each with its own span, where the order and the overlap matter.
- Next to the run's logs (`log-viewer`), on the same clock.

## Do

- Pass `start` and `duration` in milliseconds from the start of the run; the axis spans the latest end.
- Link children with `parentId`; a span whose parent is missing becomes a root, so a partial trace still renders.
- Set `status: 'error'` and a one-line `message` on the span that failed, and on its parents if the failure bubbled up.
- Turn on `zoomable` for a run with many short spans next to one long one, so the short ones can be read; bind `v-model:range` when the logs or a chart beside the trace should follow the same window.
- Use `events` for moments that have no duration of their own (a cache miss, a retry, the first byte), with `at` on the run's clock; keep the names short, they are listed in the details.
- Turn on `highlightSlowest` where the question is where the time went; the flag goes to the longest span under the root, never to the root itself, which always spans the run.
- Bind `v-model:selected-key` when another view (a request path, a log line) selects the same span.
- Name the waterfall after the run (`aria-label="Trace of inv_7f21"`).

## Don’t

- A list of log lines with levels → use `log-viewer`.
- Durations to compare across many items with no parent/child relation → use `bar-list` or `chart`.
- Status history of a service over days → use `tracker`.
- A hierarchy without time → use `tree`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [log-viewer](log-viewer.md) — the run's log lines, shown under the trace on the same clock.
- [tree](tree.md) — the same expand and collapse model without the time axis.
- [bar-list](bar-list.md) — ranked durations without nesting.
- [key-value-list](key-value-list.md) — the facts of the run above the trace.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `spans` | `TraceSpan[]` | `[]` | false | Spans of the trace, each `{ id, parentId?, name, service?, icon?, start, duration, status?, message?, attributes? }` in milliseconds. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the waterfall. Empty uses the locale catalog. |
| `bordered` | `boolean` | `true` | false | Draws the outer border and radius. Off for a trace inside a card or panel that has its own. |
| `loading` | `boolean` | `false` | false | Shows placeholder rows while the spans load; search and selection wait. |
| `zoomable` | `boolean` | `false` | false | Shows a minimap under the axis to zoom the waterfall into a window of the run. Supports v-model:range. |
| `highlightSlowest` | `boolean` | `false` | false | Flags the span that took longest, other than the root, in its row and its details. |
| `selectedKey` | `string` | `''` | false | Two-way value (`v-model:selectedKey`). |
| `range` | `TraceRange \| null` | `null` | false | Two-way value (`v-model:range`). |

## v-model

| Model                 | Type                 | Default | Emits                | Notes                                                                                                                                                                                                          |
| --------------------- | -------------------- | ------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:selectedKey` | `string`             | `''`    | `update:selectedKey` | Id of the span whose details show under the waterfall, via `defineModel('selectedKey')`. A row was selected, selected again (empty: deselected), or Close used. Unbound, the trace keeps the selection itself. |
| `v-model:range`       | `TraceRange \| null` | `null`  | `update:range`       | The visible window of the run clock, via `defineModel('range')`. `null` shows the whole run. Applied with or without `zoomable`; clamped to the run and widened to at least 1% of it.                          |

## States

- Visual states: `default`, `hover` (row), `focus-visible` (row), `selected` (row and details band), `collapsed` / `expanded` (parent rows), `searching` (rows narrowed, every match's ancestors shown), `loading` (placeholder rows in a `role="status"` region, `aria-busy` on the root, search disabled, no details), `empty` (the package `EmptyState`, small: no spans, or no match with a Clear search action).
- Bar colour on `data-status` (`success`, `error`, `running`) plus `data-root` on a successful root span: root (info), `success`, `error` (danger), `running` (warning).
- `data-selected` on the selected row; `aria-expanded` on parent rows; `data-bordered` and `data-loading` on the root mirror their props.
- `zoomed` (a window narrower than the run): the axis, the bars and the event markers are placed against the window; a bar outside it is hidden (`data-outside`) while its row stays; the minimap shows the window and Reset zoom.
- `data-slowest` on the slowest span's row (with `highlightSlowest`).

## Accessibility

- Visible focus: a 2 px inset ring on the focused row.
- Keyboard map: one row is in the tab order (roving `tabindex`); `ArrowDown`/`ArrowUp` move between visible rows; `Home`/`End` go to the first and last row; `ArrowRight` expands a collapsed parent, or moves into its first child; `ArrowLeft` collapses an expanded parent, or moves to the parent; `Enter` or `Space` selects the row (again: deselects). Close in the details returns focus to the row.
- ARIA: the waterfall is a named `treegrid` of `row`s with `aria-level`, `aria-posinset`, `aria-setsize`, `aria-expanded` (parents only) and `aria-selected`; each row is named with its span, service, start, duration and outcome; the details band is a named `region` that describes the grid. The axis, the bars' duration labels and the expand glyph are decorative (`aria-hidden`).
- Minimap: the two window edges are `role="slider"` thumbs named Zoom start and Zoom end, with `aria-valuemin` / `aria-valuemax` / `aria-valuenow` in milliseconds and the formatted time as `aria-valuetext`. `ArrowRight`/`ArrowUp` move an edge by 1% of the run, `ArrowLeft`/`ArrowDown` back, `PageUp`/`PageDown` by 10%, `Home`/`End` to its limits, `Escape` resets the zoom. Reset zoom is a button. The span lines drawn in the minimap are decorative.
- Event markers are decorative; a row with events is named with their count, and the details list each event with its time. The slowest flag is named in the row (`Slowest`) and shown as a Tag in the details.
- Rows are 36 px high (44 px on `pointer: coarse`).
- Colour is never the only signal: a failed span also carries an icon in the row and a Failed tag in the details.
- Contrast ≥4.5:1 from the semantic text tokens; duration labels use the `-foreground` tokens of their status.

## Right-to-left

- Layout: logical utilities only; bars sit at `inset-inline-start` with an inline size, so the waterfall runs from the inline start and mirrors; indentation is `padding-inline-start`.
- Icons: the collapsed chevron is mirrored (`rtl:-scale-x-100`); span icons are not.
- Keyboard: `ArrowRight` and `ArrowLeft` swap under `dir="rtl"` (expand is the inline-end arrow).
- User data: span names, services, attribute values and event names sit in `<bdi>`.
- Minimap: the run clock starts at the inline start, so the track mirrors; the pointer position is read from the inline start and the slider arrows swap with `logicalArrowKey`.

## Internationalization

| Key                                                  | English source                                   | Override prop |
| ---------------------------------------------------- | ------------------------------------------------ | ------------- |
| `trace.label`                                        | Trace                                            | `ariaLabel`   |
| `trace.search`                                       | Search spans                                     | —             |
| `trace.noMatch`                                      | No span matches “{query}”.                       | —             |
| `trace.clearSearch`                                  | Clear search                                     | —             |
| `trace.emptyTitle`                                   | No spans in this trace.                          | —             |
| `trace.loading`                                      | Loading spans                                    | —             |
| `trace.details`                                      | Details of {name}                                | —             |
| `trace.close`                                        | Close                                            | —             |
| `trace.copyName`                                     | Copy span name                                   | —             |
| `trace.service` / `startedAt` / `duration` / `share` | Service / Started at / Duration / Share of trace | —             |
| `trace.percent`                                      | {value}%                                         | —             |
| `trace.failed` / `running`                           | Failed / Running                                 | —             |
| `trace.attributes`                                   | Attributes                                       | —             |
| `trace.milliseconds` / `seconds`                     | {value} ms / {value} s                           | —             |
| `trace.zoom` / `resetZoom`                           | Zoom / Reset zoom                                | —             |
| `trace.zoomStart` / `zoomEnd`                        | Zoom start / Zoom end                            | —             |
| `trace.slowest`                                      | Slowest                                          | —             |
| `trace.events`                                       | Events                                           | —             |
| `trace.eventCount`                                   | {count} event / {count} events                   | —             |

- Formatting: durations under one second print whole milliseconds, longer ones seconds with two decimals, both through `Intl.NumberFormat` of the active locale.

## Responsive

- Container queries: `@container/trace`; the name column grows from 9 rem to 20 rem with the container, the service column and the grid lines appear from `@xl`/`@3xl`.
- Narrow: names truncate, the duration labels stay on the bars, the details facts take two columns.
- Touch: rows are 44 px high on `pointer: coarse`; nothing depends on hover. The minimap track sets `touch-action: none` so a drag zooms instead of scrolling, and its thumbs widen to 24 px on `pointer: coarse`.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import Trace from '@aziontech/webkit/trace'
  import { ref } from 'vue'

  const spans = [
    { id: 'root', name: 'image-resizer', service: 'Function', start: 0, duration: 412 },
    {
      id: 'parse',
      parentId: 'root',
      name: 'parse-request',
      service: 'Compute',
      start: 4,
      duration: 12
    },
    {
      id: 'origin',
      parentId: 'root',
      name: 'fetch-origin',
      service: 'Network',
      start: 16,
      duration: 186
    },
    {
      id: 'dns',
      parentId: 'origin',
      name: 'dns-lookup',
      service: 'Network',
      start: 16,
      duration: 14
    },
    {
      id: 'tls',
      parentId: 'origin',
      name: 'tls-handshake',
      service: 'Security',
      start: 30,
      duration: 31
    },
    {
      id: 'response',
      parentId: 'origin',
      name: 'origin-response',
      service: 'Network',
      start: 61,
      duration: 141
    },
    {
      id: 'decode',
      parentId: 'root',
      name: 'decode',
      service: 'Compute',
      start: 202,
      duration: 54
    },
    {
      id: 'encode',
      parentId: 'root',
      name: 'encode',
      service: 'Compute',
      start: 256,
      duration: 92
    },
    {
      id: 'cache',
      parentId: 'root',
      name: 'put-cache',
      service: 'Storage',
      start: 348,
      duration: 38
    }
  ]

  const selected = ref('')
</script>

<template>
  <Trace
    v-model:selected-key="selected"
    :spans="spans"
    aria-label="Trace of the test run"
  />
</template>
```

### WithError

```vue
<script setup>
  import Trace from '@aziontech/webkit/trace'
  import { ref } from 'vue'

  const spans = [
    {
      id: 'root',
      name: 'image-resizer',
      service: 'Function',
      start: 0,
      duration: 1240,
      status: 'error',
      message: 'The run failed because the origin did not answer.'
    },
    {
      id: 'parse',
      parentId: 'root',
      name: 'parse-request',
      service: 'Compute',
      start: 4,
      duration: 11
    },
    {
      id: 'origin',
      parentId: 'root',
      name: 'fetch-origin',
      service: 'Network',
      start: 15,
      duration: 1201,
      status: 'error',
      message: 'No response within the 1 s read budget.'
    },
    {
      id: 'dns',
      parentId: 'origin',
      name: 'dns-lookup',
      service: 'Network',
      start: 15,
      duration: 12
    },
    {
      id: 'tls',
      parentId: 'origin',
      name: 'tls-handshake',
      service: 'Security',
      start: 27,
      duration: 34
    },
    {
      id: 'response',
      parentId: 'origin',
      name: 'origin-response',
      service: 'Network',
      start: 61,
      duration: 1155,
      status: 'error',
      message: 'Read timed out after 1,000 ms.'
    }
  ]

  const selected = ref('response')
</script>

<template>
  <Trace
    v-model:selected-key="selected"
    :spans="spans"
    aria-label="Trace of the failed run"
  />
</template>
```

### Selected

```vue
<script setup>
  import Trace from '@aziontech/webkit/trace'
  import { ref } from 'vue'

  const spans = [
    { id: 'root', name: 'checkout-handler', service: 'Function', start: 0, duration: 268 },
    {
      id: 'session',
      parentId: 'root',
      name: 'read-session',
      service: 'Storage',
      start: 6,
      duration: 22,
      attributes: { 'kv.namespace': 'sessions', 'kv.hit': 'true' }
    },
    {
      id: 'price',
      parentId: 'root',
      name: 'price-cart',
      service: 'Compute',
      start: 30,
      duration: 64
    },
    {
      id: 'payments',
      parentId: 'root',
      name: 'call-payments',
      service: 'Network',
      start: 96,
      duration: 158,
      attributes: {
        'http.method': 'POST',
        'http.url': 'https://payments.example.com/v2/charges',
        'http.status_code': 201,
        'net.peer.region': 'sa-east'
      }
    }
  ]

  const selected = ref('payments')
</script>

<template>
  <Trace
    v-model:selected-key="selected"
    :spans="spans"
    aria-label="Trace of the checkout run"
  />
</template>
```
