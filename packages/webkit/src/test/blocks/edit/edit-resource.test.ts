import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import EditResource from '../../../../blocks/edit/edit-resource/edit-resource.vue'
import CacheSettings from '../../../../blocks/edit/edit-resource/variants/cache-settings.vue'
import DangerZone from '../../../../blocks/edit/edit-resource/variants/danger-zone.vue'
import Protocols from '../../../../blocks/edit/edit-resource/variants/protocols.vue'
import StaleRecord from '../../../../blocks/edit/edit-resource/variants/stale-record.vue'
import WafSettings from '../../../../blocks/edit/edit-resource/variants/waf-settings.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const wait = { timeout: 4000 }

const restoreOnline = () =>
  Object.defineProperty(globalThis.navigator, 'onLine', { configurable: true, value: true })

afterEach(() => {
  restoreOnline()
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})

afterEach(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})
describe('edit-resource locked modules', () => {
  it.each([
    ['primary', EditResource],
    ['StaleRecord', StaleRecord],
    ['DangerZone', DangerZone]
  ])('%s links Contact sales as an in-sentence text-link in a new tab', (_name, block) => {
    const view = render(block)
    const links = Array.from(
      view.container.querySelectorAll<HTMLAnchorElement>(
        'a[href="https://example.com/contact-sales"]'
      )
    )
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(link.target).toBe('_blank')
      expect(link.rel).toContain('noopener')
    }
  })
})

describe('edit-resource#WafSettings', () => {
  it('disables a threat sensitivity while the threat is off, without axe findings', async () => {
    const view = render(WafSettings)
    const sensitivity = screen.getByRole('combobox', { name: 'File upload sensitivity' })
    expect(sensitivity.hasAttribute('disabled')).toBe(true)
    await fireEvent.click(screen.getByRole('switch', { name: 'File upload' }))
    expect(
      screen.getByRole('combobox', { name: 'File upload sensitivity' }).hasAttribute('disabled')
    ).toBe(false)
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('raises the save bar on a change and confirms the save in a toast', async () => {
    render(WafSettings)
    expect(screen.queryByRole('button', { name: 'Save' })).toBeNull()
    await fireEvent.click(screen.getByRole('switch', { name: 'SQL injection' }))
    await fireEvent.click(await screen.findByRole('button', { name: 'Save' }))
    await waitFor(() => expect(screen.getByText('Rule set saved.')).toBeTruthy(), wait)
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Discard' })).toBeNull())
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
