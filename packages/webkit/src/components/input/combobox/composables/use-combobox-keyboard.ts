import { nextTick, type Ref } from 'vue'

import { type ComboboxRow, nextEnabled } from '../lib/combobox-rows'
import type { UseComboboxCommitReturn } from './use-combobox-commit'

export interface UseComboboxKeyboardReturn {
  onKeydown: (event: KeyboardEvent) => void
}

export function useComboboxKeyboard(
  rows: Ref<ComboboxRow[]>,
  active: Ref<number>,
  open: Ref<boolean>,
  expanded: Ref<boolean>,
  typing: Ref<boolean>,
  setOpen: (next: boolean) => void,
  scroll: () => void,
  commit: UseComboboxCommitReturn,
  edited: () => boolean
): UseComboboxKeyboardReturn {
  const moveTo = (start: number, step: 1 | -1) => {
    const index = nextEnabled(rows.value, start, step)
    if (index < 0) return
    active.value = index
    scroll()
  }
  const edge = (step: 1 | -1) => (step > 0 ? 0 : rows.value.length - 1)
  const activeRow = () =>
    active.value >= 0 && expanded.value ? rows.value[active.value] : undefined

  const onArrow = (event: KeyboardEvent, step: 1 | -1) => {
    event.preventDefault()
    if (event.altKey) setOpen(step > 0)
    else if (open.value) moveTo(active.value < 0 ? edge(step) : active.value + step, step)
    else {
      setOpen(true)
      nextTick(() => moveTo(edge(step), step))
    }
  }

  const commitActive = (event: KeyboardEvent) => {
    const row = activeRow()
    if (row) commit.commitRow(event, row)
    else commit.commitText(event)
    setOpen(false)
  }

  const onEnter = (event: KeyboardEvent) => {
    if (!activeRow() && !typing.value) return
    event.preventDefault()
    commitActive(event)
  }

  const onEscape = (event: KeyboardEvent) => {
    if (!expanded.value && !edited()) return
    event.preventDefault()
    event.stopPropagation()
    if (expanded.value) setOpen(false)
    else commit.restore()
  }

  const onKeydown = (event: KeyboardEvent) => {
    const key = event.key
    const step = key === 'ArrowDown' || key === 'Home' ? 1 : -1
    if (key === 'ArrowDown' || key === 'ArrowUp') onArrow(event, step)
    else if ((key === 'Home' || key === 'End') && expanded.value && active.value >= 0) {
      event.preventDefault()
      moveTo(edge(step), step)
    } else if (key === 'Enter') onEnter(event)
    else if (key === 'Escape') onEscape(event)
    else if (key === 'Tab') commitActive(event)
  }

  return { onKeydown }
}
