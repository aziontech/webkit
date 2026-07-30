import { useMediaQuery } from '@vueuse/core'
import { readonly, type Ref } from 'vue'

/**
 * Width below which the trail collapses its middle segments into an overflow
 * menu. Matches Tailwind `max-md` (below `breakpoints.md` / 768px), so the
 * JS-driven collapse and the CSS-driven layout switch at the same point.
 */
export const breadcrumbCollapseMediaQuery = '(max-width: 767px)'

/**
 * True while the trail should render its collapsed form.
 *
 * The breadcrumb owns this instead of borrowing the overlay layer's mobile
 * composable: it is a navigation concern, and keeping it here is what lets the
 * rule evolve (for example toward measuring the space actually available rather
 * than the viewport) without touching how overlays decide to become sheets.
 */
export function useBreadcrumbCollapse(): Readonly<Ref<boolean>> {
  return readonly(useMediaQuery(breadcrumbCollapseMediaQuery))
}
