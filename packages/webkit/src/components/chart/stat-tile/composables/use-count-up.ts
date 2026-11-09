import { curve, duration as durations } from '@aziontech/theme/animations'
import { usePreferredReducedMotion } from '@vueuse/core'
import { type MaybeRefOrGetter, onScopeDispose, readonly, type Ref, ref, toValue, watch } from 'vue'

export interface UseCountUpOptions {
  duration?: number
}

export interface UseCountUpReturn {
  display: Readonly<Ref<number | null>>
}

const parseMs = (value: string) => Number.parseFloat(value) || 0

const bezier = (definition: string) => {
  const [x1 = 0, y1 = 0, x2 = 1, y2 = 1] = (definition.match(/-?\d*\.?\d+/g) ?? []).map(Number)
  const sample = (a: number, b: number, t: number) =>
    3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3
  return (progress: number) => {
    let low = 0
    let high = 1
    let t = progress
    for (let step = 0; step < 20; step += 1) {
      const x = sample(x1, x2, t)
      if (Math.abs(x - progress) < 1e-4) break
      if (x < progress) low = t
      else high = t
      t = (low + high) / 2
    }
    return sample(y1, y2, t)
  }
}

const ease = bezier(curve['productive-entrance'])

export function useCountUp(
  target: MaybeRefOrGetter<number | null>,
  { duration = parseMs(durations['slow-01']) }: UseCountUpOptions = {}
): UseCountUpReturn {
  const reducedMotion = usePreferredReducedMotion()
  const display = ref<number | null>(null)
  let frame = 0

  const stop = () => {
    if (frame) globalThis.cancelAnimationFrame(frame)
    frame = 0
  }

  const run = (to: number, from: number) => {
    stop()
    if (reducedMotion.value === 'reduce' || duration <= 0 || from === to) {
      display.value = to
      return
    }
    const startedAt = globalThis.performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      display.value = from + (to - from) * ease(progress)
      if (progress < 1) frame = globalThis.requestAnimationFrame(tick)
      else {
        frame = 0
        display.value = to
      }
    }
    frame = globalThis.requestAnimationFrame(tick)
  }

  watch(
    () => toValue(target),
    (next) => {
      if (next === null || !Number.isFinite(next)) {
        stop()
        display.value = null
        return
      }
      run(next, display.value ?? 0)
    },
    { immediate: true }
  )

  onScopeDispose(stop)

  return { display: readonly(display) }
}
