<script setup lang="ts" generic="TRow extends object = Record<string, unknown>">
  import { computed, nextTick, onBeforeUnmount, ref, useAttrs, useId } from 'vue'

  import { eventDirection, logicalArrowKey } from '../../../composables/use-direction'
  import { intlLocale, useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Checkbox from '../../inputs/checkbox/checkbox.vue'
  import type { DataGridCellEdit, DataGridColumn } from './types'

  defineOptions({
    name: 'DataGrid',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Columns in order: id, header, type, options, editable, width, minWidth, align; `type` picks the editor (default text). */
      columns?: DataGridColumn[]
      /** Field used as the stable row id (cursor, selection and edits follow it). */
      rowKey?: string
      /** Adds a leading checkbox column with Select all. */
      enableRowSelection?: boolean
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
      enableRowSelection: false,
      frozenFirstColumn: false,
      readonly: false,
      maxHeight: '',
      ariaLabel: ''
    }
  )

  const emit = defineEmits<{
    change: [event: Event, edit: DataGridCellEdit<TRow>]
    'row-add': [event: Event]
    'row-delete': [event: Event, rows: TRow[]]
    copy: [event: ClipboardEvent, text: string]
  }>()

  /** The rows; a committed edit writes a new array with a copy of the edited row. */
  const rows = defineModel<TRow[]>({ default: () => [] })
  /** Selected row ids, keyed by `rowKey`. */
  const rowSelection = defineModel<Record<string, boolean>>('rowSelection', {
    default: () => ({})
  })

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

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'data-data-grid'
  )
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const SELECT_WIDTH = 40
  const PAGE = 10
  const active = ref<{ row: number; col: number }>({ row: 0, col: 0 })
  const anchor = ref<{ row: number; col: number }>({ row: 0, col: 0 })
  const editing = ref<{ row: number; col: number } | null>(null)
  const draft = ref<string>('')
  const widths = ref<Record<string, number>>({})
  const resizing = ref<string | null>(null)

  const offset = computed<number>(() => (props.enableRowSelection ? 1 : 0))
  const colCount = computed<number>(() => props.columns.length + offset.value)
  const record = (row: TRow): Record<string, unknown> => row as Record<string, unknown>
  const idOf = (row: TRow): string => String(record(row)[props.rowKey] ?? '')
  const columnAt = (col: number): DataGridColumn | undefined => props.columns[col - offset.value]
  const widthOf = (column: DataGridColumn): number => widths.value[column.id] ?? column.width ?? 160
  const editable = (column: DataGridColumn): boolean => !props.readonly && column.editable !== false
  const readonlyAt = (col: number): boolean => {
    const column = columnAt(col)
    return column ? !editable(column) : false
  }
  const widthAt = (col: number): number => {
    const column = columnAt(col)
    return column ? widthOf(column) : SELECT_WIDTH
  }
  const displayAt = (row: TRow, col: number): string => {
    const column = columnAt(col)
    return column ? display(row, column) : ''
  }

  const selectedRows = computed<TRow[]>(() =>
    rows.value.filter((row) => rowSelection.value[idOf(row)])
  )
  const allSelected = computed<boolean>(
    () => rows.value.length > 0 && selectedRows.value.length === rows.value.length
  )

  const bounds = computed(() => ({
    top: Math.min(anchor.value.row, active.value.row),
    bottom: Math.max(anchor.value.row, active.value.row),
    start: Math.min(anchor.value.col, active.value.col),
    end: Math.max(anchor.value.col, active.value.col)
  }))
  const inRange = (row: number, col: number): boolean =>
    row >= bounds.value.top &&
    row <= bounds.value.bottom &&
    col >= bounds.value.start &&
    col <= bounds.value.end

  const cellId = (row: number, col: number): string => `${uid}-r${row}-c${col}`
  const frozenStyle = (col: number): Record<string, string> | undefined => {
    if (props.enableRowSelection && col === 0) return { insetInlineStart: '0' }
    if (props.frozenFirstColumn && col === offset.value)
      return { insetInlineStart: `${offset.value * SELECT_WIDTH}px` }
    return undefined
  }
  const frozen = (col: number): 'start' | null =>
    (props.enableRowSelection && col === 0) || (props.frozenFirstColumn && col === offset.value)
      ? 'start'
      : null

  const numberFormat = computed(() => new Intl.NumberFormat(intlLocale(locale.value)))
  const display = (row: TRow, column: DataGridColumn): string => {
    const value = record(row)[column.id]
    if (value === null || value === undefined || value === '') return ''
    if (column.type === 'boolean') return value ? t('dataGrid.true') : t('dataGrid.false')
    if (column.type === 'number' && typeof value === 'number')
      return numberFormat.value.format(value)
    if (column.type === 'select')
      return column.options?.find((option) => option.value === value)?.label ?? String(value)
    return String(value)
  }
  const raw = (row: TRow, column: DataGridColumn): string => {
    const value = record(row)[column.id]
    return value === null || value === undefined ? '' : String(value)
  }

  const focusActive = (): void => {
    void nextTick(() => {
      document.getElementById(cellId(active.value.row, active.value.col))?.focus()
    })
  }
  const move = (row: number, col: number, extend = false): void => {
    if (!rows.value.length || !colCount.value) return
    active.value = {
      row: Math.min(Math.max(row, 0), rows.value.length - 1),
      col: Math.min(Math.max(col, 0), colCount.value - 1)
    }
    if (!extend) anchor.value = { ...active.value }
    focusActive()
  }

  const toggleRow = (index: number): void => {
    const row = rows.value[index]
    if (!row) return
    const id = idOf(row)
    const next = { ...rowSelection.value }
    if (next[id]) delete next[id]
    else next[id] = true
    rowSelection.value = next
  }
  const toggleAll = (): void => {
    rowSelection.value = allSelected.value
      ? {}
      : Object.fromEntries(rows.value.map((row) => [idOf(row), true]))
  }

  const write = (event: Event, index: number, column: DataGridColumn, value: unknown): void => {
    const row = rows.value[index]
    if (!row) return
    const previous = record(row)[column.id]
    if (Object.is(previous, value)) return
    const next = { ...record(row), [column.id]: value } as TRow
    rows.value = rows.value.map((entry, i) => (i === index ? next : entry))
    emit('change', event, { row: next, columnId: column.id, value, previous })
  }

  const parse = (column: DataGridColumn, text: string, previous: unknown): unknown => {
    if (column.type === 'number') {
      if (text.trim() === '') return null
      const number = Number(text)
      return Number.isNaN(number) ? previous : number
    }
    if (column.type === 'select')
      return column.options?.find((option) => String(option.value) === text)?.value ?? previous
    return text
  }

  const startEdit = (event: Event, row: number, col: number, initial?: string): void => {
    const column = columnAt(col)
    const entry = rows.value[row]
    if (!column || !entry) {
      if (col < offset.value) toggleRow(row)
      return
    }
    if (!editable(column)) return
    if (column.type === 'boolean') return write(event, row, column, !record(entry)[column.id])
    editing.value = { row, col }
    draft.value = initial ?? raw(entry, column)
    void nextTick(() => {
      const editor = document.getElementById(`${cellId(row, col)}-editor`) as
        HTMLInputElement | HTMLSelectElement | null
      editor?.focus()
      if (initial === undefined && editor instanceof HTMLInputElement) editor.select()
    })
  }

  const commit = (event: Event, step?: { row: number; col: number }): void => {
    const cell = editing.value
    if (!cell) return
    editing.value = null
    const column = columnAt(cell.col)
    const entry = rows.value[cell.row]
    if (column && entry)
      write(event, cell.row, column, parse(column, draft.value, record(entry)[column.id]))
    if (step) move(cell.row + step.row, cell.col + step.col)
    else focusActive()
  }
  const cancel = (): void => {
    editing.value = null
    focusActive()
  }

  const onEditorKeydown = (event: KeyboardEvent): void => {
    event.stopPropagation()
    if (event.key === 'Escape') {
      event.preventDefault()
      return cancel()
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      return commit(event, { row: 1, col: 0 })
    }
    if (event.key === 'Tab') {
      event.preventDefault()
      commit(event, { row: 0, col: event.shiftKey ? -1 : 1 })
    }
  }
  const onEditorInput = (event: Event): void => {
    draft.value = (event.target as HTMLInputElement | HTMLSelectElement).value
  }
  const onSelectChange = (event: Event): void => {
    onEditorInput(event)
    commit(event)
  }

  const onCellKeydown = (event: KeyboardEvent, row: number, col: number): void => {
    if (editing.value) return
    const key = logicalArrowKey(event.key, eventDirection(event))
    const command = event.ctrlKey || event.metaKey
    const last = { row: rows.value.length - 1, col: colCount.value - 1 }
    const go = (r: number, c: number, extend = event.shiftKey): void => {
      event.preventDefault()
      move(r, c, extend)
    }
    switch (key) {
      case 'ArrowUp':
        return go(row - 1, col)
      case 'ArrowDown':
        return go(row + 1, col)
      case 'ArrowLeft':
        return go(row, col - 1)
      case 'ArrowRight':
        return go(row, col + 1)
      case 'Home':
        return command ? go(0, 0) : go(row, 0)
      case 'End':
        return command ? go(last.row, last.col) : go(row, last.col)
      case 'PageUp':
        return go(row - PAGE, col)
      case 'PageDown':
        return go(row + PAGE, col)
      case 'Tab': {
        const index = row * colCount.value + col + (event.shiftKey ? -1 : 1)
        if (index < 0 || index > last.row * colCount.value + last.col) return
        return go(Math.floor(index / colCount.value), index % colCount.value, false)
      }
      case 'Enter':
      case 'F2':
        event.preventDefault()
        return startEdit(event, row, col)
      case ' ':
        event.preventDefault()
        if (col < offset.value) return toggleRow(row)
        if (columnAt(col)?.type === 'boolean') return startEdit(event, row, col)
        return
      case 'Delete':
      case 'Backspace': {
        const column = columnAt(col)
        if (!column || !editable(column) || column.type === 'boolean' || column.type === 'select')
          return
        event.preventDefault()
        return write(event, row, column, column.type === 'number' ? null : '')
      }
      default:
        break
    }
    if (command && key.toLowerCase() === 'a') {
      event.preventDefault()
      anchor.value = { row: 0, col: 0 }
      active.value = { ...last }
      return
    }
    const column = columnAt(col)
    if (
      key.length === 1 &&
      !command &&
      !event.altKey &&
      column &&
      editable(column) &&
      (column.type ?? 'text') !== 'boolean' &&
      column.type !== 'select'
    ) {
      event.preventDefault()
      startEdit(event, row, col, key)
    }
  }

  const onCellFocus = (row: number, col: number): void => {
    if (active.value.row === row && active.value.col === col) return
    active.value = { row, col }
    anchor.value = { row, col }
  }

  const onCellPointerdown = (event: PointerEvent, row: number, col: number): void => {
    if (editing.value?.row === row && editing.value.col === col) return
    const again = active.value.row === row && active.value.col === col && !event.shiftKey
    move(row, col, event.shiftKey)
    if (again && event.pointerType !== 'mouse') startEdit(event, row, col)
  }

  const onCopy = (event: ClipboardEvent): void => {
    if (editing.value) return
    const { top, bottom, start, end } = bounds.value
    const lines: string[] = []
    for (let r = top; r <= bottom; r++) {
      const entry = rows.value[r]
      if (!entry) continue
      const cells: string[] = []
      for (let c = Math.max(start, offset.value); c <= end; c++) {
        const column = columnAt(c)
        if (column) cells.push(raw(entry, column))
      }
      lines.push(cells.join('\t'))
    }
    const text = lines.join('\n')
    event.clipboardData?.setData('text/plain', text)
    event.preventDefault()
    emit('copy', event, text)
  }

  const add = (event: Event): void => emit('row-add', event)
  const remove = (event: Event): void => {
    if (selectedRows.value.length) emit('row-delete', event, selectedRows.value)
  }

  let stopResize: (() => void) | null = null
  const startResize = (event: PointerEvent, column: DataGridColumn): void => {
    event.preventDefault()
    const startX = event.clientX
    const startWidth = widthOf(column)
    const sign = eventDirection(event) === 'rtl' ? -1 : 1
    resizing.value = column.id
    const onMove = (next: PointerEvent): void => {
      widths.value = {
        ...widths.value,
        [column.id]: Math.max(column.minWidth ?? 64, startWidth + sign * (next.clientX - startX))
      }
    }
    const onUp = (): void => stopResize?.()
    stopResize = () => {
      globalThis.removeEventListener('pointermove', onMove)
      globalThis.removeEventListener('pointerup', onUp)
      resizing.value = null
      stopResize = null
    }
    globalThis.addEventListener('pointermove', onMove)
    globalThis.addEventListener('pointerup', onUp)
  }
  const onResizeKeydown = (event: KeyboardEvent, column: DataGridColumn): void => {
    const key = logicalArrowKey(event.key, eventDirection(event))
    if (key !== 'ArrowLeft' && key !== 'ArrowRight') return
    event.preventDefault()
    event.stopPropagation()
    widths.value = {
      ...widths.value,
      [column.id]: Math.max(
        column.minWidth ?? 64,
        widthOf(column) + (key === 'ArrowRight' ? 16 : -16)
      )
    }
  }
  onBeforeUnmount(() => stopResize?.())
</script>

<script lang="ts">
  export type { DataGridCellEdit, DataGridColumn, DataGridColumnType } from './types'
</script>

<template>
  <div
    v-bind="rootAttrs"
    :data-testid="testId"
    :data-readonly="readonly || null"
    class="flex w-full flex-col overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-solid border-(--border-default) bg-(--bg-surface) text-body-sm text-(--text-default)"
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
      :data-testid="`${testId}__viewport`"
      :style="maxHeight ? { maxHeight } : undefined"
      class="min-h-0 min-w-0 overflow-auto [scrollbar-width:thin]"
    >
      <div
        role="grid"
        :aria-label="ariaLabel || undefined"
        :aria-rowcount="rows.length + 1"
        :aria-colcount="colCount"
        :aria-multiselectable="enableRowSelection || undefined"
        :aria-readonly="readonly || undefined"
        :data-testid="`${testId}__grid`"
        class="flex w-max min-w-full flex-col"
        @copy="onCopy"
      >
        <div
          role="row"
          aria-rowindex="1"
          class="sticky top-0 z-2 flex border-b-(length:--border-width-default) border-solid border-(--border-default) bg-(--bg-surface-raised)"
        >
          <div
            v-if="enableRowSelection"
            role="columnheader"
            aria-colindex="1"
            data-frozen="start"
            :style="{ width: `${SELECT_WIDTH}px`, ...frozenStyle(0) }"
            class="sticky z-1 flex shrink-0 items-center justify-center bg-(--bg-surface-raised)"
          >
            <Checkbox
              :model-value="allSelected"
              :indeterminate="selectedRows.length > 0 && !allSelected"
              :tabindex="-1"
              :aria-label="t('dataGrid.selectAll')"
              :data-testid="`${testId}__select-all`"
              @update:model-value="toggleAll"
            />
          </div>
          <div
            v-for="(column, index) in columns"
            :key="column.id"
            role="columnheader"
            :aria-colindex="index + offset + 1"
            :data-frozen="frozen(index + offset)"
            :data-resizing="resizing === column.id || null"
            :data-testid="`${testId}__head-${column.id}`"
            :style="{ width: `${widthOf(column)}px`, ...frozenStyle(index + offset) }"
            class="relative flex min-h-10 shrink-0 items-center px-(--spacing-sm) text-label-sm text-(--text-muted) data-[frozen]:sticky data-[frozen]:z-1 data-[frozen]:bg-(--bg-surface-raised)"
          >
            <span
              :data-align="column.align ?? 'start'"
              class="min-w-0 flex-1 truncate text-start data-[align=end]:text-end"
              >{{ column.header }}</span
            >
            <span
              role="separator"
              tabindex="0"
              aria-orientation="vertical"
              :aria-valuenow="widthOf(column)"
              :aria-valuemin="column.minWidth ?? 64"
              :aria-label="t('dataGrid.resize', { column: column.header })"
              :data-testid="`${testId}__resize-${column.id}`"
              class="absolute inset-y-0 -end-1.5 z-1 w-3 cursor-col-resize touch-none after:absolute after:inset-y-2 after:start-1/2 after:w-px after:bg-(--border-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
              @pointerdown="(event) => startResize(event, column)"
              @keydown="(event) => onResizeKeydown(event, column)"
            />
          </div>
        </div>

        <div
          v-if="rows.length === 0"
          role="row"
          aria-rowindex="2"
          :data-testid="`${testId}__empty`"
          class="sticky start-0 flex w-full"
        >
          <div
            role="gridcell"
            aria-colindex="1"
            class="w-full"
          >
            <slot name="empty">
              <EmptyState
                size="small"
                icon="pi pi-table"
                :title="t('dataGrid.emptyTitle')"
                :description="t('dataGrid.emptyDescription')"
              />
            </slot>
          </div>
        </div>

        <div
          v-for="(row, r) in rows"
          :key="idOf(row) || r"
          role="row"
          :aria-rowindex="r + 2"
          :aria-selected="enableRowSelection ? Boolean(rowSelection[idOf(row)]) : undefined"
          :data-state="rowSelection[idOf(row)] ? 'selected' : null"
          :data-testid="`${testId}__row`"
          class="group/row flex border-b-(length:--border-width-default) border-solid border-(--border-default) [content-visibility:auto] [contain-intrinsic-size:auto_2.5rem] last:border-b-0"
        >
          <div
            v-for="col in colCount"
            :id="cellId(r, col - 1)"
            :key="col"
            role="gridcell"
            :tabindex="active.row === r && active.col === col - 1 ? 0 : -1"
            :aria-colindex="col"
            :aria-selected="inRange(r, col - 1) || undefined"
            :aria-readonly="readonlyAt(col - 1) || undefined"
            :data-selected="inRange(r, col - 1) || null"
            :data-editing="(editing?.row === r && editing?.col === col - 1) || null"
            :data-frozen="frozen(col - 1)"
            :data-testid="
              columnAt(col - 1)
                ? `${testId}__cell-${r}-${columnAt(col - 1)?.id}`
                : `${testId}__select-${r}`
            "
            :style="{ width: `${widthAt(col - 1)}px`, ...frozenStyle(col - 1) }"
            class="relative flex min-h-10 shrink-0 cursor-default items-center bg-(--bg-surface) px-(--spacing-sm) outline-none transition-colors duration-150 ease-out group-hover/row:bg-(--bg-canvas) group-data-[state=selected]/row:bg-(--bg-selected) data-[selected]:bg-(--bg-selected) focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) data-[frozen]:sticky data-[frozen]:z-1 data-[editing]:p-0 motion-reduce:transition-none"
            @focus="onCellFocus(r, col - 1)"
            @keydown="(event) => onCellKeydown(event, r, col - 1)"
            @pointerdown="(event) => onCellPointerdown(event, r, col - 1)"
            @dblclick="(event) => startEdit(event, r, col - 1)"
          >
            <Checkbox
              v-if="col - 1 < offset"
              :model-value="Boolean(rowSelection[idOf(row)])"
              :tabindex="-1"
              :aria-label="t('dataGrid.selectRow')"
              class="mx-auto"
              @update:model-value="toggleRow(r)"
            />
            <template v-else-if="editing?.row === r && editing?.col === col - 1">
              <select
                v-if="columnAt(col - 1)?.type === 'select'"
                :id="`${cellId(r, col - 1)}-editor`"
                :value="draft"
                :aria-label="columnAt(col - 1)?.header"
                :data-testid="`${testId}__editor`"
                class="size-full min-h-10 rounded-(--shape-elements) border-none bg-(--bg-surface) px-(--spacing-sm) text-body-sm text-(--text-default) outline-none ring-2 ring-inset ring-(--ring-color)"
                @keydown="onEditorKeydown"
                @change="onSelectChange"
                @blur="commit"
              >
                <option
                  v-for="option in columnAt(col - 1)?.options ?? []"
                  :key="String(option.value)"
                  :value="String(option.value)"
                >
                  {{ option.label }}
                </option>
              </select>
              <input
                v-else
                :id="`${cellId(r, col - 1)}-editor`"
                :value="draft"
                :type="columnAt(col - 1)?.type === 'number' ? 'number' : 'text'"
                :aria-label="columnAt(col - 1)?.header"
                :data-testid="`${testId}__editor`"
                :data-align="columnAt(col - 1)?.align ?? 'start'"
                class="size-full min-h-10 rounded-(--shape-elements) border-none bg-(--bg-surface) px-(--spacing-sm) text-start text-body-sm text-(--text-default) outline-none ring-2 ring-inset ring-(--ring-color) data-[align=end]:text-end"
                @input="onEditorInput"
                @keydown="onEditorKeydown"
                @blur="commit"
              />
            </template>
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
    </div>
  </div>
</template>
