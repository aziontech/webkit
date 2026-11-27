import { onScopeDispose, type Ref } from 'vue'

import { useElementListener } from '../../../../composables/use-element-listener'
import { pickAnchor, reducedMotion } from '../lib/conversation-dom'

type ElementRef = Readonly<Ref<HTMLElement | null>>

export interface UseConversationPinReturn {
  scrollToBottom: (smooth?: boolean) => void
  findAnchor: () => void
  holdAnchor: () => void
}

export function useConversationPin(
  viewportEl: ElementRef,
  contentEl: ElementRef,
  olderEl: ElementRef,
  pinned: Ref<boolean>
): UseConversationPinReturn {
  let intent = false
  let intentTimer: ReturnType<typeof setTimeout> | undefined
  let smoothing = false
  let smoothTimer: ReturnType<typeof setTimeout> | undefined
  let anchor: Element | null = null
  let anchorTop = 0

  function scrollToBottom(smooth = false): void {
    const el = viewportEl.value
    if (!el) return
    pinned.value = true
    const animate = smooth && !reducedMotion()
    smoothing = animate
    if (smoothTimer) clearTimeout(smoothTimer)
    if (animate) smoothTimer = setTimeout(() => (smoothing = false), 1000)
    el.scrollTo({ top: el.scrollHeight, behavior: animate ? 'smooth' : 'auto' })
  }
  function markIntent(): void {
    intent = true
    smoothing = false
    if (intentTimer) clearTimeout(intentTimer)
    intentTimer = setTimeout(() => (intent = false), 400)
  }
  function findAnchor(): void {
    const found = pickAnchor(viewportEl.value, contentEl.value, olderEl.value)
    anchor = found ? found[0] : null
    if (found) anchorTop = found[1]
  }
  function holdAnchor(): void {
    const el = viewportEl.value
    if (el && anchor?.isConnected) {
      const delta = anchor.getBoundingClientRect().top - el.getBoundingClientRect().top - anchorTop
      if (Math.abs(delta) >= 1) el.scrollTop += delta
    }
    findAnchor()
  }
  function onScroll(): void {
    const el = viewportEl.value
    const atEnd = !el || el.scrollHeight - el.scrollTop - el.clientHeight <= 32
    if (intent || atEnd) pinned.value = atEnd
    else if (pinned.value && !smoothing) scrollToBottom()
    findAnchor()
  }
  useElementListener(viewportEl, 'keydown', markIntent)
  useElementListener(viewportEl, 'pointerdown', markIntent)
  useElementListener(viewportEl, 'wheel', markIntent, { passive: true })
  useElementListener(viewportEl, 'touchmove', markIntent, { passive: true })
  useElementListener(viewportEl, 'scroll', onScroll, { passive: true })
  onScopeDispose(() => {
    clearTimeout(intentTimer)
    clearTimeout(smoothTimer)
  })
  return { scrollToBottom, findAnchor, holdAnchor }
}
