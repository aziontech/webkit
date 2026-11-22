import { onScopeDispose, readonly, ref } from 'vue'

import type { MenuLevel } from '../use-menu-root'

const SUB_SWITCH_DELAY = 150

export function useMenuLevel(): MenuLevel {
  const activeSub = ref<string | null>(null)
  let timer: ReturnType<typeof setTimeout> | undefined

  function cancelSubClose() {
    if (timer === undefined) return
    clearTimeout(timer)
    timer = undefined
  }

  function setActiveSub(id: string | null, delay = false) {
    cancelSubClose()
    if (delay && activeSub.value !== null && activeSub.value !== id) {
      timer = setTimeout(() => {
        timer = undefined
        activeSub.value = id
      }, SUB_SWITCH_DELAY)
      return
    }
    activeSub.value = id
  }

  onScopeDispose(cancelSubClose)

  return { activeSub: readonly(activeSub), setActiveSub, cancelSubClose }
}
