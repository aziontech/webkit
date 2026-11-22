<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import type { TableColumn } from '@aziontech/webkit/data-table'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import type { FilterMenuModel, FilterMenuValue } from '@aziontech/webkit/filter-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Resizable from '@aziontech/webkit/resizable'
  import Tooltip from '@aziontech/webkit/tooltip'
  import type { TraceSpan, TraceView } from '@aziontech/webkit/trace'
  import { computed, ref } from 'vue'

  import { useEventsExplorerColumns } from './composables/use-events-explorer-columns'
  import { useEventsExplorerDocument } from './composables/use-events-explorer-document'
  import { useEventsExplorerFormat } from './composables/use-events-explorer-format'
  import {
    defaultFieldsWidth,
    useEventsExplorerLayout
  } from './composables/use-events-explorer-layout'
  import { useEventsExplorerLog } from './composables/use-events-explorer-log'
  import { useEventsExplorerSelection } from './composables/use-events-explorer-selection'
  import { useEventsExplorerVolume } from './composables/use-events-explorer-volume'
  import EventDocument from './parts/event-document.vue'
  import EventsTable from './parts/events-table.vue'
  import EventsToolbar from './parts/events-toolbar.vue'
  import FieldsPanel from './parts/fields-panel.vue'
  import FilterChips from './parts/filter-chips.vue'
  import LogSummary from './parts/log-summary.vue'

  /** Severity of an event; it colors the level tag and stacks the volume chart. */
  export type EventsExplorerEventLevel = 'Error' | 'Warning' | 'Info' | 'Debug'

  /** One event of the log. */
  export interface EventsExplorerEvent {
    /** Stable key of the event. */
    id: string
    /** When the event happened; the Time column, the period filter and the chart read it. */
    at: Date
    /** Source key: http, security, services or access (any other key shows as written). */
    source: string
    /** Severity of the event. */
    level: EventsExplorerEventLevel
    /** One-line description, the Event column and the heading of the document. */
    message: string
    /** Spans of the request the event records; when set, the document shows its trace. */
    spans?: TraceSpan[]
    /** Every other value, keyed by the id of a field in fields. */
    [field: string]: unknown
  }

  /** How a field value is written: a locale number, or a number of milliseconds. */
  export type EventsExplorerFieldFormat = 'number' | 'milliseconds'

  /** One field of the events: a table column, a row of the fields panel and a key of the document. */
  export interface EventsExplorerField {
    /** Key of the value on each event; time and sourceLabel are derived from at and source. */
    id: string
    /** Column header and fields panel label. */
    label: string
    /** Always shown and locked in the fields panel. */
    core?: boolean
    /** The principal column of the table. */
    principal?: boolean
    /** Id of the category that groups the field in the fields panel while it is hidden. */
    category?: string
    /** Share of the spare width the column takes. */
    grow?: TableColumn['grow']
    /** Narrowest width of the column, in pixels. */
    minWidth?: number
    /** Alignment of the column; end for numbers. */
    align?: TableColumn['align']
    /** Writes the value in the code font. */
    mono?: boolean
    /** How the value is written. */
    format?: EventsExplorerFieldFormat
  }

  /** A group of hidden fields in the fields panel. */
  export interface EventsExplorerFieldCategory {
    /** Key the fields name in their category. */
    id: string
    /** Heading of the group. */
    label: string
  }

  /** One bar of the volume chart. */
  export interface EventsExplorerBucket {
    /** Start of the bar. */
    at: Date
    /** End of the bar. */
    end: Date
    /** Events in the bar. */
    total: number
    /** Events in the bar per level. */
    levels: Record<string, number>
  }

  /** The numbers above the chart. */
  export interface EventsExplorerSummary {
    /** Events that match. */
    total: number
    /** Of them, events at the Error level. */
    errors: number
    /** Mean request time in milliseconds, or null when no event has one. */
    avgRequestTimeMs: number | null
  }

  /** Applied values per filter field; period holds the time range. */
  export type EventsExplorerFilters = FilterMenuModel

  /** One field of the open event, as the document lists it. */
  export interface EventsExplorerDocumentField {
    /** Id of the field. */
    id: string
    /** Label of the field. */
    label: string
    /** The value as written in the document. */
    value: string
    /** The value as the event holds it, the one a filter applies. */
    raw: FilterMenuValue
    /** The log can be filtered by this field. */
    filterable: boolean
  }

  export interface EventsExplorerProps {
    /** The events. Left out, the sample renders. Filtered, searched and paged in the browser unless total is set. */
    events?: EventsExplorerEvent[]
    /** The fields of the events, in order; the columns, the fields panel and the document follow them. Left out, the sample fields. */
    fields?: EventsExplorerField[]
    /** The categories of the fields panel, in order. Left out, derived from the fields. */
    categories?: EventsExplorerFieldCategory[]
    /** The volume chart bars. Left out, counted from the events in the period. */
    buckets?: EventsExplorerBucket[]
    /** The numbers above the chart. Left out, counted from the events that match. */
    summary?: EventsExplorerSummary
    /** Every event that matches on the server: events is then one page the server already filtered, and the pages follow page and pageSize. */
    total?: number
    /** The moment relative periods end at. Left out, the sample clock. */
    now?: Date
    /** More events exist after the last one; the table offers to load more. */
    moreRows?: boolean
    /** The next events are loading. */
    loadingMore?: boolean
    /** A request is in flight: skeletons hold the numbers and the chart, and the table shows its loading rows. */
    loading?: boolean
    /** Why the events could not load; a danger alert with Retry replaces the log. */
    error?: string
    /** IANA time zone the times, the chart and the period are written in. */
    timeZone?: string
    /** An extra test every event must pass besides the filters, such as a typed query. */
    match?: (event: EventsExplorerEvent) => boolean
  }

  const props = withDefaults(defineProps<EventsExplorerProps>(), {
    events: undefined,
    fields: undefined,
    categories: undefined,
    buckets: undefined,
    summary: undefined,
    total: undefined,
    now: undefined,
    moreRows: false,
    loadingMore: false,
    loading: false,
    error: '',
    timeZone: 'UTC',
    match: undefined
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    select: [event: MouseEvent | KeyboardEvent, record: EventsExplorerEvent]
    'load-more': [event: Event]
  }>()

  const filters = defineModel<EventsExplorerFilters>('filters', {
    default: () => ({ period: ['24h'] })
  })
  const search = defineModel<string>('search', { default: '' })
  const page = defineModel<number>('page', { default: 1 })
  const pageSize = defineModel<number>('pageSize', { default: 25 })
  const selectedKey = defineModel<string>('selectedKey', { default: '' })
  const exclusions = defineModel<EventsExplorerFilters>('exclusions', {
    default: () => ({})
  })

  defineSlots<{
    /** Replaces the controls row and the filter chips; exportCsv downloads the log shown. */
    toolbar?(props: { exportCsv: () => void; exportDisabled: boolean }): unknown
    /** Replaces the fields of the open event in its document. */
    'document-fields'?(props: {
      event: EventsExplorerEvent
      fields: EventsExplorerDocumentField[]
    }): unknown
  }>()

  const format = useEventsExplorerFormat(() => props.timeZone)
  const log = useEventsExplorerLog(props, { filters, exclusions, search, page }, format)
  const { matchedEvents, eventFields, eventFieldCategories, menuFields, exclusionChips } = log
  const volume = useEventsExplorerVolume(props, filters, matchedEvents, log.nowDate, format)

  const fieldsOpen = ref(true)
  const fieldsWidth = ref(defaultFieldsWidth)
  const documentWidth = ref(400)
  const explorerEl = ref<HTMLElement | null>(null)
  const { showFieldsPanel, isWide } = useEventsExplorerLayout({
    fieldsOpen,
    fieldsWidth,
    documentWidth,
    explorerEl
  })
  const compactLog = computed(() => !isWide.value)

  const { shownColumns, toggleColumn, columns, genericColumns } = useEventsExplorerColumns(
    log,
    compactLog
  )

  const selection = useEventsExplorerSelection(selectedKey, matchedEvents, isWide, (event, row) =>
    emit('select', event, log.sourceEvents.value.find((record) => record.id === row.id) ?? row)
  )
  const { documentEvent, documentDrawerOpen, documentPaneExpanded, closeDocument } = selection
  const { documentFields, documentRows, documentTabs } = useEventsExplorerDocument(
    log,
    selection.selectedEvent,
    documentEvent,
    format
  )
  const traceView = ref<TraceView>('waterfall')

  const tableEl = ref<InstanceType<typeof EventsTable> | null>(null)
  const exportCsv = () => tableEl.value?.exportCsv()

  const noTraffic = computed(() => !log.serverMode.value && !log.sourceEvents.value.length)
</script>

<template>
  <div
    data-layout-fill
    class="flex h-dvh min-h-0 flex-col"
  >
    <header
      class="flex shrink-0 flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-lg) py-(--spacing-sm)"
    >
      <slot
        name="toolbar"
        :export-csv="exportCsv"
        :export-disabled="!tableEl"
      >
        <EventsToolbar
          v-model:filters="filters"
          v-model:search="search"
          :menu-fields="menuFields"
          :time-zone="timeZone"
          :loading="loading"
          :export-disabled="!tableEl"
          @refresh="(event: MouseEvent) => emit('refresh', event)"
          @export="exportCsv"
        />

        <FilterChips
          v-model:filters="filters"
          :menu-fields="menuFields"
          :exclusion-chips="exclusionChips"
          @remove-exclusion="log.removeExclusion"
        />
      </slot>
    </header>

    <section
      ref="explorerEl"
      class="animate-content-enter motion-reduce:animate-none relative flex min-h-0 min-w-0 flex-1 overflow-hidden"
    >
      <Resizable
        orientation="horizontal"
        aria-label="Events explorer"
        class="min-h-0 min-w-0 flex-1"
      >
        <Resizable.Pane aria-label="Events">
          <div class="flex h-full min-h-0 min-w-0 flex-1">
            <div
              v-if="showFieldsPanel"
              key="fields-panel"
              class="contents [--sidebar-width:var(--container-2xs)]"
            >
              <FieldsPanel
                v-model:filters="filters"
                v-model:open="fieldsOpen"
                v-model:width="fieldsWidth"
                :fields="eventFields"
                :categories="eventFieldCategories"
                :events="matchedEvents"
                :shown-columns="shownColumns"
                @toggle-column="toggleColumn"
              />
            </div>

            <div
              v-if="error"
              class="flex min-w-0 flex-1 flex-col overflow-hidden p-(--spacing-md)"
            >
              <Alert
                severity="danger"
                :label="error"
                action-label="Retry"
                @action="(event: MouseEvent) => emit('retry', event)"
              />
            </div>
            <div
              v-else
              class="flex min-w-0 flex-1 flex-col overflow-hidden"
            >
              <LogSummary
                :loading="loading"
                :summary="volume.summary.value"
                :error-share-label="volume.errorShareLabel.value"
                :series="volume.volumeSeries.value"
                :labels="volume.volumeLabels.value"
                :format-label="format.formatEventClock"
                :chart-label="volume.chartLabel.value"
                @select-range="volume.selectVolume"
              />

              <EventsTable
                ref="tableEl"
                v-model:page="page"
                v-model:page-size="pageSize"
                :events="matchedEvents"
                :columns="columns"
                :generic-columns="genericColumns"
                :status-field="log.eventField('status')"
                :selected-key="selectedKey"
                :compact="compactLog"
                :total="total"
                :more-rows="moreRows"
                :loading-more="loadingMore"
                :loading="loading"
                :no-traffic="noTraffic"
                :searching="Boolean(search.trim())"
                :format-clock="format.formatEventClockSeconds"
                @open="selection.openDocument"
                @load-more="(event: Event) => emit('load-more', event)"
              />
            </div>
          </div>
        </Resizable.Pane>
        <Resizable.Handle
          v-if="documentPaneExpanded"
          aria-label="Resize the event panel"
        />
        <Resizable.Pane
          v-model:basis="documentWidth"
          v-model:open="documentPaneExpanded"
          collapsible
          :min="320"
          :max="512"
          aria-label="Event document"
        >
          <aside
            :inert="!documentPaneExpanded"
            aria-labelledby="event-document-title"
            class="flex h-full min-h-0 min-w-0 flex-col border-s border-(--border-default) bg-(--bg-surface)"
          >
            <div
              class="flex items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
            >
              <h2
                id="event-document-title"
                class="min-w-0 truncate text-heading-2xs text-(--text-default)"
              >
                Event
              </h2>
              <Tooltip content="Close">
                <IconButton
                  icon="az az-x"
                  variant="ghost"
                  size="small"
                  aria-label="Close the event document"
                  @click="closeDocument"
                />
              </Tooltip>
            </div>
            <div class="min-h-0 flex-1 overflow-y-auto">
              <div
                v-if="documentEvent"
                class="min-w-0"
              >
                <EventDocument
                  v-model:trace-view="traceView"
                  :event="documentEvent"
                  :fields="documentFields"
                  :rows="documentRows"
                  :tabs="documentTabs"
                >
                  <template
                    v-if="$slots['document-fields']"
                    #document-fields="fieldsSlot"
                  >
                    <slot
                      name="document-fields"
                      v-bind="fieldsSlot"
                    />
                  </template>
                </EventDocument>
              </div>
            </div>
          </aside>
        </Resizable.Pane>
      </Resizable>
    </section>

    <Drawer
      v-model:open="documentDrawerOpen"
      size="large"
      side="end"
    >
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>Event</DrawerTitle>
        </PanelHeader>
        <div class="min-h-0 flex-1 overflow-auto">
          <EventDocument
            v-if="documentEvent"
            v-model:trace-view="traceView"
            :event="documentEvent"
            :fields="documentFields"
            :rows="documentRows"
            :tabs="documentTabs"
          >
            <template
              v-if="$slots['document-fields']"
              #document-fields="fieldsSlot"
            >
              <slot
                name="document-fields"
                v-bind="fieldsSlot"
              />
            </template>
          </EventDocument>
        </div>
      </DrawerContent>
    </Drawer>
  </div>
</template>
