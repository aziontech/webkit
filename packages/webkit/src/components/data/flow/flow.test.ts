import '../../../test/reflow.css'

import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import AnchoredNode from '../../../../examples/flow/anchored-node.vue'
import Branches from '../../../../examples/flow/branches.vue'
import Default from '../../../../examples/flow/default.vue'
import Disabled from '../../../../examples/flow/disabled.vue'
import Parallel from '../../../../examples/flow/parallel.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Flow, { FlowAnchor, FlowNode, FlowParallel } from './index'

// Vue's runtime string-template compiler cannot resolve member-expression tags
// like Flow.Node, so trees register the same component objects under flat
// PascalCase tags (the Flow.Node === FlowNode identity is asserted separately).
const renderTree = (template: string) =>
  render({
    components: { Flow, FlowNode, FlowParallel, FlowAnchor },
    template
  })

describe('Flow', () => {
  describe('composition compound', () => {
    describe('compound API — Object.assign attachment (index.ts)', () => {
      it('attaches every public sub-component to the root for dot-notation', () => {
        expect(Flow.Node).toBe(FlowNode)
        expect(Flow.Parallel).toBe(FlowParallel)
        expect(Flow.Anchor).toBe(FlowAnchor)
      })

      it('names the compound members from the anatomy (defineOptions.name)', () => {
        expect(Flow.name).toBe('Flow')
        expect(FlowNode.name).toBe('FlowNode')
        expect(FlowParallel.name).toBe('FlowParallel')
        expect(FlowAnchor.name).toBe('FlowAnchor')
      })
    })

    describe('root — flow.vue structure & align prop', () => {
      it('renders role=list with the default data-testid and an inner container defaulting align=start', () => {
        const { getByTestId, getByRole } = render(Flow)
        const root = getByTestId('data-flow')
        expect(root.tagName).toBe('DIV')
        expect(getByRole('list')).toBe(root)
        const inner = root.querySelector('[data-align]') as HTMLElement
        expect(inner.getAttribute('data-align')).toBe('start')
      })

      it('reflects the align prop onto the inner container', () => {
        const { getByTestId } = render(Flow, { props: { align: 'center' } })
        const inner = getByTestId('data-flow').querySelector('[data-align]') as HTMLElement
        expect(inner.getAttribute('data-align')).toBe('center')
      })

      it('honours a consumer-supplied data-testid on the root', () => {
        const { getByTestId } = render(Flow, { attrs: { 'data-testid': 'my-flow' } })
        expect(getByTestId('my-flow').getAttribute('role')).toBe('list')
      })
    })

    describe('provide/inject — sub-component testids derive from the root context', () => {
      it('derives node/parallel/anchor testids from the injected root testId (default)', () => {
        const { getAllByTestId } = renderTree(`
        <Flow>
          <FlowNode>Start</FlowNode>
          <FlowParallel>
            <FlowNode unstyled>
              <FlowAnchor side="end">A</FlowAnchor>
            </FlowNode>
          </FlowParallel>
        </Flow>
      `)
        // Derived ids are shared across instances, so there can be several node ids.
        expect(getAllByTestId('data-flow__node').length).toBeGreaterThan(0)
        expect(getAllByTestId('data-flow__parallel').length).toBe(1)
        expect(getAllByTestId('data-flow__anchor').length).toBe(1)
      })

      it('propagates a custom root testId through inject into every sub-component id', () => {
        const { getByTestId, getAllByTestId } = renderTree(`
        <Flow data-testid="pipeline">
          <FlowNode>Only</FlowNode>
          <FlowParallel><FlowNode>P</FlowNode></FlowParallel>
        </Flow>
      `)
        expect(getByTestId('pipeline')).toBeTruthy()
        expect(getAllByTestId('pipeline__node').length).toBe(2)
        expect(getByTestId('pipeline__parallel')).toBeTruthy()
      })

      it('falls back to "data-flow" prefix when a sub-component has no Flow ancestor (inject default)', () => {
        const { getByTestId } = render(FlowNode, { slots: { default: 'orphan' } })
        expect(getByTestId('data-flow__node')).toBeTruthy()
      })
    })

    describe('Flow.Node — flow-node.vue props & a11y', () => {
      it('renders role=listitem with data-slot=flow-node and is styled by default', () => {
        const { getByTestId } = renderTree(`<Flow><FlowNode>N</FlowNode></Flow>`)
        const node = getByTestId('data-flow__node')
        expect(node.getAttribute('role')).toBe('listitem')
        expect(node.getAttribute('data-slot')).toBe('flow-node')
        expect(node.hasAttribute('data-styled')).toBe(true)
      })

      it('drops the styled box when unstyled', () => {
        const { getByTestId } = renderTree(`<Flow><FlowNode unstyled>N</FlowNode></Flow>`)
        expect(getByTestId('data-flow__node').hasAttribute('data-styled')).toBe(false)
      })

      it('marks a disabled node with the connector/aria data attributes', () => {
        const { getByTestId } = renderTree(`<Flow><FlowNode disabled>N</FlowNode></Flow>`)
        const node = getByTestId('data-flow__node')
        expect(node.getAttribute('data-flow-disabled')).toBe('true')
        expect(node.hasAttribute('data-disabled')).toBe(true)
        expect(node.getAttribute('aria-disabled')).toBe('true')
      })

      it('omits the disabled attributes when enabled', () => {
        const { getByTestId } = renderTree(`<Flow><FlowNode>N</FlowNode></Flow>`)
        const node = getByTestId('data-flow__node')
        expect(node.hasAttribute('data-flow-disabled')).toBe(false)
        expect(node.hasAttribute('data-disabled')).toBe(false)
        expect(node.hasAttribute('aria-disabled')).toBe(false)
      })

      it('renders the default slot content', () => {
        const { getByText } = renderTree(`<Flow><FlowNode>Transform</FlowNode></Flow>`)
        expect(getByText('Transform')).toBeTruthy()
      })

      it('renders a connector port on each edge of a styled node, hidden from the a11y tree', () => {
        const { getByTestId } = renderTree(`<Flow><FlowNode>N</FlowNode></Flow>`)
        const node = getByTestId('data-flow__node')
        const ports = Array.from(node.querySelectorAll<HTMLElement>('[data-slot="flow-port"]'))
        expect(ports.map((p) => p.getAttribute('data-side'))).toEqual(['end', 'start'])
        expect(ports.every((p) => p.getAttribute('aria-hidden') === 'true')).toBe(true)
      })

      it('renders no ports on an unstyled node (its slot content owns the appearance)', () => {
        const { getByTestId } = renderTree(`<Flow><FlowNode unstyled>N</FlowNode></Flow>`)
        expect(
          getByTestId('data-flow__node').querySelectorAll('[data-slot="flow-port"]').length
        ).toBe(0)
      })

      it('marks a terminal node and gives it no outgoing port', () => {
        const { getAllByTestId } = renderTree(`
        <Flow>
          <FlowNode>Source</FlowNode>
          <FlowParallel>
            <FlowNode>Chain</FlowNode>
            <FlowNode terminal>Leaf</FlowNode>
          </FlowParallel>
        </Flow>
      `)
        const [, chain, leaf] = getAllByTestId('data-flow__node')
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
      <Flow>
        <FlowNode>Source</FlowNode>
        <FlowParallel>
          <FlowNode>Chain</FlowNode>
          <FlowNode ${terminal ? 'terminal' : ''}>Leaf</FlowNode>
        </FlowParallel>
        <FlowNode>Sink</FlowNode>
      </Flow>
    `

      it('draws no connector leaving a terminal branch', async () => {
        const { getByTestId } = renderTree(tree(true))
        const root = getByTestId('data-flow')
        await waitFor(() => {
          expect(root.querySelectorAll('svg path').length).toBeGreaterThan(0)
        })
        await waitFor(() => {
          expect(root.querySelectorAll('svg path').length).toBe(3)
        })
      })

      it('draws the outgoing connector when the same branch is not terminal', async () => {
        const { getByTestId } = renderTree(tree(false))
        const root = getByTestId('data-flow')
        await waitFor(() => {
          expect(root.querySelectorAll('svg path').length).toBe(4)
        })
      })

      it('draws nothing out of a terminal node that is a direct child', async () => {
        // Only Source -> Terminal is drawn; the sequence ends there, so 1 path.
        const { getByTestId } = renderTree(`
        <Flow>
          <FlowNode>Source</FlowNode>
          <FlowNode terminal>Terminal</FlowNode>
          <FlowNode>Sink</FlowNode>
        </Flow>
      `)
        const root = getByTestId('data-flow')
        await waitFor(() => {
          expect(root.querySelectorAll('svg path').length).toBe(1)
        })
      })
    })

    describe('Flow.Parallel — flow-parallel.vue align prop', () => {
      it('renders a list item with data-slot=flow-parallel holding its branches in a nested list, default align=start', () => {
        const { getByTestId } = renderTree(`
        <Flow>
          <FlowParallel>
            <FlowNode>A</FlowNode>
            <FlowNode>B</FlowNode>
          </FlowParallel>
        </Flow>
      `)
        const group = getByTestId('data-flow__parallel')
        expect(group.getAttribute('role')).toBe('listitem')
        expect(group.getAttribute('data-slot')).toBe('flow-parallel')
        expect(group.getAttribute('data-align')).toBe('start')
        const branches = getByTestId('data-flow__parallel__branches')
        expect(branches.parentElement).toBe(group)
        expect(branches.getAttribute('role')).toBe('list')
        expect(branches.querySelectorAll(':scope > [role="listitem"]').length).toBe(2)
      })

      it('reflects align=end onto data-align', () => {
        const { getByTestId } = renderTree(`
        <Flow>
          <FlowParallel align="end">
            <FlowNode>A</FlowNode>
          </FlowParallel>
        </Flow>
      `)
        expect(getByTestId('data-flow__parallel').getAttribute('data-align')).toBe('end')
      })
    })

    describe('Flow.Anchor side, Flow.Parallel default and live context', () => {
      it.each([['end'], ['start']])('maps side=%s to data-side and its port', (side) => {
        const { getByTestId } = renderTree(`
        <Flow>
          <FlowNode unstyled>
            <FlowAnchor side="${side}">x</FlowAnchor>
          </FlowNode>
        </Flow>
      `)
        const anchor = getByTestId('data-flow__anchor')
        expect(anchor.getAttribute('data-side')).toBe(side)
        expect(
          Array.from(anchor.querySelectorAll('[data-slot="flow-port"]')).map((port) =>
            port.getAttribute('data-side')
          )
        ).toEqual([side])
      })

      it('defaults Flow.Parallel align to start', () => {
        const { getByTestId } = renderTree(`
        <Flow>
          <FlowParallel><FlowNode>A</FlowNode><FlowNode>B</FlowNode></FlowParallel>
        </Flow>
      `)
        expect(getByTestId('data-flow__parallel').getAttribute('data-align')).toBe('start')
      })

      it('passes a changed root data-testid on to the children', async () => {
        const testid = ref('pipeline')
        const view = render(
          defineComponent({
            setup: () => () =>
              h(Flow, { 'data-testid': testid.value }, () => [
                h(FlowNode, null, () => 'A'),
                h(FlowNode, null, () => 'B')
              ])
          })
        )
        expect(view.getAllByTestId('pipeline__node')).toHaveLength(2)
        testid.value = 'release'
        await nextTick()
        expect(view.getAllByTestId('release__node')).toHaveLength(2)
      })
    })

    describe('Flow.Anchor — flow-anchor.vue side prop', () => {
      it.each([['end'], ['start']])('maps side=%s to data-side=%s', (type) => {
        const { getByTestId } = renderTree(`
        <Flow>
          <FlowNode unstyled>
            <FlowAnchor side="${type}">x</FlowAnchor>
          </FlowNode>
        </Flow>
      `)
        expect(getByTestId('data-flow__anchor').getAttribute('data-side')).toBe(type)
      })

      it('ignores the retired type attribute: only side marks an edge', () => {
        const { getByTestId } = renderTree(`
        <Flow>
          <FlowNode unstyled>
            <FlowAnchor type="end">x</FlowAnchor>
          </FlowNode>
        </Flow>
      `)
        expect(getByTestId('data-flow__anchor').hasAttribute('data-side')).toBe(false)
      })

      it('marks an anchor with no side as "both"', () => {
        const { getByTestId } = renderTree(`
        <Flow>
          <FlowNode unstyled>
            <FlowAnchor>x</FlowAnchor>
          </FlowNode>
        </Flow>
      `)
        expect(getByTestId('data-flow__anchor').hasAttribute('data-side')).toBe(false)
      })

      it.each([
        ['end', ['end']],
        ['start', ['start']]
      ])('places a port only on the edge side=%s attaches to', (type, expected) => {
        const { getByTestId } = renderTree(`
        <Flow>
          <FlowNode unstyled>
            <FlowAnchor side="${type}">x</FlowAnchor>
          </FlowNode>
        </Flow>
      `)
        const ports = Array.from(
          getByTestId('data-flow__anchor').querySelectorAll<HTMLElement>('[data-slot="flow-port"]')
        )
        expect(ports.map((p) => p.getAttribute('data-side'))).toEqual(expected)
      })

      it('places ports on both edges when the anchor has no side', () => {
        const { getByTestId } = renderTree(`
        <Flow>
          <FlowNode unstyled>
            <FlowAnchor>x</FlowAnchor>
          </FlowNode>
        </Flow>
      `)
        const ports = Array.from(
          getByTestId('data-flow__anchor').querySelectorAll<HTMLElement>('[data-slot="flow-port"]')
        )
        expect(ports.map((p) => p.getAttribute('data-side'))).toEqual(['end', 'start'])
      })
    })

    describe('connectors — real layout drives the decorative SVG (browser mode)', () => {
      it('draws a connector path between two consecutive nodes and marks it aria-hidden', async () => {
        const { getByTestId } = renderTree(`
        <Flow>
          <FlowNode>Source</FlowNode>
          <FlowNode>Deliver</FlowNode>
        </Flow>
      `)
        const root = getByTestId('data-flow')
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
          <Flow data-testid="${testid}">
            <FlowNode>Source</FlowNode>
            <FlowNode>Deliver</FlowNode>
          </Flow>
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
        const { getByTestId } = renderTree(`<Flow><FlowNode>Only</FlowNode></Flow>`)
        const root = getByTestId('data-flow')
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
        expect(getAllByTestId('data-flow__node').length).toBe(3)
      })

      it('renders the Parallel story with a parallel group between nodes', () => {
        const { getByTestId, getByText } = render(Parallel)
        expect(getByTestId('data-flow__parallel').getAttribute('role')).toBe('listitem')
        expect(getByText('Branch A')).toBeTruthy()
        expect(getByText('Branch C')).toBeTruthy()
      })

      it('renders the Branches story with leading and trailing parallel groups', () => {
        const { getAllByTestId } = render(Branches)
        expect(getAllByTestId('data-flow__parallel').length).toBe(2)
      })

      it('renders the AnchoredNode story exposing start/end anchors inside an unstyled node', () => {
        const { getAllByTestId } = render(AnchoredNode)
        const anchors = getAllByTestId('data-flow__anchor')
        const types = anchors.map((a) => a.getAttribute('data-side')).sort()
        expect(types).toEqual(['end', 'start'])
      })

      it('renders the Disabled story with the middle node marked disabled', () => {
        const { getAllByTestId } = render(Disabled)
        const disabled = getAllByTestId('data-flow__node').filter(
          (n) => n.getAttribute('data-flow-disabled') === 'true'
        )
        expect(disabled.length).toBe(1)
      })
    })

    describe('accessibility (axe on the composed tree)', () => {
      it('has no violations for a sequential flow of nodes', async () => {
        // role="list" with direct role="listitem" children satisfies aria-required-children.
        const { getByTestId } = renderTree(`
        <Flow>
          <FlowNode>Source</FlowNode>
          <FlowNode>Transform</FlowNode>
          <FlowNode>Deliver</FlowNode>
        </Flow>
      `)
        await expectNoA11yViolations(getByTestId('data-flow'))
      })

      it('has no violations for a flow with parallel branches', async () => {
        // A parallel step is a list item that owns its branches as a nested list.
        const { getByTestId } = renderTree(`
        <Flow>
          <FlowNode>Source</FlowNode>
          <FlowParallel>
            <FlowNode>Branch A</FlowNode>
            <FlowNode>Branch B</FlowNode>
          </FlowParallel>
          <FlowNode>Deliver</FlowNode>
        </Flow>
      `)
        await expectNoA11yViolations(getByTestId('data-flow'))
      })
    })

    describe('right-to-left', () => {
      it('draws connectors from the inline-end edge of a node to the inline-start edge of the next', async () => {
        const { getByTestId } = renderTree(`
        <div dir="rtl">
          <Flow>
            <FlowNode>Source</FlowNode>
            <FlowNode>Sink</FlowNode>
          </Flow>
        </div>
      `)
        const root = getByTestId('data-flow')
        const nodes = root.querySelectorAll<HTMLElement>('[data-slot="flow-node"]')
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
