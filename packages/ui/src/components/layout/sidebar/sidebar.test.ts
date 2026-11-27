import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'

import Default from '../../../../examples/sidebar/default.vue'
import IconRail from '../../../../examples/sidebar/icon-rail.vue'
import Resizable from '../../../../examples/sidebar/resizable.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import SidebarMenu from '../../navigation/sidebar-menu/sidebar-menu.vue'
import SidebarMenuGroup from '../../navigation/sidebar-menu/sidebar-menu-group/sidebar-menu-group.vue'
import SidebarMenuItem from '../../navigation/sidebar-menu/sidebar-menu-item/sidebar-menu-item.vue'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import SidebarCompound from './index'
import Sidebar from './sidebar.vue'
import SidebarFooter from './sidebar-footer.vue'
import SidebarHeader from './sidebar-header.vue'

describe('Sidebar', () => {
  describe('v-model:open', () => {
    it('open=false renders the rail collapsed', () => {
      const { getByTestId } = render(Sidebar, { props: { collapsible: true, open: false } })
      expect(getByTestId('sidebar').getAttribute('data-state')).toBe('closed')
    })

    it('the trigger emits update:open false and no update:collapsed', async () => {
      const { getByTestId, emitted } = render(Sidebar, { props: { collapsible: true } })
      await fireEvent.click(getByTestId('sidebar__collapse'))
      expect(emitted()['update:open']?.at(-1)).toEqual([false])
      expect(emitted()['update:collapsed']).toBeUndefined()
    })

    it('the expand button emits update:open true', async () => {
      const { getByTestId, emitted } = render(Sidebar, {
        props: { collapsible: true, open: false }
      })
      await fireEvent.click(getByTestId('sidebar__expand-button'))
      expect(emitted()['update:open']?.at(-1)).toEqual([true])
    })

    it('ignores a removed collapsed attribute; only open collapses the rail', () => {
      const { getByTestId } = render(Sidebar, {
        props: { collapsible: true },
        attrs: { collapsed: true }
      })
      expect(getByTestId('sidebar').getAttribute('data-state')).toBe('open')
    })

    it('a parent that binds open follows it after an internal collapse', async () => {
      const open = ref(true)
      const { getByTestId } = render({
        components: { Sidebar },
        setup: () => ({ open }),
        template: '<Sidebar v-model:open="open" collapsible />'
      })
      await fireEvent.click(getByTestId('sidebar__collapse'))
      expect(open.value).toBe(false)
      open.value = true
      await nextTick()
      expect(getByTestId('sidebar').getAttribute('data-state')).toBe('open')
    })
  })

  describe('compound API', () => {
    it('attaches Header and Footer to the root for dot-notation', () => {
      expect(SidebarCompound).toBe(Sidebar)
      expect(SidebarCompound.Header).toBe(SidebarHeader)
      expect(SidebarCompound.Footer).toBe(SidebarFooter)
    })

    it('renders the parts through dot-notation', () => {
      const { getByTestId } = render({
        render: () =>
          h(
            SidebarCompound,
            {},
            {
              header: () => h(SidebarCompound.Header, () => 'Acme'),
              default: () =>
                h(SidebarMenu, { ariaLabel: 'Main' }, () =>
                  h(SidebarMenuGroup, { label: 'Build' }, () => 'Item')
                ),
              footer: () => h(SidebarCompound.Footer, () => 'Jane Doe')
            }
          )
      })
      expect(getByTestId('sidebar-header').textContent).toContain('Acme')
      expect(getByTestId('sidebar__nav').textContent).toContain('Build')
      expect(getByTestId('sidebar-footer').textContent).toContain('Jane Doe')
    })
  })
  describe('rendering (structure grounded in the template)', () => {
    it('renders a root carrying the default data-testid and its nav/scroll regions', () => {
      const { getByTestId } = render(Sidebar)

      const root = getByTestId('sidebar')
      expect(root.tagName).toBe('DIV')

      const nav = getByTestId('sidebar__nav')
      expect(nav.tagName).toBe('NAV')
      expect(getByTestId('sidebar__scroll')).toBeTruthy()
    })

    it('exposes a navigation landmark named like the sidebar', () => {
      const { getByRole } = render(Sidebar)
      expect(getByRole('navigation', { name: 'Sidebar' })).toBeTruthy()
    })

    it.each([
      ['es', 'Barra lateral'],
      ['pt-BR', 'Barra lateral']
    ])('names the navigation landmark from the %s catalog', (locale, name) => {
      const { getByRole } = render(ConfigProvider, {
        props: { locale, catalogs: LOCALES },
        slots: { default: () => h(Sidebar) }
      })
      expect(getByRole('navigation', { name })).toBeTruthy()
    })

    it('names the navigation landmark from ariaLabel', () => {
      const { getByRole } = render(Sidebar, { props: { ariaLabel: 'Console' } })
      expect(getByRole('navigation', { name: 'Console' })).toBeTruthy()
    })

    it('does not render the header region when no header slot is provided', () => {
      const { queryByTestId } = render(Sidebar)
      expect(queryByTestId('sidebar__header')).toBeNull()
    })

    it('does not render the footer region when no footer slot is provided', () => {
      const { queryByTestId } = render(Sidebar)
      expect(queryByTestId('sidebar__footer')).toBeNull()
    })
  })

  describe('ariaLabel prop -> aria-label on the nav landmark, the only landmark', () => {
    it('defaults the aria-label to "Sidebar"', () => {
      const { getByTestId } = render(Sidebar)
      expect(getByTestId('sidebar__nav').getAttribute('aria-label')).toBe('Sidebar')
    })

    it('applies a custom ariaLabel to the nav and adds no second landmark', () => {
      const { getByTestId, getByRole, queryByRole } = render(Sidebar, {
        props: { ariaLabel: 'Application' }
      })
      expect(getByRole('navigation', { name: 'Application' })).toBe(getByTestId('sidebar__nav'))
      expect(queryByRole('complementary')).toBeNull()
    })
  })

  describe('data-testid fallback + override drives the region testids', () => {
    it('uses the consumer-supplied data-testid and derives region testids from it', () => {
      const { getByTestId, queryByTestId } = render(Sidebar, {
        attrs: { 'data-testid': 'my-sidebar' },
        slots: {
          header: '<span data-testid="hd">H</span>',
          footer: '<span data-testid="ft">F</span>'
        }
      })

      expect(getByTestId('my-sidebar').tagName).toBe('DIV')
      expect(getByTestId('my-sidebar__header')).toBeTruthy()
      expect(getByTestId('my-sidebar__nav')).toBeTruthy()
      expect(getByTestId('my-sidebar__scroll')).toBeTruthy()
      expect(getByTestId('my-sidebar__footer')).toBeTruthy()

      expect(queryByTestId('sidebar')).toBeNull()
    })
  })

  describe('slots', () => {
    it('renders default slot content inside the scroll region', () => {
      const { getByTestId } = render(Sidebar, {
        slots: { default: '<span data-testid="nav-item">Home</span>' }
      })
      const scroll = getByTestId('sidebar__scroll')
      const item = getByTestId('nav-item')
      expect(scroll.contains(item)).toBe(true)
    })

    it('renders header slot content inside the header region when provided', () => {
      const { getByTestId } = render(Sidebar, {
        slots: { header: '<span data-testid="hd">search</span>' }
      })
      const header = getByTestId('sidebar__header')
      expect(header.contains(getByTestId('hd'))).toBe(true)
    })

    it('renders footer slot content inside the footer region when provided', () => {
      const { getByTestId } = render(Sidebar, {
        slots: { footer: '<span data-testid="ft">profile</span>' }
      })
      const footer = getByTestId('sidebar__footer')
      expect(footer.contains(getByTestId('ft'))).toBe(true)
    })
  })

  describe('the scroll viewport is not a tab stop of its own', () => {
    it('marks the built-in ScrollArea `tabindex="-1"`', () => {
      const { getByTestId } = render(Sidebar, {
        slots: { default: '<a href="/">Home</a>' }
      })
      expect(getByTestId('sidebar__scroll').getAttribute('tabindex')).toBe('-1')
    })

    it('tabs from the header straight to the first navigation row', async () => {
      const { getByTestId } = render(Sidebar, {
        slots: {
          header: '<input data-testid="search" aria-label="Search" />',
          default: '<a href="/" data-testid="first-row">Home</a>'
        }
      })

      getByTestId('search').focus()
      await userEvent.tab()

      expect(document.activeElement).toBe(getByTestId('first-row'))
    })
  })

  describe('a11y (axe against styled DOM)', () => {
    it('content-only sidebar has no violations', async () => {
      const { container } = render(Sidebar, {
        slots: { default: '<a href="/">Home</a>' }
      })
      await expectNoA11yViolations(container)
    })

    it('sidebar with header and footer regions has no violations', async () => {
      const { container } = render(Sidebar, {
        props: { ariaLabel: 'Application' },
        slots: {
          header: '<label>Search<input aria-label="Search" /></label>',
          default: '<a href="/">Home</a>',
          footer: '<a href="/account">Account</a>'
        }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('documented example (the story fixtures run in-test)', () => {
    it('Default story renders the console rail: header, nav and footer regions', () => {
      const { getByTestId } = render(Default)
      expect(getByTestId('sidebar').tagName).toBe('DIV')
      expect(getByTestId('sidebar__header')).toBeTruthy()
      expect(getByTestId('sidebar__nav')).toBeTruthy()
      expect(getByTestId('sidebar__footer')).toBeTruthy()
    })

    it('Default story labels the landmark from its args (aria-label="Console")', () => {
      const { getByRole } = render(Default)
      expect(getByRole('navigation', { name: 'Console' })).toBeTruthy()
    })

    it('the navigation is a SidebarMenu that gives up the landmark to the sidebar', () => {
      const { getByTestId, getAllByRole } = render(Default)

      const menu = getByTestId('sidebar-menu')
      expect(menu.getAttribute('role')).toBe('presentation')
      expect(menu.getAttribute('aria-label')).toBeNull()
      expect(getAllByRole('navigation')).toHaveLength(1)
      expect(getByTestId('sidebar__nav').contains(menu)).toBe(true)
    })
  })

  describe('rail (resizable + collapsible)', () => {
    it('renders neither the handle nor the collapse trigger by default', () => {
      const { queryByTestId, getByTestId } = render(Sidebar, {
        slots: { default: '<a href="/">Home</a>' }
      })

      expect(queryByTestId('sidebar__handle')).toBeNull()
      expect(queryByTestId('sidebar__collapse')).toBeNull()
      expect(getByTestId('sidebar').getAttribute('style')).toBeNull()
    })

    it('the collapse trigger sits in the footer region, after the footer content', () => {
      const { getByTestId } = render(Sidebar, {
        props: { collapsible: true },
        slots: { footer: '<span data-testid="ft">profile</span>' }
      })

      const footer = getByTestId('sidebar__footer')
      const trigger = getByTestId('sidebar__collapse')
      expect(footer.contains(trigger)).toBe(true)
      expect(
        getByTestId('ft').compareDocumentPosition(trigger) & Node.DOCUMENT_POSITION_FOLLOWING
      ).toBeTruthy()
    })

    it('puts the footer content and the trigger in ONE band inside the footer region', () => {
      const { getByTestId } = render(Sidebar, {
        props: { collapsible: true },
        slots: { footer: '<span data-testid="ft">profile</span>' }
      })

      const region = getByTestId('sidebar__footer')
      expect(region.children).toHaveLength(1)

      const band = region.firstElementChild
      expect(band?.contains(getByTestId('ft'))).toBe(true)
      expect(band?.contains(getByTestId('sidebar__collapse'))).toBe(true)
    })

    it('renders the collapse trigger even with no footer slot', () => {
      const { getByTestId } = render(Sidebar, { props: { collapsible: true } })
      expect(getByTestId('sidebar__collapse')).toBeTruthy()
    })

    it('settles only after mount, so a state restored in the mount tick lands in place', async () => {
      const { getByTestId } = render(Sidebar, {
        props: { collapsible: true, open: false },
        slots: { default: '<a href="/">Home</a>' }
      })

      const root = getByTestId('sidebar')
      const panel = getByTestId('sidebar__panel')
      expect(root.hasAttribute('data-settled')).toBe(false)
      expect(panel.hasAttribute('data-settled')).toBe(false)

      await waitFor(() => {
        expect(root.hasAttribute('data-settled')).toBe(true)
        expect(panel.hasAttribute('data-settled')).toBe(true)
      })
      expect(root.getAttribute('data-state')).toBe('closed')
    })

    it('the trigger collapses the rail and takes it out of the tree and the tab order', async () => {
      const { getByTestId, emitted } = render(Sidebar, {
        props: { collapsible: true },
        slots: { default: '<a href="/">Home</a>' }
      })

      await fireEvent.click(getByTestId('sidebar__collapse'))

      expect(emitted()['update:open']?.[0]).toEqual([false])

      const root = getByTestId('sidebar')
      expect(root.getAttribute('data-state')).toBe('closed')
      expect(root.hasAttribute('inert')).toBe(true)
      expect(getByTestId('sidebar__panel').getAttribute('data-state')).toBe('closed')
    })

    it('the panel carries the collapsed state that drives the CSS motion, with no hidden control', () => {
      const { getByTestId } = render(Sidebar, {
        props: { collapsible: true, open: false },
        slots: { default: '<a href="/">Home</a>' }
      })

      const panel = getByTestId('sidebar__panel')
      expect(panel.getAttribute('data-state')).toBe('closed')
      expect(getByTestId('sidebar').querySelector('input')).toBeNull()
    })

    it('the panel state follows the model both ways, the state the trigger drives', async () => {
      const { getByTestId, rerender } = render(Sidebar, {
        props: { collapsible: true, open: true },
        slots: { default: '<a href="/">Home</a>' }
      })

      const panel = getByTestId('sidebar__panel')
      expect(panel.getAttribute('data-state')).toBe('open')
      await rerender({ collapsible: true, open: false })
      expect(panel.getAttribute('data-state')).toBe('closed')
      await rerender({ collapsible: true, open: true })
      expect(panel.getAttribute('data-state')).toBe('open')
    })

    it('a rail that cannot collapse carries no panel state', () => {
      const { getByTestId } = render(Sidebar, {
        slots: { default: '<a href="/">Home</a>' }
      })

      expect(getByTestId('sidebar__panel').hasAttribute('data-state')).toBe(false)
    })

    it('the way back is a sibling of the rail, because a collapsed rail would clip it', async () => {
      const { getByTestId } = render(Sidebar, {
        props: { collapsible: true, open: false },
        slots: { default: '<a href="/">Home</a>' }
      })

      const rail = getByTestId('sidebar')
      const expand = await waitFor(() => getByTestId('sidebar__expand'))
      expect(rail.contains(expand)).toBe(false)
    })

    it('previewing: resting in the edge zone brings the collapsed rail back to --size-10', async () => {
      const { getByTestId } = render(Sidebar, {
        props: { collapsible: true, open: false },
        slots: { default: '<a href="/">Home</a>' }
      })

      const rail = getByTestId('sidebar')
      const zone = await waitFor(() => getByTestId('sidebar__expand'))

      await fireEvent.pointerEnter(zone)
      expect(zone.getAttribute('data-preview')).toBe('')
      expect(rail.style.width).toBe('40px')

      await fireEvent.pointerLeave(zone)
      expect(zone.hasAttribute('data-preview')).toBe(false)
      expect(rail.style.width).toBe('')
    })

    it('previewing: focus reaching the edge zone opens the same sliver as the pointer', async () => {
      const { getByTestId } = render(Sidebar, {
        props: { collapsible: true, open: false },
        slots: { default: '<a href="/">Home</a>' }
      })

      const rail = getByTestId('sidebar')
      const zone = await waitFor(() => getByTestId('sidebar__expand'))

      await fireEvent.focusIn(zone)
      expect(rail.style.width).toBe('40px')

      await fireEvent.focusOut(zone)
      expect(rail.style.width).toBe('')
    })

    it('previewing: the sliver stays out of the tab order — it is a preview, not a restore', async () => {
      const { getByTestId } = render(Sidebar, {
        props: { collapsible: true, open: false },
        slots: { default: '<a href="/">Home</a>' }
      })

      const rail = getByTestId('sidebar')
      await fireEvent.pointerEnter(await waitFor(() => getByTestId('sidebar__expand')))

      expect(rail.style.width).toBe('40px')
      expect(rail.hasAttribute('inert')).toBe(true)
      expect(rail.getAttribute('data-state')).toBe('closed')
    })

    it('previewing: a click on the collapsed splitter brings the rail back', async () => {
      const { getByTestId, emitted } = render(Sidebar, {
        props: { collapsible: true, resizable: true, open: false },
        slots: { default: '<a href="/">Home</a>' }
      })

      const zone = await waitFor(() => getByTestId('sidebar__expand'))
      await fireEvent.pointerEnter(zone)
      await fireEvent.click(zone.querySelector('[role="separator"]') as HTMLElement)

      expect(emitted()['update:open']?.at(-1)).toEqual([true])
    })

    it('previewing: a drag that MOVED is not also answered as a click', async () => {
      const { getByTestId, emitted } = render(Sidebar, {
        props: { collapsible: true, resizable: true, open: false },
        slots: { default: '<a href="/">Home</a>' }
      })

      const zone = await waitFor(() => getByTestId('sidebar__expand'))
      const splitter = zone.querySelector('[role="separator"]') as HTMLElement

      await fireEvent.pointerDown(splitter, { clientX: 0 })
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 24 }))
      window.dispatchEvent(new PointerEvent('pointerup'))
      await fireEvent.click(splitter)

      expect(emitted()['update:open']).toBeUndefined()
    })

    it('previewing: an expanded rail has nothing to preview, so the zone is not even rendered', () => {
      const { queryByTestId } = render(Sidebar, {
        props: { collapsible: true },
        slots: { default: '<a href="/">Home</a>' }
      })
      expect(queryByTestId('sidebar__expand')).toBeNull()
    })

    it('the expand button brings a collapsed rail back', async () => {
      const { getByTestId, emitted } = render(Sidebar, {
        props: { collapsible: true, open: false },
        slots: { default: '<a href="/">Home</a>' }
      })

      await fireEvent.click(await waitFor(() => getByTestId('sidebar__expand-button')))
      expect(emitted()['update:open']?.at(-1)).toEqual([true])
    })

    it('renders a named, focusable separator as the drag handle', () => {
      const { getByTestId, getByRole } = render(Sidebar, {
        props: { resizable: true, resizeAriaLabel: 'Resize navigation' },
        slots: { default: '<a href="/">Home</a>' }
      })

      const handle = getByTestId('sidebar__handle')
      expect(handle).toBe(getByRole('separator', { name: 'Resize navigation' }))
      expect(handle.getAttribute('tabindex')).toBe('0')
      expect(handle.getAttribute('aria-orientation')).toBe('vertical')
      expect(handle.classList.contains('focus-visible:ring-(--ring-color)')).toBe(true)
    })

    it('arrow keys on the handle nudge the width, the keyboard equivalent of the drag', async () => {
      const { getByTestId, emitted } = render(Sidebar, {
        props: { resizable: true, width: 300 },
        slots: { default: '<a href="/">Home</a>' }
      })

      const handle = getByTestId('sidebar__handle')
      handle.focus()
      await userEvent.keyboard('{ArrowRight}')

      expect(emitted()['update:width']?.at(-1)).toEqual([316])

      await userEvent.keyboard('{ArrowLeft}')
      expect(emitted()['update:width']?.at(-1)).toEqual([300])
    })

    it('mirrors the arrow keys and the drag in a right-to-left subtree', async () => {
      const host = document.createElement('div')
      host.setAttribute('dir', 'rtl')
      document.body.appendChild(host)
      const { getByTestId, emitted } = render(Sidebar, {
        container: host,
        props: { resizable: true, width: 300 },
        slots: { default: '<a href="/">Home</a>' }
      })

      const handle = getByTestId('sidebar__handle')
      handle.focus()
      await userEvent.keyboard('{ArrowLeft}')
      expect(emitted()['update:width']?.at(-1)).toEqual([316])

      await userEvent.keyboard('{ArrowRight}')
      expect(emitted()['update:width']?.at(-1)).toEqual([300])

      await fireEvent.pointerDown(handle, { clientX: 500 })
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 460 }))
      window.dispatchEvent(new PointerEvent('pointerup'))
      expect(emitted()['update:width']?.at(-1)).toEqual([340])
      host.remove()
    })

    it('the nudge clamps to the token bounds instead of running past them', async () => {
      const { getByTestId, emitted } = render(Sidebar, {
        props: { resizable: true, width: 400 },
        slots: { default: '<a href="/">Home</a>' }
      })

      getByTestId('sidebar__handle').focus()
      await userEvent.keyboard('{ArrowRight}')

      expect(emitted()['update:width']?.at(-1)).toEqual([408])
    })

    it('double-clicking the handle collapses the rail', async () => {
      const { getByTestId, emitted } = render(Sidebar, {
        props: { resizable: true, collapsible: true },
        slots: { default: '<a href="/">Home</a>' }
      })

      await fireEvent.dblClick(getByTestId('sidebar__handle'))
      expect(emitted()['update:open']?.at(-1)).toEqual([false])
    })

    it('a rail with the gesture on has no axe violations, open or collapsed', async () => {
      const open = render(Sidebar, {
        props: { resizable: true, collapsible: true, ariaLabel: 'Console' },
        slots: { default: '<a href="/">Home</a>', footer: '<a href="/account">Account</a>' }
      })
      await expectNoA11yViolations(open.container)
      open.unmount()

      const closed = render(Sidebar, {
        props: {
          resizable: true,
          collapsible: true,
          open: false,
          ariaLabel: 'Console'
        },
        slots: { default: '<a href="/">Home</a>' }
      })
      await expectNoA11yViolations(closed.container)
    })

    it('Resizable story renders the handle, the trigger and a sized rail', async () => {
      const host = document.body.appendChild(document.createElement('div'))
      host.style.width = '1280px'
      const { getByTestId } = render(Resizable, { container: host })

      expect(getByTestId('sidebar__handle')).toBeTruthy()
      expect(getByTestId('sidebar__collapse')).toBeTruthy()
      await waitFor(() =>
        expect(getByTestId('sidebar').style.getPropertyValue('--sidebar-width')).not.toBe('')
      )
    })
  })

  describe('slot presence', () => {
    it('follows a v-if slot that appears and disappears after mount', async () => {
      const shown = ref(false)
      const { queryByTestId } = render({
        components: { Sidebar },
        setup: () => ({ shown }),
        template: `<Sidebar><template v-if="shown" #footer><span data-testid="probe">Slotted</span></template><a href="/home">Home</a></Sidebar>`
      })
      expect(queryByTestId('sidebar__footer')).toBeNull()

      shown.value = true
      await nextTick()
      expect(queryByTestId('sidebar__footer')).not.toBeNull()
      expect(queryByTestId('probe')).not.toBeNull()

      shown.value = false
      await nextTick()
      expect(queryByTestId('sidebar__footer')).toBeNull()
      expect(queryByTestId('probe')).toBeNull()
    })
  })

  describe('icon rail (collapsible="icon") and the toggle shortcut', () => {
    const railMenu = {
      components: { Sidebar, SidebarMenu, SidebarMenuGroup, SidebarMenuItem },
      setup() {
        const open = ref(false)
        return { open }
      },
      template: `
      <Sidebar v-model:open="open" collapsible="icon" shortcut>
        <SidebarMenu role="presentation">
          <SidebarMenuGroup label="Build">
            <SidebarMenuItem label="Applications" icon="az az-applications" href="/applications" />
            <SidebarMenuItem label="No glyph" icon="" href="/plain" />
          </SidebarMenuGroup>
        </SidebarMenu>
        <template #footer="{ rail }"><span data-testid="footer-scope">{{ rail ? 'rail' : 'full' }}</span></template>
      </Sidebar>
      <input data-testid="field" />
      <span data-testid="state">{{ !open }}</span>
    `
    }

    it('keeps a collapsed icon sidebar in the layout: data-rail, not inert, not aria-hidden', () => {
      const { getByTestId, queryByTestId } = render(railMenu)
      const root = getByTestId('sidebar')
      expect(root.hasAttribute('data-rail')).toBe(true)
      expect(root.hasAttribute('inert')).toBe(false)
      expect(root.getAttribute('aria-hidden')).toBeNull()
      expect(queryByTestId('sidebar__expand')).toBeNull()
      expect(getByTestId('footer-scope').textContent).toBe('rail')
    })

    it('keeps each row reachable by its label and hides rows without an icon', () => {
      const { getByRole, getAllByTestId } = render(railMenu)
      expect(getByRole('link', { name: 'Applications' })).toBeTruthy()
      const rows = getAllByTestId('sidebar-menu-item')
      expect(rows.every((row) => row.hasAttribute('data-rail'))).toBe(true)
    })

    it('shows the row label in a tooltip on focus', async () => {
      const { getByRole } = render(railMenu)
      getByRole('link', { name: 'Applications' }).focus()
      await waitFor(() =>
        expect(document.body.querySelector('[role="tooltip"]')?.textContent?.trim()).toBe(
          'Applications'
        )
      )
    })

    it('expands from the rail footer button', async () => {
      const { getByTestId } = render(railMenu)
      const expand = getByTestId('sidebar__expand-button')
      expect(expand.getAttribute('aria-keyshortcuts')).toBe('Control+B Meta+B')
      await fireEvent.click(expand)
      await waitFor(() => expect(getByTestId('state').textContent).toBe('false'))
      expect(getByTestId('sidebar').hasAttribute('data-rail')).toBe(false)
      expect(getByTestId('footer-scope').textContent).toBe('full')
    })

    it('toggles with Ctrl+B and Cmd+B, but not while typing in a field', async () => {
      const { getByTestId } = render(railMenu)
      await fireEvent.keyDown(document.body, { key: 'b', ctrlKey: true })
      await waitFor(() => expect(getByTestId('state').textContent).toBe('false'))
      await fireEvent.keyDown(document.body, { key: 'b', metaKey: true })
      await waitFor(() => expect(getByTestId('state').textContent).toBe('true'))
      await fireEvent.keyDown(getByTestId('field'), { key: 'b', ctrlKey: true })
      await nextTick()
      expect(getByTestId('state').textContent).toBe('true')
    })

    it('ignores the shortcut unless the shortcut prop is set', async () => {
      const onUpdate = vi.fn()
      render(Sidebar, { props: { collapsible: true, 'onUpdate:open': onUpdate } })
      await fireEvent.keyDown(document.body, { key: 'b', ctrlKey: true })
      await nextTick()
      expect(onUpdate).not.toHaveBeenCalled()
    })

    it('keeps collapsible=true as the offcanvas collapse', () => {
      const { getByTestId } = render(Sidebar, { props: { collapsible: true, open: false } })
      const root = getByTestId('sidebar')
      expect(root.hasAttribute('inert')).toBe(true)
      expect(root.hasAttribute('data-rail')).toBe(false)
      expect(getByTestId('sidebar__expand')).toBeTruthy()
    })

    it('renders the IconRail example without axe violations', async () => {
      const { container } = render(IconRail)
      await expectNoA11yViolations(container)
    })
  })

  it.each([
    ['default', Default],
    ['resizable', Resizable]
  ])(
    'paints the Preview lifecycle tag in the %s example as info, not brand orange',
    (_, Example) => {
      const { getAllByTestId } = render(Example)
      const preview = getAllByTestId('tag').filter((tag) => tag.textContent?.trim() === 'Preview')
      expect(preview.length).toBeGreaterThan(0)
      for (const tag of preview) {
        expect(tag.getAttribute('data-severity')).toBe('info')
        expect(tag.getAttribute('data-variant')).not.toBe('primary')
      }
    }
  )

  it('leaves the rail example lifecycle tag on the default info colour', () => {
    const [iconRailSource] = Object.values(
      import.meta.glob<string>('../../../../examples/sidebar/icon-rail.vue', {
        query: '?raw',
        import: 'default',
        eager: true
      })
    )
    expect(iconRailSource).toContain('tag-value="Preview"')
    expect(iconRailSource).not.toContain('tag-variant="primary"')
  })
})
