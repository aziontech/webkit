import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import DeploymentLogs from '../../blocks/detail/deployment-logs/deployment-logs.vue'
import DeploymentDetail from '../../blocks/detail/deployment-logs/variants/deployment-detail.vue'
import DeploymentError from '../../blocks/detail/deployment-logs/variants/deployment-error.vue'
import DeploymentQueued from '../../blocks/detail/deployment-logs/variants/deployment-queued.vue'
import DeploymentLogsFailed from '../../blocks/detail/deployment-logs/variants/error.vue'
import InCreateFlow from '../../blocks/detail/deployment-logs/variants/in-create-flow.vue'
import InCreateFlowError from '../../blocks/detail/deployment-logs/variants/in-create-flow-error.vue'
import Records from '../../blocks/detail/dns-zone-detail/variants/records.vue'
import Running from '../../blocks/detail/invocations/variants/running.vue'
import ProductionChecklist from '../../blocks/detail/production-checklist/production-checklist.vue'
import DetailsPage from '../../blocks/detail/resource-detail/resource-detail.vue'
import Service from '../../blocks/detail/resource-detail/variants/service.vue'
import SectionedResource from '../../blocks/detail/sectioned-resource/sectioned-resource.vue'
import FewSiblings from '../../blocks/detail/sectioned-resource/variants/few-siblings.vue'
import DeviceGroups from '../../blocks/detail/version-detail/variants/device-groups.vue'
import Revert from '../../blocks/detail/version-detail/variants/revert.vue'
import AsyncSubmitFailed from '../../blocks/state/async-submit/variants/error.vue'
import AsyncSubmitRunning from '../../blocks/state/async-submit/variants/running.vue'
import { useToastRegion } from './toast-region'

useToastRegion()

afterEach(() => cleanup())

const buttonByText = (text: string, root: Document | HTMLElement = document) =>
  Array.from(root.querySelectorAll('button, a')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLElement

const filterBy = async (root: HTMLElement, name: string, text: string) => {
  const input = within(root).getByRole('combobox', { name })
  await fireEvent.update(input, text)
  await fireEvent.keyDown(input, { key: 'Enter' })
}

describe('detail/dns-zone-detail', () => {
  it('filters records through the property filter and clears a no-match', async () => {
    const view = render(Records)
    const root = view.container as HTMLElement
    expect(root.textContent).toContain('192.0.2.1')
    await filterBy(root, 'Filter records', 'Type = MX')
    await waitFor(() => expect(root.textContent).toContain('No matching records'))
    expect(root.textContent).not.toContain('192.0.2.1')
    await fireEvent.click(buttonByText('Clear filters', root))
    await waitFor(() => expect(root.textContent).toContain('192.0.2.1'))
  })

  it('offers table preferences instead of a hand-made columns popover', () => {
    const view = render(Records)
    expect(view.getByRole('button', { name: 'Table preferences' })).toBeTruthy()
    expect(view.queryByRole('button', { name: 'Columns' })).toBeNull()
  })
})

describe('detail/sectioned-resource', () => {
  it('offers Add on a page with no entries and Clear filters on a no-match', async () => {
    const view = render(FewSiblings)
    const root = view.container as HTMLElement
    await filterBy(root, 'Filter firewall rules', 'nothing-matches-this')
    await waitFor(() => expect(root.textContent).toContain('No matching firewall rules'))
    expect(buttonByText('Clear filters', root)).toBeTruthy()
    await fireEvent.click(view.getByRole('radio', { name: 'Exceptions' }))
    await waitFor(() => expect(root.textContent).toContain('No exceptions yet'))
    expect(root.textContent).not.toContain('No matching')
    expect(buttonByText('Add Exception', root)).toBeTruthy()
  })

  it('links another tab to its own route instead of leaving it dead', async () => {
    const view = render(SectionedResource)
    await fireEvent.click(view.getByRole('tab', { name: 'Settings' }))
    const open = await waitFor(() => view.getByRole('link', { name: 'Open Settings' }))
    expect(open.getAttribute('href')).toBe('/policies/acme-default/settings')
    await fireEvent.click(view.getByRole('tab', { name: 'Private access' }))
    await waitFor(() => expect(view.getByRole('table')).toBeTruthy())
  })
})

describe('detail/invocations', () => {
  it('keeps the printed lines of a running invocation on screen while it streams', async () => {
    const view = render(Running)
    await waitFor(() =>
      expect(view.container.textContent).toContain('Cache miss, fetching assets.example.com')
    )
    expect(view.container.textContent).toContain('Streaming')
    expect(view.getByRole('heading', { name: 'Invocation' })).toBeTruthy()
  })

  it('opens Recent from a real button and links the function', () => {
    const view = render(Running)
    expect(view.getByRole('button', { name: /Recent/ })).toBeTruthy()
    expect(view.getByRole('link', { name: 'image-resizer' }).getAttribute('href')).toBe(
      '/functions/40122'
    )
  })
})

describe('detail/production-checklist', () => {
  it('opens the drawer from a step row and from the expand button', async () => {
    const view = render(ProductionChecklist)
    await fireEvent.click(view.getByRole('button', { name: /Enable a security policy/ }))
    const drawer = await waitFor(() => view.getByRole('dialog', { name: /Ship to production/ }))
    expect(drawer.textContent).toContain('Attach Policy')
    await fireEvent.click(buttonByText('Done', drawer))
    await waitFor(() => expect(view.queryByRole('dialog')).toBeNull())
    await fireEvent.click(view.getByRole('button', { name: 'Expand the production checklist' }))
    await waitFor(() =>
      expect(view.getByRole('dialog', { name: /Ship to production/ })).toBeTruthy()
    )
  })
})

describe('detail/deployment-logs', () => {
  it('derives the progress from the steps and shows no time for steps that never ran', () => {
    const view = render(DeploymentLogs)
    const root = view.container as HTMLElement
    expect(view.getByRole('heading', { name: 'Deployment logs', level: 2 })).toBeTruthy()
    expect(within(root).getByRole('status').textContent).toMatch(/3\/8 steps\s*Build/)
    expect(view.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('38')
    const publish = within(root).getByText('Publish').closest('button') as HTMLElement
    expect(publish.textContent).not.toMatch(/\d+s/)
  })

  it('announces the run in one status region and gives every step its status in words', () => {
    const view = render(DeploymentLogs)
    expect(within(view.container as HTMLElement).getAllByRole('status')).toHaveLength(1)
    const triggers = view.getAllByRole('button', { expanded: false })
    expect(triggers.some((trigger) => /Done/.test(trigger.textContent ?? ''))).toBe(true)
    expect(triggers.some((trigger) => /Not started/.test(trigger.textContent ?? ''))).toBe(true)
    expect(view.getByRole('button', { expanded: true }).textContent).toContain('Running')
  })

  it.each([
    ['Running', DeploymentLogs],
    ['Failed', DeploymentLogsFailed],
    ['InCreateFlowError', InCreateFlowError],
    ['DeploymentDetail', DeploymentDetail],
    ['DeploymentError', DeploymentError],
    ['async-submit Running', AsyncSubmitRunning],
    ['async-submit Failed', AsyncSubmitFailed]
  ])('%s composes LogView.Steps for its phased steps', (_name, block) => {
    const view = render(block)
    expect(view.container.querySelector('[data-testid="code-log-view__steps"]')).toBeTruthy()
  })

  it('opens a failed run on the failed step and says why the next one never ran', async () => {
    const view = render(DeploymentLogsFailed)
    expect(view.getByRole('button', { expanded: true }).textContent).toContain('Routing Rules')
    await fireEvent.click(within(view.container as HTMLElement).getByText('Publish'))
    await waitFor(() =>
      expect(view.container.textContent).toContain(
        'Never ran. The deployment stopped at Routing Rules.'
      )
    )
  })

  it('InCreateFlow opens on the cloning splash with a Cloning status', () => {
    const view = render(InCreateFlow)
    expect(view.container.textContent).toContain('Cloning acme/web-app to acme')
    expect(view.container.textContent).toContain('Cloning')
  })

  it('InCreateFlowError ends a failure with Edit and Redeploy', async () => {
    const view = render(InCreateFlowError)
    expect(view.getByRole('link', { name: 'Edit' })).toBeTruthy()
    expect(view.getAllByLabelText('Log view')).toHaveLength(1)
    await fireEvent.click(view.getByRole('button', { name: 'Redeploy' }))
    expect(view.queryByLabelText('Log view')).toBeNull()
    expect(view.container.textContent).toContain('Redeploying')
  })

  it('DeploymentQueued shows a not-started state with no view switch', () => {
    const view = render(DeploymentQueued)
    expect(view.container.textContent).toContain('Queued, not started')
    expect(view.queryByLabelText('Log view')).toBeNull()
  })
})

describe('detail/resource-detail', () => {
  it('gives Visit the live address and links the tabs that live on another route', async () => {
    const view = render(DetailsPage)
    const visit = view.getByRole('link', { name: /Visit/ })
    expect(visit.getAttribute('href')).toBe('https://analytics-app-z1x2c3.example.com')
    expect(view.getByRole('link', { name: '1213275262' }).getAttribute('href')).toBe(
      '/deployments/1213275262'
    )
    await fireEvent.click(view.getByRole('tab', { name: 'Versions' }))
    const open = await waitFor(() => view.getByRole('link', { name: 'Open Versions' }))
    expect(open.getAttribute('href')).toBe('/resources/analytics-app/versions')
  })

  it('adds a custom domain from an IconButton', () => {
    const view = render(Service)
    expect(view.getByRole('button', { name: 'Add a custom domain' })).toBeTruthy()
  })
})

describe('detail/version-detail', () => {
  it('opens earlier versions as links and marks the viewed one as the current page', () => {
    render(Revert)
    const history = document.querySelector('[aria-current="page"]') as HTMLAnchorElement
    expect(history.tagName).toBe('A')
    expect(history.getAttribute('href')).toBe('/resources/web-app/versions/AK7D0ZX4')
  })

  it('tells a search with no match apart from an empty list', async () => {
    const view = render(DeviceGroups)
    const root = view.container as HTMLElement
    await fireEvent.update(view.getByRole('textbox', { name: 'Search device groups' }), 'zzz-none')
    await waitFor(() => expect(root.textContent).toContain('No matching device groups'))
    await fireEvent.click(buttonByText('Clear search', root))
    await waitFor(() => expect(root.textContent).not.toContain('No matching device groups'))
  })
})
