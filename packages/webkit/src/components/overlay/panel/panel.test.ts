import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, provide } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { DrawerPanelScrollInjectionKey } from '../drawer/injection-key'
import type { PanelSize } from './injection-key'
import Panel from './panel.vue'
import PanelContent from './panel-content.vue'
import PanelFooter from './panel-footer.vue'
import PanelHeader from './panel-header.vue'

// Panel is a presentational shell: a <div> root that `provide`s PanelInjectionKey
// ({ testId }). Header / Content / Footer are context-aware sub-components — each
// reads that injected testId to build its own data-testid (`__header`, `__content`,
// `__footer`). No Teleport, no data-state, no emits, no v-model. So the meaningful
// assertions are: the sub-components render their own semantic roots, and the
// injected context flows to their testids and follows a data-testid override.

/** Realistic composed tree: shell + all three regions with real slot content. */
const composed = (props: Record<string, unknown> = {}, testId?: string) =>
  defineComponent({
    components: { Panel, PanelHeader, PanelContent, PanelFooter },
    setup: () => ({ props, testId }),
    template: `
      <Panel v-bind="props" :data-testid="testId">
        <PanelHeader>
          <h2>Edit domain</h2>
        </PanelHeader>
        <PanelContent>
          <p>Adjust the domain configuration below.</p>
        </PanelContent>
        <PanelFooter>
          <button type="button">Cancel</button>
          <button type="button">Save</button>
        </PanelFooter>
      </Panel>
    `
  })

describe('Panel', () => {
  it('renders a div shell with the default testid and its default slot', () => {
    const { getByTestId, getByText } = render(Panel, {
      slots: { default: () => h('span', 'shell body') }
    })

    const root = getByTestId('overlay-panel')
    expect(root.tagName).toBe('DIV')
    expect(getByText('shell body')).toBeTruthy()
    // Shell owns no dialog semantics — no role/aria-modal/data-state.
    expect(root.getAttribute('role')).toBeNull()
    expect(root.getAttribute('data-state')).toBeNull()
  })

  it('exposes the sub-components as real components and renders their semantic roots', () => {
    const { getByTestId } = render(composed())

    const header = getByTestId('overlay-panel__header')
    const footer = getByTestId('overlay-panel__footer')
    const content = getByTestId('overlay-panel__content')

    expect(header.tagName).toBe('HEADER')
    expect(footer.tagName).toBe('FOOTER')
    expect(content.tagName).toBe('DIV')
  })

  it('delivers the shell testid to every sub-component through provide/inject', () => {
    const { getByTestId } = render(composed())

    // Header / Content / Footer show no model-value wiring — their testids are
    // derived purely from the injected PanelContext.testId.
    expect(getByTestId('overlay-panel__header')).toBeTruthy()
    expect(getByTestId('overlay-panel__content')).toBeTruthy()
    expect(getByTestId('overlay-panel__footer')).toBeTruthy()
  })

  it('propagates a data-testid override from the shell to the sub-component testids', () => {
    const { getByTestId } = render(composed({}, 'edit-domain-panel'))

    expect(getByTestId('edit-domain-panel')).toBeTruthy()
    expect(getByTestId('edit-domain-panel__header').tagName).toBe('HEADER')
    expect(getByTestId('edit-domain-panel__content').tagName).toBe('DIV')
    expect(getByTestId('edit-domain-panel__footer').tagName).toBe('FOOTER')

    // The default fallback testids no longer exist once overridden.
    expect(() => getByTestId('overlay-panel__header')).toThrow()
  })

  it('renders content as a plain scrollable div when no drawer scroll host is present', () => {
    const { getByTestId, queryByTestId, getByText } = render(composed())

    // Outside a drawer, DrawerPanelScrollInjectionKey is false → no ScrollArea.
    expect(getByTestId('overlay-panel__content').tagName).toBe('DIV')
    expect(queryByTestId('overlay-panel__scroll')).toBeNull()
    expect(getByText('Adjust the domain configuration below.')).toBeTruthy()
  })

  it('wraps content in a ScrollArea when a drawer scroll host is injected', () => {
    // drawer-content provides DrawerPanelScrollInjectionKey=true; simulate that
    // ancestor so PanelContent takes its ScrollArea branch.
    const DrawerScrollHost = defineComponent({
      setup(_, { slots }) {
        provide(DrawerPanelScrollInjectionKey, true)
        return () => slots.default?.()
      }
    })

    const Tree = defineComponent({
      components: { DrawerScrollHost, Panel, PanelContent },
      template: `
        <DrawerScrollHost>
          <Panel>
            <PanelContent>
              <p>Scrollable region</p>
            </PanelContent>
          </Panel>
        </DrawerScrollHost>
      `
    })

    const { getByTestId, getByText } = render(Tree)

    const scroll = getByTestId('overlay-panel__scroll')
    const content = getByTestId('overlay-panel__content')
    expect(scroll).toBeTruthy()
    // Content div is nested INSIDE the ScrollArea host, not a sibling.
    expect(scroll.contains(content)).toBe(true)
    expect(getByText('Scrollable region')).toBeTruthy()
  })

  it.each<PanelSize>(['small', 'medium', 'large'])('renders the shell for size "%s"', (size) => {
    const { getByTestId } = render(composed({ size }))
    expect(getByTestId('overlay-panel').tagName).toBe('DIV')
  })

  it('renders the shell in fluid mode via the data-fluid attribute', () => {
    const { getByTestId } = render(composed({ 'data-fluid': '' }))
    expect(getByTestId('overlay-panel').tagName).toBe('DIV')
  })

  it('renders the sizeAtMd (mobile bottom-sheet) shell', () => {
    const { getByTestId } = render(composed({ sizeAtMd: true, size: 'large' }))
    expect(getByTestId('overlay-panel').tagName).toBe('DIV')
  })

  it('has no accessibility violations on the composed tree', async () => {
    const { getByTestId } = render(composed())
    await expectNoA11yViolations(getByTestId('overlay-panel'))
  })
})
