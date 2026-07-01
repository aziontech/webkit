import { useMutationObserver, useResizeObserver } from '@vueuse/core'
import { onMounted, type Ref, ref } from 'vue'

export interface FlowPoint {
  x: number
  y: number
}

export interface FlowPath {
  /** SVG path `d` for the connector (straight when endpoints share a row, rounded elbow otherwise). */
  d: string
  /** Reduced opacity when either endpoint is a disabled node. */
  faded: boolean
  /** Arrowhead tip position, or null when the connector carries no head. */
  arrow: FlowPoint | null
}

/** An attachment point on the left (incoming) or right (outgoing) edge of a node. */
interface Endpoint {
  x: number
  y: number
  disabled: boolean
}

/** Top-left origin of the measuring container, in viewport coordinates. */
interface Origin {
  left: number
  top: number
}

/** A direct child of the flow container: a single node or a group of parallel branches. */
interface FlowChild {
  /** Points where outgoing connectors originate (right edge / `start` anchors). */
  exits: Endpoint[]
  /** Points where incoming connectors terminate (left edge / `end` anchors). */
  entries: Endpoint[]
}

const CORNER = 10

/** Orthogonal H–V–H connector with rounded corners; straight when endpoints share a row.
    The vertical leg is pinned to `busX` so diverging/converging branches share one column. */
const elbow = (fromX: number, fromY: number, toX: number, toY: number, busX: number): string => {
  if (Math.abs(fromY - toY) < 0.5) {
    return `M${fromX},${fromY} L${toX},${toY}`
  }

  const dir = toY > fromY ? 1 : -1
  const radius = Math.max(
    0,
    Math.min(CORNER, Math.abs(toY - fromY) / 2, Math.abs(busX - fromX), Math.abs(toX - busX))
  )

  return [
    `M${fromX},${fromY}`,
    `H${busX - radius}`,
    `Q${busX},${fromY} ${busX},${fromY + dir * radius}`,
    `V${toY - dir * radius}`,
    `Q${busX},${toY} ${busX + radius},${toY}`,
    `H${toX}`
  ].join(' ')
}

/** Read an element's box in the container's coordinate space (scroll-invariant). */
const measureRect = (el: HTMLElement, base: Origin) => {
  const r = el.getBoundingClientRect()
  return {
    left: r.left - base.left,
    right: r.right - base.left,
    cy: (r.top + r.bottom) / 2 - base.top
  }
}

/** Resolve a node's incoming (`end` anchor) and outgoing (`start` anchor) attachment points.
    Falls back to the node's left/right edge when no matching anchor is present. */
const readNode = (nodeEl: HTMLElement, base: Origin): { entry: Endpoint; exit: Endpoint } => {
  const disabled = nodeEl.dataset['flowDisabled'] === 'true'
  const endEl =
    nodeEl.querySelector<HTMLElement>('[data-flow-anchor="end"], [data-flow-anchor="both"]') ??
    nodeEl
  const startEl =
    nodeEl.querySelector<HTMLElement>('[data-flow-anchor="start"], [data-flow-anchor="both"]') ??
    nodeEl
  const endRect = measureRect(endEl, base)
  const startRect = measureRect(startEl, base)

  return {
    entry: { x: endRect.left, y: endRect.cy, disabled },
    exit: { x: startRect.right, y: startRect.cy, disabled }
  }
}

/** Build a FlowChild from a direct container child (a node, or a parallel group of nodes). */
const readChild = (el: HTMLElement, base: Origin): FlowChild => {
  if (el.dataset['flowKind'] === 'parallel') {
    const branches = Array.from(
      el.querySelectorAll<HTMLElement>(':scope > [data-flow-kind="node"]')
    ).map((branch) => readNode(branch, base))

    return {
      exits: branches.map((b) => b.exit),
      entries: branches.map((b) => b.entry)
    }
  }

  const { entry, exit } = readNode(el, base)
  return { exits: [exit], entries: [entry] }
}

/** Pair the exits of one child with the entries of the next: 1→1, fan-out (1→N), fan-in (N→1), or zip (N→M). */
const pairEndpoints = (exits: Endpoint[], entries: Endpoint[]): Array<[Endpoint, Endpoint]> => {
  if (exits.length === 1) {
    return entries.map((entry): [Endpoint, Endpoint] => [exits[0], entry])
  }
  if (entries.length === 1) {
    return exits.map((exit): [Endpoint, Endpoint] => [exit, entries[0]])
  }
  const count = Math.min(exits.length, entries.length)
  return Array.from({ length: count }, (_, i): [Endpoint, Endpoint] => [exits[i], entries[i]])
}

/**
 * Measures a flow container's direct children and produces every connector in one SVG.
 * Connectors are drawn only BETWEEN consecutive children, so a leading parallel fans in
 * (no dangling left stubs) and a trailing parallel fans out, automatically.
 */
export const useFlowConnectors = (containerRef: Ref<HTMLElement | null>) => {
  const paths = ref<FlowPath[]>([])
  const viewBox = ref<string>('0 0 0 0')

  const measure = () => {
    const container = containerRef.value
    if (!container) {
      return
    }

    const base = container.getBoundingClientRect()
    const children = Array.from(
      container.querySelectorAll<HTMLElement>(':scope > [data-flow-kind]')
    ).map((el) => readChild(el, base))

    const out: FlowPath[] = []

    for (let i = 0; i < children.length - 1; i += 1) {
      const from = children[i]
      const to = children[i + 1]
      if (!from.exits.length || !to.entries.length) {
        continue
      }

      const fromRight = Math.max(...from.exits.map((e) => e.x))
      const toLeft = Math.min(...to.entries.map((e) => e.x))
      const busX = fromRight + (toLeft - fromRight) / 2

      for (const [exit, entry] of pairEndpoints(from.exits, to.entries)) {
        out.push({
          d: elbow(exit.x, exit.y, entry.x, entry.y, busX),
          faded: exit.disabled || entry.disabled,
          arrow: { x: entry.x, y: entry.y }
        })
      }
    }

    viewBox.value = `0 0 ${container.clientWidth} ${container.clientHeight}`
    paths.value = out
  }

  onMounted(() => {
    globalThis.requestAnimationFrame(measure)
  })

  useResizeObserver(() => containerRef.value, measure)
  useMutationObserver(
    () => containerRef.value,
    () => measure(),
    {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-flow-disabled']
    }
  )

  return { paths, viewBox }
}
