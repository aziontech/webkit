<script setup>
  // Real-Time Events — the Azion Console "Real-Time Events" module. The app shell
  // (single sidebar + GlobalHeader with the module breadcrumb) comes from AppLayout;
  // this page renders only its content.
  //
  // IT IS NOT A LIST PAGE, AND THAT IS THE WHOLE DESIGN. Every other module here is an
  // index of resources: a capped content column, a controls row, a card-framed table
  // that the page scrolls. This module reads a LOG — rows are documents, the set is a
  // window, and the questions are "when did it start", "which fields matter", "what
  // does this one line actually say". A capped, page-scrolling table answers none of
  // them, so this page takes the EXPLORER shape instead (the same shape the SQL
  // Database detail takes for its table browser, `SqlDatabaseDetail.vue`):
  //
  //   ┌─ query band ─────────────────────────────────────────────────────────────┐
  //   │  search · filters · Refresh                          (spans everything)  │
  //   ├───────────┬──────────────────────────────────────────┬──────────────────┤
  //   │  Fields   ┊  volume over the window                  ┊  the one event   │
  //   │  panel    ┊  ─────────────────────────────────────── ┊  in full         │
  //   │  (resize) ┊  the log, fluid, scrolling its own body  ┊  (resize)        │
  //   └───────────┴──────────────────────────────────────────┴──────────────────┘
  //
  // THREE THINGS FOLLOW FROM THE SHAPE.
  //
  //   THE PAGE NEVER SCROLLS (`:padded="false"` + `h-full`). The query band is always
  //     reachable and the table scrolls its own body, so the reader never loses the
  //     control that produced the rows they are looking at.
  //   THE TABLE IS FLUID, EDGE TO EDGE. A log is the densest surface in the console
  //     and the reader chooses its columns, so it takes every pixel the viewport has —
  //     no `--layout-measure` cap, and no CardBox frame around a region that is
  //     already bounded by the two panels beside it.
  //   THE FIELDS PANEL IS THE COLUMN SELECTOR. The dataset has 19 fields and no set of
  //     them is right for every question, so the panel lists all of them with the
  //     number of distinct values each one holds in the current window — a field with
  //     0 is as informative as one with 6 — and a checkbox promotes it to a column.
  //
  // AND THREE THINGS THIS MODULE STILL DOES NOT HAVE, for the same reasons as before:
  // no create action (events are emitted, not authored — the action is Refresh), no
  // row actions (an event is a fact: it cannot be edited, cloned or deleted), and a
  // SHORT period field (15 minutes to 24 hours — a week of edge events is a report,
  // and reports live in Real-Time Metrics).
  import Accordion from '@aziontech/webkit/accordion'
  import Button from '@aziontech/webkit/button'
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
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

  import { useListFilters } from '../lib/list-state'
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
  } from '../lib/real-time-events'
  import { tenancyRows } from '../lib/tenancy-scope'
  import AppLayout from './ui/AppLayout.vue'
  import ControlsHeader from './ui/ControlsHeader.vue'
  import EventDocument from './ui/EventDocument.vue'
  import EventFieldRow from './ui/EventFieldRow.vue'
  import EventVolumeChart from './ui/EventVolumeChart.vue'
  import FilterBar from './ui/FilterBar.vue'

  const events = ref([...REAL_TIME_EVENTS])

  // Events belong to the scope that produced them, so the seed is projected through
  // the organization / account / workspace in force (src/lib/tenancy-scope.js).
  const scopedEvents = computed(() => tenancyRows(events.value, 'real-time-events'))

  // ── The filter catalog ────────────────────────────────────────────────────
  // Period leads, because "when" is the first thing asked of a log and the other two
  // fields only make sense inside a window. Source and Level are the enumerable columns
  // of the log's own spine; every OTHER field becomes filterable through the panel (see
  // "the catalog grows" below), and free text is covered by the search field.
  const BASE_FILTER_FIELDS = [
    {
      id: 'period',
      label: 'Period',
      kind: 'range',
      options: EVENT_PERIODS,
      // A custom window is not in `options`, so the chip needs a formatter to name it —
      // with the clock, since every window this page can produce lands inside one day.
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

  // THE CATALOG GROWS. A log's fields are not three enumerable columns — any of the 19
  // can be the cut that answers the question ("only this host", "only 502s"), and
  // pre-declaring all 19 would put 19 chips in the bar before the reader has filtered
  // anything. So the catalog is the three base fields PLUS one entry per document field
  // the reader has actually filtered from the panel: the chip appears when the filter
  // does and leaves with it.
  //
  // That is what keeps the panel honest. A filter applied over there would otherwise be
  // invisible in the chip bar — the one place this app promises the whole query is
  // legible and undoable — so the panel does not own a second, parallel filter state; it
  // writes into the same `{ fieldId: values[] }` the bar reads.
  //
  // Options come from the SCOPED set, not the matched one: a field's own filter narrows
  // the matched set, so reading its options from there would make the values it offers
  // shrink as they are picked, and a value could not be added back after being removed.
  // Passed as a GETTER, not as the computed itself: the catalog is derived from
  // `filters`, which this call is what creates, so the reference has to stay unevaluated
  // until after the state exists.
  const {
    filters,
    search,
    pagination,
    visibleRows: filteredEvents,
    loading: tenancyReloading
  } = useListFilters(() => filterFields.value, scopedEvents, { pageSize: 25 })

  const activeFieldIds = computed(() =>
    Object.keys(filters.value).filter(
      (id) => !BASE_FILTER_IDS.has(id) && filters.value[id]?.length
    )
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

  // THE PAGE ARRIVES WITH A WINDOW APPLIED. A log has no "all events" state — the
  // window is the query — so the widest period the field offers is applied as a real
  // filter rather than left implicit. It shows as a chip like every other filter, which
  // means the reader can see, narrow and clear it in the one place they already look,
  // and the chart above the table needs no caption of its own to say what it covers.
  filters.value = { period: [DEFAULT_PERIOD] }

  // THE ONE DELIBERATE DEVIATION FROM THE LIST PATTERN: search runs HERE, over the
  // rows, instead of inside the table through `v-model:globalFilter`. On an index the
  // search is a find-in-table and the table is the only thing that reads it; here it
  // is part of the query, and three other surfaces read the same result — the volume
  // chart, the summary, and the Fields panel's per-field counts. Leaving the matching
  // inside the table would leave those three describing a set the reader is not
  // looking at, which is worse than any pattern deviation. It also searches the WHOLE
  // document rather than the visible columns, so an address or a request id finds its
  // event without the reader adding the column first (src/lib/real-time-events.js).
  const matchedEvents = computed(() => searchEvents(filteredEvents.value, search.value))

  // Narrowing from outside the table does not trip TanStack's own page reset, so a
  // search typed on page 4 would land on an empty page 4. `useListFilters` rewinds for
  // the filters and the scope; the search is this page's to rewind.
  watch(search, () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })

  // ── The window ────────────────────────────────────────────────────────────
  // The chart's x-axis IS the applied period — one window, resolved once by `periodRange`
  // and read by the filter, the axis and the bucket width, so they cannot disagree about
  // what "Last 6 hours" or a dragged span covers.
  //
  // Clearing the period chip is "show me everything", so the window widens to the whole
  // seeded day with it — falling back to the OPENING window instead would leave the chart
  // describing 24 hours of a set no longer bounded by them.
  const appliedPeriod = computed(() => filters.value.period?.[0] ?? '')

  // NOT named `window`: this scope calls `window.addEventListener` for the panel drag and
  // `window.matchMedia` for the breakpoint, and a `const window` would shadow the global
  // for both — a silent break with no compile error.
  const activeWindow = computed(() => periodRange(appliedPeriod.value))

  const windowLabel = computed(() => {
    const period = appliedPeriod.value
    if (period && typeof period === 'object') return formatPeriod(period)
    return EVENT_PERIODS.find((option) => option.value === period)?.label ?? 'Last 24 hours'
  })

  // THE CHART IS ALSO THE TIME FILTER: a click or a drag on the bars commits the bucket
  // span it covers as a custom period, which is the same `{ start, end }` shape the
  // field's `Custom…` calendar produces — so the cut arrives as an ordinary chip the
  // reader can read and clear, not as a hidden second state the bar knows nothing about.
  const selectTimeRange = ({ start, end }) => {
    filters.value = { ...filters.value, period: [{ start, end }] }
  }

  const buckets = computed(() => eventBuckets(matchedEvents.value, activeWindow.value))
  const summary = computed(() => eventSummary(matchedEvents.value))

  const errorShareLabel = computed(() =>
    summary.value.total ? `${(summary.value.errorShare * 100).toFixed(1)}% of events` : 'none'
  )

  // ── The Fields panel ──────────────────────────────────────────────────────
  // `shownColumns` holds the OPTIONAL fields promoted to columns; the four core fields
  // (time, level, source, event) are the log's spine and are always present, listed as
  // shown-and-locked rather than pretended to be removable.
  const shownColumns = ref([...DEFAULT_EVENT_COLUMNS])
  const fieldsOpen = ref(true)
  const fieldSearch = ref('')

  const matchesFieldSearch = (field) => {
    const term = fieldSearch.value.trim().toLowerCase()
    if (!term) return true
    return field.label.toLowerCase().includes(term) || field.id.toLowerCase().includes(term)
  }

  // WHAT IS SHOWN STAYS FLAT AND ON TOP; everything else collapses into its category.
  //
  // Nineteen fields is already a scroll, and the reader's own columns are the ones they
  // return to — so those stay a flat, always-open list at the top (the spine `locked`, so
  // its checkbox is checked and disabled rather than absent: a row with no control would
  // read as a field the panel forgot). The rest is 15 fields nobody reads top-to-bottom,
  // and they group by the same functions the Azion docs group a data source's variables
  // by — Request, Response, Cache, Performance, Geolocation, Client, Security, Functions,
  // Identifiers (src/lib/real-time-events.js). Collapsed, the panel is nine headers deep
  // instead of nineteen rows; open, it is the one group the question is about.
  const shownFields = computed(() => [
    ...CORE_EVENT_FIELDS.filter(matchesFieldSearch).map((field) => ({ ...field, locked: true })),
    ...OPTIONAL_EVENT_FIELDS.filter(
      (field) => shownColumns.value.includes(field.id) && matchesFieldSearch(field)
    )
  ])

  // A category with nothing left in it (every field promoted to a column, or none matching
  // the search) drops out rather than offering an empty section to open.
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

  // How many of a category's fields are currently filtering the log — the count on its
  // header, so a collapsed section still says it is doing something. Without it, folding
  // the panel would hide the fact that Client is cutting the set.
  const categoryFilterCount = (category) =>
    category.fields.filter((field) => filters.value[field.id]?.length).length

  // WHICH SECTIONS ARE OPEN. Request by default — the first question of a log is almost
  // always about the request — plus any category already filtering something, so a filter
  // is never hidden inside a fold.
  const openCategories = ref(['request'])

  // A search has to open what it matched. Typing narrows the fields inside each category,
  // and leaving them collapsed would report "no fields" while the matches sat behind nine
  // closed headers; clearing the term hands the reader their own sections back rather than
  // the nine the search happened to open.
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

  // How many distinct values each field answers with in the CURRENT window — the
  // number beside every row, and the reason the panel is worth reading before the
  // table: a field with 6 values is a cut worth making, a field with 1 is not, and a
  // field with 0 is not emitted by anything in this window at all.
  const fieldCounts = computed(() =>
    Object.fromEntries(
      EVENT_FIELDS.map((field) => [field.id, countFieldValues(matchedEvents.value, field.id)])
    )
  )

  // ── Filtering from the panel ──────────────────────────────────────────────
  // The number beside a field is not just a fact about the window, it is the way IN to
  // it: opening it lists that field's values, most frequent first, and picking one cuts
  // the log to it. This is the panel's second job and the reason it is worth its 268px —
  // the chip bar can only offer the fields declared up front, and the question a log
  // raises is almost always about a value nobody could have declared ("which host is
  // returning the 502s").
  //
  // Values come from the MATCHED set, so the list answers "what is in front of me now"
  // and its counts agree with the table, the chart and the summary. The catalog entry the
  // chip is built from reads the SCOPED set instead — see the note there.
  const TOP_VALUES = 6

  // Two fields are listed but not offered as filters. `time` because a timestamp is
  // unique per row — 1,500 "values", none of them a cut, and the Period field is how a
  // log is narrowed in time. `sourceLabel` because Source already has a base chip: the
  // same filter under two ids would put two chips called Source in the bar.
  const UNFILTERABLE_FIELDS = new Set(['time', 'sourceLabel'])

  const canFilterField = (field) => !UNFILTERABLE_FIELDS.has(field.id)

  const topFieldValues = (id) => fieldValueCounts(matchedEvents.value, id).slice(0, TOP_VALUES)

  const fieldValueOverflow = (id) =>
    Math.max(0, countFieldValues(matchedEvents.value, id) - TOP_VALUES)

  // Writes into the SAME `{ fieldId: values[] }` the chip bar reads, replacing the object
  // rather than mutating it so `useListFilters` sees the change and rewinds pagination.
  // Values accumulate within a field (host A or host B) and intersect across fields,
  // which is the model every other list in the app already uses (lib/filter-bar.js).
  // The panel's checkbox owns one thing: whether the field is a column. The array is
  // replaced rather than mutated so the `columns` computed re-runs, and the order stays
  // the CATALOG's — a column never jumps to the right because it was picked last.
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

  // ── The columns ───────────────────────────────────────────────────────────
  // Built in CATALOG order, not in the order fields were checked: a column that jumps
  // to the far right because it was picked last makes the table's shape depend on the
  // reader's history with it.
  const toColumn = (field) => ({
    accessorKey: field.id,
    header: field.label,
    enableSorting: true,
    ...(field.principal ? { principal: true } : {}),
    ...(field.grow ? { grow: field.grow } : {}),
    ...(field.align ? { align: field.align } : {})
  })

  const columns = computed(() => [
    // The leading 44px column is the open/close affordance AND the marker for which
    // row the document panel is showing — the row itself carries no selection state,
    // so without it the panel would be attached to nothing the eye can find.
    { id: 'detail', header: '', width: 44, align: 'center', hideable: false },
    ...CORE_EVENT_FIELDS.map(toColumn),
    ...OPTIONAL_EVENT_FIELDS.filter((field) => shownColumns.value.includes(field.id)).map(toColumn)
  ])

  // Status is the one promoted field with a cell of its own (an HTTP class is read by
  // colour before it is read as a number); every other one renders through the shared
  // formatter, so a field added to the table needs no code here.
  const CUSTOM_CELL_FIELDS = ['status']
  const genericColumns = computed(() =>
    OPTIONAL_EVENT_FIELDS.filter(
      (field) => shownColumns.value.includes(field.id) && !CUSTOM_CELL_FIELDS.includes(field.id)
    )
  )

  const statusField = eventField('status')

  // The class of an HTTP status, as a `data-*` value the template styles — never a
  // class string assembled in script (see .claude/rules/styling.md).
  const statusTone = (status) => {
    if (typeof status !== 'number') return null
    if (status >= 500) return 'error'
    if (status >= 400) return 'warn'
    return 'ok'
  }

  // ── The opened document ───────────────────────────────────────────────────
  // Selection is by id and resolved against the MATCHED set, so a filter that removes
  // the open event closes its panel: a document panel describing a row that is no
  // longer in the table is the explorer lying about its own query.
  const selectedId = ref('')
  const selectedEvent = computed(
    () => matchedEvents.value.find((event) => event.id === selectedId.value) ?? null
  )

  // Below `lg` there is no room for a third column, so the same document body is
  // hosted by a Drawer instead — one component, two hosts (ui/EventDocument.vue).
  const WIDE_QUERY = '(min-width: 1024px)'
  const isWide = ref(true)
  const documentDrawerOpen = ref(false)
  let wideMql = null

  const onWideChange = (event) => {
    isWide.value = event.matches
    // Crossing the breakpoint with a document open moves it between hosts rather than
    // dropping it: the reader did not ask to close anything by resizing the window.
    documentDrawerOpen.value = !event.matches && Boolean(selectedId.value)
  }

  onMounted(() => {
    wideMql = window.matchMedia?.(WIDE_QUERY)
    if (!wideMql) return
    isWide.value = wideMql.matches
    wideMql.addEventListener('change', onWideChange)
  })

  const openDocument = (event, row) => {
    selectedId.value = row.id
    documentDrawerOpen.value = !isWide.value
  }

  const closeDocument = () => {
    selectedId.value = ''
    documentDrawerOpen.value = false
  }

  // The Drawer owns its own dismissal (overlay, Escape, X), so clearing the selection
  // follows its state rather than being wired to each of the three.
  watch(documentDrawerOpen, (open) => {
    if (!open && !isWide.value) selectedId.value = ''
  })

  // ── The resizable panels (native pointer drag, no library) ────────────────
  // Both panels resize the same way and differ in one thing: the side they live on.
  // The Fields panel grows with a rightward drag, the document panel with a leftward
  // one, so the SIGN of the gesture is the sign of the edge — one handler, one branch,
  // instead of two nearly-identical ones. Each handle is a keyboard-operable
  // separator: arrow keys nudge the width.
  const PANEL_BOUNDS = { fields: [208, 420], document: [320, 640] }
  const fieldsWidth = ref(268)
  const documentWidth = ref(400)
  const resizingPanel = ref('')
  let resizeStartX = 0
  let resizeStartWidth = 0

  const widthOf = (panel) => (panel === 'fields' ? fieldsWidth : documentWidth)
  const clampWidth = (panel, value) => {
    const [min, max] = PANEL_BOUNDS[panel]
    return Math.min(Math.max(value, min), max)
  }

  const onResizeMove = (event) => {
    const panel = resizingPanel.value
    if (!panel) return
    const delta = event.clientX - resizeStartX
    widthOf(panel).value = clampWidth(
      panel,
      resizeStartWidth + (panel === 'fields' ? delta : -delta)
    )
  }

  const onResizeEnd = () => {
    resizingPanel.value = ''
    window.removeEventListener('pointermove', onResizeMove)
    window.removeEventListener('pointerup', onResizeEnd)
  }

  const onResizeStart = (panel, event) => {
    resizingPanel.value = panel
    resizeStartX = event.clientX
    resizeStartWidth = widthOf(panel).value
    window.addEventListener('pointermove', onResizeMove)
    window.addEventListener('pointerup', onResizeEnd)
    event.preventDefault()
  }

  const nudgeWidth = (panel, delta) => {
    widthOf(panel).value = clampWidth(panel, widthOf(panel).value + delta)
  }

  onBeforeUnmount(() => {
    onResizeEnd()
    wideMql?.removeEventListener('change', onWideChange)
  })

  const refresh = () =>
    toast.info('Events refreshed.', { description: 'Live streaming is disabled in the demo.' })
</script>

<template>
  <AppLayout
    active="real-time-events"
    :padded="false"
    :breadcrumb="[{ label: 'Real-Time Events' }]"
  >
    <main class="flex h-full min-h-0 flex-col">
      <!-- THE QUERY BAND spans the whole width, above both panels: it produces the set
           that the panels and the table describe, so it cannot belong to either of
           them. Full-bleed with its own inset and bottom border, like the tab bar on a
           detail page (ui/PageTabs.vue) — the region below is what scrolls. -->
      <header
        class="flex shrink-0 flex-col gap-[var(--spacing-xs)] border-b border-[var(--border-default)] px-[var(--spacing-lg)] py-[var(--spacing-sm)]"
      >
        <ControlsHeader>
          <!-- The toggle sits with the search, not in the panel: a control that only
               exists inside the thing it hides cannot bring it back. It is named for what
               the panel DOES — it filters — not for the column it occupies. -->
          <Tooltip
            v-if="isWide"
            text="Toggle filter bar"
          >
            <IconButton
              icon="pi pi-list"
              kind="outlined"
              size="large"
              :aria-pressed="fieldsOpen"
              aria-label="Toggle the filter bar"
              @click="fieldsOpen = !fieldsOpen"
            />
          </Tooltip>

          <InputText
            v-model="search"
            size="large"
            placeholder="Search events, hosts, paths or addresses..."
            aria-label="Search events"
            class="min-w-36 grow basis-[var(--container-2xs)]"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>

          <template #actions>
            <!-- Refresh, not Create: events are emitted, not authored. -->
            <Button
              label="Refresh"
              kind="outlined"
              size="large"
              icon="pi pi-refresh"
              @click="refresh"
            />
          </template>
        </ControlsHeader>

        <!-- The filter bar takes its own row: it grows as filters are applied, so
             sharing the controls row would make the search field jump width. -->
        <FilterBar
          v-model="filters"
          :fields="filterFields"
        />
      </header>

      <!-- THE EXPLORER: panel · log · panel. `overflow-hidden` here is what makes the
           three regions own their own scrolling instead of extending the page. -->
      <section
        class="animate-content-enter motion-reduce:animate-none flex min-h-0 min-w-0 flex-1 overflow-hidden"
      >
        <!-- Left: the log's fields — which of them are columns, and which value to cut
             the log to.

             A PANEL ARRIVES BY WIDTH, not by appearing. Snapping a 272px column in and
             out re-lays the table beside it in one frame, which reads as a glitch on the
             region the reader is looking at rather than as a panel opening. The wrapper
             owns the animated width (`!w-0` on enter beats the inline width, which is
             the only thing that can) and clips its contents, so the panel slides out from
             the edge at a fixed size instead of squeezing its own controls on the way.
             The width is the panel PLUS its handle, so the two travel as one edge. -->
        <Transition
          enter-active-class="transition-[width,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
          enter-from-class="!w-0 opacity-0"
          leave-active-class="transition-[width,opacity] duration-moderate-01 ease-productive-exit motion-reduce:transition-none"
          leave-to-class="!w-0 opacity-0"
        >
          <div
            v-if="isWide && fieldsOpen"
            class="flex shrink-0 overflow-hidden"
            :style="{ width: `calc(${fieldsWidth}px + var(--spacing-xxs))` }"
          >
            <aside
              class="flex shrink-0 flex-col overflow-hidden"
              :style="{ width: fieldsWidth + 'px' }"
              aria-label="Fields"
            >
              <div
                class="flex items-center justify-between gap-[var(--spacing-xs)] px-[var(--spacing-sm)] pt-[var(--spacing-sm)]"
              >
                <span class="text-heading-xxs text-[var(--text-default)]">Fields</span>
                <Tooltip text="Hide filter bar">
                  <IconButton
                    icon="pi pi-times"
                    kind="transparent"
                    size="small"
                    aria-label="Hide the filter bar"
                    @click="fieldsOpen = false"
                  />
                </Tooltip>
              </div>

              <div class="p-[var(--spacing-sm)]">
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

              <div
                class="min-h-0 flex-1 overflow-auto px-[var(--spacing-xs)] pb-[var(--spacing-sm)]"
              >
                <!-- The one number column in the panel gets its label once, here, so the
                     counts down the right edge are not a column of bare integers under
                     nothing. -->
                <div
                  class="flex items-baseline justify-between gap-[var(--spacing-xs)] px-[var(--spacing-xs)] pb-[var(--spacing-xxs)] pt-[var(--spacing-xxs)]"
                >
                  <span class="text-label-sm text-[var(--text-muted)]">Shown</span>
                  <span class="text-label-sm text-[var(--text-muted)]">Values</span>
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

                <!-- THE REST, BY CATEGORY. `type="multiple"` because these are drawers to
                     rummage in, not tabs: comparing Request against Client means having
                     both open. The trigger's inset and its chevron box are overridden to
                     the row geometry (8px inset, a 16px glyph box where the checkbox sits)
                     so a category label starts on the SAME x as every field label under
                     it — otherwise the panel reads as two lists that nearly line up. -->
                <Accordion
                  v-if="fieldCategories.length"
                  v-model:value="openCategories"
                  type="multiple"
                  size="medium"
                  arrow-position="left"
                  class="mt-[var(--spacing-xs)]"
                >
                  <Accordion.Item
                    v-for="category in fieldCategories"
                    :key="category.id"
                    :value="category.id"
                  >
                    <!-- Three overrides, all of them alignment, all of them MEASURED: the
                         trigger's own inset is 16px against the rows' 8px, its gap resolves
                         to `--spacing-sm` (the size class beats the arrow-position class
                         inside the component), and its chevron is 16px against the
                         checkbox's 18px. Left alone, a category label starts 2px right of
                         every field label under it — invisible in review, obvious once you
                         look down the column. `1.125rem` is the checkbox's own width, so the
                         glyph lands where the box would. -->
                    <Accordion.Trigger
                      class="!gap-[var(--spacing-xs)] !px-[var(--spacing-xs)] [&_i]:w-[1.125rem] [&_i]:text-center"
                    >
                      <span class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                        <span class="truncate text-label-sm text-[var(--text-default)]">
                          {{ category.label }}
                        </span>
                        <!-- A collapsed section still has to say it is filtering: without
                             the count, folding the panel would hide the cut. -->
                        <Tag
                          v-if="categoryFilterCount(category)"
                          :label="String(categoryFilterCount(category))"
                          severity="info"
                          size="small"
                        />
                      </span>
                    </Accordion.Trigger>

                    <Accordion.Content class="!px-0">
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
                  class="px-[var(--spacing-xs)] py-[var(--spacing-sm)] text-body-sm text-[var(--text-muted)]"
                >
                  No fields match "{{ fieldSearch }}".
                </p>
              </div>
            </aside>

            <!-- Drag handle: the panel's edge IS the divider, so no panel draws its own
                 border beside it.

                 A FOCUSABLE `separator` IS A WIDGET, not a decoration, so ARIA requires
                 it to publish its value: without `aria-valuenow` a screen-reader user
                 can focus the splitter, press the arrow keys, and be told nothing about
                 what moved or how far it can go. The three values are the same numbers
                 the pointer drag is clamped to. -->
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize fields panel"
              tabindex="0"
              :aria-valuenow="fieldsWidth"
              :aria-valuemin="PANEL_BOUNDS.fields[0]"
              :aria-valuemax="PANEL_BOUNDS.fields[1]"
              :data-resizing="resizingPanel === 'fields' || null"
              class="w-[var(--spacing-xxs)] shrink-0 cursor-col-resize bg-[var(--border-default)] outline-none transition-colors duration-fast-02 hover:bg-[var(--border-strong)] focus-visible:bg-[var(--accent)] data-[resizing]:bg-[var(--accent)] motion-reduce:transition-none"
              @pointerdown="onResizeStart('fields', $event)"
              @keydown.left.prevent="nudgeWidth('fields', -16)"
              @keydown.right.prevent="nudgeWidth('fields', 16)"
            />
          </div>
        </Transition>

        <!-- Center: the window's shape over the window's rows. -->
        <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
          <section
            class="flex shrink-0 flex-col gap-[var(--spacing-xs)] border-b border-[var(--border-default)] px-[var(--spacing-md)] py-[var(--spacing-sm)]"
          >
            <!-- NO CAPTION over the chart. "Events over time · Last 24 hours" repeated
                 two things the screen already says: the bars ARE events over time, and
                 the window is the applied Period chip one row above. What the shape
                 does not give is the three numbers — how many, how many broke, how
                 slow — so those are all this row carries, and they lead from the left
                 where the reading starts. A stat STRIP and not three cards: the payload
                 of this page is the log, and cards would spend 120px of its height on
                 three integers. -->
            <div class="flex flex-wrap items-end gap-[var(--spacing-md)]">
              <dl class="flex flex-wrap items-end gap-[var(--spacing-xl)]">
                <div class="flex flex-col">
                  <dt class="text-label-sm text-[var(--text-muted)]">Events</dt>
                  <dd class="m-0 text-heading-xs tabular-nums text-[var(--text-default)]">
                    {{ summary.total.toLocaleString('en-US') }}
                  </dd>
                </div>
                <div class="flex flex-col">
                  <dt class="text-label-sm text-[var(--text-muted)]">Errors</dt>
                  <dd
                    class="m-0 text-heading-xs tabular-nums text-[var(--text-default)] data-[raised]:text-[var(--danger-contrast)]"
                    :data-raised="summary.errors ? true : null"
                    :aria-label="`${summary.errors} errors, ${errorShareLabel}`"
                  >
                    {{ summary.errors.toLocaleString('en-US') }}
                  </dd>
                </div>
                <div class="flex flex-col">
                  <dt class="text-label-sm text-[var(--text-muted)]">Avg request time</dt>
                  <dd class="m-0 text-heading-xs tabular-nums text-[var(--text-default)]">
                    {{
                      summary.avgRequestTimeMs === null ? '—' : `${summary.avgRequestTimeMs} ms`
                    }}
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

          <!-- The log. No CardBox: the region is already framed by the band above it
               and the panels beside it, and a card here would put a rounded rectangle
               inside a rectangle with a stripe of dead space between them. The height
               chain (`min-h-0 flex-1` → `h-full` → `max-height="100%"`) is what makes
               the BODY scroll while the column headers and the paginator stay put. -->
          <section class="flex min-h-0 min-w-0 flex-1 flex-col">
            <!-- `log-table` is what makes the table REACH THE BOTTOM of the page at every
                 row count — 25 rows, 3 rows, or none — instead of leaving the paginator
                 floating mid-screen. `h-full` sizes the root; the viewport inside it needs
                 to grow, and that cannot be expressed as a utility here (see the rule and
                 the reason it is plain CSS in src/style.css). -->
            <Table
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
              :loading="tenancyReloading"
              @row-click="openDocument"
            >
              <!-- The affordance column carries no visible header — a glyph needs no
                   label — but a column header that is genuinely empty leaves the cells
                   under it unnamed in the accessibility tree, so the word is there and
                   only the pixels are not. -->
              <template #header-detail>
                <span class="sr-only">Open the event document</span>
              </template>

              <template #cell-detail="{ row }">
                <!-- Not a button: the whole row opens the document, and a control
                     inside a row-clickable row that does the same thing would be two
                     targets for one action. It is the marker for WHICH row is open. -->
                <i
                  class="pi pi-angle-right text-[var(--text-muted)] transition-transform duration-fast-02 ease-productive-entrance data-[open]:rotate-90 data-[open]:text-[var(--primary)] motion-reduce:transition-none"
                  :data-open="row.id === selectedId || null"
                  aria-hidden="true"
                />
              </template>

              <template #cell-time="{ value }">
                <span
                  class="min-w-0 truncate text-label-code-sm tabular-nums text-[var(--text-muted)]"
                >
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
                <span class="min-w-0 truncate text-[var(--text-default)]">{{ value }}</span>
              </template>

              <template #cell-status="{ value }">
                <span
                  class="min-w-0 truncate text-label-code-sm tabular-nums text-[var(--text-default)] data-[tone=error]:text-[var(--danger-contrast)] data-[tone=warn]:text-[var(--warning-contrast)]"
                  :data-tone="statusTone(value)"
                >
                  {{ formatEventValue(statusField, value) }}
                </span>
              </template>

              <!-- One slot definition for every promoted field: the catalog already
                   says how each value reads, so adding a column is a checkbox, not an
                   edit to this template. -->
              <template
                v-for="field in genericColumns"
                :key="field.id"
                #[`cell-${field.id}`]="{ value }"
              >
                <span
                  class="min-w-0 truncate text-[var(--text-default)] data-[mono]:text-label-code-sm data-[numeric]:tabular-nums"
                  :data-mono="field.mono || null"
                  :data-numeric="field.align === 'end' || null"
                >
                  {{ formatEventValue(field, value) }}
                </span>
              </template>

              <!-- THREE different nothings, and the page is the only thing that knows
                   which one it is looking at. None of them offers a create action —
                   events are emitted, not authored — but "wait for traffic", "clear
                   the search" and "widen the window" are three different instructions,
                   and giving the reader the wrong one is worse than giving none. -->
              <template #empty>
                <!-- ONE BOX, WHATEVER THE NOTHING IS: the empty block above now grows to
                     the region's floor, so all three states are the same size as the
                     table they replace and nothing resizes under the reader. -->
                <div class="flex items-center justify-center">
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
                </div>
              </template>
            </Table>
          </section>
        </div>

        <!-- Right: the one event, in full — arriving by width, like the fields panel, so
             the table narrows into it instead of jumping. A panel and not a dialog,
             because reading one line of a log is done AGAINST the lines around it: a
             modal would cover the rows that give it its meaning. -->
        <Transition
          enter-active-class="transition-[width,opacity] duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
          enter-from-class="!w-0 opacity-0"
          leave-active-class="transition-[width,opacity] duration-moderate-01 ease-productive-exit motion-reduce:transition-none"
          leave-to-class="!w-0 opacity-0"
        >
          <div
            v-if="isWide && selectedEvent"
            class="flex shrink-0 overflow-hidden"
            :style="{ width: `calc(${documentWidth}px + var(--spacing-xxs))` }"
          >
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize event panel"
              tabindex="0"
              :aria-valuenow="documentWidth"
              :aria-valuemin="PANEL_BOUNDS.document[0]"
              :aria-valuemax="PANEL_BOUNDS.document[1]"
              :data-resizing="resizingPanel === 'document' || null"
              class="w-[var(--spacing-xxs)] shrink-0 cursor-col-resize bg-[var(--border-default)] outline-none transition-colors duration-fast-02 hover:bg-[var(--border-strong)] focus-visible:bg-[var(--accent)] data-[resizing]:bg-[var(--accent)] motion-reduce:transition-none"
              @pointerdown="onResizeStart('document', $event)"
              @keydown.left.prevent="nudgeWidth('document', 16)"
              @keydown.right.prevent="nudgeWidth('document', -16)"
            />

            <aside
              class="flex shrink-0 flex-col overflow-hidden"
              :style="{ width: documentWidth + 'px' }"
              aria-label="Event document"
            >
              <div
                class="flex items-center justify-between gap-[var(--spacing-xs)] border-b border-[var(--border-default)] px-[var(--spacing-sm)] py-[var(--spacing-xs)]"
              >
                <span class="min-w-0 truncate text-heading-xxs text-[var(--text-default)]">
                  Event
                </span>
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

              <!-- No padding here: the document owns its own insets so its code block can
                   run flush to the panel's edges (ui/EventDocument.vue). -->
              <div class="min-h-0 flex-1 overflow-auto">
                <EventDocument :event="selectedEvent" />
              </div>
            </aside>
          </div>
        </Transition>
      </section>

      <!-- Below `lg` the third column has nowhere to go, so the same document body is
           hosted by a right-side Drawer — which below `md` the DS renders as a bottom
           sheet, the console's shape for an overlay on a phone. -->
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
            <!-- A plain scroll region rather than `PanelContent`: that component owns a
                 padding this body must not have, and the drawer has to render the same
                 flush document the wide panel does — one component, one reading, two
                 hosts. -->
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
