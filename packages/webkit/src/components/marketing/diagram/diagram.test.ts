import { composeStories } from '@storybook/vue3'
import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/marketing/diagram/Diagram.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Diagram from './diagram.vue'
import type { DiagramSpec } from './types'

const { Default, NodeKinds, Groups } = composeStories(stories)

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
  const canvas = container.querySelector(`[data-testid="${TESTID}__canvas"]`)
  await waitFor(() => expect(canvas).toHaveAttribute('data-ready'))
  return canvas as HTMLElement
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

  describe('stories', () => {
    it.each([
      ['Default', Default],
      ['NodeKinds', NodeKinds],
      ['Groups', Groups]
    ])('renders the %s story as a named image', (_name, Story) => {
      const { getByRole } = render(Story)

      expect(getByRole('img')).toHaveAccessibleName()
    })
  })
})
