import type { FlowDiagramLabel, FlowDiagramPath } from '../composables/use-flow-diagram-connectors'
import type { FlowDiagramEdgeData } from '../types'

interface Point {
  x: number
  y: number
}

interface Endpoint extends Point {
  disabled: boolean
  el: HTMLElement
}

export interface Origin {
  left: number
  top: number
  scale: number
}

interface Box {
  left: number
  right: number
  top: number
  bottom: number
  cy: number
}

const CORNER = 10
const RAIL_INSET = 16
const NODE = '[data-slot="flow-diagram-node"]'
const GROUP = '[data-slot="flow-diagram-group"]'
const ANCHOR = '[data-slot="flow-diagram-anchor"]'

const elbow = (from: Point, to: Point, busX: number, sign: 1 | -1): string => {
  if (Math.abs(from.y - to.y) < 0.5) {
    return `M${from.x},${from.y} L${to.x},${to.y}`
  }
  const dir = to.y > from.y ? 1 : -1
  const radius = Math.max(
    0,
    Math.min(CORNER, Math.abs(to.y - from.y) / 2, Math.abs(busX - from.x), Math.abs(to.x - busX))
  )
  return [
    `M${from.x},${from.y}`,
    `H${busX - sign * radius}`,
    `Q${busX},${from.y} ${busX},${from.y + dir * radius}`,
    `V${to.y - dir * radius}`,
    `Q${busX},${to.y} ${busX + sign * radius},${to.y}`,
    `H${to.x}`
  ].join(' ')
}

const measureBox = (el: Element, base: Origin): Box => {
  const r = el.getBoundingClientRect()
  return {
    left: (r.left - base.left) / base.scale,
    right: (r.right - base.left) / base.scale,
    top: (r.top - base.top) / base.scale,
    bottom: (r.bottom - base.top) / base.scale,
    cy: ((r.top + r.bottom) / 2 - base.top) / base.scale
  }
}

const readNode = (nodeEl: HTMLElement, base: Origin, rtl: boolean) => {
  const disabled = nodeEl.hasAttribute('data-disabled')
  const terminal = nodeEl.hasAttribute('data-terminal')
  const endEl = nodeEl.querySelector(`${ANCHOR}:not([data-side="start"])`) ?? nodeEl
  const startEl = nodeEl.querySelector(`${ANCHOR}:not([data-side="end"])`) ?? nodeEl
  const endBox = measureBox(endEl, base)
  const startBox = measureBox(startEl, base)
  const entry: Endpoint = {
    x: rtl ? endBox.right : endBox.left,
    y: endBox.cy,
    disabled,
    el: nodeEl
  }
  const exit: Endpoint = {
    x: rtl ? startBox.left : startBox.right,
    y: startBox.cy,
    disabled,
    el: nodeEl
  }
  return { entry, exit, terminal, box: measureBox(nodeEl, base) }
}

const pair = <T>(exits: T[], entries: T[]): Array<[T, T]> => {
  if (exits.length === 1) return entries.map((entry): [T, T] => [exits[0], entry])
  if (entries.length === 1) return exits.map((exit): [T, T] => [exit, entries[0]])
  const count = Math.min(exits.length, entries.length)
  return Array.from({ length: count }, (_, i): [T, T] => [exits[i], entries[i]])
}

export type AddLink = (
  from: HTMLElement,
  to: HTMLElement,
  path: FlowDiagramPath,
  label?: FlowDiagramLabel
) => void

export const stackedLinks = (
  container: HTMLElement,
  base: Origin,
  rtl: boolean,
  list: FlowDiagramEdgeData[],
  add: AddLink
): void => {
  const sign = rtl ? -1 : 1
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(NODE))
  for (let i = 0; i < nodes.length - 1; i += 1) {
    const from = nodes[i]
    const to = nodes[i + 1]
    if (from.hasAttribute('data-terminal') && !list.length) continue
    const a = measureBox(from, base)
    const b = measureBox(to, base)
    const x = rtl ? a.right - RAIL_INSET : a.left + RAIL_INSET
    const edge = list.find(
      (e) => e.from === from.dataset['nodeKey'] && e.to === to.dataset['nodeKey']
    )
    const severity = edge?.severity ?? null
    add(
      from,
      to,
      {
        d: `M${x},${a.bottom} L${x},${b.top}`,
        faded: from.hasAttribute('data-disabled') || to.hasAttribute('data-disabled'),
        severity
      },
      edge?.label
        ? {
            text: edge.label,
            x: x + (sign * RAIL_INSET) / 2,
            y: (a.bottom + b.top) / 2,
            severity,
            beside: true
          }
        : undefined
    )
  }
}

export const edgeLinks = (
  container: HTMLElement,
  base: Origin,
  rtl: boolean,
  list: FlowDiagramEdgeData[],
  gap: number,
  add: AddLink
): void => {
  const sign = rtl ? -1 : 1
  const byKey = new Map<string, HTMLElement>()
  container.querySelectorAll<HTMLElement>(`${NODE}[data-node-key]`).forEach((el) => {
    byKey.set(el.dataset['nodeKey'] ?? '', el)
  })
  for (const edge of list) {
    const fromEl = byKey.get(edge.from)
    const toEl = byKey.get(edge.to)
    if (!fromEl || !toEl) continue
    const from = readNode(fromEl, base, rtl)
    const to = readNode(toEl, base, rtl)
    const columnBox = measureBox(fromEl.closest(GROUP) ?? fromEl, base)
    const busX = (rtl ? columnBox.left : columnBox.right) + (sign * gap) / 2
    const severity = edge.severity ?? null
    const fanIn = list.filter((other) => other.to === edge.to).length > 1
    add(
      fromEl,
      toEl,
      {
        d: elbow(from.exit, to.entry, busX, sign),
        faded: from.exit.disabled || to.entry.disabled,
        severity
      },
      edge.label
        ? {
            text: edge.label,
            x: busX,
            y: fanIn ? from.exit.y : to.entry.y,
            severity,
            beside: false
          }
        : undefined
    )
  }
}

const readColumn = (el: HTMLElement, base: Origin, rtl: boolean) => {
  if (el.dataset['slot'] === 'flow-diagram-group') {
    const branches = Array.from(el.querySelectorAll<HTMLElement>(NODE)).map((node) =>
      readNode(node, base, rtl)
    )
    return {
      exits: branches.filter((b) => !b.terminal).map((b) => b.exit),
      entries: branches.map((b) => b.entry)
    }
  }
  const node = readNode(el, base, rtl)
  return { exits: node.terminal ? [] : [node.exit], entries: [node.entry] }
}

export const columnLinks = (
  container: HTMLElement,
  base: Origin,
  rtl: boolean,
  add: AddLink
): void => {
  const sign = rtl ? -1 : 1
  const children = Array.from(
    container.querySelectorAll<HTMLElement>(`:scope > ${NODE}, :scope > ${GROUP}`)
  )
  const read = children.map((el) => readColumn(el, base, rtl))
  for (let i = 0; i < read.length - 1; i += 1) {
    const from = read[i]
    const to = read[i + 1]
    if (!from.exits.length || !to.entries.length) continue
    const fromEdge = sign * Math.max(...from.exits.map((e) => sign * e.x))
    const toEdge = sign * Math.min(...to.entries.map((e) => sign * e.x))
    const busX = fromEdge + (toEdge - fromEdge) / 2
    for (const [exit, entry] of pair(from.exits, to.entries)) {
      add(exit.el, entry.el, {
        d: elbow(exit, entry, busX, sign),
        faded: exit.disabled || entry.disabled,
        severity: null
      })
    }
  }
}

export const originOf = (container: HTMLElement): Origin => {
  const rect = container.getBoundingClientRect()
  return {
    left: rect.left,
    top: rect.top,
    scale: container.offsetWidth > 0 ? rect.width / container.offsetWidth : 1
  }
}

export const markEnds = (
  container: HTMLElement,
  entered: Set<HTMLElement>,
  left: Set<HTMLElement>
): void => {
  container.querySelectorAll<HTMLElement>(NODE).forEach((el) => {
    el.toggleAttribute('data-entry', entered.has(el))
    el.toggleAttribute('data-exit', left.has(el))
  })
}
