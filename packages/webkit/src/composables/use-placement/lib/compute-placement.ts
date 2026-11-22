import type {
  Align,
  CollisionPadding,
  ComputePlacementInput,
  ComputePlacementResult,
  PhysicalSide,
  Rect,
  Side
} from './types'

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

export const DEFAULT_AUTO_SIDES: Side[] = ['bottom', 'top', 'end', 'start']

function isVertical(side: Side | PhysicalSide): boolean {
  return side === 'top' || side === 'bottom'
}

function pick<T>(align: Align, start: T, end: T, center: T): T {
  if (align === 'start') return start
  return align === 'end' ? end : center
}

function toPhysical(side: Side, align: Align, rtl: boolean): Candidate {
  if (isVertical(side)) {
    const flipped = pick<Align>(align, 'end', 'start', align)
    return { logical: side, side: side as PhysicalSide, align: rtl ? flipped : align }
  }
  return { logical: side, side: (side === 'start') === rtl ? 'right' : 'left', align }
}

function getPopupOrigin({ side, align }: PhysicalPlacement): string {
  if (isVertical(side)) {
    return `${side === 'top' ? 'bottom' : 'top'} ${pick(align, 'left', 'right', 'center')}`
  }
  return `${pick(align, 'top', 'bottom', 'center')} ${side === 'left' ? 'right' : 'left'}`
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

function resolvePadding(padding: CollisionPadding): { x: number; y: number } {
  if (typeof padding === 'number') return { x: padding, y: padding }
  return { x: padding?.x ?? 0, y: padding?.y ?? 0 }
}

function spaceOn(side: PhysicalSide, trigger: Rect, boundary: Rect): number {
  switch (side) {
    case 'bottom':
      return boundary.bottom - trigger.bottom
    case 'top':
      return trigger.top - boundary.top
    case 'right':
      return boundary.right - trigger.right
    case 'left':
      return trigger.left - boundary.left
  }
}

function resolveSide(
  input: ComputePlacementInput,
  align: Align,
  rtl: boolean,
  clearance: (placement: PhysicalPlacement) => number
): Candidate {
  const fits = (placement: PhysicalPlacement) => clearance(placement) >= 0
  if (input.side === 'auto') {
    const sides = input.autoSides?.length ? input.autoSides : DEFAULT_AUTO_SIDES
    const candidates = sides.map((side) => toPhysical(side, align, rtl))
    return (
      candidates.find(fits) ??
      candidates.reduce((best, candidate) =>
        clearance(candidate) > clearance(best) ? candidate : best
      )
    )
  }
  const preferred = toPhysical(input.side, align, rtl)
  if (!input.flip || fits(preferred)) return preferred
  const opposite: Candidate = {
    logical: OPPOSITE[preferred.logical],
    side: OPPOSITE[preferred.side],
    align: preferred.align
  }
  return fits(opposite) || clearance(opposite) > clearance(preferred) ? opposite : preferred
}

function alongEdge(
  align: Align,
  start: number,
  length: number,
  size: number,
  offset: number
): number {
  return pick(
    align,
    start + offset,
    start + length - size - offset,
    start + length / 2 - size / 2 + offset
  )
}

function panelExtent(
  input: ComputePlacementInput,
  side: PhysicalSide,
  main: number,
  padding: { x: number; y: number }
): { width: number; height: number; locked: boolean } {
  const { triggerRect: trigger, panelSize, boundary } = input
  const vertical = isVertical(side)
  const locked = vertical && input.matchTriggerWidth === true
  const crossAvailable = Math.max(
    0,
    vertical ? boundary.width - 2 * padding.x : boundary.height - 2 * padding.y
  )
  const cross = locked
    ? trigger.width
    : Math.min(vertical ? panelSize.width : panelSize.height, crossAvailable)
  return vertical ? { width: cross, height: main, locked } : { width: main, height: cross, locked }
}

function panelPoint(
  input: ComputePlacementInput,
  { side, align }: PhysicalPlacement,
  { width, height }: { width: number; height: number },
  alignOffset: number
): { top: number; left: number } {
  const { triggerRect: trigger, sideOffset: offset } = input
  if (isVertical(side)) {
    return {
      top: side === 'top' ? trigger.top - height - offset : trigger.bottom + offset,
      left: alongEdge(align, trigger.left, trigger.width, width, alignOffset)
    }
  }
  return {
    top: alongEdge(align, trigger.top, trigger.height, height, alignOffset),
    left: side === 'left' ? trigger.left - width - offset : trigger.right + offset
  }
}

export function computePlacement(input: ComputePlacementInput): ComputePlacementResult {
  const { triggerRect: trigger, panelSize, boundary, sideOffset: offset } = input
  const padding = resolvePadding(input.collisionPadding)
  const rtl = input.dir === 'rtl'
  const align = input.align ?? 'center'

  const mainSize = (side: PhysicalSide) => (isVertical(side) ? panelSize.height : panelSize.width)
  const available = (side: PhysicalSide) =>
    spaceOn(side, trigger, boundary) - offset - (isVertical(side) ? padding.y : padding.x)
  const resolved = resolveSide(input, align, rtl, ({ side }) => available(side) - mainSize(side))
  const { side } = resolved

  const rawAlignOffset = input.alignOffset ?? 0
  const mirrored = rtl && resolved.align === 'center' && isVertical(side)
  const { width, height, locked } = panelExtent(
    input,
    side,
    Math.min(mainSize(side), Math.max(0, available(side))),
    padding
  )
  const point = panelPoint(
    input,
    resolved,
    { width, height },
    mirrored ? -rawAlignOffset : rawAlignOffset
  )
  const left = locked
    ? point.left
    : clamp(point.left, boundary.left + padding.x, boundary.right - padding.x - width)
  const top = clamp(point.top, boundary.top + padding.y, boundary.bottom - padding.y - height)

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
