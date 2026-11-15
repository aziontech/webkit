import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import BuildDeployment from '../../../../blocks/account/deployment-settings/deployment-settings.vue'
import Empty from '../../../../blocks/account/deployment-settings/variants/empty.vue'
import UnsavedChanges from '../../../../blocks/account/deployment-settings/variants/unsaved-changes.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())

const dialog = () =>
  document.querySelector('[role="dialog"], [role="alertdialog"]') as HTMLElement | null

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement | undefined
describe('account/deployment-settings', () => {
  it('shows the SaveBar after a default changes, and Discard restores it', async () => {
    const view = render(UnsavedChanges)
    expect(view.container.textContent).toContain('You have unsaved changes.')
    await fireEvent.click(buttonByText('Discard', view.container)!)
    await waitFor(() =>
      expect(view.container.textContent).not.toContain('You have unsaved changes.')
    )
  })

  it('saves the defaults and hides the SaveBar', async () => {
    const view = render(UnsavedChanges)
    await fireEvent.click(buttonByText('Save', view.container)!)
    await waitFor(
      () => expect(view.container.textContent).not.toContain('You have unsaved changes.'),
      { timeout: 3000 }
    )
    await waitFor(() => expect(document.body.textContent).toContain('Deployment defaults saved.'))
  })

  it('rebinds an environment to a matching setting and marks it shared', async () => {
    const view = render(BuildDeployment)
    await fireEvent.click(view.getByRole('button', { name: /on a shared setting/ }))
    const trigger = await waitFor(() =>
      view.getByRole('combobox', { name: 'Deployment Setting for status-page Production' })
    )
    await userEvent.click(trigger)
    expect(view.queryByRole('option', { name: 'preview-versioned' })).toBeNull()
    await userEvent.click(await view.findByRole('option', { name: 'storefront-production' }))
    await waitFor(() =>
      expect(document.body.textContent).toContain(
        'status-page · Production now publishes with storefront-production.'
      )
    )
    expect(view.getAllByText('Shared · 3 services').length).toBeGreaterThan(0)
  })

  it('shows an EmptyState with Clear search when no service matches', async () => {
    const view = render(BuildDeployment)
    await fireEvent.click(view.getByRole('button', { name: /on a shared setting/ }))
    const search = await waitFor(() =>
      view.getByRole('textbox', { name: 'Search services or Deployment Settings' })
    )
    await fireEvent.update(search, 'no-such-service')
    await waitFor(() => expect(view.getByText('No matching services')).toBeTruthy())
    expect(view.queryByRole('list', { name: 'Services' })).toBeNull()
    await fireEvent.click(buttonByText('Clear search', view.container)!)
    await waitFor(() => expect(view.getByRole('list', { name: 'Services' })).toBeTruthy())
    expect(view.queryByRole('navigation', { name: 'Services pages' })).toBeNull()
  })

  it('creates a Deployment Setting from the drawer after the name is filled', async () => {
    const view = render(BuildDeployment)
    await fireEvent.click(buttonByText('Create Deployment Setting', view.container)!)
    await waitFor(() => expect(dialog()).not.toBeNull())
    expect(dialog()!.textContent).toContain('Create Deployment Setting')
    const submit = Array.from(dialog()!.querySelectorAll('button[type="submit"]'))[0] as HTMLElement
    await fireEvent.click(submit)
    await waitFor(() => expect(dialog()!.textContent).toContain('This field is required.'))
    await userEvent.type(
      dialog()!.querySelector<HTMLElement>('#deployment-settings-name')!,
      'edge-canary'
    )
    await fireEvent.click(submit)
    await waitFor(() => expect(dialog()).toBeNull(), { timeout: 3000 })
    expect(view.getByText('edge-canary')).toBeTruthy()
  })

  it('offers no row actions on Default and asks before deleting a setting', async () => {
    const view = render(BuildDeployment)
    expect(view.queryByRole('button', { name: 'Actions for Default' })).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Actions for legacy-rollout' }))
    await fireEvent.click(await waitFor(() => view.getByRole('menuitem', { name: 'Delete' })))
    await waitFor(() =>
      expect(dialog()?.textContent).toContain('No environment publishes with it.')
    )
    await fireEvent.click(buttonByText('Delete', dialog()!)!)
    await waitFor(() => expect(view.queryByText('legacy-rollout')).toBeNull())
  })

  it('renders the empty state with no services and no a11y violations', async () => {
    const view = render(Empty)
    expect(view.getByText('No services yet')).toBeTruthy()
    await expectNoA11yViolations(view.container)
  })
})
