import { type MaybeRefOrGetter, onScopeDispose, toValue, watch } from 'vue'

import { releaseRowTabOrder, syncRowTabOrder } from '../lib/row-tab-order'

export interface DataTableRowTabOrderHost {
  active: MaybeRefOrGetter<boolean>
  rows: MaybeRefOrGetter<unknown[]>
  tabStop: MaybeRefOrGetter<string | undefined>
  root: () => HTMLElement | null
}

export function useDataTableRowTabOrder(host: DataTableRowTabOrderHost): void {
  let within = false
  let frame = 0
  let observer: globalThis.MutationObserver | null = null
  const sync = (): void => {
    if (!within) return
    if (toValue(host.active)) syncRowTabOrder(host.root(), toValue(host.tabStop))
    else releaseRowTabOrder(host.root())
  }
  const schedule = (): void => {
    if (frame || typeof globalThis.requestAnimationFrame !== 'function') return
    frame = globalThis.requestAnimationFrame(() => {
      frame = 0
      sync()
    })
  }
  const onFocusin = (): void => {
    if (within) return
    within = true
    sync()
    const root = host.root()
    if (!root || typeof globalThis.MutationObserver !== 'function') return
    observer = new globalThis.MutationObserver(schedule)
    observer.observe(root, { childList: true, subtree: true })
  }
  const onFocusout = (event: globalThis.FocusEvent): void => {
    const next = event.relatedTarget as globalThis.Node | null
    if (next && host.root()?.contains(next)) return
    within = false
    observer?.disconnect()
    observer = null
  }
  watch(
    () => host.root(),
    (root, previous) => {
      previous?.removeEventListener('focusin', onFocusin)
      previous?.removeEventListener('focusout', onFocusout)
      root?.addEventListener('focusin', onFocusin)
      root?.addEventListener('focusout', onFocusout)
    },
    { immediate: true, flush: 'post' }
  )
  watch([() => toValue(host.tabStop), () => toValue(host.rows), () => toValue(host.active)], sync, {
    flush: 'post'
  })
  onScopeDispose(() => {
    globalThis.cancelAnimationFrame?.(frame)
    observer?.disconnect()
    const root = host.root()
    root?.removeEventListener('focusin', onFocusin)
    root?.removeEventListener('focusout', onFocusout)
  })
}
