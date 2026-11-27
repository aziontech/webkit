import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent as keyboardUser } from 'vitest/browser'
import { defineComponent, ref } from 'vue'

import Default from '../../../../examples/navigation-menu/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import NavigationMenu from './index'
import NavigationMenuContent from './navigation-menu-content.vue'
import NavigationMenuItem from './navigation-menu-item.vue'
import NavigationMenuLink from './navigation-menu-link.vue'
import NavigationMenuList from './navigation-menu-list.vue'
import NavigationMenuTrigger from './navigation-menu-trigger.vue'
import NavigationMenuViewport from './navigation-menu-viewport.vue'

// Content teleports (twice: the Viewport's portal -> body, Content -> the popup
// viewport target which itself lives in body). Open/close transitions run ~400ms (slow-01), so
// state assertions poll via waitFor with a generous timeout.
const OPEN_TIMEOUT = 3000

// The runtime string-template compiler lowercases member-expression tags
// (`<NavigationMenu.Trigger>` -> `<navigation-menu.trigger>`), so — exactly like
// the FlowDiagram/Table tests — the composed tree registers the SAME component objects
// the compound exposes (identity proven in the compound-API block) under flat
// PascalCase tags the runtime compiler resolves. The rendered DOM is identical to
// the SFC dot-notation form.
const COMPONENTS = {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuViewport,
  NavigationMenuLink
}

const renderTree = (template: string) =>
  render(defineComponent({ components: COMPONENTS, template }))

// A realistic composed tree: two submenu items (Solutions/Products) each with a
// panel, plus a plain link item (Pricing). The Viewport is the overlay host that
// Content teleports into.
const COMPOSED = `
  <NavigationMenu aria-label="Primary">
    <NavigationMenuList :show-highlight="false">
      <NavigationMenuItem value="solutions">
        <NavigationMenuTrigger>
          Solutions
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

    <NavigationMenuViewport side="bottom" align="start" arrow />
  </NavigationMenu>
`

// Teleported content escapes the render container — query document.body.
const body = () => within(document.body)

afterEach(() => {
  // Portal teleports into document.body; ensure nothing leaks between tests.
  document.body
    .querySelectorAll('[data-testid="navigation-menu-portal"]')
    .forEach((node) => node.remove())
})

describe('NavigationMenu', () => {
  describe('composition, overlay and recursive', () => {
    describe('compound API — Object.assign dot-notation (index.js)', () => {
      it('attaches every public sub-component to the root compound', () => {
        expect(NavigationMenu.List).toBe(NavigationMenuList)
        expect(NavigationMenu.Item).toBe(NavigationMenuItem)
        expect(NavigationMenu.Trigger).toBe(NavigationMenuTrigger)
        expect(NavigationMenu.Content).toBe(NavigationMenuContent)
        expect(NavigationMenu.Viewport).toBe(NavigationMenuViewport)
      })

      it('attaches the shadcn parts only: the overlay chain lives inside the Viewport', () => {
        const members = Object.keys(NavigationMenu).filter((key) => /^[A-Z]/.test(key))
        expect(members.sort()).toEqual(['Content', 'Item', 'Link', 'List', 'Trigger', 'Viewport'])
      })

      it('renders the overlay chain from one Viewport, with the arrow and backdrop on request', () => {
        renderTree(
          `<NavigationMenu><NavigationMenuList :show-highlight="false"><NavigationMenuItem value="a"><NavigationMenuTrigger>A</NavigationMenuTrigger><NavigationMenuContent>Panel</NavigationMenuContent></NavigationMenuItem></NavigationMenuList><NavigationMenuViewport variant="contrast" side="top" /></NavigationMenu>`
        )
        expect(body().getByTestId('navigation-menu-portal')).toBeTruthy()
        expect(body().getByTestId('navigation-menu-positioner')).toBeTruthy()
        expect(body().getByTestId('navigation-menu-popover')).toHaveAttribute(
          'data-variant',
          'contrast'
        )
        expect(body().getByTestId('navigation-menu-viewport-frame')).toBeTruthy()
        expect(body().queryByTestId('navigation-menu-arrow')).toBeNull()
        expect(body().queryByTestId('navigation-menu-backdrop')).toBeNull()
      })

      it('exposes the link part as NavigationMenu.Link', () => {
        expect(NavigationMenu.Link).toBe(NavigationMenuLink)
      })

      it('names the compound members from the anatomy (defineOptions.name)', () => {
        expect(NavigationMenu.name).toBe('NavigationMenu')
        expect(NavigationMenuList.name).toBe('NavigationMenuList')
        expect(NavigationMenuItem.name).toBe('NavigationMenuItem')
        expect(NavigationMenuTrigger.name).toBe('NavigationMenuTrigger')
        expect(NavigationMenuContent.name).toBe('NavigationMenuContent')
      })
    })

    describe('root landmark rendering (navigation-menu.vue)', () => {
      it('renders as a nav with the default aria-label, orientation and testid', () => {
        const { getByTestId } = renderTree(
          `<NavigationMenu><NavigationMenuList :show-highlight="false"><NavigationMenuItem><NavigationMenuTrigger href="https://example.com">A</NavigationMenuTrigger></NavigationMenuItem></NavigationMenuList></NavigationMenu>`
        )

        const root = getByTestId('navigation-menu')
        expect(root.tagName).toBe('NAV')
        expect(root).toHaveAttribute('aria-label', 'Main')
        expect(root).toHaveAttribute('data-orientation', 'horizontal')
        // Closed by default -> data-state="closed".
        expect(root).toHaveAttribute('data-state', 'closed')
      })

      it('honours a custom aria-label and vertical orientation', () => {
        const { getByTestId } = renderTree(
          `<NavigationMenu aria-label="Sidebar" orientation="vertical"><NavigationMenuList :show-highlight="false"><NavigationMenuItem><NavigationMenuTrigger href="https://example.com">A</NavigationMenuTrigger></NavigationMenuItem></NavigationMenuList></NavigationMenu>`
        )

        const root = getByTestId('navigation-menu')
        expect(root).toHaveAttribute('aria-label', 'Sidebar')
        expect(root).toHaveAttribute('data-orientation', 'vertical')
      })
    })

    describe('trigger a11y wiring (navigation-menu-trigger.vue)', () => {
      it('a submenu trigger renders its own chevron, which follows the open state; a link trigger has none', async () => {
        const { getByRole } = renderTree(COMPOSED)

        const trigger = getByRole('button', { name: /Solutions/ })
        const chevron = within(trigger).getByTestId('navigation-menu__icon')
        expect(chevron).toHaveAttribute('aria-hidden', 'true')
        expect(chevron).toHaveAttribute('data-state', 'closed')
        await fireEvent.click(trigger)
        await waitFor(() => expect(chevron).toHaveAttribute('data-state', 'open'), {
          timeout: OPEN_TIMEOUT
        })
        const link = getByRole('link', { name: /Pricing/ })
        expect(within(link).queryByTestId('navigation-menu__icon')).toBeNull()
      })

      it('a submenu trigger is a disclosure button with aria-expanded=false and no aria-haspopup when closed', () => {
        const { getByRole } = renderTree(COMPOSED)

        const trigger = getByRole('button', { name: /Solutions/ })
        expect(trigger.tagName).toBe('BUTTON')
        expect(trigger).toHaveAttribute('type', 'button')
        expect(trigger).not.toHaveAttribute('aria-haspopup')
        expect(trigger).toHaveAttribute('aria-expanded', 'false')
        expect(trigger).not.toHaveAttribute('aria-controls')
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
      it('clicking a submenu trigger opens the menu, flips aria-expanded/data-state, and teleports the panel to body', async () => {
        const { getByRole, getByTestId } = renderTree(COMPOSED)

        const trigger = getByRole('button', { name: /Solutions/ })
        expect(trigger).toHaveAttribute('aria-expanded', 'false')

        await userEvent.click(trigger)

        // The injected root state drives both the trigger and the root landmark.
        await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'), {
          timeout: OPEN_TIMEOUT
        })
        expect(getByTestId('navigation-menu')).toHaveAttribute('data-state', 'open')
        expect(trigger).toHaveAttribute('data-popup-open', '')

        // Content is teleported to document.body — query it there, not the container.
        // The entry link's accessible name is title + description ("App development
        // Ship faster"), so match a substring.
        const panelLink = await waitFor(
          () => body().getByRole('link', { name: /App development/ }),
          {
            timeout: OPEN_TIMEOUT
          }
        )
        expect(panelLink).toHaveAttribute('href', 'https://example.com/dev')

        const content = body().getByTestId('navigation-menu-content')
        expect(content).toHaveAttribute('role', 'region')
        expect(content).toHaveAttribute('data-state', 'open')
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

    // The keyboard model lives on the root (`onTriggerKeydown`) and reaches a button
    // trigger through the trigger's own `@keydown`. It is asserted here because the
    // forwarding is easy to break WITHOUT breaking anything else: an inline ternary
    // handler compiles to a discarded expression, which leaves `Enter`/`Space` working
    // (a native button turns those into a click) while `Escape` and the arrows go dead
    // and nothing errors.
    describe('size-aware placement (ENG-47063) — shared computePlacement geometry', () => {
      // No CSS is loaded in browser mode, so the trigger is pinned with inline styles and
      // the positioner's inline transform / CSS vars are what get asserted.
      const positioner = () => body().getByTestId('navigation-menu-positioner')

      const TALL_PANEL = (rows: number, wrapperStyle: string, dir = 'ltr') => `
      <div dir="${dir}" style="${wrapperStyle}">
        <NavigationMenu aria-label="Primary">
          <NavigationMenuList :show-highlight="false">
            <NavigationMenuItem value="solutions">
              <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuList label="Rows">
                  <NavigationMenuItem
                    v-for="i in ${rows}"
                    :key="i"
                    layout="entry"
                    :href="'https://example.com/' + i"
                    style="display:block;height:24px"
                  >Row {{ i }}</NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuViewport side="bottom" align="start" />
        </NavigationMenu>
      </div>
    `

      it('resolves side=start to the right under rtl, so a trigger on the right edge flips to end', async () => {
        const { getByRole } = renderTree(
          TALL_PANEL(2, 'position:fixed;top:120px;right:0', 'rtl').replace(
            'side="bottom" align="start"',
            'side="start" align="start"'
          )
        )
        await userEvent.click(getByRole('button', { name: /Solutions/ }))
        await waitFor(() => expect(positioner()).toHaveAttribute('data-side', 'end'), {
          timeout: OPEN_TIMEOUT
        })
        expect(positioner()).toHaveAttribute('data-align', 'start')
      })

      it('flips above the trigger when there is no room below', async () => {
        const { getByRole } = renderTree(
          TALL_PANEL(6, 'position:fixed;left:8px;right:8px;bottom:8px')
        )
        const trigger = getByRole('button', { name: /Solutions/ })
        await userEvent.click(trigger)
        await waitFor(() => expect(positioner()).toHaveAttribute('data-side', 'top'), {
          timeout: OPEN_TIMEOUT
        })
        await waitFor(
          () => {
            const pr = positioner().getBoundingClientRect()
            expect(pr.bottom).toBeLessThanOrEqual(trigger.getBoundingClientRect().top)
          },
          { timeout: OPEN_TIMEOUT }
        )
        expect(positioner()).not.toHaveAttribute('data-constrained')
      })

      // Viewport-independent guard for the flip above: a trailing line box reads as growth here.
      it('keeps the positioner box equal to the popup it carries, with no trailing line box', async () => {
        const { getByRole } = renderTree(TALL_PANEL(6, 'position:fixed;left:8px;top:8px'))
        await userEvent.click(getByRole('button', { name: /Solutions/ }))
        const popup = await waitFor(() => body().getByTestId('navigation-menu-popover'), {
          timeout: OPEN_TIMEOUT
        })
        await waitFor(
          () => {
            const p = positioner().getBoundingClientRect()
            const q = popup.getBoundingClientRect()
            expect(p.height).toBeCloseTo(q.height, 1)
            expect(p.bottom).toBeCloseTo(q.bottom, 1)
          },
          { timeout: OPEN_TIMEOUT }
        )
      })

      // A page-column pin passes the column inset on x; on y it would drop the panel off its
      // trigger by that same amount, which is invisible until the inset exceeds the side offset.
      const PINNED_PANEL = `
      <div style="position:fixed;left:0;right:0;top:8px">
        <NavigationMenu aria-label="Primary">
          <NavigationMenuList :show-highlight="false">
            <NavigationMenuItem value="solutions">
              <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuList label="Rows">
                  <NavigationMenuItem
                    layout="entry"
                    href="https://example.com/1"
                    style="display:block;height:24px"
                  >Row 1</NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuViewport side="bottom" align="start" :side-offset="12" :collision-padding="{ x: 200, y: 8 }" />
        </NavigationMenu>
      </div>
    `

      it('insets a per-axis collision padding on that axis only, keeping the panel on its trigger', async () => {
        const { getByRole } = renderTree(PINNED_PANEL)
        const trigger = getByRole('button', { name: /Solutions/ })
        await userEvent.click(trigger)
        await waitFor(() => expect(positioner()).toHaveAttribute('data-side', 'bottom'), {
          timeout: OPEN_TIMEOUT
        })
        await waitFor(
          () => {
            const panel = positioner().getBoundingClientRect()
            const anchor = trigger.getBoundingClientRect()
            // X: shifted in to the 200px inset. Y: still the trigger's edge + sideOffset,
            // NOT pushed down to the X inset.
            expect(panel.left).toBeGreaterThanOrEqual(200)
            expect(Math.round(panel.top)).toBe(Math.round(anchor.bottom + 12))
          },
          { timeout: OPEN_TIMEOUT }
        )
      })

      it('caps the popup to the free space and marks the positioner constrained when nothing fits', async () => {
        const { getByRole } = renderTree(
          TALL_PANEL(80, 'position:fixed;left:8px;right:8px;top:8px')
        )
        const trigger = getByRole('button', { name: /Solutions/ })
        await userEvent.click(trigger)
        await waitFor(() => expect(positioner()).toHaveAttribute('data-constrained', ''), {
          timeout: OPEN_TIMEOUT
        })
        const p = positioner()
        expect(p).toHaveAttribute('data-side', 'bottom')
        const available = Number.parseFloat(
          p.style.getPropertyValue('--navigation-menu-available-height')
        )
        const triggerRect = trigger.getBoundingClientRect()
        // The cap ends collisionPadding (8px) above the viewport edge, below the trigger.
        expect(available).toBeGreaterThan(0)
        expect(triggerRect.bottom + 8 + available).toBeLessThanOrEqual(window.innerHeight - 8 + 1)
      })
    })

    describe('keyboard model on a button trigger (root.onTriggerKeydown)', () => {
      it('Escape closes the open panel', async () => {
        const { getByRole, getByTestId } = renderTree(COMPOSED)

        const trigger = getByRole('button', { name: /Solutions/ })
        await userEvent.click(trigger)
        await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'), {
          timeout: OPEN_TIMEOUT
        })

        await fireEvent.keyDown(trigger, { key: 'Escape' })

        await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'), {
          timeout: OPEN_TIMEOUT
        })
        expect(getByTestId('navigation-menu')).toHaveAttribute('data-state', 'closed')
      })

      it('ArrowRight roves to the next trigger and opens it', async () => {
        const { getByRole } = renderTree(COMPOSED)

        const solutions = getByRole('button', { name: /Solutions/ })
        const products = getByRole('button', { name: /Products/ })

        await userEvent.click(solutions)
        await waitFor(() => expect(solutions).toHaveAttribute('aria-expanded', 'true'), {
          timeout: OPEN_TIMEOUT
        })

        await fireEvent.keyDown(solutions, { key: 'ArrowRight' })

        // Roving moves BOTH focus and the open value onto the next trigger.
        await waitFor(() => expect(products).toHaveAttribute('aria-expanded', 'true'), {
          timeout: OPEN_TIMEOUT
        })
        expect(document.activeElement).toBe(products)
        expect(solutions).toHaveAttribute('aria-expanded', 'false')
      })

      it('arrows reach the plain links of the bar in document order and wrap', async () => {
        const { getByRole } = render(Default)
        const solutions = getByRole('button', { name: /Solutions/ })
        const products = getByRole('button', { name: /Products/ })
        const pricing = getByRole('link', { name: /Pricing/ })
        const contact = getByRole('link', { name: /Contact/ })

        solutions.focus()
        await userEvent.keyboard('{ArrowRight}')
        expect(document.activeElement).toBe(products)
        await userEvent.keyboard('{ArrowRight}')
        expect(document.activeElement).toBe(pricing)
        await waitFor(() => expect(products).toHaveAttribute('aria-expanded', 'false'), {
          timeout: OPEN_TIMEOUT
        })
        await userEvent.keyboard('{ArrowRight}')
        expect(document.activeElement).toBe(contact)
        await userEvent.keyboard('{ArrowRight}')
        expect(document.activeElement).toBe(solutions)
        await userEvent.keyboard('{ArrowLeft}')
        expect(document.activeElement).toBe(contact)
      })
    })

    describe('events on real user actions (navigation-menu.vue emits)', () => {
      it('emits update:modelValue with the item value when a submenu opens', async () => {
        const updateValues: Array<unknown> = []

        const Wrapped = defineComponent({
          components: COMPONENTS,
          setup() {
            return {
              onUpdate: (v: unknown) => updateValues.push(v)
            }
          },
          template: `
          <NavigationMenu @update:modelValue="onUpdate">
            <NavigationMenuList :show-highlight="false">
              <NavigationMenuItem value="solutions">
                <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>Panel</NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuViewport />
          </NavigationMenu>
        `
        })

        const { getByRole } = render(Wrapped)

        await userEvent.click(getByRole('button', { name: 'Solutions' }))
        await waitFor(() => expect(updateValues).toContain('solutions'), {
          timeout: OPEN_TIMEOUT
        })
      })

      it('emits update:modelValue(null) when the Backdrop is clicked (root.close)', async () => {
        const updateValues: Array<unknown> = []

        const Wrapped = defineComponent({
          components: COMPONENTS,
          setup() {
            const value = ref<string | null>('solutions')
            return {
              value,
              onUpdate: (v: unknown) => updateValues.push(v)
            }
          },
          template: `
          <NavigationMenu v-model="value" @update:modelValue="onUpdate">
            <NavigationMenuList :show-highlight="false">
              <NavigationMenuItem value="solutions">
                <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                <NavigationMenuContent>Panel</NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuViewport backdrop />
          </NavigationMenu>
        `
        })

        const { getByRole } = render(Wrapped)
        const trigger = getByRole('button', { name: 'Solutions' })
        // Controlled-open from the start.
        await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'), {
          timeout: OPEN_TIMEOUT
        })

        const backdrop = body().getByTestId('navigation-menu-backdrop')
        await fireEvent.click(backdrop)

        await waitFor(() => expect(updateValues).toContain(null), {
          timeout: OPEN_TIMEOUT
        })
        await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'false'), {
          timeout: OPEN_TIMEOUT
        })
      })
    })

    describe('v-model round-trip (controlled)', () => {
      it('an external value opens the matching panel; an entry click writes back null', async () => {
        const controlled = ref<string | null>(null)

        const Controlled = defineComponent({
          components: COMPONENTS,
          setup() {
            return { controlled }
          },
          template: `
          <NavigationMenu v-model="controlled">
            <NavigationMenuList :show-highlight="false">
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
            <NavigationMenuViewport />
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
      it('renders the nested panel list group with its group heading and entry rows two levels deep', async () => {
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
            `<NavigationMenu orientation="${orientation}"><NavigationMenuList :show-highlight="false"><NavigationMenuItem><NavigationMenuTrigger href="https://example.com">A</NavigationMenuTrigger></NavigationMenuItem></NavigationMenuList></NavigationMenu>`
          )
          expect(getByTestId('navigation-menu')).toHaveAttribute('data-orientation', orientation)
        }
      )
    })

    describe('documented example integration', () => {
      it('renders the Default story composition without error', () => {
        const { getByRole } = render(Default)
        expect(getByRole('navigation', { name: 'Acme' })).toBeTruthy()
      })

      it('fills both columns of the Solutions panel', async () => {
        const { getByRole } = render(Default)
        await userEvent.click(getByRole('button', { name: /Solutions/ }))
        await waitFor(
          () => {
            expect(within(document.body).getByText('By use case')).toBeTruthy()
            expect(within(document.body).getByText('By industry')).toBeTruthy()
          },
          { timeout: OPEN_TIMEOUT }
        )
      })

      it('grows every trigger to the 44px touch height on a coarse pointer', () => {
        const { getByRole } = render(Default)
        for (const trigger of [
          getByRole('button', { name: /Solutions/ }),
          getByRole('button', { name: /Products/ }),
          getByRole('link', { name: /Pricing/ })
        ])
          expect(trigger.classList).toContain('pointer-coarse:min-h-11')
      })
    })
  })

  describe('keyboard map (spec)', () => {
    const setup = async () => {
      const view = renderTree(COMPOSED)
      const solutions = view.getByRole('button', { name: /Solutions/ })
      const products = view.getByRole('button', { name: /Products/ })
      solutions.focus()
      return { ...view, solutions, products }
    }

    const expanded = (el: HTMLElement, value: 'true' | 'false') =>
      waitFor(() => expect(el).toHaveAttribute('aria-expanded', value), { timeout: OPEN_TIMEOUT })

    const focusedText = () => (document.activeElement as HTMLElement | null)?.textContent ?? ''

    it.each(['{Enter}', ' '])('%s on a trigger toggles its panel', async (key) => {
      const { solutions } = await setup()
      await keyboardUser.keyboard(key)
      await expanded(solutions, 'true')
      await keyboardUser.keyboard(key)
      await expanded(solutions, 'false')
    })

    it('ArrowRight and ArrowLeft move between triggers, the Pricing link included, and wrap', async () => {
      const { solutions, products } = await setup()
      const pricing = document.body.querySelector<HTMLElement>('a[href*="pricing"]')!
      await keyboardUser.keyboard('{ArrowRight}')
      expect(document.activeElement).toBe(products)
      await keyboardUser.keyboard('{ArrowRight}')
      expect(document.activeElement).toBe(pricing)
      await keyboardUser.keyboard('{ArrowRight}')
      expect(document.activeElement).toBe(solutions)
      await keyboardUser.keyboard('{ArrowLeft}')
      expect(document.activeElement).toBe(pricing)
    })

    it('ArrowDown on a trigger opens its panel and focuses the first entry', async () => {
      const { solutions } = await setup()
      await keyboardUser.keyboard('{ArrowDown}')
      await expanded(solutions, 'true')
      await waitFor(() => expect(focusedText()).toContain('App development'), {
        timeout: OPEN_TIMEOUT
      })
    })

    it('Tab on the trigger of an open panel moves into the panel', async () => {
      const { solutions } = await setup()
      await keyboardUser.keyboard('{Enter}')
      await expanded(solutions, 'true')
      await keyboardUser.keyboard('{Tab}')
      await waitFor(() => expect(focusedText()).toContain('App development'), {
        timeout: OPEN_TIMEOUT
      })
    })

    it('ArrowDown and ArrowUp move between panel entries and wrap', async () => {
      const { solutions } = await setup()
      await keyboardUser.keyboard('{ArrowDown}')
      await expanded(solutions, 'true')
      await waitFor(() => expect(focusedText()).toContain('App development'), {
        timeout: OPEN_TIMEOUT
      })
      await keyboardUser.keyboard('{ArrowDown}')
      expect(focusedText()).toContain('See all')
      await keyboardUser.keyboard('{ArrowDown}')
      expect(focusedText()).toContain('App development')
      await keyboardUser.keyboard('{ArrowUp}')
      expect(focusedText()).toContain('See all')
    })

    it('Escape in the panel closes it and returns focus to its trigger', async () => {
      const { solutions } = await setup()
      await keyboardUser.keyboard('{ArrowDown}')
      await waitFor(() => expect(focusedText()).toContain('App development'), {
        timeout: OPEN_TIMEOUT
      })
      await keyboardUser.keyboard('{Escape}')
      await expanded(solutions, 'false')
      expect(document.activeElement).toBe(solutions)
    })

    it('Shift+Tab on the first entry returns focus to the trigger', async () => {
      const { solutions } = await setup()
      await keyboardUser.keyboard('{ArrowDown}')
      await waitFor(() => expect(focusedText()).toContain('App development'), {
        timeout: OPEN_TIMEOUT
      })
      await keyboardUser.keyboard('{Shift>}{Tab}{/Shift}')
      expect(document.activeElement).toBe(solutions)
    })

    it('Tab on the last entry closes the panel and moves on to the next trigger', async () => {
      const { solutions, products } = await setup()
      await keyboardUser.keyboard('{ArrowDown}')
      await waitFor(() => expect(focusedText()).toContain('App development'), {
        timeout: OPEN_TIMEOUT
      })
      await keyboardUser.keyboard('{End}')
      expect(focusedText()).toContain('See all')
      await keyboardUser.keyboard('{Tab}')
      await expanded(solutions, 'false')
      expect(document.activeElement).toBe(products)
    })

    it('Escape on a trigger closes its open panel', async () => {
      const { solutions } = await setup()
      await keyboardUser.keyboard('{Enter}')
      await expanded(solutions, 'true')
      await keyboardUser.keyboard('{Escape}')
      await expanded(solutions, 'false')
      expect(document.activeElement).toBe(solutions)
    })
  })

  describe('audit fixes', () => {
    it('forwards consumer attributes to the nav landmark', () => {
      const { getByTestId } = renderTree(
        `<NavigationMenu id="site-header-section" aria-labelledby="nav-heading" data-track="nav"><NavigationMenuList :show-highlight="false"><NavigationMenuItem><NavigationMenuTrigger href="https://example.com">A</NavigationMenuTrigger></NavigationMenuItem></NavigationMenuList></NavigationMenu>`
      )
      const root = getByTestId('navigation-menu')
      expect(root.id).toBe('site-header-section')
      expect(root).toHaveAttribute('aria-labelledby', 'nav-heading')
      expect(root).toHaveAttribute('data-track', 'nav')
    })

    it('slides the list highlight with translate, not top and left', async () => {
      const { getByRole, getAllByTestId } = renderTree(
        COMPOSED.replace('<NavigationMenuList :show-highlight="false">', '<NavigationMenuList>')
      )
      await fireEvent.pointerEnter(getByRole('button', { name: /Solutions/ }))
      const selector = getAllByTestId('navigation-menu-list__selector')[0]!
      await waitFor(() => expect(selector.style.translate).toMatch(/px/))
      expect(selector.style.top).toBe('')
      expect(selector.style.left).toBe('')
      expect(selector.classList.contains('transition-[translate,opacity]')).toBe(true)
    })

    it('names the open panel with aria-controls on its trigger', async () => {
      const { getByRole } = renderTree(COMPOSED)
      const trigger = getByRole('button', { name: /Solutions/ })
      await userEvent.click(trigger)
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'), {
        timeout: OPEN_TIMEOUT
      })
      const id = trigger.getAttribute('aria-controls')
      expect(id).toBeTruthy()
      expect(document.getElementById(id as string)).toBe(
        body().getByTestId('navigation-menu-content')
      )
    })

    it('always renders the trigger as a button, even with a removed native-button attribute', async () => {
      const { getByRole } = renderTree(
        COMPOSED.replace(
          '<NavigationMenuTrigger>',
          '<NavigationMenuTrigger :native-button="false">'
        )
      )
      const trigger = getByRole('button', { name: /Solutions/ })
      expect(trigger.tagName).toBe('BUTTON')
      trigger.focus()
      await keyboardUser.keyboard('{Enter}')
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'), {
        timeout: OPEN_TIMEOUT
      })
    })

    it('renders NavigationMenu.Link as an anchor, and as a trigger button without href', () => {
      const { getByRole } = renderTree(
        `<NavigationMenu><NavigationMenuList :show-highlight="false"><NavigationMenuItem><NavigationMenuLink href="https://example.com/pricing" active>Pricing</NavigationMenuLink></NavigationMenuItem><NavigationMenuItem value="more"><NavigationMenuLink>More</NavigationMenuLink></NavigationMenuItem></NavigationMenuList></NavigationMenu>`
      )
      const link = getByRole('link', { name: 'Pricing' })
      expect(link).toHaveAttribute('href', 'https://example.com/pricing')
      expect(link).toHaveAttribute('aria-current', 'page')
      expect(getByRole('button', { name: 'More' })).toHaveAttribute('aria-expanded', 'false')
    })

    it('has no axe violations closed, open and vertical', async () => {
      const closed = renderTree(COMPOSED)
      await expectNoA11yViolations(closed.container)
      const trigger = closed.getByRole('button', { name: /Solutions/ })
      await userEvent.click(trigger)
      await waitFor(() => expect(trigger).toHaveAttribute('aria-expanded', 'true'), {
        timeout: OPEN_TIMEOUT
      })
      await expectNoA11yViolations(document.body)
      closed.unmount()

      const vertical = renderTree(
        COMPOSED.replace(
          '<NavigationMenu aria-label="Primary">',
          '<NavigationMenu aria-label="Primary" orientation="vertical">'
        )
      )
      await expectNoA11yViolations(vertical.container)
    })
  })
})
