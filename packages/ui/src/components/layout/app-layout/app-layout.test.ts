import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import AppLayout from './app-layout.vue'

type Scope = {
  compact: boolean
  openNavigation: () => void
  toggleNavigation: () => void
  toggleTools: () => void
}

const layout = (props: Record<string, unknown> = {}, width = 1200, dir = 'ltr') => ({
  render: () =>
    h('div', { style: { width: `${width}px`, height: '600px' }, dir }, [
      h(
        AppLayout,
        { style: { height: '800px' }, ...props },
        {
          navigation: ({
            drawer,
            closeNavigation
          }: {
            drawer: boolean
            closeNavigation: () => void
          }) => [
            h(
              'nav',
              { 'aria-label': 'Main navigation', 'data-drawer': String(drawer) },
              'nav links'
            ),
            h('button', { type: 'button', onClick: closeNavigation }, 'Pick item')
          ],
          header: (scope: Scope) =>
            h('header', [
              h('span', { 'data-testid': 'compact' }, String(scope.compact)),
              h('button', { type: 'button', onClick: scope.openNavigation }, 'Open navigation'),
              h('button', { type: 'button', onClick: scope.toggleNavigation }, 'Toggle navigation'),
              h('button', { type: 'button', onClick: scope.toggleTools }, 'Help')
            ]),
          notifications: () => h('div', { role: 'status' }, 'Saved'),
          breadcrumbs: () => h('span', 'Resources'),
          default: () => h('main', 'page content'),
          tools: () => h('p', 'help body'),
          'split-panel': () => h('p', 'split body')
        }
      )
    ])
})

afterEach(() => {
  globalThis.localStorage.clear()
})

describe('AppLayout', () => {
  it('opens with a skip link that jumps focus past the navigation to the content', async () => {
    const { getByTestId, container } = render(layout())
    const skip = getByTestId('app-layout__skip-link')
    expect(container.querySelector('a[href], button')).toBe(skip)
    expect(skip.textContent?.trim()).toBe('Skip to content')
    const content = getByTestId('app-layout__content')
    expect(skip.getAttribute('href')).toBe(`#${content.id}`)
    await fireEvent.click(skip)
    expect(document.activeElement).toBe(content)
  })

  it('renders every region and the fallback data-testid', () => {
    const { getByTestId, getByText } = render(layout())
    const root = getByTestId('app-layout')
    expect(root.dataset.navigation).toBe('open')
    expect(root.dataset.tools).toBe('closed')
    expect(root.dataset.splitPanel).toBe('closed')
    expect(getByTestId('app-layout__notifications').textContent).toContain('Saved')
    expect(getByTestId('app-layout__breadcrumbs').textContent).toContain('Resources')
    expect(getByText('page content')).toBeTruthy()
    expect(getByText('nav links').getAttribute('data-drawer')).toBe('false')
  })

  it('puts the page body in its own region after the breadcrumbs, inside the scroll area', () => {
    const { getByTestId } = render(
      h(AppLayout, null, {
        breadcrumbs: () => h('nav', { 'aria-label': 'Breadcrumb' }, 'Resources'),
        default: () => h('main', { class: 'flex min-h-full flex-col' }, 'full-height body')
      })
    )
    const content = getByTestId('app-layout__content')
    const breadcrumbs = getByTestId('app-layout__breadcrumbs')
    const body = getByTestId('app-layout__body')
    expect(Array.from(content.children)).toEqual([breadcrumbs, body])
    expect(body.children).toHaveLength(1)
    expect(body.firstElementChild?.tagName).toBe('MAIN')
    expect(breadcrumbs.contains(body)).toBe(false)
  })

  it('keeps the body region when there are no breadcrumbs', () => {
    const { getByTestId, queryByTestId } = render(
      h(AppLayout, null, { default: () => h('main', 'page') })
    )
    expect(queryByTestId('app-layout__breadcrumbs')).toBeNull()
    expect(Array.from(getByTestId('app-layout__content').children)).toEqual([
      getByTestId('app-layout__body')
    ])
  })

  it('lets a consumer override data-testid', () => {
    const { getByTestId } = render(h(AppLayout, { 'data-testid': 'shell' }))
    expect(getByTestId('shell')).toBeTruthy()
  })

  it('toggles the navigation beside the content and emits the model', async () => {
    const updates: boolean[] = []
    const { getByText, getByTestId, queryByText } = render(
      layout({ 'onUpdate:navigationOpen': (value: boolean) => updates.push(value) })
    )
    await fireEvent.click(getByText('Toggle navigation'))
    expect(getByTestId('app-layout').dataset.navigation).toBe('closed')
    expect(queryByText('nav links')).toBeNull()
    expect(updates).toEqual([false])
  })

  it('round-trips the models with a controlling parent (defineModel)', async () => {
    const navigationOpen = ref(true)
    const toolsOpen = ref(false)
    const { getByText, getByTestId } = render({
      setup: () => () =>
        layout({
          navigationOpen: navigationOpen.value,
          'onUpdate:navigationOpen': (value: boolean) => (navigationOpen.value = value),
          toolsOpen: toolsOpen.value,
          'onUpdate:toolsOpen': (value: boolean) => (toolsOpen.value = value)
        }).render()
    })
    await fireEvent.click(getByText('Toggle navigation'))
    expect(navigationOpen.value).toBe(false)
    expect(getByTestId('app-layout').dataset.navigation).toBe('closed')
    await fireEvent.click(getByText('Help'))
    expect(toolsOpen.value).toBe(true)
    navigationOpen.value = true
    await nextTick()
    expect(getByTestId('app-layout').dataset.navigation).not.toBe('closed')
  })

  it('opens the tools region from the header and closes it from its own button', async () => {
    const { getByRole, queryByRole, getByTestId } = render(layout())
    await fireEvent.click(getByRole('button', { name: 'Help' }))
    const region = getByRole('region', { name: 'Help' })
    expect(region.textContent).toContain('help body')
    await fireEvent.click(getByTestId('app-layout__tools-close'))
    expect(queryByRole('region', { name: 'Help' })).toBeNull()
  })

  it('uses the tools label as the region title', () => {
    const { getByRole } = render(layout({ toolsOpen: true, toolsLabel: 'Workloads help' }))
    expect(getByRole('region', { name: 'Workloads help' })).toBeTruthy()
  })

  it('resizes a bottom split panel from the keyboard', async () => {
    const { getByRole, getByTestId } = render(
      layout({ splitPanelOpen: true, splitPanelTitle: 'web-app-prod', splitPanelSize: 240 })
    )
    expect(getByRole('region', { name: 'web-app-prod' })).toBeTruthy()
    const separator = getByRole('separator', { name: 'Resize panel' })
    expect(separator.getAttribute('aria-orientation')).toBe('horizontal')
    expect(separator.classList.contains('focus-visible:ring-(--ring-color)')).toBe(true)
    expect(separator.getAttribute('aria-valuenow')).toBe('240')
    await fireEvent.keyDown(separator, { key: 'ArrowUp' })
    expect(separator.getAttribute('aria-valuenow')).toBe('256')
    await fireEvent.keyDown(separator, { key: 'ArrowDown', shiftKey: true })
    expect(separator.getAttribute('aria-valuenow')).toBe('192')
    await fireEvent.keyDown(separator, { key: 'Home' })
    expect(separator.getAttribute('aria-valuenow')).toBe('160')
    expect(getByTestId('app-layout__split-panel').style.height).toBe('160px')
  })

  it('moves the split panel to the side and back', async () => {
    const { getByTestId, getByRole } = render(layout({ splitPanelOpen: true }))
    const root = getByTestId('app-layout')
    expect(root.dataset.splitPanelPosition).toBe('bottom')
    await fireEvent.click(getByRole('button', { name: 'Show beside the content' }))
    expect(root.dataset.splitPanelPosition).toBe('side')
    expect(getByRole('separator').getAttribute('aria-orientation')).toBe('vertical')
    await fireEvent.click(getByRole('button', { name: 'Show under the content' }))
    expect(root.dataset.splitPanelPosition).toBe('bottom')
  })

  it('closes the split panel and emits the model', async () => {
    const { getByRole, queryByRole, emitted } = render(AppLayout, {
      props: { splitPanelOpen: true },
      slots: { 'split-panel': '<p>split body</p>' }
    })
    await fireEvent.click(getByRole('button', { name: 'Close panel' }))
    expect(queryByRole('region')).toBeNull()
    expect(emitted()['update:splitPanelOpen']).toEqual([[false]])
  })

  it('goes compact below its own width and renders navigation in a drawer', async () => {
    const { getByTestId, getByText, queryByText, findByRole } = render(layout({}, 500))
    await waitFor(() => expect(getByTestId('compact').textContent).toBe('true'))
    const root = getByTestId('app-layout')
    expect(root.dataset.compact).toBeDefined()
    expect(queryByText('nav links')).toBeNull()
    await fireEvent.click(getByText('Open navigation'))
    const dialog = await findByRole('dialog', { name: 'Navigation' })
    expect(dialog.textContent).toContain('nav links')
    expect(dialog.querySelector('[data-drawer="true"]')).toBeTruthy()
  })

  it('is compact before the first frame paints, so a phone never sees the rail', async () => {
    const { getByTestId, queryByText } = render(layout({}, 390))
    await nextTick()
    expect(getByTestId('compact').textContent).toBe('true')
    expect(getByTestId('app-layout').dataset.navigation).toBe('closed')
    expect(queryByText('nav links')).toBeNull()
  })

  it('stays wide on the first frame when it has room', async () => {
    const { getByTestId, getByText } = render(layout({}, 1200))
    await nextTick()
    expect(getByTestId('compact').textContent).toBe('false')
    expect(getByText('nav links')).toBeTruthy()
  })

  it('closes the navigation drawer from the navigation scope', async () => {
    const { getByTestId, getByText, findByRole, queryByRole } = render(layout({}, 500))
    await waitFor(() => expect(getByTestId('compact').textContent).toBe('true'))
    await fireEvent.click(getByText('Open navigation'))
    const dialog = await findByRole('dialog', { name: 'Navigation' })
    await fireEvent.click(within(dialog).getByRole('button', { name: 'Pick item' }))
    await waitFor(() => expect(queryByRole('dialog', { name: 'Navigation' })).toBeNull())
  })

  it('forces the split panel to the bottom while compact', async () => {
    const { getByTestId, queryByRole } = render(
      layout({ splitPanelOpen: true, splitPanelPosition: 'side' }, 500)
    )
    await waitFor(() => expect(getByTestId('compact').textContent).toBe('true'))
    expect(getByTestId('app-layout').dataset.splitPanelPosition).toBe('bottom')
    expect(queryByRole('button', { name: 'Show beside the content' })).toBeNull()
  })

  it('opens the tools in a drawer while compact', async () => {
    const { getByTestId, getByRole, findByRole } = render(layout({}, 500))
    await waitFor(() => expect(getByTestId('compact').textContent).toBe('true'))
    await fireEvent.click(getByRole('button', { name: 'Help' }))
    const dialog = await findByRole('dialog', { name: 'Help' })
    expect(dialog.textContent).toContain('help body')
  })

  it('gives both compact drawers a close button', async () => {
    const { getByTestId, getByText, getByRole, findByRole, queryByRole } = render(layout({}, 500))
    await waitFor(() => expect(getByTestId('compact').textContent).toBe('true'))
    await fireEvent.click(getByRole('button', { name: 'Help' }))
    const tools = await findByRole('dialog', { name: 'Help' })
    await fireEvent.click(within(tools).getByTestId('app-layout__tools-drawer__close'))
    await waitFor(() => expect(queryByRole('dialog', { name: 'Help' })).toBeNull())
    await fireEvent.click(getByText('Open navigation'))
    const navigation = await findByRole('dialog', { name: 'Navigation' })
    await fireEvent.click(within(navigation).getByTestId('app-layout__navigation-drawer__close'))
    await waitFor(() => expect(queryByRole('dialog', { name: 'Navigation' })).toBeNull())
  })

  it('keeps the split panel and tools state under the storage key', async () => {
    const first = render(layout({ storageKey: 'test-layout', splitPanelOpen: true }))
    await fireEvent.keyDown(first.getByRole('separator'), { key: 'ArrowUp' })
    await fireEvent.click(first.getByRole('button', { name: 'Help' }))
    first.unmount()
    const stored = JSON.parse(globalThis.localStorage.getItem('test-layout') ?? '{}')
    expect(stored).toMatchObject({ splitPanelSize: 336, toolsOpen: true })

    const second = render(layout({ storageKey: 'test-layout', splitPanelOpen: true }))
    await waitFor(() =>
      expect(second.getByRole('separator').getAttribute('aria-valuenow')).toBe('336')
    )
    expect(second.getByRole('region', { name: 'Help' })).toBeTruthy()
  })

  it('ignores unreadable stored state', () => {
    globalThis.localStorage.setItem('broken-layout', '{not json')
    const { getByRole } = render(layout({ storageKey: 'broken-layout', splitPanelOpen: true }))
    expect(getByRole('separator').getAttribute('aria-valuenow')).toBe('320')
  })

  it('has no axe violations with every region open', async () => {
    const { container } = render(layout({ toolsOpen: true, splitPanelOpen: true }))
    await expectNoA11yViolations(container)
  })

  describe('right-to-left', () => {
    it('grows a side split panel with ArrowRight under rtl', async () => {
      const { getByRole } = render(
        layout(
          { splitPanelOpen: true, splitPanelPosition: 'side', splitPanelSize: 300 },
          1200,
          'rtl'
        )
      )
      const separator = getByRole('separator')
      await fireEvent.keyDown(separator, { key: 'ArrowRight' })
      expect(separator.getAttribute('aria-valuenow')).toBe('316')
      await fireEvent.keyDown(separator, { key: 'ArrowLeft' })
      expect(separator.getAttribute('aria-valuenow')).toBe('300')
    })

    it('grows a side split panel with ArrowLeft under ltr', async () => {
      const { getByRole } = render(
        layout({ splitPanelOpen: true, splitPanelPosition: 'side', splitPanelSize: 300 })
      )
      const separator = getByRole('separator')
      await fireEvent.keyDown(separator, { key: 'ArrowLeft' })
      expect(separator.getAttribute('aria-valuenow')).toBe('316')
    })
  })
})
