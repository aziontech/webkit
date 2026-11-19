import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import Login from '../../../../blocks/auth/auth-sign-in/auth-sign-in.vue'
import TokenSignIn from '../../../../blocks/auth/auth-sign-in/token-sign-in.vue'
import CheckInbox from '../../../../blocks/auth/auth-sign-in/variants/check-inbox.vue'
import DeviceAuthorization from '../../../../blocks/auth/auth-sign-in/variants/device-authorization.vue'
import EmailAlreadyRegistered from '../../../../blocks/auth/auth-sign-in/variants/email-already-registered.vue'
import IncorrectCredentials from '../../../../blocks/auth/auth-sign-in/variants/incorrect-credentials.vue'
import MfaCode from '../../../../blocks/auth/auth-sign-in/variants/mfa-code.vue'
import MfaSetup from '../../../../blocks/auth/auth-sign-in/variants/mfa-setup.vue'
import NoAccessToken from '../../../../blocks/auth/auth-sign-in/variants/no-access-token.vue'
import OauthConsent from '../../../../blocks/auth/auth-sign-in/variants/oauth-consent.vue'
import PersonalToken from '../../../../blocks/auth/auth-sign-in/variants/personal-token.vue'
import ProvidersLoading from '../../../../blocks/auth/auth-sign-in/variants/providers-loading.vue'
import RejectedToken from '../../../../blocks/auth/auth-sign-in/variants/rejected-token.vue'
import ServerError from '../../../../blocks/auth/auth-sign-in/variants/server-error.vue'
import Submitting from '../../../../blocks/auth/auth-sign-in/variants/submitting.vue'
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
describe('auth/auth-sign-in#ProvidersLoading', () => {
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

    await fireEvent.update(view.getByLabelText(/^Email\b/), 'jane.doe@example.com')
    await fireEvent.click(view.getByRole('button', { name: 'Continue with email' }))

    await waitFor(() => expect(view.getByLabelText(/^Password\b/)).toBeTruthy())
    expect(view.getByText('jane.doe@example.com')).toBeTruthy()
  })
})

describe('auth/auth-sign-in#Login', () => {
  it('shows the provider buttons and walks from the email to the password step', async () => {
    const view = render(Login)

    expect(view.getByRole('button', { name: 'Continue with Google' })).toBeTruthy()
    expect(view.queryByRole('status', { name: 'Preparing sign-in providers' })).toBeNull()

    await fireEvent.update(view.getByLabelText(/^Email\b/), 'jane.doe@example.com')
    await fireEvent.click(view.getByRole('button', { name: 'Continue with email' }))

    await waitFor(() => expect(view.getByLabelText(/^Password\b/)).toBeTruthy())
    await expectNoA11yViolations(view.container)
  })
})

describe('auth/auth-sign-in#OauthConsent', () => {
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

describe.each([
  ['OauthConsent', OauthConsent],
  ['DeviceAuthorization', DeviceAuthorization]
])('auth/auth-sign-in#%s signed-in account', (_, Variant) => {
  it('ends a long name or email on an ellipsis and keeps the full value in its title', () => {
    const view = render(Variant)
    for (const value of ['Jane Doe', 'jane.doe@example.com']) {
      const text = view.getByText(value)
      expect(text).toHaveAttribute('title', value)
      expect(text.classList.contains('truncate')).toBe(true)
    }
  })
})

describe('auth/auth-sign-in#DeviceAuthorization', () => {
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

  it('issues recovery codes and holds Continue until the user confirms they saved them', async () => {
    const view = render(MfaSetup)
    await typeCode(view.getByLabelText('Authentication code'), '123456')
    await waitFor(() => expect(view.getByText('Save your recovery codes')).toBeTruthy(), {
      timeout: 2000
    })
    const codes = within(view.getByRole('list', { name: 'Recovery codes' })).getAllByRole(
      'listitem'
    )
    expect(codes).toHaveLength(8)
    for (const item of codes) expect(item.textContent?.trim()).toMatch(/^[A-Z0-9]{8}$/)
    expect(view.getByRole('button', { name: 'Copy recovery codes' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Download' })).toBeTruthy()
    const proceed = view.getByRole('button', { name: 'Continue to Console' })
    expect(proceed.hasAttribute('disabled')).toBe(true)
    await fireEvent.click(view.getByLabelText('I saved these codes'))
    await waitFor(() =>
      expect(view.getByRole('link', { name: 'Continue to Console' }).getAttribute('href')).toBe(
        '/home'
      )
    )
    await expectNoA11yViolations(view.container)
  })
})

describe('auth/auth-sign-in', () => {
  it('emits submit with the credentials and follows the request state it is given', async () => {
    const view = render(Login)
    await fireEvent.update(view.getByLabelText(/^Email\b/), 'jane.doe@example.com')
    await fireEvent.click(view.getByRole('button', { name: 'Continue with email' }))
    await waitFor(() => expect(view.getByLabelText(/^Password\b/)).toBeTruthy())
    expect(view.emitted<unknown[]>('continue')?.[0]?.[1]).toBe('jane.doe@example.com')
    await fireEvent.update(view.getByLabelText(/^Password\b/), 'correct-horse-battery')
    await fireEvent.click(view.getByRole('button', { name: 'Sign in' }))
    const [event, values] = view.emitted<unknown[]>('submit')?.[0] ?? []
    expect(event).toBeInstanceOf(Event)
    expect(values).toEqual({ email: 'jane.doe@example.com', password: 'correct-horse-battery' })
    await view.rerender({ loading: true })
    expect(view.container.querySelector('form')?.getAttribute('aria-busy')).toBe('true')
    expect((view.container.querySelector('fieldset') as HTMLFieldSetElement).disabled).toBe(true)
    await view.rerender({ loading: false, notice: 'signed-in' })
    await waitFor(() => expect(view.getByText('Signed in.')).toBeTruthy())
    expect((view.container.querySelector('fieldset') as HTMLFieldSetElement).disabled).toBe(false)
  })

  it('clears the password and shows the 401 notice when the request is rejected', async () => {
    const view = render(Login, {
      props: {
        step: 'password',
        defaultValues: { email: 'jane.doe@example.com', password: 'wrong-password' }
      }
    })
    await view.rerender({ error: 'bad-credentials' })
    await waitFor(() =>
      expect(view.getByText('Incorrect email or password. Check both and try again.')).toBeTruthy()
    )
    expect((view.getByLabelText(/^Password\b/) as HTMLInputElement).value).toBe('')
    await waitFor(() => expect(document.activeElement).toBe(view.getByLabelText(/^Password\b/)))
  })

  it('shows a free error message with Retry and emits the provider and the links it is given', async () => {
    const view = render(Login, {
      props: {
        error: 'Azion did not accept this token.',
        signUpHref: 'https://example.com/join',
        homeHref: '/'
      }
    })
    expect(view.getByText('Azion did not accept this token.')).toBeTruthy()
    expect(view.getByRole('button', { name: 'Retry' })).toBeTruthy()
    expect(view.getByRole('link', { name: 'Sign up' }).getAttribute('href')).toBe(
      'https://example.com/join'
    )
    expect(view.getByRole('link', { name: 'Azion home' }).getAttribute('href')).toBe('/')
    await fireEvent.click(view.getByRole('button', { name: 'Continue with GitHub' }))
    const [event, provider] = view.emitted<unknown[]>('provider-click')?.[0] ?? []
    expect(event).toBeInstanceOf(MouseEvent)
    expect(provider).toBe('github')
  })

  it('emits reset-request with the email and moves to Check your inbox', async () => {
    const view = render(Login, {
      props: { step: 'password', defaultValues: { email: 'jane.doe@example.com' } }
    })
    await fireEvent.click(view.getByRole('button', { name: 'Forgot your password?' }))
    await fireEvent.click(view.getByRole('button', { name: 'Send reset link' }))
    expect(view.emitted<unknown[]>('reset-request')?.[0]?.[1]).toBe('jane.doe@example.com')
    expect(view.getByRole('heading', { level: 1, name: 'Check your inbox' })).toBeTruthy()
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
    expect(view.getByLabelText(/^Password\b/)).toBeTruthy()
    expect(view.queryByLabelText(/^Email\b/)).toBeNull()
    expect(view.getByText('Incorrect email or password. Check both and try again.')).toBeTruthy()
    expect(view.queryByRole('button', { name: 'Retry' })).toBeNull()
  })

  it('ServerError: Retry re-sends the same credentials', async () => {
    const view = render(Login, {
      props: {
        step: 'password',
        defaultValues: { email: 'jane.doe@example.com', password: 'correct-horse-battery' },
        error: 'server-error'
      }
    })
    expect(view.getByText(/Sign-in failed on our side/)).toBeTruthy()
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted<unknown[]>('submit')?.[0]?.[1]).toEqual({
      email: 'jane.doe@example.com',
      password: 'correct-horse-battery'
    })
    await view.rerender({ loading: true })
    expect(view.container.querySelector('form')?.getAttribute('aria-busy')).toBe('true')
    await view.rerender({ loading: false })
    await waitFor(() =>
      expect(view.container.querySelector('form')?.getAttribute('aria-busy')).toBeNull()
    )
    expect(view.getByText(/Sign-in failed on our side/)).toBeTruthy()
  })

  it('ServerError: the variant opens on the 500 notice with Retry', () => {
    const view = render(ServerError)
    expect(view.getByText(/Sign-in failed on our side/)).toBeTruthy()
    expect(view.getByRole('button', { name: 'Retry' })).toBeTruthy()
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

describe('auth/auth-sign-in#PersonalToken', () => {
  const VALID = 'azion0123456789abcdef0123456789abcdef'

  it('labels the token field, hides it by default and links to where tokens are made', async () => {
    const view = render(PersonalToken)
    const input = view.getByLabelText(/^Personal token\b/) as HTMLInputElement

    expect(input.tagName).toBe('INPUT')
    expect(input.type).toBe('password')
    expect(input.getAttribute('autocomplete')).toBe('off')
    await fireEvent.click(view.getByRole('button', { name: 'Show password' }))
    expect(input.type).toBe('text')
    const link = view.getByRole('link', { name: 'How to create a personal token' })
    expect(link.getAttribute('href')).toContain('azion.com')
    await expectNoA11yViolations(view.container)
  })

  it('asks for a token on an empty submit and emits nothing', async () => {
    const view = render(PersonalToken)

    await fireEvent.click(view.getByRole('button', { name: 'Sign in' }))

    expect(view.getByText('Paste your personal token.')).toBeTruthy()
    expect(view.getByLabelText(/^Personal token/).getAttribute('aria-invalid')).toBe('true')
    expect(view.emitted()['sign-in']).toBeUndefined()
  })

  it('emits any well-formed token, short or all nines, and fakes no answer', async () => {
    const view = render(TokenSignIn)

    await fireEvent.update(view.getByLabelText(/^Personal token\b/), '  short-token  ')
    await fireEvent.click(view.getByRole('button', { name: 'Sign in' }))
    await fireEvent.update(view.getByLabelText(/^Personal token\b/), '999999')
    await fireEvent.click(view.getByRole('button', { name: 'Sign in' }))

    const calls = view.emitted()['sign-in'] as [Event, string][]
    expect(calls).toHaveLength(2)
    expect(calls[0][0]).toBeInstanceOf(Event)
    expect(calls.map(([, token]) => token)).toEqual(['short-token', '999999'])
    expect(view.container.textContent).not.toMatch(/did not accept|could not reach/)
  })

  it('locks the field and spins Sign in while loading, then shows the rejection the app answers', async () => {
    const view = render(TokenSignIn, { props: { loading: true } })
    expect(view.getByRole('form').getAttribute('aria-busy')).toBe('true')
    expect(view.getByLabelText(/^Personal token\b/).matches(':disabled')).toBe(true)

    await view.rerender({ loading: false, error: 'rejected' })
    await waitFor(() => expect(view.getByText(/Azion did not accept this token/)).toBeTruthy())
    expect((view.getByLabelText(/^Personal token\b/) as HTMLInputElement).value).toBe('')
    expect(view.queryByRole('button', { name: 'Retry' })).toBeNull()
  })

  it.each([
    ['rate-limited', /limiting requests/],
    ['unreachable', /could not reach Azion/],
    ['The API answered 502.', /The API answered 502\./]
  ])('keeps the entry and re-sends it from Retry on %s', async (error, copy) => {
    const view = render(TokenSignIn)
    await fireEvent.update(view.getByLabelText(/^Personal token\b/), VALID)
    await view.rerender({ error })

    expect(view.getByText(copy)).toBeTruthy()
    expect((view.getByLabelText(/^Personal token\b/) as HTMLInputElement).value).toBe(VALID)
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    const calls = view.emitted()['sign-in'] as [Event, string][]
    expect(calls.at(-1)?.[1]).toBe(VALID)
  })

  it('Remember for this tab is off by default and only reports the choice', async () => {
    const view = render(TokenSignIn)
    const remember = view.getByRole('checkbox', { name: 'Remember for this tab' })

    expect(
      (remember as HTMLInputElement).checked ?? remember.getAttribute('aria-checked')
    ).toBeFalsy()
    await fireEvent.click(remember)
    expect(view.emitted()['update:remember']).toEqual([[true]])
    expect(sessionStorage.length).toBe(0)
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('RejectedToken: opens on the rejection with the field focused', async () => {
    const view = render(RejectedToken)

    expect(view.getByText(/Azion did not accept this token/)).toBeTruthy()
    await waitFor(() =>
      expect(document.activeElement).toBe(view.getByLabelText(/^Personal token\b/))
    )
    await expectNoA11yViolations(view.container)
  })

  it('NoAccessToken: asks for a token with access and focuses the empty field', async () => {
    const view = render(NoAccessToken)

    expect(view.getByText(/valid but cannot read what this app needs/)).toBeTruthy()
    expect(view.queryByRole('button', { name: 'Retry' })).toBeNull()
    await waitFor(() =>
      expect(document.activeElement).toBe(view.getByLabelText(/^Personal token\b/))
    )
    await expectNoA11yViolations(view.container)
  })
})
