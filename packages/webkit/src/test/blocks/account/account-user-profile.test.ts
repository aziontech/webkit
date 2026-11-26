import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import UserProfile from '../../../../blocks/account/account-user-profile/account-user-profile.vue'
import {
  samplePreferences,
  sampleProfile,
  sampleSecurityPolicy
} from '../../../../blocks/account/account-user-profile/sample'
import { expectNoA11yViolations } from '../../axe'

afterEach(() => cleanup())

const saveBar = () => document.querySelector('[data-testid="save-bar"]')

const pressSave = () =>
  (document.activeElement ?? document.body).dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 's',
      bubbles: true,
      cancelable: true,
      ...(/mac/i.test(navigator.platform || navigator.userAgent)
        ? { metaKey: true }
        : { ctrlKey: true })
    })
  )

describe('account/account-user-profile', () => {
  it('heads the page with the name and role, no header actions, and the five tabs', async () => {
    const view = render(UserProfile)
    expect(view.getByRole('heading', { level: 1, name: 'Jane Doe' })).toBeTruthy()
    const header = view.container.querySelector('header') as HTMLElement
    expect(header.querySelectorAll('button, a')).toHaveLength(0)
    const tabs = view.getAllByRole('tab').map((tab) => tab.textContent?.trim())
    expect(tabs).toEqual([
      'Overview',
      'Profile and bio',
      'Security and access',
      'Notifications',
      'Preferences'
    ])
    await expectNoA11yViolations(view.container)
  })

  it('switches the year from the year rail', async () => {
    const view = render(UserProfile)
    expect(view.getByRole('heading', { name: 'Platform contributions in 2026' })).toBeTruthy()
    await fireEvent.click(view.getByRole('button', { name: '2025' }))
    await waitFor(() =>
      expect(view.getByRole('heading', { name: 'Platform contributions in 2025' })).toBeTruthy()
    )
    expect(view.getByRole('button', { name: '2025' }).getAttribute('aria-pressed')).toBe('true')
    expect(view.emitted<number[]>('update:selectedYear')?.at(-1)).toEqual([2025])
  })

  it('filters the history to the day picked in the graph, and shows all days again', async () => {
    const view = render(UserProfile)
    const day = view.container.querySelector<HTMLElement>('[data-date="2026-11-22"]')!
    await fireEvent.click(day)
    await waitFor(() => expect(view.getByRole('button', { name: 'Show all days' })).toBeTruthy())
    expect(view.getByText('Deployed 14 releases across 3 Applications')).toBeTruthy()
    expect(view.queryByText('Published 3 Functions updates')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Show all days' }))
    await waitFor(() => expect(view.getByText('Published 3 Functions updates')).toBeTruthy())
  })

  it('raises the save bar on an edit, discards it, and saves the edited profile', async () => {
    const view = render(UserProfile, { props: { activeTab: 'profile' } })
    expect(saveBar()).toBeNull()
    const first = view.getByLabelText('First name') as HTMLInputElement
    await userEvent.clear(first)
    await userEvent.type(first, 'Janet')
    await waitFor(() => expect(saveBar()).not.toBeNull())
    await fireEvent.click(view.getByRole('button', { name: 'Discard' }))
    await waitFor(() => expect(saveBar()).toBeNull())
    expect(first.value).toBe(sampleProfile.firstName)

    await userEvent.clear(first)
    await userEvent.type(first, 'Janet')
    await waitFor(() => expect(saveBar()).not.toBeNull())
    await fireEvent.click(view.getByRole('button', { name: /Save changes/ }))
    const payload = view.emitted<unknown[]>('save')!.at(-1)![0] as {
      profile: { firstName: string }
    }
    expect(payload.profile.firstName).toBe('Janet')
  })

  it.each([
    [true, 1],
    [false, 0]
  ])('with keyboard shortcuts %s, Command S saves %i times', async (keyboardShortcuts, saves) => {
    const view = render(UserProfile, {
      props: { activeTab: 'profile', preferences: { ...samplePreferences, keyboardShortcuts } }
    })
    await userEvent.type(view.getByLabelText('First name'), 'x')
    await waitFor(() => expect(saveBar()).not.toBeNull())
    pressSave()
    expect(view.emitted('save') ?? []).toHaveLength(saves)
  })

  it('keeps the edits of other tabs when one record comes back saved', async () => {
    const view = render(UserProfile, { props: { activeTab: 'preferences' } })
    await fireEvent.click(view.getByRole('switch', { name: 'Keyboard shortcuts' }))
    await view.rerender({ profile: { ...sampleProfile, firstName: 'Janet' } })
    await waitFor(() => expect(saveBar()).not.toBeNull())
    expect(
      view.getByRole('switch', { name: 'Keyboard shortcuts' }).getAttribute('aria-checked')
    ).toBe('false')
  })

  it('changes the password on its own, with each error on its field', async () => {
    const view = render(UserProfile, { props: { activeTab: 'security' } })
    await fireEvent.click(view.getByRole('button', { name: 'Change password' }))
    expect(view.getByText('Enter your current password.')).toBeTruthy()
    expect(view.getByLabelText('Current password').getAttribute('aria-invalid')).toBe('true')
    await userEvent.type(view.getByLabelText('Current password'), 'old-Passw0rd!')
    await userEvent.type(view.getByLabelText('New password'), 'New-Passw0rd-2026')
    await userEvent.type(view.getByLabelText('Confirm new password'), 'New-Passw0rd-2025')
    expect(view.getByText("The passwords don't match.")).toBeTruthy()
    expect(saveBar()).toBeNull()
    const confirm = view.getByLabelText('Confirm new password')
    await userEvent.clear(confirm)
    await userEvent.type(confirm, 'New-Passw0rd-2026')
    await fireEvent.click(view.getByRole('button', { name: 'Change password' }))
    const [, change] = view.emitted<unknown[]>('change-password')!.at(-1)!
    expect(change).toEqual({ currentPassword: 'old-Passw0rd!', newPassword: 'New-Passw0rd-2026' })
    expect(view.emitted('save')).toBeUndefined()
    expect((view.getByLabelText('New password') as HTMLInputElement).value).toBe('')
  })

  it('asks before turning multi-factor off', async () => {
    const view = render(UserProfile, {
      props: {
        activeTab: 'security',
        securityPolicy: { ...sampleSecurityPolicy, mfaEnabled: true, mfaEnforced: false }
      }
    })
    await fireEvent.click(view.getByRole('switch', { name: 'Multi-factor authentication' }))
    const dialog = await waitFor(() => {
      const found = document.querySelector('[role="alertdialog"], [role="dialog"]')
      expect(found).not.toBeNull()
      return found as HTMLElement
    })
    expect(view.emitted('mfa-change')).toBeUndefined()
    await fireEvent.click(
      Array.from(dialog.querySelectorAll('button')).find(
        (b) => b.textContent?.trim() === 'Turn off'
      )!
    )
    expect(view.emitted<boolean[]>('mfa-change')!.at(-1)).toEqual([false])
  })

  it('draws a placeholder on a settings tab while the profile loads', () => {
    const view = render(UserProfile, { props: { activeTab: 'profile', loading: true } })
    expect(view.queryByLabelText('First name')).toBeNull()
  })

  it('replaces the page with a danger alert that retries', async () => {
    const view = render(UserProfile, { props: { error: 'The profile service timed out.' } })
    expect(view.queryByRole('tab')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted('retry')).toHaveLength(1)
  })
})
