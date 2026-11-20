import {
  type MaybeRefOrGetter,
  nextTick,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

import type { DrawerMotionState } from '../presets/transitions'

export type { DrawerMotionState }

export interface UseDrawerMotionStateReturn {
  motionState: Readonly<Ref<DrawerMotionState>>
}

export function useDrawerMotionState(
  isOpen: MaybeRefOrGetter<boolean>
): UseDrawerMotionStateReturn {
  const motionState = ref<DrawerMotionState>('closed')
  const frames = new Set<number>()
  let disposed = false

  const requestFrame = (callback: () => void) => {
    if (disposed) return
    const id = globalThis.requestAnimationFrame(() => {
      frames.delete(id)
      if (disposed) return
      callback()
    })
    frames.add(id)
  }

  const paintOpen = async () => {
    motionState.value = 'closed'
    await nextTick()

    requestFrame(() => {
      requestFrame(() => {
        if (toValue(isOpen)) {
          motionState.value = 'open'
        }
      })
    })
  }

  const paintClose = async () => {
    await nextTick()

    requestFrame(() => {
      if (!toValue(isOpen)) {
        motionState.value = 'closed'
      }
    })
  }

  watch(
    () => toValue(isOpen),
    (open) => {
      if (!open) {
        void paintClose()
        return
      }

      void paintOpen()
    },
    { flush: 'sync' }
  )

  onMounted(() => {
    if (toValue(isOpen)) {
      void paintOpen()
    }
  })

  onScopeDispose(() => {
    disposed = true
    for (const id of frames) globalThis.cancelAnimationFrame(id)
    frames.clear()
  })

  return { motionState: readonly(motionState) }
}
