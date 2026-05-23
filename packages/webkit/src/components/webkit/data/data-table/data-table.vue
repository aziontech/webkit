<script setup lang="ts">
  import { computed, provide, ref, shallowRef, useAttrs, useSlots, watch } from 'vue'

  import EmptyResultsBlock from '../../../../components/empty-results-block/empty-results-block.vue'
  import { useDataTableFilter } from './composables/use-data-table-filter'
  import { useDataTablePagination } from './composables/use-data-table-pagination'
  import { useDataTableSelection } from './composables/use-data-table-selection'
  import { useDataTableSort } from './composables/use-data-table-sort'
  import {
    type ColumnDefinition,
    DataTableInjectionKey,
    type EmptyBlockConfig,
    type FilterDefinition,
    type PageEvent,
    type RegisteredColumn,
    type RowEditEvent,
    type RowOrderingResult,
    type SortEvent
  } from './injection-key'

  defineOptions({
    name: 'DataTable',
    inheritAttrs: false
  })

  type RowData = Record<string, unknown>
  type RowDataList = RowData[]
  type FiltersMap = Record<string, unknown>
  type SelectionValue = RowData | RowDataList | null
  type ExportHandler = (options: { data: RowDataList; fields: string[] }) => void
  type RowClassHandler = (row: RowData) => string | null
  type RowClickPayload = { data: RowData; originalEvent: MouseEvent }

  const props = withDefaults(
    defineProps<{
      /** Row records to render. */
      data?: RowDataList
      /** Unique row identifier field. */
      dataKey?: string
      /** Column metadata for skeleton, export, and column selector. */
      columns?: ColumnDefinition[]
      /** Shows loading skeleton rows when true. */
      loading?: boolean
      /** Total record count for lazy pagination. */
      totalRecords?: number
      /** When true, pagination and sort emit events for server fetch. */
      lazy?: boolean
      /** Zero-based index of the first row on the current page. */
      first?: number
      /** Hides column headers; renders headerless list rows. */
      hideHeader?: boolean
      /** Applies hover surface token on rows. */
      rowHover?: boolean
      /** Wraps the table body in a scroll area. */
      scrollable?: boolean
      /** Max height when scrollable is true. */
      scrollHeight?: string
      /** Shows row/column divider borders. */
      showGridlines?: boolean
      /** Active filter state including global search. */
      filters?: FiltersMap
      /** Current sort field name. */
      sortField?: string
      /** Sort direction: 1 ascending, -1 descending. */
      sortOrder?: number
      /** Single or multi-column sort mode. */
      sortMode?: 'single' | 'multiple'
      /** Fields included in global text search. */
      globalFilterFields?: string[]
      /** Bound search input value for empty-state logic. */
      searchValue?: string
      /** Applied filter chips shown below the toolbar. */
      appliedFilters?: FilterDefinition[]
      /** Enables pagination controls. */
      paginator?: boolean
      /** Rows per page. */
      rows?: number
      /** Page size options in the paginator. */
      rowsPerPageOptions?: number[]
      /** Selected row or rows. */
      selection?: SelectionValue
      /** Enables row selection checkboxes. */
      selectable?: boolean
      /** Row or cell edit mode. */
      editMode?: 'row' | 'cell'
      /** Rows currently in edit state. */
      editingRows?: RowDataList
      /** Default CSV export filename. */
      exportFilename?: string
      /** Custom export handler; null uses built-in CSV. */
      exportFunction?: ExportHandler | null
      /** In-table empty message when filtered with no rows. */
      emptyListMessage?: string
      /** Full-page empty block configuration. */
      emptyBlock?: EmptyBlockConfig
      /** Always renders the table shell even when data is empty. */
      notShowEmptyBlock?: boolean
      /** Uses the emptyBlock slot instead of the default block. */
      hasEmptyBlockSlot?: boolean
      /** Skeleton placeholder row count while loading. */
      skeletonRows?: number
      /** Frozen rows pinned above the scroll body. */
      frozenValue?: RowDataList
      /** Reserved; column resize deferred in v1. */
      resizableColumns?: boolean
      /** Returns extra classes for a row. */
      rowClass?: RowClassHandler | null
      /** Enables expandable row groups. */
      expandableRowGroups?: boolean
      /** Row group rendering mode. */
      rowGroupMode?: 'subheader' | 'rowspan'
      /** Field used to group rows. */
      groupRowsBy?: string
      /** Currently expanded group keys. */
      expandedRowGroups?: string[]
    }>(),
    {
      data: () => [],
      dataKey: 'id',
      columns: () => [],
      loading: false,
      totalRecords: 0,
      lazy: false,
      first: 0,
      hideHeader: false,
      rowHover: true,
      scrollable: false,
      scrollHeight: '',
      showGridlines: false,
      filters: () => ({}),
      sortField: '',
      sortOrder: 1,
      sortMode: 'single',
      globalFilterFields: () => [],
      searchValue: '',
      appliedFilters: () => [],
      paginator: false,
      rows: 10,
      rowsPerPageOptions: () => [10, 25, 50, 100],
      selection: null,
      selectable: false,
      editMode: 'row',
      editingRows: () => [],
      exportFilename: 'export',
      exportFunction: null,
      emptyListMessage: 'No data available',
      emptyBlock: () => ({
        title: 'No data has been created',
        description: 'No data has been created.',
        createButtonLabel: 'Create'
      }),
      notShowEmptyBlock: false,
      hasEmptyBlockSlot: false,
      skeletonRows: 5,
      frozenValue: () => [],
      resizableColumns: false,
      rowClass: null,
      expandableRowGroups: false,
      rowGroupMode: 'subheader',
      groupRowsBy: '',
      expandedRowGroups: () => []
    }
  )

  const emit = defineEmits<{
    'update:filters': [value: FiltersMap]
    'update:sortField': [value: string]
    'update:sortOrder': [value: number]
    'update:selection': [value: SelectionValue]
    'update:editingRows': [value: RowDataList]
    'update:expandedRowGroups': [value: string[]]
    'update:first': [value: number]
    page: [event: PageEvent]
    sort: [event: SortEvent]
    filter: [event: FiltersMap]
    'row-click': [event: RowClickPayload]
    'row-reorder': [event: RowOrderingResult]
    'row-edit-save': [event: RowEditEvent]
    'row-edit-cancel': [event: RowEditEvent]
    'click-to-create': []
  }>()

  type SlotRowScope = { data: RowData; index: number }
  type SlotGroupScope = { data: RowData }

  defineSlots<{
    default(): unknown
    header(): unknown
    footer(): unknown
    empty(): unknown
    emptyBlock(): unknown
    emptyBlockButton(): unknown
    illustration(): unknown
    loading(): unknown
    expansion(props: SlotRowScope): unknown
    groupheader(props: SlotGroupScope): unknown
    groupfooter(props: SlotGroupScope): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'data-data-table')

  const registeredColumns = shallowRef<RegisteredColumn[]>([])
  const hadPreviousSearch = ref(false)
  const firstRef = ref(props.first)
  const sortFieldRef = ref(props.sortField)
  const sortOrderRef = ref(props.sortOrder)

  watch(
    () => props.first,
    (value) => {
      firstRef.value = value
    }
  )
  watch(
    () => props.sortField,
    (value) => {
      sortFieldRef.value = value
    }
  )
  watch(
    () => props.sortOrder,
    (value) => {
      sortOrderRef.value = value
    }
  )

  const dataRef = computed(() => props.data)
  const filtersRef = computed(() => props.filters)
  const searchValueRef = computed(() => props.searchValue)
  const appliedFiltersRef = computed(() => props.appliedFilters)
  const globalFilterFieldsRef = computed(() => props.globalFilterFields)
  const paginatorRef = computed(() => props.paginator)
  const rowsRef = computed(() => props.rows)
  const lazyRef = computed(() => props.lazy)
  const totalRecordsRef = computed(() => props.totalRecords)
  const selectionRef = computed(() => props.selection)
  const multipleSelection = computed(() => props.selectable)

  const { filteredData, hasActiveSearch } = useDataTableFilter(dataRef, {
    globalFilterFields: globalFilterFieldsRef,
    searchValue: searchValueRef,
    filters: filtersRef,
    appliedFilters: appliedFiltersRef
  })

  const { sortedData, toggleSort } = useDataTableSort(
    filteredData,
    sortFieldRef,
    sortOrderRef,
    registeredColumns
  )

  const { paginatedData, previousPage, nextPage, canPrevious, canNext, pageReport } =
    useDataTablePagination(sortedData, {
      paginator: paginatorRef,
      rows: rowsRef,
      first: firstRef,
      lazy: lazyRef,
      totalRecords: totalRecordsRef,
      onPage: (event) => {
        emit('update:first', event.first)
        emit('page', event)
      }
    })

  const displayRows = computed(() => {
    if (props.loading && props.data.length === 0 && props.columns.length > 0) {
      return Array.from({ length: props.skeletonRows }, (_, index) => {
        const row: Record<string, unknown> = { id: `skeleton-${index}` }
        for (const col of props.columns) {
          row[col.field] = null
        }
        return row
      })
    }
    return paginatedData.value
  })

  const visibleColumns = computed(() => registeredColumns.value.filter((column) => !column.hidden))

  const {
    isRowSelected,
    toggleRow: toggleRowSelection,
    toggleAll: toggleAllSelection,
    isAllSelected
  } = useDataTableSelection(
    displayRows,
    props.dataKey,
    selectionRef,
    (value) => emit('update:selection', value),
    multipleSelection
  )

  watch(hasActiveSearch, (active, wasActive) => {
    if (wasActive && !active) hadPreviousSearch.value = true
    if (props.data.length > 0) hadPreviousSearch.value = false
  })

  watch(
    () => props.data.length,
    (length) => {
      if (length > 0) hadPreviousSearch.value = false
    }
  )

  const shouldRenderTable = computed(() => {
    if (props.notShowEmptyBlock) return true
    return (
      props.data.length > 0 ||
      props.loading ||
      props.appliedFilters.length > 0 ||
      hasActiveSearch.value ||
      hadPreviousSearch.value
    )
  })

  function registerColumn(column: RegisteredColumn) {
    const existing = registeredColumns.value.findIndex((item) => item.field === column.field)
    const next = [...registeredColumns.value]
    if (existing >= 0) next[existing] = column
    else next.push(column)
    registeredColumns.value = next
  }

  function unregisterColumn(field: string) {
    registeredColumns.value = registeredColumns.value.filter((column) => column.field !== field)
  }

  function toggleColumnVisibility(field: string, visible: boolean) {
    registeredColumns.value = registeredColumns.value.map((column) =>
      column.field === field ? { ...column, hidden: !visible } : column
    )
  }

  function exportCSV() {
    const fields =
      visibleColumns.value.length > 0
        ? visibleColumns.value.map((column) => column.field)
        : props.columns.map((column) => column.field)

    if (props.exportFunction) {
      props.exportFunction({ data: props.data, fields })
      return
    }

    const header = fields.join(',')
    const lines = props.data.map((row) =>
      fields.map((field) => JSON.stringify(row[field] ?? '')).join(',')
    )
    const csv = [header, ...lines].join('\n')
    if (typeof globalThis.URL === 'undefined' || typeof globalThis.Blob === 'undefined') return
    const blob = new globalThis.Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = globalThis.URL.createObjectURL(blob)
    const link = globalThis.document.createElement('a')
    link.href = url
    link.download = `${props.exportFilename}.csv`
    link.click()
    globalThis.URL.revokeObjectURL(url)
  }

  function handleSort(field: string) {
    toggleSort(field)
    emit('update:sortField', sortFieldRef.value)
    emit('update:sortOrder', sortOrderRef.value)
    emit('sort', { sortField: sortFieldRef.value, sortOrder: sortOrderRef.value })
  }

  function handleRowClick(row: Record<string, unknown>, originalEvent: MouseEvent) {
    emit('row-click', { data: row, originalEvent })
  }

  function ariaSortFor(field: string) {
    if (sortFieldRef.value !== field) return 'none'
    return sortOrderRef.value === -1 ? 'descending' : 'ascending'
  }

  provide(DataTableInjectionKey, {
    testId: testId.value,
    dataKey: props.dataKey,
    hideHeader: props.hideHeader,
    selectable: props.selectable,
    rowHover: props.rowHover,
    showGridlines: props.showGridlines,
    columns: registeredColumns,
    registerColumn,
    unregisterColumn,
    toggleColumnVisibility,
    isRowSelected,
    toggleRowSelection,
    toggleAllSelection,
    isAllSelected,
    exportCSV
  })

  defineExpose({
    exportCSV
  })
</script>

<template>
  <div
    v-bind="attrs"
    class="w-full max-w-full"
    :data-testid="testId"
    :data-loading="loading || null"
  >
    <template v-if="shouldRenderTable">
      <div
        class="flex w-full flex-col overflow-hidden rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)]"
        :data-testid="`${testId}__shell`"
      >
        <div
          v-if="slots['header']"
          class="border-b border-[var(--border-default)] px-[var(--spacing-3)] py-[var(--spacing-3)]"
          :data-testid="`${testId}__header`"
        >
          <slot name="header" />
        </div>

        <div
          v-if="loading && slots['loading']"
          class="px-[var(--spacing-3)] py-[var(--spacing-3)]"
          :data-testid="`${testId}__loading`"
        >
          <slot name="loading" />
        </div>

        <div
          class="relative w-full overflow-x-auto"
          :style="scrollable && scrollHeight ? { maxHeight: scrollHeight } : undefined"
          :data-testid="`${testId}__body`"
        >
          <table
            class="w-full border-collapse"
            role="table"
            :data-testid="`${testId}__table`"
          >
            <thead v-if="!hideHeader && visibleColumns.length > 0">
              <tr
                class="border-b border-[var(--border-default)] bg-[var(--bg-canvas)]"
                :data-testid="`${testId}__head-row`"
              >
                <th
                  v-if="selectable"
                  scope="col"
                  class="w-10 px-[var(--spacing-3)] py-[var(--spacing-3)] text-left"
                >
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    aria-label="Select all rows"
                    @change="toggleAllSelection"
                  />
                </th>
                <th
                  v-for="column in visibleColumns"
                  :key="column.field"
                  scope="col"
                  class="px-[var(--spacing-3)] py-[var(--spacing-3)] text-left text-body-sm text-[var(--text-default)]"
                  :aria-sort="column.sortable ? ariaSortFor(column.sortField) : undefined"
                  :style="column.style || undefined"
                  :data-testid="`${testId}__head-${column.field}`"
                >
                  <button
                    v-if="column.sortable"
                    type="button"
                    class="inline-flex items-center gap-[var(--spacing-2)] transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]"
                    @click="handleSort(column.sortField)"
                  >
                    <component
                      :is="column.headerSlot ?? 'span'"
                      v-if="column.headerSlot"
                    />
                    <span v-else>{{ column.header }}</span>
                  </button>
                  <template v-else>
                    <component
                      :is="column.headerSlot ?? 'span'"
                      v-if="column.headerSlot"
                    />
                    <span v-else>{{ column.header }}</span>
                  </template>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, rowIndex) in displayRows"
                :key="String(row[dataKey] ?? rowIndex)"
                class="border-b border-[var(--border-default)] transition-colors duration-150 ease-out motion-reduce:transition-none"
                :class="[
                  rowHover ? 'hover:bg-[var(--bg-hover)]' : '',
                  rowClass ? rowClass(row) : '',
                  showGridlines ? 'divide-x divide-[var(--border-default)]' : ''
                ]"
                :data-state="selectable && isRowSelected(row) ? 'selected' : 'unselected'"
                :data-testid="`${testId}__row-${rowIndex}`"
                @click="handleRowClick(row, $event)"
              >
                <td
                  v-if="selectable"
                  class="w-10 px-[var(--spacing-3)] py-[var(--spacing-4)]"
                >
                  <input
                    type="checkbox"
                    :checked="isRowSelected(row)"
                    aria-label="Select row"
                    @click.stop
                    @change="toggleRowSelection(row)"
                  />
                </td>
                <td
                  v-for="column in visibleColumns"
                  :key="`${rowIndex}-${column.field}`"
                  class="px-[var(--spacing-3)] py-[var(--spacing-4)] align-middle text-body-sm text-[var(--text-default)]"
                  :style="column.style || undefined"
                  :data-testid="`${testId}__cell-${column.field}`"
                >
                  <template v-if="loading && row[dataKey]?.toString().startsWith('skeleton')">
                    <span
                      class="inline-block h-3 w-full max-w-[12rem] animate-blink rounded-[var(--shape-elements)] bg-[var(--bg-canvas)] motion-reduce:animate-none"
                      aria-hidden="true"
                    />
                  </template>
                  <component
                    :is="column.bodySlot"
                    v-else-if="column.bodySlot"
                    :data="row"
                    :index="rowIndex"
                  />
                  <span v-else>{{ row[column.field] }}</span>
                </td>
              </tr>
              <tr v-if="displayRows.length === 0 && !loading">
                <td
                  :colspan="visibleColumns.length + (selectable ? 1 : 0)"
                  class="px-[var(--spacing-3)] py-[var(--spacing-4)] text-center text-body-sm text-[var(--text-muted)]"
                  :data-testid="`${testId}__empty`"
                >
                  <slot name="empty">
                    {{ emptyListMessage }}
                  </slot>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="paginator"
          class="flex items-center justify-between gap-[var(--spacing-3)] border-t border-[var(--border-default)] px-[var(--spacing-3)] py-[var(--spacing-3)] text-body-xs text-[var(--text-muted)]"
          :data-testid="`${testId}__paginator`"
        >
          <span>{{ pageReport }}</span>
          <div class="flex items-center gap-[var(--spacing-2)]">
            <button
              type="button"
              class="inline-flex h-10 min-w-10 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-default)] px-[var(--spacing-2)] transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!canPrevious"
              @click="previousPage"
            >
              Previous
            </button>
            <button
              type="button"
              class="inline-flex h-10 min-w-10 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-default)] px-[var(--spacing-2)] transition-colors duration-150 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="!canNext"
              @click="nextPage"
            >
              Next
            </button>
          </div>
        </div>

        <div
          v-if="slots['footer']"
          class="border-t border-[var(--border-default)] px-[var(--spacing-3)] py-[var(--spacing-3)]"
          :data-testid="`${testId}__footer`"
        >
          <slot name="footer" />
        </div>
      </div>

      <slot />
    </template>

    <template v-else>
      <div v-if="hasEmptyBlockSlot">
        <slot name="emptyBlock" />
      </div>
      <EmptyResultsBlock
        v-else
        :title="emptyBlock.title ?? 'No data has been created'"
        :description="emptyBlock.description ?? 'No data has been created.'"
        :createButtonLabel="emptyBlock.createButtonLabel ?? 'Create'"
        :documentationService="emptyBlock.documentationService ?? undefined"
        :data-testid="`${testId}__empty-block`"
        @click-to-create="emit('click-to-create')"
      >
        <template #illustration>
          <slot name="illustration" />
        </template>
        <template #default>
          <slot name="emptyBlockButton" />
        </template>
      </EmptyResultsBlock>
    </template>
  </div>
</template>
