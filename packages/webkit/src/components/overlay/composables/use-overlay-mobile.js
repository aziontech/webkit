import { useMediaQuery } from '@vueuse/core'

export const overlayMobileMediaQuery = '(max-width: 767px)'

export function useOverlayMobile() {
  return useMediaQuery(overlayMobileMediaQuery)
}
