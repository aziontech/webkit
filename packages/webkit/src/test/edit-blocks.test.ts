import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import AttributeEditorList from '../../blocks/platform/edit/attribute-editor/attribute-editor.vue'
import CodeEditorArguments from '../../blocks/platform/edit/code-editor/variants/arguments.vue'
import CodeEditorSaving from '../../blocks/platform/edit/code-editor/variants/saving.vue'
import EditResource from '../../blocks/platform/edit/edit-resource/edit-resource.vue'
import DangerZone from '../../blocks/platform/edit/edit-resource/variants/danger-zone.vue'
import StaleRecord from '../../blocks/platform/edit/edit-resource/variants/stale-record.vue'
import RuleBuilder from '../../blocks/platform/edit/rule-builder/rule-builder.vue'
import RuleBuilderComposed from '../../blocks/platform/edit/rule-builder/variants/composed.vue'
import { useToastRegion } from './toast-region'

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

const openCreate = async () => {
  await userEvent.click(buttonIn(document, 'Create Variable'))
  await waitFor(() => expect(dialog()).not.toBeNull())
  const panel = dialog() as HTMLElement
  const [key, value] = Array.from(
    panel.querySelectorAll<HTMLInputElement>('input[id*="-key-"], input[id*="-value-"]')
  )
  return { panel, key, value }
}

describe('attribute-editor#List', () => {
  it('draws the key and value fields with InputGroupInput and uppercases the key', async () => {
    render(AttributeEditorList)
    const { key, value } = await openCreate()
    expect(key.dataset.testid).toBe('input-group-input')
    expect(value.dataset.testid).toBe('input-group-input')
    await userEvent.type(key, 'new key')
    expect(key.value).toBe('NEW_KEY')
  })

  it('raises a success toast after creating a variable', async () => {
    render(AttributeEditorList)
    const { panel, key, value } = await openCreate()
    await userEvent.type(key, 'NEW_KEY')
    await userEvent.type(value, 'on')
    await fireEvent.click(buttonIn(panel, 'Save'))
    await waitFor(() => expect(document.body.textContent).toContain('NEW_KEY created.'), wait)
    await waitFor(() => expect(dialog()).toBeNull(), wait)
  })

  it('keeps the drawer open with a danger alert when the save fails', async () => {
    Object.defineProperty(globalThis.navigator, 'onLine', { configurable: true, value: false })
    render(AttributeEditorList)
    const { panel, key, value } = await openCreate()
    await userEvent.type(key, 'NEW_KEY')
    await userEvent.type(value, 'on')
    await fireEvent.click(buttonIn(panel, 'Save'))
    await waitFor(
      () =>
        expect(panel.querySelector('[data-testid="variables-save-error"]')?.textContent).toContain(
          'Variables not saved.'
        ),
      wait
    )
    expect(dialog()).not.toBeNull()
    expect(key.value).toBe('NEW_KEY')
  })
})

describe('edit-resource locked modules', () => {
  it.each([
    ['primary', EditResource],
    ['StaleRecord', StaleRecord],
    ['DangerZone', DangerZone]
  ])('%s links Contact sales through the Link component in a new tab', (_name, block) => {
    const view = render(block)
    const links = Array.from(
      view.container.querySelectorAll<HTMLAnchorElement>(
        'a[href="https://example.com/contact-sales"]'
      )
    )
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(link.dataset.testid).toBe('navigation-link')
      expect(link.target).toBe('_blank')
      expect(link.rel).toContain('noopener')
    }
  })
})

describe('code-editor#Arguments', () => {
  it('reorders fields with native Move buttons and announces the move', async () => {
    const view = render(CodeEditorArguments)
    const up = view.getByRole('button', { name: 'Move quality up' })
    expect(up.tagName).toBe('BUTTON')
    expect(
      (view.getByRole('button', { name: 'Move defaultFormat up' }) as HTMLButtonElement).disabled
    ).toBe(true)
    await userEvent.click(up)
    await waitFor(() =>
      expect(view.container.textContent).toContain('quality moved to position 1 of 2.')
    )
    expect(view.container.querySelector('[role="button"]')).toBeNull()
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label')).toBe('Move quality down')
    )
  })

  it('shows Save loading, then a success toast', async () => {
    const view = render(CodeEditorArguments)
    await userEvent.click(view.getByRole('button', { name: 'Move quality up' }))
    const save = await waitFor(() => buttonIn(document, 'Save'))
    await fireEvent.click(save)
    await waitFor(() => expect(buttonIn(document, 'Discard').disabled).toBe(true))
    await waitFor(() => expect(document.body.textContent).toContain('image-optimizer saved.'), wait)
  })

  it('keeps the bar with a danger alert when the save fails', async () => {
    Object.defineProperty(globalThis.navigator, 'onLine', { configurable: true, value: false })
    const view = render(CodeEditorArguments)
    await userEvent.click(view.getByRole('button', { name: 'Move quality up' }))
    await fireEvent.click(await waitFor(() => buttonIn(document, 'Save')))
    await waitFor(
      () =>
        expect(
          document.querySelector('[data-testid="code-editor-save-error"]')?.textContent
        ).toContain('Not saved.'),
      wait
    )
    expect(buttonIn(document, 'Discard').disabled).toBe(false)
  })
})

describe('code-editor#Saving', () => {
  it('holds Save in its loading state with Discard disabled', async () => {
    render(CodeEditorSaving)
    await waitFor(() => expect(buttonIn(document, 'Discard').disabled).toBe(true))
    expect(buttonIn(document, 'Save').getAttribute('aria-busy')).toBe('true')
  })
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
