import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import AccountTeamPermissions from '../../../../blocks/account/account-team-permissions/account-team-permissions.vue'
import CreateTeam from '../../../../blocks/account/account-team-permissions/variants/create-team.vue'
import EditTeam from '../../../../blocks/account/account-team-permissions/variants/edit-team.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const visibleText = (element: HTMLElement) => {
  const copy = element.cloneNode(true) as HTMLElement
  copy.querySelectorAll('[aria-hidden="true"]').forEach((node) => node.remove())
  return copy.textContent?.trim()
}

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => visibleText(button) === text
  ) as HTMLButtonElement

const memberNames = () =>
  Array.from(document.querySelectorAll('ul[aria-label="Members"] li')).map((item) =>
    item.querySelector('[data-member-name]')?.textContent?.trim()
  )
describe('account-team-permissions', () => {
  it('says the access model the same way as Users: role for the account, teams for resources', () => {
    const view = render(AccountTeamPermissions)
    expect(view.container.textContent).toContain(
      "A person's role decides what they can do on the account; their teams decide which resources they reach."
    )
    expect(view.container.textContent).not.toContain('nothing is granted per person')
  })

  it('shows the view-table controls row over the teams', async () => {
    const view = render(AccountTeamPermissions)
    expect(view.getByRole('button', { name: 'Download CSV' })).not.toBeDisabled()
    expect(view.getByRole('button', { name: 'Refresh' })).toBeTruthy()
    expect(view.getByText('Administrators')).toBeTruthy()
  })

  it('renders the teams it is given instead of the sample, and the empty card for none', async () => {
    const view = render(AccountTeamPermissions, {
      props: {
        teams: [
          {
            id: 't-1',
            name: 'Acme support',
            description: 'Answers tickets',
            permissions: ['logs.view'],
            members: 2,
            status: 'Active'
          }
        ]
      }
    })
    await waitFor(() => expect(view.container.textContent).toContain('Acme support'))
    expect(view.container.textContent).not.toContain('Administrators')
    view.unmount()
    const empty = render(AccountTeamPermissions, { props: { teams: [] } })
    expect(empty.container.textContent).toContain('No teams yet')
  })

  it('emits the row actions and the confirmed delete instead of faking them', async () => {
    const view = render(AccountTeamPermissions)
    await fireEvent.click(view.getByRole('button', { name: /Actions for Developers/ }))
    await fireEvent.click(await waitFor(() => view.getByRole('menuitem', { name: 'Duplicate' })))
    expect(view.emitted<unknown[]>('row-action')![0][1]).toMatchObject({
      value: 'duplicate',
      team: { id: 'team-2' }
    })
    await fireEvent.click(view.getByRole('button', { name: /Actions for Contractors/ }))
    await fireEvent.click(await waitFor(() => view.getByRole('menuitem', { name: 'Delete' })))
    const confirm = await waitFor(() => {
      const node = document.querySelector('[role="alertdialog"], [role="dialog"]') as HTMLElement
      expect(node).not.toBeNull()
      return node
    })
    await fireEvent.click(buttonByText('Delete team', confirm))
    expect(view.emitted<unknown[]>('delete')![0][1]).toMatchObject({ id: 'team-5' })
    await waitFor(() => expect(view.container.textContent).not.toContain('Contractors'))
    await fireEvent.click(view.getByRole('button', { name: 'Refresh' }))
    expect(view.emitted<unknown[]>('refresh')).toHaveLength(1)
  })

  it('shows the error message with Retry in place of the table', async () => {
    const view = render(AccountTeamPermissions, { props: { error: 'The API answered 503.' } })
    expect(view.container.textContent).toContain('The API answered 503.')
    expect(view.queryByRole('button', { name: 'Refresh' })).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted<unknown[]>('retry')).toHaveLength(1)
  })
})

describe('account-team-permissions#CreateTeam', () => {
  it('renders in the creation frame with a way back to the list', async () => {
    const view = render(CreateTeam)
    const back = view.getByRole('link', { name: 'Back to Teams and permissions' })
    expect(back.getAttribute('href')).toBe('/account/teams')
    expect(view.getByRole('main')).toBeTruthy()
    expect(view.getByRole('navigation', { name: /breadcrumb/i }).textContent).toContain(
      'Teams and permissions'
    )
  })

  it('asks before a link leaves Create Team with unsaved changes', async () => {
    const view = render(CreateTeam)
    const back = view.getByRole('link', { name: 'Back to Teams and permissions' })
    await fireEvent.update(view.getByRole('textbox', { name: /Name/ }), 'Platform')
    const click = new MouseEvent('click', { bubbles: true, cancelable: true })
    back.dispatchEvent(click)
    expect(click.defaultPrevented).toBe(true)
    await waitFor(() =>
      expect(document.querySelector('[role="alertdialog"], [role="dialog"]')).not.toBeNull()
    )
    await fireEvent.click(buttonByText('Keep editing'))
    await waitFor(() =>
      expect(document.querySelector('[role="alertdialog"], [role="dialog"]')).toBeNull()
    )
    expect((view.getByRole('textbox', { name: /Name/ }) as HTMLInputElement).value).toBe('Platform')
  })

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

  it('builds the matrix with the Table and shows an EmptyState when the filter matches nothing', async () => {
    const view = render(CreateTeam)
    const table = await view.findByRole('table', { name: 'Permissions granted by this team' })
    expect(table.getAttribute('data-testid')).toBe('table__table')
    expect(view.queryByRole('button', { name: 'Account settings' })).toBeNull()
    await fireEvent.update(view.getByLabelText('Filter permissions'), 'nothing-like-this')
    await waitFor(() => expect(view.getByText('No matching permissions')).toBeTruthy())
    expect(view.queryByRole('table')).toBeNull()
    await fireEvent.click(buttonByText('Clear filter'))
    await waitFor(() =>
      expect(view.getByRole('table', { name: 'Permissions granted by this team' })).toBeTruthy()
    )
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

describe('account/account-team-permissions EditTeam', () => {
  it('starts from the saved team with Save changes disabled', () => {
    const view = render(EditTeam)
    expect(view.getByRole('heading', { name: 'Edit Team' })).toBeTruthy()
    expect((view.getByLabelText(/^Name\b/) as HTMLInputElement).value).toBe('Developers')
    expect(memberNames()).toEqual(['Ava Wilson', 'Brian Hughes', 'Chloe Park'])
    expect(view.getByRole('button', { name: 'Save changes' })).toBeDisabled()
    expect(view.getByRole('checkbox', { name: 'Edit Applications' })).toBeChecked()
  })

  it('asks for a user before Add and adds the one chosen', async () => {
    const view = render(EditTeam)
    await userEvent.click(view.getByRole('button', { name: 'Add' }))
    expect(view.getByText('Choose a user to add.')).toBeTruthy()
    const combo = view.getByRole('combobox', { name: 'Add member' })
    await userEvent.click(combo)
    await userEvent.keyboard('Dylan')
    await userEvent.click(await view.findByRole('option', { name: /Dylan Ross/ }))
    await userEvent.click(view.getByRole('button', { name: 'Add' }))
    expect(memberNames()).toEqual(['Ava Wilson', 'Brian Hughes', 'Chloe Park', 'Dylan Ross'])
    expect(view.getByRole('button', { name: 'Save changes' })).toBeEnabled()
  })

  it('removes a member, moves focus to the next Remove, and Discard restores them', async () => {
    const view = render(EditTeam)
    await userEvent.click(view.getByRole('button', { name: 'Remove Brian Hughes' }))
    expect(memberNames()).toEqual(['Ava Wilson', 'Chloe Park'])
    await waitFor(() =>
      expect(document.activeElement).toBe(view.getByRole('button', { name: 'Remove Chloe Park' }))
    )
    expect(view.getByText('You have unsaved changes.')).toBeTruthy()
    await userEvent.click(view.getByRole('button', { name: 'Discard' }))
    expect(memberNames()).toEqual(['Ava Wilson', 'Brian Hughes', 'Chloe Park'])
    expect(view.getByRole('button', { name: 'Save changes' })).toBeDisabled()
  })

  it('asks before a link leaves Edit Team with unsaved changes, and lets it go when unchanged', async () => {
    const view = render(EditTeam)
    const breadcrumb = view.getByRole('link', { name: 'Teams and permissions' })
    const clean = new MouseEvent('click', { bubbles: true, cancelable: true })
    breadcrumb.dispatchEvent(clean)
    expect(document.querySelector('[role="alertdialog"], [role="dialog"]')).toBeNull()

    await fireEvent.update(view.getByLabelText(/^Name\b/), 'Platform')
    const back = view.getByRole('link', { name: 'Back to Teams and permissions' })
    const click = new MouseEvent('click', { bubbles: true, cancelable: true })
    back.dispatchEvent(click)
    expect(click.defaultPrevented).toBe(true)
    await waitFor(() =>
      expect(document.querySelector('[role="alertdialog"], [role="dialog"]')).not.toBeNull()
    )
    expect(document.body.textContent).toContain('Unsaved changes')
    await fireEvent.click(buttonByText('Keep editing'))
    await waitFor(() =>
      expect(document.querySelector('[role="alertdialog"], [role="dialog"]')).toBeNull()
    )
    expect((view.getByLabelText(/^Name\b/) as HTMLInputElement).value).toBe('Platform')
  })

  it('asks before deleting the team and says how many members lose access', async () => {
    const view = render(EditTeam)
    await userEvent.click(view.getByRole('button', { name: 'Delete team' }))
    const dialog = await view.findByRole('alertdialog', { name: 'Delete team' })
    expect(dialog.textContent).toContain('Its 3 members lose the permissions it grants.')
  })
})

const apple = /mac/i.test(navigator.platform || navigator.userAgent)
const pressShortcut = (key: string, target: Element = document.body) => {
  const event = new KeyboardEvent('keydown', {
    key,
    metaKey: apple,
    ctrlKey: !apple,
    bubbles: true,
    cancelable: true
  })
  target.dispatchEvent(event)
  return event
}

describe('account/account-team-permissions keyboard', () => {
  it('submits Create Team on Command Enter', async () => {
    const view = render(CreateTeam)
    const name = view.getByLabelText(/^Name/) as HTMLInputElement
    const create = buttonByText('Create')
    expect(create.getAttribute('aria-keyshortcuts')).toBe('Meta+Enter Control+Enter')
    await fireEvent.update(name, '')
    expect(pressShortcut('Enter', name).defaultPrevented).toBe(true)
    await waitFor(() => expect(view.getByText('This field is required.')).toBeTruthy())
  })

  it('saves Edit Team on Command S only once it has changes', async () => {
    const view = render(EditTeam)
    const save = view.getByRole('button', { name: 'Save changes' })
    expect(save.getAttribute('aria-keyshortcuts')).toBe('Meta+S Control+S')
    pressShortcut('s')
    expect(save.getAttribute('aria-busy')).not.toBe('true')
    const name = view.getByLabelText(/^Name\b/) as HTMLInputElement
    await fireEvent.update(name, 'Developers and QA')
    name.focus()
    expect(pressShortcut('s', name).defaultPrevented).toBe(true)
    await waitFor(() => expect(save.getAttribute('aria-busy')).toBe('true'))
  })
})
