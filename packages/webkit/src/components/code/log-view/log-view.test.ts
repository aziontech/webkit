import userEvent from '@testing-library/user-event'
import { fireEvent, render, within } from '@testing-library/vue'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Borderless from '../../../../examples/log-view/borderless.vue'
import Default from '../../../../examples/log-view/default.vue'
import Levels from '../../../../examples/log-view/levels.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import LogViewCompound from './index'
import type { LogViewLine } from './injection-key'
import LogView from './log-view.vue'
import LogViewContent from './log-view-content.vue'
import LogViewFooter from './log-view-footer.vue'
import LogViewHeader from './log-view-header.vue'

// The real Clipboard API rejects in headless Chromium; stub writeText to resolve
// so CopyButton's own logic (await write -> emit 'copy') runs. Not a layout mock.
function stubClipboardResolved() {
  return vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
}

afterEach(() => {
  vi.restoreAllMocks()
})

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
  copyable?: boolean
  disabled?: boolean
  searchPlaceholder?: string
  withFooter?: boolean
  onCopy?: (event: Event, value: string) => void
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
            copyable: options.copyable ?? true,
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
  it('mounts a long log in chunks while the count, search and copy cover every line', async () => {
    const lines: LogViewLine[] = Array.from({ length: 2000 }, (_, i) => ({
      id: String(i),
      time: '13:47:33',
      type: 'text',
      message: `Line ${i}`
    }))
    const { Host, search } = makeHost({ lines })
    const { getAllByTestId, getByTestId } = render(Host)
    const mounted = getAllByTestId('code-log-view__line').length
    expect(mounted).toBeGreaterThan(0)
    expect(mounted).toBeLessThan(2000)
    expect(getByTestId('code-log-view__header__line-count').textContent).toMatch(/2[,. ]?000/)
    search.value = 'Line 1999'
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(getAllByTestId('code-log-view__line')).toHaveLength(1)
  })

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

    // The outline AND the corner radius hang off data-border (Tailwind
    // `data-[border]:` variants), so dropping the attribute drops both.
    it('sets data-border by default and drops it when bordered is false', () => {
      const bordered = render(LogView, { props: { lines: LINES } })
      expect(
        within(bordered.container).getByTestId('code-log-view').getAttribute('data-border')
      ).toBe('true')

      const flush = render(LogView, { props: { lines: LINES, bordered: false } })
      expect(within(flush.container).getByTestId('code-log-view').hasAttribute('data-border')).toBe(
        false
      )
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

    it('keeps a polite log region that starts empty instead of the scrolling body', () => {
      const { Host } = makeHost({})
      const { getByRole, getByTestId } = render(Host)
      const log = getByRole('log')
      expect(log.getAttribute('aria-live')).toBe('polite')
      expect(log.textContent?.trim()).toBe('')
      expect(getByTestId('code-log-view__content__body').hasAttribute('aria-live')).toBe(false)
    })

    it('announces appended lines only, not chunks that mount on scroll', async () => {
      const lines = ref<LogViewLine[]>(
        Array.from({ length: 2000 }, (_, i) => ({
          id: String(i),
          time: '13:47:33',
          type: 'text' as const,
          message: `Line ${i}`
        }))
      )
      const Host = defineComponent({
        setup() {
          return () =>
            h(LogView, { lines: lines.value, class: 'h-[480px]' }, () => [h(LogViewContent)])
        }
      })
      const { container, getAllByTestId, getByRole } = render(Host)
      const log = getByRole('log')
      const before = getAllByTestId('code-log-view__line').length
      container.querySelector('[data-chunk="19"]')?.scrollIntoView()
      await vi.waitFor(() => {
        expect(getAllByTestId('code-log-view__line').length).toBeGreaterThan(before)
      })
      expect(log.textContent?.trim()).toBe('')

      lines.value = [
        ...lines.value,
        { id: 'new-1', time: '13:48:00', type: 'success', message: 'Deploy finished' }
      ]
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(log.textContent).toContain('Deploy finished')
      expect(log.textContent).not.toContain('Line 0')

      lines.value = [{ id: 'other', time: '00:00:00', type: 'text', message: 'Fresh log' }]
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(log.textContent?.trim()).toBe('')
    })

    it('reflects the injected line count and warning-tag label in the header', () => {
      const { Host } = makeHost({})
      const { getByTestId } = render(Host)
      // lineCountLabel = `${filteredLines.length} lines`; one warning line -> "1 warning".
      // Header controls carry `${ctx.testId}__header__<part>` testids.
      expect(getByTestId('code-log-view__header__line-count').textContent?.trim()).toBe('4 lines')
      const filter = getByTestId('code-log-view__header__warnings-filter')
      expect(filter.textContent).toContain('1 warning')
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
      expect(getByTestId('code-log-view__empty').textContent).toContain('No log lines yet.')
      expect(
        within(getByTestId('code-log-view__empty')).getByTestId('feedback-empty-state')
      ).toBeTruthy()
    })
  })

  describe('search: context-aware header input drives the filter and highlights matches', () => {
    it('emits update:search from the header search input and round-trips into the content filter', async () => {
      const { Host, search } = makeHost({})
      const { getByTestId, getAllByTestId } = render(Host)

      const input = getByTestId('code-log-view__header__search') as HTMLInputElement
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

      await fireEvent.update(getByTestId('code-log-view__header__search'), 'finished')

      const rows = getAllByTestId('code-log-view__line')
      expect(rows).toHaveLength(1)
      const mark = within(rows[0]).getByText('finished')
      expect(mark.tagName).toBe('MARK')
    })

    it('shows the empty region when the query matches nothing', async () => {
      const { Host } = makeHost({})
      const { getByTestId, queryAllByTestId } = render(Host)

      await fireEvent.update(getByTestId('code-log-view__header__search'), 'zzz-no-match-zzz')

      expect(queryAllByTestId('code-log-view__line')).toHaveLength(0)
      const empty = getByTestId('code-log-view__empty')
      expect(empty.textContent).toContain('No line matches “zzz-no-match-zzz”.')
      await fireEvent.click(within(empty).getByRole('button', { name: 'Clear search' }))
      expect(queryAllByTestId('code-log-view__line')).toHaveLength(LINES.length)
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
      filter.focus()
      await userEvent.keyboard('{Enter}')

      expect(warningsOnly.value).toBe(true)
      expect(filter.getAttribute('aria-pressed')).toBe('true')
    })
  })

  describe('copy: the header control emits the root copy event with the formatted text', () => {
    it('fires copy with the plain-text join of the filtered lines on click', async () => {
      const copied: string[] = []
      const { Host } = makeHost({
        onCopy: (event, v) => {
          if (event instanceof MouseEvent) copied.push(v)
        }
      })
      const { getByTestId } = render(Host)

      stubClipboardResolved()
      await fireEvent.click(within(getByTestId('code-log-view__copy')).getByRole('button'))

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

    it('does not render the copy control when copyable is false', () => {
      const { Host } = makeHost({ copyable: false })
      const { queryByTestId } = render(Host)
      // Header template: v-if="ctx.copyable.value" on the default copy IconButton.
      expect(queryByTestId('code-log-view__copy')).toBeNull()
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

  describe('scroll fade: the log body fades the edges that still have lines beyond them', () => {
    const FIXTURE_CSS = `[data-testid$='__body'][data-orientation='both'] { height: 80px; overflow: auto; }`
    const MANY_LINES: LogViewLine[] = Array.from({ length: 40 }, (_, index) => ({
      id: String(index),
      time: '13:47:33',
      type: 'text',
      message: `Log line ${index}`
    }))
    let fixtureSheet: globalThis.HTMLStyleElement

    beforeAll(() => {
      fixtureSheet = document.createElement('style')
      fixtureSheet.textContent = FIXTURE_CSS
      document.head.appendChild(fixtureSheet)
    })

    afterAll(() => {
      fixtureSheet.remove()
    })

    it('marks the log body with data-fade while lines overflow it', async () => {
      const { Host } = makeHost({ lines: MANY_LINES })
      const { container } = render(Host)
      const log = container.querySelector('[data-testid$="__body"]') as globalThis.HTMLElement
      await vi.waitFor(() => expect(log.hasAttribute('data-fade')).toBe(true))
    })

    it('does not render a hand-built fade overlay over the log body', async () => {
      const { Host } = makeHost({ lines: MANY_LINES })
      const { container, queryByTestId } = render(Host)
      const log = container.querySelector('[data-testid$="__body"]') as globalThis.HTMLElement
      await vi.waitFor(() => expect(log.hasAttribute('data-fade')).toBe(true))
      expect(queryByTestId('code-log-view__content__fade-bottom')).toBeNull()
    })
  })

  describe('log levels', () => {
    const RUN: LogViewLine[] = [
      { id: 'r1', time: '0 ms', level: 'info', type: 'text', message: 'Request received' },
      { id: 'r2', time: '4 ms', level: 'debug', type: 'text', message: 'Arguments parsed' },
      { id: 'r3', time: '180 ms', level: 'warn', type: 'text', message: 'Slow origin' },
      { id: 'r4', time: '', level: 'error', type: 'text', message: 'Webhook failed' },
      { id: 'r5', time: '1.2 s', level: 'info', type: 'text', message: 'Response sent' }
    ]

    const renderLevels = (props: { disabled?: boolean } = {}) => {
      const level = ref('')
      const onCopy = vi.fn()
      const view = render(
        defineComponent({
          setup: () => () =>
            h(
              LogView,
              {
                lines: RUN,
                levels: ['debug', 'info', 'warn', 'error'],
                disabled: props.disabled ?? false,
                level: level.value,
                'onUpdate:level': (next: string) => (level.value = next),
                onCopy
              },
              () => [h(LogViewHeader), h(LogViewContent)]
            )
        })
      )
      return { view, level, onCopy }
    }

    it('offers one toggle per level, named with its count, in a labelled group', () => {
      const { view } = renderLevels()
      const group = view.getByRole('group', { name: 'Log levels' })
      const toggles = within(group).getAllByRole('button')
      expect(toggles.map((toggle) => toggle.getAttribute('aria-label'))).toEqual([
        'debug, 1 line',
        'info, 2 lines',
        'warn, 1 line',
        'error, 1 line'
      ])
      expect(toggles.every((toggle) => toggle.getAttribute('aria-pressed') === 'false')).toBe(true)
    })

    it('hides the level filter when levels is empty', () => {
      const { Host } = makeHost({ lines: RUN })
      const view = render(Host)
      expect(view.queryByRole('group', { name: 'Log levels' })).toBeNull()
    })

    it('filters to a level on click, round-trips v-model:level and clears on a second click', async () => {
      const { view, level } = renderLevels()
      const info = view.getByRole('button', { name: 'info, 2 lines' })
      await fireEvent.click(info)
      expect(level.value).toBe('info')
      expect(info.getAttribute('aria-pressed')).toBe('true')
      expect(view.getByTestId('code-log-view').getAttribute('data-level')).toBe('info')
      expect(view.getAllByTestId('code-log-view__line').map((row) => row.textContent)).toEqual([
        expect.stringContaining('Request received'),
        expect.stringContaining('Response sent')
      ])
      await fireEvent.click(view.getByRole('button', { name: 'error, 1 line' }))
      expect(level.value).toBe('error')
      await fireEvent.click(view.getByRole('button', { name: 'error, 1 line' }))
      expect(level.value).toBe('')
      expect(view.getAllByTestId('code-log-view__line')).toHaveLength(5)
    })

    it('does not change the level while disabled', async () => {
      const { view, level } = renderLevels({ disabled: true })
      const debug = view.getByRole('button', { name: 'debug, 1 line' })
      expect(debug).toBeDisabled()
      await fireEvent.click(debug)
      expect(level.value).toBe('')
    })

    it('renders the level column and data-level on rows, and drops an empty time', () => {
      const { view } = renderLevels()
      const rows = view.getAllByTestId('code-log-view__line')
      expect(rows.map((row) => row.getAttribute('data-level'))).toEqual([
        'info',
        'debug',
        'warn',
        'error',
        'info'
      ])
      expect(within(rows[2]!).getByTestId('code-log-view__line-level').textContent?.trim()).toBe(
        'warn'
      )
      expect(within(rows[3]!).queryByTestId('code-log-view__line-time')).toBeNull()
      expect(within(rows[0]!).getByTestId('code-log-view__line-time').textContent?.trim()).toBe(
        '0 ms'
      )
    })

    it('copies the level with each line', async () => {
      stubClipboardResolved()
      const { view, onCopy } = renderLevels()
      await fireEvent.click(view.getByRole('button', { name: 'warn, 1 line' }))
      await fireEvent.click(within(view.getByTestId('code-log-view__copy')).getByRole('button'))
      await vi.waitFor(() =>
        expect(onCopy).toHaveBeenCalledWith(expect.any(MouseEvent), '180 ms WARN Slow origin')
      )
    })

    it('the Levels example has no a11y violations', async () => {
      const { container, getAllByTestId } = render(Levels)
      expect(getAllByTestId('code-log-view__header__level')).toHaveLength(4)
      await expectNoA11yViolations(container)
    })
  })

  describe('a11y (axe against styled, composed DOM)', () => {
    it('the composed Header + Content tree has no violations', async () => {
      const { Host } = makeHost({ withFooter: true })
      const { container } = render(Host)
      await expectNoA11yViolations(container)
    })
  })

  describe('compound API', () => {
    it('attaches Header / Content / Footer to the root for dot-notation', () => {
      expect(LogViewCompound).toBe(LogView)
      expect(LogViewCompound.Header).toBe(LogViewHeader)
      expect(LogViewCompound.Content).toBe(LogViewContent)
      expect(LogViewCompound.Footer).toBe(LogViewFooter)
    })
  })

  describe('loading, error and test ids', () => {
    it('replaces the body with a labelled status while loading and hides copy', () => {
      const view = render(LogView, {
        props: { lines: LINES, loading: true, loadingLabel: 'Fetching logs' },
        slots: { default: () => [h(LogViewHeader), h(LogViewContent)] }
      })
      const status = view.getByRole('status')
      expect(status.textContent).toContain('Fetching logs')
      expect(view.queryAllByTestId('code-log-view__line')).toHaveLength(0)
      expect(view.queryByTestId('code-log-view__copy')).toBeNull()
      expect(view.getByTestId('code-log-view').hasAttribute('data-loading')).toBe(true)
    })

    it('shows the error message in place of the body and hides copy', () => {
      const view = render(LogView, {
        props: { lines: LINES, error: 'The log could not be loaded.' },
        slots: { default: () => [h(LogViewContent)] }
      })
      const error = view.getByTestId('code-log-view__content__error')
      expect(error.textContent).toContain('The log could not be loaded.')
      expect(view.queryAllByTestId('code-log-view__line')).toHaveLength(0)
      expect(view.queryByTestId('code-log-view__copy')).toBeNull()
    })

    it('takes the consumer data-testid on the root and derives the children from it', async () => {
      const testid = ref('deploy-log')
      const view = render(
        defineComponent({
          setup: () => () =>
            h(LogView, { lines: LINES, 'data-testid': testid.value }, () => [
              h(LogViewHeader),
              h(LogViewContent)
            ])
        })
      )
      expect(view.getByTestId('deploy-log')).toBeTruthy()
      expect(view.queryByTestId('code-log-view')).toBeNull()
      expect(view.getByTestId('deploy-log__header')).toBeTruthy()
      testid.value = 'build-log'
      await nextTick()
      expect(view.getByTestId('build-log__header')).toBeTruthy()
      expect(view.getAllByTestId('build-log__line')).toHaveLength(LINES.length)
    })
  })

  describe('one severity axis', () => {
    it('counts and filters a deprecated type warning line as level warn', async () => {
      const level = ref<'' | 'warn'>('')
      const view = render(
        defineComponent({
          setup: () => () =>
            h(
              LogView,
              {
                lines: LINES,
                levels: ['warn'],
                level: level.value,
                'onUpdate:level': (v: '' | 'warn') => (level.value = v)
              },
              () => [h(LogViewHeader), h(LogViewContent)]
            )
        })
      )
      const toggle = view.getByRole('button', { name: 'warn, 1 line' })
      await fireEvent.click(toggle)
      const rows = view.getAllByTestId('code-log-view__line')
      expect(rows).toHaveLength(1)
      expect(rows[0]?.getAttribute('data-type')).toBe('warning')
    })
  })

  describe('documented examples (the example file runs in-test)', () => {
    it('Default story renders the composed viewer over the deploy log with rows', () => {
      const { getByTestId, getAllByTestId } = render(Default)
      expect(getByTestId('code-log-view').tagName).toBe('DIV')
      expect(getByTestId('code-log-view__header')).toBeTruthy()
      expect(getByTestId('code-log-view__content')).toBeTruthy()
      // The deploy log fixture has many lines.
      expect(getAllByTestId('code-log-view__line').length).toBeGreaterThan(0)
    })

    // The frame-inside-a-frame this story exists to prevent is only visible with
    // real styling, so the pixels are the visual layer's job; here we prove the
    // fixture composes and that it is the borderless shell being shot.
    it('Borderless story renders the shell without the outer border', () => {
      const { getByTestId } = render(Borderless)

      expect(getByTestId('code-log-view').hasAttribute('data-border')).toBe(false)
      expect(getByTestId('code-log-view__content')).toBeTruthy()
    })
  })
})
