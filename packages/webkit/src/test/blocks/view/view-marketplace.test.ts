import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Installed from '../../../../blocks/view/view-marketplace/variants/installed.vue'
import NoMatch from '../../../../blocks/view/view-marketplace/variants/no-match.vue'
import ViewMarketplace from '../../../../blocks/view/view-marketplace/view-marketplace.vue'
import { type MarketplaceIntegration } from '../../../../blocks/view/view-marketplace/view-marketplace.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const toastWith = (text: string) =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-testid="toast-item"]')).find((el) =>
    el.textContent?.includes(text)
  )

afterEach(() => {
  window.history.replaceState(null, '', window.location.pathname)
})
describe('view/view-marketplace block', () => {
  it('lists integrations only, with no tabs and no template tiles', () => {
    const view = render(ViewMarketplace)
    expect(view.queryAllByRole('tab')).toEqual([])
    expect(view.queryByRole('combobox', { name: 'Search templates' })).toBeNull()
    expect(view.queryByRole('link', { name: 'Astro Blog' })).toBeNull()
    expect(view.getByRole('combobox', { name: 'Search integrations' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Install Rate Guard' })).toBeTruthy()
  })

  it('opens an integration from its tile and refuses Install until an application is chosen', async () => {
    const view = render(ViewMarketplace)
    await fireEvent.click(view.getByRole('button', { name: 'Install Rate Guard' }))
    const drawer = await waitFor(() => view.getByRole('dialog'))
    expect(
      within(drawer).getByText('Rate Guard', { selector: 'h2, [role="heading"], *' })
    ).toBeTruthy()

    await fireEvent.click(within(drawer).getByRole('button', { name: 'Install' }))

    await waitFor(() =>
      expect(
        within(drawer).getByText('Select the application to install Rate Guard on.')
      ).toBeTruthy()
    )
  })

  it('shows the installed state on the tile, in the drawer and in a toast with Configure and Open application', async () => {
    const view = render(Installed)
    const drawer = await waitFor(() => view.getByRole('dialog'))
    await waitFor(() =>
      expect(drawer.textContent).toContain('Request Signer is installed on storefront.')
    )
    expect(
      within(drawer).queryByText('Select the application to install Request Signer on.')
    ).toBeNull()
    const toast = await waitFor(() => {
      const node = toastWith('Request Signer is installed on storefront.')
      expect(node).toBeTruthy()
      return node as HTMLElement
    })
    expect(within(toast).getByRole('button', { name: 'Configure' })).toBeTruthy()
    expect(within(toast).getByRole('button', { name: 'Open application' })).toBeTruthy()
    expect(toast.textContent).not.toMatch(/View deployments|Try again|Retry/)
  })

  it('reports a failed install inline and in a permanent toast with Edit and Reinstall', async () => {
    const view = render(ViewMarketplace, {
      props: {
        defaultIntegration: 'request-signer',
        defaultApplication: 'checkout',
        error: 'The application already runs 10 functions, the most it can hold.'
      }
    })
    const drawer = await waitFor(() => view.getByRole('dialog'))
    await waitFor(() =>
      expect(within(drawer).getByText(/wasn't installed on checkout/)).toBeTruthy()
    )
    expect(within(drawer).getByRole('button', { name: 'Reinstall' })).toBeTruthy()
    const toast = await waitFor(() => {
      const node = toastWith("Request Signer wasn't installed on checkout.")
      expect(node).toBeTruthy()
      return node as HTMLElement
    })
    expect(within(toast).getByRole('button', { name: 'Edit' })).toBeTruthy()
    expect(within(toast).getByRole('button', { name: 'Reinstall' })).toBeTruthy()
  })

  it('hides the featured row and offers Clear filters when nothing matches', async () => {
    const view = render(NoMatch)
    await waitFor(() => expect(view.getByText('No matching integrations')).toBeTruthy())
    expect(view.queryByRole('heading', { name: 'Featured' })).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Clear filters' }))
    await waitFor(() => expect(view.getByRole('heading', { name: 'Featured' })).toBeTruthy())
  })

  it('renders the integrations it is given instead of the sample', () => {
    const integrations: MarketplaceIntegration[] = [
      {
        id: 'log-shipper',
        name: 'Log Shipper',
        vendor: 'Acme',
        logo: 'az az-inbox',
        category: 'Observability',
        context: 'application',
        description: 'Send request logs to a collector you run.',
        version: '2.0.0',
        updated: 'Nov 1, 2026',
        featured: false,
        installedOn: []
      }
    ]
    const view = render(ViewMarketplace, { props: { integrations, applications: ['storefront'] } })
    expect(view.getByRole('button', { name: 'Install Log Shipper' })).toBeTruthy()
    expect(view.queryByRole('button', { name: 'Install Rate Guard' })).toBeNull()
  })

  it('emits install with the integration and the chosen application, and fakes no result', async () => {
    const view = render(ViewMarketplace, {
      props: { defaultIntegration: 'rate-guard', defaultApplication: 'checkout' }
    })
    const drawer = await waitFor(() => view.getByRole('dialog'))
    await fireEvent.click(within(drawer).getByRole('button', { name: 'Install' }))
    const emitted = view.emitted('install') as [
      Event,
      { integration: { id: string }; application: string }
    ][]
    expect(emitted).toHaveLength(1)
    expect(emitted[0][0]).toBeInstanceOf(Event)
    expect(emitted[0][1].integration.id).toBe('rate-guard')
    expect(emitted[0][1].application).toBe('checkout')
    expect(drawer.textContent).not.toContain('is installed on checkout')
  })

  it('shows skeleton tiles and no sample while loading', () => {
    const view = render(ViewMarketplace, { props: { loading: true } })
    expect(view.getByLabelText('Loading integrations').getAttribute('aria-busy')).toBe('true')
    expect(view.queryByRole('button', { name: 'Install Rate Guard' })).toBeNull()
  })
})
