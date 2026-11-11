import { cleanup, fireEvent, render, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'

import Default from '../../../../examples/conversation-history/default.vue'
import States from '../../../../examples/conversation-history/states.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import ConversationHistory from './conversation-history.vue'

afterEach(() => cleanup())

const now = '2026-11-11T15:00:00'
const items = [
  { id: 'a', title: 'Older one', updatedAt: '2026-01-01T10:00:00' },
  { id: 'b', title: 'Earlier today', updatedAt: '2026-11-11T08:00:00' },
  { id: 'c', title: 'Later today', updatedAt: '2026-11-11T12:00:00' },
  { id: 'd', title: 'Late yesterday', updatedAt: '2026-11-10T23:30:00' },
  { id: 'e', title: 'Last week', updatedAt: '2026-11-06T10:00:00' },
  { id: 'f', title: 'Last month', updatedAt: '2026-10-20T10:00:00' }
]

describe('ConversationHistory', () => {
  it('groups by calendar day, newest first, inside a named nav', () => {
    const view = render(ConversationHistory, { props: { items, now } })
    const nav = view.getByRole('navigation', { name: 'Conversation history' })
    const lists = within(nav).getAllByRole('list')
    expect(
      lists.map(
        (list) =>
          list.getAttribute('aria-labelledby') &&
          document.getElementById(list.getAttribute('aria-labelledby')!)!.textContent!.trim()
      )
    ).toEqual(['Today', 'Yesterday', 'Previous 7 days', 'Previous 30 days', 'Older'])
    expect(
      within(lists[0]!)
        .getAllByRole('button')
        .map((b) => b.textContent!.trim())
    ).toEqual(['Later today', 'Earlier today'])
    expect(within(lists[1]!).getByRole('button')).toHaveTextContent('Late yesterday')
  })

  it('marks the open conversation current and selects another', async () => {
    const view = render(ConversationHistory, { props: { items, now, modelValue: 'b' } })
    expect(view.getByRole('button', { name: 'Earlier today' })).toHaveAttribute(
      'aria-current',
      'page'
    )
    await fireEvent.click(view.getByRole('button', { name: 'Last week' }))
    expect(view.emitted('update:modelValue')![0]).toEqual(['e'])
  })

  it('emits remove from a named Delete button', async () => {
    const view = render(ConversationHistory, { props: { items, now, removable: true } })
    await fireEvent.click(view.getByRole('button', { name: 'Delete Last month' }))
    expect(view.emitted('remove')![0]).toEqual(['f'])
  })

  it('shows loading and empty states', () => {
    const view = render(States)
    const [loading, empty] = view.getAllByRole('navigation')
    expect(loading).toHaveAttribute('aria-busy', 'true')
    expect(within(empty!).getByText('No conversations yet.')).toBeTruthy()
  })

  it('reads its strings from the locale catalog', () => {
    const view = render(WebkitProvider, {
      props: { locale: 'pt-BR', catalogs: LOCALES },
      slots: { default: () => h(ConversationHistory, { items, now, removable: true }) }
    })
    expect(view.getByRole('navigation', { name: 'Histórico de conversas' })).toBeTruthy()
    expect(view.getByText('Ontem')).toBeTruthy()
    expect(view.getByRole('button', { name: 'Excluir Older one' })).toBeTruthy()
  })

  it('isolates titles under rtl', () => {
    const host = document.createElement('div')
    host.dir = 'rtl'
    document.body.appendChild(host)
    const view = render(ConversationHistory, { props: { items, now }, container: host })
    expect(view.getByText('Older one').tagName).toBe('BDI')
    host.remove()
  })

  it('removes a row in the example and has no axe violations', async () => {
    const view = render(Default)
    await expectNoA11yViolations(view.container)
    await fireEvent.click(view.getByRole('button', { name: 'Delete Edge storage pricing' }))
    expect(view.queryByText('Edge storage pricing')).toBeNull()
    const states = render(States)
    await expectNoA11yViolations(states.container)
  })
})
