import { type ComputedRef, type Ref, toValue } from 'vue'

import type { UseSelectSearchOptions } from '../use-select-search'
import { focusById, isPrintable } from './search'

export interface SearchKeyContext {
  open: Ref<boolean>
  query: Ref<string>
  searchId: string
  activeKey: ComputedRef<string | undefined>
  activeIndex: Readonly<Ref<number>>
  optionCount: () => number
  moveActive: (from: number, step: 1 | -1) => void
}

export interface SearchKeydowns {
  onTriggerKeydown: (event: KeyboardEvent) => void
  onContentKeydown: (event: KeyboardEvent) => void
  onSearchKeydown: (event: KeyboardEvent) => void
}

export function createSearchKeydowns(
  options: UseSelectSearchOptions,
  context: SearchKeyContext
): SearchKeydowns {
  const { open, query, searchId, activeKey, activeIndex, moveActive } = context

  const commit = () => {
    if (!activeKey.value || toValue(options.locked)) return
    options.onPick(activeKey.value)
    if (toValue(options.multiple)) return
    open.value = false
    if (options.onCommit) options.onCommit()
    else focusById(toValue(options.triggerId))
  }

  const close = () => {
    open.value = false
    focusById(toValue(options.triggerId))
  }

  const searchKeys: Record<string, () => void> = {
    ArrowDown: () => moveActive(activeIndex.value, 1),
    ArrowUp: () => moveActive(activeIndex.value, -1),
    Home: () => moveActive(-1, 1),
    End: () => moveActive(context.optionCount(), -1),
    Enter: commit,
    Escape: close
  }

  const onTriggerKeydown = (event: KeyboardEvent) => {
    if (!isPrintable(event) || toValue(options.locked)) return
    event.preventDefault()
    query.value = open.value ? query.value + event.key : event.key
    open.value = true
  }

  const onContentKeydown = (event: KeyboardEvent) => {
    if (event.target instanceof HTMLElement && event.target.id === searchId) return
    if (isPrintable(event)) focusById(searchId)
  }

  const onSearchKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Tab') return close()
    const handle = searchKeys[event.key]
    if (!handle) return
    event.preventDefault()
    event.stopPropagation()
    handle()
  }

  return { onTriggerKeydown, onContentKeydown, onSearchKeydown }
}
