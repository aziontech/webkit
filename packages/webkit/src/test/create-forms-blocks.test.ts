import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import CreateOrganization from '../../blocks/platform/create/single-page-create/variants/create-organization.vue'
import CreateZone from '../../blocks/platform/create/single-page-create/variants/create-zone.vue'
import { expectNoA11yViolations } from './axe'
import { useToastRegion } from './toast-region'

useToastRegion()

const wait = { timeout: 4000 }

afterEach(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})

const recordRows = () =>
  within(screen.getByRole('list', { name: 'Imported records' })).queryAllByRole('listitem')

describe('single-page-create#CreateZone', () => {
  it('lists the imported records with Import in the bar, without axe findings', async () => {
    const view = render(CreateZone)
    expect(screen.getByRole('heading', { name: 'Create Zone' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Import' })).toBeTruthy()
    expect(recordRows()).toHaveLength(5)
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('removes one record and discards the rest of the import', async () => {
    render(CreateZone)
    await fireEvent.click(screen.getByRole('button', { name: 'Remove CNAME record www' }))
    expect(recordRows()).toHaveLength(4)
    await fireEvent.click(screen.getByRole('button', { name: 'Discard import' }))
    expect(screen.queryByRole('heading', { name: 'Records' })).toBeNull()
    await waitFor(() => expect(screen.getByText('4 imported records discarded.')).toBeTruthy())
  })

  it('reads a zone file pasted into Domain name and skips the SOA and nameservers', async () => {
    render(CreateZone)
    await fireEvent.click(screen.getByRole('button', { name: 'Discard import' }))
    const domain = screen.getByRole('textbox', { name: 'Domain name' })
    const clipboardData = new DataTransfer()
    clipboardData.setData(
      'text/plain',
      [
        '$ORIGIN example.org.',
        '$TTL 600',
        '@ IN SOA ns1.example.org. admin.example.org. 1 7200 3600 1209600 600',
        '@ IN NS ns1.example.org.',
        'www IN CNAME example.org.',
        'shop 300 IN A 203.0.113.7'
      ].join('\n')
    )
    domain.dispatchEvent(
      new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true })
    )
    await nextTick()
    expect(recordRows()).toHaveLength(2)
    expect(screen.getByText(/203\.0\.113\.7/)).toBeTruthy()
    await waitFor(() =>
      expect(screen.getByText('Imported 2 records from the pasted zone file.')).toBeTruthy()
    )
  })
})

describe('single-page-create#CreateOrganization', () => {
  it('renders General, Owner, First workspace and Advanced without axe findings', async () => {
    const view = render(CreateOrganization)
    for (const name of ['General', 'Owner', 'First workspace', 'Advanced'])
      expect(screen.getByRole('heading', { name: new RegExp(name) })).toBeTruthy()
    expect(screen.getByText('jane.doe@example.com')).toBeTruthy()
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('previews the chosen mark with the typed name', async () => {
    render(CreateOrganization)
    const preview = screen.getByTestId('create-organization__preview')
    expect(preview.textContent).toContain('New organization')
    await fireEvent.update(screen.getByRole('textbox', { name: 'Name' }), 'Northwind Studio')
    expect(preview.textContent).toContain('Northwind Studio')
    expect(preview.textContent).toContain('NS')
    await fireEvent.click(screen.getByRole('radio', { name: 'Globe' }))
    expect(preview.querySelector('.pi-globe')).toBeTruthy()
  })

  it('flags an empty name and a name already in use only after submit', async () => {
    render(CreateOrganization)
    const name = screen.getByRole('textbox', { name: 'Name' })
    expect(screen.queryByText('This field is required.')).toBeNull()
    await fireEvent.click(screen.getByRole('button', { name: 'Create Organization' }))
    expect(screen.getByText('This field is required.')).toBeTruthy()
    expect(name.getAttribute('aria-describedby')).toBe('create-organization-name-message')
    await fireEvent.update(name, 'acme inc.')
    expect(screen.queryByText('This field is required.')).toBeNull()
    await fireEvent.click(screen.getByRole('button', { name: 'Create Organization' }))
    expect(screen.getByText('You already belong to an organization with this name.')).toBeTruthy()
  })

  it('creates the organization and confirms it in a toast', async () => {
    render(CreateOrganization)
    await fireEvent.update(screen.getByRole('textbox', { name: 'Name' }), 'Northwind Studio')
    await fireEvent.click(screen.getByRole('button', { name: 'Create Organization' }))
    await waitFor(() => expect(screen.getByText('Northwind Studio created.')).toBeTruthy(), wait)
  })
})
