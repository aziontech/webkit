import { onMounted, onScopeDispose, readonly, type Ref, ref } from 'vue'

export interface UseCardHeightReturn {
  /** The measured height in pixels; 0 before the first measure. */
  height: Readonly<Ref<number>>
  /** The height is easing to a new value. */
  resizing: Readonly<Ref<boolean>>
  /** Ends the resize when the height transition ends. */
  onTransitionend: () => void
}

export function useCardHeight(contentEl: Ref<HTMLElement | null>): UseCardHeightReturn {
  const height = ref(0)
  const resizing = ref(false)
  let resizeObserver: ResizeObserver | null = null

  const onResize = ([entry]: ResizeObserverEntry[]) => {
    const next = Math.round(entry.contentRect.height)
    if (height.value && next !== height.value) resizing.value = true
    height.value = next
  }

  onMounted(() => {
    if (typeof ResizeObserver === 'undefined' || !contentEl.value) return
    resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(contentEl.value)
  })

  onScopeDispose(() => {
    resizeObserver?.disconnect()
  })

  const onTransitionend = () => {
    resizing.value = false
  }

  return { height: readonly(height), resizing: readonly(resizing), onTransitionend }
}
