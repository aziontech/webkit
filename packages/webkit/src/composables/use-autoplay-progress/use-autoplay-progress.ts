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
  target?: MaybeRefOrGetter<globalThis.Element | null | undefined>
}

export interface UseAutoplayProgressReturn {
  autoplayEnabled: ComputedRef<boolean>
  autoplayRunning: ComputedRef<boolean>
  playing: ComputedRef<boolean>
  paused: Readonly<Ref<boolean>>
  pauseLabel: ComputedRef<string>
  cycle: Readonly<Ref<number>>
  restartProgress: () => void
  togglePause: () => void
  enterPointer: () => void
  leavePointer: () => void
  enterFocus: (event: globalThis.FocusEvent) => void
  leaveFocus: () => void
}

const setTo =
  <T>(target: Ref<T>, value: T) =>
  (): void => {
    target.value = value
  }

export function useAutoplayProgress(
  options: UseAutoplayProgressOptions
): UseAutoplayProgressReturn {
  const reducedMotion = usePreferredReducedMotion()
  const { t } = useTranslate({ common: en.common })

  const paused = ref(false)
  const pointerInside = ref(false)
  const focusInside = ref(false)
  const visible = ref(true)
  const cycle = ref(0)
  let timer: ReturnType<typeof globalThis.setTimeout> | null = null
  let startedAt = 0
  let spent = 0

  let observer: globalThis.IntersectionObserver | undefined
  watch(
    () => toValue(options.target),
    (element) => {
      observer?.disconnect()
      if (!element) return
      observer = new globalThis.IntersectionObserver((entries) => {
        visible.value = entries[entries.length - 1]!.isIntersecting
      })
      observer.observe(element)
    },
    { immediate: true }
  )

  const autoplayEnabled = computed(
    () => toValue(options.enabled) && reducedMotion.value !== 'reduce'
  )

  const autoplayRunning = computed(
    () => autoplayEnabled.value && !paused.value && !pointerInside.value && !focusInside.value
  )

  const playing = computed(() => autoplayRunning.value && visible.value)

  const pauseLabel = computed(() =>
    paused.value ? t('common.resumeRotation') : t('common.pauseRotation')
  )

  function stop(): void {
    if (timer === null) return
    globalThis.clearTimeout(timer)
    timer = null
    spent += Date.now() - startedAt
  }

  function advance(): void {
    timer = null
    spent = 0
    cycle.value += 1
    options.onAdvance()
    if (playing.value) start()
  }

  function start(): void {
    if (timer !== null) return
    startedAt = Date.now()
    timer = globalThis.setTimeout(advance, Math.max(0, toValue(options.interval) - spent))
  }

  function restartProgress(): void {
    const running = timer !== null
    stop()
    spent = 0
    cycle.value += 1
    if (running) start()
  }

  function togglePause(): void {
    paused.value = !paused.value
  }

  function enterFocus(event: globalThis.FocusEvent): void {
    const target = event.target as globalThis.Element
    focusInside.value = target.matches(':focus-visible')
  }

  watch(playing, (on) => (on ? start() : stop()))

  onMounted(() => {
    if (playing.value) start()
  })

  onScopeDispose(() => {
    stop()
    observer?.disconnect()
  })

  return {
    autoplayEnabled,
    autoplayRunning,
    playing,
    paused: readonly(paused),
    pauseLabel,
    cycle: readonly(cycle),
    restartProgress,
    togglePause,
    enterPointer: setTo(pointerInside, true),
    leavePointer: setTo(pointerInside, false),
    enterFocus,
    leaveFocus: setTo(focusInside, false)
  }
}
