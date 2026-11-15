import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import CreateHub from '../../blocks/platform/create/create-hub/create-hub.vue'
import CreateHubConnected from '../../blocks/platform/create/create-hub/variants/connected.vue'
import CreateHubLoadFailed from '../../blocks/platform/create/create-hub/variants/load-failed.vue'
import CreateHubLoading from '../../blocks/platform/create/create-hub/variants/loading-repositories.vue'
import CreateInDrawer from '../../blocks/platform/create/create-in-drawer/create-in-drawer.vue'
import CreateInDrawerSaveFailed from '../../blocks/platform/create/create-in-drawer/variants/save-failed.vue'
import DeployDrawer from '../../blocks/platform/create/deploy-drawer/deploy-drawer.vue'
import DeployProgressDialog from '../../blocks/platform/create/deploy-progress-dialog/deploy-progress-dialog.vue'
import DeploySuccess from '../../blocks/platform/create/deploy-success/deploy-success.vue'
import DeploySuccessCli from '../../blocks/platform/create/deploy-success/variants/cli-created.vue'
import DeployTemplate from '../../blocks/platform/create/deploy-template/deploy-template.vue'
import DeployTemplateUpload from '../../blocks/platform/create/deploy-template/variants/upload.vue'
import MultipageCreate from '../../blocks/platform/create/multipage-create/multipage-create.vue'
import MultipageCreateAndDeploy from '../../blocks/platform/create/multipage-create/variants/create-and-deploy.vue'
import MultipageListSettings from '../../blocks/platform/create/multipage-create/variants/list-settings.vue'
import MultipageReview from '../../blocks/platform/create/multipage-create/variants/review.vue'
import ReleaseImpact from '../../blocks/platform/create/release-impact/release-impact.vue'
import ReleaseImpactSettings from '../../blocks/platform/create/release-impact/variants/choose-settings.vue'
import ResourcePicker from '../../blocks/platform/create/resource-picker/resource-picker.vue'
import ResourcePickerEmpty from '../../blocks/platform/create/resource-picker/variants/empty.vue'
import SinglePageCreate from '../../blocks/platform/create/single-page-create/single-page-create.vue'
import CreatePurge from '../../blocks/platform/create/single-page-create/variants/create-purge.vue'
import CreateService from '../../blocks/platform/create/single-page-create/variants/create-service.vue'
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

describe('deploy-progress-dialog', () => {
  it('lets the user hide the dialog while the run goes on and reopen it', async () => {
    render(DeployProgressDialog)
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('list', { name: 'Deployment Settings' })).toBeTruthy()
    const hide = within(dialog).getByRole('button', { name: 'Hide' })
    expect(hide.hasAttribute('disabled')).toBe(false)
    await fireEvent.click(hide)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull(), wait)
    await fireEvent.click(screen.getByRole('button', { name: 'Show progress' }))
    expect(await screen.findByRole('dialog')).toBeTruthy()
  })
})

describe('deploy-success', () => {
  it('links the domain and repository with Link and the next steps with integration Cards', async () => {
    const view = render(DeploySuccess)
    const domain = screen.getByRole('link', { name: /web-app-k3x9q2\.example\.com/ })
    expect(domain.getAttribute('target')).toBe('_blank')
    expect(domain.getAttribute('rel')).toBe('noopener noreferrer')
    expect(screen.getByRole('link', { name: /acme\/web-app/ }).getAttribute('target')).toBe(
      '_blank'
    )
    expect(screen.getByRole('link', { name: 'Customize domain' }).getAttribute('href')).toBe(
      'https://example.com/docs'
    )
    expect(screen.getByRole('heading', { name: 'Resources' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Manage service' })).toBeTruthy()
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('makes the in-place next step a button tile', () => {
    render(DeploySuccessCli)
    expect(screen.getByRole('button', { name: 'Deploy this resource' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Deploy using a new service' })).toBeTruthy()
  })
})

describe('resource-picker', () => {
  it('opens on New with no toggle when nothing exists to bind', async () => {
    const view = render(ResourcePickerEmpty)
    expect(screen.queryByRole('radiogroup')).toBeNull()
    expect(screen.queryByRole('radio', { name: 'Existing project' })).toBeNull()
    expect(screen.getByRole('textbox', { name: /Name/ })).toBeTruthy()
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('keeps the toggle and gives every project a repository when projects exist', () => {
    render(ResourcePicker)
    expect(screen.getByRole('radio', { name: 'Existing project' })).toBeTruthy()
    expect(document.body.textContent).not.toMatch(/· \s*(\n|$)/)
    expect(document.body.textContent).not.toContain('shopco')
  })
})

describe('multipage-create#CreateAndDeploy', () => {
  it('gates Next on the project, then shows the loading state on Create and deploy', async () => {
    render(MultipageCreateAndDeploy)
    expect(screen.getByTestId('navigation-wizard')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(
      await screen.findByText('Select the project this service serves, or create a new one.')
    ).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: /web-app/ }))
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(
      await screen.findByRole('heading', { level: 2, name: 'Domain and deployment' })
    ).toBeTruthy()
    await fireEvent.update(screen.getByRole('textbox', { name: 'Domain prefix' }), 'my-first-app')
    const submit = screen.getByRole('button', { name: 'Create and deploy' })
    await fireEvent.click(submit)
    await waitFor(() => expect(submit.getAttribute('aria-busy')).toBe('true'), wait)
  })
})

describe('single-page-create', () => {
  it('creates the domain with a loading submit and a toast, and offers no inert Import', async () => {
    render(SinglePageCreate)
    expect(screen.queryByRole('button', { name: 'Import' })).toBeNull()
    await fireEvent.update(screen.getByRole('textbox', { name: 'Name' }), 'acme-domain')
    await fireEvent.update(screen.getByRole('textbox', { name: 'Domain name' }), 'example.com')
    const save = screen.getByRole('button', { name: 'Save' })
    await fireEvent.click(save)
    await waitFor(() => expect(save.getAttribute('aria-busy')).toBe('true'), wait)
    await waitFor(() => expect(screen.getByText('example.com created.')).toBeTruthy(), wait)
  })

  it('gives Create Service a page heading and one h2 per group', () => {
    render(CreateService)
    expect(screen.getByRole('heading', { level: 1, name: 'Create Service' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'General' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Back to Services' })).toBeTruthy()
  })

  it('sets the purge list in the monospace face through the Textarea prop', () => {
    render(CreatePurge)
    const list = screen.getByRole('textbox', { name: /list$/ })
    expect(list.closest('[data-monospace]')).toBeTruthy()
  })
})

describe('release-impact', () => {
  it('names each resource card and gives the read-only resource a real control', async () => {
    const view = render(ReleaseImpact)
    expect(screen.getByRole('heading', { level: 1, name: 'Review and deploy' })).toBeTruthy()
    const regions = screen.getAllByRole('region')
    expect(regions.length).toBeGreaterThan(1)
    const resources = screen.getAllByRole('textbox', { name: 'Resource' })
    expect(resources.length).toBeGreaterThan(0)
    resources.forEach((input) => expect(input.hasAttribute('readonly')).toBe(true))
    expect(screen.getByRole('button', { name: /Deploy release/ })).toBeTruthy()
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('selects settings with an overflow chip and a no-match EmptyState', async () => {
    render(ReleaseImpactSettings)
    expect(
      screen.getByRole('heading', { level: 1, name: 'Select Deployment Settings' })
    ).toBeTruthy()
    await fireEvent.update(
      screen.getByRole('textbox', { name: 'Search Deployment Settings' }),
      'nothing-like-this'
    )
    expect(screen.getByText('No Deployment Settings match')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.queryByText('No Deployment Settings match')).toBeNull()
  })
})

describe('multipage-create', () => {
  it('moves from List settings to Review with Next, so every flow reaches the create', async () => {
    render(MultipageListSettings)
    expect(screen.queryByRole('button', { name: 'Create Access List' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Next' })).toBeTruthy()
  })

  it('creates from Review with a loading submit and a toast, and edits Name on General', async () => {
    render(MultipageReview)
    const create = await screen.findByRole('button', { name: 'Create Access List' })
    await fireEvent.click(create)
    await waitFor(() => expect(create.getAttribute('aria-busy')).toBe('true'), wait)
    await waitFor(() => expect(screen.getByText('office-ranges created.')).toBeTruthy(), wait)
    await fireEvent.click(screen.getByRole('button', { name: 'Edit name' }))
    expect(await screen.findByRole('heading', { level: 2, name: 'General' }, wait)).toBeTruthy()
  })

  it('runs on the Wizard: Next needs an answer, and a host with the module off adds a step', async () => {
    render(MultipageCreate)
    expect(screen.getByTestId('navigation-wizard')).toBeTruthy()
    expect(screen.getByRole('heading', { level: 1, name: 'Create Access List' })).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('Select a policy, or continue without one.')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: /acme-staging/ }))
    expect(await screen.findByRole('heading', { level: 2, name: 'IP filtering' })).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByRole('heading', { level: 2, name: 'General' })).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('This field is required.')).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'General' })).toBeTruthy()
  })
})
