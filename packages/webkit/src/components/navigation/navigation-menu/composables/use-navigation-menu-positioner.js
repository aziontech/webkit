import { useEventListener, useResizeObserver } from '@vueuse/core'
import { computed, onBeforeUnmount, ref, toValue, unref, watch } from 'vue'

import { computePlacement, getClippingBoundary } from '../../../../composables/use-placement'
import { getFixedFrame } from '../../../../utils/containing-block'

const ALIGN_VALUES = new Set(['start', 'center', 'end'])
const SIDE_VALUES = new Set(['top', 'bottom', 'left', 'right'])
const DEFAULT_COLLISION_PADDING = 8

function normalizeCollisionPadding(raw) {
  if (typeof raw === 'number') return raw
  if (raw && typeof raw === 'object') {
    return {
      x: typeof raw.x === 'number' ? raw.x : DEFAULT_COLLISION_PADDING,
      y: typeof raw.y === 'number' ? raw.y : DEFAULT_COLLISION_PADDING
    }
  }
  return DEFAULT_COLLISION_PADDING
}

function readRect(el) {
  if (!el || typeof el.getBoundingClientRect !== 'function') return null
  return el.getBoundingClientRect()
}

/**
 * Thin wrapper over the shared `computePlacement` geometry (flip, shift, size cap,
 * scrolling-ancestor boundary) that keeps what is specific to the navigation menu: the
 * settled popup size as the measured box, the arrow, rAF-coalesced updates, and a
 * `placed` flag that suppresses the move transition on the first placement.
 *
 * @param {import('vue').MaybeRef<HTMLElement | null>} anchorRef
 * @param {import('vue').Ref<HTMLElement | null>} floatingRef
 * @param {import('vue').Ref<HTMLElement | null>} arrowRef
 * @param {import('vue').MaybeRefOrGetter<{
 *   side?: string
 *   align?: string
 *   sideOffset?: number
 *   alignOffset?: number
 *   arrowPadding?: number
 *   collisionPadding?: number | { x: number; y: number }
 * }>} options
 * @param {import('vue').MaybeRefOrGetter<{ width: number; height: number } | null>} [targetSize]
 */
export function useNavigationMenuPositioner(anchorRef, floatingRef, arrowRef, options, targetSize) {
  const state = ref({
    x: 0,
    y: 0,
    side: 'bottom',
    align: 'center',
    width: 0,
    height: 0,
    maxWidth: null,
    maxHeight: null
  })
  const hasPlacement = ref(false)
  const placed = ref(false)
  const popupOrigin = ref('top left')

  const opts = computed(() => {
    const raw = unref(options) ?? {}
    return {
      side: SIDE_VALUES.has(raw.side) ? raw.side : 'bottom',
      align: ALIGN_VALUES.has(raw.align) ? raw.align : 'center',
      sideOffset: typeof raw.sideOffset === 'number' ? raw.sideOffset : 8,
      alignOffset: typeof raw.alignOffset === 'number' ? raw.alignOffset : 0,
      arrowPadding: typeof raw.arrowPadding === 'number' ? raw.arrowPadding : 8,
      collisionPadding: normalizeCollisionPadding(raw.collisionPadding)
    }
  })

  const update = () => {
    const anchorEl = unref(anchorRef)
    const floatingEl = unref(floatingRef)
    const anchorRect = readRect(anchorEl)
    const settledSize = targetSize ? toValue(targetSize) : null
    const naturalSize = settledSize ?? readRect(floatingEl)
    if (!anchorRect || !naturalSize) return
    const { side, align, sideOffset, alignOffset, collisionPadding } = opts.value
    const viewport = { width: globalThis.innerWidth ?? 0, height: globalThis.innerHeight ?? 0 }

    const result = computePlacement({
      triggerRect: anchorRect,
      panelSize: { width: naturalSize.width, height: naturalSize.height },
      boundary: getClippingBoundary(anchorEl, viewport),
      placement: align === 'center' ? side : `${side}-${align}`,
      flip: true,
      offset: sideOffset,
      alignOffset,
      collisionPadding
    })
    const [resolvedSide, resolvedAlign = 'center'] = result.placement.split('-')

    // The positioner is fixed inside the Portal target; express viewport coordinates in
    // that frame so a transformed ancestor (Storybook's zoom) does not scale them twice.
    const frame = getFixedFrame(floatingEl)
    state.value = {
      x: (result.left - frame.left) / frame.scaleX,
      y: (result.top - frame.top) / frame.scaleY,
      side: resolvedSide,
      align: resolvedAlign,
      width: result.width,
      height: result.height,
      maxWidth: result.maxWidth === null ? null : result.maxWidth / frame.scaleX,
      maxHeight: result.maxHeight === null ? null : result.maxHeight / frame.scaleY
    }

    const clamp = (value, max) => Math.min(Math.max(value, 0), Math.max(max, 0))
    popupOrigin.value =
      resolvedSide === 'top' || resolvedSide === 'bottom'
        ? `${clamp(anchorRect.left + anchorRect.width / 2 - result.left, result.width).toFixed(2)}px ${resolvedSide === 'bottom' ? 'top' : 'bottom'}`
        : `${resolvedSide === 'right' ? 'left' : 'right'} ${clamp(anchorRect.top + anchorRect.height / 2 - result.top, result.height).toFixed(2)}px`

    hasPlacement.value = true
  }

  const resetPlacement = () => {
    hasPlacement.value = false
    placed.value = false
  }

  const nextFrame = (cb) =>
    typeof globalThis.requestAnimationFrame === 'function'
      ? globalThis.requestAnimationFrame(cb)
      : setTimeout(cb, 16)

  let rafId = null
  const scheduleUpdate = () => {
    if (rafId !== null) return
    rafId = nextFrame(() => {
      rafId = null
      update()
    })
  }

  watch(
    [() => unref(anchorRef), floatingRef, opts, () => (targetSize ? toValue(targetSize) : null)],
    () => {
      if (!hasPlacement.value) {
        update()
        return
      }
      scheduleUpdate()
    },
    { flush: 'post', immediate: true }
  )

  watch(hasPlacement, (value) => {
    if (!value) return
    nextFrame(() => {
      if (hasPlacement.value) placed.value = true
    })
  })

  useEventListener(typeof window !== 'undefined' ? window : null, 'scroll', scheduleUpdate, {
    passive: true,
    capture: true
  })
  useEventListener(typeof window !== 'undefined' ? window : null, 'resize', scheduleUpdate, {
    passive: true
  })

  if (!targetSize) {
    useResizeObserver(floatingRef, scheduleUpdate)
  }

  useResizeObserver(
    computed(() => unref(anchorRef)),
    scheduleUpdate
  )

  onBeforeUnmount(() => {
    if (rafId !== null && typeof globalThis.cancelAnimationFrame === 'function') {
      globalThis.cancelAnimationFrame(rafId)
    }
  })

  const floatingStyles = computed(() => ({
    position: 'fixed',
    top: '0',
    left: '0',
    transform: `translate3d(${Math.round(state.value.x)}px, ${Math.round(state.value.y)}px, 0)`,
    'min-width': 'max-content'
  }))

  const resolvedSide = computed(() => state.value.side)
  const resolvedAlign = computed(() => state.value.align)
  /** Cap for the popup on each axis, in px, or `null` when its natural size fits. */
  const availableWidth = computed(() => state.value.maxWidth)
  const availableHeight = computed(() => state.value.maxHeight)

  // The arrow sits on the anchor's centre along the axis perpendicular to the side,
  // kept `arrowPadding` away from the popup's (possibly capped) edges.
  const arrowStyles = computed(() => {
    const anchorRect = readRect(unref(anchorRef))
    const arrowEl = unref(arrowRef)
    if (!anchorRect || !hasPlacement.value) return {}

    const arrowSize = arrowEl ? arrowEl.offsetWidth || 8 : 8
    const padding = opts.value.arrowPadding
    const { x, y, side, width, height } = state.value

    if (side === 'top' || side === 'bottom') {
      const offsetX = anchorRect.left + anchorRect.width / 2 - x - arrowSize / 2
      return { left: `${Math.min(Math.max(offsetX, padding), width - arrowSize - padding)}px` }
    }
    const offsetY = anchorRect.top + anchorRect.height / 2 - y - arrowSize / 2
    return { top: `${Math.min(Math.max(offsetY, padding), height - arrowSize - padding)}px` }
  })

  return {
    floatingStyles,
    resolvedSide,
    resolvedAlign,
    availableWidth,
    availableHeight,
    arrowStyles,
    placed,
    popupOrigin,
    resetPlacement
  }
}
