import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import SectionedResource from '../../../../blocks/detail/sectioned-resource/sectioned-resource.vue'
import FewSiblings from '../../../../blocks/detail/sectioned-resource/variants/few-siblings.vue'
import { useToastRegion } from '../../toast-region'

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
