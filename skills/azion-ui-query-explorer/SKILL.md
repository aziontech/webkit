---
name: azion-ui-query-explorer
description: Recipe for a query explorer over Azion's GraphQL Metrics and Events APIs built only from @aziontech/ui pieces — dataset Select, measures and group-by, PropertyFilter tokens turned into GraphQL filters, a DateRangePicker resolved with useTimeRange, a Run button, the result as a Chart and a DataTable, and the generated query in a CodeBlock. Use when building an analytics, metrics or events explorer, a "query builder", or any screen that turns controls into a GraphQL query.
status: active
last_updated: 2026-11-25
scope: general
enforced_by: [azion-ui-component-states, azion-ui-prefer-over-custom, review]
---

# Skill: azion-ui-query-explorer

## Purpose

An explorer lets a person ask the Metrics or Events API a question without writing GraphQL: pick a dataset, what to measure, how to group, which rows to keep and the time range, then Run. Every control is an Azion UI component; the only code you write is the state object and the function that turns it into a query. Calling the API from the browser (proxy, token, error states) is [Calling the Azion API](../azion-ui-azion-api/SKILL.md); read it first.

## The pieces

| Part                 | Component                                                                             | Notes                                                                          |
| -------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Page heading and Run | `PageHeader` with `Button` (`variant="primary"`, `label="Run query"`) in its actions  | Run is explicit; do not refetch on every keystroke.                            |
| Time range           | `DateRangePicker` with `:relative-options="TIME_RANGE_PRESETS"`                       | `useTimeRange` (`@aziontech/ui/use-time-range`) resolves it to `from` / `to`.  |
| Time zone            | Muted `Times in UTC` text, or a `Select` named Time zone bound to `v-model:time-zone` | Beside the picker and always visible; the picker panel does not show the zone. |
| Dataset              | `Select`                                                                              | Options from schema introspection, never a hard-coded list.                    |
| Measures             | `Select` (function) beside `Select` (field)                                           | `count`, `sum`, `avg`, `max`, `min` and the fields each one accepts.           |
| Group by             | `MultiSelect`                                                                         | Dimensions of the dataset; `ts` for a time series.                             |
| Filters              | `PropertyFilter`                                                                      | One property per filterable field; `loadValues` for server values.             |
| Limit                | `NumberInput`                                                                         | Clamp to the API maximum.                                                      |
| Result over time     | `Chart` (inside `ChartCard`)                                                          | Pass `Date` labels; `loading`, `refetching` and `error` are props.             |
| Result rows          | `DataTable` (`data` + `columns`)                                                      | Its empty slot holds `EmptyState`.                                             |
| The query            | `CodeBlock` (`language="graphql"`, copyable)                                          | So the person can reuse it in their own client.                                |

Bound the time range to what the API retains: `min` is the retention limit (the picker's default is five years back), `max` stays the end of today, and `maxDuration` is the longest window one query may cover (`:max-duration="{ amount: 90, unit: 'day' }"`). The picker then hides the quick ranges that do not fit and refuses longer ranges before Run.

## 1. Read the datasets from the schema

Dataset, field and filter names differ by API and change over time, so read them with one introspection query at load and build every option list from it. Ask `__schema { queryType { name } types { name kind fields { name type { … } args { name type { … } } } inputFields { name } enumValues { name } } }` on `/v4/metrics/graphql` (or `/v4/events/graphql`), then per root field: its row fields, the enum of its `groupBy` argument, the fields its `aggregate` input accepts per function, and the suffixed fields of its `filter` input (`hostEq`, `statusGte`, `hostIlike`).

## 2. Hold the explorer in one state object

```ts
import { timeRangePreset, useTimeRange } from '@aziontech/ui/use-time-range'
import { ref } from 'vue'

const range = ref(timeRangePreset('last-7-days'))
const { from, to, refresh } = useTimeRange(range)

const state = ref({
  dataset: '',
  measure: { fn: 'sum', field: 'requests' },
  groupBy: ['ts'],
  filter: { tokens: [], operation: 'and' },
  limit: 100
})
```

`useTimeRange` holds a relative range ("last 7 days") still until you call `refresh()`, so a re-render never moves the window. Call `refresh()` when the person presses Run, then read `from` and `to`.

## 3. Turn the state into a query

<!-- snippet: partial -->

```ts
const iso = (date: Date) => date.toISOString().slice(0, 19)

const SUFFIX: Record<string, string> = {
  '=': 'Eq',
  '!=': 'Ne',
  '>': 'Gt',
  '<': 'Lt',
  '>=': 'Gte',
  '<=': 'Lte',
  ':': 'Ilike'
}

function buildQuery(dataset: string, filters: string[]): string {
  const { fn, field } = state.value.measure
  const groupBy = state.value.groupBy
  return `query {
  ${dataset}(
    limit: ${state.value.limit}
    filter: { tsRange: { begin: "${iso(from.value!)}", end: "${iso(to.value!)}" }${filters.length ? `, ${state.value.filter.operation}: [${filters.join(', ')}]` : ''} }
    aggregate: { ${fn}: ${field} }
    groupBy: [${groupBy.join(', ')}]
    orderBy: [${groupBy.includes('ts') ? 'ts_ASC' : `${fn}_DESC`}]
  ) {
    ${[...groupBy, fn].join('\n    ')}
  }
}`
}
```

Each `PropertyFilter` token (`{ propertyKey, operator, value }`) becomes one clause: `{ ${propertyKey}${SUFFIX[operator]}: ${JSON.stringify(value)} }`, numbers unquoted, `Ilike` values wrapped in `%…%`, and only when the schema lists that suffix for the field. Drop a token the dataset cannot express instead of sending an invalid query, and say so under the filter. Values come from the person: always `JSON.stringify` a string, never paste it raw into the query.

## 4. Run it and render every state

<!-- snippet: partial -->

```ts
const result = ref<Record<string, unknown>[]>([])
const status = ref<'idle' | 'loading' | 'error'>('idle')
const message = ref('')

async function run() {
  refresh()
  status.value = 'loading'
  const response = await azion('/v4/metrics/graphql', token.value, {
    method: 'POST',
    body: JSON.stringify({ query: query.value })
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) {
    status.value = 'error'
    message.value = body.detail ?? `The API answered ${response.status}.`
    return
  }
  result.value = body.data?.[state.value.dataset] ?? []
  status.value = 'idle'
}
```

- **Loading:** `Chart` `loading` on the first run and `refetching` on the next ones (the old result stays visible); the Run `Button` `loading`.
- **Empty:** a `200` with no rows is the table's empty slot with `EmptyState` (`No data for this range and these filters`) and the chart's own empty state, not an error.
- **Invalid query:** a `400` carries `{ detail }` (limits, unknown fields); show it in an `Alert` above the result with the query still visible in the `CodeBlock`.
- **Signed out:** a `401` or `403` follows [Calling the Azion API](../azion-ui-azion-api/SKILL.md), never a toast.

## 5. Chart a time series

Map rows to `labels` (one `Date` per bucket, from `ts`) and one series per measure (or per value of a second group-by field). Pass `Date` objects, not preformatted strings, so the axis picks day ticks over a week and hour ticks over a day, and set `format-label` only to change the wording. A series colour is a role (`primary`, `success`, `danger`), never a hex value ([Charts and figures](../azion-ui-data-viz/SKILL.md)).

## Hard rules

- Every control is an Azion UI component; no hand-built selects, chips or filter bars.
- Option lists come from introspection; hard-code no dataset or field names.
- Run is explicit and calls `refresh()` first; a relative range never drifts between runs.
- Person-typed values reach the query only through `JSON.stringify` or as numbers.
- The generated query is visible and copyable in a `CodeBlock`.
- Loading, empty, invalid and signed-out each have their own state.

## How to check it works

- Dataset, measures, group-by and filters fill from the schema.
- Last 1 hour, 24 hours, 7 days and 30 days resolve through `useTimeRange` and the picker shows the same presets.
- The query shown in the `CodeBlock` is the query that ran.
- Empty, `400` and `401` render distinct states; nothing renders a blank pane.
