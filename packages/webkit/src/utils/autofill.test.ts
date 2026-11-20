import { describe, expect, it } from 'vitest'

import { PASSWORD_MANAGER_IGNORE, passwordManagerHints } from './autofill'

describe('passwordManagerHints', () => {
  it('hides a plain field (no autocomplete) from password managers', () => {
    expect(passwordManagerHints()).toEqual(PASSWORD_MANAGER_IGNORE)
    expect(passwordManagerHints({ type: 'text' })).toEqual(PASSWORD_MANAGER_IGNORE)
    expect(passwordManagerHints({ type: 'number' })).toEqual(PASSWORD_MANAGER_IGNORE)
  })

  it('leaves credential and identity fields to the password manager', () => {
    for (const autocomplete of [
      'username',
      'email',
      'current-password',
      'new-password',
      'one-time-code',
      'name',
      'tel'
    ]) {
      expect(passwordManagerHints({ autocomplete })).toEqual({})
    }
    expect(passwordManagerHints({ type: 'email' })).toEqual({})
  })

  it('hides read-only fields and autocomplete="off" fields', () => {
    expect(passwordManagerHints({ readonly: true, autocomplete: 'username' })).toEqual(
      PASSWORD_MANAGER_IGNORE
    )
    expect(passwordManagerHints({ autocomplete: 'off' })).toEqual(PASSWORD_MANAGER_IGNORE)
    expect(passwordManagerHints({ autocomplete: ' OFF ' })).toEqual(PASSWORD_MANAGER_IGNORE)
  })

  it('covers 1Password, LastPass, Bitwarden and Dashlane', () => {
    expect(Object.keys(PASSWORD_MANAGER_IGNORE).sort()).toEqual([
      'data-1p-ignore',
      'data-bwignore',
      'data-form-type',
      'data-lpignore'
    ])
  })
})
