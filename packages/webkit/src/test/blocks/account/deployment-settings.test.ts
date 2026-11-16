import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import BuildDeployment, {
  type DeploymentSettingsService,
  type DeploymentSettingsSetting
} from '../../../../blocks/account/deployment-settings/deployment-settings.vue'
import Empty from '../../../../blocks/account/deployment-settings/variants/empty.vue'
import Loading from '../../../../blocks/account/deployment-settings/variants/loading.vue'
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
    await fireEvent.click(buttonByText('Discard', view.container as HTMLElement)!)
    await waitFor(() =>
      expect(view.container.textContent).not.toContain('You have unsaved changes.')
    )
  })

  it('emits save with the values and hides the SaveBar once the save ends', async () => {
    const view = render(BuildDeployment, { props: { defaultDraft: { bindingPolicy: 'FLEXIBLE' } } })
    await fireEvent.click(buttonByText('Save', view.container as HTMLElement)!)
    expect(view.emitted('save')?.[0]?.[1]).toEqual({
      bindingPolicy: 'FLEXIBLE',
      deploymentPolicy: 'single_version',
      applyToExisting: false
    })
    expect(view.container.textContent).toContain('You have unsaved changes.')
    await view.rerender({ defaultDraft: { bindingPolicy: 'FLEXIBLE' }, saving: true })
    await view.rerender({ defaultDraft: { bindingPolicy: 'FLEXIBLE' }, saving: false })
    await waitFor(() =>
      expect(view.container.textContent).not.toContain('You have unsaved changes.')
    )
    await waitFor(() => expect(document.body.textContent).toContain('Deployment defaults saved.'))
  })

  it('keeps the edits and toasts the error when the save fails', async () => {
    const view = render(BuildDeployment, {
      props: { defaultDraft: { bindingPolicy: 'FLEXIBLE' }, saving: true }
    })
    await view.rerender({
      defaultDraft: { bindingPolicy: 'FLEXIBLE' },
      saving: false,
      error: 'The API answered 503.'
    })
    await waitFor(() => expect(document.body.textContent).toContain('The API answered 503.'))
    expect(view.container.textContent).toContain('You have unsaved changes.')
  })

  it('renders the settings and services it is given instead of the sample', async () => {
    const settings: DeploymentSettingsSetting[] = [
      {
        id: 'base',
        name: 'Default',
        description: '',
        system: true,
        bindingPolicy: 'STRICT',
        deploymentPolicy: 'single_version',
        status: 'Active',
        updatedAt: new Date(Date.UTC(2026, 10, 1)),
        updatedBy: 'system'
      },
      {
        id: 'store',
        name: 'acme-store',
        description: '',
        system: false,
        bindingPolicy: 'FLEXIBLE',
        deploymentPolicy: 'single_version',
        status: 'Active',
        updatedAt: new Date(Date.UTC(2026, 10, 2)),
        updatedBy: 'jane.doe@example.com'
      }
    ]
    const services: DeploymentSettingsService[] = [
      {
        id: 'svc',
        name: 'acme-shop',
        environments: [
          { name: 'Production', deploymentPolicy: 'single_version', settingId: 'store', auto: true }
        ]
      }
    ]
    const view = render(BuildDeployment, { props: { settings, services } })
    await waitFor(() => expect(view.getByText('acme-store')).toBeTruthy())
    expect(view.queryByText('legacy-rollout')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: /1 service$/ }))
    await waitFor(() => expect(view.getByText('acme-shop')).toBeTruthy())
    await fireEvent.click(view.getByRole('button', { name: 'Actions for acme-store' }))
    await fireEvent.click(await waitFor(() => view.getByRole('menuitem', { name: 'Delete' })))
    await waitFor(() => expect(dialog()).not.toBeNull())
    await fireEvent.click(buttonByText('Delete', dialog()!)!)
    await waitFor(() => expect(view.queryByText('acme-store')).toBeNull())
    expect(view.emitted('delete')?.[0]?.[1]).toMatchObject({ id: 'store' })
  })

  it('shows no sample while loading, and Refresh emits refresh', async () => {
    const loading = render(Loading)
    expect(loading.container.textContent).not.toContain('legacy-rollout')
    loading.unmount()
    const view = render(BuildDeployment)
    await fireEvent.click(view.getByRole('button', { name: 'Refresh' }))
    expect(view.emitted('refresh')).toHaveLength(1)
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
    expect(view.emitted('bind')?.[0]?.[0]).toEqual({
      serviceId: 'svc-status',
      environment: 'Production',
      settingId: 'ds-storefront'
    })
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
    await fireEvent.click(buttonByText('Clear search', view.container as HTMLElement)!)
    await waitFor(() => expect(view.getByRole('list', { name: 'Services' })).toBeTruthy())
    expect(view.queryByRole('navigation', { name: 'Services pages' })).toBeNull()
  })

  it('creates a Deployment Setting from the drawer after the name is filled', async () => {
    const view = render(BuildDeployment)
    await fireEvent.click(buttonByText('Create Deployment Setting', view.container as HTMLElement)!)
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
    await waitFor(() => expect(dialog()).toBeNull())
    expect(view.getByText('edge-canary')).toBeTruthy()
    expect(view.emitted('create')?.[0]?.[1]).toMatchObject({ name: 'edge-canary', system: false })
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
