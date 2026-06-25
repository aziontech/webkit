import { useMutationObserver, useResizeObserver } from '@vueuse/core'
import { onMounted, type Ref, ref } from 'vue'

export interface FlowArrow {
  x: number
  y: number
}

export interface FlowPath {
  /** SVG path `d` for the connector (straight when endpoints share a row, rounded elbow otherwise). */
  d: string
  /** Reduced opacity when either endpoint is a disabled node. */
  faded: boolean
  /** Arrowhead tip position, or null when the connector feeds a parallel junction. */
  arrow: FlowArrow | null
}

interface FlowItem {
  left: number
  top: number
  right: number
  bottom: number
  cx: number
  cy: number
  kind: string
  disabled: boolean
}

const CORNER = 10

/** Orthogonal H–V–H connector with rounded corners; straight when the row is shared.
    `bus` pins the vertical leg to a shared x (so branches share one diverge/converge column). */
const elbow = (fromX: number, fromY: number, toX: number, toY: number, bus?: number): string => {
  if (Math.abs(fromY - toY) < 0.5) {
    return `M${fromX},${fromY} L${toX},${toY}`
  }

  const midX = bus ?? (fromX + toX) / 2
  const dir = toY > fromY ? 1 : -1
  const radius = Math.max(
    0,
    Math.min(CORNER, Math.abs(toY - fromY) / 2, Math.abs(midX - fromX), Math.abs(toX - midX))
  )

  return [
    `M${fromX},${fromY}`,
    `H${midX - radius}`,
    `Q${midX},${fromY} ${midX},${fromY + dir * radius}`,
    `V${toY - dir * radius}`,
    `Q${midX},${toY} ${midX + radius},${toY}`,
    `H${toX}`
  ].join(' ')
}

/** Read the direct flow items in layout coordinates (offset*, so the geometry is zoom-invariant). */
const readItems = (container: HTMLElement): FlowItem[] =>
  Array.from(container.querySelectorAll<HTMLElement>(':scope > [data-flow-kind]')).map((el) => ({
    left: el.offsetLeft,
    top: el.offsetTop,
    right: el.offsetLeft + el.offsetWidth,
    bottom: el.offsetTop + el.offsetHeight,
    cx: el.offsetLeft + el.offsetWidth / 2,
    cy: el.offsetTop + el.offsetHeight / 2,
    kind: el.dataset['flowKind'] ?? 'node',
    disabled: el.dataset['flowDisabled'] === 'true'
  }))

/**
 * Measures a flow container's direct items and produces the SVG connector geometry.
 * - `sequence`: links consecutive items left→right (Flow root and Flow.List).
 * - `parallel`: diverges from the left-center to each branch and converges back to the right-center.
 */
export const useFlowConnectors = (
  containerRef: Ref<HTMLElement | null>,
  mode: 'sequence' | 'parallel'
) => {
  const paths = ref<FlowPath[]>([])
  const viewBox = ref<string>('0 0 0 0')

  const measure = () => {
    const container = containerRef.value

    if (!container) {
      return
    }

    const width = container.clientWidth
    const height = container.clientHeight
    const items = readItems(container)
    const out: FlowPath[] = []

    if (mode === 'sequence') {
      for (let i = 0; i < items.length - 1; i += 1) {
        const from = items[i]
        const to = items[i + 1]

        out.push({
          d: elbow(from.right, from.cy, to.left, to.cy),
          faded: from.disabled || to.disabled,
          arrow: to.kind === 'parallel' ? null : { x: to.left, y: to.cy }
        })
      }
    } else if (items.length > 0) {
      const centerY = height / 2
      const minLeft = Math.min(...items.map((item) => item.left))
      const maxRight = Math.max(...items.map((item) => item.right))
      // Shared diverge / converge columns so every branch routes through one bus.
      const busLeft = minLeft / 2
      const busRight = maxRight + (width - maxRight) / 2

      for (const item of items) {
        out.push({
          d: elbow(0, centerY, item.left, item.cy, busLeft),
          faded: item.disabled,
          arrow: item.kind === 'parallel' ? null : { x: item.left, y: item.cy }
        })
        out.push({
          d: elbow(item.right, item.cy, width, centerY, busRight),
          faded: item.disabled,
          arrow: null
        })
      }
    }

    viewBox.value = `0 0 ${width} ${height}`
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
