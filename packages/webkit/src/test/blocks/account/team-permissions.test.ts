import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import TeamPermissions from '../../../../blocks/account/team-permissions/team-permissions.vue'
import CreateTeam from '../../../../blocks/account/team-permissions/variants/create-team.vue'
import EditTeam from '../../../../blocks/account/team-permissions/variants/edit-team.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement

const memberNames = () =>
  Array.from(document.querySelectorAll('ul[aria-label="Members"] li')).map((item) =>
    item.querySelector('[data-member-name]')?.textContent?.trim()
  )
describe('team-permissions', () => {
  it('shows the table-view controls row over the teams', async () => {
    const view = render(TeamPermissions)
    expect(view.getByRole('button', { name: 'Download CSV' })).not.toBeDisabled()
    expect(view.getByRole('button', { name: 'Refresh' })).toBeTruthy()
    expect(view.getByText('Administrators')).toBeTruthy()
  })

  it('renders the teams it is given instead of the sample, and the empty card for none', async () => {
    const view = render(TeamPermissions, {
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
    const empty = render(TeamPermissions, { props: { teams: [] } })
    expect(empty.container.textContent).toContain('No teams yet')
  })

  it('emits the row actions and the confirmed delete instead of faking them', async () => {
    const view = render(TeamPermissions)
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
    const view = render(TeamPermissions, { props: { error: 'The API answered 503.' } })
    expect(view.container.textContent).toContain('The API answered 503.')
    expect(view.queryByRole('button', { name: 'Refresh' })).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted<unknown[]>('retry')).toHaveLength(1)
  })
})

describe('team-permissions#CreateTeam', () => {
  it('renders in the creation frame with a way back to the list', async () => {
    const view = render(CreateTeam)
    const back = view.getByRole('link', { name: 'Back to Teams and permissions' })
    expect(back.getAttribute('href')).toBe('/account/teams')
    expect(view.getByRole('main')).toBeTruthy()
    expect(view.getByRole('navigation', { name: /breadcrumb/i }).textContent).toContain(
      'Teams and permissions'
    )
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

describe('account/team-permissions EditTeam', () => {
  it('starts from the saved team with Save changes disabled', () => {
    const view = render(EditTeam)
    expect(view.getByRole('heading', { name: 'Edit Team' })).toBeTruthy()
    expect((view.getByLabelText('Name') as HTMLInputElement).value).toBe('Developers')
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

  it('asks before deleting the team and says how many members lose access', async () => {
    const view = render(EditTeam)
    await userEvent.click(view.getByRole('button', { name: 'Delete team' }))
    const dialog = await view.findByRole('alertdialog', { name: 'Delete team' })
    expect(dialog.textContent).toContain('Its 3 members lose the permissions it grants.')
  })
})
