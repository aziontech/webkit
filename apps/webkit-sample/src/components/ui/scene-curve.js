// The S-curve the app's illustration scenes route their paths with.
//
// WHY NOT A SINGLE ELBOW. `IllustrationElbow` draws one quarter-arc, so a path that has to
// change lanes turns once, hard, and reads as a schematic: predictable, and at this scale a
// little brutal. What a path actually wants is to LEAVE its source in the source's direction
// and ARRIVE at its destination in the destination's direction, bending twice in between —
// the shape a modern platform diagram uses (and the reference this came from).
//
// So an S is composed from TWO elbows of opposite curvature, butted at the midpoint of the
// run: the first bends away from the source, the second unbends into the destination. Because
// they meet where both are tangent to the same axis, the seam is invisible.
//
// WHY THE RADIUS IS SET PER ARC. An elbow's corner uses `--illustration-shape-large` (16px).
// At 16px on a 30px box the arc is a rounded corner with straight run either side — still a
// turn. To read as a CURVE the radius has to be the box, so each arc redeclares that variable
// as its own smaller side. That is the same escape the stroke weight uses
// (`--illustration-rim-width-hairline`): the DS's own variable, redeclared where it applies.
//
// GEOMETRY. An elbow is a BORDER, drawn inside its box edge, so an arm's centre line sits
// `HALF` in from that edge. Every box below is therefore expressed from the two centre lines
// it must land on, never from the box itself — which is what keeps a path flush where it
// meets a straight connector.

/**
 * Half the 2px LINE — one pixel.
 *
 * Not half the connector's 4px box: those are two different numbers and mixing them is what
 * put the two halves of an S on columns 1px apart, which showed as a step at the seam. A
 * connector centres its stroke in a 4px box, so it offsets by 2; an elbow's border is 2px drawn
 * inside its box edge, so its centre line sits 1 in from that edge.
 */
export const HALF = 1

// An elbow draws only the two borders that meet at its rounded corner; the other two are
// zero-width. Where a 2px border reaches a corner whose radius has consumed the WHOLE side, it
// has to taper into that zero-width neighbour, and the taper shows as a little wedge sticking
// out of the path — which is exactly what a radius set to the full box produces. So every arc
// keeps a straight run at each end: the border ends flat against a square corner instead.
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
      // As round as the box allows, less the straight run that keeps both arms flat-ended.
      '--illustration-shape-large': `${Math.max(STRAIGHT, Math.min(width, height) - STRAIGHT)}px`
    }
  }
}

/**
 * A path that leaves HORIZONTALLY at `(x0, y0)` and arrives HORIZONTALLY at `(x1, y1)`,
 * running left to right. Used by the frameworks fan-in, where each row leaves its mark on
 * its own line and lands on the row that continues into the site.
 * @returns {{corner: string, style: Record<string, string>}[]} the two arcs, in paint order
 */
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

/**
 * A path that leaves VERTICALLY at `(x0, y0)` and arrives VERTICALLY at `(x1, y1)`, running
 * top to bottom. Used by the agents fan-in, where each editor leaves its logo downward and
 * lands on the session's top edge.
 * @returns {{corner: string, style: Record<string, string>}[]} the two arcs, in paint order
 */
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
