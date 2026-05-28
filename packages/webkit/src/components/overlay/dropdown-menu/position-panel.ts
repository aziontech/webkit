export type DropdownMenuSide = 'top' | 'bottom' | 'left' | 'right' | 'auto'
export type DropdownMenuResolvedSide = 'top' | 'bottom' | 'left' | 'right'
export type DropdownMenuAlign = 'start' | 'center' | 'end'

export interface DropdownMenuRect {
  top: number
  right: number
  bottom: number
  left: number
  width: number
  height: number
}

const OPPOSITE_SIDE: Record<DropdownMenuResolvedSide, DropdownMenuResolvedSide> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left'
}

const SIDE_ORDER: DropdownMenuResolvedSide[] = ['bottom', 'top', 'right', 'left']

export interface DropdownMenuPositionInput {
  anchorRect: DropdownMenuRect
  floatingRect: DropdownMenuRect
  preferredSide: DropdownMenuSide
  align?: DropdownMenuAlign
  sideOffset?: number
  alignOffset?: number
  collisionPadding?: number
}

export interface DropdownMenuPositionResult {
  top: number
  left: number
  resolvedSide: DropdownMenuResolvedSide
  resolvedAlign: DropdownMenuAlign
}

function getViewport() {
  return {
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  }
}

function sideFits(
  side: DropdownMenuResolvedSide,
  anchorRect: DropdownMenuRect,
  floatingRect: DropdownMenuRect,
  sideOffset: number,
  collisionPadding: number
): boolean {
  const viewport = getViewport()

  switch (side) {
    case 'bottom':
      return (
        anchorRect.bottom + sideOffset + floatingRect.height + collisionPadding <= viewport.height
      )
    case 'top':
      return anchorRect.top - sideOffset - floatingRect.height - collisionPadding >= 0
    case 'right':
      return anchorRect.right + sideOffset + floatingRect.width + collisionPadding <= viewport.width
    case 'left':
      return anchorRect.left - sideOffset - floatingRect.width - collisionPadding >= 0
    default:
      return true
  }
}

function availableSpace(
  side: DropdownMenuResolvedSide,
  anchorRect: DropdownMenuRect,
  sideOffset: number,
  collisionPadding: number
): number {
  const viewport = getViewport()

  switch (side) {
    case 'bottom':
      return viewport.height - anchorRect.bottom - sideOffset - collisionPadding
    case 'top':
      return anchorRect.top - sideOffset - collisionPadding
    case 'right':
      return viewport.width - anchorRect.right - sideOffset - collisionPadding
    case 'left':
      return anchorRect.left - sideOffset - collisionPadding
    default:
      return 0
  }
}

function resolvePreferredSide(
  preferredSide: DropdownMenuSide,
  anchorRect: DropdownMenuRect,
  floatingRect: DropdownMenuRect,
  sideOffset: number,
  collisionPadding: number
): DropdownMenuResolvedSide {
  if (preferredSide !== 'auto') {
    return preferredSide
  }

  const fitting = SIDE_ORDER.filter((side) =>
    sideFits(side, anchorRect, floatingRect, sideOffset, collisionPadding)
  )

  if (fitting.length > 0) {
    return fitting.reduce((best, side) => {
      const bestSpace = availableSpace(best, anchorRect, sideOffset, collisionPadding)
      const sideSpace = availableSpace(side, anchorRect, sideOffset, collisionPadding)
      return sideSpace > bestSpace ? side : best
    })
  }

  return SIDE_ORDER.reduce((best, side) => {
    const bestSpace = availableSpace(best, anchorRect, sideOffset, collisionPadding)
    const sideSpace = availableSpace(side, anchorRect, sideOffset, collisionPadding)
    return sideSpace > bestSpace ? side : best
  })
}

export function computeDropdownMenuPosition({
  anchorRect,
  floatingRect,
  preferredSide,
  align = 'start',
  sideOffset = 4,
  alignOffset = 0,
  collisionPadding = 8
}: DropdownMenuPositionInput): DropdownMenuPositionResult {
  let resolvedSide = resolvePreferredSide(
    preferredSide,
    anchorRect,
    floatingRect,
    sideOffset,
    collisionPadding
  )

  if (
    preferredSide !== 'auto' &&
    !sideFits(resolvedSide, anchorRect, floatingRect, sideOffset, collisionPadding) &&
    sideFits(OPPOSITE_SIDE[resolvedSide], anchorRect, floatingRect, sideOffset, collisionPadding)
  ) {
    resolvedSide = OPPOSITE_SIDE[resolvedSide]
  }

  const viewport = getViewport()
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

  return {
    top: y,
    left: x,
    resolvedSide,
    resolvedAlign: align
  }
}
