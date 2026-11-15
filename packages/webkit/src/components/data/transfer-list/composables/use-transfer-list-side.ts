import { computed, nextTick, readonly, type Ref, ref, watch } from 'vue'

import type { TransferListContext, TransferListSide } from '../injection-key'

export interface UseTransferListSideReturn {
  activeIndex: Readonly<Ref<number>>
  tabindexFor: (index: number) => number
  onFocus: (index: number) => void
  onKeydown: (index: number, event: globalThis.KeyboardEvent) => void
}

export function useTransferListSide(
  side: TransferListSide,
  ctx: TransferListContext,
  list: Ref<HTMLElement | null>
): UseTransferListSideReturn {
  const activeIndex = ref<number>(0)
  const total = computed<number>(() => ctx.items(side).length)

  watch(total, (count) => {
    if (activeIndex.value > count - 1) activeIndex.value = Math.max(0, count - 1)
  })

  const focusOption = async (index: number): Promise<void> => {
    activeIndex.value = index
    await nextTick()
    list.value?.querySelectorAll<HTMLElement>('[role="option"]')[index]?.focus()
  }

  const tabindexFor = (index: number): number =>
    !ctx.disabled.value && index === activeIndex.value ? 0 : -1

  const onFocus = (index: number): void => {
    activeIndex.value = index
  }

  const onKeydown = (index: number, event: globalThis.KeyboardEvent): void => {
    const last = total.value - 1
    let next = -1
    if (event.key === 'ArrowDown') next = Math.min(last, index + 1)
    else if (event.key === 'ArrowUp') next = Math.max(0, index - 1)
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = last
    else if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault()
      ctx.toggleSelection(side, index)
      return
    } else return
    event.preventDefault()
    if (next < 0) return
    if (event.shiftKey && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      ctx.setSelected(side, index, true)
      ctx.setSelected(side, next, true)
    }
    void focusOption(next)
  }

  return { activeIndex: readonly(activeIndex), tabindexFor, onFocus, onKeydown }
}
