import { type MaybeRefOrGetter, onScopeDispose, readonly, type Ref, ref, toValue, watch } from 'vue'

export type TransitionPhase = 'starting' | 'ending' | 'idle' | undefined

export interface UseTransitionStatusReturn {
  mounted: Readonly<Ref<boolean>>
  setMounted: (value: boolean) => void
  transitionStatus: Readonly<Ref<TransitionPhase>>
}

function watchIdleState(
  readOpen: () => boolean,
  mounted: Ref<boolean>,
  transitionStatus: Ref<TransitionPhase>
) {
  let idleFrame = 0

  watch(
    (): [boolean, TransitionPhase, boolean] => [readOpen(), transitionStatus.value, mounted.value],
    ([isOpen, status, isMounted]) => {
      if (!isOpen || !isMounted || status === 'idle') return
      if (status !== 'starting') transitionStatus.value = 'starting'
      globalThis.cancelAnimationFrame(idleFrame)
      idleFrame = globalThis.requestAnimationFrame(() => {
        if (readOpen()) transitionStatus.value = 'idle'
      })
    },
    { flush: 'post' }
  )

  onScopeDispose(() => globalThis.cancelAnimationFrame(idleFrame))
}

export function useTransitionStatus(
  open: MaybeRefOrGetter<boolean>,
  enableIdleState = false
): UseTransitionStatusReturn {
  const mounted = ref(false)
  const transitionStatus = ref<TransitionPhase>(undefined)
  let clearStartingFrame = 0
  const readOpen = (): boolean => toValue(open)

  watch(
    readOpen,
    (isOpen) => {
      if (isOpen && !mounted.value) {
        mounted.value = true
        transitionStatus.value = 'starting'
        return
      }
      if (isOpen && mounted.value && transitionStatus.value === 'ending') {
        transitionStatus.value = 'starting'
        return
      }
      if (!isOpen && mounted.value && transitionStatus.value !== 'ending')
        transitionStatus.value = 'ending'
      if (!isOpen && !mounted.value && transitionStatus.value === 'ending')
        transitionStatus.value = undefined
    },
    { flush: 'sync', immediate: true }
  )

  const scheduleClearStarting = () => {
    if (!readOpen() || enableIdleState) return
    globalThis.cancelAnimationFrame(clearStartingFrame)
    clearStartingFrame = globalThis.requestAnimationFrame(() => {
      if (readOpen()) transitionStatus.value = undefined
    })
  }

  watch(readOpen, scheduleClearStarting, { flush: 'post' })
  watch(transitionStatus, (status) => {
    if (status === 'starting') scheduleClearStarting()
  })
  if (enableIdleState) watchIdleState(readOpen, mounted, transitionStatus)

  const setMounted = (value: boolean) => {
    mounted.value = value
    if (!value) transitionStatus.value = undefined
  }

  onScopeDispose(() => globalThis.cancelAnimationFrame(clearStartingFrame))

  return {
    mounted: readonly(mounted) as Readonly<Ref<boolean>>,
    setMounted,
    transitionStatus: readonly(transitionStatus) as Readonly<Ref<TransitionPhase>>
  }
}
