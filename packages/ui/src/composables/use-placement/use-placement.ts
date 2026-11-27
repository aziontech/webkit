import { type MaybeRefOrGetter, nextTick, readonly, type Ref, ref, toValue, watch } from 'vue'

import { getFixedFrame } from '../../utils/containing-block'
import { type Direction, resolveDirection } from '../use-direction'
import { useAnchoring } from './composables/use-anchoring'
import { getClippingBoundary } from './lib/clipping-boundary'
import { computePlacement, DEFAULT_AUTO_SIDES } from './lib/compute-placement'
import { measurePanel, offScreenStyle, type PanelStyle, placedStyle } from './lib/panel-style'
import { triggerMoved } from './lib/trigger-moved'
import type { Align, CollisionPadding, ComputePlacementResult, Rect, Side } from './lib/types'

export interface UsePlacementOptions {
  triggerRef: MaybeRefOrGetter<globalThis.HTMLElement | null>
  panelRef: MaybeRefOrGetter<globalThis.HTMLElement | null>
  isOpen: MaybeRefOrGetter<boolean>
  side: MaybeRefOrGetter<Side | 'auto'>
  /** Alignment along the anchor edge. Defaults to `'center'`. */
  align?: MaybeRefOrGetter<Align>
  /** Gap between trigger and panel, in px. Defaults to 4. */
  sideOffset?: MaybeRefOrGetter<number>
  /** Shift along the alignment axis, in px. Defaults to 0. */
  alignOffset?: MaybeRefOrGetter<number>
  /** Distance kept from the boundary edges, in px. Defaults to 8. */
  collisionPadding?: CollisionPadding
  /** Flip to the opposite side when the panel does not fit. Defaults to true. */
  flip?: boolean
  autoSides?: Side[]
  /** Text direction that resolves `start`/`end`; read from the trigger's nearest `dir` when omitted. */
  dir?: MaybeRefOrGetter<Direction | undefined>
  /** Stacking order of the panel. Defaults to 1100. */
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
  /** Lock the panel width to the trigger width (list boxes anchored under a field). Defaults to false. */
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

function initialSide(side: Side | 'auto', autoSides: Side[] | undefined): Side {
  return side === 'auto' ? (autoSides?.[0] ?? DEFAULT_AUTO_SIDES[0]!) : side
}

function placePanel(
  trigger: globalThis.HTMLElement,
  panel: globalThis.HTMLElement,
  options: UsePlacementOptions,
  zIndex: number
): [style: PanelStyle, result: ComputePlacementResult, triggerRect: Rect] {
  panel.style.maxHeight = ''
  panel.style.maxWidth = ''
  const frame = getFixedFrame(panel)
  const panelSize = measurePanel(panel, frame)
  const triggerRect = trigger.getBoundingClientRect()
  const viewport = { width: globalThis.innerWidth ?? 0, height: globalThis.innerHeight ?? 0 }
  const matchTriggerWidth = options.matchTriggerWidth ?? false
  const result = computePlacement({
    triggerRect,
    panelSize,
    boundary: getClippingBoundary(trigger, viewport),
    side: toValue(options.side),
    align: toValue(options.align ?? 'center'),
    dir: toValue(options.dir) ?? resolveDirection(trigger),
    autoSides: options.autoSides,
    flip: options.flip ?? true,
    sideOffset: toValue(options.sideOffset ?? 4),
    alignOffset: toValue(options.alignOffset ?? 0),
    collisionPadding: options.collisionPadding ?? 8,
    matchTriggerWidth
  })
  const width = matchTriggerWidth ? `${triggerRect.width / frame.scaleX}px` : null
  return [placedStyle(result, frame, zIndex, panel, width), result, triggerRect]
}

export function usePlacement(options: UsePlacementOptions): UsePlacementReturn {
  const { triggerRef, panelRef, isOpen, onDismiss } = options
  const zIndex = options.zIndex ?? 1100
  const resolvedSide = ref<Side>(initialSide(toValue(options.side), options.autoSides))
  const resolvedAlign = ref<Align>(toValue(options.align ?? 'center'))
  const panelStyle = ref<PanelStyle>(offScreenStyle(zIndex))
  let anchorRect: Rect | null = null

  function updatePosition(): void {
    const trigger = toValue(triggerRef)
    const panel = toValue(panelRef)
    if (!trigger || !panel) {
      panelStyle.value = offScreenStyle(zIndex)
      return
    }
    const [style, result, triggerRect] = placePanel(trigger, panel, options, zIndex)
    anchorRect = triggerRect
    resolvedSide.value = result.side
    resolvedAlign.value = result.align
    panelStyle.value = style
  }

  const updateWhenOpen = (): void => {
    if (toValue(isOpen)) updatePosition()
  }

  function onScroll(event?: globalThis.Event): void {
    if (!toValue(isOpen)) return
    const target = (event?.target ?? null) as globalThis.Node | null
    if (target && toValue(panelRef)?.contains(target)) return
    if (!onDismiss) return updatePosition()
    if (!triggerMoved(toValue(triggerRef), anchorRect, target)) return
    onDismiss()
    nextTick(updateWhenOpen)
  }

  const anchored = useAnchoring(isOpen, panelRef, updatePosition, updateWhenOpen, onScroll, () => {
    anchorRect = null
  })
  watch(
    () => [
      toValue(options.side),
      toValue(options.align),
      toValue(options.sideOffset),
      toValue(options.alignOffset)
    ],
    () => {
      if (toValue(isOpen)) nextTick(updatePosition)
    }
  )

  return {
    resolvedSide: readonly(resolvedSide),
    resolvedAlign: readonly(resolvedAlign),
    panelStyle: readonly(panelStyle) as Readonly<Ref<PanelStyle>>,
    anchored,
    updatePosition
  }
}
