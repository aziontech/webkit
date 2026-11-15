import '../../../test/reflow.css'

import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import AnchoredNode from '../../../../examples/flow-diagram/anchored-node.vue'
import Branches from '../../../../examples/flow-diagram/branches.vue'
import Default from '../../../../examples/flow-diagram/default.vue'
import Disabled from '../../../../examples/flow-diagram/disabled.vue'
import Parallel from '../../../../examples/flow-diagram/parallel.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import FlowDiagram, { FlowDiagramAnchor, FlowDiagramNode, FlowDiagramParallel } from './index'

// Vue's runtime string-template compiler cannot resolve member-expression tags
// like FlowDiagram.Node, so trees register the same component objects under flat
// PascalCase tags (the FlowDiagram.Node === FlowDiagramNode identity is asserted separately).
const renderTree = (template: string) =>
  render({
    components: { FlowDiagram, FlowDiagramNode, FlowDiagramParallel, FlowDiagramAnchor },
    template
  })

describe('FlowDiagram', () => {
  describe('composition compound', () => {
    describe('compound API — Object.assign attachment (index.ts)', () => {
      it('attaches every public sub-component to the root for dot-notation', () => {
        expect(FlowDiagram.Node).toBe(FlowDiagramNode)
        expect(FlowDiagram.Parallel).toBe(FlowDiagramParallel)
        expect(FlowDiagram.Anchor).toBe(FlowDiagramAnchor)
      })

      it('names the compound members from the anatomy (defineOptions.name)', () => {
        expect(FlowDiagram.name).toBe('FlowDiagram')
        expect(FlowDiagramNode.name).toBe('FlowNode')
        expect(FlowDiagramParallel.name).toBe('FlowParallel')
        expect(FlowDiagramAnchor.name).toBe('FlowAnchor')
      })
    })

    describe('root — flow.vue structure & align prop', () => {
      it('renders role=list with the default data-testid and an inner container defaulting align=start', () => {
        const { getByTestId, getByRole } = render(FlowDiagram)
        const root = getByTestId('flow-diagram')
        expect(root.tagName).toBe('DIV')
        expect(getByRole('list')).toBe(root)
        const inner = root.querySelector('[data-align]') as HTMLElement
        expect(inner.getAttribute('data-align')).toBe('start')
      })

      it('reflects the align prop onto the inner container', () => {
        const { getByTestId } = render(FlowDiagram, { props: { align: 'center' } })
        const inner = getByTestId('flow-diagram').querySelector('[data-align]') as HTMLElement
        expect(inner.getAttribute('data-align')).toBe('center')
      })

      it('honours a consumer-supplied data-testid on the root', () => {
        const { getByTestId } = render(FlowDiagram, { attrs: { 'data-testid': 'my-flow' } })
        expect(getByTestId('my-flow').getAttribute('role')).toBe('list')
      })
    })

    describe('provide/inject — sub-component testids derive from the root context', () => {
      it('derives node/parallel/anchor testids from the injected root testId (default)', () => {
        const { getAllByTestId } = renderTree(`
        <FlowDiagram>
          <FlowDiagramNode>Start</FlowDiagramNode>
          <FlowDiagramParallel>
            <FlowDiagramNode unstyled>
              <FlowDiagramAnchor side="end">A</FlowDiagramAnchor>
            </FlowDiagramNode>
          </FlowDiagramParallel>
        </FlowDiagram>
      `)
        // Derived ids are shared across instances, so there can be several node ids.
        expect(getAllByTestId('flow-diagram-node').length).toBeGreaterThan(0)
        expect(getAllByTestId('flow-diagram-parallel').length).toBe(1)
        expect(getAllByTestId('flow-diagram-anchor').length).toBe(1)
      })

      it('keeps every part on its own test id under a custom root testId', () => {
        const { getByTestId, getAllByTestId } = renderTree(`
        <FlowDiagram data-testid="pipeline">
          <FlowDiagramNode>Only</FlowDiagramNode>
          <FlowDiagramParallel><FlowDiagramNode>P</FlowDiagramNode></FlowDiagramParallel>
        </FlowDiagram>
      `)
        expect(getByTestId('pipeline')).toBeTruthy()
        expect(getAllByTestId('flow-diagram-node').length).toBe(2)
        expect(getByTestId('flow-diagram-parallel')).toBeTruthy()
      })

      it('keeps its own test id when a sub-component has no FlowDiagram ancestor', () => {
        const { getByTestId } = render(FlowDiagramNode, { slots: { default: 'orphan' } })
        expect(getByTestId('flow-diagram-node')).toBeTruthy()
      })
    })

    describe('Flow.Node — flow-diagram-node.vue props & a11y', () => {
      it('renders role=listitem with data-slot=flow-node and is styled by default', () => {
        const { getByTestId } = renderTree(
          `<FlowDiagram><FlowDiagramNode>N</FlowDiagramNode></FlowDiagram>`
        )
        const node = getByTestId('flow-diagram-node')
        expect(node.getAttribute('role')).toBe('listitem')
        expect(node.getAttribute('data-slot')).toBe('flow-diagram-node')
        expect(node.hasAttribute('data-styled')).toBe(true)
      })

      it('drops the styled box when unstyled', () => {
        const { getByTestId } = renderTree(
          `<FlowDiagram><FlowDiagramNode unstyled>N</FlowDiagramNode></FlowDiagram>`
        )
        expect(getByTestId('flow-diagram-node').hasAttribute('data-styled')).toBe(false)
      })

      it('marks a disabled node with the connector/aria data attributes', () => {
        const { getByTestId } = renderTree(
          `<FlowDiagram><FlowDiagramNode disabled>N</FlowDiagramNode></FlowDiagram>`
        )
        const node = getByTestId('flow-diagram-node')
        expect(node.getAttribute('data-flow-disabled')).toBe('true')
        expect(node.hasAttribute('data-disabled')).toBe(true)
        expect(node.getAttribute('aria-disabled')).toBe('true')
      })

      it('omits the disabled attributes when enabled', () => {
        const { getByTestId } = renderTree(
          `<FlowDiagram><FlowDiagramNode>N</FlowDiagramNode></FlowDiagram>`
        )
        const node = getByTestId('flow-diagram-node')
        expect(node.hasAttribute('data-flow-disabled')).toBe(false)
        expect(node.hasAttribute('data-disabled')).toBe(false)
        expect(node.hasAttribute('aria-disabled')).toBe(false)
      })

      it('renders the default slot content', () => {
        const { getByText } = renderTree(
          `<FlowDiagram><FlowDiagramNode>Transform</FlowDiagramNode></FlowDiagram>`
        )
        expect(getByText('Transform')).toBeTruthy()
      })

      it('renders a connector port on each edge of a styled node, hidden from the a11y tree', () => {
        const { getByTestId } = renderTree(
          `<FlowDiagram><FlowDiagramNode>N</FlowDiagramNode></FlowDiagram>`
        )
        const node = getByTestId('flow-diagram-node')
        const ports = Array.from(node.querySelectorAll<HTMLElement>('[data-slot="flow-port"]'))
        expect(ports.map((p) => p.getAttribute('data-side'))).toEqual(['end', 'start'])
        expect(ports.every((p) => p.getAttribute('aria-hidden') === 'true')).toBe(true)
      })

      it('renders no ports on an unstyled node (its slot content owns the appearance)', () => {
        const { getByTestId } = renderTree(
          `<FlowDiagram><FlowDiagramNode unstyled>N</FlowDiagramNode></FlowDiagram>`
        )
        expect(
          getByTestId('flow-diagram-node').querySelectorAll('[data-slot="flow-port"]').length
        ).toBe(0)
      })

      it('marks a terminal node and gives it no outgoing port', () => {
        const { getAllByTestId } = renderTree(`
        <FlowDiagram>
          <FlowDiagramNode>Source</FlowDiagramNode>
          <FlowDiagramParallel>
            <FlowDiagramNode>Chain</FlowDiagramNode>
            <FlowDiagramNode terminal>Leaf</FlowDiagramNode>
          </FlowDiagramParallel>
        </FlowDiagram>
      `)
        const [, chain, leaf] = getAllByTestId('flow-diagram-node')
        expect(leaf.getAttribute('data-flow-terminal')).toBe('true')
        expect(
          Array.from(leaf.querySelectorAll<HTMLElement>('[data-slot="flow-port"]')).map((p) =>
            p.getAttribute('data-side')
          )
        ).toEqual(['end'])
        expect(chain.querySelectorAll('[data-slot="flow-port"]').length).toBe(2)
        expect(chain.hasAttribute('data-flow-terminal')).toBe(false)
      })
    })

    describe('terminal branches — a leaf receives a connector but originates none', () => {
      // Source fans out to both branch entries but only the non-terminal branch
      // chains onward: 2 in + 1 out = 3 paths; with no terminal branch, 4.
      const tree = (terminal: boolean) => `
      <FlowDiagram>
        <FlowDiagramNode>Source</FlowDiagramNode>
        <FlowDiagramParallel>
          <FlowDiagramNode>Chain</FlowDiagramNode>
          <FlowDiagramNode ${terminal ? 'terminal' : ''}>Leaf</FlowDiagramNode>
        </FlowDiagramParallel>
        <FlowDiagramNode>Sink</FlowDiagramNode>
      </FlowDiagram>
    `

      it('draws no connector leaving a terminal branch', async () => {
        const { getByTestId } = renderTree(tree(true))
        const root = getByTestId('flow-diagram')
        await waitFor(() => {
          expect(root.querySelectorAll('svg path').length).toBeGreaterThan(0)
        })
        await waitFor(() => {
          expect(root.querySelectorAll('svg path').length).toBe(3)
        })
      })

      it('draws the outgoing connector when the same branch is not terminal', async () => {
        const { getByTestId } = renderTree(tree(false))
        const root = getByTestId('flow-diagram')
        await waitFor(() => {
          expect(root.querySelectorAll('svg path').length).toBe(4)
        })
      })

      it('draws nothing out of a terminal node that is a direct child', async () => {
        // Only Source -> Terminal is drawn; the sequence ends there, so 1 path.
        const { getByTestId } = renderTree(`
        <FlowDiagram>
          <FlowDiagramNode>Source</FlowDiagramNode>
          <FlowDiagramNode terminal>Terminal</FlowDiagramNode>
          <FlowDiagramNode>Sink</FlowDiagramNode>
        </FlowDiagram>
      `)
        const root = getByTestId('flow-diagram')
        await waitFor(() => {
          expect(root.querySelectorAll('svg path').length).toBe(1)
        })
      })
    })

    describe('Flow.Parallel — flow-diagram-parallel.vue align prop', () => {
      it('renders a list item with data-slot=flow-parallel holding its branches in a nested list, default align=start', () => {
        const { getByTestId } = renderTree(`
        <FlowDiagram>
          <FlowDiagramParallel>
            <FlowDiagramNode>A</FlowDiagramNode>
            <FlowDiagramNode>B</FlowDiagramNode>
          </FlowDiagramParallel>
        </FlowDiagram>
      `)
        const group = getByTestId('flow-diagram-parallel')
        expect(group.getAttribute('role')).toBe('listitem')
        expect(group.getAttribute('data-slot')).toBe('flow-diagram-parallel')
        expect(group.getAttribute('data-align')).toBe('start')
        const branches = getByTestId('flow-diagram-parallel__branches')
        expect(branches.parentElement).toBe(group)
        expect(branches.getAttribute('role')).toBe('list')
        expect(branches.querySelectorAll(':scope > [role="listitem"]').length).toBe(2)
      })

      it('reflects align=end onto data-align', () => {
        const { getByTestId } = renderTree(`
        <FlowDiagram>
          <FlowDiagramParallel align="end">
            <FlowDiagramNode>A</FlowDiagramNode>
          </FlowDiagramParallel>
        </FlowDiagram>
      `)
        expect(getByTestId('flow-diagram-parallel').getAttribute('data-align')).toBe('end')
      })
    })

    describe('Flow.Anchor side, FlowDiagram.Parallel default and live context', () => {
      it.each([['end'], ['start']])('maps side=%s to data-side and its port', (side) => {
        const { getByTestId } = renderTree(`
        <FlowDiagram>
          <FlowDiagramNode unstyled>
            <FlowDiagramAnchor side="${side}">x</FlowDiagramAnchor>
          </FlowDiagramNode>
        </FlowDiagram>
      `)
        const anchor = getByTestId('flow-diagram-anchor')
        expect(anchor.getAttribute('data-side')).toBe(side)
        expect(
          Array.from(anchor.querySelectorAll('[data-slot="flow-port"]')).map((port) =>
            port.getAttribute('data-side')
          )
        ).toEqual([side])
      })

      it('defaults FlowDiagram.Parallel align to start', () => {
        const { getByTestId } = renderTree(`
        <FlowDiagram>
          <FlowDiagramParallel><FlowDiagramNode>A</FlowDiagramNode><FlowDiagramNode>B</FlowDiagramNode></FlowDiagramParallel>
        </FlowDiagram>
      `)
        expect(getByTestId('flow-diagram-parallel').getAttribute('data-align')).toBe('start')
      })

      it('renames only the root when its data-testid changes', async () => {
        const testid = ref('pipeline')
        const view = render(
          defineComponent({
            setup: () => () =>
              h(FlowDiagram, { 'data-testid': testid.value }, () => [
                h(FlowDiagramNode, null, () => 'A'),
                h(FlowDiagramNode, null, () => 'B')
              ])
          })
        )
        expect(view.getByTestId('pipeline')).toBeTruthy()
        testid.value = 'release'
        await nextTick()
        expect(view.getByTestId('release')).toBeTruthy()
        expect(view.getAllByTestId('flow-diagram-node')).toHaveLength(2)
      })
    })

    describe('Flow.Anchor — flow-diagram-anchor.vue side prop', () => {
      it.each([['end'], ['start']])('maps side=%s to data-side=%s', (type) => {
        const { getByTestId } = renderTree(`
        <FlowDiagram>
          <FlowDiagramNode unstyled>
            <FlowDiagramAnchor side="${type}">x</FlowDiagramAnchor>
          </FlowDiagramNode>
        </FlowDiagram>
      `)
        expect(getByTestId('flow-diagram-anchor').getAttribute('data-side')).toBe(type)
      })

      it('ignores the retired type attribute: only side marks an edge', () => {
        const { getByTestId } = renderTree(`
        <FlowDiagram>
          <FlowDiagramNode unstyled>
            <FlowDiagramAnchor type="end">x</FlowDiagramAnchor>
          </FlowDiagramNode>
        </FlowDiagram>
      `)
        expect(getByTestId('flow-diagram-anchor').hasAttribute('data-side')).toBe(false)
      })

      it('marks an anchor with no side as "both"', () => {
        const { getByTestId } = renderTree(`
        <FlowDiagram>
          <FlowDiagramNode unstyled>
            <FlowDiagramAnchor>x</FlowDiagramAnchor>
          </FlowDiagramNode>
        </FlowDiagram>
      `)
        expect(getByTestId('flow-diagram-anchor').hasAttribute('data-side')).toBe(false)
      })

      it.each([
        ['end', ['end']],
        ['start', ['start']]
      ])('places a port only on the edge side=%s attaches to', (type, expected) => {
        const { getByTestId } = renderTree(`
        <FlowDiagram>
          <FlowDiagramNode unstyled>
            <FlowDiagramAnchor side="${type}">x</FlowDiagramAnchor>
          </FlowDiagramNode>
        </FlowDiagram>
      `)
        const ports = Array.from(
          getByTestId('flow-diagram-anchor').querySelectorAll<HTMLElement>(
            '[data-slot="flow-port"]'
          )
        )
        expect(ports.map((p) => p.getAttribute('data-side'))).toEqual(expected)
      })

      it('places ports on both edges when the anchor has no side', () => {
        const { getByTestId } = renderTree(`
        <FlowDiagram>
          <FlowDiagramNode unstyled>
            <FlowDiagramAnchor>x</FlowDiagramAnchor>
          </FlowDiagramNode>
        </FlowDiagram>
      `)
        const ports = Array.from(
          getByTestId('flow-diagram-anchor').querySelectorAll<HTMLElement>(
            '[data-slot="flow-port"]'
          )
        )
        expect(ports.map((p) => p.getAttribute('data-side'))).toEqual(['end', 'start'])
      })
    })

    describe('connectors — real layout drives the decorative SVG (browser mode)', () => {
      it('draws a connector path between two consecutive nodes and marks it aria-hidden', async () => {
        const { getByTestId } = renderTree(`
        <FlowDiagram>
          <FlowDiagramNode>Source</FlowDiagramNode>
          <FlowDiagramNode>Deliver</FlowDiagramNode>
        </FlowDiagram>
      `)
        const root = getByTestId('flow-diagram')
        // Connector layout is measured on mount via rAF + observers, so paths appear async.
        await waitFor(() => {
          expect(root.querySelectorAll('svg path').length).toBeGreaterThan(0)
        })
        const svg = root.querySelector('svg') as SVGElement
        expect(svg.getAttribute('aria-hidden')).toBe('true')
      })

      it('draws the same connectors when an ancestor scales the flow with a transform', async () => {
        const tree = (scale: number, testid: string) => `
        <div style="width: 600px; transform: scale(${scale}); transform-origin: top left">
          <FlowDiagram data-testid="${testid}">
            <FlowDiagramNode>Source</FlowDiagramNode>
            <FlowDiagramNode>Deliver</FlowDiagramNode>
          </FlowDiagram>
        </div>
      `
        const { getByTestId } = renderTree(
          `<div>${tree(1, 'flow-plain')}${tree(0.5, 'flow-scaled')}</div>`
        )
        const pathsOf = (testid: string) =>
          Array.from(getByTestId(testid).querySelectorAll('svg path')).map((path) =>
            path.getAttribute('d')
          )

        // Same path commands and coordinates within 0.1px: under a scale, engines
        // round the scaled layout to device pixels (Firefox lands 0.02px off).
        const numbersOf = (testid: string) =>
          pathsOf(testid).flatMap((d) => (d ?? '').match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [])
        const commandsOf = (testid: string) =>
          pathsOf(testid).map((d) => d?.replace(/[-\d.]+/g, '#'))

        await waitFor(() => {
          expect(pathsOf('flow-plain').length).toBeGreaterThan(0)
          expect(commandsOf('flow-scaled')).toEqual(commandsOf('flow-plain'))
          const plain = numbersOf('flow-plain')
          const scaled = numbersOf('flow-scaled')
          expect(scaled).toHaveLength(plain.length)
          scaled.forEach((value, index) =>
            expect(Math.abs(value - plain[index]!)).toBeLessThan(0.1)
          )
        })
      })

      it('renders no connector SVG when there is a single node (nothing to join)', async () => {
        const { getByTestId } = renderTree(
          `<FlowDiagram><FlowDiagramNode>Only</FlowDiagramNode></FlowDiagram>`
        )
        const root = getByTestId('flow-diagram')
        // Wait out the rAF-scheduled measure before asserting the svg stays absent.
        await new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve(undefined)))
        )
        expect(root.querySelector('svg')).toBeNull()
      })
    })

    describe('stories compose and render (grounded end-to-end usage)', () => {
      it('renders the Default sequential flow', () => {
        const { getByText, getAllByTestId } = render(Default)
        expect(getByText('Source')).toBeTruthy()
        expect(getByText('Deliver')).toBeTruthy()
        expect(getAllByTestId('flow-diagram-node').length).toBe(3)
      })

      it('renders the Parallel story with a parallel group between nodes', () => {
        const { getByTestId, getByText } = render(Parallel)
        expect(getByTestId('flow-diagram-parallel').getAttribute('role')).toBe('listitem')
        expect(getByText('Branch A')).toBeTruthy()
        expect(getByText('Branch C')).toBeTruthy()
      })

      it('renders the Branches story with leading and trailing parallel groups', () => {
        const { getAllByTestId } = render(Branches)
        expect(getAllByTestId('flow-diagram-parallel').length).toBe(2)
      })

      it('renders the AnchoredNode story exposing start/end anchors inside an unstyled node', () => {
        const { getAllByTestId } = render(AnchoredNode)
        const anchors = getAllByTestId('flow-diagram-anchor')
        const types = anchors.map((a) => a.getAttribute('data-side')).sort()
        expect(types).toEqual(['end', 'start'])
      })

      it('renders the Disabled story with the middle node marked disabled', () => {
        const { getAllByTestId } = render(Disabled)
        const disabled = getAllByTestId('flow-diagram-node').filter(
          (n) => n.getAttribute('data-flow-disabled') === 'true'
        )
        expect(disabled.length).toBe(1)
      })
    })

    describe('accessibility (axe on the composed tree)', () => {
      it('has no violations for a sequential flow of nodes', async () => {
        // role="list" with direct role="listitem" children satisfies aria-required-children.
        const { getByTestId } = renderTree(`
        <FlowDiagram>
          <FlowDiagramNode>Source</FlowDiagramNode>
          <FlowDiagramNode>Transform</FlowDiagramNode>
          <FlowDiagramNode>Deliver</FlowDiagramNode>
        </FlowDiagram>
      `)
        await expectNoA11yViolations(getByTestId('flow-diagram'))
      })

      it('has no violations for a flow with parallel branches', async () => {
        // A parallel step is a list item that owns its branches as a nested list.
        const { getByTestId } = renderTree(`
        <FlowDiagram>
          <FlowDiagramNode>Source</FlowDiagramNode>
          <FlowDiagramParallel>
            <FlowDiagramNode>Branch A</FlowDiagramNode>
            <FlowDiagramNode>Branch B</FlowDiagramNode>
          </FlowDiagramParallel>
          <FlowDiagramNode>Deliver</FlowDiagramNode>
        </FlowDiagram>
      `)
        await expectNoA11yViolations(getByTestId('flow-diagram'))
      })
    })

    describe('right-to-left', () => {
      it('draws connectors from the inline-end edge of a node to the inline-start edge of the next', async () => {
        const { getByTestId } = renderTree(`
        <div dir="rtl">
          <FlowDiagram>
            <FlowDiagramNode>Source</FlowDiagramNode>
            <FlowDiagramNode>Sink</FlowDiagramNode>
          </FlowDiagram>
        </div>
      `)
        const root = getByTestId('flow-diagram')
        const nodes = root.querySelectorAll<HTMLElement>('[data-slot="flow-diagram-node"]')
        await waitFor(() => {
          expect(root.querySelectorAll('svg path').length).toBe(1)
        })
        const d = root.querySelector('svg path')?.getAttribute('d') ?? ''
        const [fromX, toX] = [...d.matchAll(/[ML](-?[\d.]+),/g)].map((m) => Number(m[1]))
        const base = root.querySelector('svg')!.getBoundingClientRect().left
        const source = nodes[0]!.getBoundingClientRect()
        const sink = nodes[1]!.getBoundingClientRect()
        expect(source.left).toBeGreaterThan(sink.left)
        expect(Math.abs(fromX! - (source.left - base))).toBeLessThan(2)
        expect(Math.abs(toX! - (sink.right - base))).toBeLessThan(2)

        const port = nodes[0]!.querySelector<HTMLElement>(
          '[data-slot="flow-port"][data-side="start"]'
        )!
        expect(port.getBoundingClientRect().right).toBeLessThanOrEqual(source.left + 1)
      })
    })
  })
})
