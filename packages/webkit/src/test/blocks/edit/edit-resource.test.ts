import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import EditResource from '../../../../blocks/edit/edit-resource/edit-resource.vue'
import CacheSettings from '../../../../blocks/edit/edit-resource/variants/cache-settings.vue'
import DangerZone from '../../../../blocks/edit/edit-resource/variants/danger-zone.vue'
import DataStream from '../../../../blocks/edit/edit-resource/variants/data-stream.vue'
import DeployableSettings from '../../../../blocks/edit/edit-resource/variants/deployable-settings.vue'
import PolicySettings from '../../../../blocks/edit/edit-resource/variants/policy-settings.vue'
import Protocols from '../../../../blocks/edit/edit-resource/variants/protocols.vue'
import ResourceSettings from '../../../../blocks/edit/edit-resource/variants/resource-settings.vue'
import Saving from '../../../../blocks/edit/edit-resource/variants/saving.vue'
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
describe('edit-resource#ResourceSettings list', () => {
  it('types addresses in the code face and keeps the --LT syntax on one line', async () => {
    render(ResourceSettings)
    const list = await screen.findByRole('textbox', { name: 'List' })
    expect(list.getAttribute('data-monospace')).not.toBeNull()
    const syntax = Array.from(document.querySelectorAll('code')).find(
      (code) => code.textContent === '--LT'
    )
    expect(syntax?.classList.contains('whitespace-nowrap')).toBe(true)
  })
})

describe('edit-resource locked modules', () => {
  it.each([
    ['primary', EditResource],
    ['StaleRecord', StaleRecord],
    ['DangerZone', DangerZone]
  ])('%s links Contact sales beside the locked switch in a new tab', (_name, block) => {
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

describe('edit-resource#StaleRecord', () => {
  const button = (label: string) =>
    Array.from(document.querySelectorAll('button')).find((el) => {
      const copy = el.cloneNode(true) as HTMLElement
      copy.querySelectorAll('[aria-hidden="true"]').forEach((node) => node.remove())
      return copy.textContent?.trim() === label
    }) as HTMLButtonElement | undefined

  it('asks before Save overwrites the version saved elsewhere, then saves', async () => {
    const view = render(StaleRecord)
    expect(view.getByTestId('stale-record-notice').textContent).toContain('Changed elsewhere.')
    const save = await waitFor(() => {
      expect(button('Save')).toBeDefined()
      return button('Save')!
    })
    await fireEvent.click(save)
    const dialog = await waitFor(() => {
      const el = document.body.querySelector<HTMLElement>('[role=alertdialog]')
      expect(el).not.toBeNull()
      return el!
    })
    expect(dialog.textContent).toContain('Overwrite changes made elsewhere?')
    await fireEvent.click(
      Array.from(dialog.querySelectorAll('button')).find(
        (el) => el.textContent?.trim() === 'Overwrite and save'
      )!
    )
    await waitFor(() => expect(view.queryByTestId('stale-record-notice')).toBeNull(), wait)
    await waitFor(() => expect(button('Save')).toBeUndefined(), wait)
  })

  it('reloads the saved values and brings the edits back on Undo', async () => {
    const view = render(StaleRecord)
    const detection = () =>
      view.getByRole('switch', { name: 'Device Detection' }).getAttribute('aria-checked')
    expect(detection()).toBe('true')
    await fireEvent.click(button('Reload')!)
    await waitFor(() => expect(view.getByTestId('stale-record-reloaded')).toBeTruthy())
    expect(detection()).toBe('false')
    expect(
      view.getByRole('switch', { name: 'Image Optimization' }).getAttribute('aria-checked')
    ).toBe('true')
    await fireEvent.click(button('Undo')!)
    await waitFor(() => expect(detection()).toBe('true'))
    expect(view.getByTestId('stale-record-notice')).toBeTruthy()
  })

  it('leaves the default page without the notice', () => {
    const view = render(EditResource)
    expect(view.queryByTestId('stale-record-notice')).toBeNull()
  })
})

describe('edit-resource#DangerZone', () => {
  it('ends the page with the Danger zone and asks for the name before deleting', async () => {
    const view = render(DangerZone)
    await fireEvent.click(view.getByTestId('danger-zone-delete'))
    const dialog = await waitFor(() => {
      const el = document.body.querySelector<HTMLElement>('[role=alertdialog]')
      expect(el).not.toBeNull()
      return el!
    })
    const confirm = Array.from(dialog.querySelectorAll('button')).find(
      (el) => el.textContent?.trim() === 'Delete project'
    )!
    expect(confirm.hasAttribute('disabled')).toBe(true)
    await fireEvent.update(dialog.querySelector('input')!, 'web-app')
    await waitFor(() => expect(confirm.hasAttribute('disabled')).toBe(false))
  })
})

describe('edit-resource#Saving', () => {
  it('locks every field while the save is in flight', async () => {
    render(Saving)
    const name = (await screen.findByRole('textbox', { name: 'Name' })) as HTMLInputElement
    expect(name.disabled).toBe(true)
    for (const toggle of screen.getAllByRole('switch')) {
      expect(toggle.matches(':disabled')).toBe(true)
    }
    expect(screen.getByRole('button', { name: 'Discard' })).toBeDisabled()
    expect(screen.getByTestId('settings-save-bar__saving').textContent).toBe('Saving changes…')
    expect(document.body.textContent).not.toContain('You have unsaved changes.')
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
    expect(ttl.getAttribute('aria-describedby')).toBe(
      'cache-edgeMaxAge-duration cache-edgeMaxAge-message'
    )
  })

  it('reads each TTL as a duration beside the seconds', async () => {
    const view = render(CacheSettings)
    expect(view.getByTestId('cache-settings__browser-duration').textContent?.trim()).toBe('7 days')
    expect(view.getByTestId('cache-settings__edge-duration').textContent?.trim()).toBe('30 days')
    expect(view.getByText('Up to 1 year (31,536,000 seconds).')).toBeTruthy()
    const ttl = screen.getByRole('spinbutton', { name: 'Edge maximum TTL in seconds' })
    await fireEvent.update(ttl, '31536000')
    await fireEvent.blur(ttl)
    await waitFor(() =>
      expect(view.getByTestId('cache-settings__edge-duration').textContent?.trim()).toBe('1 year')
    )
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

describe('edit-resource data contract', () => {
  const given = {
    name: 'acme-store',
    active: false,
    modules: {
      compression: false,
      caching: true,
      device_detection: false,
      custom_code: false,
      image_optimization: true,
      load_balancing: false,
      web_socket_proxy: false
    }
  }

  it('opens on the resource it is given instead of the sample', () => {
    render(EditResource, { props: { resource: given } })
    expect((document.getElementById('resource-name') as HTMLInputElement).value).toBe('acme-store')
  })

  it('emits submit with the edited values and discard', async () => {
    const { emitted } = render(EditResource, { props: { resource: given, loading: false } })
    const name = document.getElementById('resource-name') as HTMLInputElement
    await fireEvent.update(name, 'acme-shop')
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeTruthy())
    await fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    const [[event, values]] = emitted().submit as [[Event, typeof given]]
    expect(event).toBeInstanceOf(Event)
    expect(values).toEqual({ ...given, name: 'acme-shop' })
  })

  it('raises the error toast with Retry when the save ends with an error', async () => {
    const { rerender } = render(EditResource, { props: { resource: given, loading: true } })
    await rerender({ resource: given, loading: false, error: 'Check your connection.' })
    await waitFor(
      () => expect(document.body.textContent).toContain("The project settings weren't saved."),
      wait
    )
  })
})

const apple = /mac/i.test(navigator.platform || navigator.userAgent)
const pressShortcut = (key: string, target: Element = document.body) => {
  const event = new KeyboardEvent('keydown', {
    key,
    metaKey: apple,
    ctrlKey: !apple,
    bubbles: true,
    cancelable: true
  })
  target.dispatchEvent(event)
  return event
}

describe('edit-resource save shortcut', () => {
  it('saves on Command S only while the form has changes, and labels Save with the keys', async () => {
    const { emitted } = render(EditResource)
    const clean = pressShortcut('s')
    expect(clean.defaultPrevented).toBe(false)
    expect(emitted().submit).toBeUndefined()
    const name = document.getElementById('resource-name') as HTMLInputElement
    await fireEvent.update(name, 'acme-shop')
    const save = await waitFor(() => screen.getByRole('button', { name: 'Save' }))
    expect(save.getAttribute('aria-keyshortcuts')).toBe('Meta+S Control+S')
    expect(save.querySelector('[data-testid="kbd"]')?.getAttribute('aria-hidden')).toBe('true')
    name.focus()
    const event = pressShortcut('s', name)
    expect(event.defaultPrevented).toBe(true)
    const submits = emitted().submit as [Event, { name: string }][]
    expect(submits).toHaveLength(1)
    expect(submits[0]![0]).toBe(event)
    expect(submits[0]![1].name).toBe('acme-shop')
  })
})

describe('edit/edit-resource DataStream', () => {
  it('edits Custom headers as rows and keeps a credential value masked', async () => {
    render(DataStream)
    const editor = await waitFor(() => {
      const field = document.querySelector<HTMLElement>('#data-stream-headers')
      expect(field).not.toBeNull()
      return field!
    })
    const values = Array.from(
      editor.querySelectorAll<HTMLInputElement>('input:not([type="hidden"])')
    ).map((input) => [input.type, input.value])
    expect(values).toEqual([
      ['text', 'X-Stream-Source'],
      ['text', 'acme-edge'],
      ['text', 'Authorization'],
      ['password', 'Bearer example-token']
    ])
    expect(within(editor).getAllByRole('button', { name: /Show/ })).toHaveLength(1)
    await expectNoA11yViolations(editor)
  })

  it('says a locked module is always on, so it never reads as switched off', () => {
    const view = render(PolicySettings)
    const ddos = view.getByRole('switch', { name: 'DDoS Protection' })
    expect(ddos.getAttribute('aria-checked')).toBe('true')
    expect(ddos.getAttribute('aria-readonly')).toBe('true')
    expect(ddos.matches(':disabled')).toBe(false)
    expect(view.getByText(/Always on for every policy\./)).toBeTruthy()
  })

  it('names the header cell that is missing before it saves', async () => {
    render(DataStream)
    const editor = await waitFor(() => document.querySelector<HTMLElement>('#data-stream-headers')!)
    await fireEvent.click(within(editor).getByRole('button', { name: 'Add header' }))
    await fireEvent.click(await screen.findByRole('button', { name: 'Save' }, wait))
    await waitFor(() => expect(editor.textContent).toContain('Enter a value.'))
    expect(editor.textContent).toContain('Enter a header name of letters, numbers and hyphens.')
    await waitFor(() => expect(document.activeElement?.getAttribute('aria-invalid')).toBe('true'))
    expect(editor.contains(document.activeElement)).toBe(true)
  })
})

describe('edit/edit-resource leave guard', () => {
  const reloadBlocked = () => {
    const event = new Event('beforeunload', { cancelable: true })
    window.dispatchEvent(event)
    return event.defaultPrevented
  }

  it.each([
    ['DeployableSettings', DeployableSettings],
    ['PolicySettings', PolicySettings],
    ['WafSettings', WafSettings],
    ['ResourceSettings', ResourceSettings],
    ['DataStream', DataStream],
    ['CacheSettings', CacheSettings],
    ['Protocols', Protocols]
  ])('%s warns on reload once the form holds edits', async (_name, variant) => {
    const view = render(variant)
    const control = await waitFor(() => {
      const found = view.container.querySelector<HTMLElement>(
        'input:not([type]):not([disabled]), input[type="text"]:not([disabled]), [role="switch"]:not([disabled])'
      )
      expect(found).not.toBeNull()
      return found!
    })
    expect(reloadBlocked()).toBe(false)
    if (control instanceof HTMLInputElement) await fireEvent.update(control, `${control.value}x`)
    else await fireEvent.click(control)
    await waitFor(() => expect(reloadBlocked()).toBe(true))
    view.unmount()
  })

  it('asks before a tab change drops the edits', async () => {
    const view = render(PolicySettings)
    const field = await waitFor(() =>
      view.container.querySelector<HTMLInputElement>('#resource-name')!
    )
    await fireEvent.update(field, `${field.value}x`)
    const other = Array.from(view.container.querySelectorAll<HTMLElement>('[role="tab"]')).find(
      (tab) => tab.getAttribute('aria-selected') !== 'true'
    )!
    await fireEvent.click(other)
    await waitFor(() =>
      expect(document.querySelector('[data-testid="unsaved-changes-dialog"]')).not.toBeNull()
    )
  })
})
