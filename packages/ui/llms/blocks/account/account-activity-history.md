# AccountActivityHistory (`account/account-activity-history`)

> The account's audit log: a `PageHeader` with Documentation over one controls row (`PropertyFilter` on event, category, user and IP address; a `DateRangePicker` for the period, last 30 days by default; Refresh, Download CSV and `CollectionPreferences`) and a `DataTable` of events, newest first: Event, Category as a `Tag`, User, IP address with a `CopyButton`, and Date as `TableCellTime`. One `useCollection` holds filter, sort, page and saved preferences; the period narrows the items before it. An empty period offers a longer one, filters that match nothing offer Clear filters, and a failed load is a danger `Alert` with Retry. A page body for ConsoleLayout, rendered in its default slot.

- Surface: app
- Source: `blocks/account/account-activity-history/account-activity-history.vue` in `@aziontech/ui`
- MCP: `get_block("account/account-activity-history")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [CollectionPreferences](../../components/collection-preferences.md), [ConfigProvider](../../components/config-provider.md), [CopyButton](../../components/copy-button.md), [DataTable](../../components/data-table.md), `DataTablePagination`, [DateRangePicker](../../components/date-range-picker.md), [EmptyState](../../components/empty-state.md), [IconButton](../../components/icon-button.md), [PageHeader](../../components/page-header.md), [PropertyFilter](../../components/property-filter.md), [Table](../../components/table.md), `TableCellTime`, [Tag](../../components/tag.md), [Tooltip](../../components/tooltip.md), `use-collection`
- Skills: `azion-ui-lists`, `azion-ui-tables`, `azion-ui-states`, `azion-ui-microcopy`

## Asked as

activity history; audit log; audit trail; account activity; security log; who did what; user activity; event history; histórico de atividades; log de auditoria; trilha de auditoria; atividade da conta

The account's audit log. An admin or a security reviewer answers "who did this, from where, and when": a token that was revoked, a role that changed, a sign-in that failed, a plan that was upgraded. They narrow the log by period, category, person and address, read the newest events first, copy an IP address into another tool, and export what they found. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- The account or organisation audit log: sign-ins, security changes, member and role changes, billing changes, deploys.
- Any append-only list of events people search by who, what, where and when.

## When not to use

- Request logs or metrics explored over time with a chart: use `view/view-events-explorer`.
- The deploy history of one resource: use `detail/detail-deployment-logs` or the details page's history tab.
- A short "recent activity" card on a dashboard: use `Item` rows in a `Card` and link here with View all.

## Building blocks

### A. Page heading — `ConfigProvider`, `PageHeader`, `Button` (required)

Title `Activity history` and one sentence that says what is logged and how long it is kept. The only action is the outlined Documentation button: the log is read-only. `ConfigProvider` only fixes the clock (`now`) for the sample, a test or a server render, so the relative periods and times read the same everywhere; with live data and no `now` they read the real clock.

### B. Filter — `PropertyFilter` (required)

Bound with `v-bind="propertyFilterProps"`. Properties: Event (free text), Category and User (with options), IP address. Free text searches every column.

### C. Period — `DateRangePicker` (required)

The period comes first in the reader's mind and is filtered before the collection: relative ranges from the last 15 minutes to the last 90 days, the retention limit (last 30 days by default), or absolute dates. It is a separate control because time is not a property token.

### D. Listing actions — `Tooltip`, `IconButton`, `CollectionPreferences` (required)

Refresh and Download CSV as outlined icon buttons in tooltips, then `CollectionPreferences` (page size 25, 50 or 100; columns), saved under `storageKey`.

### E. Event table — `Card`, `DataTable`, `DataTablePagination`, `TableCellTime`, `Tag`, `CopyButton`, `useCollection` (required)

One `useCollection` over the events in the period, sorted by Date descending, `DataTable` bound with `v-bind="tableProps"` in a flush `Card`. Columns: Event (sentence in past tense naming the object), Category as a small neutral `Tag` with one icon per category (Sign-in, Security, Deploy, Users, Billing): a category is not a status, so it never borrows the info, warning, success or brand colours, User, IP address (left to right, with a `CopyButton` named `Copy IP address`), and Date through `TableCellTime` (relative, exact time on the tooltip).

### F. No match and empty period — `EmptyState` (required)

Filters that hide every event fill the table's `#empty` slot with `No matching events` and Clear filters. A period with no events at all replaces the table with `No activity in this period` and a button that widens it to the next longer preset (`Show the last hour`, … `Show the last 90 days`). At 90 days, the retention limit, the button goes and the description says events are kept for 90 days.

### G. Load failure — `Alert` (conditional)

A danger `Alert` with Retry takes the table's place; the controls stay so the reader can change the period.

## Data

The block takes its records through props and emits every action; it fetches nothing. `ActivityHistoryEvent` and `ActivityHistoryProps` are exported from `account-activity-history.vue`, and `sample.ts` holds the sample events and the fixed clock the block renders when `events` and `now` are left out (the events never show while `loading` or `error` is set).

| Prop      | Type                     | What it does                                                                                                   |
| --------- | ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `events`  | `ActivityHistoryEvent[]` | The log; the period, the filter, the sort and the pages run on it in the browser. Pass `[]` for none.          |
| `now`     | `Date`                   | The moment relative periods count back from; pass the request time.                                            |
| `range`   | `DateRangeValue`         | The selected period, two-way with `v-model:range` (the last 30 days by default); fetch the period it names.    |
| `loading` | `boolean`                | A request is in flight. With no events it is the first load (the table's loading rows); with events a refresh. |
| `error`   | `string`                 | Why the load failed, shown in the danger `Alert` with Retry that replaces the table.                           |

| Event          | Payload   | When                                                  |
| -------------- | --------- | ----------------------------------------------------- |
| `refresh`      | `(event)` | Refresh.                                              |
| `retry`        | `(event)` | Retry in the error alert.                             |
| `update:range` | `(range)` | The period changed in the picker or the widen button. |

To go live, render the block from a page that owns the request and pass what it returns:

```vue
<script setup lang="ts">
  import AccountActivityHistory from './account-activity-history.vue'

  const { data, range, requestedAt, pending, error, refresh } = useActivity()
  const loadError = 'The activity could not be loaded. Nothing was changed; try again.'
</script>

<template>
  <AccountActivityHistory
    v-model:range="range"
    :events="data ?? []"
    :now="requestedAt"
    :loading="pending"
    :error="error ? loadError : ''"
    @refresh="refresh"
    @retry="refresh"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Write each event as a past-tense sentence with the object's name: `Revoked personal token “Nightly export”`.
- Show the newest first and keep the exact time on the tooltip.
- Keep IP addresses left to right and copyable.
- Keep the period and the filters in the controls row, the export last but one, preferences last.

## Don't

- Don't let anyone edit or delete an event from this page.
- Don't put the period in the property filter, or show a period with no events as an error.
- Don't truncate the event sentence without the full text on the row.

## Copy

- **Title:** `Activity history`. **Filter:** `Filter activity`. **Period:** `Activity period`.
- **Categories:** `Sign-in`, `Security`, `Users`, `Billing`, `Deploy`.
- **Empty period:** `No activity in this period`, then `Nothing happened in the account in the selected period. Select a longer period to see older events.` and `Show the last <next preset>`; at 90 days, `Nothing happened in the account in the last 90 days, the longest period events are kept.` with no action.
- **No match:** `No matching events`, `No event in this period matches these filters.`, `Clear filters`.
- Follow `skills/azion-ui-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- No `main` of its own (the layout's is the only one); the `PageHeader` title is the only `h1`; the table is named `Activity history`.
- The filter and the period picker carry `aria-label`s; icon buttons have names that match their tooltips.
- Category is text in a tag, never colour alone; the relative date has the exact time on its tooltip.
- User and IP cells keep their own direction (`dir="auto"`, `dir="ltr"`) inside a right-to-left page.
- `/` focuses the property filter from anywhere on the page, except while typing in a field.

## States

- Default: ten events over three weeks, the last 30 days selected, with filter, period, refresh, export, preferences, sorting and paging wired.
- Empty: the period (`range`, the last 15 minutes) holds no event; a flush empty state offers the next longer period, the last hour.
- Loading: the first load (`loading` with no `events`); the controls and the table's loading rows.
- Error: the log did not load (`error` is set); a danger Alert with the message and Retry.

## Related

- `view/view-table` — the list page this one follows.
- `account/account-personal-tokens` and `account/account-team-permissions` — the screens whose changes are logged here.
- `view/view-events-explorer` — events over time with a chart and a document pane.

## Variants

- `Default` — primary (the code below)
- `Empty` — No event in the selected period (the last 15 minutes): the controls stay, and a flush EmptyState offers the next longer period, Show the last hour.
- `Loading` — The first load: the controls and the table's loading rows.
- `Error` — The log did not load: a danger Alert with Retry replaces the table; Retry loads the events.

Each variant is the same screen in another state: `get_block("account/account-activity-history", { variant })`, or the file under `blocks/account/account-activity-history/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import CollectionPreferences from '@aziontech/ui/collection-preferences'
  import ConfigProvider from '@aziontech/ui/config-provider'
  import CopyButton from '@aziontech/ui/copy-button'
  import DataTable from '@aziontech/ui/data-table'
  import DataTablePagination from '@aziontech/ui/data-table-pagination'
  import type {
    DateRangeUnit,
    DateRangeValue,
    RelativeOption
  } from '@aziontech/ui/date-range-picker'
  import DateRangePicker from '@aziontech/ui/date-range-picker'
  import EmptyState from '@aziontech/ui/empty-state'
  import IconButton from '@aziontech/ui/icon-button'
  import PageHeader from '@aziontech/ui/page-header'
  import PropertyFilter from '@aziontech/ui/property-filter'
  import { type TableColumn, type TableExposed } from '@aziontech/ui/table'
  import TableCellTime from '@aziontech/ui/table-cell-time'
  import Tag from '@aziontech/ui/tag'
  import Tooltip from '@aziontech/ui/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/ui/use-collection'
  import { computed, ref } from 'vue'

  import { sampleEvents, sampleNow } from './sample'

  const MINUTE = 60_000
  const HOUR = 60 * MINUTE
  const DAY = 24 * HOUR

  /** What kind of change an event records. */
  export type ActivityHistoryCategory = 'Sign-in' | 'Security' | 'Deploy' | 'Users' | 'Billing'

  /** One entry of the audit log. */
  export interface ActivityHistoryEvent {
    /** Stable key. */
    id: string
    /** A past-tense sentence naming the object. */
    event: string
    /** What kind of change it records. */
    category: ActivityHistoryCategory
    /** Email of the person who did it. */
    user: string
    /** The address it came from. */
    ip: string
    /** When it happened. */
    at: Date
  }

  export interface ActivityHistoryProps {
    /** The events to list; the period, the filter, the sort and the pages run in the browser. Left out, the sample renders. */
    events?: ActivityHistoryEvent[]
    /** The moment relative periods and the relative times count from. Left out, the sample clock with the sample, the real clock with your events. */
    now?: Date
    /** A request is in flight: with no events it is the first load, with events a refresh. */
    loading?: boolean
    /** Why the events could not load; a danger alert with Retry replaces the table. */
    error?: string
  }

  const props = withDefaults(defineProps<ActivityHistoryProps>(), {
    events: undefined,
    now: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
  }>()

  const range = defineModel<DateRangeValue>('range', {
    default: () => ({ type: 'relative', amount: 30, unit: 'day', key: 'last-30-days' })
  })

  const entries = computed<ActivityHistoryEvent[]>(
    () => props.events ?? (props.loading || props.error ? [] : sampleEvents)
  )
  const referenceTime = computed(() => (props.now ?? sampleNow).getTime())
  const clock = computed(
    () => props.now ?? (props.events || props.loading || props.error ? undefined : sampleNow)
  )

  const categoryIcons: Record<ActivityHistoryCategory, string> = {
    'Sign-in': 'az az-log-in',
    Security: 'az az-shield',
    Deploy: 'az az-cloud-upload',
    Users: 'az az-users',
    Billing: 'az az-credit-card'
  }

  const relativeOptions: RelativeOption[] = [
    { key: 'last-15-minutes', amount: 15, unit: 'minute' },
    { key: 'last-1-hour', amount: 1, unit: 'hour' },
    { key: 'last-24-hours', amount: 24, unit: 'hour' },
    { key: 'last-7-days', amount: 7, unit: 'day' },
    { key: 'last-30-days', amount: 30, unit: 'day' },
    { key: 'last-90-days', amount: 90, unit: 'day' }
  ]
  const UNIT_MS: Partial<Record<DateRangeUnit, number>> = {
    minute: MINUTE,
    hour: HOUR,
    day: DAY,
    week: 7 * DAY
  }
  const period = computed(() => {
    const value = range.value
    if (value?.type === 'absolute') {
      return { start: new Date(value.start).getTime(), end: new Date(value.end).getTime() }
    }
    if (value?.type === 'since') {
      return { start: new Date(value.start).getTime(), end: Number.POSITIVE_INFINITY }
    }
    const span = (value?.amount ?? 30) * (UNIT_MS[value?.unit] ?? DAY)
    return { start: referenceTime.value - span, end: Number.POSITIVE_INFINITY }
  })
  const inRange = computed(() =>
    entries.value.filter((entry) => {
      const time = entry.at.getTime()
      return time >= period.value.start && time <= period.value.end
    })
  )

  const optionsOf = (key: 'category' | 'user') =>
    [...new Set(entries.value.map((entry) => entry[key]))].sort().map((value) => ({ value }))

  const properties = computed<FilteringProperty[]>(() => [
    { key: 'event', label: 'Event' },
    { key: 'category', label: 'Category', options: optionsOf('category') },
    { key: 'user', label: 'User', options: optionsOf('user') },
    { key: 'ip', label: 'IP address' }
  ])

  const columns: TableColumn[] = [
    {
      accessorKey: 'event',
      header: 'Event',
      principal: true,
      hideable: false,
      grow: 2,
      minWidth: 320
    },
    { accessorKey: 'category', header: 'Category', sortable: true, minWidth: 120 },
    { accessorKey: 'user', header: 'User', sortable: true, minWidth: 200 },
    { accessorKey: 'ip', header: 'IP address', minWidth: 150 },
    { accessorKey: 'at', header: 'Date', sortable: true, minWidth: 150 }
  ]

  const {
    paginationProps,
    tableProps,
    propertyFilterProps,
    preferencesProps,
    status,
    matchingItems,
    clearFilters
  } = useCollection({
    items: inRange,
    columns,
    filtering: { fields: ['event', 'category', 'user', 'ip'] },
    propertyFiltering: { properties },
    sorting: { defaultState: [{ id: 'at', desc: true }] },
    pagination: { pageSize: 25, pageSizeOptions: [25, 50, 100] },
    preferences: { storageKey: 'activity-history' }
  })

  const activityTableEl = ref<TableExposed<ActivityHistoryEvent> | null>(null)
  const exportCsv = () => activityTableEl.value?.exportCsv({ filename: 'activity-history.csv' })

  const RETENTION_DAYS = 90
  const widerRange = computed<RelativeOption | null>(() => {
    const span =
      period.value.end === Number.POSITIVE_INFINITY
        ? referenceTime.value - period.value.start
        : period.value.end - period.value.start
    if (span >= RETENTION_DAYS * DAY) return null
    return (
      relativeOptions.find((option) => option.amount * (UNIT_MS[option.unit] ?? DAY) > span) ?? null
    )
  })
  const widenLabel = computed(() => {
    const next = widerRange.value
    if (!next) return ''
    return next.amount === 1
      ? `Show the last ${next.unit}`
      : `Show the last ${next.amount} ${next.unit}s`
  })
  const widenRange = () => {
    const next = widerRange.value
    if (next)
      range.value = { type: 'relative', amount: next.amount, unit: next.unit, key: next.key }
  }
</script>

<template>
  <ConfigProvider :now="clock">
    <div class="layout-boundary">
      <div class="layout-column flex flex-col">
        <PageHeader
          title="Activity history"
          description="Who did what in this account, from where and when. Events are kept for 90 days."
        >
          <template #actions>
            <Button
              label="Documentation"
              aria-label="Documentation (opens in a new tab)"
              icon="az az-book"
              variant="outline"
              size="medium"
              href="https://example.com/docs/activity-history"
              target="_blank"
            />
          </template>
        </PageHeader>

        <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
          <header class="flex flex-wrap items-start gap-(--layout-group-gap)">
            <div class="flex min-w-0 grow basis-(--container-2xs)">
              <PropertyFilter
                v-bind="propertyFilterProps"
                placeholder="Filter activity"
                aria-label="Filter activity"
              />
            </div>
            <div class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs)">
              <DateRangePicker
                v-model="range"
                :relative-options="relativeOptions"
                aria-label="Activity period"
                :show-time-zone="false"
                :show-refresh="false"
              />
              <Tooltip
                content="Refresh"
                class="shrink-0"
              >
                <IconButton
                  icon="az az-refresh"
                  variant="outline"
                  size="medium"
                  :loading="loading"
                  aria-label="Refresh"
                  @click="emit('refresh', $event)"
                />
              </Tooltip>
              <Tooltip
                content="Download CSV"
                class="shrink-0"
              >
                <IconButton
                  icon="az az-download"
                  variant="outline"
                  size="medium"
                  :disabled="!matchingItems.length"
                  aria-label="Download CSV"
                  @click="exportCsv"
                />
              </Tooltip>
              <CollectionPreferences
                v-bind="preferencesProps"
                title="Table preferences"
              />
            </div>
          </header>

          <Alert
            v-if="error"
            severity="danger"
          >
            {{ error }}
            <template #actions>
              <Button
                label="Retry"
                variant="secondary"
                size="small"
                @click="emit('retry', $event)"
              />
            </template>
          </Alert>

          <Card
            key="card-1"
            v-else-if="!loading && status === 'empty'"
            :padded="false"
          >
            <template #default>
              <EmptyState
                size="medium"
                icon="az az-history"
                title="No activity in this period"
                :description="
                  widerRange
                    ? 'Nothing happened in the account in the selected period. Select a longer period to see older events.'
                    : 'Nothing happened in the account in the last 90 days, the longest period events are kept.'
                "
              >
                <template
                  v-if="widerRange"
                  #actions
                >
                  <Button
                    :label="widenLabel"
                    variant="secondary"
                    size="small"
                    @click="widenRange"
                  />
                </template>
              </EmptyState>
            </template>
          </Card>

          <Card
            key="card-2"
            v-else
            :padded="false"
          >
            <template #default>
              <DataTable
                ref="activityTableEl"
                v-bind="tableProps"
                :loading="loading"
                sortable
                :bordered="false"
                aria-label="Activity history"
              >
                <template #cell-category="{ value }">
                  <Tag
                    :label="value"
                    :icon="categoryIcons[value as ActivityHistoryCategory] ?? 'az az-tag'"
                    severity="neutral"
                    size="small"
                  />
                </template>
                <template #cell-event="{ row, value }">
                  <div class="flex min-w-0 flex-col">
                    <span class="truncate">{{ value }}</span>
                    <div
                      aria-hidden="true"
                      data-slot="narrow-summary"
                      class="mt-(--spacing-2xs) flex min-w-0 flex-col gap-(--spacing-2xs) sm:hidden"
                    >
                      <span
                        class="truncate text-body-xs text-(--text-muted)"
                        dir="auto"
                        >{{ row.user }}</span
                      >
                      <TableCellTime :value="row.at" />
                    </div>
                  </div>
                </template>
                <template #cell-user="{ value }">
                  <span
                    class="truncate"
                    dir="auto"
                    >{{ value }}</span
                  >
                </template>
                <template #cell-ip="{ value }">
                  <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
                    <span
                      class="min-w-0 flex-1 truncate tabular-nums"
                      dir="ltr"
                      >{{ value }}</span
                    >
                    <CopyButton
                      variant="outline"
                      :value="value"
                      aria-label="Copy IP address"
                      size="small"
                    />
                  </div>
                </template>
                <template #cell-at="{ value }">
                  <TableCellTime :value="value" />
                </template>
                <template #empty>
                  <EmptyState
                    size="small"
                    icon="az az-search"
                    title="No matching events"
                    description="No event in this period matches these filters."
                  >
                    <template #actions>
                      <Button
                        label="Clear filters"
                        variant="outline"
                        size="small"
                        @click="clearFilters"
                      />
                    </template>
                  </EmptyState>
                </template>
                <template #footer>
                  <DataTablePagination
                    v-bind="paginationProps"
                    manual
                  />
                </template>
              </DataTable>
            </template>
          </Card>
        </section>
      </div>
    </div>
  </ConfigProvider>
</template>
```

## `sample.ts`

```ts
import type { ActivityHistoryEvent } from './account-activity-history.vue'

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

export const sampleNow = new Date(Date.UTC(2026, 10, 10, 12))
const ago = (ms: number) => new Date(sampleNow.getTime() - ms)

export const sampleEvents: ActivityHistoryEvent[] = [
  {
    id: 'evt-1048',
    event: 'Signed in',
    category: 'Sign-in',
    user: 'grace.hall@example.com',
    ip: '203.0.113.24',
    at: ago(25 * MINUTE)
  },
  {
    id: 'evt-1047',
    event: 'Revoked personal token “Nightly export”',
    category: 'Security',
    user: 'grace.hall@example.com',
    ip: '203.0.113.24',
    at: ago(3 * HOUR)
  },
  {
    id: 'evt-1046',
    event: 'Deployed storefront to Production',
    category: 'Deploy',
    user: 'jonas.weber@example.com',
    ip: '198.51.100.7',
    at: ago(9 * HOUR)
  },
  {
    id: 'evt-1045',
    event: 'Changed the role of henry.young@example.com to Admin',
    category: 'Users',
    user: 'grace.hall@example.com',
    ip: '203.0.113.24',
    at: ago(1 * DAY + 2 * HOUR)
  },
  {
    id: 'evt-1044',
    event: 'Turned on multi-factor authentication',
    category: 'Security',
    user: 'henry.young@example.com',
    ip: '192.0.2.61',
    at: ago(2 * DAY)
  },
  {
    id: 'evt-1043',
    event: 'Updated the billing email',
    category: 'Billing',
    user: 'grace.hall@example.com',
    ip: '203.0.113.24',
    at: ago(3 * DAY)
  },
  {
    id: 'evt-1042',
    event: 'Failed sign-in: wrong authentication code',
    category: 'Sign-in',
    user: 'jonas.weber@example.com',
    ip: '198.51.100.90',
    at: ago(4 * DAY + 5 * HOUR)
  },
  {
    id: 'evt-1041',
    event: 'Invited lee.park@example.com to the team Developers',
    category: 'Users',
    user: 'henry.young@example.com',
    ip: '192.0.2.61',
    at: ago(6 * DAY)
  },
  {
    id: 'evt-1040',
    event: 'Created personal token “Deploy pipeline”',
    category: 'Security',
    user: 'grace.hall@example.com',
    ip: '203.0.113.24',
    at: ago(12 * DAY)
  },
  {
    id: 'evt-1039',
    event: 'Changed the plan from Free to Pro',
    category: 'Billing',
    user: 'grace.hall@example.com',
    ip: '203.0.113.24',
    at: ago(21 * DAY)
  }
]
```
