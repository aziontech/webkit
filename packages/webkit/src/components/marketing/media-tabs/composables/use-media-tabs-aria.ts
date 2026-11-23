import { type MaybeRefOrGetter, nextTick, type Ref, ref, toValue, useId } from 'vue'

import { eventDirection, logicalArrowKey } from '../../../../composables/use-direction'

export interface UseMediaTabsAriaOptions {
  tabbed: MaybeRefOrGetter<boolean>
  count: MaybeRefOrGetter<number>
  isActive: (index: number) => boolean
  select: (index: number) => void
}

export interface UseMediaTabsAriaReturn {
  listEl: Ref<HTMLUListElement | null>
  tabId: (index: number) => string
  panelId: (index: number) => string
  rowMediaId: (index: number) => string
  tabAttrs: (index: number) => Record<string, string | number>
  onTabKeydown: (event: KeyboardEvent, index: number) => Promise<void>
}

export function useMediaTabsAria(options: UseMediaTabsAriaOptions): UseMediaTabsAriaReturn {
  const baseId = useId()
  const listEl = ref<HTMLUListElement | null>(null)
  const tabId = (index: number): string => `${baseId}-tab-${index}`
  const panelId = (index: number): string => `${baseId}-panel-${index}`
  const rowMediaId = (index: number): string => `${baseId}-row-media-${index}`

  const tabAttrs = (index: number): Record<string, string | number> => {
    const active = options.isActive(index)
    if (!toValue(options.tabbed)) {
      return { 'aria-expanded': active ? 'true' : 'false', 'aria-controls': rowMediaId(index) }
    }
    return {
      role: 'tab',
      'aria-selected': active ? 'true' : 'false',
      'aria-controls': panelId(index),
      tabindex: active ? 0 : -1
    }
  }

  const onTabKeydown = async (event: KeyboardEvent, index: number): Promise<void> => {
    if (!toValue(options.tabbed)) return
    const count = toValue(options.count)
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowDown: index + 1,
      ArrowLeft: index - 1,
      ArrowUp: index - 1,
      Home: 0,
      End: count - 1
    }
    const target = moves[logicalArrowKey(event.key, eventDirection(event))]
    if (target === undefined) return
    event.preventDefault()
    const next = ((target % count) + count) % count
    options.select(next)
    await nextTick()
    listEl.value?.querySelectorAll<HTMLElement>('[role="tab"]')[next]?.focus()
  }

  return { listEl, tabId, panelId, rowMediaId, tabAttrs, onTabKeydown }
}
