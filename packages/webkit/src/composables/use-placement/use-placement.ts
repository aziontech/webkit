import {
  type MaybeRefOrGetter,
  nextTick,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue,
  watch
} from 'vue'

import { getFixedFrame } from '../../utils/containing-block'
import { type Direction, resolveDirection } from '../use-direction'

/** Side of the anchor the panel opens on; `start` and `end` follow the text direction. */
export type Side = 'top' | 'bottom' | 'start' | 'end'
/** Alignment of the panel along the anchor edge; `start` and `end` follow the text direction on `top`/`bottom`. */
export type Align = 'start' | 'center' | 'end'
/** A screen side, after `start`/`end` resolved against the text direction. */
export type PhysicalSide = 'top' | 'right' | 'bottom' | 'left'

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

/** Distance kept from the boundary edges: both axes, or one inset per axis. */
export type CollisionPadding = number | { x: number; y: number }

export interface ComputePlacementInput {
  /** The anchor, in viewport pixels. */
  triggerRect: Rect
  /** The panel's natural (unconstrained) size, in viewport pixels. */
  panelSize: Size
  /** The area the panel must stay inside: the clipping ancestors intersected with the viewport. */
  boundary: Rect
  /** Preferred side, or `'auto'` for the first of `autoSides` that fits. */
  side: Side | 'auto'
  /** Alignment along the anchor edge. Defaults to `'center'`. */
  align?: Align
  /** Text direction that resolves `start`/`end`. Defaults to `'ltr'`. */
  dir?: Direction
  /** Candidates tried in order when `side === 'auto'`. */
  autoSides?: Side[]
  /** Flip an explicit side to the opposite one when it does not fit. */
  flip: boolean
  /** Gap between trigger and panel along the main axis. */
  sideOffset: number
  /** Minimum distance kept from the boundary edges, together or per axis. */
  collisionPadding: CollisionPadding
  /** Shift along the alignment axis, in px, away from the aligned edge (towards the inline end for `center`). */
  alignOffset?: number
  /** Vertical sides only: the panel spans exactly the trigger, so it is never shifted or capped across. */
  matchTriggerWidth?: boolean
  /** With matchTriggerWidth: the panel's own minimum width, in px. A panel wider than its trigger is kept inside the boundary. */
  panelMinWidth?: number
}

export interface ComputePlacementResult {
  /** Resolved side after flipping, in the logical vocabulary. */
  side: Side
  /** Resolved alignment, in the logical vocabulary. */
  align: Align
  /** The screen side the panel landed on. */
  physicalSide: PhysicalSide
  /** CSS transform origin facing the anchor. */
  origin: string
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
  triggerRef: MaybeRefOrGetter<globalThis.HTMLElement | null>
  panelRef: MaybeRefOrGetter<globalThis.HTMLElement | null>
  isOpen: MaybeRefOrGetter<boolean>
  side: MaybeRefOrGetter<Side | 'auto'>
  align?: MaybeRefOrGetter<Align>
  sideOffset?: MaybeRefOrGetter<number>
  alignOffset?: MaybeRefOrGetter<number>
  collisionPadding?: CollisionPadding
  flip?: boolean
  autoSides?: Side[]
  /** Text direction that resolves `start`/`end`; read from the trigger's nearest `dir` when omitted. */
  dir?: MaybeRefOrGetter<Direction | undefined>
  zIndex?: number
  /**
   * When provided, a scroll that moves the trigger dismisses the panel through this callback
   * (the panel is anchored once and does not follow the page): the scrolled node must be the
   * document or an ancestor of the trigger, and the trigger must have moved more than 1px from
   * where the panel was last anchored. Scrolls inside the panel, of unrelated scrollers, and
   * scroll events that leave the trigger in place are ignored. When omitted, a scroll
   * repositions the panel. Resize always repositions.
   */
  onDismiss?: () => void
  /** Lock the panel width to the trigger width (list boxes anchored under a field). */
  matchTriggerWidth?: boolean
}

export interface UsePlacementReturn {
  /** Side the panel landed on, after flipping. */
  resolvedSide: Readonly<Ref<Side>>
  /** Alignment the panel landed on. */
  resolvedAlign: Readonly<Ref<Align>>
  panelStyle: Readonly<Ref<Record<string, string>>>
  /** True one frame after the opening placements landed, so only re-anchors transition. */
  anchored: Readonly<Ref<boolean>>
  updatePosition: () => void
}

interface PhysicalPlacement {
  side: PhysicalSide
  align: Align
}

interface Candidate extends PhysicalPlacement {
  logical: Side
}

const OPPOSITE = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
  start: 'end',
  end: 'start'
} as const

const DEFAULT_AUTO_SIDES: Side[] = ['bottom', 'top', 'end', 'start']

const SCROLLS = /auto|scroll|overlay/

function isVertical(side: Side | PhysicalSide): boolean {
  return side === 'top' || side === 'bottom'
}

function toPhysical(side: Side, align: Align, rtl: boolean): Candidate {
  if (isVertical(side)) {
    const flipped = align === 'start' ? 'end' : align === 'end' ? 'start' : align
    return { logical: side, side: side as PhysicalSide, align: rtl ? flipped : align }
  }
  return { logical: side, side: (side === 'start') === rtl ? 'right' : 'left', align }
}

function getPopupOrigin({ side, align }: PhysicalPlacement): string {
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

function resolvePadding(padding: CollisionPadding): { x: number; y: number } {
  if (typeof padding === 'number') return { x: padding, y: padding }
  return { x: padding?.x ?? 0, y: padding?.y ?? 0 }
}

export function computePlacement(input: ComputePlacementInput): ComputePlacementResult {
  const { triggerRect: trigger, panelSize, boundary, sideOffset: offset } = input
  const padding = resolvePadding(input.collisionPadding)
  const rtl = input.dir === 'rtl'
  const align = input.align ?? 'center'
  const rawAlignOffset = input.alignOffset ?? 0

  const mainSize = (side: PhysicalSide) => (isVertical(side) ? panelSize.height : panelSize.width)
  const available = (side: PhysicalSide) => {
    switch (side) {
      case 'bottom':
        return boundary.bottom - trigger.bottom - offset - padding.y
      case 'top':
        return trigger.top - boundary.top - offset - padding.y
      case 'right':
        return boundary.right - trigger.right - offset - padding.x
      case 'left':
        return trigger.left - boundary.left - offset - padding.x
    }
  }
  const clearance = ({ side }: PhysicalPlacement) => available(side) - mainSize(side)
  const fits = (placement: PhysicalPlacement) => clearance(placement) >= 0

  let resolved: Candidate
  if (input.side === 'auto') {
    const sides = input.autoSides?.length ? input.autoSides : DEFAULT_AUTO_SIDES
    const candidates = sides.map((side) => toPhysical(side, align, rtl))
    resolved =
      candidates.find(fits) ??
      candidates.reduce((best, candidate) =>
        clearance(candidate) > clearance(best) ? candidate : best
      )
  } else {
    resolved = toPhysical(input.side, align, rtl)
    const opposite: Candidate = {
      logical: OPPOSITE[resolved.logical],
      side: OPPOSITE[resolved.side],
      align: resolved.align
    }
    if (
      input.flip &&
      !fits(resolved) &&
      (fits(opposite) || clearance(opposite) > clearance(resolved))
    ) {
      resolved = opposite
    }
  }

  const { side, align: physicalAlign } = resolved
  const alignOffset =
    rtl && physicalAlign === 'center' && isVertical(side) ? -rawAlignOffset : rawAlignOffset
  const vertical = isVertical(side)
  const locked = vertical && input.matchTriggerWidth === true

  const main = Math.min(mainSize(side), Math.max(0, available(side)))
  const crossAvailable = Math.max(
    0,
    vertical ? boundary.width - 2 * padding.x : boundary.height - 2 * padding.y
  )
  const cross = locked
    ? Math.max(trigger.width, Math.min(input.panelMinWidth ?? 0, crossAvailable))
    : Math.min(vertical ? panelSize.width : panelSize.height, crossAvailable)
  const pinned = locked && cross <= trigger.width

  const width = vertical ? cross : main
  const height = vertical ? main : cross

  let top: number
  let left: number
  if (vertical) {
    top = side === 'top' ? trigger.top - height - offset : trigger.bottom + offset
    if (physicalAlign === 'start') left = trigger.left + alignOffset
    else if (physicalAlign === 'end') left = trigger.right - width - alignOffset
    else left = trigger.left + trigger.width / 2 - width / 2 + alignOffset
  } else {
    left = side === 'left' ? trigger.left - width - offset : trigger.right + offset
    if (physicalAlign === 'start') top = trigger.top + alignOffset
    else if (physicalAlign === 'end') top = trigger.bottom - height - alignOffset
    else top = trigger.top + trigger.height / 2 - height / 2 + alignOffset
  }

  if (!pinned) left = clamp(left, boundary.left + padding.x, boundary.right - padding.x - width)
  top = clamp(top, boundary.top + padding.y, boundary.bottom - padding.y - height)

  return {
    side: resolved.logical,
    align,
    physicalSide: side,
    origin: getPopupOrigin(resolved),
    top,
    left,
    width,
    height,
    maxWidth: !locked && width < panelSize.width ? width : null,
    maxHeight: height < panelSize.height ? height : null
  }
}

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

export function usePlacement({
  triggerRef,
  panelRef,
  isOpen,
  side,
  align = 'center',
  sideOffset = 4,
  alignOffset = 0,
  collisionPadding = 8,
  flip = true,
  autoSides,
  dir,
  zIndex = 1100,
  onDismiss,
  matchTriggerWidth = false
}: UsePlacementOptions): UsePlacementReturn {
  const initial = toValue(side)
  const resolvedSide = ref<Side>(
    initial === 'auto' ? (autoSides?.[0] ?? DEFAULT_AUTO_SIDES[0]!) : initial
  )
  const resolvedAlign = ref<Align>(toValue(align))
  const offScreenStyle: Record<string, string> = {
    position: 'fixed',
    top: '0',
    left: '0',
    translate: '-9999px -9999px',
    zIndex: String(zIndex)
  }
  const panelStyle = ref<Record<string, string>>({ ...offScreenStyle })
  const anchored = ref(false)
  let anchorFrame = 0
  let disposed = false
  let anchorRect: Rect | null = null

  function updatePosition() {
    const trigger = toValue(triggerRef)
    const panel = toValue(panelRef)
    if (!trigger || !panel) {
      panelStyle.value = { ...offScreenStyle }
      return
    }

    panel.style.maxHeight = ''
    panel.style.maxWidth = ''
    const frame = getFixedFrame(panel)
    const rawPanelRect = panel.getBoundingClientRect()
    const panelSize = {
      width: panel.offsetWidth ? panel.offsetWidth * frame.scaleX : rawPanelRect.width,
      height: panel.offsetHeight ? panel.offsetHeight * frame.scaleY : rawPanelRect.height
    }
    const triggerRect = trigger.getBoundingClientRect()
    anchorRect = triggerRect
    const viewport = { width: globalThis.innerWidth ?? 0, height: globalThis.innerHeight ?? 0 }

    const result = computePlacement({
      triggerRect,
      panelSize,
      boundary: getClippingBoundary(trigger, viewport),
      side: toValue(side),
      align: toValue(align),
      dir: toValue(dir) ?? resolveDirection(trigger),
      autoSides,
      flip,
      sideOffset: toValue(sideOffset),
      alignOffset: toValue(alignOffset),
      collisionPadding,
      matchTriggerWidth,
      panelMinWidth: matchTriggerWidth
        ? (Number.parseFloat(globalThis.getComputedStyle(panel).minWidth) || 0) * frame.scaleX
        : 0
    })
    resolvedSide.value = result.side
    resolvedAlign.value = result.align

    const style: Record<string, string> = {
      position: 'fixed',
      top: '0',
      left: '0',
      translate: `${Math.round((result.left - frame.left) / frame.scaleX)}px ${Math.round(
        (result.top - frame.top) / frame.scaleY
      )}px`,
      zIndex: String(zIndex),
      '--popup-origin': result.origin
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
    if (!toValue(isOpen)) return
    updatePosition()
  }

  function triggerMoved(target: globalThis.Node | null): boolean {
    const trigger = toValue(triggerRef)
    if (!trigger || !anchorRect) return false
    const doc = globalThis.document
    const scrollsPage = !target || target === doc || target === doc?.scrollingElement
    if (!scrollsPage && !target.contains(trigger)) return false
    const now = trigger.getBoundingClientRect()
    return Math.abs(now.top - anchorRect.top) > 1 || Math.abs(now.left - anchorRect.left) > 1
  }

  function onScroll(event?: globalThis.Event) {
    if (!toValue(isOpen)) return
    const target = (event?.target ?? null) as globalThis.Node | null
    if (target && toValue(panelRef)?.contains(target)) return
    if (onDismiss) {
      if (!triggerMoved(target)) return
      onDismiss()
      nextTick(() => {
        if (toValue(isOpen)) updatePosition()
      })
      return
    }
    updatePosition()
  }

  let listening = false

  function listen(on: boolean) {
    if (on === listening) return
    listening = on
    if (on) {
      globalThis.window?.addEventListener('resize', onResize)
      globalThis.document?.addEventListener('scroll', onScroll, true)
    } else {
      globalThis.window?.removeEventListener('resize', onResize)
      globalThis.document?.removeEventListener('scroll', onScroll, true)
    }
  }

  watch(
    () => toValue(isOpen),
    async (open) => {
      if (!disposed) listen(open)
      if (!open) {
        anchored.value = false
        anchorRect = null
        return
      }
      await nextTick()
      if (disposed) return
      updatePosition()
      await nextTick()
      if (disposed) return
      updatePosition()
      if (anchorFrame) globalThis.cancelAnimationFrame?.(anchorFrame)
      anchorFrame =
        globalThis.requestAnimationFrame?.(() => {
          anchorFrame = 0
          if (!disposed && toValue(isOpen)) anchored.value = true
        }) ?? 0
    },
    { immediate: true }
  )

  watch(
    () => [toValue(side), toValue(align), toValue(sideOffset), toValue(alignOffset)],
    () => {
      if (toValue(isOpen)) nextTick(() => updatePosition())
    }
  )

  let panelObserver: globalThis.ResizeObserver | null = null

  function observePanelSize() {
    panelObserver?.disconnect()
    panelObserver = null
    const panel = toValue(panelRef)
    if (typeof globalThis.ResizeObserver === 'undefined' || !panel) return
    panelObserver = new globalThis.ResizeObserver(() => {
      if (toValue(isOpen)) updatePosition()
    })
    panelObserver.observe(panel)
  }

  watch(
    () => toValue(panelRef),
    () => observePanelSize()
  )

  onScopeDispose(() => {
    disposed = true
    if (anchorFrame) globalThis.cancelAnimationFrame?.(anchorFrame)
    anchorFrame = 0
    listen(false)
    panelObserver?.disconnect()
    panelObserver = null
  })

  return {
    resolvedSide: readonly(resolvedSide),
    resolvedAlign: readonly(resolvedAlign),
    panelStyle: readonly(panelStyle) as Readonly<Ref<Record<string, string>>>,
    anchored: readonly(anchored),
    updatePosition
  }
}
