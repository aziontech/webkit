import { composeStories } from '@storybook/vue3'
import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/code/log-view/LogView.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import type { LogViewLine } from './injection-key'
import LogView from './log-view.vue'
import LogViewContent from './log-view-content.vue'
import LogViewFooter from './log-view-footer.vue'
import LogViewHeader from './log-view-header.vue'

const { Default } = composeStories(stories)

// Grounded in complete-deploy-log.js shapes: text / success / folder / warning lines.
const LINES: LogViewLine[] = [
  { id: '1', time: '13:47:33', type: 'text', message: 'Deploy started successfully!' },
  { id: '2', time: '13:47:41', type: 'success', message: 'Build finished' },
  {
    id: '3',
    time: '13:47:42',
    type: 'folder',
    message: 'dist/index.js',
    folderType: 'asset',
    size: '12.4 kB',
    gzipSize: '4.1 kB'
  },
  { id: '4', time: '13:47:43', type: 'warning', message: 'Bundle larger than recommended' }
]

/**
 * Composes the real tree (LogView + Header + Content + Footer) around parent-owned
 * refs so v-model:search / v-model:warnings-only round-trips are observable, and the
 * root `copy` event can be captured. Mirrors the documented composition usage.
 */
function makeHost(options: {
  lines?: LogViewLine[]
  showCopy?: boolean
  disabled?: boolean
  searchPlaceholder?: string
  withFooter?: boolean
  onCopy?: (value: string) => void
}) {
  const search = ref('')
  const warningsOnly = ref(false)

  const Host = defineComponent({
    setup() {
      return () =>
        h(
          LogView,
          {
            lines: options.lines ?? LINES,
            showCopy: options.showCopy ?? true,
            disabled: options.disabled ?? false,
            searchPlaceholder: options.searchPlaceholder,
            search: search.value,
            'onUpdate:search': (v: string) => {
              search.value = v
            },
            warningsOnly: warningsOnly.value,
            'onUpdate:warningsOnly': (v: boolean) => {
              warningsOnly.value = v
            },
            onCopy: options.onCopy,
            class: 'h-[480px]'
          },
          () => [
            h(LogViewHeader),
            h(LogViewContent),
            ...(options.withFooter ? [h(LogViewFooter, () => 'Footer content')] : [])
          ]
        )
    }
  })

  return { Host, search, warningsOnly }
}

describe('LogView (composition: provide/inject over Header/Content/Footer)', () => {
  describe('composition wiring — the public sub-components are real components sharing one context', () => {
    it('resolves each sub-component as a Vue component with its own defineOptions name', () => {
      // These are the exact modules published as @aziontech/webkit/log-view-*.
      expect(LogView.name).toBe('LogView')
      expect(LogViewHeader.name).toBe('LogViewHeader')
      expect(LogViewContent.name).toBe('LogViewContent')
      expect(LogViewFooter.name).toBe('LogViewFooter')
    })

    it('renders the root <div> with the fallback testid and composed regions inside it', () => {
      const { Host } = makeHost({})
      const { getByTestId } = render(Host)

      const root = getByTestId('code-log-view')
      expect(root.tagName).toBe('DIV')

      // Derived region testids from the injected ctx.testId.
      const header = getByTestId('code-log-view__header')
      const content = getByTestId('code-log-view__content')
      expect(header.tagName).toBe('HEADER')
      expect(root.contains(header)).toBe(true)
      expect(root.contains(content)).toBe(true)
    })

    it('throws a helpful error when a sub-component is used outside LogView', () => {
      // useLogViewContext() has no provider -> inject returns undefined -> throw.
      expect(() => render(LogViewHeader)).toThrow(/must be used within LogView/)
    })
  })

  describe('injected state drives the sub-components (consumer wires nothing)', () => {
    it('renders one line row per entry through LogViewContent, keyed by ctx.filteredLines', () => {
      const { Host } = makeHost({})
      const { getAllByTestId } = render(Host)
      // Template: v-for line in ctx.filteredLines -> `${testId}__line`.
      expect(getAllByTestId('code-log-view__line')).toHaveLength(LINES.length)
    })

    it('reflects the injected line count and warning-tag label in the header', () => {
      const { Host } = makeHost({})
      const { getByTestId } = render(Host)
      // lineCountLabel = `${filteredLines.length} lines`; one warning line -> "1 Warning".
      // Header controls carry `${ctx.testId}__header__<part>` testids.
      expect(getByTestId('code-log-view__header__line-count').textContent?.trim()).toBe('4 lines')
      const filter = getByTestId('code-log-view__header__warnings-filter')
      expect(filter.textContent).toContain('1 Warning')
      expect(filter.getAttribute('aria-pressed')).toBe('false')
    })

    it('omits the warnings filter entirely when there are no warning lines', () => {
      const noWarnings = LINES.filter((l) => l.type !== 'warning')
      const { Host } = makeHost({ lines: noWarnings })
      const { queryByTestId, getByTestId } = render(Host)
      // Template: v-if="ctx.warningCount.value > 0".
      expect(queryByTestId('code-log-view__header__warnings-filter')).toBeNull()
      expect(getByTestId('code-log-view__header__line-count').textContent?.trim()).toBe('3 lines')
    })

    it('renders the empty region (default text) when no lines are provided', () => {
      const { Host } = makeHost({ lines: [] })
      const { getByTestId, queryAllByTestId } = render(Host)
      expect(queryAllByTestId('code-log-view__line')).toHaveLength(0)
      expect(getByTestId('code-log-view__empty').textContent).toContain(
        'No log lines match the current filters.'
      )
    })
  })

  describe('search: context-aware header input drives the filter and highlights matches', () => {
    it('emits update:search from the header search input and round-trips into the content filter', async () => {
      const { Host, search } = makeHost({})
      const { getByTestId, getAllByTestId } = render(Host)

      const input = getByTestId('code-log-view__header__search-input') as HTMLInputElement
      expect(input.getAttribute('aria-label')).toBe('Search logs')

      // Type a query matching only the "Build finished" success line.
      await fireEvent.update(input, 'Build')

      // v-model:search updated in the parent (round-trip via update:search).
      expect(search.value).toBe('Build')

      // ctx.filteredLines re-filtered -> only the matching row remains.
      const rows = getAllByTestId('code-log-view__line')
      expect(rows).toHaveLength(1)
      expect(rows[0].textContent).toContain('Build finished')
    })

    it('highlights the matched substring with a <mark> inside the surviving line', async () => {
      const { Host } = makeHost({})
      const { getByTestId, getAllByTestId } = render(Host)

      await fireEvent.update(getByTestId('code-log-view__header__search-input'), 'finished')

      const rows = getAllByTestId('code-log-view__line')
      expect(rows).toHaveLength(1)
      const mark = within(rows[0]).getByText('finished')
      expect(mark.tagName).toBe('MARK')
    })

    it('shows the empty region when the query matches nothing', async () => {
      const { Host } = makeHost({})
      const { getByTestId, queryAllByTestId } = render(Host)

      await fireEvent.update(getByTestId('code-log-view__header__search-input'), 'zzz-no-match-zzz')

      expect(queryAllByTestId('code-log-view__line')).toHaveLength(0)
      expect(getByTestId('code-log-view__empty')).toBeTruthy()
    })
  })

  describe('warnings-only: context-aware filter button toggles the injected boolean', () => {
    it('emits update:warningsOnly on click, round-trips v-model, and filters content to warnings', async () => {
      const { Host, warningsOnly } = makeHost({})
      const { getByTestId, getAllByTestId } = render(Host)

      const filter = getByTestId('code-log-view__header__warnings-filter')
      expect(filter.getAttribute('aria-pressed')).toBe('false')

      await fireEvent.click(filter)

      // v-model:warnings-only round-tripped to the parent.
      expect(warningsOnly.value).toBe(true)
      // aria-pressed reflects the injected state.
      expect(filter.getAttribute('aria-pressed')).toBe('true')

      // Only the single warning line survives the filter.
      const rows = getAllByTestId('code-log-view__line')
      expect(rows).toHaveLength(1)
      expect(rows[0].getAttribute('data-type')).toBe('warning')
      // Root mirrors the state as data-warnings-only.
      expect(getByTestId('code-log-view').getAttribute('data-warnings-only')).toBe('true')
    })

    it('toggles warnings-only via keyboard (Enter) on the filter button', async () => {
      const { Host, warningsOnly } = makeHost({})
      const { getByTestId } = render(Host)

      const filter = getByTestId('code-log-view__header__warnings-filter')
      // handleWarningsKeydown preventDefaults Enter/Space and toggles.
      await fireEvent.keyDown(filter, { key: 'Enter' })

      expect(warningsOnly.value).toBe(true)
      expect(filter.getAttribute('aria-pressed')).toBe('true')
    })
  })

  describe('copy: the header control emits the root copy event with the formatted text', () => {
    it('fires copy with the plain-text join of the filtered lines on click', async () => {
      const copied: string[] = []
      const { Host } = makeHost({ onCopy: (v) => copied.push(v) })
      const { getByTestId } = render(Host)

      await fireEvent.click(getByTestId('code-log-view__header__copy'))

      // Emitted exactly once; payload is formatLogLineText joined by newlines.
      expect(copied).toHaveLength(1)
      const payload = copied[0]
      // text line -> "time message"
      expect(payload).toContain('13:47:33 Deploy started successfully!')
      // success line -> prefixes a check glyph when absent
      expect(payload).toContain('13:47:41 ✓ Build finished')
      // folder line -> "time message folderType size | gzip: gzipSize"
      expect(payload).toContain('13:47:42 dist/index.js asset 12.4 kB | gzip: 4.1 kB')
      // 4 lines joined by newline
      expect(payload.split('\n')).toHaveLength(LINES.length)
    })

    it('does not render the copy control when showCopy is false', () => {
      const { Host } = makeHost({ showCopy: false })
      const { queryByTestId } = render(Host)
      // Header template: v-if="ctx.showCopy.value" on the default copy IconButton.
      expect(queryByTestId('code-log-view__header__copy')).toBeNull()
    })
  })

  describe('disabled: toolbar controls are inert', () => {
    it('flags data-disabled on the root and disables the warnings filter', () => {
      const { Host } = makeHost({ disabled: true })
      const { getByTestId } = render(Host)

      expect(getByTestId('code-log-view').getAttribute('data-disabled')).toBe('true')
      // <button ... :disabled="ctx.disabled.value"> on the warnings filter.
      expect(
        (getByTestId('code-log-view__header__warnings-filter') as HTMLButtonElement).disabled
      ).toBe(true)
    })

    it('does not toggle warnings-only while disabled (click is a no-op)', async () => {
      const { Host, warningsOnly } = makeHost({ disabled: true })
      const { getByTestId } = render(Host)

      // toggleWarningsOnly early-returns when props.disabled is true.
      await fireEvent.click(getByTestId('code-log-view__header__warnings-filter'))
      expect(warningsOnly.value).toBe(false)
    })
  })

  describe('LogViewFooter renders as a footer landmark inside the root', () => {
    it('renders default slot content in a <footer> with the derived testid', () => {
      const { Host } = makeHost({ withFooter: true })
      const { getByTestId } = render(Host)

      const footer = getByTestId('code-log-view__footer')
      expect(footer.tagName).toBe('FOOTER')
      expect(footer.textContent).toContain('Footer content')
    })
  })

  describe('a11y (axe against styled, composed DOM)', () => {
    it('the composed Header + Content tree has no violations', async () => {
      const { Host } = makeHost({ withFooter: true })
      const { container } = render(Host)
      await expectNoA11yViolations(container)
    })
  })

  describe('composeStories (the story fixture runs in-test)', () => {
    it('Default story renders the composed viewer over the deploy log with rows', () => {
      const { getByTestId, getAllByTestId } = render(Default)
      expect(getByTestId('code-log-view').tagName).toBe('DIV')
      expect(getByTestId('code-log-view__header')).toBeTruthy()
      expect(getByTestId('code-log-view__content')).toBeTruthy()
      // The deploy log fixture has many lines.
      expect(getAllByTestId('code-log-view__line').length).toBeGreaterThan(0)
    })
  })
})
