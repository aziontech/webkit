import { nextTick, onBeforeUnmount, onMounted, ref, unref, watch } from 'vue'

/**
 * @typedef {'top' | 'right' | 'bottom' | 'left'} Side
 * @typedef {'start' | 'center' | 'end'} Align
 * @typedef {Side | `${Side}-${Align}`} Placement
 */

const OPPOSITE = /** @type {Record<Side, Side>} */ ({
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
})

/**
 * @param {Placement} placement
 * @returns {{ side: Side, align: Align }}
 */
function splitPlacement(placement) {
  const [side, align = 'center'] = placement.split('-')
  return { side: /** @type {Side} */ (side), align: /** @type {Align} */ (align) }
}

/**
 * @param {Side} side
 * @param {Align} align
 * @returns {Placement}
 */
function joinPlacement(side, align) {
  return align === 'center' ? side : /** @type {Placement} */ (`${side}-${align}`)
}

/**
 * @param {Placement} placement
 * @returns {string}
 */
function getPopupOrigin(placement) {
  const { side, align } = splitPlacement(placement)
  if (side === 'top' || side === 'bottom') {
    const vertical = side === 'top' ? 'bottom' : 'top'
    const horizontal = align === 'start' ? 'left' : align === 'end' ? 'right' : 'center'
    return `${vertical} ${horizontal}`
  }
  const horizontal = side === 'left' ? 'right' : 'left'
  const vertical = align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center'
  return `${vertical} ${horizontal}`
}

/**
 * @param {DOMRect} triggerRect
 * @param {DOMRect} panelRect
 * @param {{ width: number, height: number }} viewport
 * @param {number} offset
 * @param {number} collisionPadding
 * @param {Side} side
 * @returns {boolean}
 */
function sideFits(triggerRect, panelRect, viewport, offset, collisionPadding, side) {
  switch (side) {
    case 'bottom':
      return triggerRect.bottom + offset + panelRect.height + collisionPadding <= viewport.height
    case 'top':
      return triggerRect.top - offset - panelRect.height - collisionPadding >= 0
    case 'right':
      return triggerRect.right + offset + panelRect.width + collisionPadding <= viewport.width
    case 'left':
      return triggerRect.left - offset - panelRect.width - collisionPadding >= 0
  }
}

/**
 * @param {DOMRect} triggerRect
 * @param {DOMRect} panelRect
 * @param {{ width: number, height: number }} viewport
 * @param {number} offset
 * @param {Side} side
 * @returns {number} - free space (px) along the side axis after placing the panel; negative if overflowing.
 */
function sideClearance(triggerRect, panelRect, viewport, offset, side) {
  switch (side) {
    case 'bottom':
      return viewport.height - (triggerRect.bottom + offset + panelRect.height)
    case 'top':
      return triggerRect.top - offset - panelRect.height
    case 'right':
      return viewport.width - (triggerRect.right + offset + panelRect.width)
    case 'left':
      return triggerRect.left - offset - panelRect.width
  }
}

/**
 * Picks the best candidate placement: first one that fits, otherwise the one with most clearance.
 *
 * @param {Placement[]} candidates
 * @param {DOMRect} triggerRect
 * @param {DOMRect} panelRect
 * @param {{ width: number, height: number }} viewport
 * @param {number} offset
 * @param {number} collisionPadding
 * @returns {Placement}
 */
function pickBestPlacement(candidates, triggerRect, panelRect, viewport, offset, collisionPadding) {
  for (const candidate of candidates) {
    const { side } = splitPlacement(candidate)
    if (sideFits(triggerRect, panelRect, viewport, offset, collisionPadding, side)) {
      return candidate
    }
  }
  let best = candidates[0]
  let bestClearance = -Infinity
  for (const candidate of candidates) {
    const { side } = splitPlacement(candidate)
    const clearance = sideClearance(triggerRect, panelRect, viewport, offset, side)
    if (clearance > bestClearance) {
      bestClearance = clearance
      best = candidate
    }
  }
  return best
}

/**
 * Auto-positions a floating panel relative to a trigger with collision-aware flipping.
 *
 * @param {object} options
 * @param {import('vue').Ref<HTMLElement | null>} options.triggerRef
 * @param {import('vue').Ref<HTMLElement | null>} options.panelRef
 * @param {import('vue').Ref<boolean>} options.isOpen
 * @param {import('vue').Ref<Placement | 'auto'> | Placement | 'auto'} options.placement
 * @param {import('vue').Ref<number> | number} [options.offset]
 * @param {number} [options.collisionPadding]
 * @param {boolean} [options.flip] - When true, flips to the opposite side if the preferred one doesn't fit.
 * @param {Placement[]} [options.autoPlacements] - Candidates used when `placement === 'auto'`. Order is preference.
 * @param {number} [options.zIndex]
 * @returns {{
 *   resolvedPlacement: import('vue').Ref<Placement>,
 *   panelStyle: import('vue').Ref<Record<string, string>>,
 *   updatePosition: () => void
 * }}
 */
export function usePlacement({
  triggerRef,
  panelRef,
  isOpen,
  placement,
  offset = 4,
  collisionPadding = 8,
  flip = true,
  autoPlacements,
  zIndex = 1100
}) {
  const initial = unref(placement)
  const initialResolved =
    initial === 'auto'
      ? (autoPlacements?.[0] ?? /** @type {Placement} */ ('bottom'))
      : /** @type {Placement} */ (initial)
  const resolvedPlacement = ref(/** @type {Placement} */ (initialResolved))
  const offScreenStyle = /** @type {Record<string, string>} */ ({
    position: 'fixed',
    top: '-9999px',
    left: '-9999px',
    zIndex: String(zIndex)
  })
  const panelStyle = ref(/** @type {Record<string, string>} */ ({ ...offScreenStyle }))

  function updatePosition() {
    const trigger = triggerRef.value
    const panel = panelRef.value
    if (!trigger || !panel) {
      panelStyle.value = { ...offScreenStyle }
      return
    }

    const triggerRect = trigger.getBoundingClientRect()
    const panelRect = panel.getBoundingClientRect()
    const gap = unref(offset)
    const viewport = {
      width: globalThis.innerWidth ?? 0,
      height: globalThis.innerHeight ?? 0
    }

    const rawPreferred = unref(placement)

    let preferred
    if (rawPreferred === 'auto') {
      const candidates =
        autoPlacements && autoPlacements.length > 0
          ? autoPlacements
          : /** @type {Placement[]} */ (['bottom', 'top', 'right', 'left'])
      preferred = pickBestPlacement(
        candidates,
        triggerRect,
        panelRect,
        viewport,
        gap,
        collisionPadding
      )
    } else {
      preferred = /** @type {Placement} */ (rawPreferred)
    }

    const { side: preferredSide, align } = splitPlacement(preferred)

    let side = preferredSide
    if (
      flip &&
      rawPreferred !== 'auto' &&
      !sideFits(triggerRect, panelRect, viewport, gap, collisionPadding, preferredSide) &&
      sideFits(triggerRect, panelRect, viewport, gap, collisionPadding, OPPOSITE[preferredSide])
    ) {
      side = OPPOSITE[preferredSide]
    }

    const finalPlacement = joinPlacement(side, align)
    resolvedPlacement.value = finalPlacement

    let top = 0
    let left = 0

    if (side === 'top' || side === 'bottom') {
      top = side === 'top' ? triggerRect.top - panelRect.height - gap : triggerRect.bottom + gap
      if (align === 'start') left = triggerRect.left
      else if (align === 'end') left = triggerRect.right - panelRect.width
      else left = triggerRect.left + triggerRect.width / 2 - panelRect.width / 2
    } else {
      left = side === 'left' ? triggerRect.left - panelRect.width - gap : triggerRect.right + gap
      if (align === 'start') top = triggerRect.top
      else if (align === 'end') top = triggerRect.bottom - panelRect.height
      else top = triggerRect.top + triggerRect.height / 2 - panelRect.height / 2
    }

    const maxLeft = viewport.width - panelRect.width - collisionPadding
    const maxTop = viewport.height - panelRect.height - collisionPadding
    left = Math.min(Math.max(left, collisionPadding), Math.max(collisionPadding, maxLeft))
    top = Math.min(Math.max(top, collisionPadding), Math.max(collisionPadding, maxTop))

    panelStyle.value = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: String(zIndex),
      '--popup-origin': getPopupOrigin(finalPlacement)
    }
  }

  function onScrollOrResize() {
    if (!isOpen.value) return
    updatePosition()
  }

  watch(
    () => isOpen.value,
    async (open) => {
      if (!open) return
      await nextTick()
      updatePosition()
      await nextTick()
      updatePosition()
    },
    { immediate: true }
  )

  watch(
    () => unref(placement),
    () => {
      if (isOpen.value) nextTick(() => updatePosition())
    }
  )

  onMounted(() => {
    globalThis.window?.addEventListener('resize', onScrollOrResize)
    globalThis.document?.addEventListener('scroll', onScrollOrResize, true)
  })

  onBeforeUnmount(() => {
    globalThis.window?.removeEventListener('resize', onScrollOrResize)
    globalThis.document?.removeEventListener('scroll', onScrollOrResize, true)
  })

  return { resolvedPlacement, panelStyle, updatePosition }
}
