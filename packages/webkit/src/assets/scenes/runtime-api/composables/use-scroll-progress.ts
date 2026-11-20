import {
  type MaybeRefOrGetter,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue
} from 'vue'

export interface UseScrollProgressReturn {
  /** Signed distance from the target's center to the viewport's, in viewport heights. */
  progress: Readonly<Ref<number>>
}

export function useScrollProgress(
  target: MaybeRefOrGetter<globalThis.HTMLElement | null>
): UseScrollProgressReturn {
  const progress = ref(0)
  const OPTIONS: globalThis.AddEventListenerOptions = { capture: true, passive: true }
  let frame: number | null = null
  let listening = false

  const measure = () => {
    frame = null
    const element = toValue(target)
    if (!element) return
    const box = element.getBoundingClientRect()
    const viewport = globalThis.innerHeight || 1
    progress.value = (box.top + box.height / 2 - viewport / 2) / viewport
  }

  const onScroll = () => {
    if (frame === null) frame = globalThis.requestAnimationFrame(measure)
  }

  onMounted(() => {
    if (globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches) return
    globalThis.document.addEventListener('scroll', onScroll, OPTIONS)
    globalThis.addEventListener('resize', onScroll, { passive: true })
    listening = true
    measure()
  })

  onScopeDispose(() => {
    if (frame !== null) globalThis.cancelAnimationFrame(frame)
    frame = null
    if (!listening) return
    globalThis.document.removeEventListener('scroll', onScroll, OPTIONS)
    globalThis.removeEventListener('resize', onScroll)
    listening = false
  })

  return { progress: readonly(progress) }
}
