import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, provide, ref } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { DrawerPanelScrollInjectionKey } from '../drawer/injection-key'
import type { PanelSize } from './injection-key'
import Panel from './panel.vue'
import PanelBody from './panel-body.vue'
import PanelFooter from './panel-footer.vue'
import PanelHeader from './panel-header.vue'

// Panel is a presentational shell: a div root. Header, Body and Footer are their own
// components, so each falls back to its own name as test id (panel-header, panel-body,
// panel-footer) and a data-testid passed to the part wins; an override on the shell
// does not rename the parts.

/** Realistic composed tree: shell + all three regions with real slot content. */
const composed = (props: Record<string, unknown> = {}, testId?: string) =>
  defineComponent({
    components: { Panel, PanelHeader, PanelBody, PanelFooter },
    setup: () => ({ props, testId }),
    template: `
      <Panel v-bind="props" :data-testid="testId">
        <PanelHeader>
          <h2>Edit domain</h2>
        </PanelHeader>
        <PanelBody>
          <p>Adjust the domain configuration below.</p>
        </PanelBody>
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

    const root = getByTestId('panel')
    expect(root.tagName).toBe('DIV')
    expect(getByText('shell body')).toBeTruthy()
    // Shell owns no dialog semantics — no role/aria-modal/data-state.
    expect(root.getAttribute('role')).toBeNull()
    expect(root.getAttribute('data-state')).toBeNull()
  })

  it('exposes the sub-components as real components and renders their semantic roots', () => {
    const { getByTestId } = render(composed())

    const header = getByTestId('panel-header')
    const footer = getByTestId('panel-footer')
    const content = getByTestId('panel-body')

    expect(header.tagName).toBe('HEADER')
    expect(footer.tagName).toBe('FOOTER')
    expect(content.tagName).toBe('DIV')
  })

  it('gives every sub-component its own name as test id, whatever the shell is called', () => {
    const { getByTestId } = render(composed({}, 'edit-domain-panel'))

    expect(getByTestId('edit-domain-panel')).toBeTruthy()
    expect(getByTestId('panel-header').tagName).toBe('HEADER')
    expect(getByTestId('panel-body').tagName).toBe('DIV')
    expect(getByTestId('panel-footer').tagName).toBe('FOOTER')
    expect(document.querySelector('[data-testid^="edit-domain-panel__"]')).toBeNull()
  })

  it('lets a data-testid on a sub-component win over its own name', () => {
    const Tree = defineComponent({
      components: { Panel, PanelHeader, PanelBody, PanelFooter },
      template: `
        <Panel>
          <PanelHeader data-testid="domain-header">Edit domain</PanelHeader>
          <PanelBody data-testid="domain-body">Body</PanelBody>
          <PanelFooter data-testid="domain-footer">Footer</PanelFooter>
        </Panel>
      `
    })
    const { getByTestId, queryByTestId } = render(Tree)

    expect(getByTestId('domain-header').tagName).toBe('HEADER')
    expect(getByTestId('domain-body').tagName).toBe('DIV')
    expect(getByTestId('domain-footer').tagName).toBe('FOOTER')
    expect(queryByTestId('panel-header')).toBeNull()
  })

  it('renders content as a plain div (no ScrollArea) when no drawer scroll host is present', () => {
    const { getByTestId, queryByTestId, getByText } = render(composed())

    // Outside a drawer, DrawerPanelScrollInjectionKey is false → no ScrollArea.
    // This asserts the BRANCH only. The previous name claimed the div was
    // "scrollable", which nothing here checks: whether it scrolls is a layout
    // fact, and this env runs no Tailwind (see src/test/setup.ts), so the
    // utility classes never apply and any scroll measurement would be a false
    // negative. Scrolling is exercised through Drawer and Dialog, which are the
    // contexts that mount this shell.
    expect(getByTestId('panel-body').tagName).toBe('DIV')
    expect(queryByTestId('panel-body__content')).toBeNull()
    expect(getByText('Adjust the domain configuration below.')).toBeTruthy()
  })

  it('wraps content in a ScrollArea when a drawer scroll host is injected', () => {
    // drawer-content provides DrawerPanelScrollInjectionKey=true; simulate that
    // ancestor so PanelBody takes its ScrollArea branch.
    const DrawerScrollHost = defineComponent({
      setup(_, { slots }) {
        provide(DrawerPanelScrollInjectionKey, true)
        return () => slots.default?.()
      }
    })

    const Tree = defineComponent({
      components: { DrawerScrollHost, Panel, PanelBody },
      template: `
        <DrawerScrollHost>
          <Panel>
            <PanelBody>
              <p>Scrollable region</p>
            </PanelBody>
          </Panel>
        </DrawerScrollHost>
      `
    })

    const { getByTestId, getByText } = render(Tree)

    const scroll = getByTestId('panel-body')
    const content = getByTestId('panel-body__content')
    expect(scroll).toBeTruthy()
    // Content div is nested INSIDE the ScrollArea host, not a sibling.
    expect(scroll.contains(content)).toBe(true)
    expect(getByText('Scrollable region')).toBeTruthy()
  })

  it.each<PanelSize>(['small', 'medium', 'large'])('reflects size "%s" on data-width', (size) => {
    const { getByTestId } = render(composed({ size }))
    expect(getByTestId('panel').getAttribute('data-width')).toBe(size)
  })

  it('reflects fluid mode (data-fluid attribute) on data-width', () => {
    const { getByTestId } = render(composed({ 'data-fluid': '' }))
    expect(getByTestId('panel').getAttribute('data-width')).toBe('fluid')
  })

  it('reflects sizeAtMd on data-width', () => {
    const { getByTestId } = render(composed({ sizeAtMd: true, size: 'large' }))
    expect(getByTestId('panel').getAttribute('data-width')).toBe('large-md')
  })

  it('makes an overflowing content region focusable only when nothing inside is', async () => {
    const lines = ref(1)
    const withButton = ref(false)
    const view = render(
      defineComponent({
        setup: () => () =>
          h(Panel, null, () =>
            h(PanelBody, null, () => [
              ...Array.from({ length: lines.value }, (_, i) => h('p', { key: i }, `Line ${i}`)),
              withButton.value ? h('button', { type: 'button' }, 'Act') : null
            ])
          )
      })
    )
    const content = view.getByTestId('panel-body')
    content.style.height = '40px'
    content.style.overflowY = 'auto'
    await nextTick()
    expect(content).not.toHaveAttribute('tabindex')

    lines.value = 30
    await waitFor(() => expect(content).toHaveAttribute('tabindex', '0'))

    withButton.value = true
    await waitFor(() => expect(content).not.toHaveAttribute('tabindex'))
  })

  it('has no accessibility violations on the composed tree', async () => {
    const { getByTestId } = render(composed())
    await expectNoA11yViolations(getByTestId('panel'))
  })

  describe('compound API (index.ts)', () => {
    it('attaches Header, Body and Footer for dot-notation', async () => {
      const { default: Compound } = await import('./index')
      expect(Compound).toBe(Panel)
      expect(Compound.Header).toBe(PanelHeader)
      expect(Compound.Body).toBe(PanelBody)
      expect(Compound.Footer).toBe(PanelFooter)
      expect('Content' in Compound).toBe(false)
    })
  })
})
