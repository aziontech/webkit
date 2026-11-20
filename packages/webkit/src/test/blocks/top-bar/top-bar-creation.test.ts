import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import TopBarCreation from '../../../../blocks/top-bar/top-bar-creation/top-bar-creation.vue'

afterEach(() => cleanup())
describe('top-bar/top-bar-creation', () => {
  it('makes the back control a link to the list it came from', () => {
    const view = render(TopBarCreation)
    const back = view.getByRole('link', { name: 'Back to Resources' })
    expect(back.getAttribute('href')).toBe('/resources')
  })

  it('renders the account and the way out it is given', () => {
    const view = render(TopBarCreation, {
      props: {
        account: { name: 'Jane Doe', email: 'jane.doe@example.com' },
        backHref: '/domains',
        backLabel: 'Back to Domains',
        breadcrumb: [{ label: 'Domains', href: '/domains' }, { label: 'Create Domain' }]
      }
    })
    expect(view.getByRole('link', { name: 'Back to Domains' }).getAttribute('href')).toBe(
      '/domains'
    )
    expect(view.getByText('Create Domain')).toBeTruthy()
    expect(view.container.textContent).not.toContain('Create Resource')
  })

  it('drops the back control and the crumb on a terminal screen', () => {
    const view = render(TopBarCreation, { props: { backHref: '', breadcrumb: [] } })
    expect(view.queryByRole('link', { name: 'Back to Resources' })).toBeNull()
    expect(view.queryByRole('navigation')).toBeNull()
    expect(view.getByRole('link', { name: 'Azion home' })).toBeTruthy()
  })

  it('emits account-select with the chosen menu item', async () => {
    const view = render(TopBarCreation)
    await fireEvent.click(view.getByRole('button', { name: 'Account menu' }))
    const logout = await waitFor(() => {
      const item = Array.from(document.body.querySelectorAll('[role="menuitem"]')).find((el) =>
        el.textContent?.includes('Log out')
      )
      expect(item).toBeTruthy()
      return item as HTMLElement
    })
    await fireEvent.click(logout)
    const selected = view.emitted('account-select') as [Event, unknown][]
    expect(selected?.[0][1]).toBe('logout')
  })
})
