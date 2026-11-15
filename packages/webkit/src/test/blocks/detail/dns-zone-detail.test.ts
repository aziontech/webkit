import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import ImportZoneFile from '../../../../blocks/detail/dns-zone-detail/variants/import-zone-file.vue'
import Records from '../../../../blocks/detail/dns-zone-detail/variants/records.vue'
import { expectNoA11yViolations } from '../../axe'
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

const wait = { timeout: 4000 }

afterEach(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})
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

describe('dns-zone-detail#ImportZoneFile', () => {
  it('previews each line with its status and reason', async () => {
    render(ImportZoneFile)
    const drawer = await screen.findByRole('dialog', { name: 'Import zone file' })
    expect(within(drawer).getByRole('status').textContent).toMatch(/5 ready, 3 skipped,\s*1 error/)
    expect(within(drawer).getByText('192.0.2.300 is not an IPv4 address.')).toBeTruthy()
    expect(within(drawer).getByText('HINFO records are not supported.')).toBeTruthy()
    expect(within(drawer).getByText('The zone keeps its own SOA.')).toBeTruthy()
    await expectNoA11yViolations(drawer)
  })

  it('reparses pasted text and imports only the ready lines', async () => {
    render(ImportZoneFile)
    const drawer = await screen.findByRole('dialog', { name: 'Import zone file' })
    const text = within(drawer).getByRole('textbox', { name: 'Or paste it' })
    await fireEvent.update(text, 'www 300 IN A 192.0.2.7\nbad IN A nowhere')
    expect(within(drawer).getByRole('status').textContent).toMatch(/5 ready, 3 skipped,\s*1 error/)
    await waitFor(() =>
      expect(within(drawer).getByRole('status').textContent).toMatch(
        /1 ready, 0 skipped,\s*1 error/
      )
    )
    await fireEvent.click(within(drawer).getByRole('button', { name: 'Import 1 record' }))
    await waitFor(
      () => expect(screen.getByText('Imported 1 record from the pasted zone file.')).toBeTruthy(),
      wait
    )
    expect(screen.getByText(/1 line was left out/)).toBeTruthy()
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Import zone file' })).toBeNull()
    )
  })
})
