import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import ManageResources from '../../blocks/platform/account/manage-resources/manage-resources.vue'
import Selected from '../../blocks/platform/account/manage-resources/variants/selected.vue'
import { useToastRegion } from './toast-region'

useToastRegion()

const rowNames = (): string[] =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-tree-row]')).map(
    (row) => row.getAttribute('data-tree-row') ?? ''
  )
const row = (id: string): HTMLElement =>
  document.querySelector<HTMLElement>(`[data-tree-row="${id}"]`) as HTMLElement
const checkboxOf = (id: string): HTMLElement =>
  row(id).querySelector<HTMLElement>('[role="checkbox"], input[type="checkbox"]') as HTMLElement

describe('platform/account/manage-resources', () => {
  it('shows the hierarchy as a treegrid with the first branch open', () => {
    const view = render(ManageResources)
    expect(view.getByRole('treegrid', { name: 'Resources' })).toBeTruthy()
    expect(rowNames()).toEqual([
      'org-1001',
      'grp-2101',
      'ws-30418',
      'ws-30422',
      'ws-30437',
      'grp-2102',
      'org-1002'
    ])
    expect(row('org-1001').getAttribute('aria-expanded')).toBe('true')
    expect(row('grp-2102').getAttribute('aria-expanded')).toBe('false')
    expect(row('ws-30418').getAttribute('aria-level')).toBe('3')
    expect(view.getByRole('button', { name: 'Move' })).toBeDisabled()
    expect(view.getByRole('heading', { name: 'No resource selected' })).toBeTruthy()
  })

  it('opens a branch from the keyboard', async () => {
    render(ManageResources)
    row('grp-2102').focus()
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(rowNames()).toContain('ws-30455'))
    await userEvent.keyboard('{ArrowRight}')
    await waitFor(() => expect(document.activeElement).toBe(row('ws-30455')))
  })

  it('fills the details panel for one selected resource and enables the bulk actions', async () => {
    const view = render(ManageResources)
    await userEvent.click(checkboxOf('ws-30422'))
    await waitFor(() =>
      expect(view.getByRole('heading', { name: '1 resource selected' })).toBeTruthy()
    )
    expect(view.getByRole('button', { name: 'Move' })).toBeEnabled()
    expect(view.getByRole('list', { name: 'Role bindings' }).textContent).toContain('Owner')
    await userEvent.click(checkboxOf('ws-30437'))
    await waitFor(() =>
      expect(view.getByRole('heading', { name: '2 resources selected' })).toBeTruthy()
    )
    expect(view.getByText('Select a single resource to see its role bindings.')).toBeTruthy()
    await userEvent.click(view.getByRole('button', { name: 'Clear selection' }))
    await waitFor(() => expect(view.getByRole('button', { name: 'Move' })).toBeDisabled())
  })

  it('moves the selection under a new parent and never offers a resource as its own parent', async () => {
    const view = render(ManageResources)
    await userEvent.click(checkboxOf('grp-2101'))
    await userEvent.click(view.getByRole('button', { name: 'Move' }))
    const dialog = await view.findByRole('dialog', { name: 'Move Retail and marketplace' })
    const confirm = (): HTMLElement =>
      Array.from(dialog.querySelectorAll<HTMLElement>('button')).find(
        (button) => button.textContent?.trim() === 'Move'
      ) as HTMLElement
    await userEvent.click(confirm())
    expect(dialog.textContent).toContain('Choose where to move the resources.')
    await userEvent.click(dialog.querySelector<HTMLElement>('[role="combobox"]') as HTMLElement)
    const options = await view.findAllByRole('option')
    const labels = options.map((option) => option.textContent?.trim())
    expect(labels).not.toContain('Retail and marketplace · Group')
    await userEvent.click(
      options.find((o) => o.textContent?.includes('Contoso Partners')) as HTMLElement
    )
    await userEvent.click(confirm())
    await waitFor(() => expect(row('grp-2101').getAttribute('aria-level')).toBe('2'))
    expect(rowNames().indexOf('grp-2101')).toBeGreaterThan(rowNames().indexOf('org-1002'))
  })

  it('counts what is inside before deleting a branch', async () => {
    const view = render(ManageResources)
    await userEvent.click(checkboxOf('grp-2101'))
    await userEvent.click(view.getByRole('button', { name: 'Delete' }))
    const dialog = await view.findByRole('dialog', { name: 'Delete Retail and marketplace' })
    expect(dialog.textContent).toContain('This also deletes the 3 resources inside.')
  })

  it('starts the Selected variant with the details panel filled', () => {
    const view = render(Selected)
    expect(view.getByRole('heading', { name: '1 resource selected' })).toBeTruthy()
    expect(row('ws-30418').getAttribute('aria-selected')).toBe('true')
  })
})
