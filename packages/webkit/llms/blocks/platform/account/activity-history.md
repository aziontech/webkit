# ActivityHistory (`platform/account/activity-history`)

> The account's audit log: a `PageHeader` with Documentation over one controls row (`PropertyFilter` on event, category, user and IP address; a `DateRangePicker` for the period, last 30 days by default; Refresh, Download CSV and `CollectionPreferences`) and a `Table` of events, newest first: Event, Category as `Table.CellStatus`, User, IP address with a `CopyButton`, and Date as `Table.CellTime`. One `useCollection` holds filter, sort, page and saved preferences; the period narrows the items before it. An empty period offers a longer one, filters that match nothing offer Clear filters, and a failed load is a danger `Alert` with Retry. A page body for ConsoleLayout, rendered in its default slot.

- Surface: product
- Source: `blocks/platform/account/activity-history/activity-history.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/account/activity-history")`
- Components: [Alert](../../../components/alert.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [CollectionPreferences](../../../components/collection-preferences.md), [CopyButton](../../../components/copy-button.md), [DateRangePicker](../../../components/date-range-picker.md), [EmptyState](../../../components/empty-state.md), [IconButton](../../../components/icon-button.md), [PageHeader](../../../components/page-header.md), [PropertyFilter](../../../components/property-filter.md), [Table](../../../components/table.md), [Tooltip](../../../components/tooltip.md), `use-collection`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

activity history; audit log; audit trail; account activity; security log; who did what; user activity; event history; histórico de atividades; log de auditoria; trilha de auditoria; atividade da conta

The account's audit log. An admin or a security reviewer answers "who did this, from where, and when": a token that was revoked, a role that changed, a sign-in that failed, a plan that was upgraded. They narrow the log by period, category, person and address, read the newest events first, copy an IP address into another tool, and export what they found. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- The account or organisation audit log: sign-ins, security changes, member and role changes, billing changes, deploys.
- Any append-only list of events people search by who, what, where and when.

## When not to use

- Request logs or metrics explored over time with a chart: use `platform/view/split-view`.
- The deploy history of one resource: use `platform/detail/deployment-logs` or the details page's history tab.
- A short "recent activity" card on a dashboard: use `Item` rows in a `Card` and link here with View all.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Activity history` and one sentence that says what is logged and how long it is kept. The only action is the outlined Documentation button: the log is read-only.

### B. Filter — `PropertyFilter` (required)

Bound with `v-bind="propertyFilterProps"`. Properties: Event (free text), Category and User (with options), IP address. Free text searches every column.

### C. Period — `DateRangePicker` (required)

The period comes first in the reader's mind and is filtered before the collection: relative ranges (last 30 days by default) or absolute dates. It is a separate control because time is not a property token.

### D. Listing actions — `Tooltip`, `IconButton`, `CollectionPreferences` (required)

Refresh and Download CSV as outlined icon buttons in tooltips, then `CollectionPreferences` (page size 25, 50 or 100; columns), saved under `storageKey`.

### E. Event table — `Card`, `Table`, `CopyButton`, `useCollection` (required)

One `useCollection` over the events in the period, sorted by Date descending, `Table` bound with `v-bind="tableProps"` in a flush `Card`. Columns: Event (sentence in past tense naming the object), Category through `Table.CellStatus` with one severity per category, User, IP address (left to right, with a `CopyButton` named `Copy IP address`), and Date through `Table.CellTime` (relative, exact time on the tooltip).

### F. No match and empty period — `EmptyState` (required)

Filters that hide every event fill the table's `#empty` slot with `No matching events` and Clear filters. A period with no events at all replaces the table with `No activity in this period` and a button that widens it to the last 30 days.

### G. Load failure — `Alert` (conditional)

A danger `Alert` with Retry takes the table's place; the controls stay so the reader can change the period.

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
- **Empty period:** `No activity in this period`, then `Nothing happened in the account in the selected period. Pick a longer period to see older events.` and `Show the last 30 days`.
- **No match:** `No matching events`, `No event in this period matches these filters.`, `Clear filters`.
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- No `main` of its own (the layout's is the only one); the `PageHeader` title is the only `h1`; the table is named `Activity history`.
- The filter and the period picker carry `aria-label`s; icon buttons have names that match their tooltips.
- Category is text in a tag, never colour alone; the relative date has the exact time on its tooltip.
- User and IP cells keep their own direction (`dir="auto"`, `dir="ltr"`) inside a right-to-left page.

## States

- Default: ten events over three weeks, the last 30 days selected, with filter, period, refresh, export, preferences, sorting and paging wired.
- Empty: the last 15 minutes hold no event; a flush empty state offers the last 30 days.
- Loading: the first load; the controls and the table's loading rows.
- Failed: the log did not load; a danger Alert with Retry.

## Related

- `platform/view/table-view` — the list page this one follows.
- `platform/account/tokens` and `platform/account/team-permissions` — the screens whose changes are logged here.
- `platform/view/split-view` — events over time with a chart and a document pane.

## Variants

- `Default` — primary (the code below)
- `Empty` — No event in the selected period (the last 15 minutes): the controls stay, and a flush EmptyState offers Show the last 30 days.
- `Loading` — The first load: the controls and the table's loading rows.
- `Failed` — The log did not load: a danger Alert with Retry replaces the table; Retry loads the events.

Each variant is the same screen in another state: `get_pattern("platform/account/activity-history", { variant })`, or the file under `blocks/platform/account/activity-history/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import type { DateRangeUnit, DateRangeValue } from '@aziontech/webkit/date-range-picker'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Table, { type TableColumn } from '@aziontech/webkit/table'
  import type { TagSeverity } from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref } from 'vue'

  const MINUTE = 60_000
  const HOUR = 60 * MINUTE
  const DAY = 24 * HOUR
  const referenceTime = Date.UTC(2026, 10, 10, 12)
  const ago = (ms: number) => new Date(referenceTime - ms)

  type ActivityCategory = 'Sign-in' | 'Security' | 'Deploy' | 'Users' | 'Billing'

  interface ActivityEvent {
    id: string
    event: string
    category: ActivityCategory
    user: string
    ip: string
    at: Date
  }

  const seedEvents: ActivityEvent[] = [
    {
      id: 'evt-1048',
      event: 'Signed in',
      category: 'Sign-in',
      user: 'ana.silva@example.com',
      ip: '203.0.113.24',
      at: ago(25 * MINUTE)
    },
    {
      id: 'evt-1047',
      event: 'Revoked personal token “Nightly export”',
      category: 'Security',
      user: 'ana.silva@example.com',
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
      event: 'Changed the role of maria.costa@example.com to Admin',
      category: 'Users',
      user: 'ana.silva@example.com',
      ip: '203.0.113.24',
      at: ago(1 * DAY + 2 * HOUR)
    },
    {
      id: 'evt-1044',
      event: 'Turned on multi-factor authentication',
      category: 'Security',
      user: 'maria.costa@example.com',
      ip: '192.0.2.61',
      at: ago(2 * DAY)
    },
    {
      id: 'evt-1043',
      event: 'Updated the billing email',
      category: 'Billing',
      user: 'ana.silva@example.com',
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
      user: 'maria.costa@example.com',
      ip: '192.0.2.61',
      at: ago(6 * DAY)
    },
    {
      id: 'evt-1040',
      event: 'Created personal token “Deploy pipeline”',
      category: 'Security',
      user: 'ana.silva@example.com',
      ip: '203.0.113.24',
      at: ago(12 * DAY)
    },
    {
      id: 'evt-1039',
      event: 'Changed the plan from Free to Pro',
      category: 'Billing',
      user: 'ana.silva@example.com',
      ip: '203.0.113.24',
      at: ago(21 * DAY)
    }
  ]

  const events = ref(seedEvents)

  const categorySeverity = (category: ActivityCategory): TagSeverity =>
    (
      ({
        'Sign-in': 'info',
        Security: 'warning',
        Deploy: 'success',
        Users: 'secondary',
        Billing: 'primary'
      }) as const
    )[category] ?? 'secondary'

  const range = ref<DateRangeValue>({
    type: 'relative',
    amount: 30,
    unit: 'day',
    key: 'last-30-days'
  })
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
    const span = (value?.amount ?? 30) * (UNIT_MS[value?.unit] ?? DAY)
    return { start: referenceTime - span, end: Number.POSITIVE_INFINITY }
  })
  const inRange = computed(() =>
    events.value.filter((entry) => {
      const time = entry.at.getTime()
      return time >= period.value.start && time <= period.value.end
    })
  )

  const optionsOf = (key: 'category' | 'user') =>
    [...new Set(seedEvents.map((entry) => entry[key]))].sort().map((value) => ({ value }))

  const properties: FilteringProperty[] = [
    { key: 'event', label: 'Event' },
    { key: 'category', label: 'Category', options: optionsOf('category') },
    { key: 'user', label: 'User', options: optionsOf('user') },
    { key: 'ip', label: 'IP address' }
  ]

  const columns: TableColumn[] = [
    { accessorKey: 'event', header: 'Event', principal: true, hideable: false, grow: 2 },
    { accessorKey: 'category', header: 'Category', enableSorting: true, minWidth: 120 },
    { accessorKey: 'user', header: 'User', enableSorting: true, minWidth: 200 },
    { accessorKey: 'ip', header: 'IP address', minWidth: 150 },
    { accessorKey: 'at', header: 'Date', enableSorting: true, minWidth: 150 }
  ]

  const { tableProps, propertyFilterProps, preferencesProps, status, matchingItems, clearFilters } =
    useCollection({
      items: inRange,
      columns,
      filtering: { fields: ['event', 'category', 'user', 'ip'] },
      propertyFiltering: { properties },
      sorting: { defaultState: [{ id: 'at', desc: true }] },
      pagination: { pageSize: 25, pageSizeOptions: [25, 50, 100] },
      preferences: { storageKey: 'activity-history' }
    })

  const loading = ref(false)
  const loadFailed = ref(false)
  const load = () => {
    loadFailed.value = false
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const activityTable = ref<{ exportCsv: (options: { filename: string }) => Promise<void> } | null>(
    null
  )
  const exportCsv = () => activityTable.value?.exportCsv({ filename: 'activity-history.csv' })

  const widenRange = () => {
    range.value = { type: 'relative', amount: 30, unit: 'day', key: 'last-30-days' }
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col">
      <PageHeader
        title="Activity history"
        description="Who did what in this account, from where and when. Events are kept for 90 days."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
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
              aria-label="Activity period"
              :show-time-zone="false"
            />
            <Tooltip
              text="Refresh"
              class="shrink-0"
            >
              <IconButton
                icon="pi pi-refresh"
                kind="outlined"
                size="medium"
                :loading="loading"
                aria-label="Refresh"
                @click="load"
              />
            </Tooltip>
            <Tooltip
              text="Download CSV"
              class="shrink-0"
            >
              <IconButton
                icon="pi pi-download"
                kind="outlined"
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
          v-if="loadFailed"
          severity="danger"
        >
          The activity could not be loaded. Nothing was changed; try again.
          <template #action>
            <Button
              label="Retry"
              kind="secondary"
              size="small"
              @click="load"
            />
          </template>
        </Alert>

        <Card
          key="card-1"
          v-else-if="!loading && status === 'empty'"
          :padded="false"
        >
          <template #content>
            <EmptyState
              size="medium"
              icon="pi pi-history"
              title="No activity in this period"
              description="Nothing happened in the account in the selected period. Pick a longer period to see older events."
            >
              <template #actions>
                <Button
                  label="Show the last 30 days"
                  kind="secondary"
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
          <template #content>
            <Table
              ref="activityTable"
              v-bind="tableProps"
              :loading="loading"
              enable-sorting
              :bordered="false"
              aria-label="Activity history"
            >
              <template #cell-category="{ value }">
                <Table.CellStatus
                  :label="value"
                  :severity="categorySeverity(value)"
                />
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
                    kind="outlined"
                    :value="value"
                    aria-label="Copy IP address"
                  />
                </div>
              </template>
              <template #cell-at="{ value }">
                <Table.CellTime :value="value" />
              </template>
              <template #empty>
                <EmptyState
                  size="small"
                  icon="pi pi-search"
                  title="No matching events"
                  description="No event in this period matches these filters."
                >
                  <template #actions>
                    <Button
                      label="Clear filters"
                      kind="outlined"
                      size="small"
                      @click="clearFilters"
                    />
                  </template>
                </EmptyState>
              </template>
            </Table>
          </template>
        </Card>
      </section>
    </div>
  </div>
</template>
```
