import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import AccountPaymentMethodCard from '../../../../blocks/account/account-payment-method-card/account-payment-method-card.vue'
import Disabled from '../../../../blocks/account/account-payment-method-card/variants/disabled.vue'
import Editing from '../../../../blocks/account/account-payment-method-card/variants/editing.vue'

describe('account/account-payment-method-card', () => {
  it('renders the card it is given instead of the sample', () => {
    const view = render(AccountPaymentMethodCard, {
      props: { card: { brand: 'mastercard', last4: '4242' } }
    })
    expect(view.getByText('Ending in 4242')).toBeTruthy()
    expect(view.container.textContent).not.toContain('8888')
  })

  it('opens the form on Change and closes it on Cancel', async () => {
    const view = render(AccountPaymentMethodCard)
    expect(view.getByText('Ending in 8888')).toBeTruthy()
    await userEvent.click(view.getByRole('button', { name: 'Change' }))
    await waitFor(() =>
      expect(view.getByRole('form', { name: 'Change payment method' })).toBeTruthy()
    )
    expect(view.emitted('update:editing')![0]).toEqual([true])
    await userEvent.click(view.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(view.getByText('Ending in 8888')).toBeTruthy())
  })

  it('validates every field on Update in the Editing variant', async () => {
    const view = render(Editing)
    const labels = ['Cardholder name', 'Card number', 'Expiration date', 'Security code']
    for (const label of labels) {
      const input = view.getByLabelText(new RegExp(`^${label}`))
      expect(
        view.container.querySelector(`label[for="${input.id}"]`)?.hasAttribute('data-required')
      ).toBe(true)
      expect(input.getAttribute('aria-invalid')).not.toBe('true')
    }
    await userEvent.click(view.getByRole('button', { name: 'Update' }))
    await waitFor(() => expect(view.getAllByText('This field is required.')).toHaveLength(4))
    for (const label of labels)
      expect(view.getByLabelText(new RegExp(`^${label}`)).getAttribute('aria-invalid')).toBe('true')
    expect(view.getByRole('form', { name: 'Change payment method' })).toBeTruthy()
  })

  it('emits the typed values from the primary', async () => {
    const view = render(AccountPaymentMethodCard, { props: { editing: true } })
    await userEvent.type(view.getByLabelText(/^Cardholder name/), 'Jane Doe')
    await userEvent.type(view.getByLabelText(/^Card number/), '4242 4242 4242 4242')
    await userEvent.type(view.getByLabelText(/^Expiration date/), '12/30')
    await userEvent.type(view.getByLabelText(/^Security code/), '123')
    await userEvent.click(view.getByRole('button', { name: 'Update' }))
    const [event, values] = view.emitted('submit')![0] as [Event, Record<string, unknown>]
    expect(event).toBeInstanceOf(Event)
    expect(values).toEqual({
      holder: 'Jane Doe',
      country: undefined,
      number: '4242424242424242',
      expiry: '12/30',
      code: '123'
    })
  })

  it('shows the decline from the error prop and disables Change when disabled', () => {
    const view = render(AccountPaymentMethodCard, {
      props: { editing: true, error: 'The card was declined.' }
    })
    expect(view.getByText('The card was declined.')).toBeTruthy()
    view.unmount()
    const disabled = render(Disabled)
    const change = disabled.getByRole('button', { name: 'Change' })
    expect(change).toHaveAttribute('aria-disabled', 'true')
    expect(change).toHaveAccessibleDescription(/once the current request finishes/)
  })

  it('cancels the edit on Escape and returns focus to Change', async () => {
    const view = render(AccountPaymentMethodCard)
    await userEvent.click(view.getByRole('button', { name: 'Change' }))
    await waitFor(() => expect(document.activeElement?.id).toBe('card-holder'))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(view.getByText('Ending in 8888')).toBeTruthy())
    expect(view.queryByRole('form', { name: 'Change payment method' })).toBeNull()
    await waitFor(() => expect(document.activeElement?.id).toBe('card-change'))
  })
})
