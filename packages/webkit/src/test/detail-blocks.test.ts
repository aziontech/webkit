import { cleanup, fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Records from '../../blocks/platform/detail/record-table/variants/records.vue'
import SectionedResource from '../../blocks/platform/detail/sectioned-resource/sectioned-resource.vue'
import FewSiblings from '../../blocks/platform/detail/sectioned-resource/variants/few-siblings.vue'
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
