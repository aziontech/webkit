<script setup>
  import Accordion from '@aziontech/webkit/accordion'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Sidebar from '@aziontech/webkit/sidebar'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

  import ExportButton from '../../components/list/ExportButton.vue'
  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import EventDocument from '../../components/observability/EventDocument.vue'
  import EventFieldRow from '../../components/observability/EventFieldRow.vue'
  import EventVolumeChart from '../../components/observability/EventVolumeChart.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { useListFilters } from '../../lib/behavior/list-state'
  import {
    CORE_EVENT_FIELDS,
    countFieldValues,
    DEFAULT_EVENT_COLUMNS,
    DEFAULT_PERIOD,
    EVENT_FIELD_CATEGORIES,
    EVENT_FIELDS,
    EVENT_PERIODS,
    eventBuckets,
    eventField,
    eventLevelOptions,
    eventLevelSeverity,
    eventSourceOptions,
    eventSummary,
    fieldValueCounts,
    formatEventValue,
    formatPeriod,
    matchPeriod,
    OPTIONAL_EVENT_FIELDS,
    periodRange,
    REAL_TIME_EVENTS,
    searchEvents
  } from '../../lib/data/real-time-events'
  import { tenancyRows } from '../../lib/state/tenancy-scope'

  const events = ref([...REAL_TIME_EVENTS])

  const scopedEvents = computed(() => tenancyRows(events.value, 'real-time-events'))

  const BASE_FILTER_FIELDS = [
    {
      id: 'period',
      label: 'Period',
      kind: 'range',
      options: EVENT_PERIODS,
      formatValue: formatPeriod,
      match: (event, values) => matchPeriod(event.at, values)
    },
    {
      id: 'source',
      label: 'Source',
      kind: 'options',
      options: eventSourceOptions,
      match: (event, values) => values.includes(event.source)
    },
    {
      id: 'level',
      label: 'Level',
      kind: 'options',
      options: eventLevelOptions,
      match: (event, values) => values.includes(event.level)
    }
  ]

  const BASE_FILTER_IDS = new Set(BASE_FILTER_FIELDS.map((field) => field.id))

  const {
    filters,
    search,
    pagination,
    visibleRows: filteredEvents,
    loading,
    refresh: refreshList
  } = useListFilters(() => filterFields.value, scopedEvents, { pageSize: 25 })

  const tableRef = ref(null)

  const activeFieldIds = computed(() =>
    Object.keys(filters.value).filter((id) => !BASE_FILTER_IDS.has(id) && filters.value[id]?.length)
  )

  const filterFields = computed(() => [
    ...BASE_FILTER_FIELDS,
    ...activeFieldIds.value.map((id) => {
      const field = eventField(id)
      return {
        id,
        label: field?.label ?? id,
        kind: 'options',
        options: fieldValueCounts(scopedEvents.value, id).map(({ value }) => ({
          value,
          label: formatEventValue(field, value)
        })),
        match: (event, values) => values.includes(event[id])
      }
    })
  ])

  filters.value = { period: [DEFAULT_PERIOD] }

  const matchedEvents = computed(() => searchEvents(filteredEvents.value, search.value))

  watch(search, () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })

  const appliedPeriod = computed(() => filters.value.period?.[0] ?? '')

  const activeWindow = computed(() => periodRange(appliedPeriod.value))

  const windowLabel = computed(() => {
    const period = appliedPeriod.value
    if (period && typeof period === 'object') return formatPeriod(period)
    return EVENT_PERIODS.find((option) => option.value === period)?.label ?? 'Last 24 hours'
  })

  const selectTimeRange = ({ start, end }) => {
    filters.value = { ...filters.value, period: [{ start, end }] }
  }

  const buckets = computed(() => eventBuckets(matchedEvents.value, activeWindow.value))
  const summary = computed(() => eventSummary(matchedEvents.value))

  const errorShareLabel = computed(() =>
    summary.value.total ? `${(summary.value.errorShare * 100).toFixed(1)}% of events` : 'none'
  )

  const shownColumns = ref([...DEFAULT_EVENT_COLUMNS])
  const fieldsCollapsed = ref(false)
  const fieldSearch = ref('')

  const matchesFieldSearch = (field) => {
    const term = fieldSearch.value.trim().toLowerCase()
    if (!term) return true
    return field.label.toLowerCase().includes(term) || field.id.toLowerCase().includes(term)
  }

  const shownFields = computed(() => [
    ...CORE_EVENT_FIELDS.filter(matchesFieldSearch).map((field) => ({ ...field, locked: true })),
    ...OPTIONAL_EVENT_FIELDS.filter(
      (field) => shownColumns.value.includes(field.id) && matchesFieldSearch(field)
    )
  ])

  const fieldCategories = computed(() =>
    EVENT_FIELD_CATEGORIES.map((category) => ({
      ...category,
      fields: OPTIONAL_EVENT_FIELDS.filter(
        (field) =>
          field.category === category.id &&
          !shownColumns.value.includes(field.id) &&
          matchesFieldSearch(field)
      )
    })).filter((category) => category.fields.length)
  )

  const hasFieldMatches = computed(
    () => shownFields.value.length > 0 || fieldCategories.value.length > 0
  )

  const categoryFilterCount = (category) =>
    category.fields.filter((field) => filters.value[field.id]?.length).length

  const openCategories = ref(['request'])

  const collapsedBeforeSearch = ref(null)
  watch(fieldSearch, (term, previous) => {
    const searching = Boolean(term.trim())
    if (searching && !previous.trim()) collapsedBeforeSearch.value = [...openCategories.value]
    if (searching) {
      openCategories.value = fieldCategories.value.map((category) => category.id)
      return
    }
    openCategories.value = collapsedBeforeSearch.value ?? ['request']
    collapsedBeforeSearch.value = null
  })

  const fieldCounts = computed(() =>
    Object.fromEntries(
      EVENT_FIELDS.map((field) => [field.id, countFieldValues(matchedEvents.value, field.id)])
    )
  )

  const TOP_VALUES = 6

  const UNFILTERABLE_FIELDS = new Set(['time', 'sourceLabel'])

  const canFilterField = (field) => !UNFILTERABLE_FIELDS.has(field.id)

  const topFieldValues = (id) => fieldValueCounts(matchedEvents.value, id).slice(0, TOP_VALUES)

  const fieldValueOverflow = (id) =>
    Math.max(0, countFieldValues(matchedEvents.value, id) - TOP_VALUES)

  const toggleColumn = (id) => {
    shownColumns.value = shownColumns.value.includes(id)
      ? shownColumns.value.filter((shown) => shown !== id)
      : [...shownColumns.value, id]
  }

  const toggleFieldValue = (id, value) => {
    const current = filters.value[id] ?? []
    const next = current.includes(value)
      ? current.filter((applied) => applied !== value)
      : [...current, value]
    filters.value = { ...filters.value, [id]: next }
  }

  const toColumn = (field) => ({
    accessorKey: field.id,
    header: field.label,
    enableSorting: true,
    ...(field.principal ? { principal: true } : {}),
    ...(field.grow ? { grow: field.grow } : {}),
    ...(field.minWidth ? { minWidth: field.minWidth } : {}),
    ...(field.align ? { align: field.align } : {})
  })

  const columns = computed(() => [
    { id: 'detail', header: '', width: 44, align: 'center', hideable: false },
    ...CORE_EVENT_FIELDS.map(toColumn),
    ...OPTIONAL_EVENT_FIELDS.filter((field) => shownColumns.value.includes(field.id)).map(toColumn)
  ])

  const CUSTOM_CELL_FIELDS = ['status']
  const genericColumns = computed(() =>
    OPTIONAL_EVENT_FIELDS.filter(
      (field) => shownColumns.value.includes(field.id) && !CUSTOM_CELL_FIELDS.includes(field.id)
    )
  )

  const statusField = eventField('status')

  const statusTone = (status) => {
    if (typeof status !== 'number') return null
    if (status >= 500) return 'error'
    if (status >= 400) return 'warn'
    return 'ok'
  }

  const selectedId = ref('')
  const selectedEvent = computed(
    () => matchedEvents.value.find((event) => event.id === selectedId.value) ?? null
  )

  const LOG_MIN_WIDTH = 480
  const DOCUMENT_MIN_WIDTH = 348
  const FIELDS_PANEL_WIDTH = 268

  const explorerEl = ref(null)
  const explorerWidth = ref(0)
  let explorerObserver = null

  const showFieldsPanel = computed(
    () => explorerWidth.value === 0 || explorerWidth.value >= FIELDS_PANEL_WIDTH + LOG_MIN_WIDTH
  )

  const isWide = computed(
    () =>
      explorerWidth.value === 0 ||
      explorerWidth.value >= FIELDS_PANEL_WIDTH + LOG_MIN_WIDTH + DOCUMENT_MIN_WIDTH
  )

  const documentDrawerOpen = ref(false)

  onMounted(() => {
    if (!explorerEl.value) return
    explorerWidth.value = explorerEl.value.offsetWidth
    explorerObserver = new ResizeObserver(([entry]) => {
      explorerWidth.value = entry.contentRect.width
    })
    explorerObserver.observe(explorerEl.value)
  })

  watch(isWide, (wide) => {
    documentDrawerOpen.value = !wide && Boolean(selectedId.value)
  })

  const openDocument = (event, row) => {
    selectedId.value = row.id
    documentDrawerOpen.value = !isWide.value
  }

  const documentCollapsed = computed({
    get: () => !selectedEvent.value,
    set: (collapsed) => {
      if (collapsed) closeDocument()
    }
  })

  const closeDocument = () => {
    selectedId.value = ''
    documentDrawerOpen.value = false
  }

  watch(documentDrawerOpen, (open) => {
    if (!open && !isWide.value) selectedId.value = ''
  })

  const fieldsWidth = ref(FIELDS_PANEL_WIDTH)
  const documentWidth = ref(400)

  const documentMaxWidth = computed(() => {
    if (explorerWidth.value === 0) return Infinity
    const fieldsUsed = showFieldsPanel.value && !fieldsCollapsed.value ? fieldsWidth.value : 0
    return Math.max(DOCUMENT_MIN_WIDTH, explorerWidth.value - fieldsUsed - LOG_MIN_WIDTH)
  })

  watch(
    [documentMaxWidth, documentWidth],
    ([max, width]) => {
      if (width > max) documentWidth.value = max
    },
    { flush: 'sync' }
  )

  onBeforeUnmount(() => {
    explorerObserver?.disconnect()
  })

  const refresh = () => {
    refreshList()
    toast.info('Events refreshed.', { description: 'Live streaming is disabled in the demo.' })
  }
</script>

<template>
  <AppLayout
    active="real-time-events"
    :padded="false"
    :breadcrumb="[{ label: 'Real-Time Events' }]"
  >
    <main class="flex h-full min-h-0 flex-col">
      <header
        class="flex shrink-0 flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-lg) py-(--spacing-sm)"
      >
        <ControlsHeader>
          <FilterButton
            v-model="filters"
            :fields="filterFields"
            size="medium"
          />
          <InputText
            v-model="search"
            size="medium"
            placeholder="Search events, hosts, paths or addresses"
            aria-label="Search events"
            class="min-w-36 grow basis-(--container-2xs)"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>

          <template #actions>
            <RefreshButton
              :loading="loading"
              @refresh="refresh"
            />
            <ExportButton
              :table="tableRef"
              filename="events.csv"
            />
          </template>
        </ControlsHeader>

        <FilterChips
          v-model="filters"
          :fields="filterFields"
        />
      </header>

      <section
        ref="explorerEl"
        class="animate-content-enter motion-reduce:animate-none relative flex min-h-0 min-w-0 flex-1 overflow-hidden"
      >
        <Sidebar
          v-if="showFieldsPanel"
          key="fields-panel"
          v-model:collapsed="fieldsCollapsed"
          v-model:width="fieldsWidth"
          resizable
          collapsible
          aria-label="Fields"
          collapse-aria-label="Hide the fields panel"
          expand-aria-label="Show the fields panel"
          resize-aria-label="Resize the fields panel"
          class="[--sidebar-width:var(--container-2xs)]"
        >
          <template #header>
            <div class="px-(--spacing-xs)">
              <InputText
                v-model="fieldSearch"
                size="medium"
                class="w-full"
                placeholder="Search fields"
                aria-label="Search fields"
              >
                <template #iconLeft>
                  <i
                    class="pi pi-search"
                    aria-hidden="true"
                  />
                </template>
              </InputText>
            </div>
          </template>

          <div>
            <div
              class="flex items-baseline justify-between gap-(--spacing-xs) px-(--spacing-xs) pb-(--spacing-xxs) pt-(--spacing-xxs)"
            >
              <span class="text-label-sm text-(--text-muted)">Shown</span>
              <span class="text-label-sm text-(--text-muted)">Values</span>
            </div>

            <EventFieldRow
              v-for="field in shownFields"
              :key="field.id"
              :field="field"
              :count="fieldCounts[field.id]"
              shown
              :locked="field.locked"
              :filterable="canFilterField(field)"
              :values="topFieldValues(field.id)"
              :overflow="fieldValueOverflow(field.id)"
              :applied="filters[field.id] ?? []"
              @toggle-column="toggleColumn(field.id)"
              @toggle-value="(value) => toggleFieldValue(field.id, value)"
            />

            <Accordion
              v-if="fieldCategories.length"
              v-model:value="openCategories"
              type="multiple"
              size="medium"
              arrow-position="left"
              class="mt-(--spacing-xs)"
            >
              <Accordion.Item
                v-for="category in fieldCategories"
                :key="category.id"
                :value="category.id"
              >
                <Accordion.Trigger
                  class="gap-(--spacing-xs)! px-(--spacing-xs)! [&_i]:w-(--size-4) [&_i]:text-center"
                >
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <span class="truncate text-label-sm text-(--text-default)">
                      {{ category.label }}
                    </span>
                    <Tag
                      v-if="categoryFilterCount(category)"
                      :label="String(categoryFilterCount(category))"
                      severity="info"
                      size="small"
                    />
                  </span>
                </Accordion.Trigger>

                <Accordion.Content class="px-0!">
                  <EventFieldRow
                    v-for="field in category.fields"
                    :key="field.id"
                    :field="field"
                    :count="fieldCounts[field.id]"
                    :filterable="canFilterField(field)"
                    :values="topFieldValues(field.id)"
                    :overflow="fieldValueOverflow(field.id)"
                    :applied="filters[field.id] ?? []"
                    @toggle-column="toggleColumn(field.id)"
                    @toggle-value="(value) => toggleFieldValue(field.id, value)"
                  />
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>

            <p
              v-if="!hasFieldMatches"
              class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
            >
              No fields match "{{ fieldSearch }}".
            </p>
          </div>
        </Sidebar>

        <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
          <section
            class="flex shrink-0 flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
          >
            <div class="flex flex-wrap items-end gap-(--spacing-md)">
              <dl class="flex flex-wrap items-end gap-(--spacing-xl)">
                <div class="flex flex-col">
                  <dt class="text-label-sm text-(--text-muted)">Events</dt>
                  <dd class="m-0 text-heading-xs tabular-nums text-(--text-default)">
                    {{ summary.total.toLocaleString('en-US') }}
                  </dd>
                </div>
                <div class="flex flex-col">
                  <dt class="text-label-sm text-(--text-muted)">Errors</dt>
                  <dd
                    class="m-0 text-heading-xs tabular-nums text-(--text-default) data-raised:text-(--danger-contrast)"
                    :data-raised="summary.errors ? true : null"
                    :aria-label="`${summary.errors} errors, ${errorShareLabel}`"
                  >
                    {{ summary.errors.toLocaleString('en-US') }}
                  </dd>
                </div>
                <div class="flex flex-col">
                  <dt class="text-label-sm text-(--text-muted)">Avg request time</dt>
                  <dd class="m-0 text-heading-xs tabular-nums text-(--text-default)">
                    {{ summary.avgRequestTimeMs === null ? '—' : `${summary.avgRequestTimeMs} ms` }}
                  </dd>
                </div>
              </dl>
            </div>

            <EventVolumeChart
              :buckets="buckets"
              :window-label="windowLabel"
              @select-range="selectTimeRange"
            />
          </section>

          <section class="flex min-h-0 min-w-0 flex-1 flex-col">
            <TableRoot
              ref="tableRef"
              v-model:pagination="pagination"
              :data="matchedEvents"
              :columns="columns"
              row-key="id"
              enable-sorting
              paginated
              :page-size="25"
              :border="false"
              header-kind="compact"
              max-height="100%"
              class="log-table h-full"
              :loading="loading"
              @row-click="openDocument"
            >
              <template #header-detail>
                <span class="sr-only">Open the event document</span>
              </template>

              <template #cell-detail="{ row }">
                <i
                  class="pi pi-angle-right text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance data-open:rotate-90 data-open:text-(--primary) motion-reduce:transition-none"
                  :data-open="row.id === selectedId || null"
                  aria-hidden="true"
                />
              </template>

              <template #cell-time="{ value }">
                <span class="min-w-0 truncate text-label-code-sm tabular-nums text-(--text-muted)">
                  {{ value }}
                </span>
              </template>

              <template #cell-level="{ value }">
                <Tag
                  :label="value"
                  :severity="eventLevelSeverity(value)"
                  size="medium"
                />
              </template>

              <template #cell-message="{ value }">
                <span class="min-w-0 truncate text-(--text-default)">{{ value }}</span>
              </template>

              <template #cell-status="{ value }">
                <span
                  class="min-w-0 truncate text-label-code-sm tabular-nums text-(--text-default) data-[tone=error]:text-(--danger-contrast) data-[tone=warn]:text-(--warning-contrast)"
                  :data-tone="statusTone(value)"
                >
                  {{ formatEventValue(statusField, value) }}
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
                  {{ formatEventValue(field, value) }}
                </span>
              </template>

              <template #empty>
                <EmptyState
                  v-if="!scopedEvents.length"
                  key="no-traffic"
                  size="small"
                  icon="pi pi-inbox"
                  title="No events yet"
                  description="Events appear here as soon as traffic reaches this workspace's workloads."
                />
                <EmptyState
                  v-else-if="search.trim()"
                  key="no-match"
                  size="small"
                  icon="pi pi-search"
                  title="No events match this search"
                  description="Clear the search, or widen the period to cover more of the log."
                />
                <EmptyState
                  v-else
                  key="no-events"
                  size="small"
                  icon="pi pi-filter-slash"
                  title="No events in this window"
                  description="Widen the period or clear a filter to see more of the log."
                />
              </template>
            </TableRoot>
          </section>
        </div>

        <Sidebar
          v-if="isWide"
          key="event-document-panel"
          v-model:width="documentWidth"
          v-model:collapsed="documentCollapsed"
          side="end"
          resizable
          aria-label="Event document"
          resize-aria-label="Resize the event panel"
          min-width-token="--container-xs"
          max-width-token="--container-lg"
        >
          <template #header>
            <div class="flex items-center justify-between gap-(--spacing-xs)">
              <span class="min-w-0 truncate text-heading-xxs text-(--text-default)"> Event </span>
              <Tooltip text="Close">
                <IconButton
                  icon="pi pi-times"
                  kind="transparent"
                  size="small"
                  aria-label="Close the event document"
                  @click="closeDocument"
                />
              </Tooltip>
            </div>
          </template>

          <div
            v-if="selectedEvent"
            class="-m-(--spacing-md)"
          >
            <EventDocument :event="selectedEvent" />
          </div>
        </Sidebar>
      </section>

      <Drawer
        v-model:open="documentDrawerOpen"
        size="medium"
        side="right"
      >
        <DrawerPortal>
          <DrawerOverlay />
          <DrawerContent>
            <PanelHeader class="w-full">
              <DrawerTitle>Event</DrawerTitle>
              <DrawerClose />
            </PanelHeader>
            <div class="min-h-0 flex-1 overflow-auto">
              <EventDocument
                v-if="selectedEvent"
                :event="selectedEvent"
              />
            </div>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    </main>
  </AppLayout>
</template>
