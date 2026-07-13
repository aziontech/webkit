import { composeStories } from '@storybook/vue3'
import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/data/flow/Flow.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Flow, { FlowAnchor, FlowNode, FlowParallel } from './index'

const { Default, Parallel, Branches, AnchoredNode, Disabled } = composeStories(stories)

// A realistic composed tree rendered through a wrapper SFC.
//
// Vue's *runtime* string-template compiler (used by inline `template:`) does not resolve
// member-expression tags like `<Flow.Node>` — it lowercases them to a native `<flow.node>`.
// So the tree is composed from the *same* component objects the compound exposes (the
// `Flow.Node === FlowNode` identity is proven separately in the compound-API block) but
// registered under flat PascalCase tags the runtime compiler resolves. The DOM produced is
// identical to the SFC dot-notation form.
const renderTree = (template: string) =>
  render({
    components: { Flow, FlowNode, FlowParallel, FlowAnchor },
    template
  })

describe('Flow (composition compound)', () => {
  describe('compound API — Object.assign attachment (index.ts)', () => {
    it('attaches every public sub-component to the root for dot-notation', () => {
      // index.ts: Object.assign(Flow, { Node, Parallel, Anchor }).
      // The dot-notation members ARE the standalone sub-component exports.
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
      // Inner measuring container carries data-align; default prop is 'start'.
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
      // injection-key FlowContext.testId = root testId; sub-components append __node / __parallel / __anchor.
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
      // Context.testId is captured from the root's data-testid at provide time and inherited by the parts.
      expect(getByTestId('pipeline')).toBeTruthy()
      expect(getAllByTestId('pipeline__node').length).toBe(2)
      expect(getByTestId('pipeline__parallel')).toBeTruthy()
    })

    it('falls back to "data-flow" prefix when a sub-component has no Flow ancestor (inject default)', () => {
      // inject(FlowInjectionKey) is undefined here; the `ctx?.testId ?? 'data-flow'` fallback applies.
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
      // Default (not unstyled) => data-styled present (empty string).
      expect(node.hasAttribute('data-styled')).toBe(true)
    })

    it('drops the styled box when unstyled', () => {
      const { getByTestId } = renderTree(`<Flow><FlowNode unstyled>N</FlowNode></Flow>`)
      // unstyled => :data-styled="null" => attribute absent.
      expect(getByTestId('data-flow__node').hasAttribute('data-styled')).toBe(false)
    })

    it('marks a disabled node with the connector/aria data attributes', () => {
      const { getByTestId } = renderTree(`<Flow><FlowNode disabled>N</FlowNode></Flow>`)
      const node = getByTestId('data-flow__node')
      // Template: :data-flow-disabled="disabled ? 'true' : null", :data-disabled, :aria-disabled.
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
      // align ?? 'start'
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
      // props.type ?? 'both'
      expect(getByTestId('data-flow__anchor').getAttribute('data-flow-anchor')).toBe('both')
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
      // useFlowConnectors measures via getBoundingClientRect on mount + observers;
      // in a real browser the two nodes have width, so >=1 path is produced.
      await waitFor(() => {
        expect(root.querySelectorAll('svg path').length).toBeGreaterThan(0)
      })
      const svg = root.querySelector('svg') as SVGElement
      // The connector layer is decorative — hidden from the a11y tree.
      expect(svg.getAttribute('aria-hidden')).toBe('true')
    })

    it('renders no connector SVG when there is a single node (nothing to join)', async () => {
      const { getByTestId } = renderTree(`<Flow><FlowNode>Only</FlowNode></Flow>`)
      const root = getByTestId('data-flow')
      // v-if="paths.length" — one child produces no pairs, so no <svg>.
      // Give the RAF-scheduled measure a chance to run, then confirm it stays empty.
      await new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve(undefined)))
      )
      expect(root.querySelector('svg')).toBeNull()
    })
  })

  describe('stories compose and render (grounded end-to-end usage)', () => {
    it('renders the Default sequential flow', () => {
      const { getByText, getAllByTestId } = render(Default())
      expect(getByText('Source')).toBeTruthy()
      expect(getByText('Deliver')).toBeTruthy()
      // Three FlowNode roots -> three derived node testids.
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
      // Two Flow.Parallel groups in the template.
      expect(getAllByTestId('data-flow__parallel').length).toBe(2)
    })

    it('renders the AnchoredNode story exposing start/end anchors inside an unstyled node', () => {
      const { getAllByTestId } = render(AnchoredNode())
      const anchors = getAllByTestId('data-flow__anchor')
      const types = anchors.map((a) => a.getAttribute('data-flow-anchor')).sort()
      expect(types).toEqual(['end', 'start'])
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
  })
})
