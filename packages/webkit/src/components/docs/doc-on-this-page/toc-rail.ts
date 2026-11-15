export const RAIL_INDENT = 8
export const RAIL_CURVE = 10
export const RAIL_STROKE = 2
const CRISP = RAIL_STROKE / 2

/** One item's vertical extent and nesting level, relative to the list. */
export interface RailBand {
  top: number
  bottom: number
  depth: number
}

/** The built path, plus how many commands reach each band's end. */
export interface RailPath {
  commands: string[]
  boundaries: number[]
}

/** Where one band starts and ends along the built path. */
export interface RailSpan {
  start: number
  end: number
}

/** The measured path: its total length and the span of every band along it. */
export interface RailMeasurement {
  total: number
  bands: RailSpan[]
}

export const railX = (depth: number): number => (Math.max(2, depth) - 2) * RAIL_INDENT + CRISP

export function buildRail(bands: RailBand[]): RailPath {
  const commands: string[] = []
  const boundaries: number[] = []
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

export function measureRail(
  probe: globalThis.SVGPathElement,
  commands: string[],
  boundaries: number[]
): RailMeasurement {
  const lengths: RailSpan[] = []
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
