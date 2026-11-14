import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Login from '../../blocks/platform/auth/auth.vue'
import ProvidersLoading from '../../blocks/platform/auth/variants/providers-loading.vue'
import { expectNoA11yViolations } from './axe'

afterEach(() => cleanup())

describe('platform/auth#ProvidersLoading', () => {
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

describe('platform/auth#Login', () => {
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
