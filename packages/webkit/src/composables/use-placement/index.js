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
 * @param {() => void} [options.onDismiss] - When provided, a scroll anywhere outside the panel dismisses it through this callback (the panel is anchored once and does not follow the page), while scrolls inside the panel are ignored. When omitted, a scroll repositions the panel instead. Resize always repositions.
 * @returns {{
 *   resolvedPlacement: import('vue').Ref<Placement>,
 *   panelStyle: import('vue').Ref<Record<string, string>>,
 *   anchored: import('vue').Ref<boolean>,
 *   updatePosition: () => void
 * }} - `anchored` turns true one frame after the opening placements have landed,
 *   so a panel can transition its re-anchors while its entrance stays the
 *   component's own open animation.
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
  zIndex = 1100,
  onDismiss
}) {
  const initial = unref(placement)
  const initialResolved =
    initial === 'auto'
      ? (autoPlacements?.[0] ?? /** @type {Placement} */ ('bottom'))
      : /** @type {Placement} */ (initial)
  const resolvedPlacement = ref(/** @type {Placement} */ (initialResolved))
  /**
   * The panel is placed with `translate`, not `top`/`left`.
   *
   * Two reasons. A translate is a compositor property, so re-anchoring an open
   * panel (its content changed size) can be TRANSITIONED into place instead of
   * snapping a layout property — which is what made the copy control's tooltip
   * flicker when its label swapped mid-hover. And `translate` is a property of
   * its own: the open/close keyframes animate `transform: scale(...)`, so the
   * two compose on the same element instead of overwriting each other, which a
   * `transform: translate3d(...)` here would.
   *
   * `anchored` tracks whether a real position has been written yet, so the very
   * first placement (from the off-screen seed) is never animated — only later
   * re-anchors are.
   */
  const offScreenStyle = /** @type {Record<string, string>} */ ({
    position: 'fixed',
    top: '0',
    left: '0',
    translate: '-9999px -9999px',
    zIndex: String(zIndex)
  })
  const panelStyle = ref(/** @type {Record<string, string>} */ ({ ...offScreenStyle }))
  const anchored = ref(false)

  function updatePosition() {
    const trigger = triggerRef.value
    const panel = panelRef.value
    if (!trigger || !panel) {
      panelStyle.value = { ...offScreenStyle }
      return
    }

    const triggerRect = trigger.getBoundingClientRect()
    // `getBoundingClientRect` reports the TRANSFORMED box, and the panel opens
    // under `scale(0.9) → scale(1)`: measured mid-animation it was up to 10%
    // narrow, which placed a centred tooltip 4.1px off its trigger and left it
    // there. `offsetWidth`/`offsetHeight` are the layout box, so the placement no
    // longer depends on which frame of the entrance it is read on.
    const rawPanelRect = panel.getBoundingClientRect()
    const panelRect = {
      width: panel.offsetWidth || rawPanelRect.width,
      height: panel.offsetHeight || rawPanelRect.height
    }
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
      top: '0',
      left: '0',
      translate: `${Math.round(left)}px ${Math.round(top)}px`,
      zIndex: String(zIndex),
      '--popup-origin': getPopupOrigin(finalPlacement)
    }
  }

  function onResize() {
    if (!isOpen.value) return
    updatePosition()
  }

  /**
   * @param {Event} [event]
   */
  function onScroll(event) {
    if (!isOpen.value) return
    // A scroll INSIDE the panel is not a scroll of the page: the trigger has not
    // moved, so there is nothing to re-anchor to and nothing to dismiss. The
    // listener is in the capture phase (scroll does not bubble), so it sees the
    // panel's own scroll container too — and repositioning on it meant a long
    // scrollable panel read two `getBoundingClientRect`s and wrote its inline
    // style on every scrolled frame, which is what made the list stutter.
    const target = /** @type {Node | null} */ (event?.target ?? null)
    if (target && panelRef.value?.contains(target)) return
    if (onDismiss) {
      // The panel is anchored once and does not follow the page, so a scroll
      // outside it dismisses it.
      onDismiss()
      return
    }
    updatePosition()
  }

  watch(
    () => isOpen.value,
    async (open) => {
      if (!open) {
        // Only the flag resets. The panel is still in the DOM playing its leave
        // animation, so moving it off-screen here would replace that animation
        // with a disappearance.
        anchored.value = false
        return
      }

      await nextTick()
      updatePosition()
      await nextTick()
      updatePosition()
      // The entrance is the panel's own scale animation, and it must not be a
      // translate transition as well: the flag opens one frame AFTER the opening
      // placements have landed, so re-anchors glide and the entrance does not.
      globalThis.requestAnimationFrame(() => {
        if (isOpen.value) anchored.value = true
      })
    },
    { immediate: true }
  )

  watch(
    () => unref(placement),
    () => {
      if (isOpen.value) nextTick(() => updatePosition())
    }
  )

  /** @type {ResizeObserver | null} */
  let panelObserver = null

  /**
   * Re-anchor when the OPEN panel's own content changes size.
   *
   * The panel is placed from its measured box — a centred panel's `left` is
   * `trigger centre - panel width / 2` — so a panel that resizes after it is
   * placed keeps a `left` computed for the width it used to have. Nothing else
   * here catches it: the window has not resized and the page has not scrolled.
   * Measured on the copy control, whose tooltip swaps "Copy code" for "Copied"
   * while the pointer is still on it: the panel lost 21px of width, slid 4px, and
   * ended 10.4px off the trigger's centre in a single frame — read as a glitch,
   * and the same for any overlay whose content changes while it is up.
   *
   * A transform does not affect the observed box, so the open/close scale
   * animation cannot drive this, and `updatePosition` only writes `top`/`left`,
   * so repositioning cannot feed back into a resize.
   */
  function observePanelSize() {
    panelObserver?.disconnect()
    panelObserver = null

    if (typeof ResizeObserver === 'undefined' || !panelRef.value) return

    panelObserver = new ResizeObserver(() => {
      if (isOpen.value) updatePosition()
    })
    panelObserver.observe(panelRef.value)
  }

  watch(
    () => panelRef.value,
    () => observePanelSize()
  )

  onMounted(() => {
    globalThis.window?.addEventListener('resize', onResize)
    // Capture phase: scroll does not bubble, so this also catches scrolls on any
    // ancestor scroll container, not just the window.
    globalThis.document?.addEventListener('scroll', onScroll, true)
  })

  onBeforeUnmount(() => {
    globalThis.window?.removeEventListener('resize', onResize)
    globalThis.document?.removeEventListener('scroll', onScroll, true)
    panelObserver?.disconnect()
    panelObserver = null
  })

  return { resolvedPlacement, panelStyle, anchored, updatePosition }
}
