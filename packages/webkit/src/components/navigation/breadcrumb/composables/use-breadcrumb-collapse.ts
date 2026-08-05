import { useMediaQuery } from '@vueuse/core'
import { readonly, type Ref } from 'vue'

export const breadcrumbCollapseMediaQuery = '(max-width: 767px)'

export function useBreadcrumbCollapse(): Readonly<Ref<boolean>> {
  return readonly(useMediaQuery(breadcrumbCollapseMediaQuery))
}
