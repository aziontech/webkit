import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import CreateDeployDrawer from '../../../../blocks/create/create-deploy-drawer/create-deploy-drawer.vue'
import Dependencies from '../../../../blocks/create/create-deploy-drawer/variants/dependencies.vue'
import Environment from '../../../../blocks/create/create-deploy-drawer/variants/environment.vue'
import LoadError from '../../../../blocks/create/create-deploy-drawer/variants/load-error.vue'
import Loading from '../../../../blocks/create/create-deploy-drawer/variants/loading.vue'
import NoEnvironment from '../../../../blocks/create/create-deploy-drawer/variants/no-environment.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()
describe('create-deploy-drawer', () => {
  it('opens domains through Link in a new tab and names the version and overflow controls', async () => {
    render(CreateDeployDrawer)
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
    const domains = within(dialog).getAllByTestId('domain-group-item__domain')
    expect(domains.length).toBeGreaterThan(0)
    domains.forEach((domain) => expect(domain.getAttribute('dir')).toBe('ltr'))
  })
  it('renders the resources it is given and emits submit with the picked values', async () => {
    const resources = [
      {
        key: 'service',
        label: 'Service',
        name: 'acme-store',
        icon: 'az az-server',
        note: '',
        total: 1,
        owner: true,
        dependencies: [],
        versions: [{ id: 'B1', name: 'B1', author: 'Jane Doe', createdAt: '2026-11-10T11:00:00Z' }]
      }
    ]
    const view = render(CreateDeployDrawer, { props: { open: true, resources } })
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText('acme-store')).toBeTruthy()
    expect(within(dialog).queryByText('web-app')).toBeNull()
    await fireEvent.click(within(dialog).getByRole('button', { name: 'Deploy' }))
    const [event, values] = view.emitted<unknown[]>('submit')?.[0] ?? []
    expect(event).toBeInstanceOf(Event)
    expect(values).toEqual({
      versions: { service: 'B1' },
      projectMode: 'existing',
      projectId: '1020655',
      environment: 'Production'
    })
  })

  it('shows the load error it is given, emits retry and keeps Deploy disabled', async () => {
    const view = render(CreateDeployDrawer, {
      props: { open: true, error: "The deploy targets couldn't be loaded." }
    })
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText("The deploy targets couldn't be loaded.")).toBeTruthy()
    expect(within(dialog).getByRole('button', { name: 'Deploy' }).hasAttribute('disabled')).toBe(
      true
    )
    await fireEvent.click(within(dialog).getByRole('button', { name: 'Retry' }))
    expect(view.emitted<unknown[]>('retry')?.[0]?.[0]).toBeInstanceOf(MouseEvent)
  })

  it('shows the build it is given in place of the resources', async () => {
    render(CreateDeployDrawer, {
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

const apple = /mac/i.test(navigator.platform || navigator.userAgent)

const pressSubmitShortcut = (target: Element) =>
  target.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Enter',
      metaKey: apple,
      ctrlKey: !apple,
      bubbles: true,
      cancelable: true
    })
  )

describe('create-deploy-drawer keyboard', () => {
  it('moves focus into the drawer and deploys with Cmd or Ctrl Enter', async () => {
    const view = render(CreateDeployDrawer, {
      props: { open: true, 'onUpdate:open': () => undefined }
    })
    const dialog = await screen.findByRole('dialog')
    await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true))
    const deploy = within(dialog).getByRole('button', { name: 'Deploy' })
    expect(deploy.getAttribute('aria-keyshortcuts')).toBe('Meta+Enter Control+Enter')
    pressSubmitShortcut(document.activeElement as HTMLElement)
    await waitFor(() => expect(view.emitted('submit')).toHaveLength(1))
    expect(view.emitted<unknown[]>('submit')?.[0]?.[0]).toBeInstanceOf(Event)
  })

  it('ignores the shortcut while a build runs', async () => {
    const view = render(CreateDeployDrawer, {
      props: { open: true, build: { name: 'acme-store', version: 'C7', elapsed: 4 } }
    })
    const dialog = await screen.findByRole('dialog')
    pressSubmitShortcut(dialog)
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(view.emitted('submit')).toBeUndefined()
  })
})

describe.each([
  ['Loading', Loading],
  ['LoadError', LoadError],
  ['NoEnvironment', NoEnvironment]
])('create-deploy-drawer#%s', (_name, Variant) => {
  it('keeps the disabled Deploy with the Cmd Enter keycap the drawer submits with', async () => {
    render(Variant)
    await fireEvent.click(screen.getByRole('button', { name: 'Deploy' }))
    const dialog = await screen.findByRole('dialog')
    const deploy = within(dialog).getByRole('button', { name: 'Deploy' }) as HTMLButtonElement
    expect(deploy.disabled).toBe(true)
    expect(deploy.getAttribute('aria-keyshortcuts')).toBe('Meta+Enter Control+Enter')
    expect(deploy.querySelector('kbd')).not.toBeNull()
  })
})

describe('create-deploy-drawer#Environment', () => {
  it('locks Strict Staging, warns about the second environment and reloads the projects on a switch', async () => {
    render(Environment)
    await fireEvent.click(screen.getByRole('button', { name: 'Deploy' }))
    const dialog = await screen.findByRole('dialog')
    const panel = within(dialog)
    expect((panel.getByRole('radio', { name: /^Staging/ }) as HTMLInputElement).disabled).toBe(true)
    expect(panel.getByText(/replaces legacy-web with web-app there/)).toBeTruthy()
    expect(panel.getByText(/goes live in 2 environments at once/)).toBeTruthy()
    expect(panel.getByRole('list', { name: 'Projects impacted in Preview (1)' })).toBeTruthy()
    await fireEvent.click(panel.getByRole('radio', { name: /^Preview/ }))
    const deploy = panel.getByRole('button', { name: 'Deploy' }) as HTMLButtonElement
    expect(deploy.disabled).toBe(true)
    expect(dialog.textContent).toContain('Loading the projects this deployment reaches')
    await waitFor(() => expect(deploy.disabled).toBe(false))
    expect(panel.queryByText('Projects impacted')).toBeNull()
  })
})

describe('create-deploy-drawer#Dependencies', () => {
  it('names the dependency with no ready version and keeps Deploy disabled until it is fixed', async () => {
    render(Dependencies)
    await fireEvent.click(screen.getByRole('button', { name: 'Deploy' }))
    const dialog = await screen.findByRole('dialog')
    const panel = within(dialog)
    const deploy = panel.getByRole('button', { name: 'Deploy' }) as HTMLButtonElement
    expect(deploy.disabled).toBe(true)
    const reason = document.getElementById(deploy.getAttribute('aria-describedby') ?? '')
    expect(reason?.textContent).toContain('geo-redirect has no ready version')
    expect(panel.getByText(/auth-gateway is shared, so it deploys at one version/)).toBeTruthy()
    expect(
      panel.getByLabelText(/^Shared, also referenced by checkout-api and account-api/)
    ).toBeTruthy()
    expect(panel.getByText('web-app-config references no other resources.')).toBeTruthy()
  })
})
