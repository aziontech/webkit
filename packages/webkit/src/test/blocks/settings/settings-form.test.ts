import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import ProfilePage from '../../../../blocks/settings/settings-form/parts/profile-page.vue'
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

  it('shows Client ID as copyable text and marks the GitHub tab link as external', () => {
    const view = render(Profile)
    expect(view.queryByRole('textbox', { name: 'Client ID' })).toBeNull()
    expect(view.getByRole('button', { name: 'Copy Client ID' })).toBeTruthy()
    expect(view.getByTestId('copy-text').textContent).toContain('9757a')
    const github = view.getByRole('link', { name: 'Manage GitHub (opens in a new tab)' })
    expect(github.getAttribute('target')).toBe('_blank')
    expect(github.querySelector('.az-external-link')).not.toBeNull()
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
  })

  it('emits delete and closes the dialog only once the deletion ends', async () => {
    const view = render(ProfilePage)
    await fireEvent.click(view.getByRole('button', { name: 'Delete account' }))
    const dialog = await view.findByRole('alertdialog', { name: 'Delete account' })
    await userEvent.type(within(dialog).getByRole('textbox'), 'Acme')
    await fireEvent.click(within(dialog).getByRole('button', { name: 'Delete account' }))
    expect(view.emitted('delete')).toHaveLength(1)
    await view.rerender({ deleting: true })
    expect(view.queryByRole('alertdialog')).toBeTruthy()
    await view.rerender({ deleting: false })
    await waitFor(() => expect(view.queryByRole('alertdialog')).toBeNull())
  })

  it('shows Skeleton cards while loading and a Retry alert when it fails', async () => {
    const loading = render(Loading)
    expect(loading.getByLabelText('Loading the profile').getAttribute('aria-busy')).toBe('true')
    expect(loading.queryByRole('textbox', { name: 'Account name' })).toBeNull()
    loading.unmount()
    const failed = render(Failed)
    expect(failed.container.textContent).toContain('The profile could not be loaded.')
    failed.unmount()
    const page = render(ProfilePage, { props: { error: 'The profile could not be loaded.' } })
    await fireEvent.click(page.getByRole('button', { name: 'Retry' }))
    expect(page.emitted<unknown[]>('retry')?.[0]?.[0]).toBeInstanceOf(MouseEvent)
    await page.rerender({ error: '' })
    expect(page.getByRole('textbox', { name: 'Account name' })).toBeTruthy()
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
    expect(
      save
        .querySelector('[data-testid="shortcut-hint"]')
        ?.classList.contains('pointer-coarse:hidden')
    ).toBe(true)
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

  it('saves the Profile on Command S and leaves the browser save alone when clean', async () => {
    const view = render(ProfilePage)
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
    expect(view.emitted<unknown[]>('submit')?.[0]?.[1]).toMatchObject({ accountName: 'Acme Labs' })
    await view.rerender({ saving: true })
    await waitFor(() => expect(save.getAttribute('aria-busy')).toBe('true'))
  })
})
