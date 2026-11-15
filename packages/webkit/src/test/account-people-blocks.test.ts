import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import MfaManagement from '../../blocks/account/mfa-settings/mfa-settings.vue'
import Users from '../../blocks/account/users/users.vue'
import EditRole from '../../blocks/account/users/variants/edit-role.vue'
import Invite from '../../blocks/account/users/variants/invite.vue'
import { useToastRegion } from './toast-region'

useToastRegion()

const dialog = () =>
  document.querySelector('[role="dialog"], [role="alertdialog"]') as HTMLElement | null
const button = (root: HTMLElement, label: string) =>
  Array.from(root.querySelectorAll('button')).find(
    (item) => item.textContent?.trim() === label
  ) as HTMLButtonElement

describe('account/users', () => {
  it('validates the invitation after Send, then adds the person as Invited', async () => {
    const view = render(Invite)
    await waitFor(() => expect(dialog()).not.toBeNull())
    await fireEvent.click(button(dialog()!, 'Send invitation'))
    await waitFor(() =>
      expect(dialog()!.textContent).toContain('Enter the email address to invite.')
    )
    const email = dialog()!.querySelector<HTMLInputElement>('#invite-email')!
    await fireEvent.update(email, 'priya.nair@example.com')
    await waitFor(() =>
      expect(dialog()!.textContent).toContain('This person is already in the account.')
    )
    await fireEvent.update(email, 'new.person@example.com')
    await fireEvent.click(button(dialog()!, 'Send invitation'))
    await waitFor(() => expect(dialog()).toBeNull(), { timeout: 3000 })
    expect(view.container.textContent).toContain('new.person@example.com')
    expect(view.getByRole('button', { name: 'Actions for new.person@example.com' })).toBeTruthy()
  })

  it('changes a role in the Edit role dialog and shows it in the Role column', async () => {
    const view = render(EditRole)
    await waitFor(() => expect(dialog()?.textContent).toContain('Edit role'))
    expect(dialog()!.textContent).toContain('Manages people, teams, billing')
    await userEvent.click(dialog()!.querySelector<HTMLElement>('#user-role')!)
    await userEvent.click(await view.findByRole('option', { name: 'Viewer' }))
    await waitFor(() => expect(dialog()!.textContent).toContain('changes nothing'))
    await fireEvent.click(button(dialog()!, 'Save role'))
    await waitFor(() => expect(dialog()).toBeNull())
    const row = view.getByText('Jordan Reyes').closest('[role="row"], tr') as HTMLElement
    expect(row.textContent).toContain('Viewer')
    expect(row.textContent).not.toMatch(/\bAdmin\b/)
  })

  it('opens the profile from the row menu and offers Edit role for everyone but the owner', async () => {
    const view = render(Users)
    expect(view.getByRole('columnheader', { name: /Email/ })).toBeTruthy()
    expect(view.getByRole('columnheader', { name: /Role/ })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Download CSV' })).toBeTruthy()
    await fireEvent.click(view.getByRole('button', { name: 'Actions for Avery Stone' }))
    await waitFor(() => view.getByRole('menuitem', { name: 'View profile' }))
    expect(view.queryByRole('menuitem', { name: 'Edit role' })).toBeNull()
    await fireEvent.click(view.getByRole('menuitem', { name: 'View profile' }))
    await waitFor(() => expect(dialog()?.textContent).toContain('avery.stone@example.com'))
    expect(button(dialog()!, 'Edit role')).toBeUndefined()
  })
})

describe('account/mfa-settings', () => {
  it('warns about password-only people and confirms before requiring MFA', async () => {
    const view = render(MfaManagement)
    expect(view.container.textContent).toMatch(/2 of 5 people sign in with a password only/)
    await fireEvent.click(view.getByRole('switch', { name: 'Require MFA' }))
    await waitFor(() => expect(dialog()).not.toBeNull())
    expect(dialog()!.textContent).toContain('Priya Nair, Marco Bianchi')
    await fireEvent.click(button(dialog()!, 'Require MFA'))
    await waitFor(() => expect(dialog()).toBeNull())
    expect(view.container.textContent).not.toMatch(/sign in with a password only/)
  })

  it('filters people by MFA status under the table-view controls row', async () => {
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
