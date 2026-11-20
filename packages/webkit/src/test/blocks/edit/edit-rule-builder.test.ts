import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import EditRuleBuilder, {
  type RuleBuilderRule
} from '../../../../blocks/edit/edit-rule-builder/edit-rule-builder.vue'
import { sampleRule } from '../../../../blocks/edit/edit-rule-builder/sample'
import RuleBuilderComposed from '../../../../blocks/edit/edit-rule-builder/variants/composed.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const wait = { timeout: 4000 }

const dialog = () => document.querySelector('[role="dialog"]') as HTMLElement | null

const buttonIn = (root: Document | HTMLElement, text: string) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement

afterEach(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})

const openRuleDrawer = async (label: string) => {
  await userEvent.click(buttonIn(document, label))
  await waitFor(() => expect(dialog()).not.toBeNull())
  return dialog() as HTMLElement
}
describe('edit-rule-builder behaviors', () => {
  it('waits on Add behavior while the last behavior ends the rule', async () => {
    render(EditRuleBuilder)
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
    render(EditRuleBuilder, {
      props: { rule: sampleRule, error: 'Rule not saved. You are offline.' }
    })
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

describe('edit-rule-builder data contract', () => {
  const given: RuleBuilderRule = {
    name: 'Block admin',
    description: '',
    phase: 'request',
    criteria: [[{ variable: '${uri}', operator: 'starts-with', argument: '/admin' }]],
    behaviors: [{ type: 'deny' }],
    active: false
  }

  it('opens on the rule it is given', async () => {
    render(EditRuleBuilder, { props: { rule: given, defaultOpen: true } })
    await waitFor(() => expect(dialog()).not.toBeNull())
    const panel = dialog() as HTMLElement
    expect((panel.querySelector('#rule-name') as HTMLInputElement).value).toBe('Block admin')
    expect(panel.textContent).toContain('Edit Rule')
  })

  it('emits submit with the values and closes once loading ends', async () => {
    const { emitted, rerender } = render(EditRuleBuilder, {
      props: {
        rule: given,
        onSubmit: () => {
          void rerender({ rule: given, loading: true })
        }
      }
    })
    const panel = await openRuleDrawer('Edit Rule')
    await fireEvent.click(buttonIn(panel, 'Save'))
    await waitFor(() => expect(emitted().submit).toHaveLength(1))
    const [[event, values]] = emitted().submit as [[Event, RuleBuilderRule]]
    expect(event).toBeInstanceOf(Event)
    expect(values).toEqual(given)
    expect(dialog()).not.toBeNull()
    await rerender({ rule: given, loading: false })
    await waitFor(() => expect(dialog()).toBeNull(), wait)
  })
})
