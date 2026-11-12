import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import BarList from './bar-list.vue'

const ITEMS = [
  { name: '/blocks', value: 108 },
  { name: '/home', value: 843 },
  { name: '/imprint', value: 46 },
  { name: '/documentation', value: 384 }
]

const mount = (props: Record<string, unknown> = {}) =>
  render(BarList, {
    props: { ariaLabel: 'Top paths', items: ITEMS, ...props }
  })

const rowText = (row: HTMLElement) => row.textContent?.replace(/\s+/g, ' ').trim() ?? ''

const names = (view: ReturnType<typeof mount>) =>
  view.getAllByTestId('chart-bar-list__row').map((row) => rowText(row).split(',')[0])

describe('BarList', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    const fallback = mount()
    expect(fallback.getByTestId('chart-bar-list').tagName).toBe('OL')
    fallback.unmount()
    expect(mount({ 'data-testid': 'top-paths' }).getByTestId('top-paths')).toBeTruthy()
  })

  it('is an ordered list named by ariaLabel with one item per row', () => {
    const view = mount()
    const list = view.getByRole('list', { name: 'Top paths' })
    expect(list.tagName).toBe('OL')
    expect(view.getAllByRole('listitem')).toHaveLength(ITEMS.length)
  })

  it('sorts descending by default', () => {
    expect(names(mount())).toEqual(['/home', '/documentation', '/blocks', '/imprint'])
  })

  it('sorts ascending, or keeps the given order with none', () => {
    const ascending = mount({ sort: 'ascending' })
    expect(names(ascending)).toEqual(['/imprint', '/blocks', '/documentation', '/home'])
    ascending.unmount()
    expect(names(mount({ sort: 'none' }))).toEqual([
      '/blocks',
      '/home',
      '/imprint',
      '/documentation'
    ])
  })

  it('formats the value column compactly by default and with formatValue', () => {
    const fallback = mount({ items: [{ name: '/home', value: 48210 }] })
    expect(fallback.getByTestId('chart-bar-list__value').textContent?.trim()).toBe('48.2K')
    fallback.unmount()
    const custom = mount({
      items: [{ name: '/home', value: 843 }],
      formatValue: (value: number) => `${value} req`
    })
    expect(custom.getByTestId('chart-bar-list__value').textContent?.trim()).toBe('843 req')
  })

  it('reads name then value in each row and hides the bar', () => {
    const view = mount({ items: [{ name: '/home', value: 843 }] })
    expect(rowText(view.getByTestId('chart-bar-list__row'))).toBe('/home, 843')
    expect(view.getByTestId('chart-bar-list__bar').getAttribute('aria-hidden')).toBe('true')
  })

  it('renders static rows that are neither links nor buttons', () => {
    const view = mount()
    expect(view.queryAllByRole('button')).toHaveLength(0)
    expect(view.queryAllByRole('link')).toHaveLength(0)
    expect(view.getAllByTestId('chart-bar-list__row')[0].hasAttribute('data-interactive')).toBe(
      false
    )
  })

  it('renders an href row as a link that emits item-click with the event and the item', async () => {
    const item = { id: 'home', name: '/home', value: 843, href: '#home' }
    const view = mount({ items: [item, { name: '/blocks', value: 108 }] })
    const link = view.getByRole('link', { name: /\/home/ })
    expect(link.getAttribute('href')).toBe('#home')
    expect(link.hasAttribute('data-interactive')).toBe(true)
    expect(view.queryAllByRole('button')).toHaveLength(0)

    await fireEvent.click(link)
    const emitted = view.emitted('item-click') as unknown[][]
    expect(emitted).toHaveLength(1)
    expect(emitted[0][0]).toBeInstanceOf(MouseEvent)
    expect(emitted[0][1]).toEqual(item)
  })

  it('renders clickable rows as buttons that emit item-click with the event and the item', async () => {
    const view = mount({ clickable: true })
    const buttons = view.getAllByRole('button')
    expect(buttons).toHaveLength(ITEMS.length)
    expect(buttons[0].getAttribute('type')).toBe('button')

    await fireEvent.click(buttons[0])
    const emitted = view.emitted('item-click') as unknown[][]
    expect(emitted).toHaveLength(1)
    expect(emitted[0][0]).toBeInstanceOf(MouseEvent)
    expect(emitted[0][1]).toEqual({ name: '/home', value: 843 })
  })

  it('does not emit item-click from a static row', async () => {
    const view = mount()
    await fireEvent.click(view.getAllByTestId('chart-bar-list__row')[0])
    expect(view.emitted('item-click')).toBeUndefined()
  })

  it('renders the skeleton and marks the list busy while loading', () => {
    const view = mount({ loading: true })
    const root = view.getByTestId('chart-bar-list')
    expect(root.getAttribute('aria-busy')).toBe('true')
    expect(root.hasAttribute('data-loading')).toBe(true)
    expect(view.getByTestId('chart-bar-list__skeleton')).toBeTruthy()
    expect(view.queryAllByTestId('chart-bar-list__row')).toHaveLength(0)
  })

  it('renders the empty state titled by emptyTitle when there are no items', () => {
    const fallback = mount({ items: [] })
    expect(fallback.getByTestId('chart-bar-list__empty').textContent).toContain('No data available')
    expect(fallback.queryAllByTestId('chart-bar-list__row')).toHaveLength(0)
    fallback.unmount()
    const custom = mount({ items: [], emptyTitle: 'No paths in this range' })
    expect(custom.getByTestId('chart-bar-list__empty').textContent).toContain(
      'No paths in this range'
    )
  })

  it('has no a11y violations across static, interactive, loading and empty renders', async () => {
    for (const props of [
      {},
      { clickable: true },
      { items: [{ name: '/home', value: 843, href: '#home' }] },
      { loading: true },
      { items: [] }
    ]) {
      const view = mount(props)
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
  })
})
