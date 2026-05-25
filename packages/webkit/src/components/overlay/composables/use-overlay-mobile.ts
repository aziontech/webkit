import { useMediaQuery } from '@vueuse/core'

/** Matches Tailwind `max-md` (below `breakpoints.md` / 768px). */
export const overlayMobileMediaQuery = '(max-width: 767px)'

export function useOverlayMobile() {
  return useMediaQuery(overlayMobileMediaQuery)
}
