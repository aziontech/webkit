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
  import Table from '@aziontech/webkit/table'
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
    loading,
    refresh: refreshList
  } = useListFilters(() => filterFields.value, scopedEvents, { pageSize: 25 })

  // The log table the controls row drives — Download CSV calls its `exportCsv()`
  // (../../components/list/ExportButton.vue), so the file carries the columns the
  // Fields panel has switched on, over the rows the filters left.
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

  // NOT named `window`: this scope reaches for the global (`ResizeObserver` sizing the
  // explorer, the panel drag's listeners), and a `const window` would shadow it — a
  // silent break with no compile error.
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
  // Bound straight to the panel's `v-model:collapsed`, so the toolbar toggle, the
  // panel's own hide trigger, a drag past the snap boundary and the edge affordance
  // are all the same state — instead of a page flag beside a component that also
  // hides itself.
  const fieldsCollapsed = ref(false)
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
    // A field declares EITHER a weight or a floor, never both. A BOUNDED field — a
    // level chip, a method, a status code, a duration — is as wide as its own content
    // and asks for no share of the leftover space; an open-ended one (the message, a
    // host, a path, a user agent) takes a share and truncates
    // (../../lib/behavior/table-columns.js).
    ...(field.grow ? { grow: field.grow } : {}),
    ...(field.minWidth ? { minWidth: field.minWidth } : {}),
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

  // ── How much room the three columns actually have ─────────────────────────
  // MEASURED ON THE EXPLORER, NOT ON THE VIEWPORT. A media query asks the wrong
  // question here: what decides whether a third column fits is the width left after
  // the app rail — which the reader can collapse — not the width of the window. The
  // same measurement then bounds the document panel, so the two answers can never
  // disagree.
  //
  // The floors are the widths below which each region stops doing its job. The log's
  // is MEASURED, not guessed: at 360 the chart survives but the paginator wraps to
  // three rows and the Event column — the one a reader picks a row by — is off the
  // right edge; at 480 the chart, the spine columns and a compact paginator all hold.
  // Anything under ~350 is a stub (measured 160 at 1280 and 0 at 1024 before this).
  // The document panel's floor is its own `--container-xs` minimum.
  const LOG_MIN_WIDTH = 480
  const DOCUMENT_MIN_WIDTH = 348
  const FIELDS_PANEL_WIDTH = 268

  const explorerEl = ref(null)
  const explorerWidth = ref(0)
  let explorerObserver = null

  // TWO THRESHOLDS, BECAUSE THE TWO PANELS COST DIFFERENT THINGS. The Fields panel
  // only has to clear its own width plus the log's floor; the document column has to
  // clear both of those AND its own minimum, so it is the first to go. Measured with
  // the Fields panel OPEN in both cases, so neither answer flips as that panel is
  // hidden and shown.
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
    // Measured synchronously first: `isWide` defaults to true so the wide layout is
    // what renders on the server/first paint, and a 0 here would flash the narrow one.
    explorerWidth.value = explorerEl.value.offsetWidth
    explorerObserver = new ResizeObserver(([entry]) => {
      explorerWidth.value = entry.contentRect.width
    })
    explorerObserver.observe(explorerEl.value)
  })

  // Crossing the threshold with a document open moves it between hosts rather than
  // dropping it: the reader did not ask to close anything by resizing the window.
  watch(isWide, (wide) => {
    documentDrawerOpen.value = !wide && Boolean(selectedId.value)
  })

  const openDocument = (event, row) => {
    selectedId.value = row.id
    documentDrawerOpen.value = !isWide.value
  }

  // The panel's presence, as the rail's own `collapsed` model: no selection means
  // collapsed, and anything the rail does to collapse it (the drag past the minimum)
  // runs the same close the ✕ does.
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

  // The Drawer owns its own dismissal (overlay, Escape, X), so clearing the selection
  // follows its state rather than being wired to each of the three.
  watch(documentDrawerOpen, (open) => {
    if (!open && !isWide.value) selectedId.value = ''
  })

  // ── The two side panels ───────────────────────────────────────────────────
  // BOTH ARE THE DESIGN SYSTEM'S `Sidebar` — see the note above the Fields panel in
  // the template. This page used to own ~50 lines of pointer-drag, clamping and
  // ARIA-value plumbing for them; `Sidebar` owns all of it, `side="end"` covers the
  // trailing one, and the two widths are all that is left here (they are the models
  // the component drives, held on the page so they survive its own re-renders).
  const fieldsWidth = ref(FIELDS_PANEL_WIDTH)
  const documentWidth = ref(400)

  // THE RAIL'S OWN MAXIMUM IS A TOKEN, AND A TOKEN CANNOT SEE THE CONTAINER. Left to
  // `--container-lg` alone the document panel takes 552px whatever is beside it, and
  // the log — a `min-w-0 flex-1` between two `shrink-0` rails — pays the whole bill:
  // measured 0px of log at 1024 and 160px at 1280, with the panel itself overflowing
  // the explorer and its ✕ clipped off the right edge. So the page clamps the model
  // the rail drives, against the space actually left over.
  const documentMaxWidth = computed(() => {
    if (explorerWidth.value === 0) return Infinity
    const fieldsUsed = showFieldsPanel.value && !fieldsCollapsed.value ? fieldsWidth.value : 0
    return Math.max(DOCUMENT_MIN_WIDTH, explorerWidth.value - fieldsUsed - LOG_MIN_WIDTH)
  })

  // `sync`, so a drag past the cap is clamped in the same tick the rail wrote it and
  // never reaches paint — the handle simply stops instead of springing back.
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

  // The list state's refresh window drives the table's skeleton rows; the toast says
  // why the set comes back the same in the sample.
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
      <!-- THE QUERY BAND spans the whole width, above both panels: it produces the set
           that the panels and the table describe, so it cannot belong to either of
           them. Full-bleed with its own inset and bottom border, like the tab bar on a
           detail page (ui/PageTabs.vue) — the region below is what scrolls. -->
      <header
        class="flex shrink-0 flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-lg) py-(--spacing-sm)"
      >
        <ControlsHeader>
          <FilterButton
            v-model="filters"
            :fields="filterFields"
            size="medium"
          />
          <!-- No toolbar toggle for the field panel: it owns its own hide trigger and
               edge affordance, so a second control for the same state is noise. -->
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
            <!-- REFRESH, NOT CREATE: events are emitted, not authored — so where every
                 other module puts its create action, this page puts the only thing that
                 changes the set. It is the shared icon control now rather than the
                 worded Button it used to be: this row is the same right group as every
                 other list's (refresh · CSV), and one labelled button among glyphs read
                 as a page action instead of a listing one. There is no Columns button
                 because the log's columns are chosen in the FIELDS panel beside the
                 table — the same choice, in the place this page already makes it. -->
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

      <!-- THE EXPLORER: panel · log · panel. `overflow-hidden` here is what makes the
           three regions own their own scrolling instead of extending the page. -->
      <!-- `relative`, because both panels are DS rails and a hidden rail's way back is
           an absolutely-positioned SIBLING of it — a 0px-wide rail cannot host it. -->
      <section
        ref="explorerEl"
        class="animate-content-enter motion-reduce:animate-none relative flex min-h-0 min-w-0 flex-1 overflow-hidden"
      >
        <!-- Left: the log's fields — which of them are columns, and which value to cut
             the log to.

             IT IS THE DESIGN SYSTEM'S `Sidebar`, like the panel on the other edge and
             like the app rail itself. This page used to carry its own: a width
             animation, a drag handle, a clamp, an ARIA-valued separator, and a
             hand-written hide — written twice, once per side. `Sidebar` owns all of it
             (`side="end"` covers the trailing one), so the three panels on this screen
             and the SQL browser's now behave identically, including the parts the copies
             never had: the collapse snap, the preview sliver, and `inert` while out. -->
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
          class="w-(--container-2xs)"
        >
          <template #header>
            <!-- The field sits on the LIST'S column, not on the region's. Every row
                 below carries its own `--spacing-xs` so its hover surface bleeds past
                 the text, which puts the whole list 8px inside the region — and left
                 the search field alone sticking out 8px on both sides. Measured: the
                 field spanned 316→552 while every row spanned 324→544. -->
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
            <!-- The one number column in the panel gets its label once, here, so the
                     counts down the right edge are not a column of bare integers under
                     nothing. -->
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
              class="mt-(--spacing-xs)"
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
                  class="gap-(--spacing-xs)! px-(--spacing-xs)! [&_i]:w-[1.125rem] [&_i]:text-center"
                >
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <span class="truncate text-label-sm text-(--text-default)">
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

        <!-- Center: the window's shape over the window's rows. -->
        <div class="flex min-w-0 flex-1 flex-col overflow-hidden">
          <section
            class="flex shrink-0 flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
          >
            <!-- NO CAPTION over the chart. "Events over time · Last 24 hours" repeated
                 two things the screen already says: the bars ARE events over time, and
                 the window is the applied Period chip one row above. What the shape
                 does not give is the three numbers — how many, how many broke, how
                 slow — so those are all this row carries, and they lead from the left
                 where the reading starts. A stat STRIP and not three cards: the payload
                 of this page is the log, and cards would spend 120px of its height on
                 three integers. -->
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

              <!-- One slot definition for every promoted field: the catalog already
                   says how each value reads, so adding a column is a checkbox, not an
                   edit to this template. -->
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

              <!-- THREE different nothings, and the page is the only thing that knows
                   which one it is looking at. None of them offers a create action —
                   events are emitted, not authored — but "wait for traffic", "clear
                   the search" and "widen the window" are three different instructions,
                   and giving the reader the wrong one is worse than giving none. -->
              <template #empty>
                <!-- ONE BOX, WHATEVER THE NOTHING IS: the empty block above now grows to
                     the region's floor, so all three states are the same size as the
                     table they replace and nothing resizes under the reader. -->
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
            </Table>
          </section>
        </div>

        <!-- Right: the one event, in full — arriving by width, like the fields panel, so
             the table narrows into it instead of jumping. A panel and not a dialog,
             because reading one line of a log is done AGAINST the lines around it: a
             modal would cover the rows that give it its meaning. -->
        <!-- `side="end"`: the same rail as the Fields panel with every horizontal
             decision mirrored — the border and the drag handle on its LEADING edge,
             and a leftward drag growing it.

             ITS PRESENCE IS THE RAIL'S OWN, not a Transition around it. This panel
             used to be a `v-if` inside a hand-written width transition, and that
             transition never ran: its `enter-from-class` was `!w-0`, and a LEADING
             `!` is Tailwind v3 syntax that v4 does not compile — so the class emitted
             nothing, the panel appeared at full width in one frame and the table
             jumped sideways beside it. Measured: fully open 110ms after the click,
             with no interpolation.

             Binding `collapsed` to "is a row selected" hands the whole thing to the
             component, which already animates width and translate together with the
             phase-aware curve the rail uses everywhere else. It stays `resizable`
             without `collapsible` on purpose: the ✕ CLOSES the selection rather than
             hiding a panel, so there is no edge affordance offering to restore a
             document for no event — and a drag past the minimum runs the same close,
             because that gesture means the same thing. -->
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

          <!-- The document owns its own insets so its code block runs flush to the
               panel's edges (ui/EventDocument.vue); the negative margin gives back
               the scroll region's padding for this one panel. -->
          <div
            v-if="selectedEvent"
            class="-m-(--spacing-md)"
          >
            <EventDocument :event="selectedEvent" />
          </div>
        </Sidebar>
      </section>

      <!-- When the explorer cannot host three columns above their floors, the third one
           has nowhere to go, so the same document body is hosted by a right-side Drawer
           — which below `md` the DS renders as a bottom sheet, the console's shape for
           an overlay on a phone. -->
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
