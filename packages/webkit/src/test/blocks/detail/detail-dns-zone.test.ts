import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import DetailDnsZone from '../../../../blocks/detail/detail-dns-zone/detail-dns-zone.vue'
import ImportZoneFile from '../../../../blocks/detail/detail-dns-zone/variants/import-zone-file.vue'
import Records from '../../../../blocks/detail/detail-dns-zone/variants/records.vue'
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
describe('detail/detail-dns-zone', () => {
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

  it('renders the records it is given and emits the list actions', async () => {
    const view = render(DetailDnsZone, {
      props: {
        tab: 'records',
        records: [
          {
            id: '500001',
            name: 'docs',
            type: 'CNAME',
            value: 'docs.example.net',
            ttl: 300,
            policy: 'simple',
            weight: null,
            description: 'Docs site.'
          }
        ]
      }
    })
    const root = view.container as HTMLElement
    expect(root.textContent).toContain('docs.example.net')
    expect(root.textContent).not.toContain('192.0.2.1')
    await fireEvent.click(view.getByRole('button', { name: 'Refresh' }))
    await fireEvent.click(buttonByText('Add Record', root))
    expect(view.emitted<unknown[]>('refresh')?.[0]?.[0]).toBeInstanceOf(MouseEvent)
    expect(view.emitted<unknown[]>('create')).toHaveLength(1)
  })

  it('shows the empty state for no records and the alert for an error', async () => {
    const view = render(DetailDnsZone, { props: { tab: 'records', records: [] } })
    await waitFor(() => expect(view.container.textContent).toContain('No records yet'))
    await fireEvent.click(buttonByText('Import zone file', view.container as HTMLElement))
    expect(view.emitted<unknown[]>('import')).toHaveLength(1)
    await view.rerender({ tab: 'records', records: [], error: "Couldn't load the records." })
    expect(view.container.textContent).toContain("Couldn't load the records.")
    expect(view.container.textContent).not.toContain('No records yet')
  })

  it('emits submit with the edited settings instead of faking a save', async () => {
    const view = render(DetailDnsZone)
    await fireEvent.update(view.getByRole('textbox', { name: 'Name' }), 'edge-zone')
    await fireEvent.click(await view.findByRole('button', { name: 'Save' }))
    expect(view.emitted<unknown[]>('submit')?.[0]?.[1]).toEqual({
      name: 'edge-zone',
      domain: 'example.com',
      dnssec: true,
      active: true
    })
  })

  it('offers table preferences instead of a hand-made columns popover', () => {
    const view = render(Records)
    expect(view.getByRole('button', { name: 'Table preferences' })).toBeTruthy()
    expect(view.queryByRole('button', { name: 'Columns' })).toBeNull()
  })
})

describe('detail-dns-zone#ImportZoneFile', () => {
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
    expect(screen.getAllByText(/1 line was left out/).length).toBeGreaterThan(0)
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Import zone file' })).toBeNull()
    )
  })
})
