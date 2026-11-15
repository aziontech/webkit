import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import DeviceAuthorization from '../../blocks/platform/auth/variants/device-authorization.vue'
import OauthConsent from '../../blocks/platform/auth/variants/oauth-consent.vue'
import { expectNoA11yViolations } from './axe'

afterEach(() => cleanup())

describe('platform/auth#OauthConsent', () => {
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

describe('platform/auth#DeviceAuthorization', () => {
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
