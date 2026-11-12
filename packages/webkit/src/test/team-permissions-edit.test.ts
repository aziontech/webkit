import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import EditTeam from '../../blocks/platform/account/team-permissions/variants/edit-team.vue'
import { useToastRegion } from './toast-region'

useToastRegion()

const memberNames = () =>
  Array.from(document.querySelectorAll('ul[aria-label="Members"] li')).map((item) =>
    item.querySelector('[data-member-name]')?.textContent?.trim()
  )

describe('platform/account/team-permissions EditTeam', () => {
  it('starts from the saved team with Save changes disabled', () => {
    const view = render(EditTeam)
    expect(view.getByRole('heading', { name: 'Edit Team' })).toBeTruthy()
    expect((view.getByLabelText('Name') as HTMLInputElement).value).toBe('Developers')
    expect(memberNames()).toEqual(['Ana Ribeiro', 'Bruno Costa', 'Carla Mendes'])
    expect(view.getByRole('button', { name: 'Save changes' })).toBeDisabled()
    expect(view.getByRole('checkbox', { name: 'Edit Applications' })).toBeChecked()
  })

  it('asks for a user before Add and adds the one chosen', async () => {
    const view = render(EditTeam)
    await userEvent.click(view.getByRole('button', { name: 'Add' }))
    expect(view.getByText('Choose a user to add.')).toBeTruthy()
    const combo = view.getByRole('combobox', { name: 'Add member' })
    await userEvent.click(combo)
    await userEvent.keyboard('Diego')
    await userEvent.click(await view.findByRole('option', { name: /Diego Alves/ }))
    await userEvent.click(view.getByRole('button', { name: 'Add' }))
    expect(memberNames()).toEqual(['Ana Ribeiro', 'Bruno Costa', 'Carla Mendes', 'Diego Alves'])
    expect(view.getByRole('button', { name: 'Save changes' })).toBeEnabled()
  })

  it('removes a member, moves focus to the next Remove, and Discard restores them', async () => {
    const view = render(EditTeam)
    await userEvent.click(view.getByRole('button', { name: 'Remove Bruno Costa' }))
    expect(memberNames()).toEqual(['Ana Ribeiro', 'Carla Mendes'])
    await waitFor(() =>
      expect(document.activeElement).toBe(view.getByRole('button', { name: 'Remove Carla Mendes' }))
    )
    expect(view.getByText('You have unsaved changes.')).toBeTruthy()
    await userEvent.click(view.getByRole('button', { name: 'Discard' }))
    expect(memberNames()).toEqual(['Ana Ribeiro', 'Bruno Costa', 'Carla Mendes'])
    expect(view.getByRole('button', { name: 'Save changes' })).toBeDisabled()
  })

  it('asks before deleting the team and says how many members lose access', async () => {
    const view = render(EditTeam)
    await userEvent.click(view.getByRole('button', { name: 'Delete team' }))
    const dialog = await view.findByRole('dialog', { name: 'Delete team' })
    expect(dialog.textContent).toContain('Its 3 members lose the permissions it grants.')
  })
})
