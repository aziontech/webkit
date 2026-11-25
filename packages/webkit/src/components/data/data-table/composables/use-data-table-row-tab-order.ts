import { type MaybeRefOrGetter, onScopeDispose, toValue, watch } from 'vue'

import { releaseRowTabOrder, syncRowTabOrder } from '../lib/row-tab-order'

export interface DataTableRowTabOrderHost {
  active: MaybeRefOrGetter<boolean>
  rows: MaybeRefOrGetter<unknown[]>
  tabStop: MaybeRefOrGetter<string | undefined>
  root: () => HTMLElement | null
}

export function useDataTableRowTabOrder(host: DataTableRowTabOrderHost): void {
  const sync = (): void => {
    if (toValue(host.active)) syncRowTabOrder(host.root(), toValue(host.tabStop))
    else releaseRowTabOrder(host.root())
  }
  let frame = 0
  const schedule = (): void => {
    if (frame || typeof globalThis.requestAnimationFrame !== 'function') return
    frame = globalThis.requestAnimationFrame(() => {
      frame = 0
      sync()
    })
  }
  watch([() => toValue(host.tabStop), () => toValue(host.rows), () => toValue(host.active)], sync, {
    flush: 'post'
  })
  let observer: globalThis.MutationObserver | null = null
  watch(
    () => host.root(),
    (root) => {
      observer?.disconnect()
      observer = null
      if (!root || typeof globalThis.MutationObserver !== 'function') return
      observer = new globalThis.MutationObserver(schedule)
      observer.observe(root, { childList: true, subtree: true })
      sync()
    },
    { immediate: true, flush: 'post' }
  )
  onScopeDispose(() => {
    globalThis.cancelAnimationFrame?.(frame)
    observer?.disconnect()
  })
}
