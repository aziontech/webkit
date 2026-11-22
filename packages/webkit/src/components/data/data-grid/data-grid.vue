<script setup lang="ts" generic="TRow extends object = Record<string, unknown>">
  import { computed, ref, useAttrs, useId } from 'vue'

  import { useScrollEdges } from '../../../composables/use-scroll-edges'
  import { intlLocale, useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Checkbox from '../../input/checkbox/checkbox.vue'
  import { useDataGridCells } from './composables/use-data-grid-cells'
  import { type DataGridEdit, useDataGridClipboard } from './composables/use-data-grid-clipboard'
  import { useDataGridCursor } from './composables/use-data-grid-cursor'
  import { useDataGridEdit } from './composables/use-data-grid-edit'
  import { useDataGridKeyboard } from './composables/use-data-grid-keyboard'
  import { useDataGridResize } from './composables/use-data-grid-resize'
  import { CELL_CLASS, FADE_END_CLASS, FADE_START_CLASS, ROOT_CLASS } from './lib/grid-classes'
  import { type DataGridBooleanLabels, displayText, HEADER } from './lib/grid-values'
  import DataGridEditor from './parts/data-grid-editor.vue'
  import DataGridHeader from './parts/data-grid-header.vue'
  import type { DataGridCellEdit, DataGridColumn } from './types'

  defineOptions({ name: 'DataGrid', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      /** Columns in order: id, header, type, options, editable, width, minWidth, align; `type` picks the editor (default text). */
      columns?: DataGridColumn[]
      /** Field used as the stable row id (cursor, selection and edits follow it). */
      rowKey?: string
      /** Adds a leading checkbox column with Select all. */
      selectable?: boolean
      /** Pins the first data column to the inline start edge while the grid scrolls sideways. */
      frozenFirstColumn?: boolean
      /** No cell can be edited; the cursor, range selection and copy still work. */
      readonly?: boolean
      /** Max height (CSS length) of the scrolling viewport; the header stays on top. */
      maxHeight?: string
      /** Accessible name of the grid when no visible heading names it. */
      ariaLabel?: string
    }>(),
    {
      columns: () => [],
      rowKey: 'id',
      selectable: false,
      frozenFirstColumn: false,
      readonly: false,
      maxHeight: '',
      ariaLabel: ''
    }
  )

  const emit = defineEmits<{
    change: [event: Event, edit: DataGridCellEdit<TRow>]
    'row-add': [event: Event]
    'row-remove': [event: Event, rows: TRow[]]
    copy: [event: ClipboardEvent, text: string]
  }>()

  /** The rows, the value the grid edits; a committed edit writes a new array with a copy of the edited row. */
  const rows = defineModel<TRow[]>({ default: () => [] })
  /** Keys of the selected rows, read from `rowKey` (v-model:selectedKeys). */
  const selectedKeys = defineModel<string[]>('selectedKeys', { default: () => [] })

  defineSlots<{
    /** Action band above the grid; `add` and `remove` emit the row hooks. */
    toolbar(props: {
      selectedRows: TRow[]
      selectedCount: number
      add: (event: Event) => void
      remove: (event: Event) => void
    }): unknown
    /** Shown in place of the rows when there are none. */
    empty(): unknown
  }>()

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ dataGrid: en.dataGrid })
  const uid = useId()

  const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? 'data-grid')
  const GRID_ATTRS = ['aria-labelledby', 'aria-describedby']
  const rootAttrs = computed(() =>
    Object.fromEntries(
      Object.entries(attrs).filter(([key]) => key !== 'data-testid' && !GRID_ATTRS.includes(key))
    )
  )
  const gridAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => GRID_ATTRS.includes(key)))
  )

  const cells = useDataGridCells(
    () => props.columns,
    () => props.selectable,
    () => props.frozenFirstColumn,
    () => props.readonly,
    uid
  )
  const {
    offset,
    colCount,
    columnAt,
    widthAt,
    readonlyAt,
    cellId,
    frozen,
    frozenStyle,
    widthsKey,
    frozenWidth
  } = cells
  const cursor = useDataGridCursor(() => rows.value.length, cells)
  const { active, bounds, inRange, focusActive } = cursor

  const record = (row: TRow): Record<string, unknown> => row as Record<string, unknown>
  const recordAt = (index: number): Record<string, unknown> | undefined => {
    const row = rows.value[index]
    return row ? record(row) : undefined
  }
  const idOf = (row: TRow): string => String(record(row)[props.rowKey] ?? '')
  const keyOf = (row: TRow, index: number): string => idOf(row) || `#${index}`

  const selectedSet = computed<Set<string>>(() => new Set(selectedKeys.value))
  const selectedRows = computed<TRow[]>(() =>
    rows.value.filter((row) => selectedSet.value.has(idOf(row)))
  )
  const allSelected = computed<boolean>(
    () => rows.value.length > 0 && selectedRows.value.length === rows.value.length
  )
  const toggleRow = (index: number): void => {
    const row = rows.value[index]
    if (!row) return
    const id = idOf(row)
    selectedKeys.value = selectedSet.value.has(id)
      ? selectedKeys.value.filter((key) => key !== id)
      : [...selectedKeys.value, id]
  }
  const toggleAll = (): void => {
    selectedKeys.value = allSelected.value ? [] : rows.value.map((row) => idOf(row))
  }

  const labels = (): DataGridBooleanLabels => ({ yes: t('dataGrid.true'), no: t('dataGrid.false') })
  const numberFormat = computed(() => new Intl.NumberFormat(intlLocale(locale.value)))
  const displayAt = (row: TRow, col: number): string => {
    const column = columnAt(col)
    return column ? displayText(record(row)[column.id], column, labels(), numberFormat.value) : ''
  }
  const rowName = (row: TRow, index: number): string =>
    (props.columns[0] && displayAt(row, offset.value)) || idOf(row) || String(index + 1)

  const apply = (event: Event, edits: DataGridEdit[]): void => {
    const next = [...rows.value]
    const changes: (DataGridEdit & { previous: unknown })[] = []
    for (const edit of edits) {
      const row = next[edit.index]
      const previous = row && record(row)[edit.column.id]
      if (!row || Object.is(previous, edit.value)) continue
      next[edit.index] = { ...record(row), [edit.column.id]: edit.value } as TRow
      changes.push({ ...edit, previous })
    }
    if (!changes.length) return
    rows.value = next
    for (const { index, column, value, previous } of changes)
      emit('change', event, { row: next[index] as TRow, columnId: column.id, value, previous })
  }
  const write = (event: Event, index: number, column: DataGridColumn, value: unknown): void =>
    apply(event, [{ index, column, value }])

  const edit = useDataGridEdit(cells, {
    record: recordAt,
    write,
    toggleRow,
    focusActive,
    move: cursor.move,
    labels
  })
  const { editing, draft, invalid, isEditing, startEdit } = edit

  const rowState = (row: number): string => {
    const { top, bottom, start, end } = bounds.value
    const ranged = row >= top && row <= bottom ? `${start}-${end}` : ''
    const cursorCol = active.value.row === row ? active.value.col : ''
    const editState =
      editing.value?.row === row ? `${editing.value.col}:${invalid.value}:${draft.value}` : ''
    return `${ranged}|${cursorCol}|${editState}`
  }

  const viewportEl = ref<HTMLElement | null>(null)
  const gridEl = ref<HTMLElement | null>(null)
  const {
    start: overflowStart,
    end: overflowEnd,
    measure: measureEdges
  } = useScrollEdges(viewportEl)

  const { announcement, copyRange, onCopy, onPaste } = useDataGridClipboard(cells, {
    editing: () => Boolean(editing.value),
    locked: () => props.readonly,
    bounds: () => bounds.value,
    rowCount: () => rows.value.length,
    record: recordAt,
    labels,
    apply,
    place: cursor.place,
    focusActive,
    copied: (event, text) => emit('copy', event, text),
    t
  })

  const resize = useDataGridResize(cells)
  useDataGridKeyboard(gridEl, cells, cursor, edit, resize, {
    rowCount: () => rows.value.length,
    toggleRow,
    toggleAll,
    write,
    copyRange
  })

  const onCellFocus = (row: number, col: number): void => {
    if (!cursor.isActive(row, col)) cursor.place({ row, col }, { row, col })
  }

  const onCellPointerdown = (event: PointerEvent, row: number, col: number): void => {
    if (isEditing(row, col)) return
    const again = cursor.isActive(row, col) && !event.shiftKey
    cursor.move(row, col, event.shiftKey)
    if (again && event.pointerType !== 'mouse') startEdit(event, row, col)
  }

  const add = (event: Event): void => emit('row-add', event)
  const remove = (event: Event): void => {
    if (selectedRows.value.length) emit('row-remove', event, selectedRows.value)
  }
</script>

<script lang="ts">
  export type {
    DataGridCellEdit,
    DataGridColumn,
    DataGridColumnAlign,
    DataGridColumnType
  } from './types'
</script>

<template>
  <div
    v-bind="rootAttrs"
    :data-testid="testId"
    :data-readonly="readonly || null"
    :class="ROOT_CLASS"
  >
    <div
      v-if="$slots['toolbar']"
      :data-testid="`${testId}__toolbar`"
      class="flex flex-wrap items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-solid border-(--border-default) p-(--spacing-sm)"
    >
      <slot
        name="toolbar"
        :selected-rows="selectedRows"
        :selected-count="selectedRows.length"
        :add="add"
        :remove="remove"
      />
    </div>
    <div
      :data-testid="`${testId}__scroll`"
      :data-overflow-start="overflowStart || undefined"
      :data-overflow-end="overflowEnd || undefined"
      class="group/scroll relative flex min-h-0 min-w-0 flex-col"
    >
      <div
        ref="viewportEl"
        :data-testid="`${testId}__viewport`"
        :style="maxHeight ? { maxHeight } : undefined"
        class="min-h-0 min-w-0 overflow-auto [scrollbar-width:thin]"
        @scroll.passive="measureEdges"
      >
        <div
          ref="gridEl"
          v-bind="gridAttrs"
          role="grid"
          :aria-label="ariaLabel || undefined"
          :aria-rowcount="rows.length + 1"
          :aria-colcount="colCount"
          aria-multiselectable="true"
          :aria-readonly="readonly || undefined"
          :data-testid="`${testId}__grid`"
          class="flex w-max min-w-full flex-col"
          @copy="onCopy"
          @paste="onPaste"
        >
          <DataGridHeader
            :cells="cells"
            :cursor="cursor"
            :resize="resize"
            :all-selected="allSelected"
            :some-selected="selectedRows.length > 0"
            :test-id="testId"
            @focus-cell="(col) => onCellFocus(HEADER, col)"
            @press-cell="(event, col) => onCellPointerdown(event, HEADER, col)"
            @toggle-all="toggleAll"
          />

          <div
            v-for="(row, r) in rows"
            :key="keyOf(row, r)"
            v-memo="[
              row,
              selectedSet.has(idOf(row)),
              rowState(r),
              widthsKey,
              colCount,
              readonly,
              frozenFirstColumn,
              columns,
              locale
            ]"
            role="row"
            :aria-rowindex="r + 2"
            :aria-selected="selectable ? selectedSet.has(idOf(row)) : undefined"
            :data-state="selectedSet.has(idOf(row)) ? 'selected' : null"
            :data-testid="`${testId}__row`"
            class="group/row flex border-b-(length:--border-width-default) border-solid border-(--border-default) [content-visibility:auto] [contain-intrinsic-size:auto_2.5rem] last:border-b-0"
          >
            <div
              v-for="col in colCount"
              :id="cellId(r, col - 1)"
              :key="col"
              role="gridcell"
              :tabindex="cursor.isActive(r, col - 1) ? 0 : -1"
              :aria-colindex="col"
              :aria-selected="inRange(r, col - 1)"
              :aria-readonly="readonlyAt(col - 1) || undefined"
              :data-selected="inRange(r, col - 1) || null"
              :data-editing="isEditing(r, col - 1) || null"
              :data-invalid="(isEditing(r, col - 1) && invalid) || null"
              :data-frozen="frozen(col - 1)"
              :data-testid="
                columnAt(col - 1)
                  ? `${testId}__cell-${r}-${columnAt(col - 1)?.id}`
                  : `${testId}__select-${r}`
              "
              :style="{ width: `${widthAt(col - 1)}px`, ...frozenStyle(col - 1) }"
              :class="CELL_CLASS"
              @focus="onCellFocus(r, col - 1)"
              @pointerdown="(event) => onCellPointerdown(event, r, col - 1)"
            >
              <Checkbox
                v-if="col - 1 < offset"
                :model-value="selectedSet.has(idOf(row))"
                :tabindex="-1"
                :aria-label="t('dataGrid.selectRow', { row: rowName(row, r) })"
                class="mx-auto"
                @update:model-value="toggleRow(r)"
              />
              <DataGridEditor
                v-else-if="isEditing(r, col - 1)"
                :column="columnAt(col - 1)"
                :cell-id="cellId(r, col - 1)"
                :edit="edit"
                :test-id="testId"
              />
              <bdi
                v-else
                :data-align="columnAt(col - 1)?.align ?? 'start'"
                :data-readonly="readonlyAt(col - 1) || null"
                class="min-w-0 flex-1 truncate text-start data-[align=end]:text-end data-[align=end]:tabular-nums data-[readonly]:text-(--text-muted)"
                >{{ displayAt(row, col - 1) }}</bdi
              >
            </div>
          </div>
        </div>
        <div
          v-if="rows.length === 0"
          :data-testid="`${testId}__empty`"
          class="sticky start-0 w-full"
        >
          <slot name="empty">
            <EmptyState
              size="small"
              icon="az az-table"
              :title="t('dataGrid.emptyTitle')"
              :description="t('dataGrid.emptyDescription')"
            />
          </slot>
        </div>
      </div>
      <span
        aria-hidden="true"
        :data-testid="`${testId}__fade-start`"
        :style="{ insetInlineStart: `${frozenWidth}px`, width: `${overflowStart}px` }"
        :class="FADE_START_CLASS"
      />
      <span
        aria-hidden="true"
        :data-testid="`${testId}__fade-end`"
        :style="{ width: `${overflowEnd}px` }"
        :class="FADE_END_CLASS"
      />
    </div>
    <div
      role="status"
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__status`"
    >
      {{ announcement }}
    </div>
  </div>
</template>
