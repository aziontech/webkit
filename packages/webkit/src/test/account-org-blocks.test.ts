import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import Checkout from '../../blocks/platform/account/change-plan-drawer/variants/checkout.vue'
import CreateTeam from '../../blocks/platform/account/team-permissions/variants/create-team.vue'
import Tokens from '../../blocks/platform/account/tokens/tokens.vue'
import MfaCode from '../../blocks/platform/auth/variants/mfa-code.vue'
import MfaSetup from '../../blocks/platform/auth/variants/mfa-setup.vue'
import AccountSwitch from '../../blocks/shells/console/variants/account-switch.vue'
import { expectNoA11yViolations } from './axe'
import { useToastRegion } from './toast-region'

useToastRegion()

afterEach(() => cleanup())

const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement

const typeCode = async (input: HTMLElement, code: string) => {
  await userEvent.click(input)
  await userEvent.keyboard(code)
}

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

describe('account/tokens', () => {
  it('creates a token, shows it once, and clears it on close', async () => {
    const view = render(Tokens)
    await fireEvent.click(buttonByText('Create Personal Token'))
    const drawer = await waitFor(() => {
      expect(dialog()).not.toBeNull()
      return dialog() as HTMLElement
    })
    await fireEvent.click(buttonByText('Create', drawer))
    await waitFor(() => expect(drawer.textContent).toContain('This field is required.'))
    await userEvent.type(view.getByLabelText(/^Name/), 'Local CLI')
    await fireEvent.click(buttonByText('Create', drawer))
    await waitFor(() =>
      expect(drawer.textContent).toContain('A token with this name already exists.')
    )
    const name = view.getByLabelText(/^Name/) as HTMLInputElement
    await userEvent.clear(name)
    await userEvent.type(name, 'Release bot')
    await fireEvent.click(buttonByText('Create', drawer))
    const reveal = await waitFor(
      () => {
        const node = Array.from(document.querySelectorAll('[role="dialog"]')).find((item) =>
          item.textContent?.includes('Copy your new token')
        ) as HTMLElement
        expect(node).toBeTruthy()
        return node
      },
      { timeout: 2000 }
    )
    const secret = reveal.querySelector('#token-secret') as HTMLInputElement
    expect(secret.value).toMatch(/^pat_[0-9a-f]{48}$/)
    expect(secret).toHaveAttribute('type', 'password')
    expect(secret).toHaveAttribute('readonly')
    await expectNoA11yViolations(reveal)
    await fireEvent.click(buttonByText('I copied the token', reveal))
    await waitFor(() => expect(document.body.textContent).not.toContain('Copy your new token'))
    expect(view.getByText('Release bot')).toBeTruthy()
  })

  it('revokes a token only after confirmation', async () => {
    const view = render(Tokens)
    await fireEvent.click(view.getByRole('button', { name: /Actions for Local CLI/ }))
    const option = await waitFor(() => view.getByRole('menuitem', { name: 'Revoke' }))
    await fireEvent.click(option)
    const confirm = await waitFor(() => {
      expect(dialog()?.textContent).toContain('Revoke token')
      return dialog() as HTMLElement
    })
    expect(confirm.textContent).toContain('stop working right away')
    await fireEvent.click(buttonByText('Revoke token', confirm))
    await waitFor(() => expect(view.getAllByText('Revoked').length).toBe(2), { timeout: 2000 })
  })
})

describe('team-permissions#CreateTeam', () => {
  it('makes Edit imply View and marks a partly checked group as mixed', async () => {
    const view = render(CreateTeam)
    const editFirewall = view.getByRole('checkbox', { name: 'Edit Firewall' })
    const viewFirewall = view.getByRole('checkbox', { name: 'View Firewall' })
    await fireEvent.click(editFirewall)
    await waitFor(() => expect(viewFirewall).toBeChecked())
    await fireEvent.click(viewFirewall)
    await waitFor(() => expect(editFirewall).not.toBeChecked())
    await fireEvent.click(viewFirewall)
    const group = view.getByRole('checkbox', { name: 'Security' })
    await waitFor(() => expect(group).toBePartiallyChecked())
    expect(view.getByRole('table', { name: 'Permissions granted by this team' })).toBeTruthy()
  })

  it('requires a name and at least one permission', async () => {
    const view = render(CreateTeam)
    await fireEvent.click(buttonByText('Clear'))
    await fireEvent.click(buttonByText('Create'))
    expect(view.getByText('This field is required.')).toBeTruthy()
    await waitFor(() => expect(document.activeElement).toBe(view.getByLabelText(/^Name/)))
    await userEvent.type(view.getByLabelText(/^Name/), 'Support')
    await fireEvent.click(buttonByText('Create'))
    expect(view.getByText('Select at least one permission.')).toBeTruthy()
    await expectNoA11yViolations(view.container)
  })
})

describe('shells/console#AccountSwitch', () => {
  it('opens with Ctrl+O, searches the tree and switches', async () => {
    const view = render(AccountSwitch)
    const trigger = view.getByRole('button', { name: /Account: Storefront EU/ })
    expect(trigger).toHaveAttribute('aria-keyshortcuts', 'Control+O Meta+O')
    await fireEvent.keyDown(document, { key: 'o', ctrlKey: true, metaKey: true })
    const panel = await waitFor(() => {
      expect(dialog()?.textContent).toContain('Switch account')
      return dialog() as HTMLElement
    })
    expect(panel.textContent).toContain('Acme Inc.')
    expect(buttonByText('Storefront EU', panel)).toHaveAttribute('aria-current', 'true')
    await expectNoA11yViolations(panel)
    await fireEvent.update(view.getByLabelText('Search accounts'), 'research')
    await waitFor(() => expect(panel.textContent).not.toContain('Storefront US'))
    expect(panel.textContent).toContain('Acme Labs')
    await fireEvent.click(buttonByText('Research', panel))
    await waitFor(() =>
      expect(view.getByRole('button', { name: /Account: Research/ })).toBeTruthy()
    )
  })

  it('collapses a branch of the tree', async () => {
    const view = render(AccountSwitch)
    await fireEvent.click(view.getByRole('button', { name: /Account: Storefront EU/ }))
    const panel = await waitFor(() => dialog() as HTMLElement)
    const collapse = view.getByRole('button', { name: 'Collapse Retail' })
    expect(collapse).toHaveAttribute('aria-expanded', 'true')
    await fireEvent.click(collapse)
    await waitFor(() => expect(panel.textContent).not.toContain('Storefront US'))
    expect(view.getByRole('button', { name: 'Expand Retail' })).toHaveAttribute(
      'aria-expanded',
      'false'
    )
  })
})

describe('change-plan-drawer#Checkout', () => {
  it('requires the terms before Upgrade and focuses the checkbox', async () => {
    const view = render(Checkout)
    const panel = await waitFor(() => {
      expect(dialog()?.textContent).toContain('Upgrade to Pro')
      return dialog() as HTMLElement
    })
    expect(panel.textContent).toContain('Due today')
    await fireEvent.click(buttonByText('Upgrade', panel))
    await waitFor(() =>
      expect(panel.textContent).toContain(
        'Accept the Terms of Service and the Privacy Policy to upgrade.'
      )
    )
    const terms = view.getByLabelText(/I accept the/)
    await waitFor(() => expect(document.activeElement).toBe(terms))
    await fireEvent.click(terms)
    expect(panel.textContent).not.toContain('Accept the Terms of Service and the Privacy Policy')
    await expectNoA11yViolations(panel)
  })
})
