import { nextTick, onScopeDispose, readonly, type Ref, ref } from 'vue'

export interface UseAnimatedHeightReturn {
  regionEl: Ref<HTMLElement | null>
  height: Readonly<Ref<string>>
  animateHeight: (mutate: () => void) => Promise<void>
}

const RELEASE_FALLBACK_MS = 600

const prefersReducedMotion = (): boolean =>
  typeof globalThis.matchMedia === 'function' &&
  globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches

export function useAnimatedHeight(): UseAnimatedHeightReturn {
  const regionEl = ref<HTMLElement | null>(null)
  const height = ref<string>('')
  let release: (() => void) | null = null
  let frame = 0

  const animateHeight = async (mutate: () => void): Promise<void> => {
    const node = regionEl.value
    if (!node || prefersReducedMotion()) {
      mutate()
      return
    }
    release?.()
    const from = node.offsetHeight
    mutate()
    await nextTick()
    const to = node.offsetHeight
    if (to === from) return
    height.value = `${from}px`

    const onEnd = (event: TransitionEvent): void => {
      if (event.propertyName === 'height' && event.target === node) finish()
    }
    const timer = globalThis.setTimeout(() => finish(), RELEASE_FALLBACK_MS)
    const finish = (): void => {
      node.removeEventListener('transitionend', onEnd)
      globalThis.clearTimeout(timer)
      globalThis.cancelAnimationFrame(frame)
      height.value = ''
      release = null
    }
    node.addEventListener('transitionend', onEnd)
    release = finish
    frame = globalThis.requestAnimationFrame(() => {
      frame = globalThis.requestAnimationFrame(() => {
        if (release === finish) height.value = `${to}px`
      })
    })
  }

  onScopeDispose(() => release?.())

  return { regionEl, height: readonly(height), animateHeight }
}
