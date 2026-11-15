import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import Login from '../../../../blocks/auth/sign-in/sign-in.vue'
import CheckInbox from '../../../../blocks/auth/sign-in/variants/check-inbox.vue'
import DeviceAuthorization from '../../../../blocks/auth/sign-in/variants/device-authorization.vue'
import EmailAlreadyRegistered from '../../../../blocks/auth/sign-in/variants/email-already-registered.vue'
import IncorrectCredentials from '../../../../blocks/auth/sign-in/variants/incorrect-credentials.vue'
import MfaCode from '../../../../blocks/auth/sign-in/variants/mfa-code.vue'
import MfaSetup from '../../../../blocks/auth/sign-in/variants/mfa-setup.vue'
import OauthConsent from '../../../../blocks/auth/sign-in/variants/oauth-consent.vue'
import ProvidersLoading from '../../../../blocks/auth/sign-in/variants/providers-loading.vue'
import ServerError from '../../../../blocks/auth/sign-in/variants/server-error.vue'
import Submitting from '../../../../blocks/auth/sign-in/variants/submitting.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

afterEach(() => cleanup())

useToastRegion()

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement

const typeCode = async (input: HTMLElement, code: string) => {
  await userEvent.click(input)
  await userEvent.keyboard(code)
}
describe('auth/sign-in#ProvidersLoading', () => {
  it('holds the provider buttons place with a named status region', async () => {
    const view = render(ProvidersLoading)
    const status = view.getByRole('status', { name: 'Preparing sign-in providers' })

    expect(status.children).toHaveLength(2)
    expect(view.queryByRole('button', { name: 'Continue with Google' })).toBeNull()
    expect(view.queryByRole('button', { name: 'Continue with GitHub' })).toBeNull()
    await expectNoA11yViolations(view.container)
  })

  it('keeps email sign-in usable while the providers load', async () => {
    const view = render(ProvidersLoading)

    await fireEvent.update(view.getByLabelText('Email'), 'jane.doe@example.com')
    await fireEvent.click(view.getByRole('button', { name: 'Continue with email' }))

    await waitFor(() => expect(view.getByLabelText('Password')).toBeTruthy())
    expect(view.getByText('jane.doe@example.com')).toBeTruthy()
  })
})

describe('auth/sign-in#Login', () => {
  it('shows the provider buttons and walks from the email to the password step', async () => {
    const view = render(Login)

    expect(view.getByRole('button', { name: 'Continue with Google' })).toBeTruthy()
    expect(view.queryByRole('status', { name: 'Preparing sign-in providers' })).toBeNull()

    await fireEvent.update(view.getByLabelText('Email'), 'jane.doe@example.com')
    await fireEvent.click(view.getByRole('button', { name: 'Continue with email' }))

    await waitFor(() => expect(view.getByLabelText('Password')).toBeTruthy())
    await expectNoA11yViolations(view.container)
  })
})

describe('auth/sign-in#OauthConsent', () => {
  it('names the app, the account and every requested scope', async () => {
    const view = render(OauthConsent)

    expect(view.getByRole('heading', { level: 1, name: 'Authorize Acme Deploy' })).toBeTruthy()
    expect(view.getByText('jane.doe@example.com')).toBeTruthy()
    expect(view.getByRole('link', { name: 'Switch account' })).toHaveAttribute(
      'href',
      '/login?prompt=select_account'
    )
    const scopes = view.getByRole('list', { name: 'Acme Deploy will be able to' })
    expect(scopes.querySelectorAll('[role="listitem"]')).toHaveLength(3)
    await expectNoA11yViolations(view.container)
  })

  it('grants access on Allow and locks both answers', async () => {
    const view = render(OauthConsent)
    const allow = view.getByRole('button', { name: 'Allow' })
    const deny = view.getByRole('button', { name: 'Deny' })

    await fireEvent.click(allow)
    expect(deny).toBeDisabled()

    await waitFor(
      () => expect(view.getByText('Access granted. Returning to Acme Deploy.')).toBeTruthy(),
      {
        timeout: 2000
      }
    )
    expect(view.getByRole('button', { name: 'Allow' })).toBeDisabled()
    expect(view.getByRole('button', { name: 'Deny' })).toBeDisabled()
  })

  it('reports a denial in the notice', async () => {
    const view = render(OauthConsent)

    await fireEvent.click(view.getByRole('button', { name: 'Deny' }))

    await waitFor(() => expect(view.getByText(/Access denied/)).toBeTruthy(), { timeout: 2000 })
    expect(view.getByRole('button', { name: 'Allow' })).toBeDisabled()
  })
})

describe('auth/sign-in#DeviceAuthorization', () => {
  it('shows the code to compare with the request details', async () => {
    const view = render(DeviceAuthorization)

    expect(view.getByText('WDJB-MJHT')).toBeTruthy()
    expect(view.getByRole('list', { name: 'Acme CLI will be able to' })).toBeTruthy()
    expect(view.getByText('203.0.113.24')).toBeTruthy()
    await expectNoA11yViolations(view.container)
  })

  it('connects the device on Confirm', async () => {
    const view = render(DeviceAuthorization)

    await fireEvent.click(view.getByRole('button', { name: 'Confirm' }))

    await waitFor(() => expect(view.getByText(/Device connected/)).toBeTruthy(), { timeout: 2000 })
    expect(view.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  })

  it('rejects an unknown typed code on the field and accepts a valid one', async () => {
    const view = render(DeviceAuthorization)

    await fireEvent.click(view.getByText(/Enter the code from your terminal/))
    const input = await waitFor(() => view.getByLabelText('Device code'))
    expect(input).toHaveAttribute('maxlength', '8')

    await userEvent.click(input)
    await userEvent.keyboard('00000000')
    await waitFor(
      () => expect(view.getByText(/That code is not valid or has expired/)).toBeTruthy(),
      {
        timeout: 2000
      }
    )
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(document.activeElement).toBe(input)

    await userEvent.keyboard('KXPQ7R2M')
    await waitFor(() => expect(view.getByText('KXPQ-7R2M')).toBeTruthy(), { timeout: 2000 })
    expect(view.getByRole('button', { name: 'Confirm' })).toBeTruthy()
  })
})

describe('auth#MfaCode', () => {
  it('rejects a wrong code on the field, clears it and keeps focus', async () => {
    const view = render(MfaCode)
    const input = view.getByLabelText('Authentication code')
    await typeCode(input, '000000')
    await waitFor(() => expect(view.getByText(/That code is not valid/)).toBeTruthy(), {
      timeout: 2000
    })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect((input as HTMLInputElement).value).toBe('')
    expect(document.activeElement).toBe(input)
  })

  it('switches to an 8-character recovery code', async () => {
    const view = render(MfaCode)
    await fireEvent.click(view.getByText('Use a recovery code'))
    const input = await waitFor(() => view.getByLabelText('Recovery code'))
    expect(input).toHaveAttribute('maxlength', '8')
    expect(input).toHaveAttribute('inputmode', 'text')
  })

  it('signs in with a valid code', async () => {
    const view = render(MfaCode)
    await typeCode(view.getByLabelText('Authentication code'), '482913')
    await waitFor(() => expect(view.getByText('Signed in.')).toBeTruthy(), { timeout: 2000 })
  })
})

describe('auth#MfaSetup', () => {
  it('offers the setup key as text with a copy button and verifies the code', async () => {
    const view = render(MfaSetup)
    expect(view.getByText('JBSW Y3DP EHPK 3PXP')).toBeTruthy()
    expect(view.getByRole('button', { name: 'Copy setup key' })).toBeTruthy()
    expect(view.getByRole('img', { name: /QR code to add/ })).toBeTruthy()
    await fireEvent.click(buttonByText('Verify code'))
    expect(view.getByText('Enter the 6-digit code from the app.')).toBeTruthy()
    await typeCode(view.getByLabelText('Authentication code'), '123456')
    await waitFor(() => expect(view.getByText(/Multi-factor authentication is on/)).toBeTruthy(), {
      timeout: 2000
    })
    await expectNoA11yViolations(view.container)
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
