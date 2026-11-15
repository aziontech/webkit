import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import Tokens from '../../../../blocks/account/personal-tokens/personal-tokens.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const dialog = () =>
  document.querySelector('[role="dialog"], [role="alertdialog"]') as HTMLElement | null

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement
describe('account/tokens', () => {
  it('lists the description in its own column under the table-view controls row', async () => {
    const view = render(Tokens)
    expect(view.getByRole('columnheader', { name: /Description/ })).toBeTruthy()
    expect(view.getByText('Development laptop')).toBeTruthy()
    expect(view.getByRole('button', { name: 'Refresh' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Download CSV' })).not.toBeDisabled()
  })

  it('creates a token, shows it once, and clears it on close', async () => {
    const view = render(Tokens)
    await fireEvent.click(buttonByText('Create Personal Token'))
    const drawer = await waitFor(() => {
      expect(dialog()).not.toBeNull()
      return dialog() as HTMLElement
    })
    expect(within(drawer).getByRole('heading', { name: 'Create Personal Token' })).toBeTruthy()
    await fireEvent.click(buttonByText('Create Personal Token', drawer))
    await waitFor(() => expect(drawer.textContent).toContain('This field is required.'))
    await userEvent.type(within(drawer).getByLabelText(/^Name/), 'Local CLI')
    await fireEvent.click(buttonByText('Create Personal Token', drawer))
    await waitFor(() =>
      expect(drawer.textContent).toContain('A token with this name already exists.')
    )
    const name = within(drawer).getByLabelText(/^Name/) as HTMLInputElement
    await userEvent.clear(name)
    await userEvent.type(name, 'Release bot')
    await fireEvent.click(buttonByText('Create Personal Token', drawer))
    const reveal = await waitFor(
      () => {
        const node = Array.from(
          document.querySelectorAll('[role="dialog"], [role="alertdialog"]')
        ).find((item) => item.textContent?.includes('Copy your new token')) as HTMLElement
        expect(node).toBeTruthy()
        return node
      },
      { timeout: 2000 }
    )
    const secret = reveal.querySelector('#token-secret') as HTMLInputElement
    expect(secret.value).toMatch(/^pat_[0-9a-f]{48}$/)
    expect(secret).toHaveAttribute('type', 'password')
    expect(secret).toHaveAttribute('readonly')
    const statuses = reveal.querySelectorAll('[role="status"]')
    expect(statuses).toHaveLength(1)
    expect(statuses[0]).toHaveAttribute('data-testid', 'copy-button__status')
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
