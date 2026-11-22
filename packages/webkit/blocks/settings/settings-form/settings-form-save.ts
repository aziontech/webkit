import { toast } from '@aziontech/webkit/toast'
import type { Ref } from 'vue'

export function saveWithToast(flag: Ref<boolean>, label: string): void {
  if (flag.value) return
  flag.value = true
  setTimeout(() => {
    flag.value = false
    toast.success(`${label} saved.`)
  }, 900)
}
