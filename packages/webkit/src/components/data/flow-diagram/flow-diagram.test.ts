import '../../../test/reflow.css'

import userEvent from '@testing-library/user-event'
import { render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
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

  it('keeps every edge and its severity when a branching diagram stacks on a phone', async () => {
    const { container } = render(() => h('div', { style: 'width: 360px' }, [h(Default)]))
    const list = () => container.querySelector<HTMLElement>('[data-testid="flow-diagram__list"]')!
    await waitFor(() => expect(list().hasAttribute('data-stacked')).toBe(true))
    await waitFor(() => expect(paths(container).length).toBe(3))
    const labels = Array.from(
      container.querySelectorAll('[data-testid="flow-diagram__edge-label"]'),
      (el) => el.textContent?.trim()
    )
    expect(labels).toEqual(['6 ms', '2 ms', '96 ms'])
    const routes = Array.from(
      container.querySelectorAll<HTMLElement>('[data-testid="flow-diagram__node-route"]')
    )
    expect(routes.map((route) => route.innerText.replace(/\s+/g, ' ').trim())).toEqual([
      'To static-assets 1 ms',
      'To api.example.com 840 ms'
    ])
    expect(routes[1].dataset['severity']).toBe('danger')
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

  it('stays a column when the row would not fit, so no node is clipped', async () => {
    const { container } = render(() => h('div', { style: 'width: 720px' }, [h(Default)]))
    await waitFor(() => expect(cards(container).length).toBe(5))
    const list = container.querySelector('[data-testid="flow-diagram__list"]') as HTMLElement
    await waitFor(() => expect(list.dataset['direction']).toBe('column'))
    const viewport = container.querySelector(
      '[data-testid="flow-diagram__viewport"]'
    ) as HTMLElement
    const edge = viewport.getBoundingClientRect().right
    for (const card of cards(container))
      expect(card.getBoundingClientRect().right).toBeLessThanOrEqual(edge + 0.5)
    expect(viewport.hasAttribute('data-overflow-end')).toBe(false)
    expect(viewport.hasAttribute('tabindex')).toBe(false)
  })

  it('caps the stacked column at a readable width on a wide screen', async () => {
    const { container } = render(() => h('div', { style: 'width: 1280px' }, [h(Topology)]))
    const list = () => container.querySelector('[data-testid="flow-diagram__list"]') as HTMLElement
    await waitFor(() => expect(list()?.dataset['direction']).toBe('column'))
    const probe = document.createElement('div')
    probe.style.width = 'var(--container-xl)'
    container.appendChild(probe)
    const cap = probe.getBoundingClientRect().width
    expect(cap).toBeGreaterThan(0)
    expect(list().getBoundingClientRect().width).toBeLessThanOrEqual(cap + 0.5)
  })

  it('never leaves a lazily loaded row overflowing a viewport that cannot take focus', async () => {
    const { container } = render(() => h('div', { style: 'width: 414px' }, [h(RequestPath)]))
    await waitFor(() => expect(cards(container).length).toBe(3))
    const viewport = container.querySelector(
      '[data-testid="flow-diagram__viewport"]'
    ) as HTMLElement
    expect(viewport.scrollWidth).toBeLessThanOrEqual(viewport.clientWidth + 1)
    expect(
      container.querySelector('[data-testid="flow-diagram__list"]')?.getAttribute('data-direction')
    ).toBe('column')
  })

  it('switches to a row once the container is wide enough, and back', async () => {
    const { container } = render(() =>
      h('div', { 'data-testid': 'frame', style: 'width: 1400px' }, [h(Default)])
    )
    const frame = container.querySelector('[data-testid="frame"]') as HTMLElement
    const list = () => container.querySelector('[data-testid="flow-diagram__list"]') as HTMLElement
    await waitFor(() => expect(cards(container).length).toBe(5))
    await waitFor(() => expect(list().dataset['direction']).toBe('row'))
    frame.style.width = '720px'
    await waitFor(() => expect(list().dataset['direction']).toBe('column'))
    frame.style.width = '1400px'
    await waitFor(() => expect(list().dataset['direction']).toBe('row'))
  })

  it('probes the row again only when the width or the steps change', async () => {
    const { container } = render(() =>
      h('div', { 'data-testid': 'frame', style: 'width: 720px' }, [h(Default)])
    )
    const frame = container.querySelector('[data-testid="frame"]') as HTMLElement
    const list = () => container.querySelector('[data-testid="flow-diagram__list"]') as HTMLElement
    const viewport = container.querySelector(
      '[data-testid="flow-diagram__viewport"]'
    ) as HTMLElement
    await waitFor(() => expect(cards(container).length).toBe(5))
    await waitFor(() => expect(list().dataset['direction']).toBe('column'))
    const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve))
    await nextFrame()
    await nextFrame()
    const setAttribute = vi.spyOn(list(), 'setAttribute')
    const probes = () =>
      setAttribute.mock.calls.filter(
        ([name, value]) => name === 'data-direction' && value === 'row'
      ).length
    try {
      viewport.style.minHeight = `${viewport.offsetHeight + 40}px`
      await nextFrame()
      await nextFrame()
      expect(probes()).toBe(0)
      list().append(document.createElement('span'))
      await Promise.resolve()
      expect(probes()).toBe(1)
      await nextFrame()
      await nextFrame()
      expect(probes()).toBe(1)
      frame.style.width = '700px'
      await waitFor(() => expect(probes()).toBe(2))
      expect(list().dataset['direction']).toBe('column')
    } finally {
      setAttribute.mockRestore()
    }
  })

  it.each(['ltr', 'rtl'])(
    'fades the inline edges a horizontal row can still scroll to (%s)',
    async (dir) => {
      const { container } = render(() =>
        h('div', { dir, style: 'width: 480px' }, [
          h(FlowDiagram, { orientation: 'horizontal' }, () =>
            ['Client', 'Edge', 'Application', 'Function', 'Origin'].map((label) =>
              h(FlowDiagramNode, { key: label, class: 'min-w-(--size-48)' }, () => label)
            )
          )
        ])
      )
      const viewport = container.querySelector(
        '[data-testid="flow-diagram__viewport"]'
      ) as HTMLElement
      await waitFor(() => expect(viewport.hasAttribute('data-overflow-end')).toBe(true))
      expect(viewport.hasAttribute('data-overflow-start')).toBe(false)
      expect(viewport.getAttribute('tabindex')).toBe('0')
      const style = getComputedStyle(viewport)
      expect(style.maskImage).toContain('linear-gradient')
      expect(style.getPropertyValue('--flow-diagram-fade-direction').trim()).toBe(
        dir === 'rtl' ? 'to left' : 'to right'
      )
      viewport.scrollLeft = (dir === 'rtl' ? -1 : 1) * viewport.scrollWidth
      await waitFor(() => expect(viewport.hasAttribute('data-overflow-start')).toBe(true))
      expect(viewport.hasAttribute('data-overflow-end')).toBe(false)
    }
  )

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

  it('asks before the topology unbinds a policy', async () => {
    const user = userEvent.setup()
    const { container } = render(Topology)
    await waitFor(() => expect(cards(container).length).toBe(7))
    const policy = cards(container).find(
      (card) => card.dataset['nodeKey'] === 'policy'
    ) as HTMLElement
    await user.click(within(policy).getByTestId('flow-diagram-bind__remove'))
    const dialog = await within(document.body).findByRole('alertdialog')
    expect(within(policy).getByText('edge-guard')).toBeTruthy()
    await user.click(within(dialog).getByRole('button', { name: 'Unbind' }))
    await waitFor(() =>
      expect(container.querySelector('p[role="status"]')?.textContent).toContain(
        'Removed the policy binding'
      )
    )
  })

  it('keeps the spacing token between a row of controls and the divider or border below', async () => {
    const { container } = render(() => h('div', { style: 'width: 1600px' }, [h(Topology)]))
    await waitFor(() => expect(cards(container).length).toBe(7))
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const token =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--spacing-sm')) * rem
    expect(token).toBeGreaterThan(0)
    for (const key of ['domains', 'policy', 'error-page']) {
      const card = cards(container).find((entry) => entry.dataset['nodeKey'] === key) as HTMLElement
      const button = card.querySelector<HTMLElement>(
        '[data-slot="flow-diagram-title-actions"] button'
      ) as HTMLElement
      const toggle = card.querySelector<HTMLElement>('[data-testid="flow-diagram__node-toggle"]')
      const below = toggle
        ? toggle.getBoundingClientRect().top
        : card.getBoundingClientRect().bottom - parseFloat(getComputedStyle(card).borderBottomWidth)
      expect(below - button.getBoundingClientRect().bottom).toBeGreaterThanOrEqual(token - 0.5)
    }
    const project = cards(container).find(
      (entry) => entry.dataset['nodeKey'] === 'project'
    ) as HTMLElement
    expect(
      project.querySelector('[data-slot="flow-diagram-title-actions"]')?.childElementCount ?? 0
    ).toBe(0)
    const domains = cards(container).find(
      (entry) => entry.dataset['nodeKey'] === 'domains'
    ) as HTMLElement
    const rowHeight = (card: HTMLElement) =>
      (
        card.querySelector('[data-slot="flow-diagram-anchor"]') as HTMLElement
      ).getBoundingClientRect().height
    for (const card of cards(container))
      expect(Math.abs(rowHeight(card) - rowHeight(domains))).toBeLessThan(0.5)
    expect(rowHeight(project)).toBe(rowHeight(domains))
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
