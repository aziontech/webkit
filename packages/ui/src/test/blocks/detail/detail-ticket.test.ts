import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import DetailTicket, {
  type DetailTicketPropertyChange,
  type DetailTicketSendPayload
} from '../../../../blocks/detail/detail-ticket/detail-ticket.vue'
import DetailTicketError from '../../../../blocks/detail/detail-ticket/variants/error.vue'
import DetailTicketInternalNote from '../../../../blocks/detail/detail-ticket/variants/internal-note.vue'
import DetailTicketLoading from '../../../../blocks/detail/detail-ticket/variants/loading.vue'
import DetailTicketSendError from '../../../../blocks/detail/detail-ticket/variants/send-error.vue'
import DetailTicketSending from '../../../../blocks/detail/detail-ticket/variants/sending.vue'
import DetailTicketSolved from '../../../../blocks/detail/detail-ticket/variants/solved.vue'
import { expectNoA11yViolations } from '../../axe'

const draft = (body: string) => ({ mode: 'reply' as const, cc: [], body, files: [] })

describe('detail/detail-ticket block', () => {
  it('renders the sample ticket with the subject as the only h1, without axe violations', async () => {
    const view = render(DetailTicket)
    const headings = view.container.querySelectorAll('h1')
    expect(headings).toHaveLength(1)
    expect(headings[0].textContent).toContain('Custom domain returns a certificate error')
    expect(view.container.textContent).toContain('#4812')
    expect(view.container.textContent).toContain('Sam Lee is viewing')
    expect(view.getByRole('list', { name: 'Ticket 4812 conversation' })).toBeTruthy()
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('collapses the middle of a long thread and keeps the first two and last three', () => {
    const view = render(DetailTicket)
    const thread = view.getByRole('list', { name: 'Ticket 4812 conversation' })
    expect(thread.textContent).toContain('Show 5 earlier messages')
    expect(thread.textContent).toContain('Safari still shows the old certificate')
    expect(thread.textContent).not.toContain('the CNAME still points')
  })

  it('emits send with the draft, event first, and Send stays disabled on an empty draft', async () => {
    const view = render(DetailTicket, {
      props: { draft: draft(''), 'onUpdate:draft': () => undefined }
    })
    const send = view.getByRole('button', { name: 'Send' }) as HTMLButtonElement
    expect(send.disabled).toBe(true)
    await view.rerender({ draft: draft('The new certificate is live.') })
    await fireEvent.click(view.getByRole('button', { name: 'Send' }))
    const sent = view.emitted<[MouseEvent, DetailTicketSendPayload]>('send')
    expect(sent).toHaveLength(1)
    expect(sent[0][0]).toBeInstanceOf(MouseEvent)
    expect(sent[0][1]).toMatchObject({
      mode: 'reply',
      body: 'The new certificate is live.',
      status: ''
    })
  })

  it('switches the composer to Internal note and says it is private in words', async () => {
    const view = render(DetailTicket)
    await fireEvent.click(view.getByRole('radio', { name: 'Internal note' }))
    await waitFor(() =>
      expect(view.container.textContent).toContain('Only your team can see internal notes.')
    )
    const field = view.getByRole('textbox', { name: 'Internal note' })
    const describedBy = field.getAttribute('aria-describedby') ?? ''
    expect(document.getElementById(describedBy.split(' ')[0])?.textContent).toContain(
      'Only your team can see internal notes.'
    )
    expect(view.queryByText('Cc')).toBeNull()
    const updates = view.emitted<[{ mode: string }]>('update:draft')
    expect(updates.at(-1)?.[0].mode).toBe('note')
  })

  it('emits property-change with the field and value when the status changes', async () => {
    const view = render(DetailTicket)
    await fireEvent.click(view.getByRole('combobox', { name: 'Status' }))
    const option = await waitFor(() => {
      const found = Array.from(document.body.querySelectorAll('[role=option]')).find(
        (node) => node.textContent?.trim() === 'Pending'
      )
      if (!found) throw new Error('Pending option not open')
      return found as HTMLElement
    })
    await fireEvent.click(option)
    const changes = view.emitted<[DetailTicketPropertyChange]>('property-change')
    expect(changes.at(-1)?.[0]).toEqual({ field: 'status', value: 'Pending' })
  })

  it('emits open-customer and merge with their subjects', async () => {
    const view = render(DetailTicket)
    await fireEvent.click(view.getByRole('button', { name: 'View customer profile' }))
    await fireEvent.click(view.getByRole('button', { name: 'Merge' }))
    expect(view.emitted<[MouseEvent, { email: string }]>('open-customer')[0][1].email).toBe(
      'alex.morgan@example.com'
    )
    expect(view.emitted<[MouseEvent, { id: string }]>('merge')[0][1].id).toBe('4812')
  })

  it('shows the loading and error states without the sample', () => {
    const loading = render(DetailTicketLoading)
    expect(loading.container.querySelector('h1')?.textContent).toContain('Ticket')
    expect(loading.container.textContent).not.toContain('#4812')
    const failed = render(DetailTicketError)
    expect(failed.getByRole('button', { name: 'Retry' })).toBeTruthy()
    expect(failed.container.textContent).toContain('The ticket could not be loaded.')
  })

  it('marks the composer busy while sending', () => {
    const view = render(DetailTicketSending)
    expect(view.container.querySelector('[aria-busy="true"]')).toBeTruthy()
  })

  it('keeps the draft after a failed send and offers Retry', () => {
    const view = render(DetailTicketSendError)
    expect(view.container.textContent).toContain('Your draft is kept')
    const field = view.getByRole('textbox', {
      name: 'Reply to the customer'
    }) as HTMLTextAreaElement
    expect(field.value).toContain('hard refresh')
  })

  it('offers Reopen in place of the composer on a solved ticket', async () => {
    const view = render(DetailTicketSolved)
    expect(view.queryByRole('textbox', { name: 'Reply to the customer' })).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Reopen' }))
    expect(view.container.textContent).toContain('This ticket is solved.')
  })

  it('renders the internal note variant with Add note', () => {
    const view = render(DetailTicketInternalNote)
    expect(view.getByRole('button', { name: /Add note/ })).toBeTruthy()
  })
})
