import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import TemplateBrowser from '../../../../blocks/view/template-browser/template-browser.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

afterEach(() => {
  window.history.replaceState(null, '', window.location.pathname)
})
describe('view/template-browser block', () => {
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
