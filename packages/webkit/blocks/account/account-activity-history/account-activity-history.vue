<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DataTable from '@aziontech/webkit/data-table'
  import type {
    DateRangeUnit,
    DateRangeValue,
    RelativeOption
  } from '@aziontech/webkit/date-range-picker'
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tag, { type TagSeverity, type TagVariant } from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
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
    /** The moment relative periods count back from. Left out, the sample clock is used. */
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

  const categorySeverity = (category: ActivityHistoryCategory): TagSeverity | undefined =>
    category === 'Billing'
      ? undefined
      : ((
          {
            'Sign-in': 'info',
            Security: 'warning',
            Deploy: 'success',
            Users: 'neutral'
          } as const
        )[category] ?? 'neutral')

  const categoryVariant = (category: ActivityHistoryCategory): TagVariant | undefined =>
    category === 'Billing' ? 'primary' : undefined

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
    { accessorKey: 'event', header: 'Event', principal: true, hideable: false, grow: 2 },
    { accessorKey: 'category', header: 'Category', sortable: true, minWidth: 120 },
    { accessorKey: 'user', header: 'User', sortable: true, minWidth: 200 },
    { accessorKey: 'ip', header: 'IP address', minWidth: 150 },
    { accessorKey: 'at', header: 'Date', sortable: true, minWidth: 150 }
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
  <div class="layout-boundary">
    <div class="layout-column flex flex-col">
      <PageHeader
        title="Activity history"
        description="Who did what in this account, from where and when. Events are kept for 90 days."
      >
        <template #actions>
          <Button
            label="Documentation"
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
                  :variant="categoryVariant(value)"
                  :severity="categorySeverity(value)"
                  size="small"
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
            </DataTable>
          </template>
        </Card>
      </section>
    </div>
  </div>
</template>
