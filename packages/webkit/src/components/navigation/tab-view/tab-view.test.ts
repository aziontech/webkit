import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, ref } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/navigation/tab-view/TabView.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import TabView from './index'
import TabViewContent from './tab-view-content.vue'
import TabViewItem from './tab-view-item.vue'
import TabViewList from './tab-view-list.vue'
import TabViewPanel from './tab-view-panel.vue'
import TabViewRoot from './tab-view-root.vue'

const { Default } = composeStories(stories)

// A realistic composed tab tree wired through the dot-notation sub-components.
// Uncontrolled (default-value) unless a test overrides via v-model.
const Tree = defineComponent({
  components: { TabView, TabViewList, TabViewItem, TabViewContent, TabViewPanel },
  props: {
    defaultValue: { type: String, default: 'tab-1' },
    disableSecond: { type: Boolean, default: false }
  },
  template: `
    <TabView :default-value="defaultValue" data-testid="tv">
      <TabViewList>
        <TabViewItem value="tab-1" label="First" />
        <TabViewItem value="tab-2" label="Second" :disabled="disableSecond" />
        <TabViewItem value="tab-3" label="Third" />
      </TabViewList>
      <TabViewContent>
        <TabViewPanel value="tab-1">Content one</TabViewPanel>
        <TabViewPanel value="tab-2">Content two</TabViewPanel>
        <TabViewPanel value="tab-3">Content three</TabViewPanel>
      </TabViewContent>
    </TabView>
  `
})

describe('TabView (composition)', () => {
  describe('compound API (index.js dot-notation)', () => {
    it('attaches every public sub-component to the root compound', () => {
      // Grounded in index.js: TabView === TabViewRoot with Root/List/Item/
      // Content/Panel assigned onto it.
      expect(TabView).toBe(TabViewRoot)
      expect(TabView.Root).toBe(TabViewRoot)
      expect(TabView.List).toBe(TabViewList)
      expect(TabView.Item).toBe(TabViewItem)
      expect(TabView.Content).toBe(TabViewContent)
      expect(TabView.Panel).toBe(TabViewPanel)
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

    it('wires aria-controls / aria-labelledby between the active tab and its panel', () => {
      const { getAllByRole } = render(Tree)

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
      const { getByRole, emitted } = render(TabViewItem, {
        props: { value: 'a', label: 'Alpha' }
      })

      await fireEvent.click(getByRole('tab'))

      const events = emitted().click
      expect(events).toHaveLength(1)
      expect(events[0][0]).toBeInstanceOf(MouseEvent)
    })

    it('does not emit click when the Item is disabled', async () => {
      const { getByRole, emitted } = render(TabViewItem, {
        props: { value: 'a', label: 'Alpha', disabled: true }
      })

      await fireEvent.click(getByRole('tab'))

      expect(emitted().click).toBeUndefined()
    })

    it('renders a close affordance and emits close (not click) when it is clicked', async () => {
      const { getByTestId, emitted } = render(TabViewItem, {
        props: { value: 'a', label: 'Alpha', closable: true }
      })

      const close = getByTestId('navigation-tab-view-item__close')
      expect(close.getAttribute('aria-label')).toBe('Close tab')

      await fireEvent.click(close)

      const closeEvents = emitted().close
      expect(closeEvents).toHaveLength(1)
      expect(closeEvents[0][0]).toBeInstanceOf(MouseEvent)
      // @click.stop on the close box stops propagation → the tab click is not emitted.
      expect(emitted().click).toBeUndefined()
    })
  })

  describe('v-model:value round-trip and update:value', () => {
    it('emits update:value with the new value on activation', async () => {
      const updates: Array<string | number | null> = []

      const Host = defineComponent({
        components: { TabView, TabViewList, TabViewItem },
        setup() {
          return {
            onUpdate: (v: string | number | null) => updates.push(v)
          }
        },
        template: `
          <TabView default-value="tab-1" @update:value="onUpdate">
            <TabViewList>
              <TabViewItem value="tab-1" label="First" />
              <TabViewItem value="tab-2" label="Second" />
            </TabViewList>
          </TabView>
        `
      })

      const { getByText } = render(Host)
      await fireEvent.click(getByText('Second'))

      expect(updates.at(-1)).toBe('tab-2')
    })

    it('round-trips v-model:value — external change selects the matching tab and content', async () => {
      const Host = defineComponent({
        components: { TabView, TabViewList, TabViewItem, TabViewContent, TabViewPanel },
        setup: () => ({ active: ref<string>('tab-1') }),
        template: `
          <div>
            <button data-testid="ext" type="button" @click="active = 'tab-3'">go</button>
            <TabView v-model:value="active">
              <TabViewList>
                <TabViewItem value="tab-1" label="First" />
                <TabViewItem value="tab-2" label="Second" />
                <TabViewItem value="tab-3" label="Third" />
              </TabViewList>
              <TabViewContent>
                <TabViewPanel value="tab-1">One</TabViewPanel>
                <TabViewPanel value="tab-3">Three</TabViewPanel>
              </TabViewContent>
            </TabView>
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
      const withProp = render(TabViewItem, { props: { value: 'a', label: 'FromProp' } })
      expect(withProp.getByTestId('navigation-tab-view-item__label').textContent?.trim()).toBe(
        'FromProp'
      )
      withProp.unmount()

      const withSlot = render(TabViewItem, {
        props: { value: 'a', label: 'FromProp' },
        slots: { default: 'FromSlot' }
      })
      const label = withSlot.getByTestId('navigation-tab-view-item__label')
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
      const { getByTestId, container } = render(Default())

      expect(getByTestId('navigation-tab-view')).toBeTruthy()
      await expectNoA11yViolations(container)
    })
  })
})
