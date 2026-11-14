import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/cards/default.vue'
import EmptyExample from '../../../../examples/cards/empty.vue'
import LoadingExample from '../../../../examples/cards/loading.vue'
import Selectable from '../../../../examples/cards/selectable.vue'
import SingleSelection from '../../../../examples/cards/single-selection.vue'
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

  it('mounts a long list in chunks and still selects every item at once', async () => {
    const many = Array.from({ length: 1000 }, (_, i) => ({ id: `k${i}`, name: `Item ${i}` }))
    const view = render(Cards, { props: { items: many, selectionMode: 'multi' }, slots })
    const cards = view.getAllByTestId('data-cards__card')
    expect(cards.length).toBeGreaterThan(0)
    expect(cards.length).toBeLessThan(many.length)
    await fireEvent.click(view.getByLabelText('Select all items'))
    expect(view.emitted()['update:selectedKeys']?.at(-1)).toEqual([many.map((item) => item.id)])
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

  it('renders the data-testid fallback and lets a consumer data-testid win', () => {
    const fallback = render(Cards, { props: { items }, slots })
    expect(fallback.getByTestId('data-cards')).toBeTruthy()
    fallback.unmount()
    const view = render(Cards, { props: { items }, slots, attrs: { 'data-testid': 'apps' } })
    expect(view.getByTestId('apps')).toBeTruthy()
    expect(view.queryByTestId('data-cards')).toBeNull()
    expect(view.getAllByTestId('apps__card')).toHaveLength(3)
  })

  it('replaces the default empty state with the empty slot', () => {
    const view = render(EmptyExample)
    expect(view.getByText('No applications yet')).toBeTruthy()
    expect(view.queryByText('No items yet')).toBeNull()
    expect(view.getByRole('button', { name: 'Create application' })).toBeTruthy()
  })

  it('renders the loading and single selection examples without axe violations', async () => {
    for (const example of [LoadingExample, SingleSelection]) {
      const view = render(example)
      await expectNoA11yViolations(view.container)
      view.unmount()
    }
    const single = render(SingleSelection)
    expect((single.getByRole('radio', { name: 'Pro' }) as HTMLInputElement).checked).toBe(true)
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
