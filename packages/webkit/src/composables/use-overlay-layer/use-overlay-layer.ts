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

const stack = shallowReactive<symbol[]>([])

export interface UseOverlayLayerReturn {
  /** True while this overlay is open and no overlay opened after it is still open. */
  isTop: Readonly<Ref<boolean>>
}

export function useOverlayLayer(active: MaybeRefOrGetter<boolean>): UseOverlayLayerReturn {
  const id = Symbol('overlay-layer')

  const remove = () => {
    const index = stack.indexOf(id)
    if (index !== -1) stack.splice(index, 1)
  }

  watch(
    () => toValue(active),
    (open) => {
      if (typeof document === 'undefined') return
      if (open) {
        if (!stack.includes(id)) stack.push(id)
      } else {
        remove()
      }
    },
    { immediate: true, flush: 'sync' }
  )

  if (getCurrentScope()) onScopeDispose(remove)

  const isTop = computed(() => stack.length > 0 && stack[stack.length - 1] === id)

  return { isTop: readonly(isTop) }
}
