import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

import { useMediaQuery } from '../../../../composables/use-media-query'

export interface MockupFrameTiming {
  forward: number
  back: number
}

export interface UseMockupFramesOptions {
  active: MaybeRefOrGetter<boolean>
  hovered: MaybeRefOrGetter<boolean | undefined>
  stepOnTouch?: boolean
  onAdvance?: () => void
  beforeStep?: () => void
}

export interface UseMockupFramesReturn<T> {
  frame: ComputedRef<T>
  step: Readonly<Ref<number>>
  goingBack: Readonly<Ref<boolean>>
}

export function useMockupFrames<T extends MockupFrameTiming>(
  frames: readonly T[],
  { active, hovered, stepOnTouch = false, onAdvance, beforeStep }: UseMockupFramesOptions
): UseMockupFramesReturn<T> {
  const canHover = useMediaQuery('(hover: hover)', true)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  const last = frames.length - 1

  const wanted = () => toValue(active) && (toValue(hovered) || !canHover.value)
  const instant = () => reduced.value || (!stepOnTouch && !canHover.value)

  const step = ref(0)
  const goingBack = ref(false)
  const frame = computed(() => frames[step.value])

  let timer: ReturnType<typeof globalThis.setTimeout> | null = null

  const halt = () => {
    if (timer) globalThis.clearTimeout(timer)
    timer = null
  }

  const advance = () => {
    halt()
    onAdvance?.()
    const target = wanted() ? last : 0
    if (step.value === target) return
    if (instant()) {
      step.value = target
      return
    }
    beforeStep?.()
    const forward = target > step.value
    goingBack.value = !forward
    const next = step.value + (forward ? 1 : -1)
    const delay = forward ? frames[next].forward : frames[step.value].back
    timer = globalThis.setTimeout(() => {
      step.value = next
      advance()
    }, delay)
  }

  watch(wanted, advance, { immediate: true })

  onScopeDispose(halt)

  return { frame, step: readonly(step), goingBack: readonly(goingBack) }
}
