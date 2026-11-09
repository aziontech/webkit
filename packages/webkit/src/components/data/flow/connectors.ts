import { useMutationObserver, useResizeObserver } from '@vueuse/core'
import { onMounted, type Ref, ref } from 'vue'

export interface FlowPath {
  /** SVG path `d` for the connector (straight when endpoints share a row, rounded elbow otherwise). */
  d: string
  /** Reduced opacity when either endpoint is a disabled node. */
  faded: boolean
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
  scale: number
}

/** A direct child of the flow container: a single node or a group of parallel branches. */
interface FlowChild {
  /** Points where outgoing connectors originate (right edge / `start` anchors). */
  exits: Endpoint[]
  /** Points where incoming connectors terminate (left edge / `end` anchors). */
  entries: Endpoint[]
}

const CORNER = 10

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

const measureRect = (el: HTMLElement, base: Origin) => {
  const r = el.getBoundingClientRect()
  return {
    left: (r.left - base.left) / base.scale,
    right: (r.right - base.left) / base.scale,
    cy: ((r.top + r.bottom) / 2 - base.top) / base.scale
  }
}

const readNode = (
  nodeEl: HTMLElement,
  base: Origin
): { entry: Endpoint; exit: Endpoint; terminal: boolean } => {
  const disabled = nodeEl.dataset['flowDisabled'] === 'true'
  const terminal = nodeEl.dataset['flowTerminal'] === 'true'
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
    exit: { x: startRect.right, y: startRect.cy, disabled },
    terminal
  }
}

const readChild = (el: HTMLElement, base: Origin): FlowChild => {
  if (el.dataset['flowKind'] === 'parallel') {
    const branches = Array.from(
      el.querySelectorAll<HTMLElement>(':scope > [data-flow-kind="node"]')
    ).map((branch) => readNode(branch, base))

    return {
      exits: branches.filter((b) => !b.terminal).map((b) => b.exit),
      entries: branches.map((b) => b.entry)
    }
  }

  const { entry, exit, terminal } = readNode(el, base)
  return { exits: terminal ? [] : [exit], entries: [entry] }
}

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

export const useFlowConnectors = (containerRef: Ref<HTMLElement | null>) => {
  const paths = ref<FlowPath[]>([])
  const viewBox = ref<string>('0 0 0 0')

  const measure = () => {
    const container = containerRef.value
    if (!container) {
      return
    }

    const rect = container.getBoundingClientRect()
    const base: Origin = {
      left: rect.left,
      top: rect.top,
      scale: container.offsetWidth > 0 ? rect.width / container.offsetWidth : 1
    }
    const elements = Array.from(
      container.querySelectorAll<HTMLElement>(':scope > [data-flow-kind]')
    )

    elements.forEach((el, index) => {
      el.toggleAttribute('data-flow-leading', index === 0)
      el.toggleAttribute('data-flow-trailing', index === elements.length - 1)
    })

    const children = elements.map((el) => readChild(el, base))

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
          faded: exit.disabled || entry.disabled
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
