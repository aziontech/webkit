import { fireEvent, render, screen, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import DeployDrawer from '../../../../blocks/create/deploy-drawer/deploy-drawer.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()
describe('deploy-drawer', () => {
  it('opens domains through Link in a new tab and names the version and overflow controls', async () => {
    render(DeployDrawer)
    await fireEvent.click(screen.getByRole('button', { name: 'Deploy' }))
    const dialog = await screen.findByRole('dialog')
    const external = within(dialog)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('target') === '_blank')
    expect(external.length).toBeGreaterThan(0)
    external.forEach((link) => expect(link.getAttribute('rel')).toBe('noopener noreferrer'))
    expect(
      within(dialog).getAllByRole('button', { name: /^Change version of / }).length
    ).toBeGreaterThan(0)
    expect(within(dialog).getAllByRole('button', { name: /more domains$/ }).length).toBeGreaterThan(
      0
    )
    expect(dialog.textContent).not.toMatch(/publish/i)
  })
  it('renders the resources it is given and emits submit with the picked values', async () => {
    const resources = [
      {
        key: 'service',
        label: 'Service',
        name: 'acme-store',
        icon: 'ai ai-server',
        note: '',
        total: 1,
        owner: true,
        dependencies: [],
        versions: [{ id: 'B1', name: 'B1', author: 'Jane Doe', createdAgo: '1 hour ago' }]
      }
    ]
    const view = render(DeployDrawer, { props: { open: true, resources } })
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText('acme-store')).toBeTruthy()
    expect(within(dialog).queryByText('web-app')).toBeNull()
    await fireEvent.click(within(dialog).getByRole('button', { name: 'Deploy' }))
    const [event, values] = view.emitted('submit')?.[0] ?? []
    expect(event).toBeInstanceOf(Event)
    expect(values).toEqual({
      versions: { service: 'B1' },
      projectMode: 'existing',
      projectId: '1020655',
      environment: 'Production'
    })
  })

  it('shows the load error it is given, emits retry and keeps Deploy disabled', async () => {
    const view = render(DeployDrawer, {
      props: { open: true, error: "The deploy targets couldn't be loaded." }
    })
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText("The deploy targets couldn't be loaded.")).toBeTruthy()
    expect(within(dialog).getByRole('button', { name: 'Deploy' }).hasAttribute('disabled')).toBe(
      true
    )
    await fireEvent.click(within(dialog).getByRole('button', { name: 'Retry' }))
    expect(view.emitted('retry')?.[0]?.[0]).toBeInstanceOf(MouseEvent)
  })

  it('shows the build it is given in place of the resources', async () => {
    render(DeployDrawer, {
      props: { open: true, build: { name: 'acme-store', version: 'C7', elapsed: 4 } }
    })
    const dialog = await screen.findByRole('dialog', { name: 'Build and deployment' })
    expect(within(dialog).getByText('C7')).toBeTruthy()
    expect(within(dialog).getByText('Building…')).toBeTruthy()
    expect(within(dialog).getByRole('button', { name: 'Deploy' }).hasAttribute('disabled')).toBe(
      true
    )
  })
})
