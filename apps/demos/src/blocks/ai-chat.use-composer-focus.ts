import { type MaybeRefOrGetter, nextTick, onMounted, type Ref, toValue, watch } from 'vue'

export interface UseComposerFocusTarget {
  focus: () => void
  $el?: unknown
}

export interface UseComposerFocusReturn {
  /** Focuses the composer again once the welcome page gives way to the thread. */
  refocusAfterWelcome: (typed: boolean) => void
}

export function useComposerFocus(
  composerEl: Ref<UseComposerFocusTarget | null>,
  loading: MaybeRefOrGetter<boolean>,
  welcome: MaybeRefOrGetter<boolean>
): UseComposerFocusReturn {
  let refocus = false

  onMounted(() => nextTick(() => composerEl.value?.focus()))

  watch(
    () => toValue(loading),
    (now, before) => {
      if (!before || now) return
      const active = globalThis.document?.activeElement
      const idle = !active || active === globalThis.document.body || !active.isConnected
      const box = composerEl.value?.$el as globalThis.Element | undefined
      if (idle || (box && box.contains(active))) composerEl.value?.focus()
    }
  )

  watch(
    () => toValue(welcome),
    (now) => {
      if (now || !refocus) return
      refocus = false
      void nextTick(() => composerEl.value?.focus())
    }
  )

  return {
    refocusAfterWelcome: (typed) => {
      refocus = typed
    }
  }
}
