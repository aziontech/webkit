import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Billing from '../../blocks/platform/account/billing/billing.vue'
import NoMatch from '../../blocks/platform/account/billing/variants/no-match.vue'
import PaymentMethods from '../../blocks/platform/account/billing/variants/payment-methods.vue'
import { useToastRegion } from './toast-region'

useToastRegion()

afterEach(() => cleanup())

const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement

describe('platform/account/billing', () => {
  it('switches between the Bills and Payment methods tabs', async () => {
    const view = render(Billing)
    expect(view.getByRole('table', { name: 'Invoices' })).toBeTruthy()
    expect(view.container.textContent).toContain('INV-A12401')
    await fireEvent.click(view.getByRole('tab', { name: 'Payment methods' }))
    await waitFor(() => expect(view.getByRole('table', { name: 'Payment methods' })).toBeTruthy())
    expect(view.queryByRole('table', { name: 'Invoices' })).toBeNull()
    expect(view.container.textContent).toContain('billing@example.com')
  })

  it('names each invoice download after its invoice', () => {
    const view = render(Billing)
    const link = view.getByRole('link', { name: 'Download invoice INV-A12401' })
    expect(link.getAttribute('href')).toBe('https://example.com/invoices/INV-A12401.pdf')
  })

  it('offers Clear filters when no invoice matches, and clearing shows them again', async () => {
    const view = render(NoMatch)
    await waitFor(() => expect(view.container.textContent).toContain('No matching invoices'))
    expect(view.container.textContent).not.toContain('INV-A12401')
    await fireEvent.click(buttonByText('Clear filters', view.container as HTMLElement))
    await waitFor(() => expect(view.container.textContent).toContain('INV-A12401'))
  })

  it('sets another card as the default', async () => {
    const view = render(PaymentMethods)
    await fireEvent.click(view.getByRole('button', { name: /Actions for Visa •••• 4431/ }))
    const option = await waitFor(() => view.getByRole('menuitem', { name: 'Set as default' }))
    await fireEvent.click(option)
    await waitFor(() =>
      expect(document.body.textContent).toContain('Visa •••• 4431 is now the default.')
    )
    const visaRow = view.getByText('Acme Inc.').closest('tr, [role="row"]') as HTMLElement
    expect(visaRow.textContent).toContain('Default')
  })

  it('removes a card only after confirmation', async () => {
    const view = render(PaymentMethods)
    expect(view.container.textContent).toContain('John Smith')
    await fireEvent.click(
      view.getByRole('button', { name: /Actions for American Express •••• 9008/ })
    )
    const option = await waitFor(() => view.getByRole('menuitem', { name: 'Remove' }))
    await fireEvent.click(option)
    const confirm = await waitFor(() => {
      expect(dialog()?.textContent).toContain('Remove payment method')
      return dialog() as HTMLElement
    })
    expect(view.container.textContent).toContain('John Smith')
    await fireEvent.click(buttonByText('Remove', confirm))
    await waitFor(() => expect(view.container.textContent).not.toContain('John Smith'))
  })
})
