import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import ManageResources from '../../../../blocks/account/account-hierarchy/account-hierarchy.vue'
import Selected from '../../../../blocks/account/account-hierarchy/variants/selected.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const rowNames = (): string[] =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-tree-row]')).map(
    (row) => row.getAttribute('data-tree-row') ?? ''
  )

const row = (id: string): HTMLElement =>
  document.querySelector<HTMLElement>(`[data-tree-row="${id}"]`) as HTMLElement

const checkboxOf = (id: string): HTMLElement =>
  row(id).querySelector<HTMLElement>('[role="checkbox"], input[type="checkbox"]') as HTMLElement
describe('account/account-hierarchy', () => {
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

  it('finds a nested resource by name and keeps its ancestors open', async () => {
    const view = render(ManageResources)
    expect(view.getByRole('link', { name: 'Create Workspace' })).toBeTruthy()
    await userEvent.type(view.getByRole('textbox', { name: 'Search resources' }), 'media')
    await waitFor(() => expect(rowNames()).toEqual(['org-1001', 'grp-2102', 'ws-30455']))
  })

  it('shows an EmptyState with Clear search when no resource matches', async () => {
    const view = render(ManageResources)
    await userEvent.type(view.getByRole('textbox', { name: 'Search resources' }), 'zzz')
    await waitFor(() => expect(view.getByText('No matching resources')).toBeTruthy())
    expect(view.queryByRole('treegrid')).toBeNull()
    await userEvent.click(view.getByRole('button', { name: 'Clear search' }))
    await waitFor(() => expect(view.getByRole('treegrid', { name: 'Resources' })).toBeTruthy())
  })

  it('marks an empty charge as such', () => {
    render(ManageResources)
    const charge = row('grp-2101').querySelector('[data-empty]')
    expect(charge?.textContent).toBe('—')
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
    expect(view.getByLabelText('Role bindings').textContent).toContain('Owner')
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
      options.find((o) => o.textContent?.includes('Acme Partners')) as HTMLElement
    )
    await userEvent.click(confirm())
    await waitFor(() => expect(row('grp-2101').getAttribute('aria-level')).toBe('2'))
    expect(rowNames().indexOf('grp-2101')).toBeGreaterThan(rowNames().indexOf('org-1002'))
    const [event, payload] = view.emitted('move')![0] as [
      Event,
      { resources: { id: string }[]; destination: { id: string } }
    ]
    expect(event).toBeInstanceOf(Event)
    expect(payload.destination.id).toBe('org-1002')
    expect(payload.resources.map((item) => item.id)).toEqual(['grp-2101'])
  })

  it('counts what is inside before deleting a branch', async () => {
    const view = render(ManageResources)
    await userEvent.click(checkboxOf('grp-2101'))
    await userEvent.click(view.getByRole('button', { name: 'Delete' }))
    const dialog = await view.findByRole('alertdialog', { name: 'Delete Retail and marketplace' })
    expect(dialog.textContent).toContain('This also deletes the 3 resources inside.')
    await userEvent.click(
      Array.from(dialog.querySelectorAll<HTMLElement>('button')).find(
        (button) => button.textContent?.trim() === 'Delete'
      ) as HTMLElement
    )
    await waitFor(() => expect(view.emitted('delete')).toHaveLength(1))
    const [, removed] = view.emitted('delete')![0] as [Event, { id: string }[]]
    expect(removed.map((item) => item.id).sort()).toEqual(
      ['grp-2101', 'ws-30418', 'ws-30422', 'ws-30437'].sort()
    )
    await waitFor(() => expect(rowNames()).not.toContain('grp-2101'))
  })

  it('renders the resources it is given instead of the sample, and the empty card for none', async () => {
    const view = render(ManageResources, {
      props: {
        resources: [
          { id: 'org-9', name: 'Acme Labs', type: 'organization', parentId: null },
          {
            id: 'ws-9',
            name: 'acme-store',
            type: 'workspace',
            parentId: 'org-9',
            status: 'Active'
          }
        ]
      }
    })
    expect(rowNames()).toEqual(['org-9'])
    expect(view.container.textContent).toContain('Acme Labs')
    expect(view.container.textContent).not.toContain('Storefront')
    await view.rerender({ resources: [] })
    await waitFor(() => expect(view.getByText('No resources yet')).toBeTruthy())
  })

  it('emits refresh and retry instead of faking a reload', async () => {
    const view = render(ManageResources, { props: { error: 'The API answered 503.' } })
    expect(view.container.textContent).toContain('The API answered 503.')
    expect(view.container.textContent).not.toContain('Storefront')
    await userEvent.click(view.getByRole('button', { name: 'Retry' }))
    await userEvent.click(view.getByRole('button', { name: 'Refresh resources' }))
    expect(view.emitted('retry')).toHaveLength(1)
    expect(view.emitted('refresh')).toHaveLength(1)
  })

  it('starts the Selected variant with the details panel filled', () => {
    const view = render(Selected)
    expect(view.getByRole('heading', { name: '1 resource selected' })).toBeTruthy()
    expect(row('ws-30418').getAttribute('aria-selected')).toBe('true')
  })
})
