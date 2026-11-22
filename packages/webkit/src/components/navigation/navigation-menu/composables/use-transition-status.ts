import { type MaybeRefOrGetter, onScopeDispose, readonly, type Ref, ref, toValue, watch } from 'vue'

export type TransitionPhase = 'starting' | 'ending' | 'idle' | undefined

export interface UseTransitionStatusReturn {
  mounted: Readonly<Ref<boolean>>
  setMounted: (value: boolean) => void
  transitionStatus: Readonly<Ref<TransitionPhase>>
}

function nextPhase(
  isOpen: boolean,
  isMounted: boolean,
  status: TransitionPhase
): { mount?: true; status: TransitionPhase } | null {
  if (isOpen && !isMounted) return { mount: true, status: 'starting' }
  if (isOpen && isMounted && status === 'ending') return { status: 'starting' }
  if (!isOpen && isMounted && status !== 'ending') return { status: 'ending' }
  if (!isOpen && !isMounted && status === 'ending') return { status: undefined }
  return null
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
      const next = nextPhase(isOpen, mounted.value, transitionStatus.value)
      if (!next) return
      if (next.mount) mounted.value = true
      transitionStatus.value = next.status
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
