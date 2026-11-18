import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import MfaManagement from '../../../../blocks/account/account-mfa-settings/account-mfa-settings.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const dialog = () =>
  document.querySelector('[role="dialog"], [role="alertdialog"]') as HTMLElement | null

const button = (root: HTMLElement, label: string) =>
  Array.from(root.querySelectorAll('button')).find(
    (item) => item.textContent?.trim() === label
  ) as HTMLButtonElement
describe('account/account-mfa-settings', () => {
  it('warns about password-only people and confirms before requiring MFA', async () => {
    const view = render(MfaManagement)
    expect(view.container.textContent).toMatch(/2 of 5 people sign in with a password only/)
    await fireEvent.click(view.getByRole('switch', { name: 'Require MFA' }))
    await waitFor(() => expect(dialog()).not.toBeNull())
    expect(dialog()!.textContent).toContain('Priya Nair, Marco Bianchi')
    await fireEvent.click(button(dialog()!, 'Require MFA'))
    await waitFor(() => expect(dialog()).toBeNull())
    expect(view.container.textContent).not.toMatch(/sign in with a password only/)
    expect(view.emitted<unknown[]>('update:required')).toEqual([[true]])
  })

  it('renders the people it is given instead of the sample and emits the row actions', async () => {
    const view = render(MfaManagement, {
      props: {
        members: [
          {
            id: 'u-1',
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            method: 'Authenticator app',
            enabled: true,
            since: new Date(Date.UTC(2026, 9, 1))
          },
          {
            id: 'u-2',
            name: 'John Smith',
            email: 'john.smith@example.com',
            method: '',
            enabled: false,
            since: null
          }
        ]
      }
    })
    await waitFor(() => expect(view.container.textContent).toContain('Jane Doe'))
    expect(view.container.textContent).not.toContain('Avery Stone')
    expect(view.container.textContent).toMatch(/1 of 2 people sign in with a password only/)
    await fireEvent.click(view.getByRole('button', { name: /Actions for John Smith/ }))
    await fireEvent.click(
      await waitFor(() => view.getByRole('menuitem', { name: 'Send setup reminder' }))
    )
    expect(view.emitted<unknown[]>('remind')![0][1]).toMatchObject({ id: 'u-2' })
    await fireEvent.click(view.getByRole('button', { name: /Actions for Jane Doe/ }))
    await fireEvent.click(await waitFor(() => view.getByRole('menuitem', { name: 'Reset MFA' })))
    await waitFor(() => expect(dialog()).not.toBeNull())
    await fireEvent.click(button(dialog()!, 'Reset MFA'))
    expect(view.emitted<unknown[]>('reset')![0][1]).toMatchObject({ id: 'u-1' })
    await waitFor(() =>
      expect(view.container.textContent).toMatch(/2 of 2 people sign in with a password only/)
    )
  })

  it('disables the Switch and shows the error with Retry when the load failed', async () => {
    const view = render(MfaManagement, { props: { error: 'The API answered 503.' } })
    expect(view.container.textContent).toContain('The API answered 503.')
    expect(view.getByRole('switch', { name: 'Require MFA' })).toBeDisabled()
    expect(view.container.textContent).not.toContain('Avery Stone')
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted<unknown[]>('retry')).toHaveLength(1)
  })

  it('filters people by MFA status under the view-table controls row', async () => {
    const view = render(MfaManagement)
    expect(view.getByRole('button', { name: 'Refresh' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Download CSV' })).not.toBeDisabled()
    const input = view.getByRole('combobox', { name: 'Filter people' })
    await fireEvent.update(input, 'MFA = Not set up')
    await fireEvent.keyDown(input, { key: 'Enter' })
    await waitFor(() => expect(view.container.textContent).not.toContain('Avery Stone'))
    expect(view.container.textContent).toContain('Priya Nair')
  })

  it('shows an EmptyState with Clear filters when no person matches', async () => {
    const view = render(MfaManagement)
    const input = view.getByRole('combobox', { name: 'Filter people' })
    await fireEvent.update(input, 'nobody-here')
    await fireEvent.keyDown(input, { key: 'Enter' })
    const empty = await waitFor(() => {
      const node = view.getByText('No matching people').closest('[data-testid$="empty-state"]')
      expect(node).not.toBeNull()
      return node as HTMLElement
    })
    await fireEvent.click(within(empty).getByRole('button', { name: 'Clear filters' }))
    await waitFor(() => expect(view.container.textContent).toContain('Avery Stone'))
  })
})
