import { useMediaQuery, useMounted } from '@vueuse/core'
import { computed, type Ref } from 'vue'

export const breadcrumbCollapseMediaQuery = '(max-width: 767px)'

export function useBreadcrumbCollapse(): Readonly<Ref<boolean>> {
  const matches = useMediaQuery(breadcrumbCollapseMediaQuery)
  const mounted = useMounted()
  return computed(() => mounted.value && matches.value)
}
