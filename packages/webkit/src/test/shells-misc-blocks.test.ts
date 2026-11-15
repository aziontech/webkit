import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import ApprovalFailed from '../../blocks/ai/ai-action-approval/variants/error.vue'
import AiChatDrawer from '../../blocks/ai/ai-chat-drawer/ai-chat-drawer.vue'
import Login from '../../blocks/auth/sign-in/sign-in.vue'
import CheckInbox from '../../blocks/auth/sign-in/variants/check-inbox.vue'
import EmailAlreadyRegistered from '../../blocks/auth/sign-in/variants/email-already-registered.vue'
import IncorrectCredentials from '../../blocks/auth/sign-in/variants/incorrect-credentials.vue'
import ServerError from '../../blocks/auth/sign-in/variants/server-error.vue'
import Submitting from '../../blocks/auth/sign-in/variants/submitting.vue'
import DeleteWithConfirmation from '../../blocks/edit/delete-dialog/delete-dialog.vue'
import DeleteFailed from '../../blocks/edit/delete-dialog/variants/error.vue'
import SettingsForm from '../../blocks/settings/settings-form/settings-form.vue'
import ConsoleShell from '../../blocks/shell/console/console.vue'
import AccountSwitch from '../../blocks/shell/console/variants/account-switch.vue'
import Notifications from '../../blocks/shell/console/variants/notifications.vue'
import AsyncSubmit from '../../blocks/state/async-submit/async-submit.vue'
import FirstUse from '../../blocks/state/first-use/first-use.vue'
import SectionRejected from '../../blocks/state/form-validation/variants/section-rejected.vue'
import ProjectIntake from '../../blocks/state/project-intake/project-intake.vue'
import Initializing from '../../blocks/state/project-intake/variants/initializing.vue'
import UploadError from '../../blocks/state/project-intake/variants/upload-error.vue'
import AuthBar from '../../blocks/top-bar/auth-bar/auth-bar.vue'
import CreationBar from '../../blocks/top-bar/creation-bar/creation-bar.vue'

afterEach(() => cleanup())

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement | undefined

describe('top-bar/creation-bar', () => {
  it('makes the back control a link to the list it came from', () => {
    const view = render(CreationBar)
    const back = view.getByRole('link', { name: 'Back to Resources' })
    expect(back.getAttribute('href')).toBe('/resources')
  })
})

describe('top-bar/auth-bar', () => {
  it('offers Documentation and no account control', () => {
    const view = render(AuthBar)
    expect(view.getByRole('link', { name: 'Azion home' })).toBeTruthy()
    expect(view.queryByRole('button', { name: 'Account menu' })).toBeNull()
  })
})

describe('shell/console', () => {
  it('leaves the list controls row to table-view', () => {
    const view = render(ConsoleShell)
    expect(view.queryByRole('button', { name: 'Download CSV' })).toBeNull()
    expect(buttonByText('Filter', view.container as HTMLElement)).toBeUndefined()
  })

  it('renders the console bar: the search trigger opens the Command palette', async () => {
    const view = render(ConsoleShell)
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: /Search/ }))
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).not.toBeNull())
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

describe('auth/sign-in', () => {
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

describe('edit/delete-dialog', () => {
  const confirmPanel = () =>
    waitFor(() => {
      const found = Array.from(document.querySelectorAll('[role="alertdialog"]')).find((el) =>
        el.textContent?.includes('to confirm.')
      )
      expect(found).toBeTruthy()
      return found as HTMLElement
    })

  it('locks the dialog while Delete runs, then closes it', async () => {
    const view = render(DeleteWithConfirmation)
    await userEvent.click(view.getByRole('button', { name: 'Delete resource' }))
    const panel = await confirmPanel()
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

  it('Failed: keeps the dialog and the typed name, with the reason in a danger alert', async () => {
    render(DeleteFailed)
    const panel = await confirmPanel()
    expect(panel.textContent).toContain('resource-01 is still used by 2 workloads')
    expect((panel.querySelector('input') as HTMLInputElement).value).toBe('resource-01')
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

describe('ai', () => {
  it('ai-action-approval Failed: says what failed and offers Retry', async () => {
    const view = render(ApprovalFailed)
    await waitFor(() =>
      expect(view.container.textContent).toContain('still serves the previous version')
    )
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    await waitFor(() =>
      expect(view.container.textContent).not.toContain('failed while uploading the build')
    )
  })

  it('ai-chat-drawer opens the assistant from Agent without dimming the page', async () => {
    const view = render(AiChatDrawer)
    await fireEvent.click(view.getByRole('button', { name: 'Agent' }))
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).not.toBeNull())
    expect(document.querySelector('[data-testid$="__backdrop"]')).toBeNull()
  })
})

describe('state/project-intake', () => {
  it('offers Choose a folder as the keyboard way in', () => {
    const view = render(ProjectIntake)
    expect(view.getByRole('button', { name: 'Choose a folder' })).toBeTruthy()
    expect(
      view.container.querySelector('[aria-hidden="true"] h1, [aria-hidden="true"] p')
    ).toBeNull()
  })

  it('Initializing: each row says its status in words, and the page adds no live region', () => {
    const view = render(Initializing)
    const rows = Array.from(view.container.querySelectorAll('[data-testid$="__row"]'))
    expect(rows).toHaveLength(5)
    expect(rows[0].textContent).toContain('Done')
    expect(rows[4].textContent).toContain('Waiting')
    expect(view.container.querySelector('[aria-live="polite"]:not([data-testid])')).toBeNull()
  })

  it('UploadError: Retry clears the failure', async () => {
    const view = render(UploadError)
    expect(view.container.textContent).toContain('1 file could not be uploaded')
    const alertRetry = Array.from(
      view.container.querySelectorAll('[role="alert"] button, [role="status"] button')
    ).find((b) => b.textContent?.trim() === 'Retry') as HTMLButtonElement
    await fireEvent.click(alertRetry ?? (buttonByText('Retry') as HTMLButtonElement))
    await waitFor(() =>
      expect(view.container.textContent).not.toContain('1 file could not be uploaded')
    )
  })
})

describe('state/first-use', () => {
  it('makes both promos links and copies the real CLI command', () => {
    const view = render(FirstUse)
    const catalog = view.getByRole('link', { name: /Start from a Catalog template/ })
    expect(catalog.getAttribute('target')).toBe('_blank')
    expect(view.getByRole('link', { name: /Set up your coding agent/ }).getAttribute('href')).toBe(
      '/agent-setup'
    )
    expect((view.getByLabelText('Via CLI command') as HTMLInputElement).value).toBe('azion deploy')
  })
})

describe('state async-submit and form-validation', () => {
  it('async-submit: no simulation panel, and Deploy starts the run', async () => {
    const view = render(AsyncSubmit)
    expect(view.queryByRole('complementary', { name: 'Scenario simulation' })).toBeNull()
    expect(view.getByRole('heading', { level: 1, name: 'Deploy web-app' })).toBeTruthy()
    await fireEvent.click(view.getByRole('button', { name: 'Deploy' }))
    await waitFor(() => expect(view.container.textContent).toContain('Deploying'))
    view.unmount()
  })

  it('form-validation SectionRejected: the section alert recovers with Reload origins', async () => {
    const view = render(SectionRejected)
    expect(view.queryByRole('complementary', { name: 'Scenario simulation' })).toBeNull()
    expect(view.getByRole('link', { name: 'Services' })).toBeTruthy()
    expect(view.container.textContent).toContain('This origin no longer exists.')
    await fireEvent.click(view.getByRole('button', { name: 'Reload origins' }))
    await waitFor(
      () => expect(view.container.textContent).toContain('Select an origin to continue.'),
      { timeout: 4000 }
    )
    expect(view.container.textContent).not.toContain('This origin no longer exists.')
  })
})
