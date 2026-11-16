import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, nextTick } from 'vue'

import Default from '../../../../examples/context-menu/default.vue'
import Disabled from '../../../../examples/context-menu/disabled.vue'
import WithSubMenu from '../../../../examples/context-menu/with-sub-menu.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import ContextMenu from './index'

const panel = () => document.body.querySelector<HTMLElement>('[data-testid="context-menu__panel"]')

const area = () => document.body.querySelector<HTMLElement>('[data-testid="context-menu-trigger"]')

const rows = () => Array.from(document.body.querySelectorAll<HTMLElement>('li'))

describe('ContextMenu', () => {
  it('renders the root and the area with derived test ids, and a consumer test id wins', async () => {
    const { container } = render(Default)
    expect(container.querySelector('[data-testid="context-menu"]')).not.toBeNull()
    expect(area()?.dataset['state']).toBe('closed')
    expect(panel()).toBeNull()

    const Override = defineComponent({
      setup: () => () =>
        h(ContextMenu, { 'data-testid': 'files-menu' }, () => [
          h(ContextMenu.Trigger, null, () => h('p', 'Area'))
        ])
    })
    const second = render(Override)
    expect(second.container.querySelector('[data-testid="files-menu"]')).not.toBeNull()
    expect(second.container.querySelector('[data-testid="context-menu-trigger"]')).not.toBeNull()
  })

  it('compound exposes the shared DropdownMenu item parts', () => {
    expect(ContextMenu.Trigger).toBeTruthy()
    expect(ContextMenu.Group).toBeTruthy()
    expect(ContextMenu.Item).toBeTruthy()
    expect(ContextMenu.Sub).toBeTruthy()
    expect(ContextMenu.SubTrigger).toBeTruthy()
    expect(ContextMenu.SubContent).toBeTruthy()
  })

  it('right-click opens the menu at the pointer, prevents the native menu and focuses the first item', async () => {
    render(Default)
    const row = rows()[1]
    const rect = row.getBoundingClientRect()
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: rect.left + 20,
      clientY: rect.top + 5
    })
    row.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(true)
    await waitFor(() => expect(panel()).not.toBeNull())
    expect(area()?.dataset['state']).toBe('open')
    const menu = panel()?.querySelector('[role="menu"]') as HTMLElement
    expect(menu.getAttribute('aria-label')).toBe('Actions for staging')
    await waitFor(() => expect(document.activeElement?.textContent).toContain('Open'))
  })

  it('selecting an item emits select with the event first, closes and restores focus to the row', async () => {
    render(Default)
    const row = rows()[0]
    row.focus()
    await userEvent.keyboard('{Shift>}{F10}{/Shift}')
    await waitFor(() => expect(panel()).not.toBeNull())
    await waitFor(() => expect(document.activeElement?.textContent).toContain('Open'))
    await userEvent.keyboard('{ArrowDown}{Enter}')
    await waitFor(() => expect(panel()).toBeNull())
    expect(document.activeElement).toBe(row)
    expect(document.body.textContent).toContain('Last action: rename · production')
  })

  it('emits select with (event, value)', async () => {
    const calls: unknown[][] = []
    const Host = defineComponent({
      setup: () => () =>
        h(ContextMenu, { onSelect: (...args: unknown[]) => calls.push(args) }, () => [
          h(ContextMenu.Trigger, null, () => h('button', { type: 'button' }, 'Target')),
          h(ContextMenu.Group, null, () => [h(ContextMenu.Item, { value: 'copy', label: 'Copy' })])
        ])
    })
    render(Host)
    const button = document.body.querySelector('button') as HTMLElement
    await fireEvent.contextMenu(button)
    await waitFor(() => expect(panel()).not.toBeNull())
    await userEvent.click(within(panel() as HTMLElement).getByText('Copy'))
    expect(calls).toHaveLength(1)
    expect(calls[0][0]).toBeInstanceOf(MouseEvent)
    expect(calls[0][1]).toBe('copy')
  })

  it('renders the resolved side and align on the panel in both directions', async () => {
    const Host = (dir: 'ltr' | 'rtl') =>
      defineComponent({
        components: {
          Root: ContextMenu,
          Area: ContextMenu.Trigger,
          Group: ContextMenu.Group,
          Item: ContextMenu.Item
        },
        template: `
          <div dir="${dir}" style="position:fixed;top:40px;left:160px;width:120px">
            <Root aria-label="Resource actions">
              <Area><ul><li tabindex="0">production</li></ul></Area>
              <Group><Item value="open" label="Open" /></Group>
            </Root>
          </div>
        `
      })
    for (const dir of ['ltr', 'rtl'] as const) {
      const view = render(Host(dir))
      const row = rows()[0]
      const rect = row.getBoundingClientRect()
      const x = dir === 'rtl' ? rect.right - 10 : rect.left + 10
      row.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: rect.top + 5
        })
      )
      await waitFor(() => expect(panel()?.style.translate ?? '').not.toMatch(/-9999|^$/))
      expect(panel()?.dataset['side']).toBe('bottom')
      expect(panel()?.dataset['align']).toBe('start')
      view.unmount()
      await nextTick()
    }
  })

  it('the ContextMenu key opens it; Escape closes and returns focus', async () => {
    render(Default)
    const row = rows()[2]
    row.focus()
    await fireEvent.keyDown(row, { key: 'ContextMenu' })
    await waitFor(() => expect(panel()).not.toBeNull())
    await waitFor(() => expect(document.activeElement?.textContent).toContain('Open'))
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(panel()).toBeNull())
    expect(document.activeElement).toBe(row)
  })

  it('an outside click closes the menu and v-model emits update:open', async () => {
    const updates: boolean[] = []
    const Host = defineComponent({
      setup: () => () =>
        h(ContextMenu, { 'onUpdate:open': (value: boolean) => updates.push(value) }, () => [
          h(ContextMenu.Trigger, null, () => h('p', 'Area')),
          h(ContextMenu.Group, null, () => [h(ContextMenu.Item, { value: 'a', label: 'A' })])
        ])
    })
    render(Host)
    await fireEvent.contextMenu(area() as HTMLElement)
    await waitFor(() => expect(panel()).not.toBeNull())
    await fireEvent.mouseDown(document.body)
    await waitFor(() => expect(panel()).toBeNull())
    expect(updates).toEqual([true, false])
  })

  it('a touch long-press opens the menu', async () => {
    render(Default)
    const row = rows()[0]
    await fireEvent.pointerDown(row, { pointerType: 'touch', clientX: 10, clientY: 10 })
    await waitFor(() => expect(panel()).not.toBeNull(), { timeout: 1500 })
  })

  it('disabled leaves the native menu alone and never opens', async () => {
    render(Disabled)
    expect(area()?.hasAttribute('data-disabled')).toBe(true)
    const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true })
    area()?.dispatchEvent(event)
    expect(event.defaultPrevented).toBe(false)
    await nextTick()
    expect(panel()).toBeNull()
  })

  it('the forced-open example shows a sub-menu and checkable items with no a11y violations', async () => {
    const { container } = render(WithSubMenu)
    await waitFor(() => expect(panel()).not.toBeNull())
    await waitFor(() =>
      expect(
        document.body.querySelector('[data-testid="dropdown-menu-sub-content"]')
      ).not.toBeNull()
    )
    expect(document.body.querySelectorAll('[role="menuitemcheckbox"]')).toHaveLength(2)
    await expectNoA11yViolations(container)
    await expectNoA11yViolations(panel() as HTMLElement)
  })

  it('the default example has no a11y violations', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })
})
