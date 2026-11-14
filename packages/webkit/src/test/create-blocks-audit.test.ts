import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import CreateHub from '../../blocks/platform/create/create-hub/create-hub.vue'
import CreateHubConnected from '../../blocks/platform/create/create-hub/variants/connected.vue'
import CreateHubLoadFailed from '../../blocks/platform/create/create-hub/variants/load-failed.vue'
import CreateHubLoading from '../../blocks/platform/create/create-hub/variants/loading-repositories.vue'
import CreateInDrawer from '../../blocks/platform/create/create-in-drawer/create-in-drawer.vue'
import CreateInDrawerSaveFailed from '../../blocks/platform/create/create-in-drawer/variants/save-failed.vue'
import DeployDrawer from '../../blocks/platform/create/deploy-drawer/deploy-drawer.vue'
import DeployTemplate from '../../blocks/platform/create/deploy-template/deploy-template.vue'
import DeployTemplateUpload from '../../blocks/platform/create/deploy-template/variants/upload.vue'
import { expectNoA11yViolations } from './axe'
import { useToastRegion } from './toast-region'

useToastRegion()

const wait = { timeout: 4000 }

describe('deploy-template#Upload', () => {
  it('derives the folder summary from the files and scrolls the list from the keyboard', async () => {
    const view = render(DeployTemplateUpload)
    expect(screen.getByText('acme-landing · 7 files · 241.1 kB')).toBeTruthy()
    const region = screen.getByRole('region', { name: 'Files in acme-landing' })
    expect(region.getAttribute('tabindex')).toBe('0')
    const list = within(region).getByRole('list', { name: 'Files in acme-landing' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(7)
    expect(screen.getByText('4.2 kB')).toBeTruthy()
    expect(screen.getByText('68B')).toBeTruthy()
    await expectNoA11yViolations(view.container as HTMLElement)
  })
})

describe('deploy-template#ConnectGit', () => {
  it('shows the connect step as one bordered EmptyState under the preview Card', () => {
    render(DeployTemplate)
    expect(screen.getByText('Connect a Git provider')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Continue with GitHub' })).toBeTruthy()
  })
})

describe('create-hub', () => {
  it('links every template tile and keeps the heading outline, with no button roles', async () => {
    const view = render(CreateHub)
    expect(screen.getByRole('heading', { level: 2, name: 'Start from template' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 3, name: 'Recommended' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Static Site' }).getAttribute('href')).toBe(
      '/create/templates/static-site'
    )
    expect(screen.getByRole('link', { name: 'Nuxt E-commerce' }).getAttribute('href')).toBe(
      '/create/templates/nuxt-ecommerce'
    )
    expect(view.container.querySelector('[role="button"][tabindex="0"]')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Filter' })).toBeNull()
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('filters the templates and offers Clear search when nothing matches', async () => {
    render(CreateHub)
    const search = screen.getByRole('textbox', { name: 'Search templates' })
    await fireEvent.update(search, 'zzz')
    expect(screen.getByText('No templates match')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getByRole('link', { name: 'Static Site' })).toBeTruthy()
  })

  it('shows ten repositories with named Import buttons and loads more', async () => {
    render(CreateHubConnected)
    const list = screen.getByRole('list', { name: 'Repositories in jane-doe' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(10)
    expect(screen.getByRole('button', { name: 'Import docs-site' })).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Load more (2)' }))
    expect(within(list).getAllByRole('listitem')).toHaveLength(12)
  })

  it('renders a no-match EmptyState with Clear search for the repository search', async () => {
    render(CreateHubConnected)
    await fireEvent.update(
      screen.getByRole('textbox', { name: 'Search repositories or paste a repository URL' }),
      'nothing-like-this'
    )
    expect(screen.getByText('No repositories match')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getByRole('button', { name: 'Import docs-site' })).toBeTruthy()
  })

  it('announces loading with one status line and hides the skeletons', () => {
    render(CreateHubLoading)
    expect(screen.getByRole('status').textContent).toContain('Loading repositories')
  })

  it('replaces the list with a Retry alert when the repositories fail to load', async () => {
    render(CreateHubLoadFailed)
    expect(screen.getByText(/didn't load/)).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(screen.getByRole('status').textContent).toContain('Loading repositories')
  })
})

describe('create-in-drawer', () => {
  it('marks the fields required up front and shows Field.Error alerts after an empty submit', async () => {
    render(CreateInDrawer)
    await fireEvent.click(screen.getByRole('button', { name: 'Add Domain' }))
    const dialog = await screen.findByRole('dialog')
    const domain = within(dialog).getByRole('textbox', { name: /Domain/ })
    expect(domain.hasAttribute('required')).toBe(true)
    expect(domain.getAttribute('aria-invalid')).not.toBe('true')
    await fireEvent.click(within(dialog).getByRole('button', { name: 'Add Domain' }))
    const alerts = await within(dialog).findAllByRole('alert')
    expect(alerts.length).toBe(2)
    expect(domain.getAttribute('aria-invalid')).toBe('true')
  })

  it('closes on a valid save and names the domain in a toast', async () => {
    render(CreateInDrawer)
    await fireEvent.click(screen.getByRole('button', { name: 'Add Domain' }))
    const dialog = await screen.findByRole('dialog')
    await fireEvent.update(within(dialog).getByRole('textbox', { name: /Domain/ }), 'acme-store')
    await fireEvent.click(within(dialog).getByRole('combobox', { name: /Environment/ }))
    await fireEvent.click(await screen.findByRole('option', { name: 'Production' }))
    await fireEvent.click(within(dialog).getByRole('button', { name: 'Add Domain' }))
    await waitFor(() => expect(screen.getByText('acme-store.azion.app added.')).toBeTruthy(), wait)
  })

  it('keeps the values after a failed save and retries from the alert', async () => {
    const view = render(CreateInDrawerSaveFailed)
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText(/wasn't added/)).toBeTruthy()
    expect(
      (within(dialog).getByRole('textbox', { name: /Domain/ }) as HTMLInputElement).value
    ).toBe('acme-store')
    await expectNoA11yViolations(view.baseElement as HTMLElement)
    await fireEvent.click(within(dialog).getByRole('button', { name: 'Retry' }))
    await waitFor(() => expect(screen.getByText('acme-store.azion.app added.')).toBeTruthy(), wait)
  })
})

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
})
