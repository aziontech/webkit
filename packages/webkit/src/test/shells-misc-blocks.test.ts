import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import CreationHeader from '../../blocks/headers/creation-header/creation-header.vue'
import DocsHeader from '../../blocks/headers/docs-header/docs-header.vue'
import ResourceHeader from '../../blocks/headers/resource-header/resource-header.vue'
import SecondLevel from '../../blocks/headers/resource-header/variants/second-level.vue'
import Login from '../../blocks/platform/auth/auth.vue'
import CheckInbox from '../../blocks/platform/auth/variants/check-inbox.vue'
import EmailAlreadyRegistered from '../../blocks/platform/auth/variants/email-already-registered.vue'
import IncorrectCredentials from '../../blocks/platform/auth/variants/incorrect-credentials.vue'
import ServerError from '../../blocks/platform/auth/variants/server-error.vue'
import Submitting from '../../blocks/platform/auth/variants/submitting.vue'
import DeleteWithConfirmation from '../../blocks/platform/delete/delete-with-confirmation/delete-with-confirmation.vue'
import DeleteFailed from '../../blocks/platform/delete/delete-with-confirmation/variants/failed.vue'
import SettingsForm from '../../blocks/platform/settings/settings-form/settings-form.vue'
import ConsoleShell from '../../blocks/shells/console/console.vue'
import AccountSwitch from '../../blocks/shells/console/variants/account-switch.vue'
import Notifications from '../../blocks/shells/console/variants/notifications.vue'

afterEach(() => cleanup())

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement | undefined

describe('headers/resource-header', () => {
  it.each([
    ['FirstLevel', ResourceHeader],
    ['SecondLevel', SecondLevel]
  ])('%s: the search trigger opens the Command palette', async (_name, block) => {
    const view = render(block)
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: /Search/ }))
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).not.toBeNull())
    expect(document.body.textContent).toContain('Applications')
  })

  it('opens the account menu from the avatar', async () => {
    const view = render(ResourceHeader)
    await fireEvent.click(view.getByRole('button', { name: 'Account menu' }))
    await waitFor(() =>
      expect(document.body.querySelector('[role="menu"]')?.textContent).toContain('Log out')
    )
  })
})

describe('headers/creation-header', () => {
  it('makes the back control a link to the list it came from', () => {
    const view = render(CreationHeader)
    const back = view.getByRole('link', { name: 'Back to Resources' })
    expect(back.getAttribute('href')).toBe('/resources')
  })
})

describe('headers/docs-header', () => {
  it('renders the section links as links with a route', () => {
    const view = render(DocsHeader)
    expect(view.getByRole('link', { name: 'Guides' }).getAttribute('href')).toBe('/docs/guides')
    expect(view.getByRole('link', { name: 'Azion Docs home' }).getAttribute('href')).toBe('/docs')
  })
})

describe('shells/console', () => {
  it('leaves the list controls row to table-view', () => {
    const view = render(ConsoleShell)
    expect(view.queryByRole('button', { name: 'Download CSV' })).toBeNull()
    expect(buttonByText('Filter', view.container as HTMLElement)).toBeUndefined()
  })

  it('Notifications: Clear all can be undone from the toast', async () => {
    const view = render(Notifications)
    const list = () => document.querySelector('[data-slot="item-list"]')
    await waitFor(() => expect(list()?.textContent).toContain('azion-site failed to deploy'))
    await fireEvent.click(buttonByText('Clear all') as HTMLButtonElement)
    await waitFor(() => expect(document.body.textContent).toContain('You are all caught up'))
    const undo = await waitFor(() => {
      const button = buttonByText('Undo')
      expect(button).toBeTruthy()
      return button as HTMLButtonElement
    })
    await fireEvent.click(undo)
    await waitFor(() => expect(list()?.textContent).toContain('azion-site failed to deploy'))
    view.unmount()
  })

  it('AccountSwitch: names are link buttons and the search gets a generated id', async () => {
    const view = render(AccountSwitch)
    const trigger = view
      .getAllByRole('button')
      .find((b) => b.getAttribute('aria-label')?.startsWith('Account:')) as HTMLElement
    await fireEvent.click(trigger)
    const search = (await waitFor(() =>
      document.querySelector('input[aria-label="Search accounts"]')
    )) as HTMLInputElement
    expect(search.id).not.toBe('account-switch-search')
    expect(search.id.length).toBeGreaterThan(0)
    await waitFor(() =>
      expect(
        Array.from(document.querySelectorAll('[role="dialog"] button')).some(
          (b) => b.textContent?.trim() === 'Acme Labs'
        )
      ).toBe(true)
    )
  })
})

describe('platform/auth', () => {
  it('locks the step and shows the primary loading while Sign in is in flight', async () => {
    const view = render(Login)
    await fireEvent.update(view.getByLabelText('Email'), 'jane.doe@example.com')
    await fireEvent.click(view.getByRole('button', { name: 'Continue with email' }))
    await waitFor(() => expect(view.getByLabelText('Password')).toBeTruthy())
    await fireEvent.update(view.getByLabelText('Password'), 'correct-horse-battery')
    await fireEvent.click(view.getByRole('button', { name: 'Sign in' }))
    expect(view.container.querySelector('form')?.getAttribute('aria-busy')).toBe('true')
    expect((view.container.querySelector('fieldset') as HTMLFieldSetElement).disabled).toBe(true)
    await waitFor(() => expect(view.getByText('Signed in.')).toBeTruthy())
    expect((view.container.querySelector('fieldset') as HTMLFieldSetElement).disabled).toBe(false)
  })

  it('Forgot your password? is a button, not an anchor to #', async () => {
    const view = render(Submitting)
    expect(view.container.querySelector('a[href="#"]')).toBeNull()
    expect(view.getByRole('button', { name: 'Forgot your password?' })).toBeTruthy()
  })

  it('Submitting: opens in flight on the password step', () => {
    const view = render(Submitting)
    expect(view.container.querySelector('form')?.getAttribute('aria-busy')).toBe('true')
    expect((view.container.querySelector('fieldset') as HTMLFieldSetElement).disabled).toBe(true)
  })

  it('IncorrectCredentials: the two-step card on its password step, notice under the heading', () => {
    const view = render(IncorrectCredentials)
    expect(view.getByRole('heading', { level: 1, name: 'Welcome back' })).toBeTruthy()
    expect(view.getByLabelText('Password')).toBeTruthy()
    expect(view.queryByLabelText('Email')).toBeNull()
    expect(view.getByText('Incorrect email or password. Check both and try again.')).toBeTruthy()
    expect(view.queryByRole('button', { name: 'Retry' })).toBeNull()
  })

  it('ServerError: Retry re-sends the request with the loading state', async () => {
    const view = render(ServerError)
    const retry = view.getByRole('button', { name: 'Retry' })
    await fireEvent.click(retry)
    expect(view.container.querySelector('form')?.getAttribute('aria-busy')).toBe('true')
    await waitFor(() =>
      expect(view.container.querySelector('form')?.getAttribute('aria-busy')).toBeNull()
    )
    expect(view.getByText(/Sign-in failed on our side/)).toBeTruthy()
  })

  it('EmailAlreadyRegistered: the exits are real links', () => {
    const view = render(EmailAlreadyRegistered)
    expect(view.getByRole('link', { name: 'reset your password' }).getAttribute('href')).toBe(
      '/login?reset=1'
    )
    expect(view.container.querySelector('a[href="#"]')).toBeNull()
  })

  it('CheckInbox: Resend email sends another link', async () => {
    const view = render(CheckInbox)
    await fireEvent.click(view.getByRole('button', { name: 'Resend email' }))
    await waitFor(() =>
      expect(view.getByText('We sent another link to jane.doe@example.com.')).toBeTruthy()
    )
  })
})

describe('platform/delete/delete-with-confirmation', () => {
  const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null

  it('locks the dialog while Delete runs, then closes it', async () => {
    const view = render(DeleteWithConfirmation)
    await fireEvent.click(view.getByRole('button', { name: 'Delete resource' }))
    const panel = await waitFor(() => dialog() as HTMLElement)
    expect(panel.querySelector('button[aria-label="Copy resource-01"]')).not.toBeNull()
    const input = panel.querySelector('input') as HTMLInputElement
    await fireEvent.update(input, 'resource-01')
    const confirm = Array.from(panel.querySelectorAll('button')).find(
      (b) => b.textContent?.trim() === 'Delete resource'
    ) as HTMLButtonElement
    await fireEvent.click(confirm)
    await waitFor(() => expect(input.disabled).toBe(true))
    await waitFor(() => expect(input.disabled).toBe(false), { timeout: 2000 })
    await waitFor(() => expect(panel.isConnected).toBe(false), { timeout: 3000 })
  })

  it('Failed: keeps the dialog and the typed name, with the reason in a danger alert', () => {
    render(DeleteFailed)
    const panel = dialog() as HTMLElement
    expect(panel.textContent).toContain('resource-01 is still used by 2 workloads')
    expect((panel.querySelector('input') as HTMLInputElement).value).toBe('resource-01')
  })
})

describe('platform/settings/settings-form', () => {
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
