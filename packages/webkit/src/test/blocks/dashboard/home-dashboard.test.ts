import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Home from '../../../../blocks/dashboard/home-dashboard/home-dashboard.vue'
import HomeFailed from '../../../../blocks/dashboard/home-dashboard/variants/error.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => cleanup())
describe('dashboard/home-dashboard', () => {
  it('links every resource row and panel heading to a real destination', () => {
    const view = render(Home)
    const rows = view.getAllByRole('link', { name: /marketing-site/ })
    expect(rows.every((row) => row.getAttribute('href') === '/projects/4410203040')).toBe(true)
    expect(view.getByRole('link', { name: 'Projects' }).getAttribute('href')).toBe('/projects')
    expect(view.getByRole('link', { name: /Set up your coding agent/ }).getAttribute('href')).toBe(
      '/agents/setup'
    )
  })

  it('explains each usage tile with a focusable Hint', () => {
    const view = render(Home)
    const usage = view.getByRole('complementary', { name: 'Usage' })
    expect(usage.querySelectorAll('button').length).toBeGreaterThanOrEqual(4)
  })

  it('shows a Retry alert in the usage band and in every panel when Home fails', () => {
    const view = render(HomeFailed)
    const retries = Array.from(view.container.querySelectorAll('button')).filter(
      (button) => button.textContent?.trim() === 'Retry'
    )
    expect(retries.length).toBe(5)
    expect(view.queryByRole('link', { name: /marketing-site/ })).toBeNull()
  })
})

describe('dashboard/home-dashboard data', () => {
  const project = {
    id: '9001',
    name: 'acme-store',
    href: '/projects/9001',
    typeLabel: 'Project'
  }

  it('renders the rows and figures it is given instead of the sample', () => {
    const view = render(Home, {
      props: {
        userName: 'Jane',
        metrics: { 'data-transferred': { value: 17, delta: null } },
        projects: [project],
        resources: [],
        domains: [],
        recents: []
      }
    })
    expect(view.container.textContent).toContain('Jane')
    expect(view.container.textContent).not.toContain('Alex')
    expect(view.getByRole('link', { name: /acme-store/ }).getAttribute('href')).toBe(
      '/projects/9001'
    )
    expect(view.queryByRole('link', { name: /marketing-site/ })).toBeNull()
    expect(view.container.textContent).toContain('No domains yet')
  })

  it('shows the first-access screen when every list is empty, and emits its actions', async () => {
    const view = render(Home, { props: { projects: [], resources: [], domains: [], recents: [] } })
    expect(view.container.textContent).toContain("Let's build something new.")
    await fireEvent.click(view.getByRole('button', { name: 'Create Project' }))
    await fireEvent.click(view.getByRole('button', { name: 'Copy prompt' }))
    expect(view.emitted('create-project')).toHaveLength(1)
    expect(view.emitted('copy-prompt')).toHaveLength(1)
  })

  it('emits check-domain after the debounce and shows the answer it is given', async () => {
    const view = render(Home, {
      props: {
        projects: [],
        resources: [],
        domains: [],
        recents: [],
        domainAvailability: { name: 'other.example.com', registered: true }
      }
    })
    await fireEvent.update(view.getByRole('textbox', { name: 'Domain to add' }), 'acme.example.com')
    await waitFor(() => expect(view.emitted('check-domain')).toEqual([['acme.example.com']]), {
      timeout: 3000
    })
    expect(document.body.textContent).toContain('Checking acme.example.com...')
    await view.rerender({ domainAvailability: { name: 'acme.example.com', registered: false } })
    await waitFor(() =>
      expect(document.body.textContent).toContain('acme.example.com is available.')
    )
  })

  it('never shows the sample while loading, and emits retry and the agent card dismissal', async () => {
    const loading = render(Home, { props: { loading: true } })
    expect(loading.queryByRole('link', { name: /marketing-site/ })).toBeNull()
    expect(loading.container.textContent).not.toContain("Let's build something new.")
    loading.unmount()
    const view = render(Home, { props: { error: 'The API answered 503.' } })
    expect(view.container.textContent).toContain("Couldn't load usage. The API answered 503.")
    await fireEvent.click(view.getAllByRole('button', { name: 'Retry' })[0])
    expect(view.emitted('retry')).toHaveLength(1)
    await fireEvent.click(view.getByRole('button', { name: 'Dismiss agent setup' }))
    expect(view.emitted('update:agentSetup')).toEqual([[false]])
  })
})
