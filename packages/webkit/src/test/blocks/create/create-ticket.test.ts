import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import CreateTicket, {
  type CreateTicketPayload
} from '../../../../blocks/create/create-ticket/create-ticket.vue'
import { sampleValues } from '../../../../blocks/create/create-ticket/sample'
import ContactError from '../../../../blocks/create/create-ticket/variants/contact-error.vue'
import Loading from '../../../../blocks/create/create-ticket/variants/loading.vue'
import SubmitError from '../../../../blocks/create/create-ticket/variants/submit-error.vue'
import Submitting from '../../../../blocks/create/create-ticket/variants/submitting.vue'
import Success from '../../../../blocks/create/create-ticket/variants/success.vue'
import ValidationErrors from '../../../../blocks/create/create-ticket/variants/validation-errors.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const wait = { timeout: 4000 }

const createButton = () => screen.getByRole('button', { name: /^Create ticket/ })

describe('create-ticket', () => {
  it('starts empty, focuses Requester and marks the required rows', async () => {
    const { container } = render(CreateTicket)
    const requester = screen.getByRole('combobox', { name: 'Requester' }) as HTMLInputElement
    await waitFor(() => expect(document.activeElement).toBe(requester), wait)
    expect(requester.value).toBe('')
    expect((screen.getByRole('textbox', { name: 'Subject' }) as HTMLInputElement).value).toBe('')
    expect(requester.getAttribute('aria-required')).toBe('true')
    expect(requester.getAttribute('aria-invalid')).not.toBe('true')
    await expectNoA11yViolations(container)
  })

  it('validates only on create and moves focus to the first invalid field', async () => {
    const view = render(CreateTicket)
    const create = createButton()
    create.focus()
    await userEvent.click(create)
    const requester = screen.getByRole('combobox', { name: 'Requester' })
    await waitFor(() => expect(document.activeElement).toBe(requester), wait)
    expect(requester.getAttribute('aria-invalid')).toBe('true')
    expect(screen.getByText('Select the customer who asked, or add a new contact.')).toBeTruthy()
    expect(screen.getByText('Enter a subject.')).toBeTruthy()
    expect(screen.getByText('Describe what the customer needs.')).toBeTruthy()
    expect(view.emitted('create')).toBeUndefined()
    await fireEvent.update(screen.getByRole('textbox', { name: 'Subject' }), 'Purge failed')
    await waitFor(() => expect(screen.queryByText('Enter a subject.')).toBeNull(), wait)
  })

  it('emits create with the typed ticket and which button was pressed', async () => {
    const view = render(CreateTicket, { props: { defaultValues: sampleValues } })
    await userEvent.click(screen.getByRole('button', { name: 'Create and add another' }))
    await userEvent.click(createButton())
    const calls = view.emitted<[Event, CreateTicketPayload]>('create') ?? []
    expect(calls).toHaveLength(2)
    expect(calls[0][0]).toBeInstanceOf(Event)
    expect(calls[0][1].addAnother).toBe(true)
    expect(calls[1][1].addAnother).toBe(false)
    expect(calls[1][1].ticket).toMatchObject({
      requester: { id: 'contact-alex-morgan', email: 'alex.morgan@example.com' },
      subject: 'Custom domain returns a certificate error',
      channel: 'Phone',
      priority: 'high',
      groupId: 'technical',
      assigneeId: 'agent-jane-doe',
      tags: ['certificates', 'domains'],
      cc: ['morgan.lee@example.com'],
      attachments: []
    })
  })

  it('adds a new contact inline and sends it with an empty id', async () => {
    const view = render(CreateTicket, {
      props: { defaultValues: { subject: 'Access request', description: 'Needs a seat.' } }
    })
    await userEvent.click(screen.getByRole('button', { name: 'Add new contact' }))
    const name = screen.getByRole('textbox', { name: 'Contact name' })
    await waitFor(() => expect(document.activeElement).toBe(name), wait)
    await fireEvent.update(name, ' Riley Chen ')
    await fireEvent.update(
      screen.getByRole('textbox', { name: 'Contact email' }),
      'riley@example.com'
    )
    await userEvent.click(createButton())
    const [, payload] = view.emitted<[Event, CreateTicketPayload]>('create')?.[0] ?? []
    expect(payload?.ticket.requester).toEqual({
      id: '',
      name: 'Riley Chen',
      email: 'riley@example.com'
    })
    await userEvent.click(screen.getByRole('button', { name: 'Search contacts' }))
    await waitFor(
      () =>
        expect(document.activeElement).toBe(screen.getByRole('combobox', { name: 'Requester' })),
      wait
    )
  })

  it('shows a CC entry that is not an email address after create', () => {
    render(ValidationErrors)
    expect(
      screen.getByText('finance team is not an email address. Fix it or remove it.')
    ).toBeTruthy()
  })

  it('shows a new contact email with no domain ending as invalid', () => {
    render(ContactError)
    expect(screen.getByText('Enter an email address such as name@example.com.')).toBeTruthy()
  })

  it('locks the form while the request runs', () => {
    render(Submitting)
    expect(createButton().getAttribute('aria-busy')).toBe('true')
    expect(
      (screen.getByRole('button', { name: 'Create and add another' }) as HTMLButtonElement).disabled
    ).toBe(true)
    expect((screen.getByRole('button', { name: 'Cancel' }) as HTMLButtonElement).disabled).toBe(
      true
    )
  })

  it('reports a failed request in an alert with Retry and keeps the values', async () => {
    const view = render(SubmitError)
    const alert = (await screen.findByText(/The ticket wasn't created/)).closest(
      '[role="alert"]'
    ) as HTMLElement
    expect(within(alert).getByRole('button', { name: 'Retry' })).toBeTruthy()
    expect((screen.getByRole('textbox', { name: 'Subject' }) as HTMLInputElement).value).toBe(
      'Custom domain returns a certificate error'
    )
    view.unmount()
  })

  it('confirms a created ticket in a toast with Open ticket and clears the form', async () => {
    render(Success)
    await screen.findByText('Ticket #4840 was created.', undefined, wait)
    expect(screen.getByRole('button', { name: 'Open ticket' })).toBeTruthy()
    expect((screen.getByRole('textbox', { name: 'Subject' }) as HTMLInputElement).value).toBe('')
  })

  it('holds the bands with skeletons while the pickers load', () => {
    render(Loading)
    expect(screen.getByRole('status', { name: 'Loading contacts and agents' })).toBeTruthy()
    expect((createButton() as HTMLButtonElement).disabled).toBe(true)
  })
})
