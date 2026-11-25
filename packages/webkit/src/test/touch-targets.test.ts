import './reflow.css'

import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { commands, page } from 'vitest/browser'
import { h, nextTick } from 'vue'

import AccordionDefault from '../../examples/accordion/default.vue'
import AppHeaderWithAccount from '../../examples/app-header/with-account.vue'
import AppLayoutDefault from '../../examples/app-layout/default.vue'
import ArticleHighlightAutoplay from '../../examples/article-highlight-section/autoplay.vue'
import ButtonGroupDefault from '../../examples/button-group/default.vue'
import ChartTooltipTotal from '../../examples/chart/tooltip-total.vue'
import CitationDefault from '../../examples/citation/default.vue'
import CliTerminalDefault from '../../examples/cli-terminal-section/default.vue'
import ClientQuotesDefault from '../../examples/client-quotes-section/default.vue'
import ClosingAudiences from '../../examples/closing-call-to-action-section/audiences.vue'
import CodeBlockUnevenTabs from '../../examples/code-block/uneven-tabs.vue'
import CompetitorComparisonDefault from '../../examples/competitor-comparison-section/default.vue'
import ConsoleShowcaseDefault from '../../examples/console-showcase-section/default.vue'
import DashboardGridEditing from '../../examples/dashboard-grid/editing.vue'
import DatePickerDefault from '../../examples/date-picker/default.vue'
import DocTableOfContentsDefault from '../../examples/doc-table-of-contents/default.vue'
import DonutChartDefault from '../../examples/donut-chart/default.vue'
import DropdownMenuStates from '../../examples/dropdown-menu/states.vue'
import FileDropzoneDefault from '../../examples/file-dropzone/default.vue'
import FooterDefault from '../../examples/footer/default.vue'
import HighlightButtonSizes from '../../examples/highlight-button/sizes.vue'
import InputDefault from '../../examples/input/default.vue'
import MultiSelectDefault from '../../examples/multi-select/default.vue'
import NumberInputDefault from '../../examples/number-input/default.vue'
import OverflowCountDefault from '../../examples/overflow-count/default.vue'
import PromptInputShortcutMenus from '../../examples/prompt-input/shortcut-menus.vue'
import ReasoningDefault from '../../examples/reasoning/default.vue'
import SelectDefault from '../../examples/select/default.vue'
import SettingsGroupCollapsible from '../../examples/settings-group/collapsible.vue'
import SettingsGroupDefault from '../../examples/settings-group/default.vue'
import SourcesDefault from '../../examples/sources/default.vue'
import SplitButtonSizes from '../../examples/split-button/sizes.vue'
import TabsDefault from '../../examples/tabs/default.vue'
import ThemeSwitcherDefault from '../../examples/theme-switcher/default.vue'
import ToggleGroupSizes from '../../examples/toggle-group/sizes.vue'
import TreeDefault from '../../examples/tree/default.vue'
import ConversationHistory from '../components/ai/conversation-history/conversation-history.vue'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

const settle = async () => {
  await nextTick()
  await frame()
  await frame()
}

const hits = (el: Element, x: number, y: number) => {
  const found = document.elementFromPoint(x, y)
  return found !== null && el.contains(found)
}

function hitSpan(el: HTMLElement, axis: 'x' | 'y') {
  const box = el.getBoundingClientRect()
  const cx = box.left + box.width / 2
  const cy = box.top + box.height / 2
  const at = (d: number) => (axis === 'y' ? hits(el, cx, cy + d) : hits(el, cx + d, cy))
  let before = 0
  while (before < 40 && at(-(before + 1))) before += 1
  let after = 0
  while (after < 40 && at(after + 1)) after += 1
  return before + after + 1
}

const byTestId = (root: HTMLElement, id: string) =>
  Array.from(root.querySelectorAll<HTMLElement>(`[data-testid="${id}"]`))

async function mount(component: object) {
  const view = render({ render: () => h('div', { style: 'padding: 4rem' }, [h(component)]) })
  await settle()
  return view
}

afterEach(async () => {
  await commands.emulateTouch(false)
  await page.viewport(414, 896)
})

describe('tap targets on a coarse pointer (styled)', () => {
  it('keeps the drawn size on a fine pointer', async () => {
    const view = await mount(InputDefault)
    const field = view.container.querySelector<HTMLElement>('[data-slot="input"]')!
    expect(hitSpan(field, 'y')).toBe(Math.round(field.getBoundingClientRect().height))
  })

  describe('with touch', () => {
    const touch = async () => {
      await commands.emulateTouch(true)
      await page.viewport(390, 844)
    }

    it.each([
      ['Input', InputDefault, 'input'],
      ['Select', SelectDefault, 'select-trigger'],
      ['MultiSelect', MultiSelectDefault, 'multi-select-trigger'],
      ['DatePicker', DatePickerDefault, 'date-picker__trigger']
    ])('%s answers a tap across 44px of height', async (_name, component, id) => {
      await touch()
      const view = await mount(component)
      const field = byTestId(view.container as HTMLElement, id)[0]!
      const target = field.tagName === 'INPUT' ? field.parentElement! : field
      expect(target.getBoundingClientRect().height).toBeLessThan(44)
      expect(hitSpan(target, 'y')).toBeGreaterThanOrEqual(44)
    })

    it('HighlightButton answers a tap across 44 x 44 at every size', async () => {
      await touch()
      const view = await mount(HighlightButtonSizes)
      const buttons = byTestId(view.container as HTMLElement, 'highlight-button')
      expect(buttons.length).toBeGreaterThanOrEqual(3)
      for (const button of buttons) {
        expect(hitSpan(button, 'y')).toBeGreaterThanOrEqual(44)
      }
      expect(buttons.some((button) => button.getBoundingClientRect().height < 40)).toBe(true)
    })

    it('NumberInput steppers are 44px tall to the touch', async () => {
      await touch()
      const view = await mount(NumberInputDefault)
      const steppers = Array.from(
        view.container.querySelectorAll<HTMLElement>('button[tabindex="-1"]')
      )
      expect(steppers).toHaveLength(2)
      for (const stepper of steppers) {
        expect(stepper.getBoundingClientRect().width).toBeGreaterThanOrEqual(39)
        expect(hitSpan(stepper, 'y')).toBeGreaterThanOrEqual(44)
      }
    })

    it('OverflowCount +N answers a tap across 44px of height', async () => {
      await touch()
      const view = await mount(OverflowCountDefault)
      const trigger = byTestId(view.container as HTMLElement, 'overflow-count__trigger')[0]!
      expect(trigger.getBoundingClientRect().height).toBeLessThan(44)
      expect(hitSpan(trigger, 'y')).toBeGreaterThanOrEqual(44)
    })

    it('Tree folders open from a 44 x 44 chevron target', async () => {
      await touch()
      const view = await mount(TreeDefault)
      const toggles = byTestId(view.container as HTMLElement, 'tree__toggle')
      expect(toggles.length).toBeGreaterThan(0)
      for (const toggle of toggles) {
        expect(hitSpan(toggle, 'x')).toBeGreaterThanOrEqual(44)
        expect(hitSpan(toggle, 'y')).toBeGreaterThanOrEqual(44)
      }
    })

    it('SettingsGroup copy-link answers its own 44px and never the Hint beside it', async () => {
      await touch()
      const view = await mount(SettingsGroupDefault)
      const link = byTestId(view.container as HTMLElement, 'settings-group__copy-link')[0]!
      const hint = link.parentElement!.querySelector<HTMLElement>('[data-testid="hint__trigger"]')!
      const target = link.querySelector<HTMLElement>('[data-slot="touch-target"]')!
      await vi.waitFor(() => {
        const box = target.getBoundingClientRect()
        expect(box.height).toBeGreaterThanOrEqual(44)
        expect(box.width).toBeGreaterThanOrEqual(44)
      })
      const linkBox = link.getBoundingClientRect()
      const hintBox = hint.getBoundingClientRect()
      const linkCentre = linkBox.left + linkBox.width / 2
      const hintCentre = hintBox.left + hintBox.width / 2
      expect(Math.abs(linkCentre - hintCentre)).toBeGreaterThanOrEqual(44)
    })

    it('ThemeSwitcher segments answer a tap across 44 x 44', async () => {
      await touch()
      const view = await mount(ThemeSwitcherDefault)
      const segment = view.container.querySelector<HTMLElement>('[role="radio"]')!
      expect(segment.getBoundingClientRect().height).toBeLessThan(40)
      expect(hitSpan(segment, 'y')).toBeGreaterThanOrEqual(44)
    })

    it('FileDropzone leads with choosing files, not dropping them', async () => {
      await touch()
      const view = await mount(FileDropzoneDefault)
      await settle()
      expect(view.getByText('Choose files to upload')).toBeTruthy()
      expect(view.queryByText('Drop files to upload')).toBeNull()
    })

    it('ThemeSwitcher segments are wide enough to tap and never cover a neighbour', async () => {
      await touch()
      const view = await mount(ThemeSwitcherDefault)
      const segments = Array.from(view.container.querySelectorAll<HTMLElement>('[role="radio"]'))
      expect(segments).toHaveLength(3)
      for (const segment of segments) {
        const width = segment.getBoundingClientRect().width
        expect(width).toBeGreaterThanOrEqual(40)
        expect(hitSpan(segment, 'x')).toBeLessThanOrEqual(Math.round(width) + 1)
      }
    })

    it.each([
      ['ToggleGroup', ToggleGroupSizes, '[data-testid="toggle-group__option"]'],
      ['ButtonGroup', ButtonGroupDefault, '[data-slot="button-group-item"]'],
      [
        'SplitButton',
        SplitButtonSizes,
        '[data-testid="split-button__primary"], [data-testid="split-button__toggle-button"]'
      ]
    ])(
      '%s controls side by side never take a tap meant for a neighbour',
      async (_name, component, selector) => {
        await touch()
        const view = await mount(component)
        const controls = Array.from(view.container.querySelectorAll<HTMLElement>(selector))
        expect(controls.length).toBeGreaterThanOrEqual(2)
        for (const control of controls) {
          const width = control.getBoundingClientRect().width
          expect(hitSpan(control, 'x')).toBeLessThanOrEqual(Math.ceil(width) + 1)
          expect(hitSpan(control, 'y')).toBeGreaterThanOrEqual(44)
        }
      }
    )

    it.each([
      ['Tabs', TabsDefault, '[role="tab"]'],
      ['Accordion', AccordionDefault, '[data-testid="accordion-trigger"]'],
      ['FooterLink', FooterDefault, '[data-testid="footer-link"]'],
      ['CodeBlock tab', CodeBlockUnevenTabs, '[role="tab"]'],
      [
        'DocTableOfContents link',
        DocTableOfContentsDefault,
        '[data-testid="doc-table-of-contents"] a'
      ]
    ])('%s rows are 44px tall', async (_name, component, selector) => {
      await touch()
      const view = await mount(component)
      const row = view.container.querySelector<HTMLElement>(selector)!
      expect(row.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
    })

    it('Select and DropdownMenu rows are 44px tall', async () => {
      await touch()
      const select = await mount(SelectDefault)
      await fireEvent.click(select.container.querySelector<HTMLElement>('[role="combobox"]')!)
      await settle()
      const option = document.body.querySelector<HTMLElement>('[role="option"]')!
      expect(option.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
      select.unmount()

      const menu = await mount(DropdownMenuStates)
      await fireEvent.click(menu.container.querySelector<HTMLElement>('button')!)
      await settle()
      const item = document.body.querySelector<HTMLElement>('[role^="menuitem"]')!
      expect(item.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
    })

    it('ConsoleShowcaseSection keeps a large, fluid view switcher on a phone', async () => {
      await touch()
      const view = await mount(ConsoleShowcaseDefault)
      const group = view.container.querySelector<HTMLElement>('[role="radiogroup"]')!
      expect(group.dataset['size']).toBe('large')
      expect(group).toHaveAttribute('data-fluid')
      const option = group.querySelector<HTMLElement>('[role="radio"]')!
      expect(option.getBoundingClientRect().height).toBeGreaterThanOrEqual(28)
      expect(hitSpan(option, 'y')).toBeGreaterThanOrEqual(44)
    })

    it.each([
      ['SettingsGroup disclosure', SettingsGroupCollapsible, 'settings-group__trigger'],
      ['SettingsGroup copy link', SettingsGroupDefault, 'settings-group__copy-link'],
      ['AppHeaderAccount', AppHeaderWithAccount, 'app-header-account'],
      ['Footer home link', FooterDefault, 'footer__home']
    ])('%s answers a tap across 44 x 44', async (_name, component, id) => {
      await touch()
      const view = await mount(component)
      const control = view.container.querySelector<HTMLElement>(`[data-testid="${id}"]`)!
      expect(hitSpan(control, 'y')).toBeGreaterThanOrEqual(44)
      expect(hitSpan(control, 'x')).toBeGreaterThanOrEqual(44)
    })

    it('the AppLayout split-panel separator takes a finger drag across 44px', async () => {
      await touch()
      const view = await mount(AppLayoutDefault)
      const separator = view.container.querySelector<HTMLElement>(
        '[data-testid="app-layout__split-separator"]'
      )!
      expect(getComputedStyle(separator).touchAction).toBe('none')
      expect(hitSpan(separator, 'y')).toBeGreaterThanOrEqual(40)
    })

    const HistoryList = {
      render: () =>
        h(ConversationHistory, {
          items: [
            { id: 'c1', title: 'Purge the cache after a deploy', updatedAt: '2026-11-11T14:20:00' },
            {
              id: 'c2',
              title: 'Why is my function returning 502?',
              updatedAt: '2026-11-11T09:05:00'
            }
          ]
        })
    }

    it.each([
      ['Reasoning', ReasoningDefault, '[data-testid="reasoning__trigger"]'],
      ['ConversationHistory', HistoryList, '[data-slot="conversation-history-item"]']
    ])('%s trigger rows are 44px tall', async (_name, component, selector) => {
      await touch()
      const view = await mount(component)
      const row = view.container.querySelector<HTMLElement>(selector)!
      expect(row.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
    })

    it.each([
      ['Chart', ChartTooltipTotal, 'chart-legend__item'],
      ['DonutChart', DonutChartDefault, 'donut-chart__legend-item']
    ])('%s legend items are 44px tall', async (_name, component, id) => {
      await touch()
      const view = await mount(component)
      const items = await vi.waitFor(() => {
        const found = byTestId(view.container as HTMLElement, id)
        if (found.length < 2) throw new Error('no legend yet')
        return found
      })
      for (const item of items)
        expect(item.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
    })

    it('the ChartCard move handle answers a tap across 44 x 44', async () => {
      await touch()
      const view = await mount(DashboardGridEditing)
      const handle = await vi.waitFor(() => {
        const found = byTestId(view.container as HTMLElement, 'chart-card-drag-handle')[0]
        if (!found) throw new Error('no handle yet')
        return found
      })
      handle.scrollIntoView({ block: 'center' })
      await settle()
      expect(hitSpan(handle, 'x')).toBeGreaterThanOrEqual(44)
      expect(hitSpan(handle, 'y')).toBeGreaterThanOrEqual(44)
    })

    it('the Sources pill answers a tap across 44px', async () => {
      await touch()
      const view = await mount(SourcesDefault)
      const pill = view.container.querySelector<HTMLElement>('[data-testid="sources__trigger"]')!
      expect(hitSpan(pill, 'y')).toBeGreaterThanOrEqual(44)
    })

    it('Citation markers answer a tap across 44px', async () => {
      await touch()
      const view = await mount(CitationDefault)
      const marker = view.container.querySelector<HTMLElement>('[data-testid="citation__chip"]')!
      expect(marker.getBoundingClientRect().height).toBeLessThan(44)
      expect(hitSpan(marker, 'y')).toBeGreaterThanOrEqual(44)
    })

    it.each([
      ['CompetitorComparisonSection', CompetitorComparisonDefault, 'About Unified platform'],
      ['CliTerminalSection', CliTerminalDefault, 'Copy the deploy session'],
      ['ArticleHighlightSection', ArticleHighlightAutoplay, 'Pause rotation'],
      ['ClientQuotesSection', ClientQuotesDefault, 'Pause rotation'],
      ['ClosingCallToActionSection', ClosingAudiences, 'Pause animation']
    ])('%s small icon control answers a 40px tap', async (_name, component, label) => {
      await touch()
      const view = await mount(component)
      const control = await vi.waitFor(
        () => {
          const found = view.container.querySelector<HTMLElement>(`button[aria-label="${label}"]`)
          if (!found) throw new Error(`no ${label} control yet`)
          return found
        },
        { timeout: 3000 }
      )
      control.scrollIntoView({ block: 'center' })
      await settle()
      expect(control.getBoundingClientRect().height).toBeLessThan(40)
      expect(hitSpan(control, 'x')).toBeGreaterThanOrEqual(40)
      expect(hitSpan(control, 'y')).toBeGreaterThanOrEqual(40)
    })

    it('PromptInput shortcut menu rows are 44px tall', async () => {
      await touch()
      const view = await mount(PromptInputShortcutMenus)
      const textarea = view.container.querySelector<HTMLTextAreaElement>('textarea')!
      textarea.focus()
      await fireEvent.update(textarea, '/')
      textarea.setSelectionRange(1, 1)
      await fireEvent.click(textarea)
      await settle()
      const option = document.body.querySelector<HTMLElement>('[role="option"]')!
      expect(option.getBoundingClientRect().height).toBeGreaterThanOrEqual(44)
    })
  })
})
