import {
  type MaybeRefOrGetter,
  nextTick,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

export interface UseAnchoringOptions {
  isOpen: MaybeRefOrGetter<boolean>
  update: () => void
  onToggle: (open: boolean) => void
}

export interface UseAnchoringReturn {
  anchored: Readonly<Ref<boolean>>
}

export function useAnchoring({
  isOpen,
  update,
  onToggle
}: UseAnchoringOptions): UseAnchoringReturn {
  const anchored = ref(false)
  let frame = 0
  let disposed = false

  function cancelFrame(): void {
    if (frame) globalThis.cancelAnimationFrame?.(frame)
    frame = 0
  }

  function settle(): void {
    cancelFrame()
    frame =
      globalThis.requestAnimationFrame?.(() => {
        frame = 0
        if (!disposed && toValue(isOpen)) anchored.value = true
      }) ?? 0
  }

  async function onOpen(): Promise<void> {
    for (let pass = 0; pass < 2; pass++) {
      await nextTick()
      if (disposed) return
      update()
    }
    settle()
  }

  watch(
    () => toValue(isOpen),
    (open) => {
      if (!disposed) onToggle(open)
      if (open) void onOpen()
      else anchored.value = false
    },
    { immediate: true }
  )

  onScopeDispose(() => {
    disposed = true
    cancelFrame()
  })

  return { anchored: readonly(anchored) }
}
