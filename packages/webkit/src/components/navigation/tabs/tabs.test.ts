import '../../../test/reflow.css'

import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { commands, userEvent as keyboardUser } from 'vitest/browser'
import { defineComponent, nextTick, ref } from 'vue'

import Centered from '../../../../examples/tabs/centered.vue'
import Default from '../../../../examples/tabs/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Tabs from './index'
import { getTabViewPanelTransitionStyle } from './presets/transitions'
import TabsRoot from './tabs.vue'
import TabsContent from './tabs-content.vue'
import TabsList from './tabs-list.vue'
import TabsTrigger from './tabs-trigger.vue'

// A realistic composed tab tree wired through the dot-notation sub-components.
// Uncontrolled (default-value) unless a test overrides via v-model.
const Tree = defineComponent({
  components: { Tabs, TabsList, TabsTrigger, TabsContent },
  props: {
    defaultValue: { type: String, default: 'tab-1' },
    disableSecond: { type: Boolean, default: false }
  },
  template: `
    <Tabs :default-value="defaultValue" data-testid="tv">
      <TabsList>
        <TabsTrigger value="tab-1" label="First" />
        <TabsTrigger value="tab-2" label="Second" :disabled="disableSecond" />
        <TabsTrigger value="tab-3" label="Third" />
      </TabsList>
      <TabsContent value="tab-1">Content one</TabsContent>
      <TabsContent value="tab-2">Content two</TabsContent>
      <TabsContent value="tab-3">Content three</TabsContent>
    </Tabs>
  `
})

describe('Tabs', () => {
  describe('panel spacing', () => {
    it('starts every panel one group step below the strip', () => {
      const view = render(Tree)
      const probe = document.createElement('div')
      probe.style.height = 'var(--layout-group-gap)'
      document.body.append(probe)
      const step = probe.getBoundingClientRect().height
      probe.remove()
      const list = view.getByRole('tablist').getBoundingClientRect()
      const text = view.getByText('Content one').getBoundingClientRect()
      expect(step).toBeGreaterThan(0)
      expect(text.top - list.bottom).toBeGreaterThanOrEqual(step - 0.5)
      expect(text.top - list.bottom).toBeLessThan(step + 8)
    })
  })

  describe('composition', () => {
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
        expect(first).not.toHaveAttribute('data-motion')

        await fireEvent.click(getByText('Second'))
        const second = getByText('Content two') as HTMLElement
        expect(second).toHaveAttribute('data-motion', 'enter')
        expect(second).toHaveAttribute('data-slide', 'end')
        await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 0)))
        await nextTick()
        expect(second).not.toHaveAttribute('data-motion')
      })
    })

    describe('compound API (index.ts dot-notation)', () => {
      it('attaches every public sub-component to the root compound', () => {
        expect(Tabs).toBe(TabsRoot)
        expect(Tabs.List).toBe(TabsList)
        expect(Tabs.Trigger).toBe(TabsTrigger)
        expect(Tabs.Content).toBe(TabsContent)
      })

      it('attaches only List, Trigger and Content (no synonyms)', () => {
        const members = Object.keys(Tabs).filter((key) => /^[A-Z]/.test(key))
        expect(members.sort()).toEqual(['Content', 'List', 'Trigger'])
      })
    })

    describe('structure, roles, and test ids', () => {
      it('renders root/list/content with their testids and tablist role', () => {
        const { getByTestId, getAllByTestId } = render(Tree)

        expect(getByTestId('tv')).toBeTruthy()
        const list = getByTestId('tabs-list')
        expect(list.getAttribute('role')).toBe('tablist')
        expect(getAllByTestId('tabs-content')[0]?.getAttribute('role')).toBe('tabpanel')
      })

      // The horizontal-scroll affordance (overflow-x + edge-fade overlays) is a
      // visual-layer behavior: it depends on Tailwind utilities applying and on real
      // layout-driven overflow measurement. This unit env deliberately runs no Tailwind
      // and loads no theme CSS (see src/test/setup.ts), so overflow/scroll cannot be
      // asserted here — that behavior is covered by the `Scrollable` story's visual
      // regression snapshots (per .claude/rules/testing.md: pixels & layout live in
      // the styled visual suite, not the unit suite).

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
            components: { TabsRoot, TabsList, TabsTrigger },
            template: `
            <TabsRoot default-value="a">
              <TabsList>
                <TabsTrigger value="a" label="A" />
                <TabsTrigger value="b" label="B" />
              </TabsList>
            </TabsRoot>
          `
          })
        )

        expect(getAllByRole('tab').every((tab) => !tab.hasAttribute('aria-controls'))).toBe(true)
      })
    })

    describe('provide/inject — selection state flows from the root to Trigger and Content', () => {
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

    describe('a standalone Trigger', () => {
      it('has no selection of its own: a removed selected attribute does not press it', () => {
        const { getByRole } = render(TabsTrigger, {
          props: { value: 'a', label: 'Alpha' },
          attrs: { selected: true }
        })

        const button = getByRole('button')
        expect(button.getAttribute('aria-pressed')).toBeNull()
        expect(button.getAttribute('data-state')).toBe('inactive')
      })
    })

    describe('events on the Trigger', () => {
      it('emits click with the native MouseEvent when an enabled tab is activated', async () => {
        // Render a single standalone Item (no context) to observe its own emits.
        const { getByRole, emitted } = render(TabsTrigger, {
          props: { value: 'a', label: 'Alpha' }
        })

        await fireEvent.click(getByRole('button'))

        const events = emitted<unknown[]>().click
        expect(events).toHaveLength(1)
        expect(events[0][0]).toBeInstanceOf(MouseEvent)
      })

      it('does not emit click when the Item is disabled', async () => {
        const { getByRole, emitted } = render(TabsTrigger, {
          props: { value: 'a', label: 'Alpha', disabled: true }
        })

        await fireEvent.click(getByRole('button'))

        expect(emitted().click).toBeUndefined()
      })

      it('renders a close affordance and emits close (not click) when it is clicked', async () => {
        const { getByTestId, emitted } = render(TabsTrigger, {
          props: { value: 'a', label: 'Alpha', closable: true }
        })

        const close = getByTestId('tabs-trigger__close')
        expect(close.getAttribute('aria-hidden')).toBe('true')
        expect(close.getAttribute('role')).toBeNull()
        expect(close.getAttribute('title')).toBe('Close tab')

        await fireEvent.click(close)

        const closeEvents = emitted<unknown[]>().close
        expect(closeEvents).toHaveLength(1)
        expect(closeEvents[0][0]).toBeInstanceOf(MouseEvent)
        // @click.stop on the close box stops propagation → the tab click is not emitted.
        expect(emitted().click).toBeUndefined()
      })
      it('emits close on Delete from a closable tab, and nothing from a plain one', async () => {
        const { getByTestId, emitted, rerender } = render(TabsTrigger, {
          props: { value: 'a', label: 'Alpha', closable: true }
        })
        const tab = getByTestId('tabs-trigger')
        expect(tab.getAttribute('aria-keyshortcuts')).toBe('Delete')

        await fireEvent.keyDown(tab, { key: 'Delete' })
        expect(emitted().close).toHaveLength(1)
        expect(emitted<unknown[]>().close[0][0]).toBeInstanceOf(KeyboardEvent)

        await rerender({ value: 'a', label: 'Alpha', closable: false })
        await fireEvent.keyDown(tab, { key: 'Delete' })
        expect(emitted().close).toHaveLength(1)
        expect(tab.hasAttribute('aria-keyshortcuts')).toBe(false)
      })

      it('marks a dirty tab with a dot and a hidden "Unsaved changes"', async () => {
        const { getByRole, getByTestId, queryByTestId, rerender } = render(TabsTrigger, {
          props: { value: 'a', label: 'Alpha', dirty: true }
        })

        const tab = getByRole('button')
        expect(tab.hasAttribute('data-dirty')).toBe(true)
        expect(getByTestId('tabs-trigger__dirty').getAttribute('aria-hidden')).toBe('true')
        expect(tab.textContent).toContain('Unsaved changes')

        await rerender({ dirty: false })
        expect(queryByTestId('tabs-trigger__dirty')).toBeNull()
        expect(tab.hasAttribute('data-dirty')).toBe(false)
      })
    })

    describe('v-model round-trip and update:modelValue', () => {
      it('emits update:modelValue with the new value on activation', async () => {
        const updates: Array<string | number | null> = []

        const Host = defineComponent({
          components: { Tabs, TabsList, TabsTrigger },
          setup() {
            return {
              onUpdate: (v: string | number | null) => updates.push(v)
            }
          },
          template: `
          <Tabs default-value="tab-1" @update:modelValue="onUpdate">
            <TabsList>
              <TabsTrigger value="tab-1" label="First" />
              <TabsTrigger value="tab-2" label="Second" />
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
          components: { Tabs, TabsList, TabsTrigger, TabsContent },
          setup: () => ({ active: ref<string>('tab-1') }),
          template: `
          <div>
            <button data-testid="ext" type="button" @click="active = 'tab-3'">go</button>
            <Tabs v-model="active">
              <TabsList>
                <TabsTrigger value="tab-1" label="First" />
                <TabsTrigger value="tab-2" label="Second" />
                <TabsTrigger value="tab-3" label="Third" />
              </TabsList>
              <TabsContent value="tab-1">One</TabsContent>
              <TabsContent value="tab-3">Three</TabsContent>
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
      it('manual activation moves focus with the arrows and selects only on Enter', async () => {
        const { getByText } = render(
          defineComponent({
            components: { Tabs, TabsList, TabsTrigger },
            template: `
            <Tabs default-value="tab-1" activation-mode="manual">
              <TabsList>
                <TabsTrigger value="tab-1" label="First" />
                <TabsTrigger value="tab-2" label="Second" />
                <TabsTrigger value="tab-3" label="Third" />
              </TabsList>
            </Tabs>
          `
          })
        )
        const tab = (label: string) => getByText(label).closest('[role="tab"]') as HTMLElement
        tab('First').focus()
        await keyboardUser.keyboard('{ArrowRight}')
        expect(document.activeElement).toBe(tab('Second'))
        expect(tab('First').getAttribute('aria-selected')).toBe('true')
        await keyboardUser.keyboard('{ArrowRight}')
        expect(document.activeElement).toBe(tab('Third'))
        expect(tab('Third').getAttribute('aria-selected')).toBe('false')
        await keyboardUser.keyboard('{Enter}')
        expect(tab('Third').getAttribute('aria-selected')).toBe('true')
      })

      it('ArrowRight/ArrowLeft move selection across enabled tabs and wrap around', async () => {
        const { getByTestId, getByText } = render(Tree)
        const list = getByTestId('tabs-list')

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
        const list = getByTestId('tabs-list')

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
        const list = getByTestId('tabs-list')

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
        const withProp = render(TabsTrigger, { props: { value: 'a', label: 'FromProp' } })
        expect(withProp.getByTestId('tabs-trigger__label').textContent?.trim()).toBe('FromProp')
        withProp.unmount()

        const withSlot = render(TabsTrigger, {
          props: { value: 'a', label: 'FromProp' },
          slots: { default: 'FromSlot' }
        })
        const label = withSlot.getByTestId('tabs-trigger__label')
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

        expect(getByTestId('tabs')).toBeTruthy()
        await expectNoA11yViolations(container)
      })
    })

    describe('list alignment', () => {
      it('starts the tabs by default and centres them with align="center"', async () => {
        const start = render(Tree)
        expect(start.getByRole('tablist').getAttribute('data-align')).toBe('start')
        start.unmount()

        const { getByRole, getAllByRole, container } = render(Centered)
        expect(getByRole('tablist').getAttribute('data-align')).toBe('center')
        await fireEvent.click(getAllByRole('tab')[1]!)
        expect(getAllByRole('tab')[1]!.getAttribute('aria-selected')).toBe('true')
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

  describe('audit fixes', () => {
    it('forwards consumer attributes to the root, the wrapper, the tab and the panel', () => {
      const { getByTestId, getByRole } = render(
        defineComponent({
          components: { Tabs, TabsList, TabsTrigger, TabsContent },
          template: `
          <Tabs id="tabs-root" dir="ltr" aria-describedby="hint" data-track="tabs" default-value="a">
            <TabsList><TabsTrigger value="a" label="A" data-track="tab-a" /></TabsList>
            <TabsContent value="a" data-track="panel-a">Panel A</TabsContent>
          </Tabs>
        `
        })
      )
      const root = getByTestId('tabs')
      expect(root.id).toBe('tabs-root')
      expect(root).toHaveAttribute('dir', 'ltr')
      expect(root).toHaveAttribute('aria-describedby', 'hint')
      expect(root).toHaveAttribute('data-track', 'tabs')
      expect(root).toHaveAttribute('data-tabs-root', '')
      expect(getByRole('tab')).toHaveAttribute('data-track', 'tab-a')
      expect(getByRole('tabpanel')).toHaveAttribute('data-track', 'panel-a')
    })

    it('renders Tabs.Content with a value as the tabpanel, and exposes Tabs.Trigger', async () => {
      expect(Tabs.Trigger).toBe(TabsTrigger)
      const { getByRole, getAllByRole } = render(
        defineComponent({
          components: { Tabs, TabsList, TabsTrigger, TabsContent },
          template: `
          <Tabs default-value="a">
            <TabsList>
              <TabsTrigger value="a" label="A" />
              <TabsTrigger value="b" label="B" />
            </TabsList>
            <TabsContent value="a">Panel A</TabsContent>
            <TabsContent value="b">Panel B</TabsContent>
          </Tabs>
        `
        })
      )
      await nextTick()
      const panels = getAllByRole('tabpanel', { hidden: true })
      expect(panels).toHaveLength(2)
      const tab = getByRole('tab', { name: 'A' })
      expect(tab.getAttribute('aria-controls')).toBe(panels[0]?.id)
      expect(panels[0]?.getAttribute('aria-labelledby')).toBe(tab.id)
      expect(panels[0]?.textContent).toContain('Panel A')
    })

    it('builds valid id tokens from values with spaces', async () => {
      const { getByRole } = render(
        defineComponent({
          components: { Tabs, TabsList, TabsTrigger, TabsContent },
          template: `
          <Tabs default-value="api keys">
            <TabsList><TabsTrigger value="api keys" label="API keys" /></TabsList>
            <TabsContent value="api keys">Keys</TabsContent>
          </Tabs>
        `
        })
      )
      await nextTick()
      const tab = getByRole('tab')
      expect(tab.id).not.toMatch(/\s/)
      const panel = getByRole('tabpanel')
      expect(panel.id).not.toMatch(/\s/)
      expect(tab.getAttribute('aria-controls')).toBe(panel.id)
      expect(document.getElementById(panel.getAttribute('aria-labelledby') as string)).toBe(tab)
    })

    it('moves with the arrows in DOM order, including a tab inserted later', async () => {
      const showMiddle = ref(false)
      const { getByRole } = render(
        defineComponent({
          components: { Tabs, TabsList, TabsTrigger },
          setup: () => ({ showMiddle }),
          template: `
          <Tabs default-value="a">
            <TabsList>
              <TabsTrigger value="a" label="A" />
              <TabsTrigger v-if="showMiddle" value="m" label="M" />
              <TabsTrigger value="z" label="Z" />
            </TabsList>
          </Tabs>
        `
        })
      )
      showMiddle.value = true
      await nextTick()
      const first = getByRole('tab', { name: 'A' })
      first.focus()
      await keyboardUser.keyboard('{ArrowRight}')
      expect(document.activeElement).toBe(getByRole('tab', { name: 'M' }))
    })

    it('reads disabled reactively for the arrow path', async () => {
      const off = ref(false)
      const { getByRole } = render(
        defineComponent({
          components: { Tabs, TabsList, TabsTrigger },
          setup: () => ({ off }),
          template: `
          <Tabs default-value="a">
            <TabsList>
              <TabsTrigger value="a" label="A" />
              <TabsTrigger value="b" label="B" :disabled="off" />
              <TabsTrigger value="c" label="C" />
            </TabsList>
          </Tabs>
        `
        })
      )
      off.value = true
      await nextTick()
      getByRole('tab', { name: 'A' }).focus()
      await keyboardUser.keyboard('{ArrowRight}')
      expect(document.activeElement).toBe(getByRole('tab', { name: 'C' }))
    })

    it('renders an empty label by default instead of placeholder text', () => {
      const { getByTestId } = render(TabsTrigger)
      expect(getByTestId('tabs-trigger__label').textContent?.trim()).toBe('')
    })
  })

  describe('active indicator motion', () => {
    const indicatorOf = (container: Element) =>
      container.querySelector('[data-testid="tabs-list__indicator"]') as HTMLElement

    it('slides between tabs with the catalog motion and sets no inline transition', () => {
      const { container } = render(Default)
      const indicator = indicatorOf(container)
      expect(indicator.style.transition).toBe('')
      expect(getComputedStyle(indicator).transitionProperty).toContain('transform')
    })

    it('does not slide when the user asks for reduced motion', async () => {
      await commands.emulateMedia({ reducedMotion: 'reduce' })
      try {
        const { container } = render(Default)
        const style = getComputedStyle(indicatorOf(container))
        expect(['none', 'all']).toContain(style.transitionProperty)
        expect(parseFloat(style.transitionDuration)).toBeLessThan(0.001)
      } finally {
        await commands.emulateMedia({ reducedMotion: null })
      }
    })
  })

  describe('active indicator geometry', () => {
    const settle = async () => {
      await nextTick()
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      for (const animation of document.getAnimations()) animation.finish()
    }

    const expectIndicatorOnTab = (container: Element, tabName: string) => {
      const indicator = container.querySelector('[data-testid="tabs-list__indicator"]')
      const tab = [...container.querySelectorAll('[role="tab"]')].find(
        (el) => el.textContent?.trim() === tabName
      )
      expect(indicator).not.toBeNull()
      expect(tab?.getAttribute('aria-selected')).toBe('true')
      const box = indicator!.getBoundingClientRect()
      const target = tab!.getBoundingClientRect()
      expect(Math.abs(box.left - target.left)).toBeLessThan(1)
      expect(Math.abs(box.top - target.top)).toBeLessThan(1)
      expect(Math.abs(box.width - target.width)).toBeLessThan(1)
      expect(Math.abs(box.height - target.height)).toBeLessThan(1)
    }

    const Row = defineComponent({
      components: { Tabs, TabsList, TabsTrigger },
      props: {
        value: { type: String, default: 'trace' },
        pathLabel: { type: String, default: 'Request path' }
      },
      template: `
        <Tabs :model-value="value">
          <TabsList>
            <TabsTrigger value="trace" label="Trace" />
            <TabsTrigger value="logs" label="Logs" />
            <TabsTrigger value="path" :label="pathLabel" />
          </TabsList>
        </Tabs>
      `
    })

    it.each([0.5, 1.6])('sits on the active tab inside a container scaled by %s', async (scale) => {
      const value = ref('trace')
      const { container } = render(
        defineComponent({
          components: { Row },
          setup: () => ({ value, scale }),
          template: `
              <div :style="{ width: '760px', transform: 'scale(' + scale + ')', transformOrigin: '0 0' }">
                <Row :value="value" />
              </div>
            `
        })
      )
      for (const [key, name] of [
        ['trace', 'Trace'],
        ['logs', 'Logs'],
        ['path', 'Request path']
      ]) {
        value.value = key
        await settle()
        expectIndicatorOnTab(container, name)
      }
    })

    it('re-measures when the active tab changes size', async () => {
      const label = ref('Path')
      const { container } = render(
        defineComponent({
          components: { Row },
          setup: () => ({ label }),
          template: `<div style="width: 760px"><Row value="path" :path-label="label" /></div>`
        })
      )
      await settle()
      expectIndicatorOnTab(container, 'Path')
      label.value = 'Request path through every service'
      await settle()
      await settle()
      expectIndicatorOnTab(container, 'Request path through every service')
    })

    it('scrolls the active tab into the strip on mount and when the value changes', async () => {
      const value = ref('t7')
      const { container } = render(
        defineComponent({
          components: { Tabs, TabsList, TabsTrigger },
          setup: () => ({ value, keys: Array.from({ length: 8 }, (_, index) => index) }),
          template: `
            <div style="width: 240px">
              <Tabs v-model="value">
                <TabsList>
                  <TabsTrigger v-for="key in keys" :key="key" :value="'t' + key" :label="'Settings ' + key" />
                </TabsList>
              </Tabs>
            </div>
          `
        })
      )
      const list = container.querySelector<HTMLElement>('[role="tablist"]')!
      const inView = (label: string) => {
        const tab = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]')).find((el) =>
          el.textContent?.includes(label)
        )!
        const box = tab.getBoundingClientRect()
        const strip = list.getBoundingClientRect()
        return box.left >= strip.left - 1 && box.right <= strip.right + 1
      }
      await settle()
      expect(list.scrollWidth).toBeGreaterThan(list.clientWidth)
      expect(inView('Settings 7')).toBe(true)
      value.value = 't0'
      await settle()
      expect(inView('Settings 0')).toBe(true)
    })

    it('sits on the active tab of a scrolled right-to-left list', async () => {
      const value = ref('t0')
      const { container } = render(
        defineComponent({
          components: { Tabs, TabsList, TabsTrigger },
          setup: () => ({ value, keys: Array.from({ length: 12 }, (_, index) => index) }),
          template: `
            <div dir="rtl" style="width: 240px; transform: scale(0.75)">
              <Tabs :model-value="value">
                <TabsList>
                  <TabsTrigger v-for="key in keys" :key="key" :value="'t' + key" :label="'Tab ' + key" />
                </TabsList>
              </Tabs>
            </div>
          `
        })
      )
      value.value = 't10'
      const list = container.querySelector<HTMLElement>('[role="tablist"]')!
      list.scrollLeft = -list.scrollWidth
      await settle()
      expect(list.scrollLeft).toBeLessThan(0)
      expectIndicatorOnTab(container, 'Tab 10')
    })
  })
})
