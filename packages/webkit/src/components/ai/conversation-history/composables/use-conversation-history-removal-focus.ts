import { type MaybeRefOrGetter, onScopeDispose, type Ref, toValue, watch } from 'vue'

export interface UseConversationHistoryRemovalFocusReturn {
  track: (event: Event, id: string) => void
}

const ROW = '[data-slot="conversation-history-item"]'

export function useConversationHistoryRemovalFocus(
  container: Ref<HTMLElement | null>,
  ids: MaybeRefOrGetter<readonly string[]>
): UseConversationHistoryRemovalFocusReturn {
  let pending: { id: string; index: number } | null = null
  let frame = 0
  let deadline = 0

  const rows = (): HTMLElement[] =>
    container.value ? Array.from(container.value.querySelectorAll<HTMLElement>(ROW)) : []

  const track = (event: Event, id: string) => {
    const target = event.target instanceof Element ? event.target : null
    const row = target?.closest('li')?.querySelector<HTMLElement>(ROW) ?? null
    pending = { id, index: row ? rows().indexOf(row) : -1 }
  }

  const refocus = () => {
    frame = 0
    if (!pending || !container.value) return
    const active = document.activeElement
    const lost = !active || active === document.body || !active.isConnected
    if (!lost) {
      if (performance.now() < deadline) frame = requestAnimationFrame(refocus)
      else pending = null
      return
    }
    const { index } = pending
    pending = null
    const list = rows()
    const next = list[Math.min(Math.max(index, 0), list.length - 1)] ?? container.value
    next.focus()
  }

  watch(
    () => [...toValue(ids)],
    (next) => {
      if (!pending) return
      if (next.includes(pending.id)) {
        pending = null
        return
      }
      cancelAnimationFrame(frame)
      deadline = performance.now() + 1000
      frame = requestAnimationFrame(refocus)
    },
    { flush: 'post' }
  )

  onScopeDispose(() => cancelAnimationFrame(frame))

  return { track }
}
