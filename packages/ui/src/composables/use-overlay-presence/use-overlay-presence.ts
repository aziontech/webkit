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
  const frames = new Set<number>()
  let exitTimer: ReturnType<typeof setTimeout> | undefined
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

  const afterFrames = (count: number, callback: () => void) => {
    requestFrame(count > 1 ? () => afterFrames(count - 1, callback) : callback)
  }

  const paint = async (open: boolean) => {
    if (open) motionState.value = 'closed'
    await nextTick()
    afterFrames(open ? (options.openFrames ?? 1) : 1, () => {
      if (toValue(isOpen) === open) motionState.value = open ? 'open' : 'closed'
    })
  }

  const clearExitTimer = () => {
    if (!exitTimer) return
    clearTimeout(exitTimer)
    exitTimer = undefined
  }

  watch(
    () => toValue(isOpen),
    (open) => {
      void paint(open)
      clearExitTimer()
      if (open) isPresent.value = true
      else if (isPresent.value) {
        exitTimer = setTimeout(() => {
          isPresent.value = false
          exitTimer = undefined
        }, options.exitMs)
      }
    },
    { flush: 'sync' }
  )

  onMounted(() => {
    if (toValue(isOpen)) void paint(true)
  })

  onScopeDispose(() => {
    disposed = true
    for (const id of frames) globalThis.cancelAnimationFrame(id)
    frames.clear()
    clearExitTimer()
  })

  return { isPresent: readonly(isPresent), motionState: readonly(motionState) }
}
