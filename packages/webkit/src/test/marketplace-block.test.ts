import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Marketplace from '../../blocks/platform/view/marketplace/marketplace.vue'
import InstallFailed from '../../blocks/platform/view/marketplace/variants/install-failed.vue'
import Installed from '../../blocks/platform/view/marketplace/variants/installed.vue'
import NoMatch from '../../blocks/platform/view/marketplace/variants/no-match.vue'
import TemplateBrowser from '../../blocks/platform/view/template-browser/template-browser.vue'
import { useToastRegion } from './toast-region'

useToastRegion()

const toastWith = (text: string) =>
  Array.from(document.querySelectorAll<HTMLElement>('[data-testid="feedback-toast__item"]')).find(
    (el) => el.textContent?.includes(text)
  )

afterEach(() => {
  window.history.replaceState(null, '', window.location.pathname)
})

describe('platform/view/marketplace block', () => {
  it('opens an integration from its tile and refuses Install until an application is chosen', async () => {
    const view = render(Marketplace)
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
    const view = render(InstallFailed)
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
})

describe('platform/view/template-browser block', () => {
  it('opens the preview from a tile and leads Deploy into the deploy template flow', async () => {
    const view = render(TemplateBrowser)
    await fireEvent.click(view.getByRole('button', { name: 'Astro Blog' }))
    const drawer = await waitFor(() => view.getByRole('dialog'))
    expect(within(drawer).getByText('README')).toBeTruthy()
    expect(
      within(drawer)
        .getByRole('link', { name: /Deploy/ })
        .getAttribute('href')
    ).toBe('/create/deploy?template=astro-blog')
  })

  it('groups the templates by category', () => {
    const view = render(TemplateBrowser)
    const headings = view.getAllByRole('heading', { level: 2 }).map((h) => h.textContent?.trim())
    expect(headings).toEqual(['Frameworks', 'Starters', 'Functions'])
  })
})
