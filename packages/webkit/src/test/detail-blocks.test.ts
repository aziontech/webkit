import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import DeploymentLogs from '../../blocks/platform/detail/deployment-logs/deployment-logs.vue'
import DetailsPage from '../../blocks/platform/detail/details-page/details-page.vue'
import Service from '../../blocks/platform/detail/details-page/variants/service.vue'
import Running from '../../blocks/platform/detail/invocations/variants/running.vue'
import ProductionChecklist from '../../blocks/platform/detail/production-checklist/production-checklist.vue'
import Records from '../../blocks/platform/detail/record-table/variants/records.vue'
import SectionedResource from '../../blocks/platform/detail/sectioned-resource/sectioned-resource.vue'
import FewSiblings from '../../blocks/platform/detail/sectioned-resource/variants/few-siblings.vue'
import DeviceGroups from '../../blocks/platform/detail/version-detail/variants/device-groups.vue'
import Revert from '../../blocks/platform/detail/version-detail/variants/revert.vue'
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

describe('platform/detail/record-table', () => {
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

describe('platform/detail/sectioned-resource', () => {
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

describe('platform/detail/invocations', () => {
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

describe('platform/detail/production-checklist', () => {
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

describe('platform/detail/deployment-logs', () => {
  it('derives the progress from the steps and shows no time for steps that never ran', () => {
    const view = render(DeploymentLogs)
    const root = view.container as HTMLElement
    expect(view.getByRole('heading', { name: 'Deployment logs', level: 2 })).toBeTruthy()
    const heading = view.getByRole('heading', { name: 'Deployment logs', level: 2 })
    const progress = within(heading.parentElement as HTMLElement).getByRole('status')
    expect(progress.textContent).toMatch(/3\/8 steps\s*Build/)
    expect(view.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('38')
    const publish = within(root).getByText('Publish').closest('button') as HTMLElement
    expect(publish.textContent).not.toMatch(/\d+s/)
  })
})

describe('platform/detail/details-page', () => {
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

describe('platform/detail/version-detail', () => {
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
