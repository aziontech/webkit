import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'

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
          }) =>
            [
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
  it('renders every region and the fallback data-testid', () => {
    const { getByTestId, getByText } = render(layout())
    const root = getByTestId('layout-app-layout')
    expect(root.dataset.navigation).toBe('open')
    expect(root.dataset.tools).toBe('closed')
    expect(root.dataset.splitPanel).toBe('closed')
    expect(getByTestId('layout-app-layout__notifications').textContent).toContain('Saved')
    expect(getByTestId('layout-app-layout__breadcrumbs').textContent).toContain('Resources')
    expect(getByText('page content')).toBeTruthy()
    expect(getByText('nav links').getAttribute('data-drawer')).toBe('false')
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
    expect(getByTestId('layout-app-layout').dataset.navigation).toBe('closed')
    expect(queryByText('nav links')).toBeNull()
    expect(updates).toEqual([false])
  })

  it('opens the tools region from the header and closes it from its own button', async () => {
    const { getByRole, queryByRole, getByTestId } = render(layout())
    await fireEvent.click(getByRole('button', { name: 'Help' }))
    const region = getByRole('region', { name: 'Help' })
    expect(region.textContent).toContain('help body')
    await fireEvent.click(getByTestId('layout-app-layout__tools-close'))
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
    expect(separator.getAttribute('aria-valuenow')).toBe('240')
    await fireEvent.keyDown(separator, { key: 'ArrowUp' })
    expect(separator.getAttribute('aria-valuenow')).toBe('256')
    await fireEvent.keyDown(separator, { key: 'ArrowDown', shiftKey: true })
    expect(separator.getAttribute('aria-valuenow')).toBe('192')
    await fireEvent.keyDown(separator, { key: 'Home' })
    expect(separator.getAttribute('aria-valuenow')).toBe('160')
    expect(getByTestId('layout-app-layout__split-panel').style.height).toBe('160px')
  })

  it('moves the split panel to the side and back', async () => {
    const { getByTestId, getByRole } = render(layout({ splitPanelOpen: true }))
    const root = getByTestId('layout-app-layout')
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
    const root = getByTestId('layout-app-layout')
    expect(root.dataset.compact).toBeDefined()
    expect(queryByText('nav links')).toBeNull()
    await fireEvent.click(getByText('Open navigation'))
    const dialog = await findByRole('dialog', { name: 'Navigation' })
    expect(dialog.textContent).toContain('nav links')
    expect(dialog.querySelector('[data-drawer="true"]')).toBeTruthy()
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
    expect(getByTestId('layout-app-layout').dataset.splitPanelPosition).toBe('bottom')
    expect(queryByRole('button', { name: 'Show beside the content' })).toBeNull()
  })

  it('opens the tools in a drawer while compact', async () => {
    const { getByTestId, getByRole, findByRole } = render(layout({}, 500))
    await waitFor(() => expect(getByTestId('compact').textContent).toBe('true'))
    await fireEvent.click(getByRole('button', { name: 'Help' }))
    const dialog = await findByRole('dialog', { name: 'Help' })
    expect(dialog.textContent).toContain('help body')
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
})

describe('AppLayout right-to-left', () => {
  it('grows a side split panel with ArrowRight under rtl', async () => {
    const { getByRole } = render(
      layout({ splitPanelOpen: true, splitPanelPosition: 'side', splitPanelSize: 300 }, 1200, 'rtl')
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
