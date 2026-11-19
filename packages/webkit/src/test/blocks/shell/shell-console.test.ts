import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import ConsoleShell from '../../../../blocks/shell/shell-console/shell-console.vue'
import AccountSwitch from '../../../../blocks/shell/shell-console/variants/account-switch.vue'
import AccountSwitchError from '../../../../blocks/shell/shell-console/variants/account-switch-error.vue'
import Notifications from '../../../../blocks/shell/shell-console/variants/notifications.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const dialog = () =>
  document.querySelector('[role="dialog"], [role="alertdialog"]') as HTMLElement | null

const at = (component: object, width: number) =>
  render(
    defineComponent({
      render: () => h('div', { style: { width: `${width}px` } }, [h(component)])
    })
  )

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement
describe('shell/shell-console#AccountSwitch placement', () => {
  it('puts the switcher in the rail under the wordmark on a wide layout', () => {
    const view = at(AccountSwitch, 1280)
    const rail = view.getByTestId('console-layout__sidebar-header')

    expect(within(rail).getByRole('button', { name: /Account: Storefront EU/ })).toBeTruthy()
    expect(
      within(view.getByTestId('console-layout__header')).queryByRole('button', {
        name: /Switch account/
      })
    ).toBeNull()
  })

  it('moves the switcher to the header start on a compact layout', async () => {
    const view = at(AccountSwitch, 480)
    const header = view.getByTestId('console-layout__header')

    await waitFor(() =>
      expect(within(header).getByRole('button', { name: /Account: Storefront EU/ })).toBeTruthy()
    )
  })
})

describe('shell/shell-console#account-switch-error', () => {
  it('replaces the account table with a danger alert and loads the list on Retry', async () => {
    at(AccountSwitchError, 1280)
    const panel = await waitFor(() => {
      expect(dialog()?.textContent).toContain('Switch account')
      return dialog() as HTMLElement
    })

    expect(panel.textContent).toContain('The account list could not be loaded.')
    expect(within(panel).queryByRole('table')).toBeNull()
    expect(within(panel).getByLabelText('Search accounts')).toBeTruthy()
    await expectNoA11yViolations(panel)

    await fireEvent.click(within(panel).getByRole('button', { name: 'Retry' }))

    await waitFor(() => expect(within(panel).getByRole('table')).toBeTruthy())
    expect(panel.textContent).not.toContain('The account list could not be loaded.')
    expect(panel.textContent).toContain('Acme Inc.')
  })
})

describe('shell/shell-console#AccountSwitch', () => {
  it('opens with Ctrl+O, searches the tree and switches', async () => {
    const view = render(AccountSwitch)
    const trigger = view.getByRole('button', { name: /Account: Storefront EU/ })
    expect(trigger).toHaveAttribute('aria-keyshortcuts', 'Control+O Meta+O')
    await fireEvent.keyDown(document, { key: 'o', ctrlKey: true, metaKey: true })
    const panel = await waitFor(() => {
      expect(dialog()?.textContent).toContain('Switch account')
      return dialog() as HTMLElement
    })
    expect(panel.querySelector('[aria-busy="true"]')).not.toBeNull()
    await waitFor(() => expect(panel.textContent).toContain('Acme Inc.'))
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
    const collapse = await waitFor(() => view.getByRole('button', { name: 'Collapse Retail' }))
    expect(collapse).toHaveAttribute('aria-expanded', 'true')
    await fireEvent.click(collapse)
    await waitFor(() => expect(panel.textContent).not.toContain('Storefront US'))
    expect(view.getByRole('button', { name: 'Expand Retail' })).toHaveAttribute(
      'aria-expanded',
      'false'
    )
  })
})

describe('shell/shell-console', () => {
  it('leaves the list controls row to view-table', () => {
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

describe('shell/shell-console sign-out', () => {
  it('emits sign-out with the event when Log out is chosen, and nothing for other items', async () => {
    const host = document.body.appendChild(document.createElement('div'))
    host.style.width = '1280px'
    const view = render(ConsoleShell, { container: host })
    const footer = within(view.getByTestId('console-layout__account'))
    await fireEvent.click(footer.getByRole('button', { name: 'Account menu' }))
    const settings = await waitFor(() =>
      within(document.body).getByRole('menuitem', { name: 'Account settings' })
    )
    await fireEvent.click(settings)
    expect(view.emitted('sign-out')).toBeUndefined()
    await fireEvent.click(footer.getByRole('button', { name: 'Account menu' }))
    const logout = await waitFor(() =>
      within(document.body).getByRole('menuitem', { name: 'Log out' })
    )
    await fireEvent.click(logout)
    const calls = view.emitted('sign-out') as [Event][]
    expect(calls).toHaveLength(1)
    expect(calls[0][0]).toBeInstanceOf(MouseEvent)
  })
})
