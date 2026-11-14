import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import Profile from '../../blocks/platform/account/profile/profile.vue'
import Failed from '../../blocks/platform/account/profile/variants/failed.vue'
import Loading from '../../blocks/platform/account/profile/variants/loading.vue'
import { useToastRegion } from './toast-region'

useToastRegion()

describe('platform/account/profile', () => {
  it('links to MFA management instead of a second enforcement switch', () => {
    const view = render(Profile)
    expect(view.queryByRole('switch', { name: /multi-factor/i })).toBeNull()
    expect(view.getByRole('link', { name: 'Manage MFA' }).getAttribute('href')).toBe(
      '/account/security/mfa'
    )
    expect(view.getByRole('link', { name: 'Connect GitLab' }).getAttribute('href')).toContain(
      'gitlab.com'
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
    const dialog = await view.findByRole('dialog', { name: 'Delete account' })
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
