import { usePreferredReducedMotion } from '@vueuse/core'
import {
  computed,
  type ComputedRef,
  type MaybeRefOrGetter,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

import * as en from '../../locales/en'
import { useTranslate } from '../use-translate'

export interface UseAutoplayProgressOptions {
  enabled: MaybeRefOrGetter<boolean>
  interval: MaybeRefOrGetter<number>
  onAdvance: () => void
}

export interface UseAutoplayProgressReturn {
  autoplayEnabled: ComputedRef<boolean>
  autoplayRunning: ComputedRef<boolean>
  paused: Readonly<Ref<boolean>>
  pauseLabel: ComputedRef<string>
  progress: ComputedRef<number>
  restartProgress: () => void
  togglePause: () => void
  enterPointer: () => void
  leavePointer: () => void
  enterFocus: (event: globalThis.FocusEvent) => void
  leaveFocus: () => void
}

const PROGRESS_TICK_MS = 100

const setTo =
  <T>(target: Ref<T>, value: T) =>
  (): void => {
    target.value = value
  }

function tickEvery(
  elapsed: Ref<number>,
  options: UseAutoplayProgressOptions
): ReturnType<typeof globalThis.setInterval> {
  return globalThis.setInterval(() => {
    elapsed.value += PROGRESS_TICK_MS
    if (elapsed.value < toValue(options.interval)) return
    elapsed.value = 0
    options.onAdvance()
  }, PROGRESS_TICK_MS)
}

export function useAutoplayProgress(
  options: UseAutoplayProgressOptions
): UseAutoplayProgressReturn {
  const reducedMotion = usePreferredReducedMotion()
  const { t } = useTranslate({ common: en.common })

  const elapsed = ref(0)
  const paused = ref(false)
  const pointerInside = ref(false)
  const focusInside = ref(false)
  let marquee: ReturnType<typeof globalThis.setInterval> | null = null

  const autoplayEnabled = computed(
    () => toValue(options.enabled) && reducedMotion.value !== 'reduce'
  )

  const autoplayRunning = computed(
    () => autoplayEnabled.value && !paused.value && !pointerInside.value && !focusInside.value
  )

  const pauseLabel = computed(() =>
    paused.value ? t('common.resumeRotation') : t('common.pauseRotation')
  )

  const progress = computed(() =>
    Math.min(100, Math.max(0, (elapsed.value / toValue(options.interval)) * 100))
  )

  function stop(): void {
    if (marquee === null) return
    globalThis.clearInterval(marquee)
    marquee = null
  }

  function start(): void {
    stop()
    marquee = tickEvery(elapsed, options)
  }

  function togglePause(): void {
    paused.value = !paused.value
  }

  function enterFocus(event: globalThis.FocusEvent): void {
    const target = event.target as globalThis.Element
    focusInside.value = target.matches(':focus-visible')
  }

  watch(autoplayRunning, (running) => (running ? start() : stop()))

  onMounted(() => {
    if (autoplayRunning.value) start()
  })

  onScopeDispose(stop)

  return {
    autoplayEnabled,
    autoplayRunning,
    paused: readonly(paused),
    pauseLabel,
    progress,
    restartProgress: setTo(elapsed, 0),
    togglePause,
    enterPointer: setTo(pointerInside, true),
    leavePointer: setTo(pointerInside, false),
    enterFocus,
    leaveFocus: setTo(focusInside, false)
  }
}
