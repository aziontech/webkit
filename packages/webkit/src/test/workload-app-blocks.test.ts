import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Review from '../../blocks/platform/create/multipage-create/variants/review.vue'
import Application from '../../blocks/platform/detail/details-page/variants/application.vue'
import ImportZoneFile from '../../blocks/platform/detail/record-table/variants/import-zone-file.vue'
import EnvironmentCrumb from '../../blocks/platform/detail/version-detail/variants/environment-crumb.vue'
import CacheSettings from '../../blocks/platform/edit/edit-resource/variants/cache-settings.vue'
import Protocols from '../../blocks/platform/edit/edit-resource/variants/protocols.vue'
import { expectNoA11yViolations } from './axe'

const wait = { timeout: 4000 }

afterEach(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})

describe('details-page#Application', () => {
  it('switches to the Topology tab and draws the diagram without axe findings', async () => {
    render(Application)
    await fireEvent.click(screen.getByRole('tab', { name: 'Topology' }))
    expect(await screen.findByRole('heading', { name: 'Deployment topology' })).toBeTruthy()
    expect(screen.getByText('shop.example.com')).toBeTruthy()
    expect(screen.getByText('edge-guard')).toBeTruthy()
    await expectNoA11yViolations(document.body)
  })

  it('deploys from the drawer and reports with Edit and Redeploy', async () => {
    render(Application)
    await fireEvent.click(screen.getByRole('button', { name: 'Deploy' }))
    const drawer = await screen.findByRole('dialog', { name: 'Deploy storefront-app' })
    expect(within(drawer).getByText(/No topology change is staged/)).toBeTruthy()
    await fireEvent.click(within(drawer).getByRole('button', { name: 'Deploy' }))
    await waitFor(() => expect(screen.getByText('storefront-app is live.')).toBeTruthy(), wait)
    expect(screen.getByRole('button', { name: 'Edit' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Redeploy' })).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(screen.getByRole('tab', { name: 'Topology' }).getAttribute('aria-selected')).toBe('true')
  })
})

describe('edit-resource#CacheSettings', () => {
  it('rejects an edge TTL under 60 seconds and focuses the field', async () => {
    render(CacheSettings)
    const ttl = screen.getByRole('spinbutton', { name: 'Edge maximum TTL in seconds' })
    await fireEvent.update(ttl, '30')
    await fireEvent.blur(ttl)
    await fireEvent.click(await screen.findByRole('button', { name: 'Save' }))
    expect(
      await screen.findByText('The edge keeps an object for at least 60 seconds.')
    ).toBeTruthy()
    await waitFor(() => expect(document.activeElement).toBe(ttl))
    expect(ttl.getAttribute('aria-describedby')).toBe('cache-edgeMaxAge-message')
  })

  it('saves through the deploy toast with Edit and Redeploy', async () => {
    render(CacheSettings)
    await fireEvent.click(screen.getByRole('switch', { name: 'Large file optimization' }))
    await fireEvent.click(await screen.findByRole('button', { name: 'Save' }))
    await waitFor(() => expect(screen.getByText('static-assets is live.')).toBeTruthy(), wait)
    expect(screen.getByRole('button', { name: 'Redeploy' })).toBeTruthy()
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Discard' })).toBeNull())
  })
})

describe('edit-resource#Protocols', () => {
  it('keeps mutual authentication off until HTTPS is on', async () => {
    render(Protocols)
    const mtls = screen.getByRole('switch', { name: 'Mutual authentication' })
    expect(mtls.hasAttribute('disabled') || mtls.getAttribute('aria-disabled') === 'true').toBe(
      false
    )
    await fireEvent.click(screen.getByRole('switch', { name: 'HTTPS support' }))
    expect(screen.getByText('Turn on HTTPS support to use mutual authentication.')).toBeTruthy()
    expect(screen.queryByRole('combobox', { name: 'Minimum TLS version' })).toBeNull()
  })

  it('asks for a trusted CA before it saves', async () => {
    render(Protocols)
    await fireEvent.click(screen.getByRole('switch', { name: 'Mutual authentication' }))
    expect(await screen.findByText('Enforce')).toBeTruthy()
    await fireEvent.click(await screen.findByRole('button', { name: 'Save' }))
    expect(
      await screen.findByText('Mutual authentication needs a trusted CA certificate.')
    ).toBeTruthy()
    await expectNoA11yViolations(document.body)
  })
})

describe('version-detail#EnvironmentCrumb', () => {
  it('names the environment and the version crumbs', () => {
    render(EnvironmentCrumb)
    const environments = screen.getAllByRole('combobox', { name: 'Switch environment' })
    expect(environments).toHaveLength(2)
    for (const trigger of environments) expect(trigger.textContent).toContain('Production')
    expect(screen.getAllByRole('combobox', { name: 'Switch version' })).toHaveLength(2)
  })
})

describe('multipage-create#Review', () => {
  it('shows what gets created and jumps back to a step with Edit', async () => {
    render(Review)
    expect(screen.getByText('Runs on acme-production.')).toBeTruthy()
    expect(screen.getByText('7 entries')).toBeTruthy()
    expect(screen.getByText('and 2 more')).toBeTruthy()
    await fireEvent.click(screen.getByRole('button', { name: 'Edit list settings' }))
    expect(await screen.findByRole('heading', { name: 'List settings' })).toBeTruthy()
  })
})

describe('record-table#ImportZoneFile', () => {
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
    expect(within(drawer).getByRole('status').textContent).toMatch(/1 ready, 0 skipped,\s*1 error/)
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
