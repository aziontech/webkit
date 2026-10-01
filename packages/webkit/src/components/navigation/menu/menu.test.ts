import { userEvent } from '@storybook/test'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { compileTemplate, parse } from 'vue/compiler-sfc'

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
import menuGroupSource from './menu-group/menu-group.vue?raw'

const COMPONENTS = { Menu, MenuBack, MenuGroup, MenuItem, MenuSub, MenuSubContent, MenuSubTrigger }

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
            <MenuSubTrigger
              label="Settings"
              kind="drill"
              href="/settings"
              :disabled="disabled"
            />
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
        href: '/settings',
        children: [{ id: 'general', label: 'General', href: '/settings/general' }]
      },
      { id: 'blocked', label: 'Blocked', href: '/blocked', disabled: true }
    ]
  }
]

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

const NESTED: MenuGroupNode[] = [
  {
    items: [
      {
        id: 'settings',
        label: 'Settings',
        kind: 'drill',
        href: '/settings',
        groups: [
          {
            items: [
              {
                id: 'security',
                label: 'Security',
                kind: 'drill',
                href: '/settings/security',
                children: [{ id: 'tokens', label: 'Tokens', href: '/settings/tokens' }]
              }
            ]
          }
        ]
      }
    ]
  }
]

const nested = (backProps = '') =>
  defineComponent({
    components: COMPONENTS,
    setup: () => ({ groups: NESTED }),
    template: `
      <Menu :groups="groups" aria-label="Console navigation">
        <MenuBack ${backProps} />
      </Menu>
    `
  })

const arrow = (view: ReturnType<typeof render>, label: string) =>
  view.getByRole('button', { name: `Open ${label} menu` })

const arrowOfKind = (view: ReturnType<typeof render>, kind: string) => {
  const row = view
    .getAllByTestId('navigation-menu-sub-trigger')
    .find((el) => el.getAttribute('data-kind') === kind)
  const el = row?.querySelector('[data-testid="navigation-menu-sub-trigger__arrow"]')
  if (!(el instanceof globalThis.HTMLElement)) throw new Error(`no ${kind} arrow rendered`)
  return el
}

describe('Menu (composition, drill stack + data mode)', () => {
  it('attaches every sub-component to the compound root for dot-notation', () => {
    expect(Menu).toBeDefined()
    expect(Menu?.Group).toBe(MenuGroup)
    expect(Menu?.Item).toBe(MenuItem)
    expect(Menu?.Sub).toBe(MenuSub)
    expect(Menu?.SubTrigger).toBe(MenuSubTrigger)
    expect(Menu?.SubContent).toBe(MenuSubContent)
    expect(Menu?.Back).toBe(MenuBack)
  })

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

  it('drops its accessible name when the host owns the landmark', async () => {
    const view = render(composed({ role: 'presentation' }))

    expect(view.getByTestId('navigation-menu').getAttribute('aria-label')).toBeNull()
    await expectNoA11yViolations(view.container)
  })

  it('renders nothing with neither groups nor composed content', () => {
    const view = render(Menu)

    expect(view.queryByTestId('navigation-menu')).toBeNull()
  })

  it('serves its groups as live markup, never inside an inert <template>', () => {
    const { descriptor } = parse(menuGroupSource, { filename: 'menu-group.vue' })
    const { code, errors } = compileTemplate({
      source: descriptor.template?.content ?? '',
      filename: 'menu-group.vue',
      id: 'menu-group',
      ssr: true,
      ssrCssVars: []
    })

    expect(errors).toEqual([])
    expect(code).toContain('<section')
    expect(code).not.toContain('<template>')
  })

  it('renders the data-driven tree through the same sub-components', () => {
    const view = render(Menu, { props: { groups: GROUPS } })

    expect(view.getAllByTestId('navigation-menu-group')).toHaveLength(2)
    expect(view.getByRole('link', { name: 'End User' })).toBeTruthy()
    expect(view.getByRole('link', { name: 'Web Browser' })).toBeTruthy()
    expect(view.getByTestId('navigation-menu-sub-trigger').getAttribute('data-kind')).toBe('drill')
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

  it('a drill label navigates without opening its level', async () => {
    const events: MenuNode[] = []
    const paths: string[][] = []
    const view = render(Menu, {
      props: {
        groups: GROUPS,
        onNavigate: (_event: globalThis.MouseEvent, node: MenuNode) => events.push(node),
        'onUpdate:path': (value: string[]) => paths.push(value)
      }
    })

    const link = view.getByRole('link', { name: 'Settings' })
    expect(link.getAttribute('href')).toBe('/settings')

    await fireEvent.click(link)

    expect(events.map((node) => node.id)).toEqual(['settings'])
    expect(paths).toEqual([])
    expect(view.queryByRole('link', { name: 'General' })).toBeNull()
  })

  it('the drill arrow opens the level without navigating', async () => {
    const events: MenuNode[] = []
    const paths: string[][] = []
    const view = render(Menu, {
      props: {
        groups: GROUPS,
        onNavigate: (_event: globalThis.MouseEvent, node: MenuNode) => events.push(node),
        'onUpdate:path': (value: string[]) => paths.push(value)
      }
    })

    await userEvent.click(arrow(view, 'Settings'))

    await waitFor(() => expect(paths[0]).toEqual(['settings']))
    expect(events).toEqual([])
    await waitFor(() => expect(view.getByRole('link', { name: 'General' })).toBeTruthy())
  })

  it('a link-less condensed row reveals its children from the WHOLE row and emits no navigate', async () => {
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

    const row = view.getByRole('button', { name: 'Getting started' })
    expect(row.getAttribute('aria-expanded')).toBe('false')

    await fireEvent.click(row)

    await waitFor(() => expect(row.getAttribute('aria-expanded')).toBe('true'))
    expect(view.getByRole('link', { name: 'Installation' })).toBeTruthy()
    expect(events).toEqual([])
  })

  it('a referenced condensed row splits into a link and an arrow', async () => {
    const events: MenuNode[] = []
    const view = render(Menu, {
      props: {
        groups: [
          {
            items: [
              {
                id: 'getting-started',
                label: 'Getting started',
                href: '/docs/getting-started',
                children: [{ id: 'install', label: 'Installation', href: '/docs/install' }]
              }
            ]
          }
        ] satisfies MenuGroupNode[],
        onNavigate: (_event: globalThis.MouseEvent, node: MenuNode) => events.push(node)
      }
    })

    const link = view.getByRole('link', { name: 'Getting started' })
    expect(link.getAttribute('href')).toBe('/docs/getting-started')
    expect(link.hasAttribute('aria-expanded')).toBe(false)

    await userEvent.click(arrowOfKind(view, 'inline'))
    await waitFor(() => expect(view.getByRole('link', { name: 'Installation' })).toBeTruthy())
    expect(events).toEqual([])

    await fireEvent.click(link)
    expect(events.map((node) => node.id)).toEqual(['getting-started'])
  })

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
    expect(drill.querySelector('[data-testid="navigation-menu-sub-trigger__icon"] i')).toBeTruthy()
    expect(inline.querySelector('[data-testid="navigation-menu-sub-trigger__icon"]')).toBeNull()
  })

  it('renders a group title as static text that names the section and never folds it', () => {
    const view = render(composed())

    expect(view.queryByRole('button', { name: 'User agents' })).toBeNull()

    const group = view.getAllByTestId('navigation-menu-group')[0]
    expect(group.hasAttribute('data-state')).toBe(false)
    expect(view.queryByTestId('navigation-menu-group__toggle')).toBeNull()

    const label = view.getAllByTestId('navigation-menu-group__label')[0]
    expect(label.textContent?.trim()).toBe('User agents')
    expect(group.getAttribute('aria-labelledby')).toBe(label.id)
    expect(view.getByRole('region', { name: 'User agents' })).toBe(group)

    expect(view.getByRole('link', { name: 'End User' })).toBeTruthy()
  })

  it('a link-less condensed row expands in place, wiring aria-expanded and aria-controls on the row', async () => {
    const view = render(composed())

    const trigger = view.getByRole('button', { name: 'Getting started' })
    expect(trigger.getAttribute('data-testid')).toBe('navigation-menu-sub-trigger__control')
    expect(
      trigger.closest('[data-testid="navigation-menu-sub-trigger"]')?.getAttribute('data-kind')
    ).toBe('inline')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    const arrowButton = arrowOfKind(view, 'inline')
    expect(arrowButton.getAttribute('tabindex')).toBe('-1')
    expect(arrowButton.getAttribute('aria-hidden')).toBe('true')
    expect(arrowButton.hasAttribute('aria-expanded')).toBe(false)
    expect(view.queryByRole('link', { name: 'Installation' })).toBeNull()

    await userEvent.click(trigger)

    await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'))
    const content = view.getByRole('list', { name: 'Getting started' })
    expect(trigger.getAttribute('aria-controls')).toBe(content.id)
    expect(content.getAttribute('data-kind')).toBe('inline')
    expect(content.getAttribute('data-level')).toBe('0')
    expect(view.getByRole('link', { name: 'Installation' })).toBeTruthy()
  })

  it('ArrowRight expands and ArrowLeft collapses a condensed sub', async () => {
    const view = render(composed())
    const trigger = view.getByRole('button', { name: 'Getting started' })

    trigger.focus()
    await fireEvent.keyDown(trigger, { key: 'ArrowRight' })
    await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('true'))

    await fireEvent.keyDown(trigger, { key: 'ArrowLeft' })
    await waitFor(() => expect(trigger.getAttribute('aria-expanded')).toBe('false'))
  })

  it('renders no Back button at the root level', () => {
    const view = render(composed())

    expect(view.queryByTestId('navigation-menu-back')).toBeNull()
  })

  it('a drill trigger pushes a level, focuses Back, and pops back to the trigger', async () => {
    const paths: string[][] = []
    const view = render(composed({ 'onUpdate:path': (value: string[]) => paths.push(value) }))

    expect(view.getByRole('link', { name: 'Settings' }).hasAttribute('aria-expanded')).toBe(false)
    const open = arrow(view, 'Settings')
    expect(open.hasAttribute('aria-expanded')).toBe(false)

    await userEvent.click(open)

    await waitFor(() => expect(paths).toHaveLength(1))
    expect(paths[0]).toHaveLength(1)

    const back = await waitFor(() => view.getByTestId('navigation-menu-back'))
    expect(back.textContent?.trim()).toBe('Back')
    expect(back.hasAttribute('aria-label')).toBe(false)
    await waitFor(() => expect(document.activeElement).toBe(back))

    const level = view.getByRole('group', { name: 'Settings' })
    expect(level.getAttribute('data-kind')).toBe('drill')
    expect(level.getAttribute('data-state')).toBe('open')
    expect(view.getByRole('link', { name: 'General' })).toBeTruthy()

    const levelGroup = view.getByRole('region', { name: 'Account' })
    expect(level.contains(levelGroup)).toBe(true)
    expect(levelGroup.hasAttribute('aria-hidden')).toBe(false)
    expect(levelGroup.hasAttribute('inert')).toBe(false)

    for (const group of view.getAllByTestId('navigation-menu-group')) {
      if (level.contains(group)) continue
      expect(group.getAttribute('aria-hidden')).toBe('true')
      expect(group.hasAttribute('inert')).toBe(true)
    }

    await userEvent.click(back)

    await waitFor(() => expect(paths[1]).toEqual([]))
    await waitFor(() => expect(view.queryByTestId('navigation-menu-back')).toBeNull())
    await waitFor(() => expect(document.activeElement).toBe(open))
    expect(view.getAllByTestId('navigation-menu-group')[0].hasAttribute('inert')).toBe(false)
  })

  it('the data-driven drill stack carries the node ids', async () => {
    const paths: string[][] = []
    const view = render(Menu, {
      props: { groups: GROUPS, 'onUpdate:path': (value: string[]) => paths.push(value) }
    })

    await userEvent.click(arrow(view, 'Settings'))

    await waitFor(() => expect(paths[0]).toEqual(['settings']))
  })

  it('a stack supplied through v-model:path names its level and offers Back', async () => {
    const view = render(restored())

    const back = await waitFor(() => view.getByTestId('navigation-menu-back'))
    expect(back.textContent?.trim()).toBe('Back')
    expect(view.getByRole('group', { name: 'Settings' })).toBeTruthy()
    expect(view.getByRole('link', { name: 'General' })).toBeTruthy()
  })

  it('the back button names the level a pop lands on', async () => {
    const view = render(nested())

    await userEvent.click(arrow(view, 'Settings'))
    const back = await waitFor(() => view.getByTestId('navigation-menu-back'))
    expect(back.textContent?.trim()).toBe('Back')

    await userEvent.click(await waitFor(() => arrow(view, 'Security')))
    await waitFor(() => expect(back.textContent?.trim()).toBe('Back to Settings'))

    await userEvent.click(back)
    await waitFor(() =>
      expect(view.getByTestId('navigation-menu-back').textContent?.trim()).toBe('Back')
    )
  })

  it('label names the destination when it is the menu root', async () => {
    const view = render(nested('label="app"'))

    await userEvent.click(arrow(view, 'Settings'))

    const back = await waitFor(() => view.getByTestId('navigation-menu-back'))
    expect(back.textContent?.trim()).toBe('Back to app')
  })

  it('a restored stack arrives in the push motion when enterOnMount is set', async () => {
    const view = render(restored({ enterOnMount: true }))

    const level = await waitFor(() => view.getByTestId('navigation-menu-sub-content'))
    expect(level.getAttribute('data-motion')).toBe('push')
  })

  it('a restored stack renders in place by default', async () => {
    const view = render(restored())

    const level = await waitFor(() => view.getByTestId('navigation-menu-sub-content'))
    expect(level.getAttribute('data-motion')).toBe('none')
  })

  it('an empty stack arrives in the pop motion when enterOnMount is set', async () => {
    const view = render(Menu, { props: { groups: GROUPS, enterOnMount: true } })

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

    await waitFor(() => expect(globalThis.document.activeElement).toBe(arrow(view, 'Settings')))
  })

  it('pop() leaves the current level the way Back does, for a host with its own way back', async () => {
    const path = ref(['settings'])
    const view = render(
      defineComponent({
        components: COMPONENTS,
        setup: () => ({ groups: GROUPS, path, menu: ref<{ pop: () => void } | null>(null) }),
        template: `
          <button type="button" @click="menu?.pop()">Leave level</button>
          <Menu ref="menu" v-model:path="path" :groups="groups" aria-label="Console navigation" />
        `
      })
    )

    await waitFor(() => view.getByRole('group', { name: 'Settings' }))
    await userEvent.click(view.getByRole('button', { name: 'Leave level' }))

    await waitFor(() => expect(path.value).toEqual([]))
    await waitFor(() => expect(globalThis.document.activeElement).toBe(arrow(view, 'Settings')))
  })

  it('Escape pops one drill level', async () => {
    const paths: string[][] = []
    const view = render(composed({ 'onUpdate:path': (value: string[]) => paths.push(value) }))

    await userEvent.click(arrow(view, 'Settings'))
    await waitFor(() => expect(paths).toHaveLength(1))

    await fireEvent.keyDown(view.getByTestId('navigation-menu-back'), { key: 'Escape' })

    await waitFor(() => expect(paths[1]).toEqual([]))
  })

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

    expect(view.queryByRole('link', { name: 'Settings' })).toBeNull()
    const settings = view.getByTestId('navigation-menu-sub-trigger__reference')
    expect(settings.getAttribute('data-disabled')).toBe('')
    expect(settings.getAttribute('aria-disabled')).toBe('true')
    expect(settings.hasAttribute('href')).toBe(false)
    expect(settings.getAttribute('tabindex')).toBe('-1')

    const open = arrow(view, 'Settings')
    expect(open.hasAttribute('disabled')).toBe(true)

    await fireEvent.click(settings)
    await fireEvent.keyDown(settings, { key: 'ArrowRight' })
    await fireEvent.click(open)

    expect(paths).toEqual([])
    expect(view.queryByTestId('navigation-menu-back')).toBeNull()
  })

  it('has no axe violations composed, with an inline sub expanded', async () => {
    const view = render(composed({}, { inlineOpen: true }))

    await expectNoA11yViolations(view.container)
  })

  it('has no axe violations in data-driven mode', async () => {
    const view = render(Menu, { props: { groups: GROUPS, activeId: 'end-user' } })

    await expectNoA11yViolations(view.container)
  })
})
