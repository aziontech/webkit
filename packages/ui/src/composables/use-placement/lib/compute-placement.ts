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

function alignShift(input: ComputePlacementInput, align: Align, vertical: boolean): number {
  const raw = input.alignOffset ?? 0
  return input.dir === 'rtl' && align === 'center' && vertical ? -raw : raw
}

function panelPoint(
  { side, align }: PhysicalPlacement,
  trigger: Rect,
  offset: number,
  width: number,
  height: number,
  shift: number
): [top: number, left: number] {
  if (isVertical(side)) {
    const top = side === 'top' ? trigger.top - height - offset : trigger.bottom + offset
    if (align === 'start') return [top, trigger.left + shift]
    if (align === 'end') return [top, trigger.right - width - shift]
    return [top, trigger.left + trigger.width / 2 - width / 2 + shift]
  }
  const left = side === 'left' ? trigger.left - width - offset : trigger.right + offset
  if (align === 'start') return [trigger.top + shift, left]
  if (align === 'end') return [trigger.bottom - height - shift, left]
  return [trigger.top + trigger.height / 2 - height / 2 + shift, left]
}

export function computePlacement(input: ComputePlacementInput): ComputePlacementResult {
  const { triggerRect: trigger, panelSize, boundary, sideOffset: offset } = input
  const padding = resolvePadding(input.collisionPadding)
  const rtl = input.dir === 'rtl'
  const align = input.align ?? 'center'

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
  const resolved = resolveSide(input, align, rtl, ({ side }) => available(side) - mainSize(side))
  const { side } = resolved
  const vertical = isVertical(side)
  const locked = vertical && input.matchTriggerWidth === true

  const main = Math.min(mainSize(side), Math.max(0, available(side)))
  const crossAvailable = Math.max(
    0,
    vertical ? boundary.width - 2 * padding.x : boundary.height - 2 * padding.y
  )
  const cross = locked
    ? trigger.width
    : Math.min(vertical ? panelSize.width : panelSize.height, crossAvailable)
  const [width, height] = vertical ? [cross, main] : [main, cross]
  let [top, left] = panelPoint(
    resolved,
    trigger,
    offset,
    width,
    height,
    alignShift(input, resolved.align, vertical)
  )

  if (!locked) left = clamp(left, boundary.left + padding.x, boundary.right - padding.x - width)
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
