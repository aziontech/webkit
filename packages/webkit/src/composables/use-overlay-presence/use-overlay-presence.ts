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

import { createDelay, createFrameQueue } from './lib/frame-queue'

/** Painted state of an overlay, one frame behind `isOpen` so its enter transition runs. */
export type OverlayMotionState = 'open' | 'closed'

/** Options of `useOverlayPresence`. */
export interface UseOverlayPresenceOptions {
  /** How long the overlay stays mounted after it closes, in milliseconds. */
  exitMs: number
  /** Animation frames to wait before the open state is painted. */
  openFrames?: number
}

/** What `useOverlayPresence` returns. */
export interface UseOverlayPresenceReturn {
  /** Whether the overlay is mounted; stays true while the exit transition runs. */
  isPresent: Readonly<Ref<boolean>>
  /** The state the overlay paints, for `data-state`. */
  motionState: Readonly<Ref<OverlayMotionState>>
}

export function useOverlayPresence(
  isOpen: MaybeRefOrGetter<boolean>,
  options: UseOverlayPresenceOptions
): UseOverlayPresenceReturn {
  const motionState = ref<OverlayMotionState>('closed')
  const isPresent = ref(toValue(isOpen))
  const frames = createFrameQueue()
  const exitTimer = createDelay()

  const paintOpen = async () => {
    motionState.value = 'closed'
    await nextTick()

    frames.afterFrames(options.openFrames ?? 1, () => {
      if (toValue(isOpen)) {
        motionState.value = 'open'
      }
    })
  }

  const paintClose = async () => {
    await nextTick()

    frames.afterFrames(1, () => {
      if (!toValue(isOpen)) {
        motionState.value = 'closed'
      }
    })
  }

  const updatePresence = (open: boolean) => {
    exitTimer.clear()
    if (open) {
      isPresent.value = true
      return
    }
    if (!isPresent.value) return
    exitTimer.start(options.exitMs, () => {
      isPresent.value = false
    })
  }

  watch(
    () => toValue(isOpen),
    (open) => {
      void (open ? paintOpen() : paintClose())
      updatePresence(open)
    },
    { flush: 'sync' }
  )

  onMounted(() => {
    if (toValue(isOpen)) {
      void paintOpen()
    }
  })

  onScopeDispose(() => {
    frames.dispose()
    exitTimer.clear()
  })

  return { isPresent: readonly(isPresent), motionState: readonly(motionState) }
}
