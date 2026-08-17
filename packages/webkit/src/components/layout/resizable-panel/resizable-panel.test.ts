import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import ResizablePanel from './index'

// A composition root renders nothing on its own, so every case here composes a realistic
// group: one flexible pane, a handle, one sized pane. That is also the shape the handle's
// "which pane do I move" rule is written against, so a bare-root test would prove nothing
// about the only interesting behaviour this component has.
const group = (
  paneProps: Record<string, unknown> = {},
  handleProps: Record<string, unknown> = {}
) =>
  h(ResizablePanel, null, {
    default: () => [
      h(ResizablePanel.Pane, null, { default: () => 'document' }),
      h(ResizablePanel.Handle, { 'aria-label': 'Resize the preview', ...handleProps }),
      h(
        ResizablePanel.Pane,
        { basis: 300, min: 200, max: 600, ...paneProps },
        { default: () => 'preview' }
      )
    ]
  })

describe('ResizablePanel', () => {
  it('renders and exposes the fallback data-testid', () => {
    const { getByTestId } = render(group())
    expect(getByTestId('layout-resizable-panel')).toBeTruthy()
  })

  it('lets a consumer override data-testid', () => {
    const { getByTestId } = render(h(ResizablePanel, { 'data-testid': 'custom-testid' }))
    expect(getByTestId('custom-testid')).toBeTruthy()
  })

  it('attaches its sub-components to the root for dot notation', () => {
    expect(ResizablePanel.Pane).toBeTruthy()
    expect(ResizablePanel.Handle).toBeTruthy()
  })

  it('sizes the pane that has a basis and lets the other one absorb the rest', () => {
    const { getAllByTestId } = render(group())
    const [flexible, sized] = getAllByTestId('layout-resizable-panel__pane')
    expect(flexible.dataset.flexible).toBe('true')
    expect(sized.dataset.flexible).toBeUndefined()
    expect(sized.style.width).toBe('300px')
  })

  it('publishes the adjacent pane bounds on the separator', async () => {
    const { getByRole } = render(group())
    // The pane AFTER the handle registers in its own `mounted`, one tick later than the
    // handle rendered — so the bounds land on the next flush, never in the first frame.
    await nextTick()
    const handle = getByRole('separator')
    // A separator between side-by-side panes is itself VERTICAL.
    expect(handle.getAttribute('aria-orientation')).toBe('vertical')
    expect(handle.getAttribute('aria-valuenow')).toBe('300')
    expect(handle.getAttribute('aria-valuemin')).toBe('200')
    expect(handle.getAttribute('aria-valuemax')).toBe('600')
  })

  it('flips the separator orientation with the group axis', () => {
    const { getByRole } = render(
      h(
        ResizablePanel,
        { orientation: 'vertical' },
        {
          default: () => [
            h(ResizablePanel.Pane, null, { default: () => 'editor' }),
            h(ResizablePanel.Handle, { 'aria-label': 'Resize the terminal' }),
            h(ResizablePanel.Pane, { basis: 176 }, { default: () => 'terminal' })
          ]
        }
      )
    )
    expect(getByRole('separator').getAttribute('aria-orientation')).toBe('horizontal')
  })

  it('renders a collapsed pane at zero length without unmounting its content', () => {
    const { getAllByTestId, getByText } = render(group({ collapsed: true, collapsible: true }))
    const sized = getAllByTestId('layout-resizable-panel__pane')[1]
    expect(sized.dataset.collapsed).toBe('true')
    expect(sized.style.width).toBe('0px')
    // Still in the DOM — the whole point of collapsing rather than v-if.
    expect(getByText('preview')).toBeTruthy()
  })

  it('marks the separator disabled without removing it', () => {
    const { getByRole } = render(group({}, { disabled: true }))
    expect(getByRole('separator').getAttribute('aria-disabled')).toBe('true')
  })

  it('has no axe violations on the default render', async () => {
    const { container } = render(group())
    await expectNoA11yViolations(container)
  })
})
