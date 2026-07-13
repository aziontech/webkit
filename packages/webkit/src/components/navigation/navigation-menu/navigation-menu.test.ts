import { userEvent } from '@storybook/test'
import { composeStories } from '@storybook/vue3'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/navigation/navigation-menu/NavigationMenu.stories'
import NavigationMenu from './index'
import NavigationMenuArrow from './navigation-menu-arrow.vue'
import NavigationMenuBackdrop from './navigation-menu-backdrop.vue'
import NavigationMenuContent from './navigation-menu-content.vue'
import NavigationMenuIcon from './navigation-menu-icon.vue'
import NavigationMenuItem from './navigation-menu-item.vue'
import NavigationMenuList from './navigation-menu-list.vue'
import NavigationMenuPopup from './navigation-menu-popup.vue'
import NavigationMenuPortal from './navigation-menu-portal.vue'
import NavigationMenuPositioner from './navigation-menu-positioner.vue'
import NavigationMenuTrigger from './navigation-menu-trigger.vue'
import NavigationMenuViewport from './navigation-menu-viewport.vue'

// Content teleports (twice: Portal -> body, Content -> the popup viewport target
// which itself lives in body). Open/close transitions run ~400ms (slow-01), so
// state assertions poll via waitFor with a generous timeout.
const OPEN_TIMEOUT = 3000

const { Default } = composeStories(stories)

// The runtime string-template compiler lowercases member-expression tags
// (`<NavigationMenu.Trigger>` -> `<navigation-menu.trigger>`), so — exactly like
// the Flow/Table tests — the composed tree registers the SAME component objects
// the compound exposes (identity proven in the compound-API block) under flat
// PascalCase tags the runtime compiler resolves. The rendered DOM is identical to
// the SFC dot-notation form.
const COMPONENTS = {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuIcon,
  NavigationMenuContent,
  NavigationMenuPortal,
  NavigationMenuPositioner,
  NavigationMenuPopup,
  NavigationMenuViewport,
  NavigationMenuArrow,
  NavigationMenuBackdrop
}

const renderTree = (template: string) =>
  render(defineComponent({ components: COMPONENTS, template }))

// A realistic composed tree: two submenu items (Solutions/Products) each with a
// panel, plus a plain link item (Pricing). Portal -> Positioner -> Popup ->
// Viewport is the overlay host that Content teleports into.
const COMPOSED = `
  <NavigationMenu aria-label="Primary">
    <NavigationMenuList :highlight="false">
      <NavigationMenuItem value="solutions">
        <NavigationMenuTrigger>
          Solutions
          <NavigationMenuIcon><span>v</span></NavigationMenuIcon>
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuList label="By use case">
            <NavigationMenuItem
              layout="entry"
              href="https://example.com/dev"
              description="Ship faster"
              close-on-click
            >App development</NavigationMenuItem>
            <NavigationMenuItem
              layout="entry"
              href="https://example.com/all"
              featured
            >See all</NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenuContent>
      </NavigationMenuItem>

      <NavigationMenuItem value="products">
        <NavigationMenuTrigger>Products</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuList label="Build">
            <NavigationMenuItem
              layout="entry"
              href="https://example.com/functions"
            >Functions</NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenuContent>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuTrigger href="https://example.com/pricing" active>
          Pricing
        </NavigationMenuTrigger>
      </NavigationMenuItem>
    </NavigationMenuList>

    <NavigationMenuPortal>
      <NavigationMenuPositioner side="bottom" align="start">
        <NavigationMenuPopup>
          <NavigationMenuArrow />
          <NavigationMenuViewport />
        </NavigationMenuPopup>
      </NavigationMenuPositioner>
    </NavigationMenuPortal>
  </NavigationMenu>
`

// Teleported content escapes the render container — query document.body.
const body = () => within(document.body)

afterEach(() => {
  // Portal teleports into document.body; ensure nothing leaks between tests.
  document.body
    .querySelectorAll('[data-testid="navigation-menu__portal"]')
    .forEach((node) => node.remove())
})

describe('NavigationMenu (composition + overlay + recursive)', () => {
  describe('compound API — Object.assign dot-notation (index.js)', () => {
    it('attaches every public sub-component to the root compound', () => {
      // index.js attaches these members onto the root (NavigationMenuRoot).
      expect(NavigationMenu.List).toBe(NavigationMenuList)
      expect(NavigationMenu.Item).toBe(NavigationMenuItem)
      expect(NavigationMenu.Trigger).toBe(NavigationMenuTrigger)
      expect(NavigationMenu.Icon).toBe(NavigationMenuIcon)
      expect(NavigationMenu.Content).toBe(NavigationMenuContent)
      expect(NavigationMenu.Portal).toBe(NavigationMenuPortal)
      expect(NavigationMenu.Backdrop).toBe(NavigationMenuBackdrop)
      expect(NavigationMenu.Positioner).toBe(NavigationMenuPositioner)
      expect(NavigationMenu.Popup).toBe(NavigationMenuPopup)
      expect(NavigationMenu.Viewport).toBe(NavigationMenuViewport)
      expect(NavigationMenu.Arrow).toBe(NavigationMenuArrow)
    })

    it('aliases Link to the Trigger sub-component (index.js: NavigationMenu.Link = NavigationMenuTrigger)', () => {
      expect(NavigationMenu.Link).toBe(NavigationMenuTrigger)
    })

    it('names the compound members from the anatomy (defineOptions.name)', () => {
      expect(NavigationMenu.name).toBe('NavigationMenu')
      expect(NavigationMenuList.name).toBe('NavigationMenuList')
      expect(NavigationMenuItem.name).toBe('NavigationMenuItem')
      expect(NavigationMenuTrigger.name).toBe('NavigationMenuTrigger')
      expect(NavigationMenuContent.name).toBe('NavigationMenuContent')
    })
  })

  describe('root landmark rendering (navigation-menu-root.vue)', () => {
    it('renders as a nav with the default aria-label, orientation and testid', () => {
      const { getByTestId } = renderTree(
        `<NavigationMenu><NavigationMenuList :highlight="false"><NavigationMenuItem><NavigationMenuTrigger href="https://example.com">A</NavigationMenuTrigger></NavigationMenuItem></NavigationMenuList></NavigationMenu>`
      )

      const root = getByTestId('navigation-menu')
      expect(root.tagName).toBe('NAV')
      expect(root).toHaveAttribute('aria-label', 'Main')
      expect(root).toHaveAttribute('data-orientation', 'horizontal')
      // Closed by default -> no data-open.
      expect(root).not.toHaveAttribute('data-open')
    })

    it('honours a custom aria-label and vertical orientation', () => {
      const { getByTestId } = renderTree(
        `<NavigationMenu aria-label="Sidebar" orientation="vertical"><NavigationMenuList :highlight="false"><NavigationMenuItem><NavigationMenuTrigger href="https://example.com">A</NavigationMenuTrigger></NavigationMenuItem></NavigationMenuList></NavigationMenu>`
      )

      const root = getByTestId('navigation-menu')
      expect(root).toHaveAttribute('aria-label', 'Sidebar')
      expect(root).toHaveAttribute('data-orientation', 'vertical')
    })
  })

  describe('trigger a11y wiring (navigation-menu-trigger.vue)', () => {
    it('a submenu trigger is a button with aria-haspopup and aria-expanded=false when closed', () => {
      const { getByRole } = renderTree(COMPOSED)

      const trigger = getByRole('button', { name: /Solutions/ })
      expect(trigger.tagName).toBe('BUTTON')
      expect(trigger).toHaveAttribute('type', 'button')
      expect(trigger).toHaveAttribute('aria-haspopup', 'true')
      expect(trigger).toHaveAttribute('aria-expanded', 'false')
    })

    it('a plain link trigger renders as an anchor with aria-current when active (no aria-expanded/haspopup)', () => {
      const { getByRole } = renderTree(COMPOSED)

      const link = getByRole('link', { name: /Pricing/ })
      expect(link.tagName).toBe('A')
      expect(link).toHaveAttribute('href', 'https://example.com/pricing')
      expect(link).toHaveAttribute('aria-current', 'page')
      expect(link).not.toHaveAttribute('aria-expanded')
      expect(link).not.toHaveAttribute('aria-haspopup')
    })
  })

  describe('overlay open via injected root state + Teleport', () => {
    it('clicking a submenu trigger opens the menu, flips aria-expanded/data-open, and teleports the panel to body', async () => {
      const { getByRole, getByTestId } = renderTree(COMPOSED)

      const trigger = getByRole('button', { name: /Solutions/ })
      expect(trigger).toHaveAttribute('aria-expanded', 'false')

      await userEvent.click(trigger)

      // The injected root state drives both the trigger and the root landmark.
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'), {
        timeout: OPEN_TIMEOUT
      })
      expect(getByTestId('navigation-menu')).toHaveAttribute('data-open', '')
      expect(trigger).toHaveAttribute('data-popup-open', '')

      // Content is teleported to document.body — query it there, not the container.
      // The entry link's accessible name is title + description ("App development
      // Ship faster"), so match a substring.
      const panelLink = await waitFor(() => body().getByRole('link', { name: /App development/ }), {
        timeout: OPEN_TIMEOUT
      })
      expect(panelLink).toHaveAttribute('href', 'https://example.com/dev')

      const content = body().getByTestId('navigation-menu__content')
      expect(content).toHaveAttribute('role', 'region')
      expect(content).toHaveAttribute('data-open', '')
    })

    it('switching from one open submenu to another moves aria-expanded to the new trigger', async () => {
      const { getByRole } = renderTree(COMPOSED)

      const solutions = getByRole('button', { name: /Solutions/ })
      const products = getByRole('button', { name: /Products/ })

      await userEvent.click(solutions)
      await waitFor(() => expect(solutions).toHaveAttribute('aria-expanded', 'true'), {
        timeout: OPEN_TIMEOUT
      })

      await userEvent.click(products)
      await waitFor(() => expect(products).toHaveAttribute('aria-expanded', 'true'), {
        timeout: OPEN_TIMEOUT
      })
      // The open value is a single scalar — only one item can be open at a time.
      expect(solutions).toHaveAttribute('aria-expanded', 'false')
    })
  })

  describe('events on real user actions (navigation-menu-root.vue emits)', () => {
    it('emits update:value and value-change with the item value when a submenu opens', async () => {
      const updateValues: Array<unknown> = []
      const changeValues: Array<unknown> = []

      const Wrapped = defineComponent({
        components: COMPONENTS,
        setup() {
          return {
            onUpdate: (v: unknown) => updateValues.push(v),
            onChange: (v: unknown) => changeValues.push(v)
          }
        },
        template: `
          <NavigationMenu @update:value="onUpdate" @value-change="onChange">
            <NavigationMenuList :highlight="false">
              <NavigationMenuItem value="solutions">
                <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>Panel</NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuPortal>
              <NavigationMenuPositioner>
                <NavigationMenuPopup><NavigationMenuViewport /></NavigationMenuPopup>
              </NavigationMenuPositioner>
            </NavigationMenuPortal>
          </NavigationMenu>
        `
      })

      const { getByRole } = render(Wrapped)

      await userEvent.click(getByRole('button', { name: 'Solutions' }))
      await waitFor(() => expect(updateValues).toContain('solutions'), {
        timeout: OPEN_TIMEOUT
      })
      expect(changeValues).toContain('solutions')
    })

    it('emits update:value(null) / value-change(null) when the Backdrop is clicked (root.close)', async () => {
      const updateValues: Array<unknown> = []
      const changeValues: Array<unknown> = []

      const Wrapped = defineComponent({
        components: COMPONENTS,
        setup() {
          const value = ref<string | null>('solutions')
          return {
            value,
            onUpdate: (v: unknown) => updateValues.push(v),
            onChange: (v: unknown) => changeValues.push(v)
          }
        },
        template: `
          <NavigationMenu v-model:value="value" @update:value="onUpdate" @value-change="onChange">
            <NavigationMenuList :highlight="false">
              <NavigationMenuItem value="solutions">
                <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>Panel</NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuPortal>
              <NavigationMenuPositioner>
                <NavigationMenuPopup>
                  <NavigationMenuBackdrop />
                  <NavigationMenuViewport />
                </NavigationMenuPopup>
              </NavigationMenuPositioner>
            </NavigationMenuPortal>
          </NavigationMenu>
        `
      })

      const { getByRole } = render(Wrapped)
      const trigger = getByRole('button', { name: 'Solutions' })
      // Controlled-open from the start.
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'), {
        timeout: OPEN_TIMEOUT
      })

      const backdrop = body().getByTestId('navigation-menu__backdrop')
      await fireEvent.click(backdrop)

      await waitFor(() => expect(updateValues).toContain(null), {
        timeout: OPEN_TIMEOUT
      })
      expect(changeValues).toContain(null)
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'), {
        timeout: OPEN_TIMEOUT
      })
    })
  })

  describe('v-model:value round-trip (controlled)', () => {
    it('an external value opens the matching panel; an entry click writes back null', async () => {
      const controlled = ref<string | null>(null)

      const Controlled = defineComponent({
        components: COMPONENTS,
        setup() {
          return { controlled }
        },
        template: `
          <NavigationMenu v-model:value="controlled">
            <NavigationMenuList :highlight="false">
              <NavigationMenuItem value="solutions">
                <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <NavigationMenuList label="By use case">
                    <NavigationMenuItem
                      layout="entry"
                      href="https://example.com/dev"
                      close-on-click
                    >App development</NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuPortal>
              <NavigationMenuPositioner>
                <NavigationMenuPopup><NavigationMenuViewport /></NavigationMenuPopup>
              </NavigationMenuPositioner>
            </NavigationMenuPortal>
          </NavigationMenu>
        `
      })

      const { getByRole } = render(Controlled)
      const trigger = getByRole('button', { name: 'Solutions' })
      expect(trigger).toHaveAttribute('aria-expanded', 'false')

      // Drive the model from the outside (controlled mode) -> panel opens.
      controlled.value = 'solutions'
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'), {
        timeout: OPEN_TIMEOUT
      })
      const entry = await waitFor(() => body().getByRole('link', { name: /App development/ }), {
        timeout: OPEN_TIMEOUT
      })

      // A close-on-click entry link fires setValue(null) -> writes back through
      // v-model. Prevent real navigation on the anchor in the browser.
      entry.addEventListener('click', (event) => event.preventDefault())
      await fireEvent.click(entry)

      await waitFor(() => expect(controlled.value).toBe(null), {
        timeout: OPEN_TIMEOUT
      })
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'), {
        timeout: OPEN_TIMEOUT
      })
    })
  })

  describe('recursive / nested composition (list -> item -> content -> list -> entry)', () => {
    it('renders the nested panel list group with its overline heading and entry rows two levels deep', async () => {
      const { getByRole } = renderTree(COMPOSED)
      const trigger = getByRole('button', { name: /Solutions/ })

      await userEvent.click(trigger)

      // The nested NavigationMenuList (label="By use case") renders a role=group
      // with an aria-labelledby heading, and entry <a> rows inside it — all
      // teleported into the popup viewport in document.body.
      const group = await waitFor(() => body().getByRole('group'), {
        timeout: OPEN_TIMEOUT
      })
      expect(group).toHaveAttribute('aria-labelledby')
      const labelId = group.getAttribute('aria-labelledby') as string
      const heading = document.getElementById(labelId)
      expect(heading?.textContent).toContain('By use case')

      // Both entry rows render inside the nested list; the featured "See all" has
      // no description so its accessible name is exact.
      expect(body().getByRole('link', { name: /App development/ })).toBeTruthy()
      const seeAll = body().getByRole('link', { name: 'See all' })
      expect(seeAll).toHaveAttribute('href', 'https://example.com/all')
      expect(seeAll).toHaveAttribute('data-featured', '')
    })
  })

  describe('smoke over orientation variants (floor only)', () => {
    it.each(['horizontal', 'vertical'] as const)(
      'renders the root landmark for orientation=%s',
      (orientation) => {
        const { getByTestId } = renderTree(
          `<NavigationMenu orientation="${orientation}"><NavigationMenuList :highlight="false"><NavigationMenuItem><NavigationMenuTrigger href="https://example.com">A</NavigationMenuTrigger></NavigationMenuItem></NavigationMenuList></NavigationMenu>`
        )
        expect(getByTestId('navigation-menu')).toHaveAttribute('data-orientation', orientation)
      }
    )
  })

  describe('story integration (composeStories)', () => {
    it('renders the Default story composition without error', () => {
      const { getByTestId } = render(Default())
      expect(getByTestId('navigation-menu-demo')).toBeTruthy()
    })
  })
})
