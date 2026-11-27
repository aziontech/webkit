import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import DetailCustomer from '../../../../blocks/detail/detail-customer/detail-customer.vue'
import { sampleTickets } from '../../../../blocks/detail/detail-customer/sample'
import Activity from '../../../../blocks/detail/detail-customer/variants/activity.vue'
import ErrorState from '../../../../blocks/detail/detail-customer/variants/error.vue'
import Loading from '../../../../blocks/detail/detail-customer/variants/loading.vue'
import NoTickets from '../../../../blocks/detail/detail-customer/variants/no-tickets.vue'
import Notes from '../../../../blocks/detail/detail-customer/variants/notes.vue'
import { expectNoA11yViolations } from '../../axe'

afterEach(() => cleanup())

describe('detail/detail-customer', () => {
  it('names the customer in the only h1 and lists the details with copy buttons', async () => {
    const view = render(DetailCustomer)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Jane Doe')
    expect(screen.getByRole('link', { name: /Acme Inc\./ })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Copy email' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Copy phone number' })).toBeTruthy()
    expect(screen.getByRole('img', { name: /4\.5 out of 5/ })).toBeTruthy()
    expect(screen.getByText(/from 12 surveys/)).toBeTruthy()
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('stacks each ticket into a card on a phone, with its status under the subject', async () => {
    const host = document.createElement('div')
    host.style.width = '360px'
    document.body.appendChild(host)
    const view = render(DetailCustomer, { container: host })
    const table = view.getByTestId('data-table')
    await waitFor(() => expect(table.hasAttribute('data-stacked')).toBe(true))
    const labels = view.getAllByTestId('data-table__stacked-label').map((el) => el.textContent)
    expect(labels).toContain('Status')
    host.remove()
  })

  it('keeps the three header actions in one row so a phone does not stack them', () => {
    render(DetailCustomer)
    const row = screen.getByRole('button', { name: 'Edit' }).parentElement as HTMLElement
    expect(within(row).getByRole('button', { name: 'More actions' })).toBeTruthy()
    expect(within(row).getByRole('button', { name: 'New ticket' })).toBeTruthy()
  })

  it('emits the header actions with the DOM event first', async () => {
    const view = render(DetailCustomer)
    await fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    await fireEvent.click(screen.getByRole('button', { name: 'New ticket' }))
    expect((view.emitted('edit') as [MouseEvent][])[0][0]).toBeInstanceOf(MouseEvent)
    expect((view.emitted('new-ticket') as [MouseEvent][])[0][0]).toBeInstanceOf(MouseEvent)
    await fireEvent.click(screen.getByRole('button', { name: 'More actions' }))
    await fireEvent.click(await screen.findByRole('menuitem', { name: 'Delete customer' }))
    await waitFor(() =>
      expect((view.emitted('customer-action') as [Event, string][] | undefined)?.[0]?.[1]).toBe(
        'delete'
      )
    )
  })

  it('opens a ticket from its subject and gives every row its status, priority and deadline', async () => {
    const view = render(DetailCustomer)
    const table = screen.getByRole('table')
    expect(within(table).getAllByRole('row')).toHaveLength(sampleTickets.length + 1)
    expect(within(table).getByText('Pending')).toBeTruthy()
    expect(within(table).getAllByText('No SLA running')).toHaveLength(2)
    const link = within(table).getByRole('link', { name: /certificate error/ })
    link.addEventListener('click', (event) => event.preventDefault())
    await fireEvent.click(link)
    const [[event, ticket]] = view.emitted('open-ticket') as [[MouseEvent, { id: string }]]
    expect(event).toBeInstanceOf(MouseEvent)
    expect(ticket).toMatchObject({ id: '4812' })
  })

  it('switches tabs through the tab model', async () => {
    const view = render(DetailCustomer)
    await fireEvent.click(screen.getByRole('tab', { name: 'Activity' }))
    expect(view.emitted('update:tab')).toEqual([['activity']])
  })

  it('groups the activity by day', () => {
    render(Activity)
    const list = screen.getByRole('list', { name: 'Activity of Jane Doe' })
    expect(within(list).getByText('Ticket #4793 merged into #4790')).toBeTruthy()
    expect(document.querySelectorAll('[data-testid="timeline-group"]').length).toBe(3)
  })

  it('asks for text before it emits a note, then emits the trimmed text', async () => {
    render(Notes)
    expect(screen.getAllByText('Internal note').length).toBe(2)
    cleanup()
    const view = render(DetailCustomer, { props: { tab: 'notes' } })
    await fireEvent.click(screen.getByRole('button', { name: 'Add note' }))
    expect(screen.getByText('Write the note first.')).toBeTruthy()
    const field = screen.getByLabelText('Add a note') as HTMLTextAreaElement
    await fireEvent.update(field, '  Called back about the invoice.  ')
    await fireEvent.click(screen.getByRole('button', { name: 'Add note' }))
    expect((view.emitted('add-note') as [MouseEvent, string][])[0][1]).toBe(
      'Called back about the invoice.'
    )
  })

  it('shows the empty state with New ticket for a new customer', async () => {
    render(NoTickets)
    expect(screen.getByText('No tickets yet')).toBeTruthy()
    expect(screen.getByText('No ratings yet')).toBeTruthy()
    expect(screen.getAllByRole('button', { name: 'New ticket' })).toHaveLength(2)
  })

  it('never shows the sample while loading or failed', async () => {
    const loading = render(Loading)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Customer')
    expect(screen.queryByText('Jane Doe')).toBeNull()
    expect(loading.container.querySelector('[aria-busy="true"]')).toBeTruthy()
    expect((screen.getByRole('button', { name: 'Edit' }) as HTMLButtonElement).disabled).toBe(true)
    cleanup()
    render(ErrorState)
    expect(screen.getByText("Couldn't load this customer")).toBeTruthy()
    cleanup()
    const failed = render(DetailCustomer, { props: { error: 'Check your connection and retry.' } })
    expect(screen.queryByText('Jane Doe')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Edit' })).toBeNull()
    await fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(failed.emitted('retry')).toHaveLength(1)
  })
})
