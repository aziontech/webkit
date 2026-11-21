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
    marquee = globalThis.setInterval(tick, PROGRESS_TICK_MS)
  }

  function tick(): void {
    elapsed.value += PROGRESS_TICK_MS
    if (elapsed.value < toValue(options.interval)) return
    elapsed.value = 0
    options.onAdvance()
  }

  function restartProgress(): void {
    elapsed.value = 0
  }

  function togglePause(): void {
    paused.value = !paused.value
  }

  function enterPointer(): void {
    pointerInside.value = true
  }

  function leavePointer(): void {
    pointerInside.value = false
  }

  function enterFocus(event: globalThis.FocusEvent): void {
    const target = event.target as globalThis.Element
    focusInside.value = target.matches(':focus-visible')
  }

  function leaveFocus(): void {
    focusInside.value = false
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
    restartProgress,
    togglePause,
    enterPointer,
    leavePointer,
    enterFocus,
    leaveFocus
  }
}
