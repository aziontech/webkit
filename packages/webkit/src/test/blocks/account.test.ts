import { cleanup, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import type { Component } from 'vue'

import AccountMfaSettings from '../../../blocks/account/account-mfa-settings/account-mfa-settings.vue'
import AccountPersonalTokens from '../../../blocks/account/account-personal-tokens/account-personal-tokens.vue'
import AccountTeamPermissions from '../../../blocks/account/account-team-permissions/account-team-permissions.vue'
import AccountUsers from '../../../blocks/account/account-users/account-users.vue'
import { useToastRegion } from '../toast-region'

useToastRegion()

afterEach(() => cleanup())

const NARROW_HIDDEN = '@max-sm/table:hidden'

const cases: [string, Component, string[]][] = [
  ['account-mfa-settings', AccountMfaSettings, ['MFA']],
  ['account-personal-tokens', AccountPersonalTokens, ['Status']],
  ['account-team-permissions', AccountTeamPermissions, ['Status']],
  ['account-users', AccountUsers, ['Role', 'Status']]
]

describe('account blocks on a phone', () => {
  it.each(cases)(
    '%s drops the columns its phone summary repeats from a narrow table',
    async (_, block, repeated) => {
      const view = render(block)
      const headers = await waitFor(() => {
        expect(view.container.querySelector('[data-slot="narrow-summary"]')).toBeTruthy()
        return view.getAllByRole('columnheader')
      })
      const labelOf = (header: HTMLElement) =>
        (header.textContent ?? '').replace(/Sort by.*$/, '').trim()
      const hidden = headers.filter((header) => header.classList.contains(NARROW_HIDDEN))
      expect(hidden.map(labelOf)).toEqual(repeated)
    }
  )
})
