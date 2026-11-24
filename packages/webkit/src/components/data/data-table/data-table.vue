<script setup lang="ts" generic="TRow extends object = Record<string, unknown>">
  import type { SortingState, VisibilityState } from '@tanstack/vue-table'
  import { computed, onBeforeUpdate, type Ref, ref, type Slots, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { useTableFrame } from '../table/composables/use-table-frame'
  import {
    type TableAppliedFilter,
    type TableCellSlots,
    type TableColumn,
    type TableDensity,
    type TableExposed,
    type TableHeaderSlots,
    type TableToolbarSlotProps
  } from '../table/injection-key'
  import TableToolbarBand from '../table/parts/table-toolbar-band.vue'
  import {
    type DataTableEmits,
    type DataTableSettings,
    useDataTableCore
  } from './composables/use-data-table-core'
  import { useDataTableProvide } from './composables/use-data-table-provide'
  import { useDataTableView } from './composables/use-data-table-view'
  import type { DataTableRecord } from './injection-key'
  import { ROOT_CLASS } from './lib/data-table-classes'
  import DataTableFilters from './parts/data-table-filters.vue'
  import DataTableViewport from './parts/data-table-viewport.vue'

  defineOptions({
    name: 'DataTable',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Max height (CSS length). Vertical scroll engages only when set smaller than the content; horizontal scroll is always automatic. */
      maxHeight?: string
      /** Draw the outer card border around the table (off by default; the table is typically framed by a surrounding surface). */
      bordered?: boolean
      /** Column definitions; the table renders its header and rows from them. */
      columns?: TableColumn[]
      /** Field used as the stable row id (for selection). */
      rowKey?: string
      /** Sorts every column on header click (a column's own `sortable` overrides). */
      sortable?: boolean
      /** Adds a leading selection-checkbox column. */
      selectable?: boolean
      /** Decides per row whether it can be selected (`(row) => row.type === 'file'`). A row it rejects draws no checkbox, ignores row clicks and stays out of Select all. */
      rowSelectable?: (row: TRow) => boolean
      /** Clicking a row toggles its selection (requires selectable). */
      selectOnRowClick?: boolean
      /** Server-side sorting: emit events, do not sort locally. */
      manualSorting?: boolean
      /** Server-side filtering: emit events, do not filter locally. */
      manualFiltering?: boolean
      /** Render skeleton rows and set aria-busy while true. */
      loading?: boolean
      /** Message of a failed load, shown in place of the rows (the `error` slot replaces it). Empty shows the rows. */
      error?: string
      /**
       * Opt in to stacked rows. When the table's own box is narrower than `--container-lg`, each row renders
       * as a card of label and value pairs instead of the horizontally scrolling grid. Off by default: a
       * console list scrolls sideways on a phone.
       */
      stackable?: boolean
      /** Cell text wraps onto several lines instead of truncating. */
      wrapLines?: boolean
      /** Every other body row takes the raised surface. */
      striped?: boolean
      /** Density of the header and the body rows: `compact` shrinks their height and padding. */
      density?: TableDensity
      /** Render only the rows in view, for thousands of rows. The viewport scrolls vertically within `maxHeight` (40rem when empty). Ignored in the stacked layout. */
      virtual?: boolean
      /**
       * A leading grip lets people drag rows, or move the focused one with Arrow Up, Arrow Down, Home and
       * End, into a new order. The table emits `update:data` with the reordered records (bind `v-model:data`)
       * and `reorder`; it is locked while a sort is applied.
       */
      reorderable?: boolean
      /**
       * With `reorderable`: decides per row whether it can move (`(row) => !row.locked`). A row it rejects
       * keeps its place: its grip is disabled, and no other row is dropped onto it or moved past it with the
       * keys.
       */
      rowReorderable?: (row: TRow) => boolean
      /** Tree rows. Returns a row's children; rows with children expand in place under a chevron in the principal column and the grid becomes a `treegrid`. */
      getSubRows?: (row: TRow) => TRow[] | undefined
    }>(),
    {
      maxHeight: '',
      bordered: false,
      columns: () => [],
      rowKey: 'id',
      sortable: false,
      selectable: false,
      rowSelectable: undefined,
      selectOnRowClick: false,
      manualSorting: false,
      manualFiltering: false,
      loading: false,
      error: '',
      stackable: false,
      wrapLines: false,
      striped: false,
      density: 'comfortable',
      virtual: false,
      reorderable: false,
      rowReorderable: undefined,
      getSubRows: undefined
    }
  )

  const emit = defineEmits<{
    'row-click': [event: MouseEvent | KeyboardEvent, row: TRow]
    'row-remove': [event: KeyboardEvent, row: TRow]
    'filter-apply': [event: Event, filters: TableAppliedFilter[]]
    'filter-remove': [event: Event, filter: TableAppliedFilter]
    refresh: [event: Event]
    export: [event: Event, rows: TRow[]]
    reorder: [event: KeyboardEvent | PointerEvent, payload: { from: number; to: number; row: TRow }]
  }>()

  /** Row records; `reorderable` writes the new order back (v-model:data). */
  const data = defineModel<TRow[]>('data', { default: () => [] })
  /** TanStack SortingState (v-model:sorting). */
  const sorting = defineModel<SortingState>('sorting')
  /** Keys of the selected rows, read from `rowKey` (v-model:selectedKeys). */
  const selectedKeys = defineModel<string[]>('selectedKeys')
  /** TanStack VisibilityState (v-model:columnVisibility). */
  const columnVisibility = defineModel<VisibilityState>('columnVisibility')
  /** Keys of the open tree rows (v-model:openKeys). */
  const openKeys = defineModel<string[]>('openKeys')

  const slots = defineSlots<
    {
      /** Title text at the start of the toolbar band. */
      title(): unknown
      /** Toolbar action band; scoped with the TanStack table instance. */
      toolbar(props: TableToolbarSlotProps<TRow>): unknown
      /** Active-filter chips row; same scope as toolbar. */
      filters(props: TableToolbarSlotProps<TRow>): unknown
      /** Caption content, wrapped in TableCaption. */
      caption(): unknown
      /** Empty state when there are no rows. */
      empty(): unknown
      /** Error state shown in place of the rows while `error` is set. */
      error(props: { message: string }): unknown
      /** Content after the last row that scrolls with the rows: DataTableLoadMore. */
      'load-more'(): unknown
      /** Band below the scroll viewport: DataTablePagination. */
      footer(): unknown
    } & TableCellSlots<TRow> &
      TableHeaderSlots<TRow>
  >()

  const attrs = useAttrs()
  const { t } = useTranslate({ table: en.table, dataTable: en.dataTable })
  const typed = <T,>(value: unknown): T => value as T

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'data-table'
  )

  const { captionId, registerCaption, frameAttrs, tableAttrs } = useTableFrame(attrs, () =>
    Boolean(slots.caption)
  )

  const host = {
    props: typed<DataTableSettings>(props),
    data: typed<Ref<DataTableRecord[]>>(data),
    models: { sorting, selectedKeys, columnVisibility, openKeys },
    emit: typed<DataTableEmits>({
      rowClick: (event: MouseEvent | KeyboardEvent, row: TRow) => emit('row-click', event, row),
      rowRemove: (event: KeyboardEvent, row: TRow) => emit('row-remove', event, row),
      filterApply: (event: Event, list: TableAppliedFilter[]) => emit('filter-apply', event, list),
      filterRemove: (event: Event, f: TableAppliedFilter) => emit('filter-remove', event, f),
      refresh: (event: Event) => emit('refresh', event),
      export: (event: Event, rows: TRow[]) => emit('export', event, rows),
      reorder: (
        event: KeyboardEvent | PointerEvent,
        payload: { from: number; to: number; row: TRow }
      ) => emit('reorder', event, payload)
    }),
    slots: typed<Slots>(slots)
  }
  const rootEl = ref<HTMLElement | null>(null)
  const slotsVersion = ref<number>(0)
  onBeforeUpdate(() => slotsVersion.value++)
  const core = useDataTableCore(host)
  const view = useDataTableView({ ...host, core, testId, t, tableAttrs, rootEl, slotsVersion })
  const { exposed, toolbarScope } = useDataTableProvide({
    ...host,
    core,
    view,
    testId,
    captionId,
    registerCaption
  })
  const { stacked, reorder } = view

  defineExpose(typed<TableExposed<TRow>>(exposed))
</script>

<script lang="ts">
  export type { DropdownMenuItemValue } from '../../navigation/dropdown-menu/injection-key'
  export type {
    TableCellSlotProps,
    TableCellSlots,
    TableColumn,
    TableDensity,
    TableExportButtonScope,
    TableExposed,
    TableHeaderSlotProps,
    TableHeaderSlots,
    TableToolbarSlotProps
  } from '../table/injection-key'
</script>

<template>
  <div
    ref="rootEl"
    v-bind="frameAttrs"
    :data-testid="testId"
    :data-bordered="bordered || null"
    :data-stacked="stacked || null"
    :data-density="density"
    :data-wrap="wrapLines || null"
    :style="
      view.viewportHeight.value
        ? { '--table-viewport-height': view.viewportHeight.value }
        : undefined
    "
    :class="ROOT_CLASS"
  >
    <TableToolbarBand
      :test-id="testId"
      :title="$slots['title']"
      :toolbar="$slots['toolbar']"
      :scope="toolbarScope"
    />
    <DataTableFilters />
    <DataTableViewport />
    <template v-if="reorder.active.value">
      <span
        :id="reorder.hintId"
        class="sr-only"
        >{{
          reorder.locked.value ? t('dataTable.reorderLocked') : t('dataTable.reorderHint')
        }}</span
      >
      <span
        role="status"
        :data-testid="`${testId}__reorder-status`"
        class="sr-only"
        >{{ reorder.message.value }}</span
      >
    </template>
    <slot name="footer" />
  </div>
</template>
