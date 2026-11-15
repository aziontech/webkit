import userEvent from '@testing-library/user-event'
import { fireEvent, render, within } from '@testing-library/vue'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Borderless from '../../../../examples/log-viewer/borderless.vue'
import Default from '../../../../examples/log-viewer/default.vue'
import Levels from '../../../../examples/log-viewer/levels.vue'
import StepsExample from '../../../../examples/log-viewer/steps.vue'
import StepsError from '../../../../examples/log-viewer/steps-error.vue'
import StepsRunning from '../../../../examples/log-viewer/steps-running.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import LogViewerCompound from './index'
import type { LogViewerLine, LogViewerLineLevel, LogViewerStep } from './injection-key'
import LogViewer from './log-viewer.vue'
import LogViewerContent from './log-viewer-content.vue'
import LogViewerFooter from './log-viewer-footer.vue'
import LogViewerHeader from './log-viewer-header.vue'
import LogViewerSteps from './log-viewer-steps.vue'

// The real Clipboard API rejects in headless Chromium; stub writeText to resolve
// so CopyButton's own logic (await write -> emit 'copy') runs. Not a layout mock.
function stubClipboardResolved() {
  return vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
}

afterEach(() => {
  vi.restoreAllMocks()
})

// Grounded in complete-deploy-log.js shapes: text / success / folder lines and one warn line.
const LINES: LogViewerLine[] = [
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
  {
    id: '4',
    time: '13:47:43',
    type: 'text',
    level: 'warn',
    message: 'Bundle larger than recommended'
  }
]

/**
 * Composes the real tree (LogViewer + Header + Content + Footer) around parent-owned
 * refs so v-model:search / v-model:level round-trips are observable, and the
 * root `copy` event can be captured. Mirrors the documented composition usage.
 */
function makeHost(options: {
  lines?: LogViewerLine[]
  copyable?: boolean
  disabled?: boolean
  searchPlaceholder?: string
  withFooter?: boolean
  onCopy?: (event: Event, value: string) => void
}) {
  const search = ref('')
  const level = ref<LogViewerLineLevel | ''>('')

  const Host = defineComponent({
    setup() {
      return () =>
        h(
          LogViewer,
          {
            lines: options.lines ?? LINES,
            copyable: options.copyable ?? true,
            disabled: options.disabled ?? false,
            searchPlaceholder: options.searchPlaceholder,
            search: search.value,
            'onUpdate:search': (v: string) => {
              search.value = v
            },
            level: level.value,
            'onUpdate:level': (v: LogViewerLineLevel | '') => {
              level.value = v
            },
            onCopy: options.onCopy,
            class: 'h-[480px]'
          },
          () => [
            h(LogViewerHeader),
            h(LogViewerContent),
            ...(options.withFooter ? [h(LogViewerFooter, () => 'Footer content')] : [])
          ]
        )
    }
  })

  return { Host, search, level }
}

describe('LogViewer', () => {
  describe('composition: provide/inject over Header/Content/Footer', () => {
    it('mounts a long log in chunks while the count, search and copy cover every line', async () => {
      const lines: LogViewerLine[] = Array.from({ length: 2000 }, (_, i) => ({
        id: String(i),
        time: '13:47:33',
        type: 'text',
        message: `Line ${i}`
      }))
      const { Host, search } = makeHost({ lines })
      const { getAllByTestId, getByTestId } = render(Host)
      const mounted = getAllByTestId('code-log-viewer__line').length
      expect(mounted).toBeGreaterThan(0)
      expect(mounted).toBeLessThan(2000)
      expect(getByTestId('code-log-viewer__header__line-count').textContent).toMatch(/2[,. ]?000/)
      search.value = 'Line 1999'
      await new Promise((resolve) => setTimeout(resolve, 0))
      expect(getAllByTestId('code-log-viewer__line')).toHaveLength(1)
    })

    describe('composition wiring — the public sub-components are real components sharing one context', () => {
      it('resolves each sub-component as a Vue component with its own defineOptions name', () => {
        // These are the exact modules published as @aziontech/webkit/log-viewer-*.
        expect(LogViewer.name).toBe('LogViewer')
        expect(LogViewerHeader.name).toBe('LogViewerHeader')
        expect(LogViewerContent.name).toBe('LogViewerContent')
        expect(LogViewerFooter.name).toBe('LogViewerFooter')
      })

      it('renders the root <div> with the fallback testid and composed regions inside it', () => {
        const { Host } = makeHost({})
        const { getByTestId } = render(Host)

        const root = getByTestId('code-log-viewer')
        expect(root.tagName).toBe('DIV')

        // Derived region testids from the injected ctx.testId.
        const header = getByTestId('code-log-viewer__header')
        const content = getByTestId('code-log-viewer__content')
        expect(header.tagName).toBe('HEADER')
        expect(root.contains(header)).toBe(true)
        expect(root.contains(content)).toBe(true)
      })

      // The outline AND the corner radius hang off data-bordered (Tailwind
      // `data-[bordered]:` variants), so dropping the attribute drops both.
      it('sets data-bordered by default and drops it when bordered is false', () => {
        const bordered = render(LogViewer, { props: { lines: LINES } })
        expect(
          within(bordered.container).getByTestId('code-log-viewer').getAttribute('data-bordered')
        ).toBe('true')

        const flush = render(LogViewer, { props: { lines: LINES, bordered: false } })
        expect(
          within(flush.container).getByTestId('code-log-viewer').hasAttribute('data-bordered')
        ).toBe(false)
      })

      it('throws a helpful error when a sub-component is used outside LogViewer', () => {
        // useLogViewerContext() has no provider -> inject returns undefined -> throw.
        expect(() => render(LogViewerHeader)).toThrow(/must be used within LogViewer/)
      })
    })

    describe('injected state drives the sub-components (consumer wires nothing)', () => {
      it('renders one line row per entry through LogViewerContent, keyed by ctx.filteredLines', () => {
        const { Host } = makeHost({})
        const { getAllByTestId } = render(Host)
        // Template: v-for line in ctx.filteredLines -> `${testId}__line`.
        expect(getAllByTestId('code-log-viewer__line')).toHaveLength(LINES.length)
      })

      it('keeps a polite log region that starts empty instead of the scrolling body', () => {
        const { Host } = makeHost({})
        const { getByRole, getByTestId } = render(Host)
        const log = getByRole('log')
        expect(log.getAttribute('aria-live')).toBe('polite')
        expect(log.textContent?.trim()).toBe('')
        expect(getByTestId('code-log-viewer__content__body').hasAttribute('aria-live')).toBe(false)
      })

      it('announces appended lines only, not chunks that mount on scroll', async () => {
        const lines = ref<LogViewerLine[]>(
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
              h(LogViewer, { lines: lines.value, class: 'h-[480px]' }, () => [h(LogViewerContent)])
          }
        })
        const { container, getAllByTestId, getByRole } = render(Host)
        const log = getByRole('log')
        const before = getAllByTestId('code-log-viewer__line').length
        container.querySelector('[data-chunk="19"]')?.scrollIntoView()
        await vi.waitFor(() => {
          expect(getAllByTestId('code-log-viewer__line').length).toBeGreaterThan(before)
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
        expect(getByTestId('code-log-viewer__header__line-count').textContent?.trim()).toBe(
          '4 lines'
        )
        const filter = getByTestId('code-log-viewer__header__warnings-filter')
        expect(filter.textContent).toContain('1 warning')
        expect(filter.getAttribute('aria-pressed')).toBe('false')
      })

      it('omits the warnings filter entirely when there are no warning lines', () => {
        const noWarnings = LINES.filter((l) => l.level !== 'warn')
        const { Host } = makeHost({ lines: noWarnings })
        const { queryByTestId, getByTestId } = render(Host)
        // Template: v-if="ctx.warningCount.value > 0".
        expect(queryByTestId('code-log-viewer__header__warnings-filter')).toBeNull()
        expect(getByTestId('code-log-viewer__header__line-count').textContent?.trim()).toBe(
          '3 lines'
        )
      })

      it('renders the empty region (default text) when no lines are provided', () => {
        const { Host } = makeHost({ lines: [] })
        const { getByTestId, queryAllByTestId } = render(Host)
        expect(queryAllByTestId('code-log-viewer__line')).toHaveLength(0)
        expect(getByTestId('code-log-viewer__empty').textContent).toContain('No log lines yet.')
        expect(
          within(getByTestId('code-log-viewer__empty')).getByTestId('feedback-empty-state')
        ).toBeTruthy()
      })
    })

    describe('search: context-aware header input drives the filter and highlights matches', () => {
      it('emits update:search from the header search input and round-trips into the content filter', async () => {
        const { Host, search } = makeHost({})
        const { getByTestId, getAllByTestId } = render(Host)

        const input = getByTestId('code-log-viewer__header__search') as HTMLInputElement
        expect(input.getAttribute('aria-label')).toBe('Search logs')

        // Type a query matching only the "Build finished" success line.
        await fireEvent.update(input, 'Build')

        // v-model:search updated in the parent (round-trip via update:search).
        expect(search.value).toBe('Build')

        // ctx.filteredLines re-filtered -> only the matching row remains.
        const rows = getAllByTestId('code-log-viewer__line')
        expect(rows).toHaveLength(1)
        expect(rows[0].textContent).toContain('Build finished')
      })

      it('highlights the matched substring with a <mark> inside the surviving line', async () => {
        const { Host } = makeHost({})
        const { getByTestId, getAllByTestId } = render(Host)

        await fireEvent.update(getByTestId('code-log-viewer__header__search'), 'finished')

        const rows = getAllByTestId('code-log-viewer__line')
        expect(rows).toHaveLength(1)
        const mark = within(rows[0]).getByText('finished')
        expect(mark.tagName).toBe('MARK')
      })

      it('shows the empty region when the query matches nothing', async () => {
        const { Host } = makeHost({})
        const { getByTestId, queryAllByTestId } = render(Host)

        await fireEvent.update(getByTestId('code-log-viewer__header__search'), 'zzz-no-match-zzz')

        expect(queryAllByTestId('code-log-viewer__line')).toHaveLength(0)
        const empty = getByTestId('code-log-viewer__empty')
        expect(empty.textContent).toContain('No line matches “zzz-no-match-zzz”.')
        await fireEvent.click(within(empty).getByRole('button', { name: 'Clear search' }))
        expect(queryAllByTestId('code-log-viewer__line')).toHaveLength(LINES.length)
      })
    })

    describe('warnings filter: the context-aware button toggles the warn level', () => {
      it('sets v-model:level to warn on click and filters content to warnings', async () => {
        const { Host, level } = makeHost({})
        const { getByTestId, getAllByTestId } = render(Host)

        const filter = getByTestId('code-log-viewer__header__warnings-filter')
        expect(filter.getAttribute('aria-pressed')).toBe('false')

        await fireEvent.click(filter)

        expect(level.value).toBe('warn')
        // aria-pressed reflects the injected state.
        expect(filter.getAttribute('aria-pressed')).toBe('true')

        // Only the single warning line survives the filter.
        const rows = getAllByTestId('code-log-viewer__line')
        expect(rows).toHaveLength(1)
        expect(rows[0].getAttribute('data-level')).toBe('warn')
        expect(getByTestId('code-log-viewer').getAttribute('data-level')).toBe('warn')
        expect(getByTestId('code-log-viewer').hasAttribute('data-warnings-only')).toBe(false)

        await fireEvent.click(filter)
        expect(level.value).toBe('')
        expect(getAllByTestId('code-log-viewer__line')).toHaveLength(LINES.length)
      })

      it('toggles the warn level via keyboard (Enter) on the filter button', async () => {
        const { Host, level } = makeHost({})
        const { getByTestId } = render(Host)

        const filter = getByTestId('code-log-viewer__header__warnings-filter')
        filter.focus()
        await userEvent.keyboard('{Enter}')

        expect(level.value).toBe('warn')
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
        await fireEvent.click(within(getByTestId('code-log-viewer__copy')).getByRole('button'))

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
        expect(queryByTestId('code-log-viewer__copy')).toBeNull()
      })
    })

    describe('disabled: toolbar controls are inert', () => {
      it('flags data-disabled on the root and disables the warnings filter', () => {
        const { Host } = makeHost({ disabled: true })
        const { getByTestId } = render(Host)

        expect(getByTestId('code-log-viewer').getAttribute('data-disabled')).toBe('true')
        // <button ... :disabled="ctx.disabled.value"> on the warnings filter.
        expect(
          (getByTestId('code-log-viewer__header__warnings-filter') as HTMLButtonElement).disabled
        ).toBe(true)
      })

      it('does not toggle the warn level while disabled (click is a no-op)', async () => {
        const { Host, level } = makeHost({ disabled: true })
        const { getByTestId } = render(Host)

        await fireEvent.click(getByTestId('code-log-viewer__header__warnings-filter'))
        expect(level.value).toBe('')
      })
    })

    describe('LogViewerFooter renders as a footer landmark inside the root', () => {
      it('renders default slot content in a <footer> with the derived testid', () => {
        const { Host } = makeHost({ withFooter: true })
        const { getByTestId } = render(Host)

        const footer = getByTestId('code-log-viewer__footer')
        expect(footer.tagName).toBe('FOOTER')
        expect(footer.textContent).toContain('Footer content')
      })
    })

    describe('scroll fade: the log body fades the edges that still have lines beyond them', () => {
      const FIXTURE_CSS = `[data-testid$='__body'][data-orientation='both'] { height: 80px; overflow: auto; }`
      const MANY_LINES: LogViewerLine[] = Array.from({ length: 40 }, (_, index) => ({
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
        expect(queryByTestId('code-log-viewer__content__fade-bottom')).toBeNull()
      })
    })

    describe('log levels', () => {
      const RUN: LogViewerLine[] = [
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
                LogViewer,
                {
                  lines: RUN,
                  levels: ['debug', 'info', 'warn', 'error'],
                  disabled: props.disabled ?? false,
                  level: level.value,
                  'onUpdate:level': (next: string) => (level.value = next),
                  onCopy
                },
                () => [h(LogViewerHeader), h(LogViewerContent)]
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
        expect(toggles.every((toggle) => toggle.getAttribute('aria-pressed') === 'false')).toBe(
          true
        )
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
        expect(view.getByTestId('code-log-viewer').getAttribute('data-level')).toBe('info')
        expect(view.getAllByTestId('code-log-viewer__line').map((row) => row.textContent)).toEqual([
          expect.stringContaining('Request received'),
          expect.stringContaining('Response sent')
        ])
        await fireEvent.click(view.getByRole('button', { name: 'error, 1 line' }))
        expect(level.value).toBe('error')
        await fireEvent.click(view.getByRole('button', { name: 'error, 1 line' }))
        expect(level.value).toBe('')
        expect(view.getAllByTestId('code-log-viewer__line')).toHaveLength(5)
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
        const rows = view.getAllByTestId('code-log-viewer__line')
        expect(rows.map((row) => row.getAttribute('data-level'))).toEqual([
          'info',
          'debug',
          'warn',
          'error',
          'info'
        ])
        expect(
          within(rows[2]!).getByTestId('code-log-viewer__line-level').textContent?.trim()
        ).toBe('warn')
        expect(within(rows[3]!).queryByTestId('code-log-viewer__line-time')).toBeNull()
        expect(within(rows[0]!).getByTestId('code-log-viewer__line-time').textContent?.trim()).toBe(
          '0 ms'
        )
      })

      it('copies the level with each line', async () => {
        stubClipboardResolved()
        const { view, onCopy } = renderLevels()
        await fireEvent.click(view.getByRole('button', { name: 'warn, 1 line' }))
        await fireEvent.click(within(view.getByTestId('code-log-viewer__copy')).getByRole('button'))
        await vi.waitFor(() =>
          expect(onCopy).toHaveBeenCalledWith(expect.any(MouseEvent), '180 ms WARN Slow origin')
        )
      })

      it('the Levels example has no a11y violations', async () => {
        const { container, getAllByTestId } = render(Levels)
        expect(getAllByTestId('code-log-viewer__header__level')).toHaveLength(4)
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
        expect(LogViewerCompound).toBe(LogViewer)
        expect(LogViewerCompound.Header).toBe(LogViewerHeader)
        expect(LogViewerCompound.Content).toBe(LogViewerContent)
        expect(LogViewerCompound.Footer).toBe(LogViewerFooter)
        expect(LogViewerCompound.Steps).toBe(LogViewerSteps)
      })
    })

    describe('loading, error and test ids', () => {
      it('replaces the body with a labelled status while loading and hides copy', () => {
        const view = render(LogViewer, {
          props: { lines: LINES, loading: true, loadingLabel: 'Fetching logs' },
          slots: { default: () => [h(LogViewerHeader), h(LogViewerContent)] }
        })
        const status = view.getByRole('status')
        expect(status.textContent).toContain('Fetching logs')
        expect(view.queryAllByTestId('code-log-viewer__line')).toHaveLength(0)
        expect(view.queryByTestId('code-log-viewer__copy')).toBeNull()
        expect(view.getByTestId('code-log-viewer').hasAttribute('data-loading')).toBe(true)
      })

      it('shows the error message in place of the body and hides copy', () => {
        const view = render(LogViewer, {
          props: { lines: LINES, error: 'The log could not be loaded.' },
          slots: { default: () => [h(LogViewerContent)] }
        })
        const error = view.getByTestId('code-log-viewer__content__error')
        expect(error.textContent).toContain('The log could not be loaded.')
        expect(view.queryAllByTestId('code-log-viewer__line')).toHaveLength(0)
        expect(view.queryByTestId('code-log-viewer__copy')).toBeNull()
      })

      it('takes the consumer data-testid on the root and derives the children from it', async () => {
        const testid = ref('deploy-log')
        const view = render(
          defineComponent({
            setup: () => () =>
              h(LogViewer, { lines: LINES, 'data-testid': testid.value }, () => [
                h(LogViewerHeader),
                h(LogViewerContent)
              ])
          })
        )
        expect(view.getByTestId('deploy-log')).toBeTruthy()
        expect(view.queryByTestId('code-log-viewer')).toBeNull()
        expect(view.getByTestId('deploy-log__header')).toBeTruthy()
        testid.value = 'build-log'
        await nextTick()
        expect(view.getByTestId('build-log__header')).toBeTruthy()
        expect(view.getAllByTestId('build-log__line')).toHaveLength(LINES.length)
      })
    })

    describe('one severity axis', () => {
      it('counts and filters a warn line through the level toggle', async () => {
        const level = ref<'' | 'warn'>('')
        const view = render(
          defineComponent({
            setup: () => () =>
              h(
                LogViewer,
                {
                  lines: LINES,
                  levels: ['warn'],
                  level: level.value,
                  'onUpdate:level': (v: '' | 'warn') => (level.value = v)
                },
                () => [h(LogViewerHeader), h(LogViewerContent)]
              )
          })
        )
        const toggle = view.getByRole('button', { name: 'warn, 1 line' })
        await fireEvent.click(toggle)
        const rows = view.getAllByTestId('code-log-viewer__line')
        expect(rows).toHaveLength(1)
        expect(rows[0]?.getAttribute('data-level')).toBe('warn')
      })
    })

    describe('documented examples (the example file runs in-test)', () => {
      it('Default story renders the composed viewer over the deploy log with rows', () => {
        const { getByTestId, getAllByTestId } = render(Default)
        expect(getByTestId('code-log-viewer').tagName).toBe('DIV')
        expect(getByTestId('code-log-viewer__header')).toBeTruthy()
        expect(getByTestId('code-log-viewer__content')).toBeTruthy()
        // The deploy log fixture has many lines.
        expect(getAllByTestId('code-log-viewer__line').length).toBeGreaterThan(0)
      })

      // The frame-inside-a-frame this story exists to prevent is only visible with
      // real styling, so the pixels are the visual layer's job; here we prove the
      // fixture composes and that it is the borderless shell being shot.
      it('Borderless story renders the shell without the outer border', () => {
        const { getByTestId } = render(Borderless)

        expect(getByTestId('code-log-viewer').hasAttribute('data-bordered')).toBe(false)
        expect(getByTestId('code-log-viewer__content')).toBeTruthy()
      })
    })

    describe('LogViewer.Steps: a run with known steps', () => {
      const STEPS: LogViewerStep[] = [
        {
          id: 'build',
          title: 'Build',
          description: 'Assets bundled',
          status: 'success',
          duration: '9s',
          lines: [
            { id: '1', time: '13:47:41', type: 'text', message: 'Running build' },
            { id: '2', time: '13:47:50', type: 'success', message: 'Build finished' }
          ]
        },
        {
          id: 'rules',
          title: 'Routing Rules',
          description: 'Applying rules',
          status: 'running',
          lines: [{ id: '1', time: '13:48:08', type: 'text', message: 'Configuring rules' }]
        },
        { id: 'publish', title: 'Publish', status: 'pending', lines: [] }
      ]

      const stepsHost = (props: Record<string, unknown> = {}, slots = {}) => {
        const view = ref<'phased' | 'complete'>('phased')
        const open = ref<string | undefined>(undefined)
        const Host = defineComponent({
          setup: () => () =>
            h(
              LogViewerSteps,
              {
                steps: STEPS,
                view: view.value,
                'onUpdate:view': (v: 'phased' | 'complete') => (view.value = v),
                openStep: open.value,
                'onUpdate:openStep': (v: string | undefined) => (open.value = v),
                ...props
              },
              slots
            )
        })
        return { Host, view, open }
      }

      it('renders one step per entry, with its status in words, and opens the running step', () => {
        const { Host } = stepsHost()
        const { getAllByTestId, getByTestId, getByText } = render(Host)
        const items = getAllByTestId('code-log-viewer__steps__step')
        expect(items.map((item) => item.getAttribute('data-status'))).toEqual([
          'success',
          'running',
          'pending'
        ])
        expect(within(items[0]!).getByText('Done')).toBeTruthy()
        expect(within(items[1]!).getByText('Running')).toBeTruthy()
        expect(within(items[2]!).getByText('Not started')).toBeTruthy()
        expect(getByText('Configuring rules')).toBeTruthy()
        expect(getByTestId('code-log-viewer__steps').getAttribute('data-view')).toBe('phased')
      })

      it('opens the failed step when no step runs', () => {
        const failed: LogViewerStep[] = [
          { ...STEPS[0]!, status: 'success' },
          { ...STEPS[1]!, status: 'error', description: 'Origin not found' },
          { id: 'publish', title: 'Publish', status: 'skipped', lines: [] }
        ]
        const { getByText, queryByText } = render(LogViewerSteps, { props: { steps: failed } })
        expect(getByText('Configuring rules')).toBeTruthy()
        expect(queryByText('Running build')).toBeNull()
      })

      it('round-trips v-model:open-step when a step trigger is pressed', async () => {
        const { Host, open } = stepsHost()
        const { getByRole, findByText } = render(Host)
        await fireEvent.click(getByRole('button', { name: /Build/ }))
        expect(open.value).toBe('build')
        expect(await findByText('Running build')).toBeTruthy()
      })

      it('switches to the complete view, one log with every line', async () => {
        const { Host, view } = stepsHost()
        const { getByRole, getByTestId, getAllByTestId } = render(Host)
        const group = getByTestId('code-log-viewer__steps__view-switch')
        expect(group).toBeTruthy()
        await fireEvent.click(getByRole('radio', { name: 'Complete' }))
        expect(view.value).toBe('complete')
        expect(getByTestId('code-log-viewer__steps__complete')).toBeTruthy()
        expect(getAllByTestId('code-log-viewer__steps__complete__line')).toHaveLength(3)
      })

      it('hides the view switch with view-switch false and has no toolbar without a header', () => {
        const { queryByTestId } = render(LogViewerSteps, {
          props: { steps: STEPS, viewSwitch: false }
        })
        expect(queryByTestId('code-log-viewer__steps__view-switch')).toBeNull()
        expect(queryByTestId('code-log-viewer__steps__toolbar')).toBeNull()
      })

      it('shows the toolbar when a header slot appears after mount', async () => {
        const shown = ref(false)
        const Host = defineComponent({
          setup: () => () =>
            h(
              LogViewerSteps,
              { steps: STEPS, viewSwitch: false },
              shown.value ? { header: () => h('span', 'Run 42') } : {}
            )
        })
        const { queryByTestId, findByText } = render(Host)
        expect(queryByTestId('code-log-viewer__steps__toolbar')).toBeNull()
        shown.value = true
        await findByText('Run 42')
        expect(queryByTestId('code-log-viewer__steps__toolbar')).toBeTruthy()
      })

      it('draws the flush progress bar valued by the share of steps done', () => {
        const { getByRole } = render(LogViewerSteps, { props: { steps: STEPS, progress: true } })
        const bar = getByRole('progressbar', { name: 'Run progress' })
        expect(bar.getAttribute('aria-valuenow')).toBe('33')
      })

      it('shows no progress bar by default', () => {
        const { queryByTestId } = render(LogViewerSteps, { props: { steps: STEPS } })
        expect(queryByTestId('code-log-viewer__steps__progress')).toBeNull()
      })

      it('waits on a pending step and says a skipped step never ran', async () => {
        const steps: LogViewerStep[] = [
          { id: 'a', title: 'Pending step', status: 'pending', lines: [] },
          { id: 'b', title: 'Skipped step', status: 'skipped', lines: [] }
        ]
        const pending = render(LogViewerSteps, { props: { steps, openStep: 'a' } })
        expect(pending.getByText('Waiting to start…')).toBeTruthy()
        pending.unmount()
        const skipped = render(LogViewerSteps, { props: { steps, openStep: 'b' } })
        expect(skipped.getByText('Never ran.')).toBeTruthy()
      })

      it('fills the header, step-meta and step-empty slots', () => {
        const steps: LogViewerStep[] = [{ id: 'a', title: 'Publish', status: 'skipped', lines: [] }]
        const { getByTestId, getByText } = render(LogViewerSteps, {
          props: { steps, openStep: 'a' },
          slots: {
            header: '<h2>Deployment logs</h2>',
            'step-meta': '<span>meta-tag</span>',
            'step-empty': '<span>Stopped earlier</span>'
          }
        })
        expect(
          within(getByTestId('code-log-viewer__steps__toolbar')).getByText('Deployment logs')
        ).toBeTruthy()
        expect(getByText('meta-tag')).toBeTruthy()
        expect(getByText('Stopped earlier')).toBeTruthy()
      })

      it('lets a consumer data-testid win and derives the parts from it', () => {
        const { getByTestId, queryByTestId } = render(LogViewerSteps, {
          props: { steps: STEPS },
          attrs: { 'data-testid': 'deploy-run' }
        })
        expect(getByTestId('deploy-run')).toBeTruthy()
        expect(getByTestId('deploy-run__view-switch')).toBeTruthy()
        expect(queryByTestId('code-log-viewer__steps')).toBeNull()
      })

      it('renders the Steps, StepsRunning and StepsError examples without violations', async () => {
        for (const Example of [StepsExample, StepsRunning, StepsError]) {
          const view = render(Example)
          expect(view.getAllByTestId('code-log-viewer__steps__step').length).toBeGreaterThan(0)
          await expectNoA11yViolations(view.container)
          view.unmount()
        }
      })
    })
  })
})
