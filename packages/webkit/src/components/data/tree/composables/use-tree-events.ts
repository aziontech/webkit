import { eventDirection, logicalArrowKey } from '../../../../composables/use-direction'
import {
  cellsOf,
  clickedRowId,
  keepsTextSelection,
  rowElement,
  rowOf,
  treeitemOf
} from '../lib/tree-dom'
import { isTypeaheadKey, typeaheadMatch } from '../lib/tree-rows'
import type { TreeItem } from '../tree.vue'
import type { UseTreeNavigationReturn } from './use-tree-navigation'
import type { UseTreeSelectionReturn } from './use-tree-selection'

export interface TreeEventActions {
  navigation: UseTreeNavigationReturn<TreeItem>
  selection: UseTreeSelectionReturn
  tree: () => HTMLElement | null
  grid: () => boolean
  multiple: () => boolean
  selectable: () => boolean
  editable: () => boolean
  isExpanded: (id: string) => boolean
  setExpanded: (id: string, open: boolean) => void
  focusItem: (id: string) => void
  withRow: (id: string, run: (row: HTMLElement) => void) => void
  activate: (event: MouseEvent | KeyboardEvent, id: string) => void
  startRename: (id: string) => void
  doubleClick: (event: MouseEvent, item: TreeItem) => void
}

export interface UseTreeEventsReturn {
  onKeydown: (event: KeyboardEvent) => void
  onFocusin: (event: FocusEvent) => void
  onClick: (event: MouseEvent) => void
  onMousedown: (event: MouseEvent) => void
  onDblclick: (event: MouseEvent) => void
}

type Handled = boolean

const ROW_STEP: Partial<Record<string, 1 | -1>> = { ArrowDown: 1, ArrowUp: -1 }

function moveCellRow(a: TreeEventActions, id: string, offset: 1 | -1, at: number): void {
  const next = a.navigation.sibling(id, offset)
  if (!next) return
  a.withRow(next, (nextRow) => {
    const target = cellsOf(nextRow)
    if (target.length === 0) return
    a.navigation.setFocused(next)
    target[Math.min(at, target.length - 1)]?.focus()
  })
}

function cellStep(
  a: TreeEventActions,
  event: KeyboardEvent,
  cells: HTMLElement[],
  at: number,
  id: string
): Handled {
  const key = logicalArrowKey(event.key, eventDirection(event))
  const step = ROW_STEP[key]
  if (step) moveCellRow(a, id, step, at)
  else if (key === 'ArrowRight') cells[at + 1]?.focus()
  else if (key === 'ArrowLeft' && at > 0) cells[at - 1]?.focus()
  else if (key === 'ArrowLeft' || key === 'Escape') a.focusItem(id)
  else if (key === 'Enter' && at === 0) a.activate(event, id)
  else return false
  return true
}

function cellKey(a: TreeEventActions, event: KeyboardEvent, row: HTMLElement, id: string): Handled {
  const cells = cellsOf(row)
  const at = cells.findIndex((cell) => cell === event.target || cell.contains(event.target as Node))
  return at !== -1 && cellStep(a, event, cells, at, id)
}

function sideKey(a: TreeEventActions, key: string, id: string): Handled {
  const parent = a.navigation.isParent(id)
  if (key === 'ArrowRight') {
    if (parent && !a.isExpanded(id)) a.setExpanded(id, true)
    else if (a.grid()) cellsOf(rowElement(a.tree(), id))[0]?.focus()
    else if (parent) a.focusItem(a.navigation.firstChildOf(id))
  } else if (key === 'ArrowLeft') {
    if (parent && a.isExpanded(id)) a.setExpanded(id, false)
    else a.focusItem(a.navigation.parentOf(id))
  } else return false
  return true
}

function moveKey(a: TreeEventActions, key: string, id: string, extend: boolean): Handled {
  const { navigation } = a
  if (key === 'ArrowDown' || key === 'ArrowUp') {
    const next = navigation.sibling(id, key === 'ArrowDown' ? 1 : -1)
    a.focusItem(next)
    if (extend && next) a.selection.extend(next)
  } else if (key === 'Home') a.focusItem(navigation.first())
  else if (key === 'End') a.focusItem(navigation.last())
  else return sideKey(a, key, id)
  return true
}

function commandKey(a: TreeEventActions, event: KeyboardEvent, key: string, id: string): Handled {
  if (key === 'F2') {
    if (!a.editable()) return false
    a.startRename(id)
  } else if (key === ' ' && a.multiple()) {
    if (a.selection.isEnabled(id)) a.selection.toggleSelected(id)
  } else if (key === ' ' || key === 'Enter') a.activate(event, id)
  else return false
  return true
}

export function useTreeEvents(actions: TreeEventActions): UseTreeEventsReturn {
  let typed = ''
  let typedAt = 0

  const typeahead = (event: KeyboardEvent, fromId: string): Handled => {
    if (!isTypeaheadKey(event)) return false
    typed = event.timeStamp - typedAt > 500 ? event.key : `${typed}${event.key}`
    typedAt = event.timeStamp
    const labelOf = (id: string) => actions.navigation.entry(id)?.item.label ?? ''
    const match = typeaheadMatch(actions.navigation.visible.value, fromId, typed, labelOf)
    if (match) actions.focusItem(match)
    return Boolean(match)
  }

  const itemKey = (event: KeyboardEvent, id: string): Handled => {
    const multiple = actions.multiple()
    if (multiple && (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'a') {
      actions.selection.selectAll()
      return true
    }
    const key = logicalArrowKey(event.key, eventDirection(event))
    return (
      moveKey(actions, key, id, multiple && event.shiftKey) ||
      commandKey(actions, event, key, id) ||
      typeahead(event, id)
    )
  }

  const gridKey = (event: KeyboardEvent): Handled => {
    const row = rowOf(event.target)
    const id = row?.dataset['itemId'] ?? ''
    if (!row || !id) return false
    return cellKey(actions, event, row, id)
  }

  const onKeydown = (event: KeyboardEvent): void => {
    const id = treeitemOf(event.target)
    const handled = id ? itemKey(event, id) : actions.grid() && gridKey(event)
    if (handled) event.preventDefault()
  }

  return {
    onKeydown,
    onFocusin: (event) => {
      const id =
        treeitemOf(event.target) ||
        (actions.grid() ? (rowOf(event.target)?.dataset['itemId'] ?? '') : '')
      if (id) actions.navigation.setFocused(id)
    },
    onClick: (event) => {
      const id = clickedRowId(event.target)
      if (!id) return
      actions.focusItem(id)
      actions.activate(event, id)
      const entry = actions.navigation.entry(id)
      if (actions.selectable() || !entry || entry.item.disabled) return
      if (actions.navigation.isParent(id)) actions.setExpanded(id, !actions.isExpanded(id))
    },
    onMousedown: (event) => {
      if (!keepsTextSelection(event)) event.preventDefault()
    },
    onDblclick: (event) => {
      const entry = actions.navigation.entry(clickedRowId(event.target))
      if (entry && !entry.item.disabled) actions.doubleClick(event, entry.item)
    }
  }
}
