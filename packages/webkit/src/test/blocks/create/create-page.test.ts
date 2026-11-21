import { fireEvent, render, screen, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { type Component, createApp, nextTick } from 'vue'

import SinglePageCreate from '../../../../blocks/create/create-page/create-page.vue'
import CreateOrganization from '../../../../blocks/create/create-page/variants/create-organization.vue'
import CreatePurge from '../../../../blocks/create/create-page/variants/create-purge.vue'
import CreateService from '../../../../blocks/create/create-page/variants/create-service.vue'
import CreateZone from '../../../../blocks/create/create-page/variants/create-zone.vue'
import { expectNoA11yViolations } from '../../axe'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const wait = { timeout: 4000 }

afterEach(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})

const recordRows = () =>
  within(screen.getByRole('list', { name: 'Imported records' })).queryAllByRole('listitem')
describe('create-page', () => {
  it('emits submit with the trimmed values, and offers no inert Import', async () => {
    const view = render(SinglePageCreate)
    expect(screen.queryByRole('button', { name: 'Import' })).toBeNull()
    await fireEvent.update(screen.getByRole('textbox', { name: 'Name' }), ' acme-domain ')
    await fireEvent.update(screen.getByRole('textbox', { name: 'Domain name' }), 'example.com')
    await fireEvent.click(screen.getByRole('button', { name: 'Save' }))
    const [event, values] = view.emitted<unknown[]>('submit')?.[0] ?? []
    expect(event).toBeInstanceOf(Event)
    expect(values).toEqual({
      name: 'acme-domain',
      domain: 'example.com',
      dnssec: false,
      active: true,
      tags: []
    })
  })

  it('starts from the values it is given, locks while loading and shows the error', async () => {
    const view = render(SinglePageCreate, {
      props: { defaultValues: { name: 'docs-site', domain: 'example.org' }, loading: true }
    })
    expect((screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement).value).toBe(
      'docs-site'
    )
    const save = screen.getByRole('button', { name: 'Save' })
    expect(save.getAttribute('aria-busy')).toBe('true')
    await fireEvent.click(save)
    expect(view.emitted<unknown[]>('submit')).toBeUndefined()
    await view.rerender({ loading: false, error: 'The service did not answer.' })
    await waitFor(() => expect(screen.getByText('The service did not answer.')).toBeTruthy(), wait)
  })

  it('leaves at once on Cancel while the form is clean', async () => {
    const view = render(SinglePageCreate)
    await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    await waitFor(() => expect(view.emitted('cancel')).toHaveLength(1), wait)
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('asks before Cancel or Back discards typed input, and keeps it on Keep editing', async () => {
    const view = render(SinglePageCreate)
    const name = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement
    await fireEvent.update(name, 'acme-domain')
    await fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    const confirm = await screen.findByRole('alertdialog')
    expect(confirm.textContent).toContain('Unsaved changes')
    await fireEvent.click(within(confirm).getByRole('button', { name: 'Keep editing' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull(), wait)
    expect(view.emitted('cancel')).toBeUndefined()
    expect(name.value).toBe('acme-domain')
    await fireEvent.click(screen.getByRole('button', { name: 'Back to Domains' }))
    const again = await screen.findByRole('alertdialog')
    await fireEvent.click(within(again).getByRole('button', { name: 'Discard changes' }))
    await waitFor(() => expect(view.emitted('cancel')).toHaveLength(1), wait)
  })

  it('leaves at once on Escape while the form is clean, like Cancel', async () => {
    const view = render(SinglePageCreate)
    screen.getByRole('textbox', { name: 'Name' }).focus()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(view.emitted('cancel')).toHaveLength(1), wait)
    const [event] = view.emitted<unknown[]>('cancel')?.[0] ?? []
    expect(event).toBeInstanceOf(KeyboardEvent)
    expect(screen.queryByRole('alertdialog')).toBeNull()
  })

  it('asks before Escape discards typed input; Escape on the alert keeps editing', async () => {
    const view = render(SinglePageCreate)
    const name = screen.getByRole('textbox', { name: 'Name' }) as HTMLInputElement
    await fireEvent.update(name, 'acme-domain')
    name.focus()
    await userEvent.keyboard('{Escape}')
    const confirm = await screen.findByRole('alertdialog')
    expect(confirm.textContent).toContain('Unsaved changes')
    await fireEvent.click(within(confirm).getByRole('button', { name: 'Keep editing' }))
    await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull(), wait)
    expect(view.emitted('cancel')).toBeUndefined()
    expect(name.value).toBe('acme-domain')
    await userEvent.keyboard('{Escape}')
    const again = await screen.findByRole('alertdialog')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(again.isConnected && again.checkVisibility()).toBe(false), wait)
    expect(view.emitted('cancel')).toBeUndefined()
    await userEvent.keyboard('{Escape}')
    const last = await screen.findByRole('alertdialog')
    await fireEvent.click(within(last).getByRole('button', { name: 'Discard changes' }))
    await waitFor(() => expect(view.emitted('cancel')).toHaveLength(1), wait)
  })

  it('stays inert on Escape while a create request is in flight', async () => {
    const view = render(SinglePageCreate, { props: { loading: true } })
    await userEvent.keyboard('{Escape}')
    expect(view.emitted('cancel')).toBeUndefined()
  })

  it('gives Create Service a page heading and one h2 per group', () => {
    render(CreateService)
    expect(screen.getByRole('heading', { level: 1, name: 'Create Service' })).toBeTruthy()
    expect(screen.getByRole('heading', { level: 2, name: 'General' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Back to Services' })).toBeTruthy()
  })

  it('sets the purge list in the monospace face through the Textarea prop', () => {
    render(CreatePurge)
    const list = screen.getByRole('textbox', { name: /list$/ })
    expect(list.closest('[data-monospace]')).toBeTruthy()
  })
})

describe('create-page#CreateZone', () => {
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

  it('offers Undo after a Remove and after Discard import, and puts the records back', async () => {
    render(CreateZone)
    await fireEvent.click(screen.getByRole('button', { name: 'Remove CNAME record www' }))
    expect(recordRows()).toHaveLength(4)
    const removed = (await screen.findByText('CNAME record www removed.', {}, wait)).closest(
      '[data-toast-id]'
    ) as HTMLElement
    await fireEvent.click(within(removed).getByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(recordRows()).toHaveLength(5))
    await fireEvent.click(screen.getByRole('button', { name: 'Discard import' }))
    expect(screen.queryByRole('list', { name: 'Imported records' })).toBeNull()
    const discarded = (await screen.findByText('5 imported records discarded.', {}, wait)).closest(
      '[data-toast-id]'
    ) as HTMLElement
    await fireEvent.click(within(discarded).getByRole('button', { name: 'Undo' }))
    await waitFor(() => expect(recordRows()).toHaveLength(5))
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

describe('create-page#CreateOrganization', () => {
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
    await waitFor(() => expect(fill()).toMatch(/--(primary|warning|brand-blue)\b/), wait)
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

  it('closes an open Select on Escape without leaving the page', async () => {
    render(CreateOrganization)
    await fireEvent.update(screen.getByRole('textbox', { name: 'Name' }), 'Northwind Studio')
    await fireEvent.click(screen.getByRole('button', { name: /Advanced/ }))
    const trigger = await screen.findByRole('combobox', { name: 'Company size' })
    await userEvent.click(trigger)
    await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'), wait)
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('false'), wait)
    expect(screen.queryByRole('alertdialog')).toBeNull()
    await userEvent.keyboard('{Escape}')
    expect(await screen.findByRole('alertdialog')).toBeTruthy()
  })

  it('creates the organization and confirms it in a toast', async () => {
    render(CreateOrganization)
    await fireEvent.update(screen.getByRole('textbox', { name: 'Name' }), 'Northwind Studio')
    await fireEvent.click(screen.getByRole('button', { name: 'Create Organization' }))
    await waitFor(() => expect(screen.getByText('Northwind Studio created.')).toBeTruthy(), wait)
  })
})

const apple = /mac/i.test(navigator.platform || navigator.userAgent)

const mountAttached = (component: Component, props: Record<string, unknown> = {}) => {
  const host = document.body.appendChild(document.createElement('div'))
  const app = createApp(component, props)
  app.mount(host)
  return () => {
    app.unmount()
    host.remove()
  }
}

const pressSubmitShortcut = (target: Element) =>
  target.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Enter',
      metaKey: apple,
      ctrlKey: !apple,
      bubbles: true,
      cancelable: true
    })
  )

describe('create-page keyboard', () => {
  it('opens with the cursor in Name and submits with Cmd or Ctrl Enter from a field', async () => {
    const onSubmit = vi.fn()
    const unmount = mountAttached(SinglePageCreate, { onSubmit })
    try {
      const name = screen.getByRole('textbox', { name: 'Name' })
      await waitFor(() => expect(document.activeElement).toBe(name), wait)
      const save = screen.getByRole('button', { name: 'Save' })
      expect(save.getAttribute('aria-keyshortcuts')).toBe('Meta+Enter Control+Enter')
      await fireEvent.update(name, 'acme-domain')
      await fireEvent.update(screen.getByRole('textbox', { name: 'Domain name' }), 'example.com')
      pressSubmitShortcut(name)
      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1), wait)
      const [event, values] = onSubmit.mock.calls[0] ?? []
      expect(event).toBeInstanceOf(Event)
      expect(values).toEqual({
        name: 'acme-domain',
        domain: 'example.com',
        dnssec: false,
        active: true,
        tags: []
      })
    } finally {
      unmount()
    }
  })

  it('ignores the shortcut while the create request is in flight', async () => {
    const view = render(SinglePageCreate, {
      props: { defaultValues: { name: 'acme-domain', domain: 'example.com' }, loading: true }
    })
    pressSubmitShortcut(document.body)
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(view.emitted('submit')).toBeUndefined()
  })

  it('opens CreateService and CreateZone in Name', async () => {
    for (const page of [CreateService, CreateZone]) {
      const unmount = mountAttached(page)
      try {
        await waitFor(
          () => expect(document.activeElement).toBe(screen.getByRole('textbox', { name: 'Name' })),
          wait
        )
      } finally {
        unmount()
      }
    }
  })

  it('opens CreatePurge on the chosen layer; Enter in the list adds a line, the shortcut purges', async () => {
    const unmount = mountAttached(CreatePurge)
    try {
      await waitFor(() => {
        const active = document.activeElement as HTMLInputElement | null
        expect(active?.name).toBe('purge-layer')
        expect(active?.checked).toBe(true)
      }, wait)
      const purge = screen.getByRole('button', { name: 'Purge' })
      expect(purge.getAttribute('aria-keyshortcuts')).toBe('Meta+Enter Control+Enter')
      const list = screen.getByRole('textbox', { name: /list$/ }) as HTMLTextAreaElement
      await userEvent.click(list)
      await userEvent.keyboard('example.com/a{Enter}example.com/b')
      expect(list.value).toBe('example.com/a\nexample.com/b')
      expect(purge.getAttribute('aria-busy')).not.toBe('true')
      pressSubmitShortcut(list)
      await waitFor(() => expect(purge.getAttribute('aria-busy')).toBe('true'), wait)
      await waitFor(
        () => expect(screen.getByText('Purge started for 2 entries.')).toBeTruthy(),
        wait
      )
    } finally {
      unmount()
    }
  })

  it('creates the organization with the shortcut', async () => {
    const unmount = mountAttached(CreateOrganization)
    try {
      const name = screen.getByRole('textbox', { name: 'Name' })
      await waitFor(() => expect(document.activeElement).toBe(name), wait)
      await fireEvent.update(name, 'Northwind Studio')
      pressSubmitShortcut(name)
      await waitFor(() => expect(screen.getByText('Northwind Studio created.')).toBeTruthy(), wait)
    } finally {
      unmount()
    }
  })
})
