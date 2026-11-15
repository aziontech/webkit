import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import RulesReview from '../../../blocks/view/rule-list/variants/review-changes.vue'
import WafAllow from '../../../blocks/view/waf-tuning/variants/allow.vue'
import { expectNoA11yViolations } from '../axe'
import { useToastRegion } from '../toast-region'

useToastRegion()

const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null

const buttonIn = (root: HTMLElement, text: string) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement
describe('open dialogs of the firewall-rules blocks', () => {
  it('rule-list review dialog has no axe violations', async () => {
    render(RulesReview)
    await waitFor(() => expect(dialog()).not.toBeNull())
    await expectNoA11yViolations(dialog() as HTMLElement)
  })

  it('waf-tuning allow dialog flags the empty reason only after Allow rules, then has no axe violations', async () => {
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
