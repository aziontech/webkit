import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { type Component, createApp } from 'vue'

import CreateDeployTemplate from '../../../../blocks/create/create-deploy-template/create-deploy-template.vue'
import BuildSettings from '../../../../blocks/create/create-deploy-template/variants/build-settings.vue'
import DeployTemplateForm from '../../../../blocks/create/create-deploy-template/variants/form.vue'
import ImportFromGit from '../../../../blocks/create/create-deploy-template/variants/import-from-git.vue'
import InstallIntegration from '../../../../blocks/create/create-deploy-template/variants/install-integration.vue'
import DeployTemplateUpload from '../../../../blocks/create/create-deploy-template/variants/upload.vue'
import WhereItRuns from '../../../../blocks/create/create-deploy-template/variants/where-it-runs.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()
describe('create-deploy-template#Upload', () => {
  it('derives the folder summary from the files and scrolls the list from the keyboard', async () => {
    const view = render(DeployTemplateUpload)
    expect(screen.getByText('acme-landing · 7 files · 241.1 kB')).toBeTruthy()
    const region = screen.getByRole('region', { name: 'Files in acme-landing' })
    expect(region.getAttribute('tabindex')).toBe('0')
    const list = within(region).getByRole('list', { name: 'Files in acme-landing' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(7)
    expect(screen.getByText('4.2 kB')).toBeTruthy()
    expect(screen.getByText('68 B')).toBeTruthy()
    await expectNoA11yViolations(view.container as HTMLElement)
  })
})

describe('create-deploy-template#ConnectGit', () => {
  it('shows the connect step as one bordered EmptyState under the preview Card', () => {
    render(CreateDeployTemplate)
    expect(screen.getByText('Connect a Git provider')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Continue with GitHub' })).toBeTruthy()
  })

  it('renders the template it is given and emits the connect actions', async () => {
    const view = render(CreateDeployTemplate, {
      props: {
        template: {
          name: 'Acme Docs',
          description: 'Launch a docs site.',
          icon: 'az az-book',
          provider: 'GitHub',
          providerIcon: 'az az-github',
          scope: 'acme',
          path: 'templates/docs-site'
        }
      }
    })
    expect(screen.getAllByText('Acme Docs').length).toBeGreaterThan(0)
    expect(screen.getByText('templates/docs-site')).toBeTruthy()
    expect(screen.queryByText('Nuxt E-commerce')).toBeNull()
    await fireEvent.click(screen.getByRole('button', { name: 'Continue with GitHub' }))
    await fireEvent.click(screen.getByRole('button', { name: 'Continue without Git' }))
    await fireEvent.click(screen.getByRole('button', { name: 'Browse templates' }))
    await fireEvent.click(screen.getByRole('button', { name: 'Back to Creation Center' }))
    const emitted = view.emitted()
    expect(emitted.connect).toHaveLength(1)
    expect(emitted['skip-git']).toHaveLength(1)
    expect(emitted.browse).toHaveLength(1)
    expect(emitted.back).toHaveLength(1)
  })
})

describe('create-deploy-template#WhereItRuns', () => {
  it('lists six services, narrows them with the search and answers the step with a pick', async () => {
    const view = render(WhereItRuns)
    await expectNoA11yViolations(view.container)
    expect(screen.getByRole('heading', { level: 1, name: 'Where it runs' })).toBeTruthy()
    expect(screen.getByText('6 more. Type to narrow the list.')).toBeTruthy()
    await fireEvent.update(screen.getByRole('textbox', { name: 'Search services' }), 'zzz')
    expect(screen.getByText('No service matches “zzz”.')).toBeTruthy()
    await fireEvent.update(screen.getByRole('textbox', { name: 'Search services' }), 'web-prod')
    await fireEvent.click(screen.getByRole('radio', { name: /web-prod/ }))
    expect(await screen.findByText('Connect a Git provider')).toBeTruthy()
    expect(screen.getByText(/deployed to web-prod on every push/)).toBeTruthy()
  })

  it('focuses the new service name field when Create Service opens it', async () => {
    render(WhereItRuns)
    await fireEvent.click(screen.getByRole('button', { name: 'Create Service' }))
    const name = await screen.findByRole('textbox', { name: 'New service' })
    await waitFor(() => expect(document.activeElement).toBe(name))
  })

  it('focuses the name field, prefilled with the query, when Enter finds no service', async () => {
    render(WhereItRuns)
    const search = screen.getByRole('textbox', { name: 'Search services' })
    await fireEvent.update(search, 'billing-api')
    await fireEvent.keyDown(search, { key: 'Enter' })
    const name = await screen.findByRole<HTMLInputElement>('textbox', { name: 'New service' })
    await waitFor(() => expect(document.activeElement).toBe(name))
    expect(name.value).toBe('billing-api')
  })

  it('continues without a service to the Git step', async () => {
    render(WhereItRuns)
    await fireEvent.click(screen.getByRole('button', { name: 'Continue without a service' }))
    expect(await screen.findByRole('button', { name: 'Continue with GitHub' })).toBeTruthy()
  })
})

describe('create-deploy-template#InstallIntegration', () => {
  it('requires the origin and previews what gets added', async () => {
    const view = render(InstallIntegration)
    await expectNoA11yViolations(view.container)
    await fireEvent.click(screen.getByRole('button', { name: 'Add to service-01' }))
    expect(await screen.findByText('This field is required.')).toBeTruthy()
    await fireEvent.update(
      screen.getByRole('textbox', { name: /Origin address/ }),
      'origin.example.com'
    )
    const added = screen.getByText('Records').parentElement as HTMLElement
    expect(within(added).getByText(/origin\.example\.com/)).toBeTruthy()
    expect(screen.queryByText('This field is required.')).toBeNull()
    const hostHeader = screen.getByRole('textbox', { name: /Host header/ }) as HTMLInputElement
    expect(hostHeader.value).toBe('')
    expect(hostHeader.placeholder).not.toContain('${')
    expect(screen.getByText(/Leave it empty to pass the request host through/)).toBeTruthy()
  })
  it('goes back to the Creation Center on Escape', async () => {
    const view = render(CreateDeployTemplate)
    await userEvent.keyboard('{Escape}')
    const [event] = view.emitted<unknown[]>('back')?.[0] ?? []
    expect(event).toBeInstanceOf(KeyboardEvent)
  })
})

describe('create-deploy-template#Form', () => {
  it('labels the repository name plainly and gives visibility its own labelled switch', async () => {
    render(DeployTemplateForm)
    expect(screen.getByRole('textbox', { name: 'Repository name' })).toBeTruthy()
    const visibility = screen.getByRole('switch', { name: 'Public repository' })
    expect(visibility.getAttribute('aria-checked')).toBe('true')
    await fireEvent.click(visibility)
    expect(await screen.findByText('Only people you give access can see the code.')).toBeTruthy()
    expect(screen.getByRole('textbox', { name: 'Repository name' })).toBeTruthy()
  })

  it('asks before Back discards an edited form, and not while it is untouched', async () => {
    render(DeployTemplateForm)
    const back = screen.getByRole('button', { name: 'Back to Creation Center' })
    await fireEvent.click(back)
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(screen.queryByRole('alertdialog')).toBeNull()
    await fireEvent.update(screen.getByRole('textbox', { name: /repository name/i }), 'acme-store')
    await fireEvent.click(back)
    const confirm = await screen.findByRole('alertdialog')
    await fireEvent.click(within(confirm).getByRole('button', { name: 'Keep editing' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
    expect(
      (screen.getByRole('textbox', { name: /repository name/i }) as HTMLInputElement).value
    ).toBe('acme-store')
  })

  it('runs the Back path on Escape: asks while edited, keeps the input on Keep editing', async () => {
    render(DeployTemplateForm)
    const name = screen.getByRole('textbox', { name: /repository name/i }) as HTMLInputElement
    await fireEvent.update(name, 'acme-store')
    name.focus()
    await userEvent.keyboard('{Escape}')
    const confirm = await screen.findByRole('alertdialog')
    await fireEvent.click(within(confirm).getByRole('button', { name: 'Keep editing' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
    expect(name.value).toBe('acme-store')
  })
})

const apple = /mac/i.test(navigator.platform || navigator.userAgent)

const mountAttached = (component: Component, props: Record<string, unknown> = {}) => {
  const host = document.body.appendChild(document.createElement('div'))
  const app = createApp(component, props)
  app.mount(host)
  return () => {
    app.unmount()
    host.remove()
  }
}

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

describe('create-deploy-template#Form keyboard', () => {
  it('opens with the cursor in Scope and deploys with Cmd or Ctrl Enter', async () => {
    const unmount = mountAttached(DeployTemplateForm)
    await waitFor(() => {
      const active = document.activeElement as HTMLElement | null
      expect(active?.getAttribute('role')).toBe('combobox')
      expect(active?.textContent).toContain('jane-doe')
    })
    unmount()
    render(DeployTemplateForm)
    const deploy = screen.getByRole('button', { name: 'Deploy' })
    expect(deploy.getAttribute('aria-keyshortcuts')).toBe('Meta+Enter Control+Enter')
    expect(screen.queryByText('NUXT_STORE_ACCESS_TOKEN is required.')).toBeNull()
    pressSubmitShortcut(screen.getByRole('textbox', { name: /repository name/i }))
    expect(await screen.findByText('NUXT_STORE_ACCESS_TOKEN is required.')).toBeTruthy()
  })
})

describe('create-deploy-template#Form validation and phone layout', () => {
  it('moves focus to the first missing value when Deploy finds one', async () => {
    render(DeployTemplateForm)
    await userEvent.click(screen.getByRole('button', { name: 'Deploy' }))
    await waitFor(() => {
      const focused = document.activeElement as HTMLElement
      expect(focused.getAttribute('aria-invalid')).toBe('true')
    })
  })

  it('stacks each variable as a key line over a labelled value on a phone', () => {
    const { container } = render(DeployTemplateForm)
    const line = container.querySelector<HTMLElement>('[data-testid$="-key-line"]')
    expect(line?.classList.contains('sm:hidden')).toBe(true)
    expect(line?.textContent).toContain('NUXT_STORE_ACCESS_TOKEN')
    const keyInput = container.querySelector<HTMLInputElement>('input[id$="-key"]')
    expect(keyInput?.closest('.max-sm\\:hidden')).not.toBeNull()
  })
})

describe('create-deploy-template form states', () => {
  it('ImportFromGit: names the repository it imports and asks before Escape discards an edit', async () => {
    render(ImportFromGit)
    expect(screen.getByText('Importing from GitHub')).toBeTruthy()
    expect(screen.getAllByText('Import from Git').length).toBeGreaterThan(0)
    const name = screen.getByRole('textbox', { name: /repository name/i }) as HTMLInputElement
    await fireEvent.update(name, 'acme-store')
    name.focus()
    await userEvent.keyboard('{Escape}')
    const confirm = await screen.findByRole('alertdialog')
    await fireEvent.click(within(confirm).getByRole('button', { name: 'Keep editing' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull())
    expect(name.value).toBe('acme-store')
  })

  it('Upload: shows no Git source line and asks before Back discards an edit', async () => {
    render(DeployTemplateUpload)
    expect(screen.queryByText(/Cloning from/)).toBeNull()
    await fireEvent.update(screen.getByRole('textbox', { name: /Project name/ }), 'acme-docs')
    await fireEvent.click(screen.getByRole('button', { name: 'Back to Creation Center' }))
    expect(await screen.findByRole('alertdialog')).toBeTruthy()
  })

  it('BuildSettings and InstallIntegration run their action with Cmd or Ctrl Enter', async () => {
    const settings = render(BuildSettings)
    const deploy = screen.getByRole('button', { name: 'Deploy' })
    expect(deploy.getAttribute('aria-keyshortcuts')).toBe('Meta+Enter Control+Enter')
    settings.unmount()
    render(InstallIntegration)
    expect(screen.getByText('Adds to')).toBeTruthy()
    const add = screen.getByRole('button', { name: 'Add to service-01' })
    expect(add.getAttribute('aria-keyshortcuts')).toBe('Meta+Enter Control+Enter')
    expect(screen.queryByText('This field is required.')).toBeNull()
    pressSubmitShortcut(screen.getByRole('textbox', { name: /Host header/ }))
    expect(await screen.findByText('This field is required.')).toBeTruthy()
  })
})
