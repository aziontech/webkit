import { composeStories } from '@storybook/vue3'
import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/code/code-block/CodeBlock.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import CodeBlock from './code-block.vue'

const { Default } = composeStories(stories)

// The real Clipboard API rejects in headless Chromium ("Document is not
// focused"), so writeText is stubbed to resolve. This is NOT a layout/focus
// mock — it substitutes the external clipboard side effect so the component's
// own logic (await write -> emit 'copy') can be exercised.
function stubClipboardResolved() {
  return vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
}

const CODE_ONE = 'const one = 1\nconst two = 2\nconst three = 3'
const CODE_TWO = 'let a = 10\nlet b = 20'

const twoTabs = [
  { label: 'First', value: 'first', language: 'javascript', code: CODE_ONE },
  { label: 'Second', value: 'second', language: 'javascript', code: CODE_TWO }
]

const singleTab = [{ label: 'Only', value: 'only', language: 'javascript', code: CODE_ONE }]

const fileNameTab = [
  {
    label: 'File',
    value: 'file',
    language: 'javascript',
    fileName: 'handler.js',
    code: CODE_ONE
  }
]

const diffTab = [
  {
    label: 'Diff',
    value: 'diff',
    language: 'javascript',
    code: CODE_ONE,
    lineChanges: [
      { line: 1, change: 'added' as const },
      { line: 2, change: 'removed' as const }
    ]
  }
]

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CodeBlock', () => {
  describe('rendering & testid', () => {
    it('renders with the default testid', () => {
      const { getByTestId } = render(CodeBlock, { props: { tabs: singleTab } })

      expect(getByTestId('data-code-block')).toBeTruthy()
    })

    it('honors a consumer-supplied data-testid', () => {
      const { getByTestId } = render(CodeBlock, {
        props: { tabs: singleTab },
        attrs: { 'data-testid': 'my-code' }
      })

      expect(getByTestId('my-code')).toBeTruthy()
    })

    it('merges a consumer-supplied class onto the root', () => {
      const { getByTestId } = render(CodeBlock, {
        props: { tabs: singleTab },
        attrs: { class: 'consumer-class' }
      })

      expect(getByTestId('data-code-block').classList.contains('consumer-class')).toBe(true)
    })

    it('renders the highlighted line content of the active tab', () => {
      const { getByTestId } = render(CodeBlock, {
        props: { tabs: singleTab, defaultValue: 'only' }
      })

      // Three source lines -> three line rows.
      const content = getByTestId('data-code-block__content')
      expect(content.textContent).toContain('const one = 1')
      expect(content.textContent).toContain('const three = 3')
    })
  })

  describe('tab header visibility', () => {
    it('renders a tablist with a tab per tab when more than one tab is given', () => {
      const { getByRole, getAllByRole } = render(CodeBlock, {
        props: { tabs: twoTabs, defaultValue: 'first' }
      })

      expect(getByRole('tablist')).toBeTruthy()
      expect(getAllByRole('tab')).toHaveLength(2)
    })

    it('does not render a tab header when only one tab is given', () => {
      const { queryByRole } = render(CodeBlock, { props: { tabs: singleTab } })

      expect(queryByRole('tablist')).toBeNull()
      expect(queryByRole('tab')).toBeNull()
    })
  })

  describe('tab selection & v-model', () => {
    it('marks the defaultValue tab as selected initially', () => {
      const { getAllByRole } = render(CodeBlock, {
        props: { tabs: twoTabs, defaultValue: 'second' }
      })

      const tabs = getAllByRole('tab')
      const [first, second] = tabs

      expect(second.getAttribute('aria-selected')).toBe('true')
      expect(second.getAttribute('data-state')).toBe('active')
      expect(second.getAttribute('tabindex')).toBe('0')
      expect(first.getAttribute('aria-selected')).toBe('false')
      expect(first.getAttribute('data-state')).toBe('inactive')
      expect(first.getAttribute('tabindex')).toBe('-1')
    })

    it('emits update:value and value-change with the clicked tab value', async () => {
      const { getAllByRole, emitted } = render(CodeBlock, {
        props: { tabs: twoTabs, defaultValue: 'first' }
      })

      const [, second] = getAllByRole('tab')
      await fireEvent.click(second)

      // value-change fires only through the activeValue setter (user selection),
      // so its first emission is the click; update:value also carries a
      // mount-time model sync, so assert its latest emission is the click value.
      const valueChange = emitted()['value-change'] as string[][]
      expect(valueChange).toBeTruthy()
      expect(valueChange[0]).toEqual(['second'])

      const updateValue = emitted()['update:value'] as string[][]
      expect(updateValue).toBeTruthy()
      expect(updateValue[updateValue.length - 1]).toEqual(['second'])
    })

    it('does not fire a user-selection change when the already-active tab is clicked', async () => {
      const { getAllByRole, emitted } = render(CodeBlock, {
        props: { tabs: twoTabs, defaultValue: 'first' }
      })

      const [first] = getAllByRole('tab')
      await fireEvent.click(first)

      // Clicking the active tab is a no-op in setActiveTab, so no value-change
      // (the user-selection signal) is emitted.
      expect(emitted()['value-change']).toBeUndefined()
    })

    it('honors the controlled value prop and updates the active tab when it changes', async () => {
      const { getAllByRole, rerender } = render(CodeBlock, {
        props: { tabs: twoTabs, value: 'first' }
      })

      expect(getAllByRole('tab')[0].getAttribute('aria-selected')).toBe('true')

      await rerender({ tabs: twoTabs, value: 'second' })

      const tabs = getAllByRole('tab')
      expect(tabs[1].getAttribute('aria-selected')).toBe('true')
      expect(tabs[0].getAttribute('aria-selected')).toBe('false')
    })
  })

  describe('keyboard navigation', () => {
    it('activates a tab with Enter', async () => {
      const { getAllByRole, emitted } = render(CodeBlock, {
        props: { tabs: twoTabs, defaultValue: 'first' }
      })

      const [, second] = getAllByRole('tab')
      await fireEvent.keyDown(second, { key: 'Enter' })

      expect(emitted()['value-change']).toBeTruthy()
      expect(emitted()['value-change'][0]).toEqual(['second'])
    })

    it('activates a tab with Space', async () => {
      const { getAllByRole, emitted } = render(CodeBlock, {
        props: { tabs: twoTabs, defaultValue: 'first' }
      })

      const [, second] = getAllByRole('tab')
      await fireEvent.keyDown(second, { key: ' ' })

      expect(emitted()['value-change']).toBeTruthy()
      expect(emitted()['value-change'][0]).toEqual(['second'])
    })

    it('moves to the next tab with ArrowRight and wraps to the first from the last', async () => {
      const { getAllByRole, emitted } = render(CodeBlock, {
        props: { tabs: twoTabs, defaultValue: 'first' }
      })

      const [first] = getAllByRole('tab')
      await fireEvent.keyDown(first, { key: 'ArrowRight' })
      expect(emitted()['value-change'][0]).toEqual(['second'])

      // From the last tab, ArrowRight wraps back to the first.
      const [, second] = getAllByRole('tab')
      await fireEvent.keyDown(second, { key: 'ArrowRight' })
      expect(emitted()['value-change'][1]).toEqual(['first'])
    })

    it('moves to the previous tab with ArrowLeft and wraps to the last from the first', async () => {
      const { getAllByRole, emitted } = render(CodeBlock, {
        props: { tabs: twoTabs, defaultValue: 'first' }
      })

      const [first] = getAllByRole('tab')
      await fireEvent.keyDown(first, { key: 'ArrowLeft' })

      // From the first tab, ArrowLeft wraps to the last tab.
      expect(emitted()['value-change'][0]).toEqual(['second'])
    })

    it('jumps to the first tab with Home and the last with End', async () => {
      const { getAllByRole, emitted } = render(CodeBlock, {
        props: { tabs: twoTabs, defaultValue: 'first' }
      })

      const [first] = getAllByRole('tab')
      await fireEvent.keyDown(first, { key: 'End' })
      expect(emitted()['value-change'][0]).toEqual(['second'])

      const [, second] = getAllByRole('tab')
      await fireEvent.keyDown(second, { key: 'Home' })
      expect(emitted()['value-change'][1]).toEqual(['first'])
    })
  })

  describe('copy', () => {
    it('writes the active tab code to the clipboard and emits copy with that code', async () => {
      const writeText = stubClipboardResolved()
      const { getByTestId, emitted } = render(CodeBlock, {
        props: { tabs: singleTab, defaultValue: 'only' }
      })

      await fireEvent.click(within(getByTestId('data-code-block__copy')).getByRole('button'))

      await waitFor(() => {
        expect(emitted().copy).toBeTruthy()
      })
      expect(writeText).toHaveBeenCalledWith(CODE_ONE)
      const events = emitted().copy as string[][]
      expect(events).toHaveLength(1)
      expect(events[0][0]).toBe(CODE_ONE)
    })

    it('copies the code of the active tab after switching tabs', async () => {
      const writeText = stubClipboardResolved()
      const { getAllByRole, getByTestId, emitted } = render(CodeBlock, {
        props: { tabs: twoTabs, defaultValue: 'first' }
      })

      await fireEvent.click(getAllByRole('tab')[1])
      await fireEvent.click(within(getByTestId('data-code-block__copy')).getByRole('button'))

      await waitFor(() => {
        expect(emitted().copy).toBeTruthy()
      })
      expect(writeText).toHaveBeenCalledWith(CODE_TWO)
    })

    it('uses the copyAriaLabel prop as the copy control accessible name', () => {
      const { getByRole } = render(CodeBlock, {
        props: { tabs: singleTab, copyAriaLabel: 'Copy snippet' }
      })

      expect(getByRole('button', { name: 'Copy snippet' }).tagName).toBe('BUTTON')
    })
  })

  describe('line numbers gutter', () => {
    it('renders the line-number gutter by default', () => {
      const { queryAllByTestId } = render(CodeBlock, {
        props: { tabs: singleTab, defaultValue: 'only' }
      })

      // Three source lines -> a line-number cell per line.
      expect(queryAllByTestId('data-code-block__line-number')).toHaveLength(3)
    })

    it('hides the line-number gutter when showLineNumbers is false', () => {
      const { queryAllByTestId } = render(CodeBlock, {
        props: { tabs: singleTab, defaultValue: 'only', showLineNumbers: false }
      })

      expect(queryAllByTestId('data-code-block__line-number')).toHaveLength(0)
    })
  })

  describe('filename bar', () => {
    it('renders the filename bar with the active tab fileName', () => {
      const { getByTestId } = render(CodeBlock, {
        props: { tabs: fileNameTab, defaultValue: 'file' }
      })

      expect(getByTestId('data-code-block__filename-label').textContent?.trim()).toBe('handler.js')
    })

    it('omits the filename bar when the active tab has no fileName', () => {
      const { queryByTestId } = render(CodeBlock, {
        props: { tabs: singleTab, defaultValue: 'only' }
      })

      expect(queryByTestId('data-code-block__filename')).toBeNull()
    })
  })

  describe('diff gutter', () => {
    it('renders diff markers when the active tab has lineChanges', () => {
      const { queryAllByTestId, getByTestId } = render(CodeBlock, {
        props: { tabs: diffTab, defaultValue: 'diff' }
      })

      const markers = queryAllByTestId('data-code-block__diff-marker')
      expect(markers.length).toBeGreaterThan(0)

      // The added/removed lines carry the corresponding data-state.
      const lines = getByTestId('data-code-block__lines').querySelectorAll(
        '[data-testid="data-code-block__line"]'
      )
      expect(lines[0].getAttribute('data-state')).toBe('added')
      expect(lines[1].getAttribute('data-state')).toBe('removed')
    })

    it('does not render diff markers when the active tab has no lineChanges', () => {
      const { queryAllByTestId } = render(CodeBlock, {
        props: { tabs: singleTab, defaultValue: 'only' }
      })

      expect(queryAllByTestId('data-code-block__diff-marker')).toHaveLength(0)
    })
  })

  describe('a11y (axe against styled DOM)', () => {
    it('single-tab layout has no violations', async () => {
      const { container } = render(CodeBlock, {
        props: { tabs: singleTab, defaultValue: 'only' }
      })

      await expectNoA11yViolations(container)
    })

    it('tabbed layout has no violations', async () => {
      const { container } = render(CodeBlock, {
        props: { tabs: twoTabs, defaultValue: 'first' }
      })

      await expectNoA11yViolations(container)
    })

    it('filename + diff layout has no violations', async () => {
      const { container } = render(CodeBlock, {
        props: { tabs: diffTab, defaultValue: 'diff' }
      })

      await expectNoA11yViolations(container)
    })
  })

  describe('story fixture', () => {
    it('renders the Default story cleanly', async () => {
      const { getByTestId, container } = render(Default())

      expect(getByTestId('data-code-block')).toBeTruthy()
      await expectNoA11yViolations(container)
    })
  })
})
