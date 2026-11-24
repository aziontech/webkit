import { computed, type ComputedRef, getCurrentInstance, onMounted, ref } from 'vue'

export function useTeleportReady(): ComputedRef<boolean> {
  const hydrating = getCurrentInstance()?.vnode.el != null
  const mounted = ref(typeof window !== 'undefined' && !hydrating)
  onMounted(() => {
    mounted.value = true
  })
  return computed(() => mounted.value)
}
