import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import CreateInDrawer from '../../../../blocks/create/create-drawer/create-drawer.vue'
import Certificate from '../../../../blocks/create/create-drawer/variants/certificate.vue'
import CreateEnvironment from '../../../../blocks/create/create-drawer/variants/create-environment.vue'
import FunctionInstance from '../../../../blocks/create/create-drawer/variants/function-instance.vue'
import CreateInDrawerSaveFailed from '../../../../blocks/create/create-drawer/variants/save-error.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null

const openDrawer = async (label: RegExp) => {
  const trigger = Array.from(document.querySelectorAll('button')).find((button) =>
    label.test(button.textContent ?? '')
  ) as HTMLButtonElement
  await userEvent.click(trigger)
  await waitFor(() => expect(dialog()).not.toBeNull())
  return dialog() as HTMLElement
}

const buttonIn = (root: HTMLElement, text: string) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement

const wait = { timeout: 4000 }

afterEach(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})

const dialogs = () => Array.from(document.querySelectorAll<HTMLElement>('[role="dialog"]'))

const lastDialog = () => dialogs()[dialogs().length - 1] as HTMLElement
describe('create-drawer#Certificate', () => {
  it('reads the pasted certificate and flags the missing private key only after Save', async () => {
    render(Certificate)
    const panel = await openDrawer(/Create Certificate/)
    const details = await waitFor(() => {
      const node = panel.querySelector('[data-testid="certificate-details"]')
      expect(node).not.toBeNull()
      return node as HTMLElement
    })
    expect(details.textContent).toContain('shop.example.com')
    expect(details.textContent).toContain('Example Test CA')
    expect(details.textContent).toContain('Nov 30, 2028')
    expect(panel.textContent).not.toContain('Paste the private key')
    await expectNoA11yViolations(panel)
    await fireEvent.click(buttonIn(panel, 'Save'))
    await waitFor(() =>
      expect(panel.textContent).toContain('Paste the private key that signed the certificate.')
    )
    await waitFor(() => expect(document.activeElement?.tagName).toBe('TEXTAREA'))
  })
})

describe('create-drawer', () => {
  it('marks the fields required up front and shows Field.Error alerts after an empty submit', async () => {
    render(CreateInDrawer)
    await fireEvent.click(screen.getByRole('button', { name: 'Add Domain' }))
    const dialog = await screen.findByRole('dialog')
    const domain = within(dialog).getByRole('textbox', { name: /Domain/ })
    expect(domain.hasAttribute('required')).toBe(true)
    expect(domain.getAttribute('aria-invalid')).not.toBe('true')
    await fireEvent.click(within(dialog).getByRole('button', { name: 'Add Domain' }))
    const alerts = await within(dialog).findAllByRole('alert')
    expect(alerts.length).toBe(2)
    expect(domain.getAttribute('aria-invalid')).toBe('true')
  })

  it('emits the values on a valid save and closes when the page sets open', async () => {
    const view = render(CreateInDrawer, {
      props: { open: true, 'onUpdate:open': () => undefined }
    })
    const dialog = await screen.findByRole('dialog')
    await fireEvent.update(within(dialog).getByRole('textbox', { name: /Domain/ }), 'acme-store')
    await fireEvent.click(within(dialog).getByRole('combobox', { name: /Environment/ }))
    await fireEvent.click(await screen.findByRole('option', { name: 'Production' }))
    await fireEvent.click(within(dialog).getByRole('button', { name: 'Add Domain' }))
    const submits = view.emitted('submit') as [Event, Record<string, string>][]
    expect(submits).toHaveLength(1)
    expect(submits[0][0]).toBeInstanceOf(Event)
    expect(submits[0][1]).toEqual({
      kind: 'free',
      domain: 'acme-store',
      environment: 'Production',
      certificate: '',
      host: 'acme-store.azion.app'
    })
    expect(dialog.isConnected).toBe(true)
    await view.rerender({ open: false })
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull(), wait)
  })

  it('lists the environments it is given instead of the sample', async () => {
    render(CreateInDrawer, {
      props: {
        defaultOpen: true,
        environments: [{ value: 'Canary', label: 'Canary', deploymentPolicy: 'versioned_urls' }]
      }
    })
    const dialog = await screen.findByRole('dialog')
    await fireEvent.click(within(dialog).getByRole('combobox', { name: /Environment/ }))
    expect(await screen.findByRole('option', { name: 'Canary' })).toBeTruthy()
    expect(screen.queryByRole('option', { name: 'Production' })).toBeNull()
  })

  it('keeps the values after a failed save and retries from the alert', async () => {
    const view = render(CreateInDrawerSaveFailed)
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText(/wasn't added/)).toBeTruthy()
    expect(
      (within(dialog).getByRole('textbox', { name: /Domain/ }) as HTMLInputElement).value
    ).toBe('acme-store')
    await expectNoA11yViolations(view.baseElement as HTMLElement)
  })

  it('emits submit again from Retry in the error alert', async () => {
    const view = render(CreateInDrawer, {
      props: {
        defaultOpen: true,
        defaultValues: { domain: 'acme-store', environment: 'Production' },
        error: "acme-store.azion.app wasn't added."
      }
    })
    const dialog = await screen.findByRole('dialog')
    await fireEvent.click(within(dialog).getByRole('button', { name: 'Retry' }))
    const submits = view.emitted('submit') as [Event, { host: string }][]
    expect(submits).toHaveLength(1)
    expect(submits[0][1].host).toBe('acme-store.azion.app')
  })

  it('locks the form while loading and does not emit', async () => {
    const view = render(CreateInDrawer, {
      props: {
        defaultOpen: true,
        loading: true,
        defaultValues: { domain: 'acme-store', environment: 'Production' }
      }
    })
    const dialog = await screen.findByRole('dialog')
    expect(dialog.querySelector('fieldset')?.disabled).toBe(true)
    dialog.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true }))
    expect(view.emitted('submit')).toBeUndefined()
  })
})

describe('create-drawer#CreateEnvironment', () => {
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
    expect((panel.getByRole('textbox', { name: /^Branch match\b/ }) as HTMLInputElement).value).toBe(
      'main'
    )
    await fireEvent.update(panel.getByRole('textbox', { name: /^Name\b/ }), 'Preview')
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
    await fireEvent.update(within(stacked).getByRole('textbox', { name: /^Name\b/ }), 'Canary')
    await fireEvent.click(within(stacked).getByRole('button', { name: 'Create Environment' }))
    await waitFor(() => expect(dialogs()).toHaveLength(1), wait)
    expect(within(domain).getByRole('combobox', { name: /^Environment/ }).textContent).toContain(
      'Canary'
    )
  })
})

describe('create-drawer#FunctionInstance', () => {
  it('builds the argument fields from the chosen function and flags required ones after submit', async () => {
    render(FunctionInstance)
    await fireEvent.click(screen.getByRole('button', { name: 'Add Function Instance' }))
    const drawer = await waitFor(() => {
      expect(dialogs()).toHaveLength(1)
      return lastDialog()
    })
    const panel = within(drawer)
    expect(panel.queryByRole('heading', { name: /Arguments/ })).toBeNull()
    await fireEvent.click(panel.getByRole('combobox', { name: /^Function\b/ }))
    await fireEvent.click(await screen.findByRole('option', { name: 'image-resizer' }))
    expect(panel.getByRole('heading', { name: /Arguments/ })).toBeTruthy()
    expect(panel.getByLabelText(/Width/)).toBeTruthy()
    await fireEvent.update(panel.getByRole('textbox', { name: /^Name\b/ }), 'thumbnails')
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
