<script setup lang="ts">
  import DataTable, { type TableColumn, type TableExposed } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { ref } from 'vue'

  import {
    eventLevelSeverity,
    type EventRow,
    formatFieldValue,
    statusSeverity
  } from '../lib/event-log'
  import type { EventsExplorerEventLevel, EventsExplorerField } from '../view-events-explorer.vue'

  export interface EventsTableProps {
    /** The matching events. */
    events: EventRow[]
    /** The columns of the table. */
    columns: TableColumn[]
    /** The shown fields without a cell of their own. */
    genericColumns: EventsExplorerField[]
    /** The Status field, when the events have one. */
    statusField?: EventsExplorerField
    /** Id of the open event. */
    selectedKey: string
    /** Time, Level and Source fold into the Event cell. */
    compact: boolean
    /** Every event that matches on the server. */
    total?: number
    /** More events exist after the last one. */
    moreRows: boolean
    /** The next events are loading. */
    loadingMore: boolean
    /** The table shows its loading rows. */
    loading: boolean
    /** No event exists at all. */
    noTraffic: boolean
    /** A search is typed. */
    searching: boolean
    /** Writes the clock time of the folded Event cell. */
    formatClock: (date: unknown) => string
  }

  withDefaults(defineProps<EventsTableProps>(), { statusField: undefined, total: undefined })

  const emit = defineEmits<{
    open: [event: MouseEvent | KeyboardEvent, row: EventRow]
    'load-more': [event: Event]
  }>()

  const page = defineModel<number>('page', { required: true })
  const pageSize = defineModel<number>('pageSize', { required: true })

  const { formatNumber } = useLocale()

  const tableEl = ref<TableExposed<EventRow> | null>(null)

  const STATUS_CELL_CLASS =
    'min-w-0 truncate text-label-code-sm tabular-nums text-(--text-default) ' +
    'data-[severity=danger]:text-(--danger-foreground) data-[severity=warning]:text-(--warning-foreground)'

  defineExpose({
    /** Downloads the log shown as CSV. */
    exportCsv: () => tableEl.value?.exportCsv({ filename: 'events.csv' })
  })
</script>

<template>
  <section class="flex min-h-0 min-w-0 flex-1 flex-col">
    <div class="flex min-h-0 flex-1">
      <DataTable
        ref="tableEl"
        v-model:page="page"
        v-model:page-size="pageSize"
        :data="events"
        :columns="columns"
        row-key="id"
        sortable
        paginated
        :manual-pagination="total !== undefined"
        :row-count="total"
        :more-rows="moreRows"
        :loading-more="loadingMore"
        :bordered="false"
        density="compact"
        max-height="100%"
        class="w-full"
        :loading="loading"
        @row-click="(event: MouseEvent | KeyboardEvent, row: EventRow) => emit('open', event, row)"
        @load-more="(event: Event) => emit('load-more', event)"
      >
        <template #header-detail>
          <span class="sr-only">Open the event document</span>
        </template>

        <template #cell-detail="{ row }">
          <IconButton
            :icon="row.id === selectedKey ? 'az az-chevron-down' : 'az az-chevron-right'"
            variant="ghost"
            size="small"
            :aria-label="`Open event ${row.id}`"
            :aria-expanded="row.id === selectedKey"
            @click.stop="emit('open', $event, row)"
          />
        </template>

        <template #cell-time="{ value }">
          <span class="min-w-0 truncate text-label-code-sm tabular-nums text-(--text-muted)">
            {{ value }}
          </span>
        </template>

        <template #cell-level="{ value }">
          <Tag
            :label="String(value)"
            :severity="eventLevelSeverity(value as EventsExplorerEventLevel)"
            size="small"
          />
        </template>

        <template #cell-message="{ value, row }">
          <div
            v-if="compact"
            class="flex min-w-0 flex-col gap-(--spacing-2xs) py-(--spacing-2xs)"
          >
            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
              <Tag
                :label="String(row.level)"
                :severity="eventLevelSeverity(row.level)"
                size="small"
                class="shrink-0"
              />
              <span class="shrink-0 text-label-code-sm tabular-nums text-(--text-muted)">{{
                formatClock(row.at)
              }}</span>
              <span class="min-w-0 truncate text-body-xs text-(--text-muted)">{{
                row.sourceLabel
              }}</span>
            </div>
            <span class="whitespace-normal break-words text-(--text-default)">{{ value }}</span>
          </div>
          <span
            v-else
            class="min-w-0 truncate text-(--text-default)"
            >{{ value }}</span
          >
        </template>

        <template #cell-status="{ value }">
          <span
            :class="STATUS_CELL_CLASS"
            :data-severity="statusSeverity(value)"
          >
            {{ formatFieldValue(statusField, value, formatNumber) }}
          </span>
        </template>

        <template
          v-for="field in genericColumns"
          :key="field.id"
          #[`cell-${field.id}`]="{ value }"
        >
          <span
            class="min-w-0 truncate text-(--text-default) data-mono:text-label-code-sm data-numeric:tabular-nums"
            :data-mono="field.mono || null"
            :data-numeric="field.align === 'end' || null"
          >
            {{ formatFieldValue(field, value, formatNumber) }}
          </span>
        </template>

        <template #empty>
          <EmptyState
            v-if="noTraffic"
            key="no-traffic"
            size="small"
            icon="az az-inbox"
            title="No events yet"
            description="Events appear here as soon as traffic reaches this workspace's resources."
          />
          <EmptyState
            v-else-if="searching"
            key="no-match"
            size="small"
            icon="az az-search"
            title="No events match this search"
            description="Clear the search, or widen the period to cover more of the log."
          />
          <EmptyState
            v-else
            key="no-events"
            size="small"
            icon="az az-filter-off"
            title="No events in this window"
            description="Widen the period or clear a filter to see more of the log."
          />
        </template>
      </DataTable>
    </div>
  </section>
</template>
