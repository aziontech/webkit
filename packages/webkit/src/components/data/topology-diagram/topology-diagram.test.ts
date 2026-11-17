import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import Binding from '../../../../examples/topology-diagram/binding.vue'
import Default from '../../../../examples/topology-diagram/default.vue'
import Empty from '../../../../examples/topology-diagram/empty.vue'
import Loading from '../../../../examples/topology-diagram/loading.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import TopologyDiagram from './topology-diagram.vue'
import type { TopologyDiagramLevel, TopologyDiagramNodeData } from './types'

const settle = async () => {
  await nextTick()
  await nextTick()
}

const menu = () => document.body.querySelector<HTMLElement>('[role="menu"]') as HTMLElement

const levels: TopologyDiagramLevel[] = [
  {
    id: 'project',
    nodes: [
      { id: 'project', type: 'Project', name: 'web-app', status: 'Live', severity: 'success' }
    ]
  },
  {
    id: 'policy',
    nodes: [
      {
        id: 'policy',
        type: 'Policy',
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
    id: 'page',
    nodes: [
      {
        id: 'page',
        type: 'Error page',
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
    const root = view.getByTestId('topology-diagram')
    await waitFor(() => expect(root.querySelectorAll('svg path').length).toBe(9))
  })

  it('toggles a card with Enter and updates openKeys', async () => {
    const view = render(TopologyDiagram, { props: { levels, openKeys: [] } })
    const header = view.getByRole('button', { name: /Project/ })
    expect(header.getAttribute('aria-expanded')).toBe('false')
    const body = document.getElementById(header.getAttribute('aria-controls') as string)
    expect(body?.hasAttribute('inert')).toBe(true)
    header.focus()
    await fireEvent.keyDown(header, { key: 'Enter' })
    await fireEvent.click(header)
    expect(view.emitted()['update:openKeys']?.at(-1)).toEqual([['project']])
  })

  it('shows an unbound slot as Not bound with a bind control', () => {
    const view = render(TopologyDiagram, { props: { levels } })
    expect(view.getByText('Not bound')).toBeTruthy()
    expect(view.getByRole('button', { name: 'Bind Error page' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Change Policy' })).toBeTruthy()
  })

  it('emits bind, create and remove with the DOM event first and the node id', async () => {
    const view = render(TopologyDiagram, { props: { levels } })
    await fireEvent.click(view.getByRole('button', { name: 'Change Policy' }))
    await settle()
    await fireEvent.click(within(menu()).getByRole('menuitem', { name: /strict-waf/ }))
    await settle()
    await fireEvent.click(view.getByRole('button', { name: 'Apply Policy' }))
    const bind = view.emitted()['bind']?.[0] as unknown[]
    expect(bind[0]).toBeInstanceOf(MouseEvent)
    expect(bind[1]).toEqual({ id: 'policy', value: 'strict-waf' })
    await fireEvent.click(view.getByRole('button', { name: 'Bind Error page' }))
    await settle()
    expect(within(menu()).getByText('No options yet.')).toBeTruthy()
    await fireEvent.click(within(menu()).getByRole('menuitem', { name: /Create Error page/ }))
    const create = view.emitted()['create']?.[0] as unknown[]
    expect(create[0]).toBeInstanceOf(MouseEvent)
    expect(create[1]).toBe('page')
    await userEvent.click(view.getByRole('button', { name: 'Remove Policy' }))
    const remove = view.emitted()['remove']?.[0] as unknown[]
    expect(remove[0]).toBeInstanceOf(MouseEvent)
    expect(remove[1]).toBe('policy')
  })

  const pickPolicy = async (view: ReturnType<typeof render>, name: RegExp) => {
    await fireEvent.click(view.getByRole('button', { name: 'Change Policy' }))
    await settle()
    await fireEvent.click(within(menu()).getByRole('menuitem', { name }))
    await settle()
  }

  it('holds a picked option as pending until it is applied', async () => {
    const view = render(TopologyDiagram, { props: { levels } })
    await pickPolicy(view, /strict-waf/)
    expect(view.emitted()['bind']).toBeUndefined()
    const node = view.getAllByTestId('topology-diagram__node')[1]!
    expect(node).toHaveAttribute('data-pending')
    expect(within(node).getByTestId('topology-diagram__node-pending').textContent).toBe(
      'strict-waf'
    )
    expect(within(node).getByText('Pending')).toBeTruthy()
    const apply = view.getByRole('button', { name: 'Apply Policy' })
    expect(view.getByRole('button', { name: 'Cancel' })).toBeTruthy()
    expect(view.queryByRole('button', { name: 'Remove Policy' })).toBeNull()
    await waitFor(() => expect(document.activeElement).toBe(apply))
    expect(apply.getAttribute('aria-describedby')?.split(' ')).toContain(
      within(node).getByTestId('topology-diagram__node-pending').id
    )
    await userEvent.keyboard('{Enter}')
    const bind = view.emitted()['bind'] as unknown[][]
    expect(bind).toHaveLength(1)
    expect(bind[0]![0]).toBeInstanceOf(Event)
    expect(bind[0]![1]).toEqual({ id: 'policy', value: 'strict-waf' })
    await settle()
    expect(node).not.toHaveAttribute('data-pending')
    expect(view.queryByRole('button', { name: 'Apply Policy' })).toBeNull()
    expect(view.getByRole('button', { name: 'Remove Policy' })).toBeTruthy()
  })

  it('discards a pending pick with Cancel and returns focus to the edit control', async () => {
    const view = render(TopologyDiagram, { props: { levels } })
    await pickPolicy(view, /strict-waf/)
    await fireEvent.click(view.getByRole('button', { name: 'Cancel' }))
    await settle()
    expect(view.emitted()['bind']).toBeUndefined()
    expect(view.queryByRole('button', { name: 'Apply Policy' })).toBeNull()
    expect(view.getByRole('button', { name: 'Remove Policy' })).toBeTruthy()
    await waitFor(() =>
      expect(document.activeElement).toBe(view.getByRole('button', { name: 'Change Policy' }))
    )
  })

  it('discards a pending pick with Escape from the action area', async () => {
    const view = render(TopologyDiagram, { props: { levels } })
    await pickPolicy(view, /strict-waf/)
    view.getByRole('button', { name: 'Apply Policy' }).focus()
    await userEvent.keyboard('{Escape}')
    await settle()
    expect(view.emitted()['bind']).toBeUndefined()
    expect(view.queryByRole('button', { name: 'Apply Policy' })).toBeNull()
    await waitFor(() =>
      expect(document.activeElement).toBe(view.getByRole('button', { name: 'Change Policy' }))
    )
  })

  it('clears pending when the current value is picked again', async () => {
    const view = render(TopologyDiagram, { props: { levels } })
    await pickPolicy(view, /strict-waf/)
    expect(view.getByRole('button', { name: 'Apply Policy' })).toBeTruthy()
    await pickPolicy(view, /edge-guard/)
    expect(view.queryByRole('button', { name: 'Apply Policy' })).toBeNull()
    expect(view.emitted()['bind']).toBeUndefined()
    expect(view.getAllByTestId('topology-diagram__node')[1]).not.toHaveAttribute('data-pending')
  })

  it('has no axe violations while a binding is pending', async () => {
    const view = render(TopologyDiagram, { props: { levels } })
    await pickPolicy(view, /strict-waf/)
    await expectNoA11yViolations(view.container)
  })

  it('emits remove with the DOM event first from the keyboard', async () => {
    const view = render(TopologyDiagram, { props: { levels } })
    view.getByRole('button', { name: 'Remove Policy' }).focus()
    await userEvent.keyboard('{Enter}')
    const remove = view.emitted()['remove']?.[0] as unknown[]
    expect(remove[0]).toBeInstanceOf(Event)
    expect(remove[1]).toBe('policy')
  })

  it('stages a bind in the binding example', async () => {
    const view = render(Binding)
    await fireEvent.click(view.getByRole('button', { name: 'Bind Error page' }))
    await settle()
    await fireEvent.click(within(menu()).getByRole('menuitem', { name: /maintenance/ }))
    await settle()
    await fireEvent.click(view.getByRole('button', { name: 'Apply Error page' }))
    await settle()
    expect(view.getAllByText('Staged').length).toBeGreaterThan(0)
    expect(view.getByText(/1 staged/)).toBeTruthy()
  })

  it('links a named node with href and ends the link in the open glyph', () => {
    const view = render(Default)
    const link = view
      .getAllByRole('link', { name: 'web-app' })
      .find((node) => node.getAttribute('href') === '#project')!
    expect(link).toHaveAttribute('data-testid', 'topology-diagram__node-link')
    expect(link.querySelector('.az-external-link')).toHaveAttribute('aria-hidden', 'true')
    const plain = render(TopologyDiagram, { props: { levels } })
    expect(within(plain.container as HTMLElement).queryByRole('link')).toBeNull()
    expect(plain.container.querySelector('.az-external-link')).toBeNull()
  })

  it('puts the Domains add control from the actions slot in the identity row', async () => {
    const view = render(Default)
    const add = view.getByRole('button', { name: 'Add domain' })
    const domains = view.getAllByTestId('topology-diagram__node')[0]!
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

  it('renders the package EmptyState when there are no levels', () => {
    const view = render(TopologyDiagram, { props: { levels: [] } })
    const empty = view.getByTestId('topology-diagram__empty')
    expect(within(empty).getByTestId('empty-state')).toBeTruthy()
  })

  it('takes the consumer data-testid over the fallback', () => {
    const fallback = render(TopologyDiagram, { props: { levels } })
    expect(fallback.getByTestId('topology-diagram')).toBeTruthy()
    fallback.unmount()
    const view = render(TopologyDiagram, { props: { levels }, attrs: { 'data-testid': 'stack' } })
    expect(view.getByTestId('stack')).toBeTruthy()
    expect(view.queryByTestId('topology-diagram')).toBeNull()
  })

  it('reads the node type, and not the removed kind', () => {
    const view = render(TopologyDiagram, {
      props: {
        levels: [
          {
            id: 'one',
            nodes: [
              { id: 'a', type: 'Workload', name: 'storefront' },
              { id: 'b', kind: 'Firewall', name: 'edge-rules' } as TopologyDiagramNodeData
            ]
          }
        ]
      }
    })
    expect(view.getByText('Workload')).toBeTruthy()
    expect(view.queryByText('Firewall')).toBeNull()
  })

  it('keeps the scroll area out of the tab order until it overflows', () => {
    const view = render(TopologyDiagram, { props: { levels } })
    const area = view.getByTestId('topology-diagram').firstElementChild as HTMLElement
    expect(area.hasAttribute('tabindex')).toBe(false)
  })

  it('mirrors the connectors under rtl', async () => {
    const Host = defineComponent({
      render: () => h('div', { dir: 'rtl' }, [h(TopologyDiagram, { levels })])
    })
    const view = render(Host)
    const root = view.getByTestId('topology-diagram')
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
