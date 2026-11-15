import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import RuleBuilder from '../../../../blocks/edit/rule-builder/rule-builder.vue'
import RuleBuilderComposed from '../../../../blocks/edit/rule-builder/variants/composed.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const wait = { timeout: 4000 }

const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null

const buttonIn = (root: Document | HTMLElement, text: string) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement

const restoreOnline = () =>
  Object.defineProperty(globalThis.navigator, 'onLine', { configurable: true, value: true })

afterEach(() => {
  restoreOnline()
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})

const openRuleDrawer = async (label: string) => {
  await userEvent.click(buttonIn(document, label))
  await waitFor(() => expect(dialog()).not.toBeNull())
  return dialog() as HTMLElement
}
describe('rule-builder behaviors', () => {
  it('waits on Add behavior while the last behavior ends the rule', async () => {
    render(RuleBuilder)
    const panel = await openRuleDrawer('Add Rule')
    const behaviors = panel.querySelector('[aria-label="Behaviors"]') as HTMLElement
    expect(behaviors).not.toBeNull()
    expect(buttonIn(panel, 'Add behavior').disabled).toBe(true)
    expect(panel.textContent).toContain('Deliver ends the rule. Nothing after it runs.')
    expect(panel.querySelector('span[role="button"]')).toBeNull()
  })

  it('reorders behaviors through the AttributeEditor controls', async () => {
    render(RuleBuilderComposed)
    const panel = await openRuleDrawer('Edit Rule')
    const behaviors = panel
      .querySelector('[aria-label="Behaviors"]')
      ?.closest('[data-mode]') as HTMLElement
    const placeholders = () =>
      Array.from(behaviors.querySelectorAll<HTMLInputElement>('input[aria-label="Path"]')).map(
        (input) => input.value
      )
    expect(placeholders()).toEqual(['/documentation${uri}'])
    const rows = () => Array.from(behaviors.querySelectorAll('[data-row]'))
    expect(rows()[0].textContent).toContain('Rewrite Request')
    await fireEvent.click(within(behaviors).getByRole('button', { name: 'Move item 2 up' }))
    await waitFor(() => expect(rows()[0].textContent).toContain('Set Cache Policy'))
  })

  it('keeps the drawer open with a danger alert when the save fails', async () => {
    Object.defineProperty(globalThis.navigator, 'onLine', { configurable: true, value: false })
    render(RuleBuilderComposed)
    const panel = await openRuleDrawer('Edit Rule')
    await fireEvent.click(buttonIn(panel, 'Save'))
    await waitFor(
      () =>
        expect(
          panel.querySelector('[data-testid="rule-builder-save-error"]')?.textContent
        ).toContain('Rule not saved.'),
      wait
    )
    expect(dialog()).not.toBeNull()
  })
})
