import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import MfaManagement from '../../blocks/platform/account/mfa-management/mfa-management.vue'
import Invite from '../../blocks/platform/account/users/variants/invite.vue'

const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null
const button = (root: HTMLElement, label: string) =>
  Array.from(root.querySelectorAll('button')).find(
    (item) => item.textContent?.trim() === label
  ) as HTMLButtonElement

describe('platform/account/users', () => {
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
})

describe('platform/account/mfa-management', () => {
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
})
