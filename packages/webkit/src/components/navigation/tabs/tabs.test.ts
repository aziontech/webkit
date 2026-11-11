import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent as keyboardUser } from 'vitest/browser'
import { defineComponent, nextTick, ref } from 'vue'

import Default from '../../../../examples/tabs/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Tabs from './index'
import { getTabViewPanelTransitionStyle } from './presets/transitions'
import TabsContent from './tabs-content.vue'
import TabsItem from './tabs-item.vue'
import TabsList from './tabs-list.vue'
import TabsPanel from './tabs-panel.vue'
import TabsRoot from './tabs-root.vue'

// A realistic composed tab tree wired through the dot-notation sub-components.
// Uncontrolled (default-value) unless a test overrides via v-model.
const Tree = defineComponent({
  components: { Tabs, TabsList, TabsItem, TabsContent, TabsPanel },
  props: {
    defaultValue: { type: String, default: 'tab-1' },
    disableSecond: { type: Boolean, default: false }
  },
  template: `
    <Tabs :default-value="defaultValue" data-testid="tv">
      <TabsList>
        <TabsItem value="tab-1" label="First" />
        <TabsItem value="tab-2" label="Second" :disabled="disableSecond" />
        <TabsItem value="tab-3" label="Third" />
      </TabsList>
      <TabsContent>
        <TabsPanel value="tab-1">Content one</TabsPanel>
        <TabsPanel value="tab-2">Content two</TabsPanel>
        <TabsPanel value="tab-3">Content three</TabsPanel>
      </TabsContent>
    </Tabs>
  `
})

describe('Tabs (composition)', () => {
  // The panel slide offset is a Tailwind `translate-x-*` utility, which in v4 compiles to
  // the standalone `translate` property — NOT to `transform`. If `translate` is dropped
  // from this list the offset stops interpolating and the swap pops instead of sliding,
  // in this component and in Calendar's month strip, which shares the preset. <Transition>
  // is stubbed by Vue Test Utils, so the rendered animation cannot be asserted; this
  // guards the css contract behind it. Verified in real Chromium: with only
  // `transform, opacity`, a mid-flight sample is already at its final value.
  describe('panel motion contract', () => {
    it('transitions translate (not just transform) so translate-x offsets interpolate', () => {
      const { transition } = getTabViewPanelTransitionStyle()
      expect(transition).toContain('translate ')
      expect(transition).toContain('opacity ')
    })

    it('renders the initially active panel visible and runs the enter motion only on a change', async () => {
      const { getByText } = render(Tree)
      const first = getByText('Content one') as HTMLElement
      expect(first.className).not.toContain('opacity-0')
      expect(first.className).toContain('opacity-100')

      await fireEvent.click(getByText('Second'))
      const second = getByText('Content two') as HTMLElement
      expect(second.className).toContain('opacity-0')
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)))
      await nextTick()
      expect(second.className).toContain('opacity-100')
    })
  })

  describe('compound API (index.js dot-notation)', () => {
    it('attaches every public sub-component to the root compound', () => {
      // Grounded in index.js: Tabs === TabsRoot with Root/List/Item/
      // Content/Panel assigned onto it.
      expect(Tabs).toBe(TabsRoot)
      expect(Tabs.Root).toBe(TabsRoot)
      expect(Tabs.List).toBe(TabsList)
      expect(Tabs.Item).toBe(TabsItem)
      expect(Tabs.Content).toBe(TabsContent)
      expect(Tabs.Panel).toBe(TabsPanel)
    })
  })

  describe('structure, roles, and context-derived ids', () => {
    it('renders root/list/content with their testids and tablist role', () => {
      const { getByTestId } = render(Tree)

      // Root testid supplied by the consumer (data-testid="tv"); List/Content
      // derive their testids from the injected context.testId.
      expect(getByTestId('tv')).toBeTruthy()
      const list = getByTestId('tv__list')
      expect(list.getAttribute('role')).toBe('tablist')
      expect(getByTestId('tv__content')).toBeTruthy()
    })

    // The horizontal-scroll affordance (overflow-x + edge-fade overlays) is a
    // visual-layer behavior: it depends on Tailwind utilities applying and on real
    // layout-driven overflow measurement. This unit env deliberately runs no Tailwind
    // and loads no theme CSS (see src/test/setup.ts), so overflow/scroll cannot be
    // asserted here — that behavior is covered by the `Scrollable` story's visual
    // regression snapshots (per .claude/rules/testing.md: pixels & layout live in
    // Storybook visual, not the unit suite).

    it('renders each tab as role=tab and each panel as role=tabpanel', () => {
      const { getAllByRole } = render(Tree)

      const tabs = getAllByRole('tab')
      expect(tabs).toHaveLength(3)
      // Only the active panel is exposed; inactive panels carry the hidden
      // attribute (role=tabpanel still present in DOM).
      const panels = getAllByRole('tabpanel', { hidden: true })
      expect(panels).toHaveLength(3)
    })

    it('wires aria-controls / aria-labelledby between the active tab and its panel', async () => {
      const { getAllByRole } = render(Tree)
      await nextTick()

      const activeTab = getAllByRole('tab').find(
        (t) => t.getAttribute('aria-selected') === 'true'
      ) as HTMLElement
      const panelId = activeTab.getAttribute('aria-controls')
      const tabId = activeTab.getAttribute('id')
      expect(panelId).toBeTruthy()
      expect(tabId).toBeTruthy()

      const panel = document.getElementById(panelId as string) as HTMLElement
      expect(panel.getAttribute('role')).toBe('tabpanel')
      expect(panel.getAttribute('aria-labelledby')).toBe(tabId)
    })

    it('leaves aria-controls off a tab whose panel is rendered elsewhere', () => {
      const { getAllByRole } = render(
        defineComponent({
          components: { TabsRoot, TabsList, TabsItem },
          template: `
            <TabsRoot default-value="a">
              <TabsList>
                <TabsItem value="a" label="A" />
                <TabsItem value="b" label="B" />
              </TabsList>
            </TabsRoot>
          `
        })
      )

      expect(getAllByRole('tab').every((tab) => !tab.hasAttribute('aria-controls'))).toBe(true)
    })
  })

  describe('provide/inject — selection state flows from Root to Item and Panel', () => {
    it('auto-selects the default-value tab on mount and reflects it in tab + panel state', () => {
      const { getByText, getAllByRole } = render(Tree)

      const firstTab = getByText('First').closest('[role="tab"]') as HTMLElement
      expect(firstTab.getAttribute('aria-selected')).toBe('true')
      expect(firstTab.getAttribute('data-state')).toBe('active')
      // Active tab is the only one in the tab order.
      expect(firstTab.getAttribute('tabindex')).toBe('0')

      // The others are inactive and removed from the tab order.
      const inactive = getAllByRole('tab').filter(
        (t) => t.getAttribute('aria-selected') === 'false'
      )
      expect(inactive).toHaveLength(2)
      inactive.forEach((t) => expect(t.getAttribute('tabindex')).toBe('-1'))
    })

    it('only renders the active panel content; inactive panels are hidden', () => {
      const { getByText, queryByText } = render(Tree)

      // tab-1 active by default → its content is rendered.
      expect(getByText('Content one')).toBeTruthy()
      // Inactive panels do not render their inner content (v-if isActive).
      expect(queryByText('Content two')).toBeNull()
      expect(queryByText('Content three')).toBeNull()
    })

    it('moves selection and panel content when a different Item is clicked (context.setValue)', async () => {
      const { getByText, queryByText } = render(Tree)

      await fireEvent.click(getByText('Second'))

      const secondTab = getByText('Second').closest('[role="tab"]') as HTMLElement
      expect(secondTab.getAttribute('aria-selected')).toBe('true')
      expect(secondTab.getAttribute('data-state')).toBe('active')

      const firstTab = getByText('First').closest('[role="tab"]') as HTMLElement
      expect(firstTab.getAttribute('aria-selected')).toBe('false')

      // Panel content follows the injected active value.
      expect(getByText('Content two')).toBeTruthy()
      expect(queryByText('Content one')).toBeNull()
    })
  })

  describe('events on the Item', () => {
    it('emits click with the native MouseEvent when an enabled tab is activated', async () => {
      // Render a single standalone Item (no context) to observe its own emits.
      const { getByRole, emitted } = render(TabsItem, {
        props: { value: 'a', label: 'Alpha' }
      })

      await fireEvent.click(getByRole('button'))

      const events = emitted().click
      expect(events).toHaveLength(1)
      expect(events[0][0]).toBeInstanceOf(MouseEvent)
    })

    it('does not emit click when the Item is disabled', async () => {
      const { getByRole, emitted } = render(TabsItem, {
        props: { value: 'a', label: 'Alpha', disabled: true }
      })

      await fireEvent.click(getByRole('button'))

      expect(emitted().click).toBeUndefined()
    })

    it('renders a close affordance and emits close (not click) when it is clicked', async () => {
      const { getByTestId, emitted } = render(TabsItem, {
        props: { value: 'a', label: 'Alpha', closable: true }
      })

      const close = getByTestId('navigation-tabs-item__close')
      expect(close.getAttribute('aria-hidden')).toBe('true')
      expect(close.getAttribute('role')).toBeNull()
      expect(close.getAttribute('title')).toBe('Close tab')

      await fireEvent.click(close)

      const closeEvents = emitted().close
      expect(closeEvents).toHaveLength(1)
      expect(closeEvents[0][0]).toBeInstanceOf(MouseEvent)
      // @click.stop on the close box stops propagation → the tab click is not emitted.
      expect(emitted().click).toBeUndefined()
    })
    it('emits close on Delete from a closable tab, and nothing from a plain one', async () => {
      const { getByTestId, emitted, rerender } = render(TabsItem, {
        props: { value: 'a', label: 'Alpha', closable: true }
      })
      const tab = getByTestId('navigation-tabs-item')
      expect(tab.getAttribute('aria-keyshortcuts')).toBe('Delete')

      await fireEvent.keyDown(tab, { key: 'Delete' })
      expect(emitted().close).toHaveLength(1)
      expect(emitted().close[0][0]).toBeInstanceOf(KeyboardEvent)

      await rerender({ value: 'a', label: 'Alpha', closable: false })
      await fireEvent.keyDown(tab, { key: 'Delete' })
      expect(emitted().close).toHaveLength(1)
      expect(tab.hasAttribute('aria-keyshortcuts')).toBe(false)
    })

    it('marks a dirty tab with a dot and a hidden "Unsaved changes"', async () => {
      const { getByRole, getByTestId, queryByTestId, rerender } = render(TabsItem, {
        props: { value: 'a', label: 'Alpha', dirty: true }
      })

      const tab = getByRole('button')
      expect(tab.hasAttribute('data-dirty')).toBe(true)
      expect(getByTestId('navigation-tabs-item__dirty').getAttribute('aria-hidden')).toBe('true')
      expect(tab.textContent).toContain('Unsaved changes')

      await rerender({ dirty: false })
      expect(queryByTestId('navigation-tabs-item__dirty')).toBeNull()
      expect(tab.hasAttribute('data-dirty')).toBe(false)
    })
  })

  describe('v-model round-trip and update:modelValue', () => {
    it('emits update:modelValue with the new value on activation', async () => {
      const updates: Array<string | number | null> = []

      const Host = defineComponent({
        components: { Tabs, TabsList, TabsItem },
        setup() {
          return {
            onUpdate: (v: string | number | null) => updates.push(v)
          }
        },
        template: `
          <Tabs default-value="tab-1" @update:modelValue="onUpdate">
            <TabsList>
              <TabsItem value="tab-1" label="First" />
              <TabsItem value="tab-2" label="Second" />
            </TabsList>
          </Tabs>
        `
      })

      const { getByText } = render(Host)
      await fireEvent.click(getByText('Second'))

      expect(updates.at(-1)).toBe('tab-2')
    })

    it('round-trips v-model — external change selects the matching tab and content', async () => {
      const Host = defineComponent({
        components: { Tabs, TabsList, TabsItem, TabsContent, TabsPanel },
        setup: () => ({ active: ref<string>('tab-1') }),
        template: `
          <div>
            <button data-testid="ext" type="button" @click="active = 'tab-3'">go</button>
            <Tabs v-model="active">
              <TabsList>
                <TabsItem value="tab-1" label="First" />
                <TabsItem value="tab-2" label="Second" />
                <TabsItem value="tab-3" label="Third" />
              </TabsList>
              <TabsContent>
                <TabsPanel value="tab-1">One</TabsPanel>
                <TabsPanel value="tab-3">Three</TabsPanel>
              </TabsContent>
            </Tabs>
          </div>
        `
      })

      const { getByText, getByTestId, queryByText } = render(Host)

      // Initial controlled value = tab-1.
      expect(getByText('One')).toBeTruthy()
      expect(
        (getByText('First').closest('[role="tab"]') as HTMLElement).getAttribute('aria-selected')
      ).toBe('true')

      // External model mutation propagates in.
      await fireEvent.click(getByTestId('ext'))

      expect(
        (getByText('Third').closest('[role="tab"]') as HTMLElement).getAttribute('aria-selected')
      ).toBe('true')
      expect(getByText('Three')).toBeTruthy()
      expect(queryByText('One')).toBeNull()

      // Clicking a tab writes back to the model (tab-2 selects, updates v-model).
      await fireEvent.click(getByText('Second'))
      expect(
        (getByText('Second').closest('[role="tab"]') as HTMLElement).getAttribute('aria-selected')
      ).toBe('true')
    })
  })

  describe('keyboard navigation on the tablist (context.onListKeydown)', () => {
    it('ArrowRight/ArrowLeft move selection across enabled tabs and wrap around', async () => {
      const { getByTestId, getByText } = render(Tree)
      const list = getByTestId('tv__list')

      // Start on tab-1 (default). ArrowRight → tab-2.
      await fireEvent.keyDown(list, { key: 'ArrowRight' })
      expect(
        (getByText('Second').closest('[role="tab"]') as HTMLElement).getAttribute('aria-selected')
      ).toBe('true')

      // ArrowRight → tab-3.
      await fireEvent.keyDown(list, { key: 'ArrowRight' })
      expect(
        (getByText('Third').closest('[role="tab"]') as HTMLElement).getAttribute('aria-selected')
      ).toBe('true')

      // ArrowRight wraps back to tab-1.
      await fireEvent.keyDown(list, { key: 'ArrowRight' })
      expect(
        (getByText('First').closest('[role="tab"]') as HTMLElement).getAttribute('aria-selected')
      ).toBe('true')

      // ArrowLeft wraps to the last tab (tab-3).
      await fireEvent.keyDown(list, { key: 'ArrowLeft' })
      expect(
        (getByText('Third').closest('[role="tab"]') as HTMLElement).getAttribute('aria-selected')
      ).toBe('true')
    })

    it('Home selects the first enabled tab and End selects the last', async () => {
      const { getByTestId, getByText } = render(Tree, { props: { defaultValue: 'tab-2' } })
      const list = getByTestId('tv__list')

      await fireEvent.keyDown(list, { key: 'End' })
      expect(
        (getByText('Third').closest('[role="tab"]') as HTMLElement).getAttribute('aria-selected')
      ).toBe('true')

      await fireEvent.keyDown(list, { key: 'Home' })
      expect(
        (getByText('First').closest('[role="tab"]') as HTMLElement).getAttribute('aria-selected')
      ).toBe('true')
    })

    it('ArrowRight skips a disabled tab (only enabled tabs participate)', async () => {
      // tab-2 disabled → from tab-1, ArrowRight lands on tab-3.
      const { getByTestId, getByText } = render(Tree, { props: { disableSecond: true } })
      const list = getByTestId('tv__list')

      await fireEvent.keyDown(list, { key: 'ArrowRight' })

      expect(
        (getByText('Third').closest('[role="tab"]') as HTMLElement).getAttribute('aria-selected')
      ).toBe('true')
      expect(
        (getByText('Second').closest('[role="tab"]') as HTMLElement).getAttribute('aria-selected')
      ).toBe('false')
    })
  })

  describe('Item label prop and slot', () => {
    it('renders the label prop and lets the default slot override it', () => {
      const withProp = render(TabsItem, { props: { value: 'a', label: 'FromProp' } })
      expect(withProp.getByTestId('navigation-tabs-item__label').textContent?.trim()).toBe(
        'FromProp'
      )
      withProp.unmount()

      const withSlot = render(TabsItem, {
        props: { value: 'a', label: 'FromProp' },
        slots: { default: 'FromSlot' }
      })
      const label = withSlot.getByTestId('navigation-tabs-item__label')
      expect(label.textContent).toContain('FromSlot')
      expect(label.textContent).not.toContain('FromProp')
    })
  })

  describe('accessibility', () => {
    it('has no a11y violations for the composed tab tree', async () => {
      const { container } = render(Tree)

      await expectNoA11yViolations(container)
    })

    it('renders the Default story fixture cleanly with no a11y violations', async () => {
      const { getByTestId, container } = render(Default)

      expect(getByTestId('navigation-tabs')).toBeTruthy()
      await expectNoA11yViolations(container)
    })
  })
})

describe('keyboard map (spec)', () => {
  const setup = async (props: Record<string, unknown> = {}) => {
    const view = render(Tree, { props })
    const tab = (label: string) => view.getByText(label).closest('[role="tab"]') as HTMLElement
    const before = document.createElement('button')
    before.textContent = 'Before'
    document.body.prepend(before)
    before.focus()
    await keyboardUser.keyboard('{Tab}')
    before.remove()
    return { ...view, tab }
  }

  it('Tab enters the tab list on the selected tab only', async () => {
    const { tab } = await setup({ defaultValue: 'tab-2' })
    expect(document.activeElement).toBe(tab('Second'))
    expect(tab('First').getAttribute('tabindex')).toBe('-1')
  })

  it('ArrowRight selects and focuses the next tab, wrapping at the end', async () => {
    const { tab } = await setup({ defaultValue: 'tab-3' })
    await keyboardUser.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(tab('First'))
    expect(tab('First').getAttribute('aria-selected')).toBe('true')
  })

  it('ArrowLeft selects and focuses the previous tab, wrapping at the start', async () => {
    const { tab } = await setup()
    await keyboardUser.keyboard('{ArrowLeft}')
    expect(document.activeElement).toBe(tab('Third'))
    expect(tab('Third').getAttribute('aria-selected')).toBe('true')
  })

  it('Home and End select the first and last enabled tabs', async () => {
    const { tab } = await setup({ defaultValue: 'tab-2' })
    await keyboardUser.keyboard('{End}')
    expect(document.activeElement).toBe(tab('Third'))
    await keyboardUser.keyboard('{Home}')
    expect(document.activeElement).toBe(tab('First'))
  })

  it('arrows skip disabled tabs', async () => {
    const { tab } = await setup({ disableSecond: true })
    await keyboardUser.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(tab('Third'))
  })

  it('Tab from the selected tab moves into its panel', async () => {
    const { getByText } = await setup()
    await keyboardUser.keyboard('{Tab}')
    expect(document.activeElement).toBe(getByText('Content one').closest('[role="tabpanel"]'))
  })
})
