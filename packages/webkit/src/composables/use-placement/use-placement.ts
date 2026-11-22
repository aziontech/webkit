import { type MaybeRefOrGetter, nextTick, readonly, type Ref, ref, toValue, watch } from 'vue'

import { getFixedFrame } from '../../utils/containing-block'
import { type Direction, resolveDirection } from '../use-direction'
import { useAnchoring } from './composables/use-anchoring'
import { usePanelResize } from './composables/use-panel-resize'
import { useViewportListeners } from './composables/use-viewport-listeners'
import { getClippingBoundary } from './lib/clipping-boundary'
import { computePlacement, DEFAULT_AUTO_SIDES } from './lib/compute-placement'
import {
  capPanel,
  lockWidth,
  measurePanel,
  offScreenStyle,
  type PanelStyle,
  placedStyle
} from './lib/panel-style'
import { triggerMoved } from './lib/trigger-moved'
import type { Align, CollisionPadding, Rect, Side } from './lib/types'

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

type PlacementSettings = Required<
  Pick<
    UsePlacementOptions,
    | 'align'
    | 'sideOffset'
    | 'alignOffset'
    | 'collisionPadding'
    | 'flip'
    | 'zIndex'
    | 'matchTriggerWidth'
  >
> &
  UsePlacementOptions

function resolveSettings({
  align = 'center',
  sideOffset = 4,
  alignOffset = 0,
  collisionPadding = 8,
  flip = true,
  zIndex = 1100,
  matchTriggerWidth = false,
  ...rest
}: UsePlacementOptions): PlacementSettings {
  return {
    ...rest,
    align,
    sideOffset,
    alignOffset,
    collisionPadding,
    flip,
    zIndex,
    matchTriggerWidth
  }
}

function initialSide(side: Side | 'auto', autoSides: Side[] | undefined): Side {
  return side === 'auto' ? (autoSides?.[0] ?? DEFAULT_AUTO_SIDES[0]!) : side
}

function placePanel(
  trigger: globalThis.HTMLElement,
  panel: globalThis.HTMLElement,
  settings: PlacementSettings
): { style: PanelStyle; side: Side; align: Align; triggerRect: Rect } {
  panel.style.maxHeight = ''
  panel.style.maxWidth = ''
  const frame = getFixedFrame(panel)
  const panelSize = measurePanel(panel, frame)
  const triggerRect = trigger.getBoundingClientRect()
  const viewport = { width: globalThis.innerWidth ?? 0, height: globalThis.innerHeight ?? 0 }
  const result = computePlacement({
    triggerRect,
    panelSize,
    boundary: getClippingBoundary(trigger, viewport),
    side: toValue(settings.side),
    align: toValue(settings.align),
    dir: toValue(settings.dir) ?? resolveDirection(trigger),
    autoSides: settings.autoSides,
    flip: settings.flip,
    sideOffset: toValue(settings.sideOffset),
    alignOffset: toValue(settings.alignOffset),
    collisionPadding: settings.collisionPadding,
    matchTriggerWidth: settings.matchTriggerWidth
  })
  const style = placedStyle(result, frame, settings.zIndex)
  capPanel(panel, style)
  if (settings.matchTriggerWidth) lockWidth(style, triggerRect, frame)
  return { style, side: result.side, align: result.align, triggerRect }
}

function repositionOnChange(settings: PlacementSettings, update: () => void): void {
  watch(
    () => [
      toValue(settings.side),
      toValue(settings.align),
      toValue(settings.sideOffset),
      toValue(settings.alignOffset)
    ],
    () => {
      if (toValue(settings.isOpen)) nextTick(() => update())
    }
  )
}

export function usePlacement(options: UsePlacementOptions): UsePlacementReturn {
  const settings = resolveSettings(options)
  const { triggerRef, panelRef, isOpen, onDismiss } = settings
  const resolvedSide = ref<Side>(initialSide(toValue(settings.side), settings.autoSides))
  const resolvedAlign = ref<Align>(toValue(settings.align))
  const panelStyle = ref<PanelStyle>(offScreenStyle(settings.zIndex))
  let anchorRect: Rect | null = null

  function updatePosition(): void {
    const trigger = toValue(triggerRef)
    const panel = toValue(panelRef)
    if (!trigger || !panel) {
      panelStyle.value = offScreenStyle(settings.zIndex)
      return
    }
    const placed = placePanel(trigger, panel, settings)
    anchorRect = placed.triggerRect
    resolvedSide.value = placed.side
    resolvedAlign.value = placed.align
    panelStyle.value = placed.style
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

  const { listen } = useViewportListeners(updateWhenOpen, onScroll)
  const { anchored } = useAnchoring({
    isOpen,
    update: updatePosition,
    onToggle: (open) => {
      listen(open)
      if (!open) anchorRect = null
    }
  })
  repositionOnChange(settings, updatePosition)
  usePanelResize(panelRef, updateWhenOpen)

  return {
    resolvedSide: readonly(resolvedSide),
    resolvedAlign: readonly(resolvedAlign),
    panelStyle: readonly(panelStyle) as Readonly<Ref<PanelStyle>>,
    anchored,
    updatePosition
  }
}
