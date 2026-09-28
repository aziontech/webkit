import { userEvent } from '@storybook/test'
import { composeStories } from '@storybook/vue3'
import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/data/flow/Flow.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Flow, { FlowAnchor, FlowNode, FlowNodeCard, FlowParallel } from './index'

const { Default, Parallel, Branches, AnchoredNode, Disabled, NodeCards } = composeStories(stories)

// Vue's runtime string-template compiler cannot resolve member-expression tags
// like Flow.Node, so trees register the same component objects under flat
// PascalCase tags (the Flow.Node === FlowNode identity is asserted separately).
const renderTree = (template: string) =>
  render({
    components: { Flow, FlowNode, FlowNodeCard, FlowParallel, FlowAnchor },
    template
  })

describe('Flow (composition compound)', () => {
  describe('compound API — Object.assign attachment (index.ts)', () => {
    it('attaches every public sub-component to the root for dot-notation', () => {
      expect(Flow.Node).toBe(FlowNode)
      expect(Flow.NodeCard).toBe(FlowNodeCard)
      expect(Flow.Parallel).toBe(FlowParallel)
      expect(Flow.Anchor).toBe(FlowAnchor)
    })

    it('names the compound members from the anatomy (defineOptions.name)', () => {
      expect(Flow.name).toBe('Flow')
      expect(FlowNode.name).toBe('FlowNode')
      expect(FlowNodeCard.name).toBe('FlowNodeCard')
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
              <FlowAnchor type="end">A</FlowAnchor>
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
    it('renders role=listitem with data-flow-kind=node and is styled by default', () => {
      const { getByTestId } = renderTree(`<Flow><FlowNode>N</FlowNode></Flow>`)
      const node = getByTestId('data-flow__node')
      expect(node.getAttribute('role')).toBe('listitem')
      expect(node.getAttribute('data-flow-kind')).toBe('node')
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
      const ports = Array.from(node.querySelectorAll<HTMLElement>('[data-flow-port]'))
      expect(ports.map((p) => p.getAttribute('data-flow-port'))).toEqual(['end', 'start'])
      expect(ports.every((p) => p.getAttribute('aria-hidden') === 'true')).toBe(true)
    })

    it('renders no ports on an unstyled node (its slot content owns the appearance)', () => {
      const { getByTestId } = renderTree(`<Flow><FlowNode unstyled>N</FlowNode></Flow>`)
      expect(getByTestId('data-flow__node').querySelectorAll('[data-flow-port]').length).toBe(0)
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
        Array.from(leaf.querySelectorAll<HTMLElement>('[data-flow-port]')).map((p) =>
          p.getAttribute('data-flow-port')
        )
      ).toEqual(['end'])
      expect(chain.querySelectorAll('[data-flow-port]').length).toBe(2)
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
        expect(root.querySelectorAll('svg path[stroke-dasharray]').length).toBeGreaterThan(0)
      })
      await waitFor(() => {
        expect(root.querySelectorAll('svg path[stroke-dasharray]').length).toBe(3)
      })
    })

    it('pairs every connector with a travelling request layer', async () => {
      const { getByTestId } = renderTree(`
        <Flow>
          <FlowNode>Source</FlowNode>
          <FlowNode>Deliver</FlowNode>
        </Flow>
      `)
      const root = getByTestId('data-flow')
      await waitFor(() => {
        expect(root.querySelectorAll('svg path[stroke-dasharray]').length).toBe(1)
      })
      // Scoped past <defs>: the reveal mask draws each connector with a path of its own,
      // which also carries pathLength, and only the painted layer is the packet.
      const packets = root.querySelectorAll('svg > g > path[pathLength]')
      expect(packets.length).toBe(1)
      // pathLength must reach the DOM as the camelCase attribute: the keyframe offsets are
      // percentages, and a kebab spelling is ignored so the dash units fall back to user units.
      expect(packets[0].getAttribute('pathLength')).toBe('100')
      expect(packets[0].getAttribute('stroke-linecap')).toBe('butt')
      expect(packets[0].getAttribute('class')).toContain('animate-flow-packet')
      expect(packets[0].getAttribute('class')).toContain('motion-reduce:animate-none')
    })

    it('reveals every connector through one mask that draws along the path', async () => {
      const { getByTestId } = renderTree(`
        <Flow>
          <FlowNode>Source</FlowNode>
          <FlowNode>Deliver</FlowNode>
          <FlowNode>Store</FlowNode>
        </Flow>
      `)
      const root = getByTestId('data-flow')
      await waitFor(() => {
        expect(root.querySelectorAll('svg path[stroke-dasharray]').length).toBe(2)
      })
      const mask = root.querySelector('svg defs mask') as SVGElement
      // userSpaceOnUse is load-bearing: the default region is the bounding box of what is
      // masked, and a straight connector's box is zero-height, which masks the line away.
      expect(mask.getAttribute('maskUnits')).toBe('userSpaceOnUse')
      const reveals = mask.querySelectorAll('path')
      expect(reveals.length).toBe(2)
      expect(reveals[0].getAttribute('class')).toContain('animate-flow-connector-draw')
      expect(reveals[0].getAttribute('class')).toContain('motion-reduce:animate-none')
      // Each connector draws half a step after the node it leaves, so the diagram
      // assembles node, line, node, line instead of arriving as one slab.
      expect(reveals[0].getAttribute('style')).toContain('0.5')
      expect(reveals[1].getAttribute('style')).toContain('1.5')
      const group = root.querySelector('svg > g') as SVGElement
      expect(group.getAttribute('mask')).toBe(`url(#${mask.getAttribute('id')})`)
    })

    it('draws the outgoing connector when the same branch is not terminal', async () => {
      const { getByTestId } = renderTree(tree(false))
      const root = getByTestId('data-flow')
      await waitFor(() => {
        expect(root.querySelectorAll('svg path[stroke-dasharray]').length).toBe(4)
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
        expect(root.querySelectorAll('svg path[stroke-dasharray]').length).toBe(1)
      })
    })
  })

  describe('Flow.Parallel — flow-parallel.vue align prop', () => {
    it('renders role=group with data-flow-kind=parallel and default align=start', () => {
      const { getByTestId } = renderTree(`
        <Flow>
          <FlowParallel>
            <FlowNode>A</FlowNode>
            <FlowNode>B</FlowNode>
          </FlowParallel>
        </Flow>
      `)
      const group = getByTestId('data-flow__parallel')
      expect(group.getAttribute('role')).toBe('group')
      expect(group.getAttribute('data-flow-kind')).toBe('parallel')
      expect(group.getAttribute('data-align')).toBe('start')
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

  describe('Flow.Anchor — flow-anchor.vue type prop', () => {
    it.each([['end'], ['start']])('maps type=%s to data-flow-anchor=%s', (type) => {
      const { getByTestId } = renderTree(`
        <Flow>
          <FlowNode unstyled>
            <FlowAnchor type="${type}">x</FlowAnchor>
          </FlowNode>
        </Flow>
      `)
      expect(getByTestId('data-flow__anchor').getAttribute('data-flow-anchor')).toBe(type)
    })

    it('marks an anchor with no type as "both"', () => {
      const { getByTestId } = renderTree(`
        <Flow>
          <FlowNode unstyled>
            <FlowAnchor>x</FlowAnchor>
          </FlowNode>
        </Flow>
      `)
      expect(getByTestId('data-flow__anchor').getAttribute('data-flow-anchor')).toBe('both')
    })

    it.each([
      ['end', ['end']],
      ['start', ['start']]
    ])('places a port only on the edge type=%s attaches to', (type, expected) => {
      const { getByTestId } = renderTree(`
        <Flow>
          <FlowNode unstyled>
            <FlowAnchor type="${type}">x</FlowAnchor>
          </FlowNode>
        </Flow>
      `)
      const ports = Array.from(
        getByTestId('data-flow__anchor').querySelectorAll<HTMLElement>('[data-flow-port]')
      )
      expect(ports.map((p) => p.getAttribute('data-flow-port'))).toEqual(expected)
    })

    it('places ports on both edges when the anchor has no type', () => {
      const { getByTestId } = renderTree(`
        <Flow>
          <FlowNode unstyled>
            <FlowAnchor>x</FlowAnchor>
          </FlowNode>
        </Flow>
      `)
      const ports = Array.from(
        getByTestId('data-flow__anchor').querySelectorAll<HTMLElement>('[data-flow-port]')
      )
      expect(ports.map((p) => p.getAttribute('data-flow-port'))).toEqual(['end', 'start'])
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
        expect(root.querySelectorAll('svg path[stroke-dasharray]').length).toBeGreaterThan(0)
      })
      const svg = root.querySelector('svg') as SVGElement
      expect(svg.getAttribute('aria-hidden')).toBe('true')
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

  describe('Flow.NodeCard — flow-node-card.vue anatomy, disclosure & a11y', () => {
    it('is a node in its own right, with the derived testid and its own anchor', () => {
      const { getByTestId } = renderTree(
        `<Flow><FlowNodeCard eyebrow="Workload" title="shop-prod" /></Flow>`
      )
      const card = getByTestId('data-flow__node-card')
      expect(card.getAttribute('role')).toBe('listitem')
      expect(card.getAttribute('data-flow-kind')).toBe('node')
      expect(card.querySelector('[data-flow-anchor="both"]')).toBeTruthy()
    })

    it('honours a consumer-supplied data-testid', () => {
      const { getByTestId } = renderTree(
        `<Flow><FlowNodeCard data-testid="my-card" title="shop-prod" /></Flow>`
      )
      expect(getByTestId('my-card').getAttribute('data-flow-kind')).toBe('node')
    })

    it('renders the eyebrow, the icon, the identity name and the state tag', () => {
      const { getByText, getByTestId } = renderTree(
        `<Flow><FlowNodeCard eyebrow="Workload" icon="ai ai-workloads" title="shop-prod" label="Live" severity="success" /></Flow>`
      )
      expect(getByText('Workload')).toBeTruthy()
      expect(getByText('shop-prod')).toBeTruthy()
      expect(getByText('Live')).toBeTruthy()
      expect(getByTestId('data-flow__node-card').querySelector('i.ai-workloads')).toBeTruthy()
    })

    it('falls back to an em dash when the card names no resource', () => {
      const { getByText } = renderTree(`<Flow><FlowNodeCard eyebrow="Firewall" /></Flow>`)
      expect(getByText('—')).toBeTruthy()
    })

    it('renders no header button and no body when it is not collapsible', () => {
      const { getByTestId, queryByRole } = renderTree(
        `<Flow><FlowNodeCard eyebrow="Workload" title="shop-prod" /></Flow>`
      )
      expect(queryByRole('button')).toBeNull()
      expect(getByTestId('data-flow__node-card').querySelector('[role="region"]')).toBeNull()
    })

    it('mirrors dashed, disabled and terminal onto the connector/aria attributes', () => {
      const { getByTestId } = renderTree(
        `<Flow><FlowNodeCard data-testid="c" dashed disabled terminal eyebrow="Firewall" /></Flow>`
      )
      const card = getByTestId('c')
      expect(card.getAttribute('data-dashed')).toBe('true')
      expect(card.getAttribute('data-disabled')).toBe('true')
      expect(card.getAttribute('data-flow-disabled')).toBe('true')
      expect(card.getAttribute('data-flow-terminal')).toBe('true')
      expect(card.getAttribute('aria-disabled')).toBe('true')
    })

    it('opens and closes on the header trigger, driving aria-expanded and the body inert', async () => {
      const { getByRole, getByTestId } = renderTree(`
        <Flow>
          <FlowNodeCard data-testid="c" collapsible eyebrow="Workload" title="shop-prod">
            <span>shop.example.com</span>
          </FlowNodeCard>
        </Flow>
      `)
      const card = getByTestId('c')
      const trigger = getByRole('button')
      const body = card.querySelector('[role="region"]') as HTMLElement

      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      expect(trigger.getAttribute('aria-controls')).toBe(body.id)
      expect(body.hasAttribute('inert')).toBe(true)
      expect(card.getAttribute('data-state')).toBe('closed')

      await userEvent.click(trigger)
      await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'))
      expect(card.getAttribute('data-state')).toBe('open')
      expect(body.hasAttribute('inert')).toBe(false)

      await userEvent.click(trigger)
      await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('false'))
      expect(body.hasAttribute('inert')).toBe(true)
    })

    it('leaves a collapsible card with no fields without a disclosure to operate', () => {
      const { queryByRole } = renderTree(
        `<Flow><FlowNodeCard collapsible eyebrow="Firewall" label="Not bound" /></Flow>`
      )
      expect(queryByRole('button')).toBeNull()
    })

    it('reaches the trigger by keyboard and toggles on Enter', async () => {
      const { getByRole } = renderTree(`
        <Flow>
          <FlowNodeCard collapsible eyebrow="Workload" title="shop-prod"><span>field</span></FlowNodeCard>
        </Flow>
      `)
      const trigger = getByRole('button')
      await userEvent.tab()
      expect(document.activeElement).toBe(trigger)
      await userEvent.keyboard('{Enter}')
      await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'))
    })

    it('starts open when the consumer seeds the open model', () => {
      const { getByRole } = render(FlowNodeCard, {
        props: { collapsible: true, open: true, eyebrow: 'Workload' },
        slots: { default: '<span>field</span>' }
      })
      expect(getByRole('button').getAttribute('aria-expanded')).toBe('true')
    })

    it('lets the title, status and actions slots replace what the props render', () => {
      const { getByText, queryByText } = renderTree(`
        <Flow>
          <FlowNodeCard eyebrow="Workload" title="shop-prod" label="Live">
            <template #title><a href="#shop">Open shop-prod</a></template>
            <template #status><span>Rolling out</span></template>
            <template #actions><button type="button">Rebind</button></template>
          </FlowNodeCard>
        </Flow>
      `)
      expect(getByText('Open shop-prod')).toBeTruthy()
      expect(getByText('Rolling out')).toBeTruthy()
      expect(getByText('Rebind')).toBeTruthy()
      expect(queryByText('Live')).toBeNull()
      expect(queryByText('shop-prod')).toBeNull()
    })

    it('draws a connector between two card nodes', async () => {
      const { getByTestId } = renderTree(`
        <Flow>
          <FlowNodeCard eyebrow="Workload" title="shop-prod" />
          <FlowNodeCard eyebrow="Application" title="storefront" />
        </Flow>
      `)
      const root = getByTestId('data-flow')
      await waitFor(() =>
        expect(root.querySelectorAll('svg path[stroke-dasharray]').length).toBe(1)
      )
    })
  })

  describe('stories compose and render (grounded end-to-end usage)', () => {
    it('renders the Default sequential flow', () => {
      const { getByText, getAllByTestId } = render(Default())
      expect(getByText('Source')).toBeTruthy()
      expect(getByText('Deliver')).toBeTruthy()
      expect(getAllByTestId('data-flow__node').length).toBe(3)
    })

    it('renders the Parallel story with a parallel group between nodes', () => {
      const { getByTestId, getByText } = render(Parallel())
      expect(getByTestId('data-flow__parallel').getAttribute('role')).toBe('group')
      expect(getByText('Branch A')).toBeTruthy()
      expect(getByText('Branch C')).toBeTruthy()
    })

    it('renders the Branches story with leading and trailing parallel groups', () => {
      const { getAllByTestId } = render(Branches())
      expect(getAllByTestId('data-flow__parallel').length).toBe(2)
    })

    it('renders the AnchoredNode story exposing start/end anchors inside an unstyled node', () => {
      const { getAllByTestId } = render(AnchoredNode())
      const anchors = getAllByTestId('data-flow__anchor')
      const types = anchors.map((a) => a.getAttribute('data-flow-anchor')).sort()
      expect(types).toEqual(['end', 'start'])
    })

    it('renders the NodeCards story as a topology of card nodes', () => {
      const { getAllByTestId, getByText } = render(NodeCards())
      expect(getAllByTestId('data-flow__node-card').length).toBe(4)
      expect(getByText('shop-prod')).toBeTruthy()
      expect(getByText('Not bound')).toBeTruthy()
    })

    it('renders the Disabled story with the middle node marked disabled', () => {
      const { getAllByTestId } = render(Disabled())
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

    it('has no violations for a topology of card nodes, open and closed', async () => {
      const { getByTestId } = renderTree(`
        <Flow>
          <FlowNodeCard collapsible open eyebrow="Workload" title="shop-prod" label="Live" severity="success">
            <span>shop.example.com</span>
          </FlowNodeCard>
          <FlowNodeCard collapsible eyebrow="Application" title="storefront" label="Active" severity="success">
            <span>Azion Runtime</span>
          </FlowNodeCard>
          <FlowNodeCard dashed terminal eyebrow="Firewall" label="Not bound" />
        </Flow>
      `)
      await expectNoA11yViolations(getByTestId('data-flow'))
    })
  })
})
