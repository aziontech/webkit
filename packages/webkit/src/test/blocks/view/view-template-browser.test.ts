import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import NoMatch from '../../../../blocks/view/view-template-browser/variants/no-match.vue'
import ViewTemplateBrowser, {
  type TemplateBrowserTemplate
} from '../../../../blocks/view/view-template-browser/view-template-browser.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => {
  window.history.replaceState(null, '', window.location.pathname)
})
describe('view/view-template-browser block', () => {
  it('opens the preview from a tile and leads Deploy into the deploy template flow', async () => {
    const view = render(ViewTemplateBrowser)
    await fireEvent.click(view.getByRole('button', { name: 'Astro Blog' }))
    const drawer = await waitFor(() => view.getByRole('dialog'))
    expect(within(drawer).getByText('README')).toBeTruthy()
    expect(
      within(drawer)
        .getByRole('link', { name: /Deploy/ })
        .getAttribute('href')
    ).toBe('/create/deploy?template=astro-blog')
  })

  it('shows the search that matches nothing as a token it can remove (NoMatch)', async () => {
    const view = render(NoMatch)
    const token = await waitFor(() => view.getByTestId('property-filter__token'))
    expect(token.textContent).toContain('kubernetes')
  })

  it('groups the templates by category', () => {
    const view = render(ViewTemplateBrowser)
    const headings = view.getAllByRole('heading', { level: 2 }).map((h) => h.textContent?.trim())
    expect(headings).toEqual(['Frameworks', 'Starters', 'Functions'])
  })

  it('renders the templates it is given and emits select from a tile', async () => {
    const templates: TemplateBrowserTemplate[] = [
      {
        id: 'acme-shop',
        title: 'Acme Shop',
        category: 'starters',
        framework: 'vite',
        icon: 'az az-object-storage',
        description: 'A small storefront for Acme products.',
        updated: 'Nov 3, 2026',
        repository: 'example-org/templates/acme-shop'
      }
    ]
    const view = render(ViewTemplateBrowser, { props: { templates } })
    expect(view.queryByRole('button', { name: 'Astro Blog' })).toBeNull()
    expect(view.getAllByRole('heading', { level: 2 }).map((h) => h.textContent?.trim())).toEqual([
      'Starters'
    ])
    await fireEvent.click(view.getByRole('button', { name: 'Acme Shop' }))
    const emitted = view.emitted('select') as [MouseEvent, TemplateBrowserTemplate][]
    expect(emitted[0][0]).toBeInstanceOf(MouseEvent)
    expect(emitted[0][1].id).toBe('acme-shop')
  })

  it('shows the error alert with Retry and emits retry', async () => {
    const view = render(ViewTemplateBrowser, { props: { error: "Couldn't load templates." } })
    expect(view.getByText("Couldn't load templates.")).toBeTruthy()
    expect(view.queryByRole('button', { name: 'Astro Blog' })).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted('retry')).toHaveLength(1)
  })

  it('opens the preview it is told to open', async () => {
    const view = render(ViewTemplateBrowser, { props: { defaultPreview: 'hugo-docs' } })
    const drawer = await waitFor(() => view.getByRole('dialog'))
    expect(within(drawer).getByText('example-org/templates/hugo-docs')).toBeTruthy()
  })
})
