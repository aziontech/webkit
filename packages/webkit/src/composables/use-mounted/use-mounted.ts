import { getCurrentInstance, onMounted, type Ref, ref } from 'vue'

export function useMounted(): Readonly<Ref<boolean>> {
  const hydrating = getCurrentInstance()?.vnode.el != null
  const mounted = ref(typeof window !== 'undefined' && !hydrating)
  onMounted(() => {
    mounted.value = true
  })
  return mounted
}
