import { useMediaQuery, useMounted } from '@vueuse/core'
import type { ComputedRef } from 'vue'
import { computed } from 'vue'

export const overlayMobileMediaQuery = '(max-width: 767px)'

export function useOverlayMobile(): ComputedRef<boolean> {
  const matches = useMediaQuery(overlayMobileMediaQuery)
  const mounted = useMounted()
  return computed(() => mounted.value && matches.value)
}
