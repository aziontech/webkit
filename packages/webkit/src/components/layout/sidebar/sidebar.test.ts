import { userEvent } from '@storybook/test'
import { composeStories } from '@storybook/vue3'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/layout/sidebar/Sidebar.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Sidebar from './sidebar.vue'

const { Default, Resizable } = composeStories(stories)

describe('Sidebar', () => {
  describe('rendering (structure grounded in the template)', () => {
    it('renders an <aside> root carrying the default data-testid and its nav/scroll regions', () => {
      const { getByTestId } = render(Sidebar)

      const root = getByTestId('layout-sidebar')
      expect(root.tagName).toBe('ASIDE')

      // Derived region testids from the template: `${testId}__nav`, `${testId}__scroll`.
      const nav = getByTestId('layout-sidebar__nav')
      expect(nav.tagName).toBe('NAV')
      expect(getByTestId('layout-sidebar__scroll')).toBeTruthy()
    })

    it('exposes a navigation landmark', () => {
      const { getByRole } = render(Sidebar)
      // <nav> is the only landmark role emitted by the template.
      expect(getByRole('navigation')).toBeTruthy()
    })

    it('does not render the header region when no header slot is provided', () => {
      const { queryByTestId } = render(Sidebar)
      // Template: <div v-if="$slots['header']" ...__header>. No slot => absent.
      expect(queryByTestId('layout-sidebar__header')).toBeNull()
    })

    it('does not render the footer region when no footer slot is provided', () => {
      const { queryByTestId } = render(Sidebar)
      // Template: <div v-if="$slots['footer']" ...__footer>. No slot => absent.
      expect(queryByTestId('layout-sidebar__footer')).toBeNull()
    })
  })

  describe('ariaLabel prop -> aria-label on the <aside> landmark', () => {
    it('defaults the aria-label to "Sidebar"', () => {
      const { getByTestId } = render(Sidebar)
      expect(getByTestId('layout-sidebar').getAttribute('aria-label')).toBe('Sidebar')
    })

    it('applies a custom ariaLabel to the root', () => {
      const { getByTestId, getByRole } = render(Sidebar, { props: { ariaLabel: 'Application' } })
      expect(getByTestId('layout-sidebar').getAttribute('aria-label')).toBe('Application')
      // The <aside> root carries aria-label -> it is a complementary landmark named "Application".
      expect(getByRole('complementary', { name: 'Application' })).toBe(
        getByTestId('layout-sidebar')
      )
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

      expect(getByTestId('my-sidebar').tagName).toBe('ASIDE')
      expect(getByTestId('my-sidebar__header')).toBeTruthy()
      expect(getByTestId('my-sidebar__nav')).toBeTruthy()
      expect(getByTestId('my-sidebar__scroll')).toBeTruthy()
      expect(getByTestId('my-sidebar__footer')).toBeTruthy()

      // The fallback testid must no longer be present once overridden.
      expect(queryByTestId('layout-sidebar')).toBeNull()
    })
  })

  describe('slots', () => {
    it('renders default slot content inside the scroll region', () => {
      const { getByTestId } = render(Sidebar, {
        slots: { default: '<span data-testid="nav-item">Home</span>' }
      })
      const scroll = getByTestId('layout-sidebar__scroll')
      const item = getByTestId('nav-item')
      expect(scroll.contains(item)).toBe(true)
    })

    it('renders header slot content inside the header region when provided', () => {
      const { getByTestId } = render(Sidebar, {
        slots: { header: '<span data-testid="hd">search</span>' }
      })
      const header = getByTestId('layout-sidebar__header')
      expect(header.contains(getByTestId('hd'))).toBe(true)
    })

    it('renders footer slot content inside the footer region when provided', () => {
      const { getByTestId } = render(Sidebar, {
        slots: { footer: '<span data-testid="ft">profile</span>' }
      })
      const footer = getByTestId('layout-sidebar__footer')
      expect(footer.contains(getByTestId('ft'))).toBe(true)
    })
  })

  describe('the scroll viewport is not a tab stop of its own', () => {
    it('marks the built-in ScrollArea `tabindex="-1"`', () => {
      const { getByTestId } = render(Sidebar, {
        slots: { default: '<a href="/">Home</a>' }
      })
      expect(getByTestId('layout-sidebar__scroll').getAttribute('tabindex')).toBe('-1')
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

  describe('composeStories (the story fixtures run in-test)', () => {
    it('Default story renders the console rail: header, nav and footer regions', () => {
      const { getByTestId } = render(Default)
      expect(getByTestId('layout-sidebar').tagName).toBe('ASIDE')
      expect(getByTestId('layout-sidebar__header')).toBeTruthy()
      expect(getByTestId('layout-sidebar__nav')).toBeTruthy()
      expect(getByTestId('layout-sidebar__footer')).toBeTruthy()
    })

    it('Default story labels the landmark from its args (aria-label="Console")', () => {
      const { getByRole } = render(Default)
      expect(getByRole('complementary', { name: 'Console' })).toBeTruthy()
    })

    it('the navigation is a Menu that gives up the landmark to the sidebar', () => {
      const { getByTestId, getAllByRole } = render(Default)

      const menu = getByTestId('navigation-menu')
      expect(menu.getAttribute('role')).toBe('presentation')
      expect(menu.getAttribute('aria-label')).toBeNull()
      expect(getAllByRole('navigation')).toHaveLength(1)
      expect(getByTestId('layout-sidebar__nav').contains(menu)).toBe(true)
    })
  })

  describe('rail (resizable + collapsible)', () => {
    it('renders neither the handle nor the collapse trigger by default', () => {
      const { queryByTestId, getByTestId } = render(Sidebar, {
        slots: { default: '<a href="/">Home</a>' }
      })

      expect(queryByTestId('layout-sidebar__handle')).toBeNull()
      expect(queryByTestId('layout-sidebar__collapse')).toBeNull()
      expect(getByTestId('layout-sidebar').getAttribute('style')).toBeNull()
    })

    it('the collapse trigger sits in the footer region, after the footer content', () => {
      const { getByTestId } = render(Sidebar, {
        props: { collapsible: true },
        slots: { footer: '<span data-testid="ft">profile</span>' }
      })

      const footer = getByTestId('layout-sidebar__footer')
      const trigger = getByTestId('layout-sidebar__collapse')
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

      const region = getByTestId('layout-sidebar__footer')
      expect(region.children).toHaveLength(1)

      const band = region.firstElementChild
      expect(band?.contains(getByTestId('ft'))).toBe(true)
      expect(band?.contains(getByTestId('layout-sidebar__collapse'))).toBe(true)
    })

    it('renders the collapse trigger even with no footer slot', () => {
      const { getByTestId } = render(Sidebar, { props: { collapsible: true } })
      expect(getByTestId('layout-sidebar__collapse')).toBeTruthy()
    })

    it('the trigger collapses the rail and takes it out of the tree and the tab order', async () => {
      const onUpdate = []
      const { getByTestId, emitted } = render(Sidebar, {
        props: { collapsible: true },
        slots: { default: '<a href="/">Home</a>' }
      })
      void onUpdate

      await fireEvent.click(getByTestId('layout-sidebar__collapse'))

      expect(emitted()['update:collapsed']?.[0]).toEqual([true])

      const root = getByTestId('layout-sidebar')
      expect(root.getAttribute('data-collapsed')).toBe('')
      expect(root.getAttribute('aria-hidden')).toBe('true')
      expect(root.hasAttribute('inert')).toBe(true)
      expect(root.style.width).toBe('0px')
    })

    it('the way back is a sibling of the rail, because a collapsed rail would clip it', async () => {
      const { getByTestId } = render(Sidebar, {
        props: { collapsible: true, collapsed: true },
        slots: { default: '<a href="/">Home</a>' }
      })

      const rail = getByTestId('layout-sidebar')
      const expand = await waitFor(() => getByTestId('layout-sidebar__expand'))
      expect(rail.contains(expand)).toBe(false)
    })

    it('previewing: resting in the edge zone brings the collapsed rail back to --size-10', async () => {
      const { getByTestId } = render(Sidebar, {
        props: { collapsible: true, collapsed: true },
        slots: { default: '<a href="/">Home</a>' }
      })

      const rail = getByTestId('layout-sidebar')
      const zone = await waitFor(() => getByTestId('layout-sidebar__expand'))
      expect(rail.style.width).toBe('0px')

      await fireEvent.pointerEnter(zone)
      expect(zone.getAttribute('data-preview')).toBe('')
      expect(rail.style.width).toBe('40px')

      await fireEvent.pointerLeave(zone)
      expect(zone.hasAttribute('data-preview')).toBe(false)
      expect(rail.style.width).toBe('0px')
    })

    it('previewing: focus reaching the edge zone opens the same sliver as the pointer', async () => {
      const { getByTestId } = render(Sidebar, {
        props: { collapsible: true, collapsed: true },
        slots: { default: '<a href="/">Home</a>' }
      })

      const rail = getByTestId('layout-sidebar')
      const zone = await waitFor(() => getByTestId('layout-sidebar__expand'))

      await fireEvent.focusIn(zone)
      expect(rail.style.width).toBe('40px')

      await fireEvent.focusOut(zone)
      expect(rail.style.width).toBe('0px')
    })

    it('previewing: the sliver stays out of the tab order — it is a preview, not a restore', async () => {
      const { getByTestId } = render(Sidebar, {
        props: { collapsible: true, collapsed: true },
        slots: { default: '<a href="/">Home</a>' }
      })

      const rail = getByTestId('layout-sidebar')
      await fireEvent.pointerEnter(await waitFor(() => getByTestId('layout-sidebar__expand')))

      expect(rail.style.width).toBe('40px')
      expect(rail.hasAttribute('inert')).toBe(true)
      expect(rail.getAttribute('aria-hidden')).toBe('true')
      expect(rail.getAttribute('data-collapsed')).toBe('')
    })

    it('previewing: a click on the collapsed splitter brings the rail back', async () => {
      const { getByTestId, emitted } = render(Sidebar, {
        props: { collapsible: true, resizable: true, collapsed: true },
        slots: { default: '<a href="/">Home</a>' }
      })

      const zone = await waitFor(() => getByTestId('layout-sidebar__expand'))
      await fireEvent.pointerEnter(zone)
      await fireEvent.click(zone.querySelector('[role="separator"]') as HTMLElement)

      expect(emitted()['update:collapsed']?.at(-1)).toEqual([false])
    })

    it('previewing: a drag that MOVED is not also answered as a click', async () => {
      const { getByTestId, emitted } = render(Sidebar, {
        props: { collapsible: true, resizable: true, collapsed: true },
        slots: { default: '<a href="/">Home</a>' }
      })

      const zone = await waitFor(() => getByTestId('layout-sidebar__expand'))
      const splitter = zone.querySelector('[role="separator"]') as HTMLElement

      await fireEvent.pointerDown(splitter, { clientX: 0 })
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 24 }))
      window.dispatchEvent(new PointerEvent('pointerup'))
      await fireEvent.click(splitter)

      expect(emitted()['update:collapsed']).toBeUndefined()
    })

    it('previewing: an expanded rail has nothing to preview, so the zone is not even rendered', () => {
      const { queryByTestId } = render(Sidebar, {
        props: { collapsible: true },
        slots: { default: '<a href="/">Home</a>' }
      })
      expect(queryByTestId('layout-sidebar__expand')).toBeNull()
    })

    it('the expand button brings a collapsed rail back', async () => {
      const { getByTestId, emitted } = render(Sidebar, {
        props: { collapsible: true, collapsed: true },
        slots: { default: '<a href="/">Home</a>' }
      })

      await fireEvent.click(await waitFor(() => getByTestId('layout-sidebar__expand-button')))
      expect(emitted()['update:collapsed']?.at(-1)).toEqual([false])
    })

    it('renders a named, focusable separator as the drag handle', () => {
      const { getByTestId, getByRole } = render(Sidebar, {
        props: { resizable: true, resizeAriaLabel: 'Resize navigation' },
        slots: { default: '<a href="/">Home</a>' }
      })

      const handle = getByTestId('layout-sidebar__handle')
      expect(handle).toBe(getByRole('separator', { name: 'Resize navigation' }))
      expect(handle.getAttribute('tabindex')).toBe('0')
      expect(handle.getAttribute('aria-orientation')).toBe('vertical')
    })

    it('arrow keys on the handle nudge the width, the keyboard equivalent of the drag', async () => {
      const { getByTestId, emitted } = render(Sidebar, {
        props: { resizable: true, width: 300 },
        slots: { default: '<a href="/">Home</a>' }
      })

      const handle = getByTestId('layout-sidebar__handle')
      handle.focus()
      await userEvent.keyboard('{ArrowRight}')

      expect(emitted()['update:width']?.at(-1)).toEqual([316])

      await userEvent.keyboard('{ArrowLeft}')
      expect(emitted()['update:width']?.at(-1)).toEqual([300])
    })

    it('the nudge clamps to the token bounds instead of running past them', async () => {
      const { getByTestId, emitted } = render(Sidebar, {
        props: { resizable: true, width: 400 },
        slots: { default: '<a href="/">Home</a>' }
      })

      getByTestId('layout-sidebar__handle').focus()
      await userEvent.keyboard('{ArrowRight}')

      expect(emitted()['update:width']?.at(-1)).toEqual([408])
    })

    it('double-clicking the handle collapses the rail', async () => {
      const { getByTestId, emitted } = render(Sidebar, {
        props: { resizable: true, collapsible: true },
        slots: { default: '<a href="/">Home</a>' }
      })

      await fireEvent.dblClick(getByTestId('layout-sidebar__handle'))
      expect(emitted()['update:collapsed']?.at(-1)).toEqual([true])
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
          collapsed: true,
          ariaLabel: 'Console'
        },
        slots: { default: '<a href="/">Home</a>' }
      })
      await expectNoA11yViolations(closed.container)
    })

    it('Resizable story renders the handle, the trigger and a sized rail', async () => {
      const { getByTestId } = render(Resizable)

      expect(getByTestId('layout-sidebar__handle')).toBeTruthy()
      expect(getByTestId('layout-sidebar__collapse')).toBeTruthy()
      await waitFor(() => expect(getByTestId('layout-sidebar').style.width).not.toBe(''))
    })
  })

  describe('side prop (a trailing rail is the same component)', () => {
    it('defaults to the leading edge and publishes it on the root', () => {
      const { getByTestId } = render(Sidebar)
      expect(getByTestId('layout-sidebar').getAttribute('data-side')).toBe('start')
    })

    it('publishes the trailing edge on the root', () => {
      const { getByTestId } = render(Sidebar, { props: { side: 'end' } })
      expect(getByTestId('layout-sidebar').getAttribute('data-side')).toBe('end')
    })

    it('mirrors the arrow keys: ArrowLeft GROWS a trailing rail, ArrowRight shrinks it', async () => {
      const { getByTestId, emitted } = render(Sidebar, {
        props: { side: 'end', resizable: true, width: 300 },
        slots: { default: '<a href="/">Home</a>' }
      })

      getByTestId('layout-sidebar__handle').focus()
      await userEvent.keyboard('{ArrowLeft}')
      expect(emitted()['update:width']?.at(-1)).toEqual([316])

      await userEvent.keyboard('{ArrowRight}')
      expect(emitted()['update:width']?.at(-1)).toEqual([300])
    })

    it('mirrors the drag: moving the pointer LEFT grows a trailing rail', async () => {
      const { getByTestId, emitted } = render(Sidebar, {
        props: { side: 'end', resizable: true, width: 300 },
        slots: { default: '<a href="/">Home</a>' }
      })

      const handle = getByTestId('layout-sidebar__handle')
      await fireEvent.pointerDown(handle, { clientX: 500 })
      await fireEvent.pointerMove(globalThis.window, { clientX: 460 })
      await fireEvent.pointerUp(globalThis.window)

      expect(emitted()['update:width']?.at(-1)).toEqual([340])
    })

    it('a collapsed trailing rail leaves through its own edge, and holds no tab stops', async () => {
      const { getByTestId } = render(Sidebar, {
        props: { side: 'end', resizable: true, collapsible: true, collapsed: true, width: 300 },
        slots: { default: '<a href="/">Home</a>' }
      })

      const root = getByTestId('layout-sidebar')
      expect(root.getAttribute('inert')).not.toBeNull()
      const transform = getByTestId('layout-sidebar__panel').style.transform
      expect(transform).toContain('translateX(')
      expect(transform).not.toContain('-')
    })

    it('a trailing rail has no axe violations, open or collapsed', async () => {
      const open = render(Sidebar, {
        props: { side: 'end', resizable: true, collapsible: true, ariaLabel: 'Event' },
        slots: { default: '<a href="/">Home</a>' }
      })
      await expectNoA11yViolations(open.container)
      open.unmount()

      const closed = render(Sidebar, {
        props: {
          side: 'end',
          resizable: true,
          collapsible: true,
          collapsed: true,
          ariaLabel: 'Event'
        },
        slots: { default: '<a href="/">Home</a>' }
      })
      await expectNoA11yViolations(closed.container)
    })
  })
})
