import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import CreateEnvironment from '../../blocks/platform/create/create-in-drawer/variants/create-environment.vue'
import FunctionInstance from '../../blocks/platform/create/create-in-drawer/variants/function-instance.vue'
import CreateOrganization from '../../blocks/platform/create/single-page-create/variants/create-organization.vue'
import CreateZone from '../../blocks/platform/create/single-page-create/variants/create-zone.vue'
import WafSettings from '../../blocks/platform/edit/edit-resource/variants/waf-settings.vue'
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
    const fill = () => preview.querySelector<SVGRectElement>('rect')?.style.fill ?? ''
    await waitFor(() => expect(fill()).toMatch(/--(text-primary|primary|warning)\b/), wait)
    await fireEvent.click(screen.getByRole('radio', { name: 'Green mark' }))
    await waitFor(() => expect(fill()).toMatch(/--success/), wait)
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

const dialogs = () => Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"]'))
const lastDialog = () => dialogs()[dialogs().length - 1] as HTMLElement

describe('create-in-drawer#CreateEnvironment', () => {
  it('reveals the allowlist and branch fields and checks them only on submit', async () => {
    render(CreateEnvironment)
    await fireEvent.click(screen.getByRole('button', { name: 'Create Environment' }))
    const drawer = await waitFor(() => {
      expect(dialogs()).toHaveLength(1)
      return lastDialog()
    })
    const panel = within(drawer)
    expect(panel.queryByRole('textbox', { name: 'IP addresses and CIDR ranges' })).toBeNull()
    await fireEvent.click(panel.getByRole('switch', { name: /IP allowlist/ }))
    const cidrs = panel.getByRole('textbox', { name: 'IP addresses and CIDR ranges' })
    await fireEvent.update(cidrs, '203.0.113.0/24\n198.51.100.300')
    await fireEvent.click(panel.getByRole('switch', { name: /Branch tracking/ }))
    expect((panel.getByRole('textbox', { name: 'Branch match' }) as HTMLInputElement).value).toBe(
      'main'
    )
    await fireEvent.update(panel.getByRole('textbox', { name: 'Name' }), 'Preview')
    expect(panel.queryByText(/Invalid IPv4 address/)).toBeNull()
    await fireEvent.click(panel.getByRole('button', { name: 'Create Environment' }))
    expect(panel.getByText('An environment with this name already exists.')).toBeTruthy()
    expect(panel.getByText('Invalid IPv4 address or CIDR range: 198.51.100.300.')).toBeTruthy()
    await expectNoA11yViolations(drawer)
  })

  it('stacks above Add Domain and selects the new environment back', async () => {
    render(CreateEnvironment)
    await fireEvent.click(screen.getByRole('button', { name: 'Add Domain' }))
    const domain = await waitFor(() => {
      expect(dialogs()).toHaveLength(1)
      return lastDialog()
    })
    await fireEvent.click(within(domain).getByRole('combobox', { name: /^Environment/ }))
    await fireEvent.click(await screen.findByRole('option', { name: 'Create Environment' }))
    const stacked = await waitFor(() => {
      expect(dialogs()).toHaveLength(2)
      return lastDialog()
    })
    await fireEvent.update(within(stacked).getByRole('textbox', { name: 'Name' }), 'Canary')
    await fireEvent.click(within(stacked).getByRole('button', { name: 'Create Environment' }))
    await waitFor(() => expect(dialogs()).toHaveLength(1), wait)
    expect(within(domain).getByRole('combobox', { name: /^Environment/ }).textContent).toContain(
      'Canary'
    )
  })
})

describe('create-in-drawer#FunctionInstance', () => {
  it('builds the argument fields from the chosen function and flags required ones after submit', async () => {
    render(FunctionInstance)
    await fireEvent.click(screen.getByRole('button', { name: 'Add Function Instance' }))
    const drawer = await waitFor(() => {
      expect(dialogs()).toHaveLength(1)
      return lastDialog()
    })
    const panel = within(drawer)
    expect(panel.queryByRole('heading', { name: /Arguments/ })).toBeNull()
    await fireEvent.click(panel.getByRole('combobox', { name: 'Function' }))
    await fireEvent.click(await screen.findByRole('option', { name: 'image-resizer' }))
    expect(panel.getByRole('heading', { name: /Arguments/ })).toBeTruthy()
    expect(panel.getByLabelText(/Width/)).toBeTruthy()
    await fireEvent.update(panel.getByRole('textbox', { name: 'Name' }), 'thumbnails')
    expect(panel.queryByText('This field is required.')).toBeNull()
    await fireEvent.click(panel.getByRole('button', { name: 'Add Function Instance' }))
    await waitFor(() => expect(panel.getByText('This field is required.')).toBeTruthy())
    await expectNoA11yViolations(drawer)
  })

  it('opens an instance to edit with its saved arguments', async () => {
    render(FunctionInstance)
    await fireEvent.click(screen.getByRole('button', { name: 'Edit resize-product-images' }))
    const drawer = await waitFor(() => {
      expect(dialogs()).toHaveLength(1)
      return lastDialog()
    })
    const panel = within(drawer)
    expect(panel.getByRole('heading', { name: 'Edit Function Instance' })).toBeTruthy()
    expect((panel.getByLabelText(/Width/) as HTMLInputElement).value).toBe('800')
    expect(panel.getByRole('radiogroup', { name: 'Arguments view' })).toBeTruthy()
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
