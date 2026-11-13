import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'

import Default from '../../../../examples/diagram/default.vue'
import Flow from '../../../../examples/diagram/flow.vue'
import Groups from '../../../../examples/diagram/groups.vue'
import NodeKinds from '../../../../examples/diagram/node-kinds.vue'
import Spec from '../../../../examples/diagram/spec.vue'
import { diagrams } from '../../../assets/diagrams/registry'
import { expectNoA11yViolations } from '../../../test/axe'
import Diagram, { type DiagramName } from './diagram.vue'
import DiagramLayout from './diagram-layout/diagram-layout.vue'
import DiagramNode from './diagram-node/diagram-node.vue'
import type { DiagramSpec } from './types'

const NAMES = Object.keys(diagrams) as DiagramName[]

const TESTID = 'marketing-diagram'

const spec: DiagramSpec = {
  nodes: [
    { key: 'user', kind: 'pill', title: 'User', icon: 'pi pi-user', active: true },
    { key: 'workload', kind: 'card', eyebrow: 'Workload', title: 'shop.example.com', lit: true },
    { key: 'cache', kind: 'item', eyebrow: 'Cache', title: 'Served from cache' },
    { key: 'origin', kind: 'item', eyebrow: 'Origin', title: 'origin.example.com' }
  ],
  layout: {
    gap: 'wide',
    row: [
      { node: 'user' },
      { node: 'workload' },
      { branches: [{ node: 'cache' }, { node: 'origin' }] }
    ]
  },
  edges: [
    { from: 'user', to: 'workload', active: true },
    { from: 'workload', to: 'cache', label: 'hit', active: true },
    { from: 'workload', to: 'origin', label: 'miss' }
  ]
}

const ready = async (container: Element) => {
  const canvas = () => container.querySelector(`[data-testid="${TESTID}__canvas"]`)
  await waitFor(() => expect(canvas()).toHaveAttribute('data-ready'))
  return canvas() as HTMLElement
}

describe('Diagram', () => {
  describe('rendering & testid', () => {
    it('renders a figure under the default testid', () => {
      const { getByTestId } = render(Diagram, { props: { spec } })

      expect(getByTestId(TESTID).tagName).toBe('FIGURE')
    })

    it('honors a consumer-supplied data-testid', () => {
      const { getByTestId } = render(Diagram, {
        props: { spec },
        attrs: { 'data-testid': 'custom-diagram' }
      })

      expect(getByTestId('custom-diagram')).toBeInTheDocument()
    })

    it('draws one element per node, keyed by the node key', () => {
      const { container } = render(Diagram, { props: { spec } })

      const keys = [...container.querySelectorAll('[data-diagram-node]')].map((node) =>
        node.getAttribute('data-diagram-node')
      )
      expect(keys).toEqual(['user', 'workload', 'cache', 'origin'])
    })

    it('marks the lit node', () => {
      const { container } = render(Diagram, { props: { spec } })

      expect(container.querySelector('[data-diagram-node="workload"]')).toHaveAttribute('data-lit')
      expect(container.querySelector('[data-diagram-node="cache"]')).not.toHaveAttribute('data-lit')
    })
  })

  describe('connectors', () => {
    it('draws one connector per edge once the layout is measured', async () => {
      const { container } = render(Diagram, { props: { spec } })

      const canvas = await ready(container)

      expect(canvas.querySelectorAll('svg path')).toHaveLength(spec.edges.length)
    })

    it('marks the active connectors', async () => {
      const { container } = render(Diagram, { props: { spec } })

      const canvas = await ready(container)

      expect(canvas.querySelectorAll('svg path[data-active]')).toHaveLength(2)
    })

    it('draws a chip for every labelled edge', async () => {
      const { container } = render(Diagram, { props: { spec } })

      const canvas = await ready(container)

      expect(canvas.textContent).toContain('hit')
      expect(canvas.textContent).toContain('miss')
    })

    it('skips an edge whose end is not in the diagram', async () => {
      const { container } = render(Diagram, {
        props: { spec: { ...spec, edges: [...spec.edges, { from: 'workload', to: 'missing' }] } }
      })

      const canvas = await ready(container)

      expect(canvas.querySelectorAll('svg path')).toHaveLength(spec.edges.length)
    })
  })

  describe('stacking', () => {
    it('centres a row of nodes and keeps a row with branches as an indented tree', async () => {
      const { container } = render(Diagram, { props: { spec } })
      await ready(container)
      expect(container.querySelector('[data-stack]')?.getAttribute('data-stack')).toBe('tree')

      const flow = render(Flow)
      await ready(flow.container)
      const rows = [...flow.container.querySelectorAll('[data-stack]')]
      expect(rows.map((row) => row.getAttribute('data-stack'))).toEqual(['centre'])
    })
  })

  describe('groups', () => {
    it('frames a group under its label and lets an edge reach it', async () => {
      const grouped: DiagramSpec = {
        nodes: [
          { key: 'user', kind: 'pill', title: 'User' },
          { key: 'origin', kind: 'item', title: 'origin.example.com' }
        ],
        layout: {
          row: [
            { node: 'user' },
            { group: 'backend', label: 'Your backend', kind: 'dashed', content: { node: 'origin' } }
          ]
        },
        edges: [{ from: 'user', to: 'backend' }]
      }
      const { container, getByText } = render(Diagram, { props: { spec: grouped } })

      const canvas = await ready(container)

      expect(getByText('Your backend')).toBeInTheDocument()
      expect(container.querySelector('[data-diagram-node="backend"]')).toBeInTheDocument()
      expect(canvas.querySelectorAll('svg path')).toHaveLength(1)
    })
  })

  describe('accessibility', () => {
    it('is one named image when ariaLabel is set', () => {
      const { getByRole } = render(Diagram, {
        props: { spec, ariaLabel: 'A request path through the workload.' }
      })

      expect(getByRole('img', { name: 'A request path through the workload.' })).toBeInTheDocument()
    })

    it('has no image role without ariaLabel', () => {
      const { getByTestId } = render(Diagram, { props: { spec } })

      expect(getByTestId(TESTID)).not.toHaveAttribute('role')
    })

    it('hides the drawing itself from assistive technology', () => {
      const { getByTestId } = render(Diagram, { props: { spec } })

      expect(getByTestId(`${TESTID}__canvas`)).toHaveAttribute('aria-hidden', 'true')
    })

    it('has no a11y violations', async () => {
      const { container } = render(Diagram, {
        props: { spec, ariaLabel: 'A request path through the workload.' }
      })

      await ready(container)
      await expectNoA11yViolations(container)
    })
  })

  describe('named diagrams', () => {
    it.each(NAMES)('loads and draws %s with its own description', async (name) => {
      const { container, getByTestId } = render(Diagram, { props: { name } })
      const root = getByTestId(TESTID)

      expect(root.getAttribute('data-name')).toBe(name)
      const canvas = await ready(container)
      expect(canvas.querySelectorAll('[data-diagram-node]').length).toBeGreaterThan(0)
      expect(canvas.querySelectorAll('svg path').length).toBeGreaterThan(0)
      expect(root.getAttribute('role')).toBe('img')
      expect(root.getAttribute('aria-label')).toBeTruthy()
    })

    it('lets ariaLabel win over the description the diagram carries', async () => {
      const { container, getByTestId } = render(Diagram, {
        props: { name: 'workloads', ariaLabel: 'The workload request path' }
      })
      await ready(container)

      expect(getByTestId(TESTID).getAttribute('aria-label')).toBe('The workload request path')
    })

    it('draws spec over name when both are set', async () => {
      const { container, getByTestId } = render(Diagram, {
        props: { name: 'workloads', spec, ariaLabel: 'Spec wins' }
      })
      const canvas = await ready(container)

      expect(getByTestId(TESTID).hasAttribute('data-name')).toBe(false)
      expect(canvas.querySelectorAll('[data-diagram-node]').length).toBe(spec.nodes.length)
    })

    it('swaps the drawing when name changes', async () => {
      const name = ref<DiagramName>('cache')
      const Host = defineComponent({
        components: { Diagram },
        setup: () => ({ name }),
        template: '<Diagram :name="name" />'
      })
      const { container, getByTestId } = render(Host)
      await ready(container)
      const before = getByTestId(TESTID).getAttribute('aria-label')

      name.value = 'kv-store'
      await nextTick()
      expect(getByTestId(TESTID).getAttribute('data-name')).toBe('kv-store')
      await waitFor(() => expect(getByTestId(TESTID).getAttribute('aria-label')).not.toBe(before))
    })

    it('stays empty and warns for a name outside the library', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const { getByTestId } = render(Diagram, {
        props: { name: 'missing' as DiagramName }
      })
      await nextTick()

      expect(getByTestId(TESTID).querySelector('[data-diagram-node]')).toBeNull()
      expect(getByTestId(TESTID).hasAttribute('role')).toBe(false)
      warn.mockRestore()
    })

    it('has no a11y violations for a named diagram', async () => {
      const { container } = render(Diagram, { props: { name: 'ai-gateway-model-routing' } })
      await ready(container)
      await expectNoA11yViolations(container)
    })
  })

  describe('stories', () => {
    it.each([
      ['Default', Default],
      ['Spec', Spec],
      ['NodeKinds', NodeKinds],
      ['Groups', Groups],
      ['Flow', Flow]
    ])('renders the %s story as a named image', async (_name, Story) => {
      const { findByRole } = render(Story)

      expect(await findByRole('img')).toHaveAccessibleName()
    })
  })
})

describe('Diagram parts data-testid', () => {
  it('gives every node and layout container a derived testid', async () => {
    const { container, getAllByTestId } = render(Diagram, { props: { spec } })
    await ready(container)

    const nodes = getAllByTestId(`${TESTID}__node`)
    expect(nodes.map((node) => node.getAttribute('data-diagram-node'))).toEqual([
      'user',
      'workload',
      'cache',
      'origin'
    ])
    expect(getAllByTestId(`${TESTID}__layout`).length).toBeGreaterThan(0)
  })

  it('lets a consumer override the node and layout testids', () => {
    const node = render(DiagramNode, {
      props: { node: { key: 'user', kind: 'pill', title: 'User' } },
      attrs: { 'data-testid': 'custom-node' }
    })
    expect(node.getByTestId('custom-node').getAttribute('data-diagram-node')).toBe('user')
    node.unmount()

    const layout = render(DiagramLayout, {
      props: {
        item: { row: [{ node: 'user' }] },
        nodes: { user: { key: 'user', kind: 'pill', title: 'User' } }
      },
      attrs: { 'data-testid': 'custom-layout' }
    })
    expect(layout.getByTestId('custom-layout')).toBeTruthy()
    expect(layout.getByTestId(`${TESTID}__node`)).toBeTruthy()
  })
})
