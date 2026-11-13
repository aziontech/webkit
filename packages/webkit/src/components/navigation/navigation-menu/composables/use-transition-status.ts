import { type MaybeRefOrGetter, onScopeDispose, readonly, type Ref, ref, toValue, watch } from 'vue'

export type TransitionStatus = 'starting' | 'ending' | 'idle' | undefined

export interface UseTransitionStatusReturn {
  mounted: Readonly<Ref<boolean>>
  setMounted: (value: boolean) => void
  transitionStatus: Readonly<Ref<TransitionStatus>>
}

export function useTransitionStatus(
  open: MaybeRefOrGetter<boolean>,
  enableIdleState = false
): UseTransitionStatusReturn {
  const mounted = ref(false)
  const transitionStatus = ref<TransitionStatus>(undefined)

  let clearStartingFrame = 0
  let idleFrame = 0

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

      if (!isOpen && mounted.value && transitionStatus.value !== 'ending') {
        transitionStatus.value = 'ending'
      }

      if (!isOpen && !mounted.value && transitionStatus.value === 'ending') {
        transitionStatus.value = undefined
      }
    },
    { flush: 'sync', immediate: true }
  )

  const scheduleClearStarting = () => {
    if (!readOpen() || enableIdleState) {
      return
    }

    globalThis.cancelAnimationFrame(clearStartingFrame)
    clearStartingFrame = globalThis.requestAnimationFrame(() => {
      if (readOpen()) {
        transitionStatus.value = undefined
      }
    })
  }

  watch(readOpen, scheduleClearStarting, { flush: 'post' })

  watch(transitionStatus, (status) => {
    if (status === 'starting') {
      scheduleClearStarting()
    }
  })

  watch(
    (): [boolean, TransitionStatus, boolean] => [readOpen(), transitionStatus.value, mounted.value],
    ([isOpen, status, isMounted]) => {
      if (!isOpen || !enableIdleState || !isMounted || status === 'idle') {
        return
      }

      if (status !== 'starting') {
        transitionStatus.value = 'starting'
      }

      globalThis.cancelAnimationFrame(idleFrame)
      idleFrame = globalThis.requestAnimationFrame(() => {
        if (readOpen()) {
          transitionStatus.value = 'idle'
        }
      })
    },
    { flush: 'post' }
  )

  const setMounted = (value: boolean) => {
    mounted.value = value

    if (!value) {
      transitionStatus.value = undefined
    }
  }

  onScopeDispose(() => {
    globalThis.cancelAnimationFrame(clearStartingFrame)
    globalThis.cancelAnimationFrame(idleFrame)
  })

  return {
    mounted: readonly(mounted) as Readonly<Ref<boolean>>,
    setMounted,
    transitionStatus: readonly(transitionStatus) as Readonly<Ref<TransitionStatus>>
  }
}
