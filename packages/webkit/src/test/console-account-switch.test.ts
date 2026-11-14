import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'

import AccountSwitch from '../../blocks/shells/console/variants/account-switch.vue'
import AccountSwitchFailed from '../../blocks/shells/console/variants/account-switch-failed.vue'
import { expectNoA11yViolations } from './axe'
import { useToastRegion } from './toast-region'

useToastRegion()

afterEach(() => cleanup())

const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null

const at = (component: object, width: number) =>
  render(
    defineComponent({
      render: () => h('div', { style: { width: `${width}px` } }, [h(component)])
    })
  )

describe('shells/console#AccountSwitch placement', () => {
  it('puts the switcher in the rail under the wordmark on a wide layout', () => {
    const view = at(AccountSwitch, 1280)
    const rail = view.getByTestId('layout-console-layout__sidebar-header')

    expect(within(rail).getByRole('button', { name: /Account: Storefront EU/ })).toBeTruthy()
    expect(
      within(view.getByTestId('layout-console-layout__header')).queryByRole('button', {
        name: /Switch account/
      })
    ).toBeNull()
  })

  it('moves the switcher to the header start on a compact layout', async () => {
    const view = at(AccountSwitch, 480)
    const header = view.getByTestId('layout-console-layout__header')

    await waitFor(() =>
      expect(within(header).getByRole('button', { name: /Account: Storefront EU/ })).toBeTruthy()
    )
  })
})

describe('shells/console#AccountSwitchFailed', () => {
  it('replaces the account table with a danger alert and loads the list on Try again', async () => {
    at(AccountSwitchFailed, 1280)
    const panel = await waitFor(() => {
      expect(dialog()?.textContent).toContain('Switch account')
      return dialog() as HTMLElement
    })

    expect(panel.textContent).toContain('The account list could not be loaded.')
    expect(within(panel).queryByRole('table')).toBeNull()
    expect(within(panel).getByLabelText('Search accounts')).toBeTruthy()
    await expectNoA11yViolations(panel)

    await fireEvent.click(within(panel).getByRole('button', { name: 'Try again' }))

    await waitFor(() => expect(within(panel).getByRole('table')).toBeTruthy())
    expect(panel.textContent).not.toContain('The account list could not be loaded.')
    expect(panel.textContent).toContain('Acme Inc.')
  })
})
