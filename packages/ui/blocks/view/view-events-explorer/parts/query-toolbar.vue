<script setup lang="ts">
  import DateRangePicker from '@aziontech/webkit/date-range-picker'
  import IconButton from '@aziontech/webkit/icon-button'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Select from '@aziontech/webkit/select'
  import Tooltip from '@aziontech/webkit/tooltip'

  import type { UseEventQueryReturn } from '../composables/use-event-query'
  import type { UseEventQueryRangeReturn } from '../composables/use-event-query-range'
  import type { UseSavedQueriesReturn } from '../composables/use-saved-queries'
  import { queryProperties, timeZones, zoneLabel } from '../lib/event-query'
  import RecentQueries from './recent-queries.vue'
  import SavedQueries from './saved-queries.vue'

  export interface QueryToolbarProps {
    /** The time range and its bridge to the Period filter. */
    timeRange: UseEventQueryRangeReturn
    /** The typed query and its history. */
    eventQuery: UseEventQueryReturn
    /** The saved and recent queries popovers. */
    savedQueries: UseSavedQueriesReturn
    /** A refresh is in flight. */
    loading?: boolean
    /** Nothing to export. */
    exportDisabled?: boolean
  }

  const props = withDefaults(defineProps<QueryToolbarProps>(), {
    loading: false,
    exportDisabled: false
  })

  const emit = defineEmits<{
    refresh: []
    export: []
  }>()

  const timeZone = defineModel<string>('timeZone', { required: true })
  const refreshInterval = defineModel<number>('refreshInterval', { required: true })

  const { range, relativeOptions, rangeNow, rangeMin } = props.timeRange
  const { queryText, queryNotice, matchedCount, recentQueries, submitQuery } = props.eventQuery
  const {
    savedQueries: savedEntries,
    savedOpen,
    recentOpen,
    saveName,
    savedStatus,
    canSave,
    saveQuery,
    deleteSavedQuery,
    applySavedQuery,
    applyRecentQuery,
    clearRecentQueries
  } = props.savedQueries

  const setTimeZone = (zone: string | undefined) => {
    if (zone) timeZone.value = zone
  }

  const QUERY_CLASS =
    'order-last flex min-w-0 basis-full @3xl/query-toolbar:order-none @3xl/query-toolbar:min-w-36 ' +
    '@3xl/query-toolbar:flex-1 @3xl/query-toolbar:basis-(--container-xs)'
</script>

<template>
  <header class="@container/query-toolbar">
    <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
      <div class="flex shrink-0 items-center">
        <DateRangePicker
          v-model="range"
          v-model:time-zone="timeZone"
          v-model:refresh-interval="refreshInterval"
          :relative-options="relativeOptions"
          :now="rangeNow"
          :min="rangeMin"
          :max="rangeNow"
          show-step
          aria-label="Events time range"
          data-testid="events-range"
          @refresh="emit('refresh')"
        />
      </div>
      <div class="flex shrink-0 items-center">
        <Select
          :model-value="timeZone"
          :display-value="zoneLabel"
          size="medium"
          variant="ghost"
          aria-label="Time zone"
          data-testid="events-time-zone"
          @update:model-value="setTimeZone"
        >
          <Select.Trigger>
            <template #leading>
              <i
                class="az az-globe text-(--text-muted)"
                aria-hidden="true"
              />
            </template>
          </Select.Trigger>
          <Select.Content>
            <Select.Item
              v-for="zone in timeZones"
              :key="zone"
              :value="zone"
            >
              {{ zoneLabel(zone) }}
            </Select.Item>
          </Select.Content>
        </Select>
      </div>
      <div :class="QUERY_CLASS">
        <PropertyFilter
          v-model:text="queryText"
          mode="query"
          :properties="queryProperties"
          :total-count="matchedCount"
          aria-label="Query events"
          placeholder="Query events, for example status >= 500 AND host = example.com"
          data-testid="events-query"
          @submit="submitQuery"
        />
      </div>
      <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
        <SavedQueries
          v-model:open="savedOpen"
          v-model:name="saveName"
          :entries="savedEntries"
          :status="savedStatus"
          :can-save="canSave"
          @apply="applySavedQuery"
          @delete="deleteSavedQuery"
          @save="saveQuery"
        />
        <RecentQueries
          v-model:open="recentOpen"
          :entries="recentQueries"
          @apply="applyRecentQuery"
          @clear="clearRecentQueries"
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
            data-testid="refresh-button"
            @click="emit('refresh')"
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
            :disabled="exportDisabled"
            aria-label="Download CSV"
            data-testid="export-button"
            @click="emit('export')"
          />
        </Tooltip>
      </div>
    </div>
  </header>

  <p
    role="status"
    class="text-body-sm text-(--danger-foreground) empty:hidden"
    data-testid="query-notice"
  >
    {{ queryNotice }}
  </p>
</template>
