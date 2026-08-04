import { userEvent } from '@storybook/test'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import Menu, {
  MenuBack,
  MenuGroup,
  type MenuGroupNode,
  MenuItem,
  type MenuNode,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger
} from './index'

const COMPONENTS = { Menu, MenuBack, MenuGroup, MenuItem, MenuSub, MenuSubContent, MenuSubTrigger }

/**
 * The console-style tree from the spec's Usage block: two titled groups, the second
 * plain group holding an inline sub and a drill sub. `inlineOpen` / `disabled`
 * flip the two states the assertions need.
 */
const composed = (
  props: Record<string, unknown> = {},
  options: { inlineOpen?: boolean; disabled?: boolean } = {}
) =>
  defineComponent({
    components: COMPONENTS,
    setup: () => ({
      props,
      inlineOpen: options.inlineOpen ?? false,
      disabled: options.disabled ?? false
    }),
    template: `
      <Menu v-bind="props" aria-label="Console navigation">
        <MenuBack />
        <MenuGroup label="User agents">
          <MenuItem label="End User" icon="pi pi-user" href="/end-user" />
          <MenuItem label="Web Browser" href="/web-browser" />
        </MenuGroup>
        <MenuGroup label="Azion platform">
          <MenuSub :default-open="inlineOpen">
            <MenuSubTrigger label="Getting started" kind="inline" />
            <MenuSubContent>
              <MenuItem label="Installation" href="/docs/install" />
            </MenuSubContent>
          </MenuSub>
          <MenuSub>
            <MenuSubTrigger label="Settings" kind="drill" :disabled="disabled" />
            <MenuSubContent>
              <MenuGroup label="Account">
                <MenuItem label="General" href="/settings/general" />
              </MenuGroup>
            </MenuSubContent>
          </MenuSub>
        </MenuGroup>
      </Menu>
    `
  })

const GROUPS: MenuGroupNode[] = [
  {
    label: 'User agents',
    items: [
      { id: 'end-user', label: 'End User', icon: 'pi pi-user', href: '/end-user' },
      { id: 'web-browser', label: 'Web Browser', href: '/web-browser' }
    ]
  },
  {
    label: 'Azion platform',
    items: [
      {
        id: 'settings',
        label: 'Settings',
        kind: 'drill',
        children: [{ id: 'general', label: 'General', href: '/settings/general' }]
      },
      { id: 'blocked', label: 'Blocked', href: '/blocked', disabled: true }
    ]
  }
]

/**
 * The data-driven tree with its drill level ALREADY on the stack, the way a consumer that
 * persists `path` hands it back after its host remounted. No push ever ran here.
 */
const restored = (options: { enterOnMount?: boolean } = {}) =>
  defineComponent({
    components: COMPONENTS,
    setup: () => ({ groups: GROUPS, enterOnMount: options.enterOnMount ?? false }),
    template: `
      <Menu
        :groups="groups"
        :path="['settings']"
        :enter-on-mount="enterOnMount"
        aria-label="Console navigation"
      >
        <MenuBack />
      </Menu>
    `
  })

describe('Menu (composition, drill stack + data mode)', () => {
  // ---- Compound API ------------------------------------------------------------
  it('attaches every sub-component to the compound root for dot-notation', () => {
    expect(Menu.Group).toBe(MenuGroup)
    expect(Menu.Item).toBe(MenuItem)
    expect(Menu.Sub).toBe(MenuSub)
    expect(Menu.SubTrigger).toBe(MenuSubTrigger)
    expect(Menu.SubContent).toBe(MenuSubContent)
    expect(Menu.Back).toBe(MenuBack)
  })

  // ---- Root anatomy ------------------------------------------------------------
  it('renders the navigation region with the fallback testid and its accessible name', () => {
    const view = render(composed())

    const root = view.getByTestId('navigation-menu')
    expect(root.getAttribute('role')).toBe('navigation')
    expect(root.getAttribute('aria-label')).toBe('Console navigation')
  })

  it('lets a consumer override data-testid', () => {
    const view = render(composed({ 'data-testid': 'console-menu' }))

    expect(view.getByTestId('console-menu')).toBeTruthy()
    expect(view.queryByTestId('navigation-menu')).toBeNull()
  })

  it('lets the host own the landmark by suppressing the role', () => {
    const view = render(composed({ role: 'presentation' }))

    expect(view.getByTestId('navigation-menu').getAttribute('role')).toBe('presentation')
  })

  // The Sidebar case: the host is already a `<nav>`, so the menu gives up BOTH halves of the
  // landmark. Keeping the name on a presentational element is prohibited by ARIA (the a11y
  // tree drops it) and axe reports it, so the label goes with the role rather than lingering.
  it('drops its accessible name when the host owns the landmark', async () => {
    const view = render(composed({ role: 'presentation' }))

    expect(view.getByTestId('navigation-menu').getAttribute('aria-label')).toBeNull()
    await expectNoA11yViolations(view.container)
  })

  it('renders nothing with neither groups nor composed content', () => {
    const view = render(Menu)

    expect(view.queryByTestId('navigation-menu')).toBeNull()
  })

  // ---- Data-driven mode --------------------------------------------------------
  it('renders the data-driven tree through the same sub-components', () => {
    const view = render(Menu, { props: { groups: GROUPS } })

    expect(view.getAllByTestId('navigation-menu-group')).toHaveLength(2)
    expect(view.getByRole('link', { name: 'End User' })).toBeTruthy()
    expect(view.getByRole('link', { name: 'Web Browser' })).toBeTruthy()
    // A node with children renders as a sub + trigger instead of a leaf row.
    expect(view.getByRole('button', { name: 'Settings' }).getAttribute('data-kind')).toBe('drill')
  })

  it('marks the activeId node as the current page', () => {
    const view = render(Menu, { props: { groups: GROUPS, activeId: 'end-user' } })

    expect(view.getByRole('link', { name: 'End User' }).getAttribute('aria-current')).toBe('page')
    expect(view.getByRole('link', { name: 'Web Browser' }).getAttribute('aria-current')).toBeNull()
  })

  it('emits navigate with the DOM event first and the activated node second', async () => {
    const events: Array<[globalThis.MouseEvent, MenuNode]> = []
    const view = render(Menu, {
      props: {
        groups: GROUPS,
        onNavigate: (event: globalThis.MouseEvent, node: MenuNode) => events.push([event, node])
      }
    })

    await fireEvent.click(view.getByRole('link', { name: 'End User' }))

    expect(events).toHaveLength(1)
    expect(events[0][0]).toBeInstanceOf(globalThis.MouseEvent)
    expect(events[0][1].id).toBe('end-user')
  })

  // A drill row is a destination as well as a level: one activation both opens the level and
  // announces it, so the consumer can route to the landing page instead of leaving the user on
  // the page they came from. An inline row only toggles — that is not a navigation.
  it('emits navigate for a drill row on the same activation that pushes its level', async () => {
    const events: MenuNode[] = []
    const view = render(Menu, {
      props: {
        groups: GROUPS,
        onNavigate: (_event: globalThis.MouseEvent, node: MenuNode) => events.push(node)
      }
    })

    await fireEvent.click(view.getByRole('button', { name: 'Settings' }))

    expect(events.map((node) => node.id)).toEqual(['settings'])
    // The level opened too — the navigation did not replace the push.
    await waitFor(() => expect(view.getByRole('link', { name: 'General' })).toBeTruthy())
  })

  it('emits no navigate when an inline row is toggled', async () => {
    const events: MenuNode[] = []
    const view = render(Menu, {
      props: {
        groups: [
          {
            items: [
              {
                id: 'getting-started',
                label: 'Getting started',
                children: [{ id: 'install', label: 'Installation', href: '/docs/install' }]
              }
            ]
          }
        ] satisfies MenuGroupNode[],
        onNavigate: (_event: globalThis.MouseEvent, node: MenuNode) => events.push(node)
      }
    })

    await fireEvent.click(view.getByRole('button', { name: 'Getting started' }))

    expect(events).toEqual([])
  })

  // ---- SubTrigger icon: drill only ---------------------------------------------
  it('renders a drill trigger icon and withholds one from an inline trigger', () => {
    const view = render(Menu, {
      props: {
        groups: [
          {
            items: [
              {
                id: 'settings',
                label: 'Settings',
                icon: 'pi pi-cog',
                kind: 'drill',
                children: [{ id: 'general', label: 'General', href: '/settings/general' }]
              },
              {
                id: 'getting-started',
                label: 'Getting started',
                icon: 'pi pi-book',
                children: [{ id: 'install', label: 'Installation', href: '/docs/install' }]
              }
            ]
          }
        ] satisfies MenuGroupNode[]
      }
    })

    const [drill, inline] = view.getAllByTestId('navigation-menu-sub-trigger')
    // The glyph lands in the leaves' own 32px box, so the drill row sits on the same content
    // column as the destinations it is listed among.
    expect(drill.querySelector('[data-testid="navigation-menu-sub-trigger__icon"] i')).toBeTruthy()
    // An inline row heads the rows it expands beneath it; the column belongs to them, and the
    // component enforces that rather than trusting the caller.
    expect(inline.querySelector('[data-testid="navigation-menu-sub-trigger__icon"]')).toBeNull()
  })

  // ---- Group is a title, not a control -----------------------------------------
  it('renders a group title as static text that names the section and never folds it', () => {
    const view = render(composed())

    // A title, not a toggle: no control carries the label, so it cannot compete with the
    // rows it labels. Folding is a condensed ROW's job.
    expect(view.queryByRole('button', { name: 'User agents' })).toBeNull()

    const group = view.getAllByTestId('navigation-menu-group')[0]
    expect(group.hasAttribute('data-state')).toBe(false)
    expect(view.queryByTestId('navigation-menu-group__toggle')).toBeNull()

    // The visible title is what names the section.
    const label = view.getAllByTestId('navigation-menu-group__label')[0]
    expect(label.textContent?.trim()).toBe('User agents')
    expect(group.getAttribute('aria-labelledby')).toBe(label.id)
    expect(view.getByRole('region', { name: 'User agents' })).toBe(group)

    // Rows are unconditionally present — there is no closed state to hide them.
    expect(view.getByRole('link', { name: 'End User' })).toBeTruthy()
  })

  // ---- Inline sub --------------------------------------------------------------
  it('an inline trigger expands its content in place, wiring aria-expanded and aria-controls', async () => {
    const view = render(composed())

    const trigger = view.getByRole('button', { name: 'Getting started' })
    expect(trigger.getAttribute('data-kind')).toBe('inline')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(view.queryByRole('link', { name: 'Installation' })).toBeNull()

    await userEvent.click(trigger)

    await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'))
    const content = view.getByRole('list', { name: 'Getting started' })
    expect(trigger.getAttribute('aria-controls')).toBe(content.id)
    expect(content.getAttribute('data-kind')).toBe('inline')
    expect(content.getAttribute('data-level')).toBe('0')
    expect(view.getByRole('link', { name: 'Installation' })).toBeTruthy()
  })

  it('ArrowRight expands and ArrowLeft collapses an inline sub', async () => {
    const view = render(composed())
    const trigger = view.getByRole('button', { name: 'Getting started' })

    trigger.focus()
    await fireEvent.keyDown(trigger, { key: 'ArrowRight' })
    await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'))

    await fireEvent.keyDown(trigger, { key: 'ArrowLeft' })
    await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('false'))
  })

  // ---- Drill stack -------------------------------------------------------------
  it('renders no Back row at the root level', () => {
    const view = render(composed())

    expect(view.queryByTestId('navigation-menu-back')).toBeNull()
  })

  it('a drill trigger pushes a level, focuses Back, and pops back to the trigger', async () => {
    const paths: string[][] = []
    const view = render(composed({ 'onUpdate:path': (value: string[]) => paths.push(value) }))

    const settings = view.getByRole('button', { name: 'Settings' })
    // Nothing expands, so the attribute would be a lie.
    expect(settings.hasAttribute('aria-expanded')).toBe(false)

    await userEvent.click(settings)

    await waitFor(() => expect(paths).toHaveLength(1))
    expect(paths[0]).toHaveLength(1)

    const back = await waitFor(() => view.getByTestId('navigation-menu-back'))
    expect(back.getAttribute('aria-label')).toBe('Back to Settings')
    await waitFor(() => expect(document.activeElement).toBe(back))

    // A pushed level is a container, not a list — that is what lets it hold groups, so a
    // second-level nav has the same anatomy as the root rather than being flat rows.
    const level = view.getByRole('group', { name: 'Settings' })
    expect(level.getAttribute('data-kind')).toBe('drill')
    expect(level.getAttribute('data-state')).toBe('open')
    expect(view.getByRole('link', { name: 'General' })).toBeTruthy()

    // The group nested inside the pushed level is real anatomy, and it is the one the
    // user is looking at — so it keeps its label and stays in the a11y tree.
    const levelGroup = view.getByRole('region', { name: 'Account' })
    expect(level.contains(levelGroup)).toBe(true)
    expect(levelGroup.hasAttribute('aria-hidden')).toBe(false)
    expect(levelGroup.hasAttribute('inert')).toBe(false)

    // The root level stays mounted for the slide but leaves the a11y tree and tab order.
    // Groups inside the pushed level are excluded — they are the current surface.
    for (const group of view.getAllByTestId('navigation-menu-group')) {
      if (level.contains(group)) continue
      expect(group.getAttribute('aria-hidden')).toBe('true')
      expect(group.hasAttribute('inert')).toBe(true)
    }

    await userEvent.click(back)

    await waitFor(() => expect(paths[1]).toEqual([]))
    await waitFor(() => expect(view.queryByTestId('navigation-menu-back')).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(settings))
    expect(view.getAllByTestId('navigation-menu-group')[0].hasAttribute('inert')).toBe(false)
  })

  it('the data-driven drill stack carries the node ids', async () => {
    const paths: string[][] = []
    const view = render(Menu, {
      props: { groups: GROUPS, 'onUpdate:path': (value: string[]) => paths.push(value) }
    })

    await userEvent.click(view.getByRole('button', { name: 'Settings' }))

    await waitFor(() => expect(paths[0]).toEqual(['settings']))
  })

  // A consumer whose host remounts on navigation persists `path` and hands it back, so the
  // level is restored as STATE with no push behind it. The level still has to name itself, or
  // Back renders a bare chevron and its accessible name degrades to "Back".
  it('a stack supplied through v-model:path still labels Back', async () => {
    const view = render(restored())

    const back = await waitFor(() => view.getByTestId('navigation-menu-back'))
    expect(back.textContent?.trim()).toBe('Settings')
    expect(back.getAttribute('aria-label')).toBe('Back to Settings')
    // The restored level is really open, not just labelled.
    expect(view.getByRole('link', { name: 'General' })).toBeTruthy()
  })

  // With `enterOnMount` a restored level ARRIVES rather than just being there: `MenuSubContent`'s
  // appear transition plays its entrance and the root supplies the push motion, so the timing and
  // the sliding surfaces' fill match a real push. Asserted as state (`data-motion`), never timing.
  it('a restored stack arrives in the push motion when enterOnMount is set', async () => {
    const view = render(restored({ enterOnMount: true }))

    const level = await waitFor(() => view.getByTestId('navigation-menu-sub-content'))
    expect(level.getAttribute('data-motion')).toBe('push')
  })

  // The default. Navigating BETWEEN rows of a level remounts the host and restores the same
  // stack, so animating every restored level would replay the entrance on each row the reader
  // activates inside it — the menu appearing to re-open under someone who never left.
  it('a restored stack renders in place by default', async () => {
    const view = render(restored())

    const level = await waitFor(() => view.getByTestId('navigation-menu-sub-content'))
    expect(level.getAttribute('data-motion')).toBe('none')
  })

  // The rail arriving is an entrance too — coming back out of a level, the host remounted, so the
  // root groups have no rendered off-canvas position to slide from. The DIRECTION is derived: an
  // empty stack was travelled back to, so it is a pop, not a push.
  it('an empty stack arrives in the pop motion when enterOnMount is set', async () => {
    const view = render(Menu, { props: { groups: GROUPS, enterOnMount: true } })

    // The motion is set on mount, so it reaches the DOM on the tick after it.
    await nextTick()
    for (const group of view.getAllByTestId('navigation-menu-group')) {
      expect(group.getAttribute('data-motion')).toBe('pop')
    }
  })

  it('an empty stack renders in place by default', async () => {
    const view = render(Menu, { props: { groups: GROUPS } })

    await nextTick()
    for (const group of view.getAllByTestId('navigation-menu-group')) {
      expect(group.getAttribute('data-motion')).toBe('none')
    }
  })

  it('a stack supplied through v-model:path restores focus to its trigger on pop', async () => {
    const view = render(restored())

    await userEvent.click(await waitFor(() => view.getByTestId('navigation-menu-back')))

    // The trigger element was registered on mount, so popping a level nobody pushed still
    // returns focus to the row that owns it.
    await waitFor(() =>
      expect(globalThis.document.activeElement).toBe(view.getByRole('button', { name: 'Settings' }))
    )
  })

  it('Escape pops one drill level', async () => {
    const paths: string[][] = []
    const view = render(composed({ 'onUpdate:path': (value: string[]) => paths.push(value) }))

    await userEvent.click(view.getByRole('button', { name: 'Settings' }))
    await waitFor(() => expect(paths).toHaveLength(1))

    await fireEvent.keyDown(view.getByTestId('navigation-menu-back'), { key: 'Escape' })

    await waitFor(() => expect(paths[1]).toEqual([]))
  })

  // ---- Disabled suppression ----------------------------------------------------
  it('a disabled row is out of the tab order and emits no navigate', async () => {
    const events: Array<[globalThis.MouseEvent, MenuNode]> = []
    const view = render(Menu, {
      props: {
        groups: GROUPS,
        onNavigate: (event: globalThis.MouseEvent, node: MenuNode) => events.push([event, node])
      }
    })

    const blocked = view.getByRole('button', { name: 'Blocked' })
    expect(blocked.hasAttribute('disabled')).toBe(true)
    expect(blocked.getAttribute('aria-disabled')).toBe('true')

    await fireEvent.click(blocked)

    expect(events).toEqual([])
  })

  it('a disabled drill trigger pushes nothing', async () => {
    const paths: string[][] = []
    const view = render(
      composed({ 'onUpdate:path': (value: string[]) => paths.push(value) }, { disabled: true })
    )

    const settings = view.getByRole('button', { name: 'Settings' })
    expect(settings.getAttribute('data-disabled')).toBe('')
    expect(settings.getAttribute('aria-disabled')).toBe('true')

    await fireEvent.click(settings)
    await fireEvent.keyDown(settings, { key: 'ArrowRight' })

    expect(paths).toEqual([])
    expect(view.queryByTestId('navigation-menu-back')).toBeNull()
  })

  // ---- Accessibility -----------------------------------------------------------
  it('has no axe violations composed, with an inline sub expanded', async () => {
    const view = render(composed({}, { inlineOpen: true }))

    await expectNoA11yViolations(view.container)
  })

  it('has no axe violations in data-driven mode', async () => {
    const view = render(Menu, { props: { groups: GROUPS, activeId: 'end-user' } })

    await expectNoA11yViolations(view.container)
  })
})
