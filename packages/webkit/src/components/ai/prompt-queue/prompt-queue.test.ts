import userEvent from '@testing-library/user-event'
import { render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import DefaultExample from '../../../../examples/prompt-queue/default.vue'
import LongMessageExample from '../../../../examples/prompt-queue/long-message.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import PromptQueue from './prompt-queue.vue'

const items = [
  { id: 'q1', text: 'Also purge the cache for app.example.com' },
  { id: 'q2', text: 'Then show me the error rate for the last hour', attachmentCount: 2 }
]

describe('PromptQueue', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(render(PromptQueue, { props: { items } }).getByTestId('prompt-queue')).toBeTruthy()
    expect(
      render(PromptQueue, { props: { items }, attrs: { 'data-testid': 'mine' } }).getByTestId(
        'mine'
      )
    ).toBeTruthy()
  })

  it('lists the waiting messages in order in a named ordered list', () => {
    const { getByRole, getByTestId } = render(PromptQueue, { props: { items } })
    const list = getByRole('list', { name: 'Queued messages' })
    expect(list.tagName).toBe('OL')
    const rows = within(list).getAllByRole('listitem')
    expect(rows.map((row) => row.textContent)).toEqual([
      expect.stringContaining(items[0]!.text),
      expect.stringContaining(items[1]!.text)
    ])
    expect(getByTestId('prompt-queue__title')).toHaveTextContent('2 messages queued')
  })

  it('takes the list name from ariaLabel', () => {
    const { getByRole } = render(PromptQueue, {
      props: { items },
      attrs: { 'aria-label': 'Waiting prompts' }
    })
    expect(getByRole('list', { name: 'Waiting prompts' })).toBeTruthy()
  })

  it('shows the attachment count only when above zero', () => {
    const { getAllByTestId } = render(PromptQueue, { props: { items } })
    const counts = getAllByTestId('prompt-queue__attachments')
    expect(counts).toHaveLength(1)
    expect(counts[0]).toHaveTextContent('2 attachments')
  })

  it('names each remove button and describes it with its message', () => {
    const { getAllByRole } = render(PromptQueue, { props: { items } })
    const buttons = getAllByRole('button', { name: 'Remove from queue' })
    expect(buttons).toHaveLength(2)
    expect(buttons[1]).toHaveAccessibleDescription(items[1]!.text)
  })

  it('emits remove with the event and the item on click and on Enter', async () => {
    const { getAllByRole, emitted } = render(PromptQueue, { props: { items } })
    await userEvent.click(getAllByRole('button')[0] as HTMLElement)
    const [pointer, first] = emitted('remove')![0] as [Event, unknown]
    expect(pointer).toBeInstanceOf(MouseEvent)
    expect(first).toEqual(items[0])
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    const [keyboard, second] = emitted('remove')![1] as [Event, unknown]
    expect(keyboard).toBeInstanceOf(Event)
    expect(second).toEqual(items[1])
  })

  it('draws no box when empty but keeps the status region', () => {
    const { getByTestId, queryByRole, getByRole } = render(PromptQueue)
    expect(getByTestId('prompt-queue')).toHaveAttribute('data-empty')
    expect(queryByRole('list')).toBeNull()
    expect(getByRole('status')).toHaveTextContent('')
  })

  it('announces nothing on mount and every count change after it', async () => {
    const { getByRole, rerender } = render(PromptQueue, { props: { items } })
    const status = getByRole('status')
    expect(status).toHaveTextContent('')
    await rerender({ items: [items[0]!] })
    expect(status).toHaveTextContent('1 message queued')
    await rerender({ items: [] })
    expect(status).toHaveTextContent('No messages queued')
    await rerender({ items })
    expect(status).toHaveTextContent('2 messages queued')
  })

  it('moves focus to the button now at that position after a removal', async () => {
    const { getByTestId, getAllByRole } = render(DefaultExample)
    const queue = getByTestId('prompt-queue')
    const first = within(queue).getAllByRole('button', { name: 'Remove from queue' })[0]!
    first.focus()
    await userEvent.keyboard('{Enter}')
    const remaining = within(queue).getAllByRole('button', { name: 'Remove from queue' })
    expect(remaining).toHaveLength(1)
    await waitFor(() => expect(document.activeElement).toBe(remaining[0]))
    expect(getAllByRole('listitem')).toHaveLength(1)
  })

  it('moves focus to the last button when the owner sends the focused last row', async () => {
    const { getAllByRole, rerender } = render(PromptQueue, { props: { items } })
    const last = getAllByRole('button')[1]!
    last.focus()
    await rerender({ items: [items[0]!] })
    await waitFor(() => expect(document.activeElement).toBe(getAllByRole('button')[0]))
  })

  it('follows the document direction and isolates message text', () => {
    const { getByTestId, getByText } = render(PromptQueue, {
      props: { items },
      attrs: { dir: 'rtl' }
    })
    expect(getByTestId('prompt-queue')).toHaveAttribute('dir', 'rtl')
    expect(getByText(items[0]!.text)).toHaveAttribute('dir', 'auto')
  })

  it('has no axe violations, populated and empty', async () => {
    await expectNoA11yViolations(render(PromptQueue, { props: { items } }).container)
    await expectNoA11yViolations(render(PromptQueue).container)
    await expectNoA11yViolations(render(LongMessageExample).container)
  })
})
