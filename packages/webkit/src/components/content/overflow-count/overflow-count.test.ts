import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h } from 'vue'

import Default from '../../../../examples/overflow-count/default.vue'
import LongList from '../../../../examples/overflow-count/long-list.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import OverflowCount from './overflow-count.vue'

const byTestId = (id: string): HTMLElement | null =>
  document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)
const allByTestId = (id: string): HTMLElement[] =>
  Array.from(document.body.querySelectorAll<HTMLElement>(`[data-testid="${id}"]`))
const trigger = (): HTMLElement =>
  document.body.querySelector<HTMLElement>('[data-testid="content-overflow-count__trigger"]')!

const tags = Array.from({ length: 33 }, (_, index) => `tag-${index + 1}`)

afterEach(() => cleanup())

describe('OverflowCount', () => {
  it('renders nothing for an empty list', () => {
    render(OverflowCount, { props: { items: [] } })
    expect(byTestId('content-overflow-count')).toBeNull()
  })

  it('shows +N and names the trigger with the count and noun', () => {
    const view = render(Default)
    expect(view.getByText('+3')).toBeTruthy()
    expect(view.getByRole('button', { name: 'Show all 3 domains' })).toBeTruthy()
  })

  it('opens a list of links that open in a new tab', async () => {
    const view = render(Default)
    await fireEvent.click(view.getByRole('button', { name: 'Show all 3 domains' }))
    await waitFor(() => expect(byTestId('content-overflow-count__summary')).not.toBeNull())
    expect(byTestId('content-overflow-count__summary')!.textContent).toContain('3 domains')
    const links = allByTestId('content-overflow-count__item').map((item) =>
      item.querySelector('a')!
    )
    expect(links).toHaveLength(3)
    expect(links[0].getAttribute('target')).toBe('_blank')
    expect(links[0].getAttribute('rel')).toBe('noopener noreferrer')
    expect(links[0].textContent).toContain('(opens in a new tab)')
    expect(byTestId('content-overflow-count__search')).toBeNull()
  })

  it('does not bubble the trigger click to a clickable row', async () => {
    let rowClicks = 0
    const Host = defineComponent({
      render: () =>
        h('div', { onClick: () => (rowClicks += 1) }, [h(OverflowCount, { items: ['a', 'b'] })])
    })
    render(Host)
    await fireEvent.click(trigger().querySelector('button') ?? trigger())
    expect(rowClicks).toBe(0)
  })

  it('searches past 7 items, pages by 10 and quotes a query with no match', async () => {
    render(OverflowCount, { props: { items: tags, noun: { one: 'tag', other: 'tags' } } })
    await fireEvent.click(trigger().querySelector('button') ?? trigger())
    await waitFor(() => expect(byTestId('content-overflow-count__summary')).not.toBeNull())
    expect(byTestId('content-overflow-count__summary')!.textContent).toContain('10 of 33 tags')
    expect(allByTestId('content-overflow-count__item')).toHaveLength(10)

    const loadMore = byTestId('content-overflow-count__load-more')!
    expect(loadMore.textContent).toContain('Load 10 more')
    await fireEvent.click(loadMore)
    expect(allByTestId('content-overflow-count__item')).toHaveLength(20)

    const search = byTestId('content-overflow-count__search') as HTMLInputElement
    await userEvent.fill(search, 'tag-3')
    await waitFor(() => expect(allByTestId('content-overflow-count__item')).toHaveLength(5))
    expect(byTestId('content-overflow-count__summary')!.textContent).toContain('5 of 33 tags')
    expect(byTestId('content-overflow-count__load-more')).toBeNull()

    await userEvent.fill(search, 'nothing')
    await waitFor(() => expect(byTestId('content-overflow-count__no-match')).not.toBeNull())
    expect(byTestId('content-overflow-count__no-match')!.textContent).toContain('“nothing”')
  })

  it('resets the query and paging when it closes', async () => {
    render(OverflowCount, { props: { items: tags } })
    const control = trigger().querySelector('button') ?? trigger()
    await fireEvent.click(control)
    await waitFor(() => expect(byTestId('content-overflow-count__load-more')).not.toBeNull())
    await fireEvent.click(byTestId('content-overflow-count__load-more')!)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(byTestId('content-overflow-count__summary')).toBeNull())
    await fireEvent.click(control)
    await waitFor(() => expect(allByTestId('content-overflow-count__item')).toHaveLength(10))
  })

  it('renders the item slot', async () => {
    const Host = defineComponent({
      render: () =>
        h(
          OverflowCount,
          { items: [{ label: 'Edge app' }] },
          { item: ({ item }: { item: { label: string } }) => h('strong', `#${item.label}`) }
        )
    })
    render(Host)
    await fireEvent.click(trigger().querySelector('button') ?? trigger())
    await waitFor(() => expect(document.body.textContent).toContain('#Edge app'))
  })

  it('reads the active locale', () => {
    const Host = defineComponent({
      render: () =>
        h(
          WebkitProvider,
          { locale: 'pt-BR', catalogs: LOCALES },
          { default: () => h(OverflowCount, { items: ['a', 'b'] }) }
        )
    })
    const view = render(Host)
    expect(view.getByRole('button', { name: 'Ver lista completa: 2 itens' })).toBeTruthy()
  })

  it('keeps the chip under rtl', () => {
    const Host = defineComponent({
      render: () => h('div', { dir: 'rtl' }, [h(OverflowCount, { items: ['a', 'b'] })])
    })
    const view = render(Host)
    expect(view.getByText('+2')).toBeTruthy()
  })

  it('has no axe violations, closed and open', async () => {
    for (const example of [Default, LongList]) {
      const view = render(example)
      await expectNoA11yViolations(view.container)
      await fireEvent.click(trigger().querySelector('button') ?? trigger())
      await waitFor(() => expect(byTestId('content-overflow-count__summary')).not.toBeNull())
      await expectNoA11yViolations(
        byTestId('content-overflow-count__summary')!.closest<HTMLElement>('[role="dialog"]')!
      )
      view.unmount()
      cleanup()
    }
  })
})
