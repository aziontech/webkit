import {
  computed,
  type ComputedRef,
  getCurrentInstance,
  inject,
  onMounted,
  ref,
  ssrContextKey
} from 'vue'

export function useTeleportReady(): ComputedRef<boolean> {
  const serverRendering = inject(ssrContextKey, null) != null
  const hydrating = getCurrentInstance()?.vnode.el != null
  const ready = ref(!serverRendering && !hydrating)
  onMounted(() => {
    ready.value = true
  })
  return computed(() => ready.value)
}
