import { onScopeDispose, ref, watch } from 'vue'

/** @typedef {'starting' | 'ending' | 'idle' | undefined} TransitionStatus */

/**
 * Mirrors Base UI useTransitionStatus — drives data-starting-style / data-ending-style.
 * @see https://github.com/mui/base-ui/blob/d81ec002/packages/react/src/utils/useTransitionStatus.ts
 * @param {import('vue').MaybeRefOrGetter<boolean>} open
 * @param {boolean} [enableIdleState]
 */
export function useTransitionStatus(open, enableIdleState = false) {
  const mounted = ref(false)
  const transitionStatus = ref(/** @type {TransitionStatus} */ (undefined))

  let clearStartingFrame = 0
  let idleFrame = 0

  const readOpen = () => (typeof open === 'function' ? open() : open)

  watch(
    () => readOpen(),
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

  watch(() => readOpen(), scheduleClearStarting, { flush: 'post' })

  watch(transitionStatus, (status) => {
    if (status === 'starting') {
      scheduleClearStarting()
    }
  })

  watch(
    () => [readOpen(), transitionStatus.value, mounted.value],
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

  const setMounted = (value) => {
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
    mounted,
    setMounted,
    transitionStatus
  }
}
