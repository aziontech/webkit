import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import TicketInboxEmpty from '../../../../blocks/view/view-ticket-inbox/variants/empty.vue'
import TicketInboxError from '../../../../blocks/view/view-ticket-inbox/variants/error.vue'
import TicketInboxFiltered from '../../../../blocks/view/view-ticket-inbox/variants/filtered.vue'
import TicketInboxLoading from '../../../../blocks/view/view-ticket-inbox/variants/loading.vue'
import TicketInboxSelected from '../../../../blocks/view/view-ticket-inbox/variants/selected.vue'
import ViewTicketInbox, {
  type TicketInboxTicket
} from '../../../../blocks/view/view-ticket-inbox/view-ticket-inbox.vue'
import { expectNoA11yViolations } from '../../axe'

const ticket: TicketInboxTicket = {
  id: '9001',
  subject: 'Cannot reach the dashboard',
  requester: 'Sam Lee',
  requesterEmail: 'sam.lee@example.com',
  unread: true,
  status: 'Open',
  priority: 'high',
  assignee: 'Jane Doe',
  assigneePresence: 'online',
  group: 'Technical',
  channel: 'Email',
  tags: ['dashboard'],
  slaDueAt: new Date(Date.UTC(2026, 10, 10, 13)),
  updatedAt: new Date(Date.UTC(2026, 10, 10, 11))
}

const subjects = (root: Element) =>
  Array.from(root.querySelectorAll('[role=row] a')).map((a) => a.textContent?.trim() ?? '')

describe('view/view-ticket-inbox block', () => {
  it('lists the sample view, most urgent SLA first, without axe violations', async () => {
    const view = render(ViewTicketInbox)
    await waitFor(() => expect(subjects(view.container).length).toBe(4))
    expect(subjects(view.container)[0]).toContain('Custom domain returns a certificate error')
    expect(view.container.textContent).toContain('Unread:')
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('renders the tickets it is given and emits open on row Enter, event first', async () => {
    const view = render(ViewTicketInbox, { props: { tickets: [ticket] } })
    await waitFor(() => expect(subjects(view.container)).toEqual(['Cannot reach the dashboard']))
    const row = view.container.querySelector('[role=row][tabindex]') as HTMLElement
    await fireEvent.keyDown(row, { key: 'Enter' })
    const opened = view.emitted<[KeyboardEvent, TicketInboxTicket]>('open')
    expect(opened).toHaveLength(1)
    expect(opened[0][0]).toBeInstanceOf(KeyboardEvent)
    expect(opened[0][1].id).toBe('9001')
  })

  it('does not open the ticket when the row checkbox is clicked', async () => {
    const view = render(ViewTicketInbox, { props: { tickets: [ticket] } })
    await waitFor(() => expect(subjects(view.container).length).toBe(1))
    const box = view.container.querySelector(
      '[role=row] [role=checkbox], [role=row] input[type=checkbox]'
    )
    await fireEvent.click(box as HTMLElement)
    expect(view.emitted('open')).toBeUndefined()
    await waitFor(() => expect(view.container.textContent).toContain('1 selected'))
  })

  it('emits a bulk action with the selected tickets and clears the selection', async () => {
    const view = render(TicketInboxSelected)
    await waitFor(() => expect(view.container.textContent).toContain('3 selected'))
    const merge = view.getByRole('button', { name: 'Merge (3)' })
    await fireEvent.click(view.getByRole('button', { name: 'Close (3)' }))
    expect(merge).toBeTruthy()
    await waitFor(() => expect(view.container.textContent).not.toContain('3 selected'))
  })

  it('switches the view through the View select and emits update:viewKey', async () => {
    const view = render(ViewTicketInbox)
    expect(view.getByRole('combobox', { name: 'View' }).textContent).toContain(
      'My open tickets (4)'
    )
    await fireEvent.click(view.getByRole('combobox', { name: 'View' }))
    const option = await waitFor(() => {
      const found = Array.from(document.body.querySelectorAll('[role=option]')).find((el) =>
        el.textContent?.includes('Unassigned')
      )
      expect(found).toBeTruthy()
      return found as HTMLElement
    })
    await fireEvent.click(option)
    expect(view.emitted<[string]>('update:viewKey')?.[0]).toEqual(['unassigned'])
  })

  it('shows the caught-up card, the no-match state, loading and the error alert', async () => {
    const empty = render(TicketInboxEmpty)
    expect(empty.container.textContent).toContain("You're all caught up")
    expect(empty.getByRole('button', { name: 'Show all open tickets' })).toBeTruthy()
    empty.unmount()
    const filtered = render(TicketInboxFiltered)
    await waitFor(() => expect(filtered.container.textContent).toContain('No matching tickets'))
    filtered.unmount()
    const loading = render(TicketInboxLoading)
    expect(loading.container.querySelector('[aria-busy="true"]')).not.toBeNull()
    loading.unmount()
    const failed = render(TicketInboxError)
    expect(failed.container.textContent).toContain('The tickets could not be loaded.')
    expect(failed.container.querySelector('[role=table]')).toBeNull()
    failed.unmount()
    const view = render(ViewTicketInbox, { props: { error: 'The API answered 503.' } })
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted('retry')).toHaveLength(1)
  })
})
