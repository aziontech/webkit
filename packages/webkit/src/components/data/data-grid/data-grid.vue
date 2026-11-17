<script setup lang="ts" generic="TRow extends object = Record<string, unknown>">
  import { computed, nextTick, onBeforeUnmount, ref, useAttrs, useId } from 'vue'

  import { eventDirection, logicalArrowKey } from '../../../composables/use-direction'
  import { intlLocale, useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { copyText } from '../../../utils/clipboard'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Checkbox from '../../input/checkbox/checkbox.vue'
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

  const SELECT_WIDTH = 40
  const MAX_WIDTH = 960
  const RESIZE_STEP = 16
  const PAGE = 10
  const HEADER = -1
  const active = ref<{ row: number; col: number }>({ row: 0, col: 0 })
  const anchor = ref<{ row: number; col: number }>({ row: 0, col: 0 })
  const editing = ref<{ row: number; col: number } | null>(null)
  const draft = ref<string>('')
  const invalid = ref<boolean>(false)
  const widths = ref<Record<string, number>>({})
  const resizing = ref<string | null>(null)

  const offset = computed<number>(() => (props.selectable ? 1 : 0))
  const colCount = computed<number>(() => props.columns.length + offset.value)
  const record = (row: TRow): Record<string, unknown> => row as Record<string, unknown>
  const idOf = (row: TRow): string => String(record(row)[props.rowKey] ?? '')
  const keyOf = (row: TRow, index: number): string => idOf(row) || `#${index}`
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
  const widthsKey = computed<string>(() => JSON.stringify(widths.value))

  const selectedSet = computed<Set<string>>(() => new Set(selectedKeys.value))
  const selectedRows = computed<TRow[]>(() =>
    rows.value.filter((row) => selectedSet.value.has(idOf(row)))
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
    row >= Math.max(bounds.value.top, 0) &&
    row <= bounds.value.bottom &&
    col >= bounds.value.start &&
    col <= bounds.value.end

  const rowState = (row: number): string => {
    const { top, bottom, start, end } = bounds.value
    const ranged = row >= top && row <= bottom ? `${start}-${end}` : ''
    const cursor = active.value.row === row ? active.value.col : ''
    const edit =
      editing.value?.row === row ? `${editing.value.col}:${invalid.value}:${draft.value}` : ''
    return `${ranged}|${cursor}|${edit}`
  }

  const cellId = (row: number, col: number): string => `${uid}-r${row}-c${col}`
  const frozenStyle = (col: number): Record<string, string> | undefined => {
    if (props.selectable && col === 0) return { insetInlineStart: '0' }
    if (props.frozenFirstColumn && col === offset.value)
      return { insetInlineStart: `${offset.value * SELECT_WIDTH}px` }
    return undefined
  }
  const frozen = (col: number): 'start' | null =>
    (props.selectable && col === 0) || (props.frozenFirstColumn && col === offset.value)
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
  const displayAt = (row: TRow, col: number): string => {
    const column = columnAt(col)
    return column ? display(row, column) : ''
  }
  const raw = (row: TRow, column: DataGridColumn): string => {
    const value = record(row)[column.id]
    return value === null || value === undefined ? '' : String(value)
  }
  const rowName = (row: TRow, index: number): string => {
    const first = props.columns[0]
    return (first && display(row, first)) || idOf(row) || String(index + 1)
  }

  const focusActive = (): void => {
    void nextTick(() => {
      document.getElementById(cellId(active.value.row, active.value.col))?.focus()
    })
  }
  const move = (row: number, col: number, extend = false): void => {
    if (!colCount.value) return
    active.value = {
      row: Math.min(Math.max(row, HEADER), rows.value.length - 1),
      col: Math.min(Math.max(col, 0), colCount.value - 1)
    }
    if (!extend || active.value.row === HEADER || anchor.value.row === HEADER)
      anchor.value = { ...active.value }
    focusActive()
  }

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

  type Edit = { index: number; column: DataGridColumn; value: unknown }
  const apply = (event: Event, edits: Edit[]): void => {
    const next = [...rows.value]
    const changes: (Edit & { previous: unknown })[] = []
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

  const parse = (column: DataGridColumn, text: string): { value: unknown; valid: boolean } => {
    if (column.type === 'number') {
      if (text.trim() === '') return { value: null, valid: true }
      const number = Number(text)
      return { value: number, valid: !Number.isNaN(number) }
    }
    if (column.type === 'select') {
      const option =
        column.options?.find((entry) => String(entry.value) === text) ??
        column.options?.find((entry) => entry.label.toLowerCase() === text.trim().toLowerCase())
      return { value: option?.value, valid: Boolean(option) }
    }
    if (column.type === 'boolean') {
      const key = text.trim().toLowerCase()
      const yes = ['true', '1', 'yes', t('dataGrid.true').toLowerCase()].includes(key)
      const no = ['false', '0', 'no', t('dataGrid.false').toLowerCase()].includes(key)
      return { value: yes, valid: yes || no }
    }
    return { value: text, valid: true }
  }

  const startEdit = (event: Event, row: number, col: number, initial?: string): void => {
    if (row === HEADER) return
    const column = columnAt(col)
    const entry = rows.value[row]
    if (!column || !entry) {
      if (col < offset.value) toggleRow(row)
      return
    }
    if (!editable(column)) return
    if (column.type === 'boolean') return write(event, row, column, !record(entry)[column.id])
    editing.value = { row, col }
    invalid.value = false
    draft.value = initial ?? raw(entry, column)
    void nextTick(() => {
      const editor = document.getElementById(`${cellId(row, col)}-editor`) as
        HTMLInputElement | HTMLSelectElement | null
      editor?.focus()
      if (initial === undefined && editor instanceof HTMLInputElement) editor.select()
    })
  }

  const close = (): void => {
    editing.value = null
    invalid.value = false
  }
  const cancel = (): void => {
    close()
    focusActive()
  }
  const commit = (event: Event, step?: { row: number; col: number }): void => {
    const cell = editing.value
    if (!cell) return
    const column = columnAt(cell.col)
    if (!column) return cancel()
    const result = parse(column, draft.value)
    if (!result.valid) {
      if (event.type === 'blur') return close()
      invalid.value = true
      return
    }
    close()
    write(event, cell.row, column, result.value)
    if (!step) return focusActive()
    const index = cell.row * colCount.value + cell.col + step.col
    const row = step.row ? cell.row + step.row : Math.floor(index / colCount.value)
    const col = step.row ? cell.col : ((index % colCount.value) + colCount.value) % colCount.value
    move(row, col)
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
    invalid.value = false
  }

  const tsvCell = (value: string): string =>
    /[\t\r\n"]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value
  const rangeText = (): string => {
    const { top, bottom, start, end } = bounds.value
    const lines: string[] = []
    for (let r = Math.max(top, 0); r <= bottom; r++) {
      const entry = rows.value[r]
      if (!entry) continue
      const cells: string[] = []
      for (let c = Math.max(start, offset.value); c <= end; c++) {
        const column = columnAt(c)
        if (column) cells.push(tsvCell(raw(entry, column)))
      }
      lines.push(cells.join('\t'))
    }
    return lines.join('\n')
  }
  let copyPending = false
  const onCopy = (event: ClipboardEvent): void => {
    if (editing.value || !event.clipboardData) return
    copyPending = false
    const text = rangeText()
    event.clipboardData.setData('text/plain', text)
    event.preventDefault()
    emit('copy', event, text)
  }
  const copyRange = (): void => {
    copyPending = true
    globalThis.setTimeout(() => {
      if (!copyPending) return
      copyPending = false
      document.addEventListener('copy', onCopy, { once: true })
      const copied = document.execCommand('copy')
      document.removeEventListener('copy', onCopy)
      if (!copied) void copyText(rangeText())
    })
  }

  const tsv = (text: string): string[][] => {
    const lines: string[][] = [[]]
    for (const [, quoted, plain, end] of text.matchAll(
      /(?:"((?:[^"]|"")*)"|([^\t\r\n]*))(\t|\r?\n|\r|$)/g
    )) {
      lines.at(-1)?.push(quoted?.replaceAll('""', '"') ?? plain ?? '')
      if (!end) break
      if (end !== '\t') lines.push([])
    }
    if (lines.length > 1 && lines.at(-1)?.join('\t') === '') lines.pop()
    return lines
  }
  const announcement = ref<string>('')
  const announce = (text: string): void => {
    announcement.value = ''
    void nextTick(() => (announcement.value = text))
  }
  const onPaste = (event: ClipboardEvent): void => {
    const text = event.clipboardData?.getData('text/plain') ?? ''
    if (editing.value || !text || bounds.value.bottom < 0) return
    event.preventDefault()
    if (props.readonly) return announce(t('dataGrid.pasteReadonly'))
    const block = tsv(text)
    const { top, bottom, start, end } = bounds.value
    const fill = block.length === 1 && block[0]?.length === 1
    const row0 = Math.max(top, 0)
    const col0 = Math.max(start, offset.value)
    const height = fill ? bottom - row0 + 1 : block.length
    const width = fill ? end - col0 + 1 : Math.max(...block.map((line) => line.length))
    const last = {
      row: Math.min(row0 + height, rows.value.length) - 1,
      col: Math.min(col0 + width, colCount.value) - 1
    }
    if (last.row < row0 || last.col < col0) return
    const edits: Edit[] = []
    let skipped = 0
    for (let r = row0; r <= last.row; r++)
      for (let c = col0; c <= last.col; c++) {
        const column = columnAt(c)
        const value = fill ? block[0]?.[0] : block[r - row0]?.[c - col0]
        if (!column || value === undefined) continue
        const result = parse(column, value)
        if (editable(column) && result.valid) edits.push({ index: r, column, value: result.value })
        else skipped++
      }
    apply(event, edits)
    active.value = { row: row0, col: col0 }
    anchor.value = { ...last }
    focusActive()
    const count = edits.length
    announce(
      skipped ? t('dataGrid.pastedSkipped', { count, skipped }) : t('dataGrid.pasted', { count })
    )
  }

  const focusHandle = (col: number): void => {
    document.getElementById(`${cellId(HEADER, col)}-resize`)?.focus()
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
        return go(Math.max(row - PAGE, 0), col)
      case 'PageDown':
        return go(row + PAGE, col)
      case 'Enter':
      case 'F2':
        event.preventDefault()
        if (row === HEADER) return columnAt(col) ? focusHandle(col) : undefined
        return startEdit(event, row, col)
      case ' ':
        event.preventDefault()
        if (col < offset.value) return row === HEADER ? toggleAll() : toggleRow(row)
        if (row !== HEADER && columnAt(col)?.type === 'boolean') return startEdit(event, row, col)
        return
      case 'Delete':
      case 'Backspace': {
        const column = columnAt(col)
        if (
          row === HEADER ||
          !column ||
          !editable(column) ||
          column.type === 'boolean' ||
          column.type === 'select'
        )
          return
        event.preventDefault()
        return write(event, row, column, column.type === 'number' ? null : '')
      }
      default:
        break
    }
    if (command && key.toLowerCase() === 'c') return copyRange()
    if (command && key.toLowerCase() === 'a') {
      event.preventDefault()
      anchor.value = { row: 0, col: 0 }
      active.value = { row: Math.max(last.row, 0), col: last.col }
      return
    }
    const column = columnAt(col)
    if (
      row !== HEADER &&
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

  const add = (event: Event): void => emit('row-add', event)
  const remove = (event: Event): void => {
    if (selectedRows.value.length) emit('row-remove', event, selectedRows.value)
  }

  const clampWidth = (column: DataGridColumn, width: number): number =>
    Math.min(MAX_WIDTH, Math.max(column.minWidth ?? 64, width))

  let stopResize: (() => void) | null = null
  const startResize = (event: PointerEvent, column: DataGridColumn): void => {
    event.preventDefault()
    event.stopPropagation()
    const startX = event.clientX
    const startWidth = widthOf(column)
    const sign = eventDirection(event) === 'rtl' ? -1 : 1
    resizing.value = column.id
    const onMove = (next: PointerEvent): void => {
      widths.value = {
        ...widths.value,
        [column.id]: clampWidth(column, startWidth + sign * (next.clientX - startX))
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
  const onResizeKeydown = (event: KeyboardEvent, column: DataGridColumn, col: number): void => {
    event.stopPropagation()
    if (event.key === 'Escape' || event.key === 'Enter') {
      event.preventDefault()
      return focusActive()
    }
    const key = logicalArrowKey(event.key, eventDirection(event))
    if (key !== 'ArrowLeft' && key !== 'ArrowRight') return
    event.preventDefault()
    widths.value = {
      ...widths.value,
      [column.id]: clampWidth(
        column,
        widthOf(column) + (key === 'ArrowRight' ? RESIZE_STEP : -RESIZE_STEP)
      )
    }
    active.value = { row: HEADER, col }
  }
  onBeforeUnmount(() => stopResize?.())
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
    class="flex w-full flex-col overflow-hidden rounded-(--shape-control) border-(length:--border-width-default) border-solid border-(--border-default) bg-(--bg-surface) text-body-sm text-(--text-default)"
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
        <div
          role="row"
          aria-rowindex="1"
          class="sticky top-0 z-2 flex border-b-(length:--border-width-default) border-solid border-(--border-default) bg-(--bg-surface-raised)"
        >
          <div
            v-for="col in colCount"
            :id="cellId(HEADER, col - 1)"
            :key="col"
            role="columnheader"
            :tabindex="active.row === HEADER && active.col === col - 1 ? 0 : -1"
            :aria-colindex="col"
            :data-frozen="frozen(col - 1)"
            :data-resizing="resizing === columnAt(col - 1)?.id || null"
            :data-testid="
              columnAt(col - 1)
                ? `${testId}__head-${columnAt(col - 1)?.id}`
                : `${testId}__select-all`
            "
            :style="{ width: `${widthAt(col - 1)}px`, ...frozenStyle(col - 1) }"
            class="relative flex min-h-10 shrink-0 items-center bg-(--bg-surface-raised) px-(--spacing-sm) text-label-sm text-(--text-muted) outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) data-[frozen]:sticky data-[frozen]:z-1 pointer-coarse:min-h-11"
            @focus="onCellFocus(HEADER, col - 1)"
            @keydown="(event) => onCellKeydown(event, HEADER, col - 1)"
            @pointerdown="(event) => onCellPointerdown(event, HEADER, col - 1)"
          >
            <Checkbox
              v-if="col - 1 < offset"
              :model-value="allSelected"
              :indeterminate="selectedRows.length > 0 && !allSelected"
              :tabindex="-1"
              :aria-label="t('dataGrid.selectAll')"
              class="mx-auto"
              @update:model-value="toggleAll"
            />
            <template v-else>
              <span
                :data-align="columnAt(col - 1)?.align ?? 'start'"
                class="min-w-0 flex-1 truncate text-start data-[align=end]:text-end"
                >{{ columnAt(col - 1)?.header }}</span
              >
              <span
                :id="`${cellId(HEADER, col - 1)}-resize`"
                role="separator"
                tabindex="-1"
                aria-orientation="vertical"
                :aria-valuenow="widthAt(col - 1)"
                :aria-valuemin="columnAt(col - 1)?.minWidth ?? 64"
                :aria-valuemax="MAX_WIDTH"
                :aria-label="t('dataGrid.resize', { column: columnAt(col - 1)?.header ?? '' })"
                :data-testid="`${testId}__resize-${columnAt(col - 1)?.id}`"
                class="absolute inset-y-0 -end-3 z-1 w-6 cursor-col-resize touch-none after:absolute after:inset-y-2 after:start-1/2 after:w-px after:bg-(--border-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) pointer-coarse:-end-[1.375rem] pointer-coarse:w-11"
                @pointerdown="(event) => startResize(event, columnAt(col - 1) as DataGridColumn)"
                @keydown="
                  (event) => onResizeKeydown(event, columnAt(col - 1) as DataGridColumn, col - 1)
                "
              />
            </template>
          </div>
        </div>

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
            :tabindex="active.row === r && active.col === col - 1 ? 0 : -1"
            :aria-colindex="col"
            :aria-selected="inRange(r, col - 1)"
            :aria-readonly="readonlyAt(col - 1) || undefined"
            :data-selected="inRange(r, col - 1) || null"
            :data-editing="(editing?.row === r && editing?.col === col - 1) || null"
            :data-invalid="(editing?.row === r && editing?.col === col - 1 && invalid) || null"
            :data-frozen="frozen(col - 1)"
            :data-testid="
              columnAt(col - 1)
                ? `${testId}__cell-${r}-${columnAt(col - 1)?.id}`
                : `${testId}__select-${r}`
            "
            :style="{ width: `${widthAt(col - 1)}px`, ...frozenStyle(col - 1) }"
            class="relative flex min-h-10 shrink-0 cursor-default items-center bg-(--bg-surface) px-(--spacing-sm) outline-none transition-colors duration-150 ease-out group-hover/row:bg-(--bg-canvas) group-data-[state=selected]/row:bg-(--bg-selected) data-[selected]:bg-(--bg-selected) focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) data-[frozen]:sticky data-[frozen]:z-1 data-[editing]:p-0 motion-reduce:transition-none pointer-coarse:min-h-11"
            @focus="onCellFocus(r, col - 1)"
            @keydown="(event) => onCellKeydown(event, r, col - 1)"
            @pointerdown="(event) => onCellPointerdown(event, r, col - 1)"
            @dblclick="(event) => startEdit(event, r, col - 1)"
          >
            <Checkbox
              v-if="col - 1 < offset"
              :model-value="selectedSet.has(idOf(row))"
              :tabindex="-1"
              :aria-label="t('dataGrid.selectRow', { row: rowName(row, r) })"
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
                class="size-full min-h-10 rounded-(--shape-control) border-none bg-(--bg-surface) px-(--spacing-sm) text-body-sm text-(--text-default) outline-none ring-2 ring-inset ring-(--ring-color) pointer-coarse:min-h-11"
                @keydown="onEditorKeydown"
                @change="onEditorInput"
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
              <template v-else>
                <input
                  :id="`${cellId(r, col - 1)}-editor`"
                  :value="draft"
                  type="text"
                  :inputmode="columnAt(col - 1)?.type === 'number' ? 'decimal' : undefined"
                  :aria-label="columnAt(col - 1)?.header"
                  :aria-invalid="invalid || undefined"
                  :aria-describedby="invalid ? `${cellId(r, col - 1)}-error` : undefined"
                  :data-align="columnAt(col - 1)?.align ?? 'start'"
                  :data-invalid="invalid || null"
                  :data-testid="`${testId}__editor`"
                  class="size-full min-h-10 rounded-(--shape-control) border-none bg-(--bg-surface) px-(--spacing-sm) text-start text-body-sm text-(--text-default) outline-none ring-2 ring-inset ring-(--ring-color) data-[align=end]:text-end data-[invalid]:ring-(--danger-border) pointer-coarse:min-h-11"
                  @input="onEditorInput"
                  @keydown="onEditorKeydown"
                  @blur="commit"
                />
                <span
                  v-if="invalid"
                  :id="`${cellId(r, col - 1)}-error`"
                  role="alert"
                  :data-testid="`${testId}__error`"
                  class="absolute start-0 top-full z-3 mt-(--spacing-2xs) whitespace-nowrap rounded-(--shape-control) border-(length:--border-width-default) border-solid border-(--danger-border) bg-(--bg-surface) px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-default)"
                  >{{ t('dataGrid.invalidNumber') }}</span
                >
              </template>
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
