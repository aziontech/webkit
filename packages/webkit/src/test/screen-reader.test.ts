// Screen-reader smoke: what assistive technology reads for each overlay once open and for the
// form blocks, pinned as Playwright accessibility-tree snapshots (`locator.ariaSnapshot()`
// through the `ariaSnapshot` browser command). Axe checks rules; these snapshots pin the
// result: roles, names, states and order. A change here is reviewed like a visual diff.
import './reflow.css'

import { cleanup, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { commands, userEvent } from 'vitest/browser'
import type { Component } from 'vue'
import { nextTick } from 'vue'

import SinglePageCreate from '../../blocks/platform/create/single-page-create/single-page-create.vue'
import FormErrorRejected from '../../blocks/platform/states/form-error/variants/rejected.vue'
import CommandDefault from '../../examples/command/default.vue'
import DialogDefault from '../../examples/dialog/default.vue'
import DrawerDefault from '../../examples/drawer/default.vue'
import DropdownMenuDefault from '../../examples/dropdown-menu/default.vue'
import MultiSelectDefault from '../../examples/multi-select/default.vue'
import NavigationMenuDefault from '../../examples/navigation-menu/default.vue'
import PopoverDefault from '../../examples/popover/default.vue'
import SelectDefault from '../../examples/select/default.vue'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

const settle = async () => {
  await nextTick()
  for (let i = 0; i < 4; i += 1) await frame()
  await new Promise((resolve) => setTimeout(resolve, 150))
}

async function openAndRead(
  component: Component,
  opener: () => HTMLElement,
  scope: string
): Promise<string> {
  render(component)
  await settle()
  await userEvent.click(opener())
  await settle()
  return commands.ariaSnapshot(scope)
}

const byRole = (role: string, name?: string | RegExp): HTMLElement => {
  const nodes = [...document.querySelectorAll<HTMLElement>(`[role="${role}"], ${role}`)]
  const match = nodes.find((node) => {
    if (name === undefined) return true
    const label = node.getAttribute('aria-label') ?? node.textContent ?? ''
    return typeof name === 'string' ? label.trim() === name : name.test(label)
  })
  if (!match) throw new Error(`no ${role} named ${String(name)}`)
  return match
}

const button = (name: string): HTMLElement =>
  [...document.querySelectorAll<HTMLElement>('button')].find(
    (node) => (node.getAttribute('aria-label') ?? node.textContent ?? '').trim() === name
  ) ?? byRole('button', name)

afterEach(() => cleanup())

describe('screen-reader smoke · overlays', () => {
  it('Dialog', async () => {
    const snapshot = await openAndRead(
      DialogDefault,
      () => button('Open dialog'),
      '[role="dialog"]'
    )
    expect(snapshot).toMatchInlineSnapshot(`
      "- dialog "Dialog Title":
        - heading "Dialog Title" [level=2]
        - button "Close"
        - paragraph: Modal content. Uses the shared Panel header, body, and footer regions.
        - button "Cancel"
        - button "Save""
    `)
  })

  it('Drawer', async () => {
    const snapshot = await openAndRead(
      DrawerDefault,
      () => button('Open drawer'),
      '[role="dialog"]'
    )
    expect(snapshot).toMatchInlineSnapshot(`
      "- dialog "Drawer Title":
        - heading "Drawer Title" [level=2]
        - button "Close"
        - paragraph: Side panel content. Uses the same Panel header, body, and footer regions as Dialog.
        - button "Cancel"
        - button "Save""
    `)
  })

  it('Popover', async () => {
    const snapshot = await openAndRead(
      PopoverDefault,
      () => button('Open popover'),
      '[role="dialog"]'
    )
    expect(snapshot).toMatchInlineSnapshot(`
      "- dialog "Popover title":
        - heading "Popover title" [level=2]
        - button "Close"
        - text: This content is rendered inside the popover panel."
    `)
  })

  it('DropdownMenu', async () => {
    const snapshot = await openAndRead(
      DropdownMenuDefault,
      () => button('Open menu'),
      '[role="menu"]'
    )
    expect(snapshot).toMatchInlineSnapshot(`
      "- menu "Open menu":
        - group:
          - menuitem "Profile"
          - menuitem "Settings"
          - menuitem "Billing"
          - menuitem "Invite members"
          - menuitem "Audit log"
          - menuitem "Sign out""
    `)
  })

  it('Select', async () => {
    const snapshot = await openAndRead(SelectDefault, () => byRole('combobox'), 'body')
    expect(snapshot).toMatchInlineSnapshot(`
      "- combobox "Option" [expanded]: Select an option
      - listbox:
        - option "Option 1"
        - option "Option 2"
        - option "Option 3"
        - option "Option 4""
    `)
  })

  it('MultiSelect', async () => {
    const snapshot = await openAndRead(MultiSelectDefault, () => byRole('combobox'), 'body')
    expect(snapshot).toMatchInlineSnapshot(`
      "- combobox "Options" [expanded]: Option 1
      - listbox:
        - option "Option 1" [selected]
        - option "Option 2"
        - option "Option 3"
        - option "Option 4""
    `)
  })

  it('Command', async () => {
    const snapshot = await openAndRead(CommandDefault, () => button('Search'), '[role="dialog"]')
    expect(snapshot).toMatchInlineSnapshot(`
      "- dialog "Command menu":
        - heading "Command menu" [level=2]
        - combobox "Search commands…" [expanded]
        - listbox:
          - group "Suggestions":
            - text: Suggestions
            - option "Deploy Project" [selected]
            - option "Create Application"
            - option "Go to Settings"
          - group "Commands":
            - text: Commands
            - option "Search everything Ctrl K"
            - option "New Application Ctrl N"
            - option "Toggle Theme Ctrl ⇧ L""
    `)
  })

  it('NavigationMenu', async () => {
    const snapshot = await openAndRead(
      NavigationMenuDefault,
      () => button('Soluções'),
      'nav[aria-label="Azion"]'
    )
    expect(snapshot).toMatchInlineSnapshot(`
      "- navigation "Azion":
        - list:
          - listitem:
            - button "Soluções" [expanded]
          - listitem:
            - button "Produtos"
          - listitem:
            - link "Preços":
              - /url: https://www.azion.com/pt-br/precos/
        - link "Contato":
          - /url: https://www.azion.com/pt-br/contato-vendas/"
    `)
  })
})

describe('screen-reader smoke · form blocks', () => {
  it('form-error (rejected)', async () => {
    render(FormErrorRejected)
    await settle()
    expect(await commands.ariaSnapshot('form')).toMatchInlineSnapshot(`
      "- form "Create Service":
        - complementary "Scenario simulation":
          - paragraph: "Simulation: the other user"
          - text: "Deleted server-side: web-origin-prod"
          - paragraph: "You are User 1: the service below is filled in and already linked to an origin, four sections down. Have User 2 delete that origin through the API. Nothing will tell you, your copy of the list goes stale. Then press Save, and watch the form take you to the one section that needs you."
          - button "User 2 deletes the linked origin" [disabled]
          - button "Reset scenario"
        - group "Create service":
          - text: Create service
          - heading "General" [level=2]
          - list:
            - listitem:
              - text: Name
              - paragraph: Give a unique and descriptive name to identify the service.
              - textbox "Name":
                - /placeholder: My Service
                - text: checkout-web
          - heading "Delivery settings" [level=2]
          - list:
            - listitem:
              - text: Protocol usage
              - group "Protocol Usage":
                - text: Protocol Usage
                - group:
                  - radio "HTTP support"
                  - text: HTTP support
                  - paragraph: Use only the HTTP protocol. Select from the available HTTP ports.
                - group:
                  - radio "HTTP and HTTPS support" [checked]
                  - text: HTTP and HTTPS support
                  - paragraph: Use both HTTP and HTTPS protocols. Select from the available HTTP and HTTPS ports.
                - group:
                  - radio "HTTP/3 support"
                  - text: HTTP/3 support
                  - paragraph: Use both HTTP and HTTPS protocols and enable HTTP/3 support. Only available for HTTP port 80 and HTTPS port 443.
            - listitem:
              - text: HTTP ports
              - paragraph: The ports the service listens on for HTTP traffic.
              - combobox "HTTP ports": 80 (default)
          - heading "Features" [level=2]
          - list:
            - listitem:
              - text: Compression
              - paragraph: Compress responses with gzip or Brotli before they are sent.
              - switch "Compression" [checked]
            - listitem:
              - text: Rate limiting
              - paragraph: Limit how many requests a single client can send per minute.
              - switch "Rate limiting"
            - listitem:
              - text: Image optimization
              - paragraph: Resize, crop, and convert images on the fly through URL parameters.
              - switch "Image optimization"
            - listitem:
              - text: Secondary cache
              - paragraph: Add a second caching layer to reduce requests to the origin.
              - switch "Secondary cache"
          - heading "Origin" [level=2]
          - alert:
            - text: "Origin \\"web-origin-prod\\" no longer exists. Another user deleted it while you were filling in this form, so the service wasn't created. Nothing else was lost: reload the origin list and select another one."
            - button "Reload origins"
          - list:
            - listitem:
              - text: Origin
              - paragraph: The origin that serves this service’s content. Origins are shared across the account, so anyone on it can change one.
              - combobox "Origin" [invalid]: web-origin-prod
              - paragraph: This origin no longer exists.
            - listitem:
              - text: Host header
              - paragraph: Identify a virtualhost sent in the Host header to the origin.
              - textbox "Host header":
                - /placeholder: ""
                - text: "\${host}"
          - heading "Cache expiration policies" [level=2]
          - list:
            - listitem:
              - text: Browser maximum TTL
              - paragraph: How long browsers may keep a cached response, in seconds.
              - spinbutton "Browser maximum TTL in seconds": "0"
              - button "Increment"
              - button "Decrement"
            - listitem:
              - text: Cache maximum TTL
              - paragraph: How long the cache may keep a response, in seconds. A secondary cache requires a TTL of at least 3 seconds.
              - spinbutton "Cache maximum TTL in seconds": "60"
              - button "Increment"
              - button "Decrement"
          - heading "Debug rules" [level=2]
          - list:
            - listitem:
              - text: Active
              - paragraph: Rules that were successfully executed will be listed in the request logs and in the trace of each event.
              - switch "Active"
        - button "Cancel"
        - button "Save""
    `)
  })

  it('single-page-create', async () => {
    render(SinglePageCreate)
    await settle()
    expect(await commands.ariaSnapshot('form')).toMatchInlineSnapshot(`
      "- form "Create Domain":
        - heading "Create Domain" [level=1]
        - paragraph: A domain holds the DNS records that answer authoritatively for a hostname.
        - group "Create Domain":
          - text: Create Domain
          - heading "General" [level=2]
          - 'button "The two fields this endpoint requires: what the domain is called here, and the hostname it answers for."'
          - list:
            - listitem:
              - text: Name
              - paragraph: Identifies the domain in this list. It is not the hostname.
              - textbox "Name":
                - /placeholder: My domain
            - listitem:
              - text: Domain name
              - paragraph: The root hostname this domain answers for, without a subdomain. Pasting a zone file here imports its records instead.
              - textbox "Domain name":
                - /placeholder: example.com
          - heading "Advanced" [level=2]:
            - button "Advanced"
        - button "Import"
        - paragraph: or paste zone file contents in Domain name
        - button "Cancel"
        - button "Save""
    `)
  })
})
