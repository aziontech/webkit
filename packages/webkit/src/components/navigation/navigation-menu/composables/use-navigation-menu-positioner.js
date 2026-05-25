import { useEventListener, useResizeObserver } from '@vueuse/core'
import { computed, onBeforeUnmount, ref, unref, watch } from 'vue'

const OPPOSITE_SIDE = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
}

const ALIGN_VALUES = new Set(['start', 'center', 'end'])
const SIDE_VALUES = new Set(['top', 'bottom', 'left', 'right'])

function readRect(el) {
  if (!el || typeof el.getBoundingClientRect !== 'function') return null
  return el.getBoundingClientRect()
}

function computePlacement({
  anchorRect,
  floatingRect,
  side,
  align,
  sideOffset,
  alignOffset,
  collisionPadding
}) {
  if (!anchorRect || !floatingRect) {
    return { x: 0, y: 0, side, align }
  }

  const viewport = {
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  }

  const fits = (candidateSide) => {
    switch (candidateSide) {
      case 'bottom':
        return (
          anchorRect.bottom + sideOffset + floatingRect.height + collisionPadding <= viewport.height
        )
      case 'top':
        return anchorRect.top - sideOffset - floatingRect.height - collisionPadding >= 0
      case 'right':
        return (
          anchorRect.right + sideOffset + floatingRect.width + collisionPadding <= viewport.width
        )
      case 'left':
        return anchorRect.left - sideOffset - floatingRect.width - collisionPadding >= 0
      default:
        return true
    }
  }

  // Simple CSS-only flip: if the preferred side overflows, try the opposite side.
  let resolvedSide = side
  if (!fits(side) && fits(OPPOSITE_SIDE[side])) {
    resolvedSide = OPPOSITE_SIDE[side]
  }

  let x = 0
  let y = 0

  if (resolvedSide === 'top' || resolvedSide === 'bottom') {
    y =
      resolvedSide === 'bottom'
        ? anchorRect.bottom + sideOffset
        : anchorRect.top - sideOffset - floatingRect.height

    if (align === 'start') {
      x = anchorRect.left + alignOffset
    } else if (align === 'end') {
      x = anchorRect.right - floatingRect.width - alignOffset
    } else {
      x = anchorRect.left + anchorRect.width / 2 - floatingRect.width / 2 + alignOffset
    }

    // Shift horizontally to keep inside the viewport.
    const maxX = viewport.width - floatingRect.width - collisionPadding
    if (x < collisionPadding) x = collisionPadding
    if (x > maxX) x = Math.max(collisionPadding, maxX)
  } else {
    x =
      resolvedSide === 'right'
        ? anchorRect.right + sideOffset
        : anchorRect.left - sideOffset - floatingRect.width

    if (align === 'start') {
      y = anchorRect.top + alignOffset
    } else if (align === 'end') {
      y = anchorRect.bottom - floatingRect.height - alignOffset
    } else {
      y = anchorRect.top + anchorRect.height / 2 - floatingRect.height / 2 + alignOffset
    }

    const maxY = viewport.height - floatingRect.height - collisionPadding
    if (y < collisionPadding) y = collisionPadding
    if (y > maxY) y = Math.max(collisionPadding, maxY)
  }

  return { x, y, side: resolvedSide, align }
}

/**
 * CSS/JS-only positioner — no external lib. Replaces the previous
 * `@floating-ui/vue` implementation, per `.claude/rules/dependencies.md`.
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
 *   collisionPadding?: number
 * }>} options
 */
export function useNavigationMenuPositioner(anchorRef, floatingRef, arrowRef, options) {
  const state = ref({ x: 0, y: 0, side: 'bottom', align: 'center' })

  const opts = computed(() => {
    const raw = unref(options) ?? {}
    return {
      side: SIDE_VALUES.has(raw.side) ? raw.side : 'bottom',
      align: ALIGN_VALUES.has(raw.align) ? raw.align : 'center',
      sideOffset: typeof raw.sideOffset === 'number' ? raw.sideOffset : 8,
      alignOffset: typeof raw.alignOffset === 'number' ? raw.alignOffset : 0,
      arrowPadding: typeof raw.arrowPadding === 'number' ? raw.arrowPadding : 8,
      collisionPadding: typeof raw.collisionPadding === 'number' ? raw.collisionPadding : 8
    }
  })

  const update = () => {
    const anchorEl = unref(anchorRef)
    const floatingEl = unref(floatingRef)
    const anchorRect = readRect(anchorEl)
    const floatingRect = readRect(floatingEl)
    if (!anchorRect || !floatingRect) return
    const { side, align, sideOffset, alignOffset, collisionPadding } = opts.value
    state.value = computePlacement({
      anchorRect,
      floatingRect,
      side,
      align,
      sideOffset,
      alignOffset,
      collisionPadding
    })
  }

  let rafId = null
  const scheduleUpdate = () => {
    if (rafId !== null) return
    const raf =
      typeof globalThis.requestAnimationFrame === 'function'
        ? globalThis.requestAnimationFrame
        : (cb) => setTimeout(cb, 16)
    rafId = raf(() => {
      rafId = null
      update()
    })
  }

  watch([() => unref(anchorRef), floatingRef, opts], scheduleUpdate, {
    flush: 'post',
    immediate: true
  })

  useEventListener(typeof window !== 'undefined' ? window : null, 'scroll', scheduleUpdate, {
    passive: true,
    capture: true
  })
  useEventListener(typeof window !== 'undefined' ? window : null, 'resize', scheduleUpdate, {
    passive: true
  })

  useResizeObserver(floatingRef, scheduleUpdate)
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

  // Arrow positioning: align the arrow to the anchor center along the
  // axis perpendicular to `resolvedSide`. Pure CSS would also work, but
  // we keep the same shape as before so navigation-menu-arrow.vue is happy.
  const arrowStyles = computed(() => {
    const floatingEl = unref(floatingRef)
    const anchorEl = unref(anchorRef)
    const arrowEl = unref(arrowRef)
    const floatingRect = readRect(floatingEl)
    const anchorRect = readRect(anchorEl)
    if (!floatingRect || !anchorRect) return {}

    const arrowSize = arrowEl ? arrowEl.offsetWidth || 8 : 8
    const padding = opts.value.arrowPadding

    if (resolvedSide.value === 'top' || resolvedSide.value === 'bottom') {
      const anchorCenter = anchorRect.left + anchorRect.width / 2
      const offsetX = anchorCenter - state.value.x - arrowSize / 2
      const clamped = Math.min(Math.max(offsetX, padding), floatingRect.width - arrowSize - padding)
      return { left: `${clamped}px` }
    }

    const anchorCenter = anchorRect.top + anchorRect.height / 2
    const offsetY = anchorCenter - state.value.y - arrowSize / 2
    const clamped = Math.min(Math.max(offsetY, padding), floatingRect.height - arrowSize - padding)
    return { top: `${clamped}px` }
  })

  return {
    floatingStyles,
    resolvedSide,
    resolvedAlign,
    arrowStyles
  }
}
