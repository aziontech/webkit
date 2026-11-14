import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import CreationHeader from '../../blocks/headers/creation-header/creation-header.vue'
import DocsHeader from '../../blocks/headers/docs-header/docs-header.vue'
import ResourceHeader from '../../blocks/headers/resource-header/resource-header.vue'
import SecondLevel from '../../blocks/headers/resource-header/variants/second-level.vue'
import ConsoleShell from '../../blocks/shells/console/console.vue'
import AccountSwitch from '../../blocks/shells/console/variants/account-switch.vue'
import Notifications from '../../blocks/shells/console/variants/notifications.vue'

afterEach(() => cleanup())

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement | undefined

describe('headers/resource-header', () => {
  it.each([
    ['FirstLevel', ResourceHeader],
    ['SecondLevel', SecondLevel]
  ])('%s: the search trigger opens the Command palette', async (_name, block) => {
    const view = render(block)
    expect(document.querySelector('[role="dialog"]')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: /Search/ }))
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).not.toBeNull())
    expect(document.body.textContent).toContain('Applications')
  })

  it('opens the account menu from the avatar', async () => {
    const view = render(ResourceHeader)
    await fireEvent.click(view.getByRole('button', { name: 'Account menu' }))
    await waitFor(() =>
      expect(document.body.querySelector('[role="menu"]')?.textContent).toContain('Log out')
    )
  })
})

describe('headers/creation-header', () => {
  it('makes the back control a link to the list it came from', () => {
    const view = render(CreationHeader)
    const back = view.getByRole('link', { name: 'Back to Resources' })
    expect(back.getAttribute('href')).toBe('/resources')
  })
})

describe('headers/docs-header', () => {
  it('renders the section links as links with a route', () => {
    const view = render(DocsHeader)
    expect(view.getByRole('link', { name: 'Guides' }).getAttribute('href')).toBe('/docs/guides')
    expect(view.getByRole('link', { name: 'Azion Docs home' }).getAttribute('href')).toBe('/docs')
  })
})

describe('shells/console', () => {
  it('leaves the list controls row to table-view', () => {
    const view = render(ConsoleShell)
    expect(view.queryByRole('button', { name: 'Download CSV' })).toBeNull()
    expect(buttonByText('Filter', view.container as HTMLElement)).toBeUndefined()
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
