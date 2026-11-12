import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import Binding from '../../../../examples/topology-diagram/binding.vue'
import Default from '../../../../examples/topology-diagram/default.vue'
import Empty from '../../../../examples/topology-diagram/empty.vue'
import Loading from '../../../../examples/topology-diagram/loading.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import TopologyDiagram from './topology-diagram.vue'
import type { TopologyLevel } from './types'

const settle = async () => {
  await nextTick()
  await nextTick()
}

const menu = () => document.body.querySelector<HTMLElement>('[role="menu"]') as HTMLElement

const levels: TopologyLevel[] = [
  {
    key: 'project',
    nodes: [
      { key: 'project', kind: 'Project', name: 'web-app', status: 'Live', severity: 'success' }
    ]
  },
  {
    key: 'policy',
    nodes: [
      {
        key: 'policy',
        kind: 'Policy',
        name: 'edge-guard',
        boundValue: 'edge-guard',
        bindable: true,
        removable: true,
        bindOptions: [
          { value: 'edge-guard', label: 'edge-guard' },
          { value: 'strict-waf', label: 'strict-waf' }
        ]
      }
    ]
  },
  {
    key: 'page',
    nodes: [
      {
        key: 'page',
        kind: 'Error page',
        bindable: true,
        terminal: true,
        message: 'Errors answer with the default page.'
      }
    ]
  }
]

describe('TopologyDiagram', () => {
  it('names the region and lists the columns', () => {
    const view = render(TopologyDiagram, { props: { levels } })
    const region = view.getByRole('region', { name: 'Deployment topology' })
    expect(within(region).getAllByRole('listitem')).toHaveLength(3)
  })

  it('draws one connector per adjacent pair of columns', async () => {
    const view = render(Default)
    const root = view.getByTestId('data-topology-diagram')
    await waitFor(() => expect(root.querySelectorAll('svg path').length).toBe(9))
  })

  it('toggles a card with Enter and updates expanded', async () => {
    const view = render(TopologyDiagram, { props: { levels, expanded: [] } })
    const header = view.getByRole('button', { name: /Project/ })
    expect(header.getAttribute('aria-expanded')).toBe('false')
    const body = document.getElementById(header.getAttribute('aria-controls') as string)
    expect(body?.hasAttribute('inert')).toBe(true)
    header.focus()
    await fireEvent.keyDown(header, { key: 'Enter' })
    await fireEvent.click(header)
    expect(view.emitted()['update:expanded']?.at(-1)).toEqual([['project']])
  })

  it('shows an unbound slot as Not bound with a bind control', () => {
    const view = render(TopologyDiagram, { props: { levels } })
    expect(view.getByText('Not bound')).toBeTruthy()
    expect(view.getByRole('button', { name: 'Bind Error page' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Change Policy' })).toBeTruthy()
  })

  it('emits bind, create and remove with the node key', async () => {
    const view = render(TopologyDiagram, { props: { levels } })
    await fireEvent.click(view.getByRole('button', { name: 'Change Policy' }))
    await settle()
    await fireEvent.click(within(menu()).getByRole('menuitem', { name: /strict-waf/ }))
    expect(view.emitted()['bind']?.[0]).toEqual(['policy', 'strict-waf'])
    await fireEvent.click(view.getByRole('button', { name: 'Bind Error page' }))
    await settle()
    expect(within(menu()).getByText('No options yet.')).toBeTruthy()
    await fireEvent.click(within(menu()).getByRole('menuitem', { name: /Create Error page/ }))
    expect(view.emitted()['create']?.[0]).toEqual(['page'])
    await fireEvent.click(view.getByRole('button', { name: 'Remove Policy' }))
    expect(view.emitted()['remove']?.[0]).toEqual(['policy'])
  })

  it('stages a bind in the binding example', async () => {
    const view = render(Binding)
    await fireEvent.click(view.getByRole('button', { name: 'Bind Error page' }))
    await settle()
    await fireEvent.click(within(menu()).getByRole('menuitem', { name: /maintenance/ }))
    await settle()
    expect(view.getAllByText('Staged').length).toBeGreaterThan(0)
    expect(view.getByText(/1 staged/)).toBeTruthy()
  })

  it('links a named node with href and ends the link in the open glyph', () => {
    const view = render(Default)
    const link = view
      .getAllByRole('link', { name: 'web-app' })
      .find((node) => node.getAttribute('href') === '#project')!
    expect(link).toHaveAttribute('data-testid', 'data-topology-diagram__node-link')
    expect(link.querySelector('.pi-external-link')).toHaveAttribute('aria-hidden', 'true')
    const plain = render(TopologyDiagram, { props: { levels } })
    expect(within(plain.container).queryByRole('link')).toBeNull()
    expect(plain.container.querySelector('.pi-external-link')).toBeNull()
  })

  it('puts the Domains add control from the actions slot in the identity row', async () => {
    const view = render(Default)
    const add = view.getByRole('button', { name: 'Add domain' })
    const domains = view.getAllByTestId('data-topology-diagram__node')[0]!
    expect(domains).toContainElement(add)
    await fireEvent.click(add)
    expect(view.getByText('Add a domain.')).toHaveAttribute('role', 'status')
  })

  it('is busy while loading and shows the empty line without levels', () => {
    const loading = render(Loading)
    expect(loading.getByRole('region').getAttribute('aria-busy')).toBe('true')
    expect(loading.getByRole('status').textContent).toContain('Loading the topology')
    loading.unmount()
    const empty = render(Empty)
    expect(empty.getByText('Nothing is connected yet.')).toBeTruthy()
    expect(empty.getByRole('button', { name: 'Deploy' })).toBeTruthy()
  })

  it('keeps the scroll area out of the tab order until it overflows', () => {
    const view = render(TopologyDiagram, { props: { levels } })
    const area = view.getByTestId('data-topology-diagram').firstElementChild as HTMLElement
    expect(area.hasAttribute('tabindex')).toBe(false)
  })

  it('mirrors the connectors under rtl', async () => {
    const Host = defineComponent({
      render: () => h('div', { dir: 'rtl' }, [h(TopologyDiagram, { levels })])
    })
    const view = render(Host)
    const root = view.getByTestId('data-topology-diagram')
    await waitFor(() => expect(root.querySelectorAll('svg path').length).toBe(2))
  })

  it('has no axe violations', async () => {
    for (const example of [Default, Binding, Loading, Empty]) {
      const view = render(example)
      await settle()
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })
})
