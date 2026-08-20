// Geometry for the "On this page" rail.
//
// The rail is one continuous path that indents with the heading level and bends
// between levels, so the nesting is legible from the line alone. The active
// heading is not a separate element sliding over that line — it is a dash cut
// out of the very same path, which is what lets it travel *along* the curve
// instead of across it.

/** Horizontal offset per nesting level, in px. Matches the frame's 8px indent. */
export const RAIL_INDENT = 8
/** Vertical reach of the S-bend between two levels, in px. */
export const RAIL_CURVE = 10
/** Stroke width of the rail and of the active dash cut from it, in px. */
export const RAIL_STROKE = 2
/**
 * Half the stroke, so the line sits on the pixel grid instead of straddling it
 * and its left edge lands at x=0 rather than bleeding outside the rail's box.
 * Derived from the stroke, so changing the width keeps both true.
 */
const CRISP = RAIL_STROKE / 2

/**
 * The x the rail sits at for a heading level.
 *
 * @param {number} depth - heading level (2 is top level in a page body).
 * @returns {number} the x coordinate.
 */
export const railX = (depth) => (Math.max(2, depth) - 2) * RAIL_INDENT + CRISP

/**
 * Build the rail path from the measured bands.
 *
 * The path is emitted as separate commands, and each level change is split into
 * two half-curves that meet exactly on the band boundary. That split is what
 * makes the boundary addressable: the length of the path up to any band edge is
 * the length of a whole number of commands, so the active dash can be measured
 * precisely rather than estimated.
 *
 * @param {Array<{ top: number, bottom: number, depth: number }>} bands - item
 *   geometry relative to the list, in document order.
 * @returns {{ commands: string[], boundaries: number[] }} the path commands and,
 *   per band, how many commands make up the path through its end.
 */
export function buildRail(bands) {
  const commands = []
  const boundaries = []
  if (!bands.length) return { commands, boundaries }

  let x = railX(bands[0].depth)
  commands.push(`M ${x} ${bands[0].top}`)

  for (let index = 0; index < bands.length; index += 1) {
    const band = bands[index]
    const next = bands[index + 1]
    const nextX = next ? railX(next.depth) : x
    const edge = band.bottom

    if (next && nextX !== x) {
      const reach = Math.min(RAIL_CURVE, (band.bottom - band.top) / 2, (next.bottom - next.top) / 2)
      commands.push(`L ${x} ${edge - reach}`)
      // The S-bend, split at its midpoint (de Casteljau at t=0.5) so the join
      // lands exactly on the boundary between the two bands.
      const mid = (x + nextX) / 2
      commands.push(
        `C ${x} ${edge - reach / 2} ${(3 * x + nextX) / 4} ${edge - reach / 4} ${mid} ${edge}`
      )
      boundaries.push(commands.length)
      commands.push(
        `C ${(x + 3 * nextX) / 4} ${edge + reach / 4} ${nextX} ${edge + reach / 2} ${nextX} ${edge + reach}`
      )
      x = nextX
    } else {
      commands.push(`L ${x} ${edge}`)
      boundaries.push(commands.length)
    }
  }

  return { commands, boundaries }
}

/**
 * Measure where each band starts and ends along the built path.
 *
 * @param {SVGPathElement} probe - a path element in the document, used as a ruler.
 * @param {string[]} commands - the rail commands.
 * @param {number[]} boundaries - command counts per band end.
 * @returns {{ total: number, bands: Array<{ start: number, end: number }> }}
 */
export function measureRail(probe, commands, boundaries) {
  const lengths = []
  let previous = 0
  for (const count of boundaries) {
    probe.setAttribute('d', commands.slice(0, count).join(' '))
    const length = probe.getTotalLength()
    lengths.push({ start: previous, end: length })
    previous = length
  }
  probe.setAttribute('d', commands.join(' '))
  return { total: probe.getTotalLength(), bands: lengths }
}
