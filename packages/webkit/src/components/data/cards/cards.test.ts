import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/cards/default.vue'
import Selectable from '../../../../examples/cards/selectable.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Cards from './cards.vue'

const items = [
  { id: 'a', name: 'Alpha' },
  { id: 'b', name: 'Bravo' },
  { id: 'c', name: 'Charlie' }
]

const slots = { header: '<template #header="{ item }">{{ item.name }}</template>' }

describe('Cards', () => {
  it('renders one card per item in a named list', () => {
    const view = render(Default)
    const list = view.getByRole('list', { name: 'Items' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(4)
  })

  it('selects cards one by one and all at once', async () => {
    const view = render(Cards, { props: { items, selectionMode: 'multi' }, slots })
    await fireEvent.click(view.getByRole('checkbox', { name: 'Bravo' }))
    expect(view.emitted()['update:selectedKeys']?.at(-1)).toEqual([['b']])
    await fireEvent.click(view.getByLabelText('Select all items'))
    expect(view.emitted()['update:selectedKeys']?.at(-1)).toEqual([['a', 'b', 'c']])
    expect(
      view.getAllByTestId('data-cards__card').every((c) => c.hasAttribute('data-selected'))
    ).toBe(true)
  })

  it('keeps one card in single selection, without a select-all', async () => {
    const view = render(Cards, {
      props: { items, selectionMode: 'single', selectedKeys: ['a'] },
      slots
    })
    expect(view.queryByTestId('data-cards__select-all')).toBeNull()
    await fireEvent.click(view.getByRole('radio', { name: 'Charlie' }))
    expect(view.emitted()['update:selectedKeys']?.at(-1)).toEqual([['c']])
  })

  it('shows placeholders while loading and the empty state without items', () => {
    const loading = render(Cards, { props: { items, loading: true } })
    expect(loading.getAllByTestId('data-cards__skeleton')).toHaveLength(6)
    expect(loading.getByTestId('data-cards').getAttribute('aria-busy')).toBe('true')
    loading.unmount()
    const empty = render(Cards, { props: { items: [] } })
    expect(empty.getByText('No items yet')).toBeTruthy()
  })

  it('keeps the selection across pages with useCollection', async () => {
    const view = render(Selectable)
    await fireEvent.click(view.getByLabelText('Select all items'))
    expect(view.getByRole('status').textContent).toContain('6 selected')
    await fireEvent.click(view.getByRole('button', { name: 'Next page' }))
    await fireEvent.click(view.getByRole('checkbox', { name: 'Edge node 7' }))
    expect(view.getByRole('status').textContent).toContain('7 selected')
  })

  it('has no axe violations', async () => {
    const view = render(Cards, { props: { items, selectionMode: 'multi' }, slots })
    await expectNoA11yViolations(view.container)
    view.unmount()
    const plain = render(Default)
    await expectNoA11yViolations(plain.container)
  })
})
