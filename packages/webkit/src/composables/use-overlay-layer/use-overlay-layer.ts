import type { MaybeRefOrGetter, Ref } from 'vue'
import {
  computed,
  getCurrentScope,
  onScopeDispose,
  readonly,
  shallowReactive,
  toValue,
  watch
} from 'vue'

interface OverlayLayerEntry {
  id: symbol
  element: () => globalThis.HTMLElement | null | undefined
  transient: boolean
}

const stack = shallowReactive<OverlayLayerEntry[]>([])

export interface UseOverlayLayerOptions {
  /** The layer's floating element; a pointer-down inside it never counts as outside for a layer below. */
  element?: MaybeRefOrGetter<globalThis.HTMLElement | null | undefined>
  /** A layer that never takes focus (a tooltip, a combobox list): it handles Escape while on top but does not pause the focus trap of the layer below. */
  transient?: boolean
}

export interface UseOverlayLayerReturn {
  /** True while this overlay is open and no overlay opened after it is still open. Gate Escape on it. */
  isTop: Readonly<Ref<boolean>>
  /** Like isTop, ignoring transient layers above. Gate focus trapping and outside pointer-down on it. */
  isFocusTop: Readonly<Ref<boolean>>
  /** Whether the node sits inside the element of a layer opened after this one. */
  isInsideHigherLayer: (target: globalThis.Node | null | undefined) => boolean
  /** The element of the nearest focus-taking layer opened before this one, if any; focus leaving this layer stays inside it. */
  lowerLayerElement: () => globalThis.HTMLElement | null
}

export function useOverlayLayer(
  active: MaybeRefOrGetter<boolean>,
  options: UseOverlayLayerOptions = {}
): UseOverlayLayerReturn {
  const id = Symbol('overlay-layer')
  const entry: OverlayLayerEntry = {
    id,
    element: () => toValue(options.element),
    transient: options.transient ?? false
  }

  const indexOfSelf = () => stack.findIndex((item) => item.id === id)

  const remove = () => {
    const index = indexOfSelf()
    if (index !== -1) stack.splice(index, 1)
  }

  watch(
    () => toValue(active),
    (open) => {
      if (typeof document === 'undefined') return
      if (open) {
        if (indexOfSelf() === -1) stack.push(entry)
      } else {
        remove()
      }
    },
    { immediate: true, flush: 'sync' }
  )

  if (getCurrentScope()) onScopeDispose(remove)

  const isTop = computed(() => stack.length > 0 && stack[stack.length - 1]?.id === id)

  const isFocusTop = computed(() => {
    const index = indexOfSelf()
    if (index === -1) return false
    return stack.slice(index + 1).every((item) => item.transient)
  })

  const isInsideHigherLayer = (target: globalThis.Node | null | undefined): boolean => {
    if (!target) return false
    const index = indexOfSelf()
    const above = index === -1 ? [] : stack.slice(index + 1)
    return above.some((item) => item.element()?.contains(target) ?? false)
  }

  const lowerLayerElement = (): globalThis.HTMLElement | null => {
    const index = indexOfSelf()
    const below = index === -1 ? [] : stack.slice(0, index)
    const host = below.reverse().find((item) => !item.transient && item.element())
    return host?.element() ?? null
  }

  return {
    isTop: readonly(isTop),
    isFocusTop: readonly(isFocusTop),
    isInsideHigherLayer,
    lowerLayerElement
  }
}
