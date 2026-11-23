import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import AccountUsers from '../../../../blocks/account/account-users/account-users.vue'
import EditRole from '../../../../blocks/account/account-users/variants/edit-role.vue'
import Invite from '../../../../blocks/account/account-users/variants/invite.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const dialog = () =>
  document.querySelector('[role="dialog"], [role="alertdialog"]') as HTMLElement | null

const button = (root: HTMLElement, label: string) =>
  Array.from(root.querySelectorAll('button')).find(
    (item) => item.textContent?.trim() === label
  ) as HTMLButtonElement
describe('account/account-users', () => {
  it('validates the invitation after Send, then adds the person as Invited', async () => {
    const view = render(Invite)
    await waitFor(() => expect(dialog()).not.toBeNull())
    await fireEvent.click(button(dialog()!, 'Send invitation'))
    await waitFor(() =>
      expect(dialog()!.textContent).toContain('Enter the email address to invite.')
    )
    const email = dialog()!.querySelector<HTMLInputElement>('#invite-email')!
    await fireEvent.update(email, 'priya.nair@example.com')
    await waitFor(() =>
      expect(dialog()!.textContent).toContain('This person is already in the account.')
    )
    await fireEvent.update(email, 'new.person@example.com')
    await fireEvent.click(button(dialog()!, 'Send invitation'))
    await waitFor(() => expect(dialog()).toBeNull(), { timeout: 3000 })
    expect(view.container.textContent).toContain('new.person@example.com')
    expect(view.getByRole('button', { name: 'Actions for new.person@example.com' })).toBeTruthy()
  })

  it('commits a Teams change once, when the picker closes, with one toast', async () => {
    const view = render(AccountUsers)
    const trigger = view.getByRole('combobox', { name: 'Teams of Priya Nair' })
    await fireEvent.click(trigger)
    const option = (name: string) =>
      Array.from(document.querySelectorAll<HTMLElement>('[role="option"]')).find((item) =>
        item.textContent?.includes(name)
      )!
    await waitFor(() => expect(option('Security')).toBeTruthy())
    await fireEvent.click(option('Security'))
    await fireEvent.click(option('Finance'))
    await fireEvent.click(option('Support'))
    expect(view.emitted('teams-change')).toBeUndefined()
    await fireEvent.keyDown(trigger, { key: 'Escape' })
    await waitFor(() => expect(view.emitted('teams-change')).toHaveLength(1))
    const [[payload]] = view.emitted('teams-change') as [[{ teams: string[] }]]
    expect(payload.teams).toEqual(['developers', 'security', 'finance', 'support'])
    await waitFor(() =>
      expect(document.body.textContent?.match(/Teams updated for Priya Nair/g)).toHaveLength(1)
    )
  })

  it('asks for the role in the invite form and shows its hint', async () => {
    render(Invite)
    await waitFor(() => expect(dialog()).not.toBeNull())
    const role = dialog()!.querySelector<HTMLElement>('#invite-role')!
    expect(role.textContent).toContain('Developer')
    expect(dialog()!.textContent).toContain('Works on the resources their teams reach')
  })

  it('changes a role in the Edit role dialog and shows it in the Role column', async () => {
    const view = render(EditRole)
    await waitFor(() => expect(dialog()?.textContent).toContain('Edit role'))
    expect(dialog()!.textContent).toContain('Manages people, teams, billing')
    await userEvent.click(dialog()!.querySelector<HTMLElement>('#user-role')!)
    await userEvent.click(await view.findByRole('option', { name: 'Viewer' }))
    await waitFor(() => expect(dialog()!.textContent).toContain('changes nothing'))
    await fireEvent.click(button(dialog()!, 'Save role'))
    await waitFor(() => expect(dialog()).toBeNull())
    const row = view.getByText('Jordan Reyes').closest('[role="row"], tr') as HTMLElement
    expect(row.textContent).toContain('Viewer')
    expect(row.textContent).not.toMatch(/\bAdmin\b/)
  })

  it('opens the profile from the row menu and offers Edit role for everyone but the owner', async () => {
    const view = render(AccountUsers)
    expect(view.getByRole('columnheader', { name: /Email/ })).toBeTruthy()
    expect(view.getByRole('columnheader', { name: /Role/ })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Download CSV' })).toBeTruthy()
    await fireEvent.click(view.getByRole('button', { name: 'Actions for Avery Stone' }))
    await waitFor(() => view.getByRole('menuitem', { name: 'View profile' }))
    expect(view.queryByRole('menuitem', { name: 'Edit role' })).toBeNull()
    await fireEvent.click(view.getByRole('menuitem', { name: 'View profile' }))
    await waitFor(() => expect(dialog()?.textContent).toContain('avery.stone@example.com'))
    expect(button(dialog()!, 'Edit role')).toBeUndefined()
  })

  it('renders the users it is given and emits invite with the values instead of faking a send', async () => {
    const view = render(AccountUsers, {
      props: {
        defaultInviteOpen: true,
        teams: [{ value: 'ops', label: 'Operations' }],
        users: [
          {
            id: 'u-9',
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            owner: true,
            role: 'Owner',
            teams: ['ops'],
            status: 'Active',
            lastActive: null
          }
        ]
      }
    })
    expect(view.container.textContent).toContain('Jane Doe')
    expect(view.container.textContent).not.toContain('Avery Stone')
    expect(view.container.textContent).toContain('You are the only user')
    await waitFor(() => expect(dialog()).not.toBeNull())
    await fireEvent.update(
      dialog()!.querySelector<HTMLInputElement>('#invite-email')!,
      'John.Smith@example.com'
    )
    await fireEvent.click(button(dialog()!, 'Send invitation'))
    await waitFor(() => expect(view.emitted('invite')).toHaveLength(1))
    const [event, values] = view.emitted('invite')![0] as [Event, unknown]
    expect(event).toBeInstanceOf(Event)
    expect(values).toEqual({
      email: 'john.smith@example.com',
      role: 'Developer',
      teams: ['developers']
    })
  })

  it('emits refresh and retry, and shows the error message in place of the table', async () => {
    const view = render(AccountUsers, { props: { error: 'The API answered 503.' } })
    expect(view.container.textContent).toContain('The API answered 503.')
    expect(view.queryByRole('table')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted('retry')).toHaveLength(1)
    view.unmount()
    const list = render(AccountUsers)
    await fireEvent.click(list.getByRole('button', { name: 'Refresh' }))
    expect(list.emitted('refresh')).toHaveLength(1)
  })
})
