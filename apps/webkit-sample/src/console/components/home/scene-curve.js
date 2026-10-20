export const HALF = 1

const STRAIGHT = 8

const arc = (corner, left, top, right, bottom) => {
  const width = right - left
  const height = bottom - top
  return {
    corner,
    style: {
      left: `${left}px`,
      top: `${top}px`,
      width: `${width}px`,
      height: `${height}px`,
      '--illustration-shape-large': `${Math.max(STRAIGHT, Math.min(width, height) - STRAIGHT)}px`
    }
  }
}

export function horizontalS({ x0, y0, x1, y1 }) {
  const midX = (x0 + x1) / 2
  const midY = (y0 + y1) / 2
  const goingDown = y1 > y0
  return goingDown
    ? [
        arc('top-right', x0, y0 - HALF, midX + HALF, midY),
        arc('bottom-left', midX - HALF, midY, x1, y1 + HALF)
      ]
    : [
        arc('bottom-right', x0, midY, midX + HALF, y0 + HALF),
        arc('top-left', midX - HALF, y1 - HALF, x1, midY)
      ]
}

export function verticalS({ x0, y0, x1, y1 }) {
  const midX = (x0 + x1) / 2
  const midY = (y0 + y1) / 2
  const goingRight = x1 > x0
  return goingRight
    ? [
        arc('bottom-left', x0 - HALF, y0, midX + HALF, midY + HALF),
        arc('top-right', midX - HALF, midY - HALF, x1 + HALF, y1)
      ]
    : [
        arc('bottom-right', midX - HALF, y0, x0 + HALF, midY + HALF),
        arc('top-left', x1 - HALF, midY - HALF, midX + HALF, y1)
      ]
}
