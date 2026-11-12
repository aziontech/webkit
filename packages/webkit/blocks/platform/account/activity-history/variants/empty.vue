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
    amount: 15,
    unit: 'minute',
    key: 'last-15-minutes'
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
