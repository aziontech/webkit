import { arrow, autoUpdate, flip, offset, shift, useFloating } from '@floating-ui/vue'
import { computed, unref } from 'vue'

/**
 * @param {import('vue').MaybeRef<HTMLElement | null>} anchorRef
 * @param {import('vue').Ref<HTMLElement | null>} floatingRef
 * @param {import('vue').Ref<HTMLElement | null>} arrowRef
 * @param {import('vue').MaybeRefOrGetter<{
 *   side?: string
 *   align?: string
 *   sideOffset?: number
 *   alignOffset?: number
 *   arrowPadding?: number
 *   collisionPadding?: number
 * }>} options
 */
export function useNavigationMenuPositioner(anchorRef, floatingRef, arrowRef, options) {
  const placement = computed(() => {
    const { side = 'bottom', align = 'center' } = unref(options) ?? {}
    return `${side}-${align}`
  })

  const middleware = computed(() => {
    const {
      sideOffset = 8,
      alignOffset = 0,
      arrowPadding = 8,
      collisionPadding = 8
    } = unref(options) ?? {}

    return [
      offset({ mainAxis: sideOffset, crossAxis: alignOffset }),
      flip({ padding: collisionPadding }),
      shift({ padding: collisionPadding }),
      arrow({ element: arrowRef, padding: arrowPadding })
    ]
  })

  const {
    floatingStyles,
    placement: resolvedPlacement,
    middlewareData
  } = useFloating(anchorRef, floatingRef, {
    placement,
    middleware,
    whileElementsMounted: autoUpdate
  })

  const arrowStyles = computed(() => {
    const arrowData = middlewareData.value?.arrow

    if (!arrowData) {
      return {}
    }

    return {
      left: arrowData.x != null ? `${arrowData.x}px` : '',
      top: arrowData.y != null ? `${arrowData.y}px` : ''
    }
  })

  const resolvedSide = computed(() => resolvedPlacement.value.split('-')[0])
  const resolvedAlign = computed(() => resolvedPlacement.value.split('-')[1] ?? 'center')

  return {
    floatingStyles,
    resolvedSide,
    resolvedAlign,
    arrowStyles
  }
}
