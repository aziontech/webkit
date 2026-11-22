import { nextTick, onScopeDispose, readonly, type Ref, ref } from 'vue'

import type { UseTranslateReturn } from '../../../../composables/use-translate'
import { copyText } from '../../../../utils/clipboard'
import {
  type DataGridBooleanLabels,
  type DataGridBounds,
  type DataGridCell,
  parseCell,
  parseTsv,
  pasteArea,
  rawText,
  toTsv
} from '../lib/grid-values'
import type { DataGridColumn } from '../types'
import type { UseDataGridCellsReturn } from './use-data-grid-cells'

export type DataGridEdit = { index: number; column: DataGridColumn; value: unknown }

export interface DataGridClipboardHost {
  editing: () => boolean
  locked: () => boolean
  bounds: () => DataGridBounds
  rowCount: () => number
  record: (row: number) => Record<string, unknown> | undefined
  labels: () => DataGridBooleanLabels
  apply: (event: Event, edits: DataGridEdit[]) => void
  place: (active: DataGridCell, anchor?: DataGridCell) => void
  focusActive: () => void
  copied: (event: ClipboardEvent, text: string) => void
  t: UseTranslateReturn['t']
}

export interface UseDataGridClipboardReturn {
  announcement: Readonly<Ref<string>>
  copyRange: () => void
  onCopy: (event: ClipboardEvent) => void
  onPaste: (event: ClipboardEvent) => void
}

const rangeLines = (cells: UseDataGridCellsReturn, host: DataGridClipboardHost): string[][] => {
  const { top, bottom, start, end } = host.bounds()
  const lines: string[][] = []
  for (let r = Math.max(top, 0); r <= bottom; r++) {
    const entry = host.record(r)
    if (!entry) continue
    const line: string[] = []
    for (let c = Math.max(start, cells.offset.value); c <= end; c++) {
      const column = cells.columnAt(c)
      if (column) line.push(rawText(entry[column.id]))
    }
    lines.push(line)
  }
  return lines
}

const pasteEdits = (cells: UseDataGridCellsReturn, host: DataGridClipboardHost, text: string) => {
  const area = pasteArea(
    parseTsv(text),
    host.bounds(),
    cells.offset.value,
    host.rowCount(),
    cells.colCount.value
  )
  const { first, last } = area
  const edits: DataGridEdit[] = []
  let skipped = 0
  for (let r = first.row; r <= last.row; r++)
    for (let c = first.col; c <= last.col; c++) {
      const column = cells.columnAt(c)
      const value = area.valueAt(r, c)
      if (!column || value === undefined) continue
      const result = parseCell(column, value, host.labels())
      if (cells.editable(column) && result.valid)
        edits.push({ index: r, column, value: result.value })
      else skipped++
    }
  return { first, last, edits, skipped, empty: last.row < first.row || last.col < first.col }
}

export function useDataGridClipboard(
  cells: UseDataGridCellsReturn,
  host: DataGridClipboardHost
): UseDataGridClipboardReturn {
  const announcement = ref<string>('')
  let copyPending = false
  const announce = (text: string): void => {
    announcement.value = ''
    void nextTick(() => (announcement.value = text))
  }
  const rangeText = (): string => toTsv(rangeLines(cells, host))

  const onCopy = (event: ClipboardEvent): void => {
    if (host.editing() || !event.clipboardData) return
    copyPending = false
    const text = rangeText()
    event.clipboardData.setData('text/plain', text)
    event.preventDefault()
    host.copied(event, text)
  }

  const onPaste = (event: ClipboardEvent): void => {
    const text = event.clipboardData?.getData('text/plain') ?? ''
    if (host.editing() || !text || host.bounds().bottom < 0) return
    event.preventDefault()
    if (host.locked()) return announce(host.t('dataGrid.pasteReadonly'))
    const { first, last, edits, skipped, empty } = pasteEdits(cells, host, text)
    if (empty) return
    host.apply(event, edits)
    host.place(first, last)
    host.focusActive()
    const count = edits.length
    announce(
      skipped
        ? host.t('dataGrid.pastedSkipped', { count, skipped })
        : host.t('dataGrid.pasted', { count })
    )
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

  onScopeDispose(() => {
    copyPending = false
  })

  return { announcement: readonly(announcement), copyRange, onCopy, onPaste }
}
