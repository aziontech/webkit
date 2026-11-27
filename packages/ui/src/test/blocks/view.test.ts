import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import CardError from '../../../blocks/view/view-card/variants/error.vue'
import EventsExplorerError from '../../../blocks/view/view-events-explorer/variants/error.vue'
import FileBrowserError from '../../../blocks/view/view-file-browser/variants/error.vue'
import RulesReview from '../../../blocks/view/view-rule-list/variants/review-changes.vue'
import TableError from '../../../blocks/view/view-table/variants/error.vue'
import TemplateBrowserError from '../../../blocks/view/view-template-browser/variants/error.vue'
import WafAllow from '../../../blocks/view/view-waf-tuning/variants/allow.vue'
import { expectNoA11yViolations } from '../axe'
import { useToastRegion } from '../toast-region'

useToastRegion()

const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null

const buttonIn = (root: HTMLElement, text: string) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement
describe('open dialogs of the firewall-rules blocks', () => {
  it('view-rule-list review dialog has no axe violations', async () => {
    render(RulesReview)
    await waitFor(() => expect(dialog()).not.toBeNull())
    await expectNoA11yViolations(dialog() as HTMLElement)
  })

  it('view-waf-tuning allow dialog flags the empty reason only after Allow rules, then has no axe violations', async () => {
    render(WafAllow)
    await waitFor(() => expect(dialog()).not.toBeNull())
    const panel = dialog() as HTMLElement
    expect(panel.textContent).toContain('Allow 2 rules')
    expect(panel.textContent).toContain('6 in all')
    expect(panel.textContent).not.toContain('Enter why these requests are legitimate.')
    await fireEvent.click(buttonIn(panel, 'Allow rules'))
    await waitFor(() =>
      expect(panel.textContent).toContain('Enter why these requests are legitimate.')
    )
    await waitFor(() => expect(document.activeElement?.tagName).toBe('TEXTAREA'))
    await expectNoA11yViolations(panel)
  })
})

describe('the load-error state of the view blocks', () => {
  const disabledControl = (el: Element) =>
    (el as HTMLInputElement).disabled || el.getAttribute('aria-disabled') === 'true'

  it.each([
    ['view-table', TableError, 'Filter resources'],
    ['view-card', CardError, 'Filter applications'],
    ['view-template-browser', TemplateBrowserError, 'Search templates'],
    ['view-file-browser', FileBrowserError, 'Search the table'],
    ['view-events-explorer', EventsExplorerError, 'Search events']
  ])(
    '%s keeps its filter in place and disabled, Download CSV disabled and Refresh live',
    async (_name, variant, filter) => {
      const view = render(variant)
      const field = await waitFor(() => {
        const found = view.container.querySelector(`[aria-label="${filter}"]`)
        expect(found).not.toBeNull()
        return found as Element
      })
      const control = field.matches('input, textarea') ? field : field.querySelector('input')
      expect(disabledControl(control ?? field)).toBe(true)
      const download = view.queryByRole('button', { name: 'Download CSV' })
      if (download) expect(disabledControl(download)).toBe(true)
      const refresh = view.queryByRole('button', { name: 'Refresh' })
      if (refresh) expect(disabledControl(refresh)).toBe(false)
    }
  )
})
