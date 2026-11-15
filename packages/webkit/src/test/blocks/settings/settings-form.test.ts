import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import SettingsForm from '../../../../blocks/settings/settings-form/settings-form.vue'
import Profile from '../../../../blocks/settings/settings-form/variants/profile.vue'
import Failed from '../../../../blocks/settings/settings-form/variants/profile-error.vue'
import Loading from '../../../../blocks/settings/settings-form/variants/profile-loading.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())
describe('settings/settings-form · Profile', () => {
  it('links to MFA management instead of a second enforcement switch', () => {
    const view = render(Profile)
    expect(view.queryByRole('switch', { name: /multi-factor/i })).toBeNull()
    expect(view.getByRole('link', { name: 'Manage MFA' }).getAttribute('href')).toBe(
      '/account/security/mfa'
    )
    expect(view.getByRole('link', { name: 'Connect GitLab' }).getAttribute('href')).toBe(
      '/account/integrations/gitlab'
    )
  })

  it('starts with Billing emails empty and asks for it on Save', async () => {
    const view = render(Profile)
    const emails = view.getByRole('textbox', { name: 'Billing emails' }) as HTMLTextAreaElement
    expect(emails.value).toBe('')
    await userEvent.type(view.getByRole('textbox', { name: 'Tax ID' }), '12-3456789')
    await fireEvent.click(view.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(document.activeElement).toBe(emails))
    expect(view.getByText('This field is required.')).toBeTruthy()
  })

  it('deletes the account only after the name is typed', async () => {
    const view = render(Profile)
    await fireEvent.click(view.getByRole('button', { name: 'Delete account' }))
    const dialog = await view.findByRole('alertdialog', { name: 'Delete account' })
    const confirm = within(dialog).getByRole('button', { name: 'Delete account' })
    expect(confirm).toBeDisabled()
    await userEvent.type(within(dialog).getByRole('textbox'), 'Acme')
    await waitFor(() => expect(confirm).toBeEnabled())
    await fireEvent.click(confirm)
    await waitFor(() =>
      expect(document.body.textContent).toContain('Account scheduled for deletion.')
    )
  })

  it('shows Skeleton cards while loading and a Retry alert when it fails', async () => {
    const loading = render(Loading)
    expect(loading.getByLabelText('Loading the profile').getAttribute('aria-busy')).toBe('true')
    expect(loading.queryByRole('textbox', { name: 'Account name' })).toBeNull()
    loading.unmount()
    const failed = render(Failed)
    expect(failed.container.textContent).toContain('The profile could not be loaded.')
    await fireEvent.click(failed.getByRole('button', { name: 'Retry' }))
    await waitFor(
      () => expect(failed.getByRole('textbox', { name: 'Account name' })).toBeTruthy(),
      {
        timeout: 3000
      }
    )
  })
})

describe('settings/settings-form', () => {
  it('renders each topic as a section heading', () => {
    const view = render(SettingsForm)
    for (const name of ['General', 'Preferences', 'Notifications'])
      expect(view.getByRole('heading', { level: 2, name })).toBeTruthy()
  })

  it('keeps Save and Discard disabled until the form changes, then saves', async () => {
    const view = render(SettingsForm)
    const save = view.getByRole('button', { name: 'Save' }) as HTMLButtonElement
    const discard = view.getByRole('button', { name: 'Discard' }) as HTMLButtonElement
    expect(save.disabled).toBe(true)
    expect(discard.disabled).toBe(true)
    await fireEvent.update(view.getByLabelText('Email'), 'alex.morgan@example.com')
    await waitFor(() => expect(save.disabled).toBe(false))
    await fireEvent.click(save)
    await waitFor(() => expect(save.disabled).toBe(true), { timeout: 2000 })
  })
})
