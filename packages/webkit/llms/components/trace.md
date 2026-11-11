# Trace

> A span waterfall: one row per span of a run (a function invocation, a request through several services), indented under the span it ran inside and drawn as a bar placed against the run's own clock. The rows form a tree grid that expands and collapses, a search narrows them to the spans whose name or service matches, and selecting a row opens its details (service, start, duration, share of the run, outcome message and attributes) under the waterfall. It reads a flat `spans` list with `parentId` links and never fetches anything.

- Import: `import Trace from '@aziontech/webkit/trace'`
- Category: code · Surface: product · Structure: monolithic
- API as JSON: [trace.json](https://github.com/aziontech/webkit/blob/main/.specs/trace.json)

## When to use

- The test run of a function or the detail of one invocation, to show where the time went.
- A request that crossed several services, each with its own span, where the order and the overlap matter.
- Next to the run's logs (`log-view`), on the same clock.

## Do

- Pass `start` and `duration` in milliseconds from the start of the run; the axis spans the latest end.
- Link children with `parentId`; a span whose parent is missing becomes a root, so a partial trace still renders.
- Set `status: 'error'` and a one-line `message` on the span that failed, and on its parents if the failure bubbled up.
- Bind `v-model:selected` when another view (a request path, a log line) selects the same span.
- Name the waterfall after the run (`aria-label="Trace of inv_7f21"`).

## Don’t

- A list of log lines with levels → use `log-view`.
- Durations to compare across many items with no parent/child relation → use `bar-list` or `chart`.
- Status history of a service over days → use `tracker`.
- A hierarchy without time → use `tree`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [log-view](log-view.md) — the run's log lines, shown under the trace on the same clock.
- [tree](tree.md) — the same expand and collapse model without the time axis.
- [bar-list](bar-list.md) — ranked durations without nesting.
- [key-value-pairs](key-value-pairs.md) — the facts of the run above the trace.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `spans` | `TraceSpan[]` | `[]` | false | Spans of the trace, each `{ id, parentId?, name, service?, icon?, start, duration, status?, message?, attributes? }` in milliseconds. |
| `selected` | `string` | `''` | false | Id of the span whose details show under the waterfall. Supports v-model:selected. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the waterfall. Empty uses the locale catalog. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:selected` | `string` | A row was selected, selected again (empty: deselected), or Close used. |

## States

- Visual states: `default`, `hover` (row), `focus-visible` (row), `selected` (row and details band), `collapsed` / `expanded` (parent rows), `searching` (rows narrowed, every match's ancestors shown), `empty` (no spans, or no match with Clear search).
- Bar tones on `data-tone`: `root` (info), `ok` (success), `error` (danger), `running` (warning).
- `data-selected` on the selected row; `aria-expanded` on parent rows.

## Accessibility

- Visible focus: a 2 px inset ring on the focused row.
- Keyboard map: one row is in the tab order (roving `tabindex`); `ArrowDown`/`ArrowUp` move between visible rows; `Home`/`End` go to the first and last row; `ArrowRight` expands a collapsed parent, or moves into its first child; `ArrowLeft` collapses an expanded parent, or moves to the parent; `Enter` or `Space` selects the row (again: deselects). Close in the details returns focus to the row.
- ARIA: the waterfall is a named `treegrid` of `row`s with `aria-level`, `aria-posinset`, `aria-setsize`, `aria-expanded` (parents only) and `aria-selected`; each row is named with its span, service, start, duration and outcome; the details band is a named `region` that describes the grid. The axis, the bars' duration labels and the expand glyph are decorative (`aria-hidden`).
- Rows are 36 px high (44 px on `pointer: coarse`).
- Colour is never the only signal: a failed span also carries an icon in the row and a Failed tag in the details.
- Contrast ≥4.5:1 from the semantic text tokens; duration labels use the `-contrast` tokens of their tone.

## Right-to-left

- Layout: logical utilities only; bars sit at `inset-inline-start` with an inline size, so the waterfall runs from the inline start and mirrors; indentation is `padding-inline-start`.
- Icons: the collapsed chevron is mirrored (`rtl:-scale-x-100`); span icons are not.
- Keyboard: `ArrowRight` and `ArrowLeft` swap under `dir="rtl"` (expand is the inline-end arrow).
- User data: span names, services and attribute values sit in `<bdi>`.

## Internationalization

| Key                                                  | English source                                   | Override prop |
| ---------------------------------------------------- | ------------------------------------------------ | ------------- |
| `trace.label`                                        | Trace                                            | `ariaLabel`   |
| `trace.search`                                       | Search spans                                     | —             |
| `trace.noMatch`                                      | No span matches “{query}”.                       | —             |
| `trace.clearSearch`                                  | Clear search                                     | —             |
| `trace.empty`                                        | No spans in this trace.                          | —             |
| `trace.details`                                      | Details of {name}                                | —             |
| `trace.close`                                        | Close                                            | —             |
| `trace.copyName`                                     | Copy span name                                   | —             |
| `trace.service` / `startedAt` / `duration` / `share` | Service / Started at / Duration / Share of trace | —             |
| `trace.percent`                                      | {value}%                                         | —             |
| `trace.failed` / `running`                           | Failed / Running                                 | —             |
| `trace.attributes`                                   | Attributes                                       | —             |
| `trace.milliseconds` / `seconds`                     | {value} ms / {value} s                           | —             |

- Formatting: durations under one second print whole milliseconds, longer ones seconds with two decimals, both through `Intl.NumberFormat` of the active locale.

## Responsive

- Container queries: `@container/trace`; the name column grows from 9 rem to 20 rem with the container, the service column and the grid lines appear from `@xl`/`@3xl`.
- Narrow: names truncate, the duration labels stay on the bars, the details facts take two columns.
- Touch: rows are 44 px high on `pointer: coarse`; nothing depends on hover.
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
    v-model:selected="selected"
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
    v-model:selected="selected"
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
    v-model:selected="selected"
    :spans="spans"
    aria-label="Trace of the checkout run"
  />
</template>
```
