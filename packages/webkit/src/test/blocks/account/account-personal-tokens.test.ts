import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import Tokens from '../../../../blocks/account/account-personal-tokens/account-personal-tokens.vue'
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
  it('lists the description in its own column under the view-table controls row', async () => {
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
    await waitFor(() => expect(view.emitted<unknown[]>('create')).toHaveLength(1))
    const created = view.emitted<unknown[]>('create')![0][1] as {
      expiresAt: Date
      expiresInDays: number
    }
    expect(created).toMatchObject({ name: 'Release bot', description: '', expiresInDays: 30 })
    expect(created.expiresAt).toBeInstanceOf(Date)
    await view.rerender({ creating: true })
    await waitFor(() => expect(name).toBeDisabled())
    await view.rerender({
      creating: false,
      secret: {
        name: 'Release bot',
        secret: 'pat_0123456789abcdef0123456789abcdef0123456789abcdef'
      }
    })
    const reveal = await waitFor(() => {
      const node = Array.from(
        document.querySelectorAll('[role="dialog"], [role="alertdialog"]')
      ).find((item) => item.textContent?.includes('Copy your new token')) as HTMLElement
      expect(node).toBeTruthy()
      return node
    })
    expect(reveal.textContent).toContain('“Release bot” is ready.')
    const secret = reveal.querySelector('#token-secret') as HTMLInputElement
    expect(secret.value).toMatch(/^pat_[0-9a-f]{48}$/)
    expect(secret).toHaveAttribute('type', 'password')
    expect(secret).toHaveAttribute('readonly')
    const statuses = reveal.querySelectorAll('[role="status"]')
    expect(statuses).toHaveLength(1)
    expect(statuses[0]).toHaveAttribute('data-testid', 'copy-button__status')
    await expectNoA11yViolations(reveal)
    expect(within(reveal).queryByRole('button', { name: /Close/ })).toBeNull()
    await waitFor(() => expect(document.activeElement).toBe(secret))
    await userEvent.keyboard('{Escape}')
    expect(reveal.isConnected).toBe(true)
    expect(view.emitted<unknown[]>('update:secret')).toBeUndefined()
    await fireEvent.click(buttonByText('I copied the token', reveal))
    expect(view.emitted<unknown[]>('update:secret')).toEqual([[null]])
  })

  it('asks for a date and time in a DatePicker when the expiry is custom', async () => {
    const view = render(Tokens)
    await fireEvent.click(buttonByText('Create Personal Token'))
    const drawer = await waitFor(() => {
      expect(dialog()).not.toBeNull()
      return dialog() as HTMLElement
    })
    await userEvent.type(within(drawer).getByLabelText(/^Name/), 'Release bot')
    await fireEvent.click(document.getElementById('token-expiry')!)
    const option = await waitFor(() =>
      [...document.querySelectorAll<HTMLElement>('[role="option"]')].find((item) =>
        item.textContent?.includes('Custom date and time')
      )
    )
    await fireEvent.click(option!)
    const picker = await waitFor(() => {
      const trigger = drawer.querySelector<HTMLElement>('[data-testid="date-picker__trigger"]')
      expect(trigger).not.toBeNull()
      return trigger as HTMLElement
    })
    expect(within(drawer).getByLabelText(/^Expires at/)).toBe(picker)
    await fireEvent.click(buttonByText('Create Personal Token', drawer))
    await waitFor(() =>
      expect(drawer.textContent).toContain('Pick the date and time the token expires.')
    )
    expect(view.emitted('create')).toBeUndefined()
    expect(document.activeElement).toBe(picker)
  })

  it('renders the tokens it is given instead of the sample, and the empty card for none', async () => {
    const view = render(Tokens, {
      props: {
        now: new Date(Date.UTC(2026, 10, 10, 12)),
        tokens: [
          {
            id: 'tok-1',
            name: 'Acme deploy',
            description: 'Release job',
            createdAt: new Date(Date.UTC(2026, 9, 1)),
            createdBy: 'jane.doe@example.com',
            expiresAt: new Date(Date.UTC(2026, 10, 12, 12)),
            lastUsedAt: null,
            revoked: false
          }
        ]
      }
    })
    await waitFor(() => expect(view.container.textContent).toContain('Acme deploy'))
    expect(view.container.textContent).not.toContain('Local CLI')
    expect(view.container.textContent).toContain('Expires in 2 days')
    view.unmount()
    const empty = render(Tokens, { props: { tokens: [] } })
    expect(empty.container.textContent).toContain('No personal tokens yet')
  })

  it('shows the error message with Retry and emits retry and refresh', async () => {
    const failed = render(Tokens, { props: { error: 'The API answered 503.' } })
    expect(failed.container.textContent).toContain('The API answered 503.')
    expect(failed.container.textContent).not.toContain('Local CLI')
    await fireEvent.click(failed.getByRole('button', { name: 'Retry' }))
    expect(failed.emitted<unknown[]>('retry')).toHaveLength(1)
    failed.unmount()
    const view = render(Tokens)
    await fireEvent.click(view.getByRole('button', { name: 'Refresh' }))
    expect(view.emitted<unknown[]>('refresh')).toHaveLength(1)
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
    const shown = () =>
      view.getAllByText('Revoked').filter((node) => !node.closest('[data-slot="narrow-summary"]'))
    await waitFor(() => expect(shown().length).toBe(2))
    expect(view.emitted<unknown[]>('revoke')![0][1]).toMatchObject({
      id: 'tok-7c1e',
      name: 'Local CLI'
    })
  })

  describe('keyboard', () => {
    const bodyRows = () =>
      Array.from(document.body.querySelectorAll<HTMLElement>('[data-focus-row]'))
    const rowOf = (name: string) => bodyRows().find((row) => row.textContent?.includes(name))!
    const key = (target: Element, init: ConstructorParameters<typeof KeyboardEvent>[1]) =>
      target.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
      )

    it('asks to revoke an active token on Delete', async () => {
      render(Tokens)
      await waitFor(() => expect(bodyRows().length).toBe(4))
      const row = rowOf('Local CLI')
      row.focus()
      key(row, { key: 'Delete' })
      await waitFor(() => expect(dialog()?.textContent).toContain('Revoke token'))
    })

    it('deletes a revoked token after the confirm and focuses the next row', async () => {
      const view = render(Tokens)
      await waitFor(() => expect(bodyRows().length).toBe(4))
      const list = bodyRows()
      const row = rowOf('Nightly export')
      const index = list.indexOf(row)
      const expected = (list[index + 1] ?? list[index - 1])!.textContent!.slice(0, 20)
      row.focus()
      key(row, { key: 'Delete' })
      await waitFor(() => expect(dialog()?.textContent).toContain('Delete token'))
      await fireEvent.click(buttonByText('Delete token', dialog()!))
      await waitFor(() => expect(dialog()).toBeNull())
      await waitFor(() => {
        expect(document.activeElement?.hasAttribute('data-focus-row')).toBe(true)
        expect(document.activeElement?.textContent).toContain(expected)
      })
      expect(bodyRows()).toHaveLength(3)
      expect(view.emitted<unknown[]>('delete')).toHaveLength(1)
    })
  })
})
