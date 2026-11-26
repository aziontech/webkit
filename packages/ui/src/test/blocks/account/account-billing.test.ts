import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import AccountBilling from '../../../../blocks/account/account-billing/account-billing.vue'
import NoMatch from '../../../../blocks/account/account-billing/variants/no-match.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const dialog = () =>
  document.querySelector('[role="dialog"], [role="alertdialog"]') as HTMLElement | null

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement
describe('account/account-billing', () => {
  it('repeats a status other than Paid in the invoice cell for a phone', () => {
    const view = render(AccountBilling)
    const summaries = [
      ...view.container.querySelectorAll<HTMLElement>('[data-slot="narrow-summary"]')
    ].map((summary) => summary.textContent?.trim())
    expect(summaries).toContain('Refunded')
    expect(summaries).not.toContain('Paid')
  })

  it('switches between the Bills and Payment methods tabs', async () => {
    const view = render(AccountBilling)
    expect(view.getByRole('table', { name: 'Invoices' })).toBeTruthy()
    expect(view.container.textContent).toContain('INV-A12401')
    await fireEvent.click(view.getByRole('tab', { name: 'Payment methods' }))
    await waitFor(() => expect(view.getByRole('table', { name: 'Payment methods' })).toBeTruthy())
    expect(view.queryByRole('table', { name: 'Invoices' })).toBeNull()
    expect(view.container.textContent).toContain('billing@example.com')
  })

  it('names each invoice download after its invoice', () => {
    const view = render(AccountBilling)
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
    const view = render(AccountBilling, { props: { tab: 'payment-methods' } })
    await fireEvent.click(view.getByRole('button', { name: /Actions for Visa •••• 4431/ }))
    const option = await waitFor(() => view.getByRole('menuitem', { name: 'Set as default' }))
    await fireEvent.click(option)
    await waitFor(() =>
      expect(document.body.textContent).toContain('Visa •••• 4431 is now the default.')
    )
    const visaRow = view.getByText('Acme Inc.').closest('tr, [role="row"]') as HTMLElement
    expect(visaRow.textContent).toContain('Default')
    expect(view.emitted<unknown[]>('set-default')?.[0]?.[1]).toMatchObject({ id: 'pm-2' })
  })

  it('removes a card only after confirmation', async () => {
    const view = render(AccountBilling, { props: { tab: 'payment-methods' } })
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
    expect(view.emitted<unknown[]>('remove')?.[0]?.[1]).toMatchObject({ id: 'pm-3' })
  })

  it('renders the invoices it is given, the empty card for none, and the error message', async () => {
    const view = render(AccountBilling, {
      props: {
        invoices: [
          {
            id: 'INV-B100',
            number: 1,
            plan: 'Pro',
            cycle: 'Yearly',
            seats: 3,
            billedAt: new Date(Date.UTC(2026, 9, 1)),
            amount: 240,
            brand: 'Visa',
            paymentMethod: 'Visa •••• 4242',
            status: 'Overdue'
          }
        ]
      }
    })
    await waitFor(() => expect(view.container.textContent).toContain('INV-B100'))
    expect(view.container.textContent).not.toContain('INV-A12401')
    view.unmount()
    const empty = render(AccountBilling, { props: { invoices: [] } })
    expect(empty.container.textContent).toContain('No invoices yet')
    empty.unmount()
    const failed = render(AccountBilling, { props: { error: 'The billing API answered 503.' } })
    expect(failed.container.textContent).toContain('The billing API answered 503.')
    expect(failed.queryByRole('table', { name: 'Invoices' })).toBeNull()
    await fireEvent.click(failed.getByRole('button', { name: 'Retry' }))
    expect(failed.emitted<unknown[]>('retry')).toHaveLength(1)
  })

  it('emits refresh instead of faking a reload', async () => {
    const view = render(AccountBilling)
    await fireEvent.click(view.getByRole('button', { name: 'Refresh billing data' }))
    await fireEvent.click(view.getByRole('button', { name: 'Refresh invoices' }))
    expect(view.emitted<unknown[]>('refresh')).toHaveLength(2)
    expect(view.container.textContent).toContain('INV-A12401')
  })

  it('drops the Updated time while loading and after an error, and keeps it with data', () => {
    const ready = render(AccountBilling)
    expect(ready.container.textContent).toContain('Updated ')
    ready.unmount()
    const loading = render(AccountBilling, { props: { loading: true } })
    expect(loading.container.textContent).not.toContain('Updated ')
    loading.unmount()
    const failed = render(AccountBilling, { props: { error: 'The billing API answered 503.' } })
    expect(failed.container.textContent).not.toContain('Updated ')
  })
})
