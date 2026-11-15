import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/card-list/default.vue'
import EmptyExample from '../../../../examples/card-list/empty.vue'
import LoadingExample from '../../../../examples/card-list/loading.vue'
import Selectable from '../../../../examples/card-list/selectable.vue'
import SingleSelection from '../../../../examples/card-list/single-selection.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import CardList from './card-list.vue'

const items = [
  { id: 'a', name: 'Alpha' },
  { id: 'b', name: 'Bravo' },
  { id: 'c', name: 'Charlie' }
]

const slots = { header: '<template #header="{ item }">{{ item.name }}</template>' }

describe('CardList', () => {
  it('renders one card per item in a named list', () => {
    const view = render(Default)
    const list = view.getByRole('list', { name: 'Items' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(4)
  })

  it('selects cards one by one and all at once', async () => {
    const view = render(CardList, { props: { items, selectionMode: 'multiple' }, slots })
    await fireEvent.click(view.getByRole('checkbox', { name: 'Bravo' }))
    expect(view.emitted()['update:selectedKeys']?.at(-1)).toEqual([['b']])
    await fireEvent.click(view.getByLabelText('Select all items'))
    expect(view.emitted()['update:selectedKeys']?.at(-1)).toEqual([['a', 'b', 'c']])
    expect(
      view.getAllByTestId('data-card-list__card').every((c) => c.hasAttribute('data-selected'))
    ).toBe(true)
  })

  it('mounts a long list in chunks and still selects every item at once', async () => {
    const many = Array.from({ length: 1000 }, (_, i) => ({ id: `k${i}`, name: `Item ${i}` }))
    const view = render(CardList, { props: { items: many, selectionMode: 'multiple' }, slots })
    const cards = view.getAllByTestId('data-card-list__card')
    expect(cards.length).toBeGreaterThan(0)
    expect(cards.length).toBeLessThan(many.length)
    await fireEvent.click(view.getByLabelText('Select all items'))
    expect(view.emitted()['update:selectedKeys']?.at(-1)).toEqual([many.map((item) => item.id)])
  })

  it('keeps one card in single selection, without a select-all', async () => {
    const view = render(CardList, {
      props: { items, selectionMode: 'single', selectedKeys: ['a'] },
      slots
    })
    expect(view.queryByTestId('data-card-list__select-all')).toBeNull()
    await fireEvent.click(view.getByRole('radio', { name: 'Charlie' }))
    expect(view.emitted()['update:selectedKeys']?.at(-1)).toEqual([['c']])
  })

  it('puts the single-selection radio at the end of the card header, named by the header', () => {
    const view = render(CardList, {
      props: { items, selectionMode: 'single' },
      slots
    })
    const radio = view.getByRole('radio', { name: 'Charlie' })
    const card = radio.closest('[data-testid="data-card-list__card"]') as HTMLElement
    const header = within(card).getByText('Charlie')
    expect(header.closest('label')).toBeNull()
    expect(header.compareDocumentPosition(radio) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('shows placeholders while loading and the empty state without items', () => {
    const loading = render(CardList, { props: { items, loading: true } })
    expect(loading.getAllByTestId('data-card-list__skeleton')).toHaveLength(6)
    expect(loading.getByTestId('data-card-list').getAttribute('aria-busy')).toBe('true')
    loading.unmount()
    const empty = render(CardList, { props: { items: [] } })
    expect(empty.getByText('No items yet')).toBeTruthy()
  })

  it('renders the data-testid fallback and lets a consumer data-testid win', () => {
    const fallback = render(CardList, { props: { items }, slots })
    expect(fallback.getByTestId('data-card-list')).toBeTruthy()
    fallback.unmount()
    const view = render(CardList, { props: { items }, slots, attrs: { 'data-testid': 'apps' } })
    expect(view.getByTestId('apps')).toBeTruthy()
    expect(view.queryByTestId('data-card-list')).toBeNull()
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
    const view = render(CardList, { props: { items, selectionMode: 'multiple' }, slots })
    await expectNoA11yViolations(view.container)
    view.unmount()
    const plain = render(Default)
    await expectNoA11yViolations(plain.container)
  })
})
