import { useMediaQuery, useMounted } from '@vueuse/core'
import { computed } from 'vue'

export const overlayMobileMediaQuery = '(max-width: 767px)'

export function useOverlayMobile() {
  const matches = useMediaQuery(overlayMobileMediaQuery)
  const mounted = useMounted()
  return computed(() => mounted.value && matches.value)
}
