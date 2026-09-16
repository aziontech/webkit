import {
  type MaybeRef,
  nextTick,
  onBeforeUnmount,
  onMounted,
  readonly,
  type Ref,
  ref,
  unref,
  watch
} from 'vue'

import { getFixedFrame } from '../../utils/containing-block'

export type Side = 'top' | 'right' | 'bottom' | 'left'
export type Align = 'start' | 'center' | 'end'
export type Placement = Side | `${Side}-${Align}`

/** Viewport-space rectangle (the shape `getBoundingClientRect()` returns). */
export interface Rect {
  top: number
  left: number
  right: number
  bottom: number
  width: number
  height: number
}

export interface Size {
  width: number
  height: number
}

export interface ComputePlacementInput {
  /** The anchor, in viewport pixels. */
  triggerRect: Rect
  /** The panel's natural (unconstrained) size, in viewport pixels. */
  panelSize: Size
  /** The area the panel must stay inside: the clipping ancestors intersected with the viewport. */
  boundary: Rect
  placement: Placement | 'auto'
  /** Candidates tried in order when `placement === 'auto'`. */
  autoPlacements?: Placement[]
  /** Flip an explicit placement to the opposite side when it does not fit. */
  flip: boolean
  /** Gap between trigger and panel along the main axis. */
  offset: number
  /** Minimum distance kept from every boundary edge. */
  collisionPadding: number
  /** Vertical sides only: the panel spans exactly the trigger, so it is never shifted or capped across. */
  matchTriggerWidth?: boolean
}

export interface ComputePlacementResult {
  placement: Placement
  top: number
  left: number
  /** Final panel size after shrinking; equals the natural size when nothing was capped. */
  width: number
  height: number
  /** Cap to apply on the panel, or `null` when the natural size fits. */
  maxWidth: number | null
  maxHeight: number | null
}

export interface UsePlacementOptions {
  triggerRef: Ref<globalThis.HTMLElement | null>
  panelRef: Ref<globalThis.HTMLElement | null>
  isOpen: Ref<boolean>
  placement: MaybeRef<Placement | 'auto'>
  offset?: MaybeRef<number>
  collisionPadding?: number
  flip?: boolean
  autoPlacements?: Placement[]
  zIndex?: number
  /**
   * When provided, a scroll outside the panel dismisses it through this callback (the
   * panel is anchored once and does not follow the page); scrolls inside the panel are
   * ignored. When omitted, a scroll repositions the panel. Resize always repositions.
   */
  onDismiss?: () => void
  /** Lock the panel width to the trigger width (list boxes anchored under a field). */
  matchTriggerWidth?: boolean
}

export interface UsePlacementReturn {
  resolvedPlacement: Readonly<Ref<Placement>>
  panelStyle: Readonly<Ref<Record<string, string>>>
  /** True one frame after the opening placements landed, so only re-anchors transition. */
  anchored: Readonly<Ref<boolean>>
  updatePosition: () => void
}

const OPPOSITE: Record<Side, Side> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }

const DEFAULT_AUTO_PLACEMENTS: Placement[] = ['bottom', 'top', 'right', 'left']

const SCROLLS = /auto|scroll|overlay/

function splitPlacement(placement: Placement): { side: Side; align: Align } {
  const [side, align = 'center'] = placement.split('-') as [Side, Align | undefined]
  return { side, align }
}

function joinPlacement(side: Side, align: Align): Placement {
  return align === 'center' ? side : `${side}-${align}`
}

function isVertical(side: Side): boolean {
  return side === 'top' || side === 'bottom'
}

/** `transform-origin` for the open/close scale animation: the edge touching the trigger. */
function getPopupOrigin(placement: Placement): string {
  const { side, align } = splitPlacement(placement)
  if (isVertical(side)) {
    const vertical = side === 'top' ? 'bottom' : 'top'
    const horizontal = align === 'start' ? 'left' : align === 'end' ? 'right' : 'center'
    return `${vertical} ${horizontal}`
  }
  const horizontal = side === 'left' ? 'right' : 'left'
  const vertical = align === 'start' ? 'top' : align === 'end' ? 'bottom' : 'center'
  return `${vertical} ${horizontal}`
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

/**
 * Pure placement geometry: resolves the side (flip first), caps the panel to the free
 * space only when no side fits (shrink second), anchors it and shifts it back inside the
 * boundary. Everything is in viewport pixels; callers convert to their fixed frame.
 */
export function computePlacement(input: ComputePlacementInput): ComputePlacementResult {
  const { triggerRect: trigger, panelSize, boundary, offset, collisionPadding: padding } = input

  const mainSize = (side: Side) => (isVertical(side) ? panelSize.height : panelSize.width)
  /** Free main-axis space on `side`, between the trigger and the boundary. */
  const available = (side: Side) => {
    switch (side) {
      case 'bottom':
        return boundary.bottom - trigger.bottom - offset - padding
      case 'top':
        return trigger.top - boundary.top - offset - padding
      case 'right':
        return boundary.right - trigger.right - offset - padding
      case 'left':
        return trigger.left - boundary.left - offset - padding
    }
  }
  const clearance = (placement: Placement) => {
    const { side } = splitPlacement(placement)
    return available(side) - mainSize(side)
  }
  const fits = (placement: Placement) => clearance(placement) >= 0

  let resolved: Placement
  if (input.placement === 'auto') {
    const candidates = input.autoPlacements?.length ? input.autoPlacements : DEFAULT_AUTO_PLACEMENTS
    resolved =
      candidates.find(fits) ??
      candidates.reduce((best, candidate) =>
        clearance(candidate) > clearance(best) ? candidate : best
      )
  } else {
    resolved = input.placement
    const { side, align } = splitPlacement(resolved)
    const opposite = joinPlacement(OPPOSITE[side], align)
    // Flip when the other side fits; when neither does, take the roomier one.
    if (
      input.flip &&
      !fits(resolved) &&
      (fits(opposite) || clearance(opposite) > clearance(resolved))
    ) {
      resolved = opposite
    }
  }

  const { side, align } = splitPlacement(resolved)
  const vertical = isVertical(side)
  const locked = vertical && input.matchTriggerWidth === true

  const main = Math.min(mainSize(side), Math.max(0, available(side)))
  const crossAvailable = Math.max(0, (vertical ? boundary.width : boundary.height) - 2 * padding)
  const cross = locked
    ? trigger.width
    : Math.min(vertical ? panelSize.width : panelSize.height, crossAvailable)

  const width = vertical ? cross : main
  const height = vertical ? main : cross

  let top: number
  let left: number
  if (vertical) {
    top = side === 'top' ? trigger.top - height - offset : trigger.bottom + offset
    if (align === 'start') left = trigger.left
    else if (align === 'end') left = trigger.right - width
    else left = trigger.left + trigger.width / 2 - width / 2
  } else {
    left = side === 'left' ? trigger.left - width - offset : trigger.right + offset
    if (align === 'start') top = trigger.top
    else if (align === 'end') top = trigger.bottom - height
    else top = trigger.top + trigger.height / 2 - height / 2
  }

  if (!locked) left = clamp(left, boundary.left + padding, boundary.right - padding - width)
  top = clamp(top, boundary.top + padding, boundary.bottom - padding - height)

  return {
    placement: resolved,
    top,
    left,
    width,
    height,
    maxWidth: !locked && width < panelSize.width ? width : null,
    maxHeight: height < panelSize.height ? height : null
  }
}

/**
 * The viewport intersected with every ancestor of `trigger` that actually scrolls on an
 * axis. `overflow: hidden | clip` do not count (they clip their own children, not a panel
 * teleported to `body`); a `position: fixed` ancestor escapes every clip above it.
 */
export function getClippingBoundary(trigger: globalThis.Element, viewport: Size): Rect {
  let top = 0
  let left = 0
  let right = viewport.width
  let bottom = viewport.height

  const body = globalThis.document?.body ?? null
  let node = typeof globalThis.getComputedStyle === 'function' ? trigger.parentElement : null
  while (node && node !== body && node !== body?.parentElement) {
    const style = globalThis.getComputedStyle(node)
    const clipsX = SCROLLS.test(style.overflowX) && node.scrollWidth > node.clientWidth + 1
    const clipsY = SCROLLS.test(style.overflowY) && node.scrollHeight > node.clientHeight + 1
    if (clipsX || clipsY) {
      const rect = node.getBoundingClientRect()
      if (clipsX) {
        left = Math.max(left, rect.left + node.clientLeft)
        right = Math.min(right, rect.left + node.clientLeft + node.clientWidth)
      }
      if (clipsY) {
        top = Math.max(top, rect.top + node.clientTop)
        bottom = Math.min(bottom, rect.top + node.clientTop + node.clientHeight)
      }
    }
    // A fixed ancestor (Dialog, Drawer shell) escapes every clip above it.
    if (style.position === 'fixed') break
    node = node.parentElement
  }

  if (right <= left || bottom <= top) {
    top = 0
    left = 0
    right = viewport.width
    bottom = viewport.height
  }
  return { top, left, right, bottom, width: right - left, height: bottom - top }
}

/**
 * Anchors a floating panel to a trigger: flips to the side that fits, caps it to the free
 * space when none does (so it scrolls instead of clipping), stays inside the nearest
 * scrolling ancestor, and corrects for a transformed Teleport target (Storybook's zoom).
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
  onDismiss,
  matchTriggerWidth = false
}: UsePlacementOptions): UsePlacementReturn {
  const initial = unref(placement)
  const resolvedPlacement = ref<Placement>(
    initial === 'auto' ? (autoPlacements?.[0] ?? 'bottom') : initial
  )
  // Placed with `translate` (a compositor property re-anchors can transition, and one
  // that composes with the open/close `transform: scale` keyframes) instead of top/left.
  const offScreenStyle: Record<string, string> = {
    position: 'fixed',
    top: '0',
    left: '0',
    translate: '-9999px -9999px',
    zIndex: String(zIndex)
  }
  const panelStyle = ref<Record<string, string>>({ ...offScreenStyle })
  const anchored = ref(false)

  function updatePosition() {
    const trigger = triggerRef.value
    const panel = panelRef.value
    if (!trigger || !panel) {
      panelStyle.value = { ...offScreenStyle }
      return
    }

    // Natural size: drop our own caps first (a panel shrunk on a previous pass would be
    // believed to fit where only the shrunk version does); the cap is written back below
    // in the same task, so no unconstrained frame paints.
    panel.style.maxHeight = ''
    panel.style.maxWidth = ''
    // `offsetWidth`/`offsetHeight` are the layout box, unaffected by the entrance scale
    // animation that `getBoundingClientRect` would report mid-flight.
    const frame = getFixedFrame(panel)
    const rawPanelRect = panel.getBoundingClientRect()
    const panelSize = {
      width: panel.offsetWidth ? panel.offsetWidth * frame.scaleX : rawPanelRect.width,
      height: panel.offsetHeight ? panel.offsetHeight * frame.scaleY : rawPanelRect.height
    }
    const triggerRect = trigger.getBoundingClientRect()
    const viewport = { width: globalThis.innerWidth ?? 0, height: globalThis.innerHeight ?? 0 }

    const result = computePlacement({
      triggerRect,
      panelSize,
      boundary: getClippingBoundary(trigger, viewport),
      placement: unref(placement),
      autoPlacements,
      flip,
      offset: unref(offset),
      collisionPadding,
      matchTriggerWidth
    })
    resolvedPlacement.value = result.placement

    // Viewport coordinates expressed in the frame of a transformed Teleport target, so
    // they are not scaled twice.
    const style: Record<string, string> = {
      position: 'fixed',
      top: '0',
      left: '0',
      translate: `${Math.round((result.left - frame.left) / frame.scaleX)}px ${Math.round(
        (result.top - frame.top) / frame.scaleY
      )}px`,
      zIndex: String(zIndex),
      '--popup-origin': getPopupOrigin(result.placement)
    }
    if (result.maxHeight !== null) {
      style['maxHeight'] = `${result.maxHeight / frame.scaleY}px`
      panel.style.maxHeight = style['maxHeight']
    }
    if (result.maxWidth !== null) {
      style['maxWidth'] = `${result.maxWidth / frame.scaleX}px`
      panel.style.maxWidth = style['maxWidth']
    }
    if (matchTriggerWidth) style['width'] = `${triggerRect.width / frame.scaleX}px`
    panelStyle.value = style
  }

  function onResize() {
    if (!isOpen.value) return
    updatePosition()
  }

  function onScroll(event?: globalThis.Event) {
    if (!isOpen.value) return
    // Capture phase (scroll does not bubble) also sees the panel's own scroll container;
    // a scroll inside the panel moves no trigger, so there is nothing to re-anchor.
    const target = (event?.target ?? null) as globalThis.Node | null
    if (target && panelRef.value?.contains(target)) return
    if (onDismiss) {
      onDismiss()
      return
    }
    updatePosition()
  }

  watch(
    () => isOpen.value,
    async (open) => {
      if (!open) {
        // Only the flag resets: the panel is still playing its leave animation.
        anchored.value = false
        return
      }
      await nextTick()
      updatePosition()
      await nextTick()
      updatePosition()
      // Opens one frame after the opening placements landed, so the entrance is the
      // panel's own scale animation and only later re-anchors glide.
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

  // Re-anchor when the OPEN panel's own content changes size (a centred panel keeps a
  // `left` computed for the width it used to have). Re-applying an unchanged cap settles
  // the box at its previous size, so repositioning does not feed back into a resize.
  let panelObserver: globalThis.ResizeObserver | null = null

  function observePanelSize() {
    panelObserver?.disconnect()
    panelObserver = null
    if (typeof globalThis.ResizeObserver === 'undefined' || !panelRef.value) return
    panelObserver = new globalThis.ResizeObserver(() => {
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
    // Capture phase: catches scrolls on any ancestor scroll container, not just the window.
    globalThis.document?.addEventListener('scroll', onScroll, true)
  })

  onBeforeUnmount(() => {
    globalThis.window?.removeEventListener('resize', onResize)
    globalThis.document?.removeEventListener('scroll', onScroll, true)
    panelObserver?.disconnect()
    panelObserver = null
  })

  return {
    resolvedPlacement: readonly(resolvedPlacement),
    panelStyle: readonly(panelStyle) as Readonly<Ref<Record<string, string>>>,
    anchored: readonly(anchored),
    updatePosition
  }
}
