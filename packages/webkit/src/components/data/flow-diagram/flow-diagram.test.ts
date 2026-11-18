import '../../../test/reflow.css'

import userEvent from '@testing-library/user-event'
import { render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Composed from '../../../../examples/flow-diagram/composed.vue'
import Default from '../../../../examples/flow-diagram/default.vue'
import RequestPath from '../../../../examples/flow-diagram/request-path.vue'
import Topology from '../../../../examples/flow-diagram/topology.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import FlowDiagramRoot from './flow-diagram.vue'
import FlowDiagram, { FlowDiagramNode } from './index'
import { rankColumns } from './lib/rank'

const cards = (container: Element) =>
  Array.from(container.querySelectorAll<HTMLElement>('[data-testid="flow-diagram__node"]'))

const paths = (container: Element) => container.querySelectorAll('svg path')

describe('FlowDiagram', () => {
  it('ranks nodes into columns from the edges', () => {
    const columns = rankColumns(
      [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }],
      [
        { from: 'a', to: 'b' },
        { from: 'a', to: 'c' },
        { from: 'b', to: 'd' },
        { from: 'c', to: 'd' }
      ]
    )
    expect(columns.map((column) => column.map((node) => node.id))).toEqual([
      ['a'],
      ['b', 'c'],
      ['d']
    ])
    expect(rankColumns([{ id: 'a' }, { id: 'b' }], []).length).toBe(2)
  })

  it('renders the rich default from data, with labelled edges', async () => {
    const { container, getByRole } = render(() =>
      h('div', { style: 'width: 1400px' }, [h(Default)])
    )
    expect(getByRole('group', { name: 'Request path of shop.example.com' })).toBeTruthy()
    await waitFor(() => expect(cards(container).length).toBe(5))
    expect(container.querySelectorAll('[data-testid="flow-diagram__column"]').length).toBe(4)
    const edge = cards(container).find((card) => card.dataset['nodeKey'] === 'edge') as HTMLElement
    expect(within(edge).getByText('Healthy')).toBeTruthy()
    expect(within(edge).getByText('38 ms')).toBeTruthy()
    expect(within(edge).getByText('San Francisco, US')).toBeTruthy()
    expect(
      edge.querySelector('[data-testid="flow-diagram-title__link"]')?.getAttribute('href')
    ).toBe('#application')
    await waitFor(() => expect(paths(container).length).toBe(5))
    expect(container.querySelectorAll('[data-testid="flow-diagram__edge-label"]').length).toBe(5)
    expect(container.querySelector('path[data-severity="danger"]')).toBeTruthy()
    const connections = container.querySelector('[data-testid="flow-diagram__connections"]')
    expect(connections?.textContent).toContain('checkout-router to api.example.com, 840 ms')
    await expectNoA11yViolations(container)
  })

  it('opens details through openKeys', async () => {
    const user = userEvent.setup()
    const { container } = render(Default)
    await waitFor(() => expect(cards(container).length).toBe(5))
    const toggle = container.querySelector<HTMLElement>(
      '[data-testid="flow-diagram__node-toggle"]'
    ) as HTMLElement
    expect(toggle.getAttribute('aria-expanded')).toBe('false')
    await user.click(toggle)
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    const details = container.querySelector('[data-testid="flow-diagram__node-details"]')
    expect(details?.getAttribute('data-state')).toBe('open')
  })

  it('composes parts by hand and draws connectors between them', async () => {
    const { container } = render(() => h('div', { style: 'width: 1400px' }, [h(Composed)]))
    expect(FlowDiagram.Node).toBe(FlowDiagramNode)
    expect(container.querySelectorAll('[data-slot="flow-diagram-node"]').length).toBe(5)
    expect(container.querySelector('[data-slot="flow-diagram-title"]')?.textContent).toContain(
      'production'
    )
    await waitFor(() => expect(paths(container).length).toBe(5))
    await expectNoA11yViolations(container)
  })

  it('stacks a narrow request path into a vertical rail', async () => {
    const { container } = render(() => h('div', { style: 'width: 360px' }, [h(RequestPath)]))
    await waitFor(() =>
      expect(
        container.querySelector('[data-testid="flow-diagram__list"]')?.hasAttribute('data-stacked')
      ).toBe(true)
    )
    await waitFor(() => expect(paths(container).length).toBe(2))
    expect(container.querySelector('[data-beside]')?.textContent).toBe('18 ms')
  })

  it('keeps a wide request path in a row of equal boxes', async () => {
    const { container } = render(() => h('div', { style: 'width: 960px' }, [h(RequestPath)]))
    await waitFor(() => expect(cards(container).length).toBe(3))
    const list = container.querySelector('[data-testid="flow-diagram__list"]') as HTMLElement
    expect(list.hasAttribute('data-uniform')).toBe(true)
    await waitFor(() => expect(list.hasAttribute('data-stacked')).toBe(false))
    const widths = cards(container).map((card) => Math.round(card.getBoundingClientRect().width))
    expect(new Set(widths).size).toBe(1)
  })

  it('stages a bind until Apply in the topology', async () => {
    const user = userEvent.setup()
    const { container } = render(Topology)
    await waitFor(() => expect(cards(container).length).toBe(7))
    const errorPage = cards(container).find(
      (card) => card.dataset['nodeKey'] === 'error-page'
    ) as HTMLElement
    expect(errorPage.hasAttribute('data-dashed')).toBe(true)
    expect(within(errorPage).getByText('Not bound')).toBeTruthy()
    await user.click(within(errorPage).getByRole('button', { name: 'Bind Error page' }))
    await user.click(within(document.body).getByRole('menuitem', { name: /maintenance/ }))
    const apply = await within(errorPage).findByRole('button', { name: 'Apply Error page' })
    expect(within(errorPage).getByText('maintenance')).toBeTruthy()
    await user.click(apply)
    await waitFor(() =>
      expect(container.querySelector('p[role="status"]')?.textContent).toContain(
        'maintenance bound'
      )
    )
  })

  it('shows the empty state, loading placeholders and honours data-testid', async () => {
    const empty = render(FlowDiagramRoot, { props: { nodes: [] } })
    expect(empty.container.querySelector('[data-testid="flow-diagram__empty"]')).toBeTruthy()
    empty.unmount()
    const loading = render(FlowDiagramRoot, {
      props: { loading: true },
      attrs: { 'data-testid': 'topology' }
    })
    const root = loading.container.querySelector('[data-testid="topology"]') as HTMLElement
    expect(root.getAttribute('aria-busy')).toBe('true')
    expect(within(root).getByRole('status').textContent).toBe('Loading the diagram')
  })
})
