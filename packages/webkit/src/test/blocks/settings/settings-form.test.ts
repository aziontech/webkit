import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import SettingsForm from '../../../../blocks/settings/settings-form/settings-form.vue'
import Profile from '../../../../blocks/settings/settings-form/variants/profile.vue'
import Failed from '../../../../blocks/settings/settings-form/variants/profile-error.vue'
import Loading from '../../../../blocks/settings/settings-form/variants/profile-loading.vue'
import SaveError from '../../../../blocks/settings/settings-form/variants/save-error.vue'
import Saving from '../../../../blocks/settings/settings-form/variants/saving.vue'
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

  it('keeps Save and Discard disabled until the form changes, then emits and saves', async () => {
    const view = render(SettingsForm)
    const save = view.getByRole('button', { name: 'Save' }) as HTMLButtonElement
    const discard = view.getByRole('button', { name: 'Discard' }) as HTMLButtonElement
    expect(save.disabled).toBe(true)
    expect(discard.disabled).toBe(true)
    await fireEvent.update(view.getByLabelText('Email'), 'alex.morgan@example.com')
    await waitFor(() => expect(save.disabled).toBe(false))
    await fireEvent.click(save)
    const [event, values] = view.emitted<unknown[]>('submit')?.[0] ?? []
    expect(event).toBeInstanceOf(MouseEvent)
    expect(values).toMatchObject({ fullName: 'Alex Morgan', email: 'alex.morgan@example.com' })
    await view.rerender({ loading: true })
    expect(discard.disabled).toBe(true)
    await view.rerender({ loading: false })
    await waitFor(() => expect(save.disabled).toBe(true))
    await waitFor(() => expect(document.body.textContent).toContain('Profile saved.'))
  })

  it('opens on the profile it is given instead of the sample', () => {
    const view = render(SettingsForm, {
      props: {
        profile: {
          fullName: 'Jane Doe',
          email: 'jane.doe@example.com',
          timezone: 'utc',
          language: 'en',
          productUpdates: false
        }
      }
    })
    expect((view.getByLabelText('Full name') as HTMLInputElement).value).toBe('Jane Doe')
    expect((view.getByLabelText('Email') as HTMLInputElement).value).toBe('jane.doe@example.com')
    expect(view.getByRole('switch', { name: 'Product updates' }).getAttribute('aria-checked')).toBe(
      'false'
    )
  })

  it('shows the save error in a toast whose Retry emits submit again', async () => {
    const view = render(SettingsForm, {
      props: {
        defaultDraft: { email: 'alex.morgan@example.com' },
        error: "The request didn't reach the server. Your changes are kept."
      }
    })
    await waitFor(() =>
      expect(document.body.textContent).toContain("The request didn't reach the server.")
    )
    const retry = Array.from(document.body.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Retry'
    ) as HTMLButtonElement
    await fireEvent.click(retry)
    expect(view.emitted<unknown[]>('submit')?.[0]?.[1]).toMatchObject({
      email: 'alex.morgan@example.com'
    })
  })

  it.each([Saving, SaveError])(
    'opens a save state dirty with the editable email empty',
    (Variant) => {
      const view = render(Variant)
      expect((view.getByLabelText('Email') as HTMLInputElement).value).toBe('')
      expect(view.getByText('(UTC-05:00) New York')).toBeTruthy()
    }
  )
})

const apple = /mac/i.test(navigator.platform || navigator.userAgent)
const pressShortcut = (key: string, target: Element = document.body) => {
  const event = new KeyboardEvent('keydown', {
    key,
    metaKey: apple,
    ctrlKey: !apple,
    bubbles: true,
    cancelable: true
  })
  target.dispatchEvent(event)
  return event
}

describe('settings/settings-form save shortcut', () => {
  it('saves on Command S only once the form changes', async () => {
    const view = render(SettingsForm)
    const save = view.getByRole('button', { name: 'Save' })
    expect(save.getAttribute('aria-keyshortcuts')).toBe('Meta+S Control+S')
    expect(save.querySelector('[data-testid="kbd"]')).not.toBeNull()
    const clean = pressShortcut('s')
    expect(clean.defaultPrevented).toBe(true)
    expect(view.emitted('submit')).toBeUndefined()
    const email = view.getByLabelText('Email') as HTMLInputElement
    await fireEvent.update(email, 'alex.morgan@example.com')
    email.focus()
    pressShortcut('s', email)
    const [event, values] = view.emitted<unknown[]>('submit')?.[0] ?? []
    expect(event).toBeInstanceOf(KeyboardEvent)
    expect(values).toMatchObject({ email: 'alex.morgan@example.com' })
  })

  it('saves the Profile variant on Command S and leaves the browser save alone when clean', async () => {
    const view = render(Profile)
    expect(pressShortcut('s').defaultPrevented).toBe(false)
    const name = view.getByRole('textbox', { name: 'Account name' }) as HTMLInputElement
    await fireEvent.update(name, 'Acme Labs')
    await fireEvent.update(
      view.getByRole('textbox', { name: 'Billing emails' }),
      'billing@example.com'
    )
    const save = await waitFor(() => view.getByRole('button', { name: 'Save' }))
    expect(save.getAttribute('aria-keyshortcuts')).toBe('Meta+S Control+S')
    name.focus()
    expect(pressShortcut('s', name).defaultPrevented).toBe(true)
    await waitFor(() => expect(save.getAttribute('aria-busy')).toBe('true'))
  })
})
