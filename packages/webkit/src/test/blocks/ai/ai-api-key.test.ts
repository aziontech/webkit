import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import AiApiKey from '../../../../blocks/ai/ai-api-key/ai-api-key.vue'
import Empty from '../../../../blocks/ai/ai-api-key/variants/empty.vue'
import ErrorVariant from '../../../../blocks/ai/ai-api-key/variants/error.vue'
import SaveError from '../../../../blocks/ai/ai-api-key/variants/save-error.vue'
import Saving from '../../../../blocks/ai/ai-api-key/variants/saving.vue'
import Testing from '../../../../blocks/ai/ai-api-key/variants/testing.vue'
import { expectNoA11yViolations } from '../../axe'

const providers = [
  { value: 'openai', label: 'OpenAI' },
  { value: 'anthropic', label: 'Anthropic' }
]

const dialog = () =>
  document.querySelector('[role="dialog"], [role="alertdialog"]') as HTMLElement | null

const keyField = (root: Element) =>
  root.querySelector('input[aria-label="API key"]') as HTMLInputElement

const statusRegion = (root: Element) => root.querySelector('[role="status"]') as HTMLElement

describe('ai/ai-api-key', () => {
  it('renders the sample: OpenAI saved, only the masked tail, an empty key field', async () => {
    const view = render(AiApiKey)
    expect(view.getByRole('heading', { level: 1, name: 'Model provider keys' })).toBeTruthy()
    expect(view.getByRole('heading', { level: 2, name: 'Connection' })).toBeTruthy()
    expect(view.getByRole('combobox', { name: 'Provider' }).textContent).toContain('OpenAI')
    const field = keyField(view.container)
    expect(field.value).toBe('')
    expect(field.type).toBe('password')
    expect(field.getAttribute('placeholder')).toBe('Paste a new key to replace ••••3f9a')
    expect(field.getAttribute('autocomplete')).toBe('off')
    const replace = view.getByRole('button', { name: 'Replace key' })
    expect(replace.getAttribute('data-variant')).toBe('outline')
    expect(view.queryByRole('button', { name: 'Save key' })).toBeNull()
    await userEvent.type(field, 'sk-new')
    await waitFor(() => expect(replace.getAttribute('data-variant')).toBe('primary'))
    await userEvent.clear(field)
    const note = document.getElementById(field.getAttribute('aria-describedby')!)
    expect(note?.textContent).toContain('Saved in this browser only')
    const status = statusRegion(view.container)
    expect(status.textContent).toContain('Saved')
    const tail = status.querySelector('bdi')!
    expect(tail.textContent).toBe('••••3f9a')
    expect(tail.getAttribute('dir')).toBe('ltr')
    expect(view.getByRole('button', { name: 'Test connection' })).toBeTruthy()
    expect(view.getByRole('button', { name: 'Remove key' })).toBeTruthy()
    await expectNoA11yViolations(view.container)
  })

  it('does not save an empty field: marks it invalid, explains and focuses it', async () => {
    const view = render(AiApiKey, { props: { providers, savedKeys: [] } })
    await fireEvent.click(view.getByRole('button', { name: 'Save key' }))
    const field = keyField(view.container)
    await waitFor(() => expect(document.activeElement).toBe(field))
    expect(field.getAttribute('aria-invalid')).toBe('true')
    expect(view.container.textContent).toContain('Enter an API key.')
    const described = field.getAttribute('aria-describedby')!.split(' ')
    expect(described.map((id) => document.getElementById(id)?.textContent).join(' ')).toContain(
      'Enter an API key.'
    )
    expect(view.emitted('save')).toBeUndefined()
    await userEvent.type(field, 'x')
    await waitFor(() => expect(field.getAttribute('aria-invalid')).toBeNull())
  })

  it('emits save with the provider and the trimmed key, then clears and focuses the field', async () => {
    const view = render(AiApiKey, { props: { providers, savedKeys: [] } })
    const field = keyField(view.container)
    await userEvent.type(field, '  not-a-real-key  ')
    await fireEvent.click(view.getByRole('button', { name: 'Save key' }))
    const [event, value] = view.emitted<unknown[]>('save')![0]
    expect(event).toBeInstanceOf(Event)
    expect(value).toEqual({ provider: 'openai', key: 'not-a-real-key' })
    expect(field.value).toBe('  not-a-real-key  ')
    await view.rerender({ providers, savedKeys: [{ provider: 'openai', masked: '••••0000' }] })
    await waitFor(() => expect(field.value).toBe(''))
    await waitFor(() => expect(document.activeElement).toBe(field))
    expect(statusRegion(view.container).textContent).toContain('••••0000')
  })

  it('shows only Save key when no key is saved', async () => {
    const view = render(Empty)
    expect(keyField(view.container).getAttribute('placeholder') ?? '').toBe('')
    expect(statusRegion(view.container).textContent).toContain('No key saved')
    expect(view.queryByRole('button', { name: 'Test connection' })).toBeNull()
    expect(view.queryByRole('button', { name: 'Remove key' })).toBeNull()
    expect(view.getByRole('button', { name: 'Save key' })).not.toBeDisabled()
    await expectNoA11yViolations(view.container)
  })

  it('emits test for the picked provider', async () => {
    const view = render(AiApiKey)
    await fireEvent.click(view.getByRole('button', { name: 'Test connection' }))
    const [event, provider] = view.emitted<unknown[]>('test')![0]
    expect(event).toBeInstanceOf(MouseEvent)
    expect(provider).toBe('openai')
  })

  it('locks Remove key and the Provider while a test runs, and keeps Replace key', async () => {
    const view = render(Testing)
    expect(statusRegion(view.container).textContent).toContain('Testing')
    const test = view.getByRole('button', { name: /Test connection/ })
    expect(test.getAttribute('aria-busy')).toBe('true')
    expect(view.getByRole('button', { name: 'Remove key' })).toBeDisabled()
    expect(view.getByRole('combobox', { name: 'Provider' })).toBeDisabled()
    expect(view.getByRole('button', { name: 'Replace key' })).not.toBeDisabled()
  })

  it('locks the controls while saving and keeps Save key focusable', async () => {
    const view = render(Saving)
    const save = view.getByRole('button', { name: /Replace key/ })
    expect(save.getAttribute('aria-busy')).toBe('true')
    expect(save.hasAttribute('disabled')).toBe(false)
    expect(keyField(view.container)).toBeDisabled()
    expect(view.getByRole('combobox', { name: 'Provider' })).toBeDisabled()
    expect(view.getByRole('button', { name: 'Test connection' })).toBeDisabled()
    expect(view.getByRole('button', { name: 'Remove key' })).toBeDisabled()
  })

  it('shows a failed test in a danger alert with Test again', async () => {
    const variant = render(ErrorVariant)
    expect(statusRegion(variant.container).textContent).toContain('Connection failed')
    await expectNoA11yViolations(variant.container)
    variant.unmount()
    const view = render(AiApiKey, {
      props: { status: 'error', error: 'The provider refused the key.' }
    })
    const alert = view.getByRole('alert')
    expect(alert.textContent).toContain("The key didn't work.")
    expect(alert.textContent).toContain('The provider refused the key.')
    await fireEvent.click(within(alert).getByRole('button', { name: 'Test again' }))
    expect(view.emitted<unknown[]>('test')![0][1]).toBe('openai')
  })

  it('shows a failed save with no action', async () => {
    const view = render(SaveError)
    const alert = view.getByRole('alert')
    expect(alert.textContent).toContain("The key wasn't saved.")
    expect(within(alert).queryByRole('button', { name: 'Test again' })).toBeNull()
    expect(statusRegion(view.container).textContent).toContain('Saved')
  })

  it('asks before removing, emits remove and moves focus to the key field once it is gone', async () => {
    const view = render(AiApiKey, {
      props: { providers, savedKeys: [{ provider: 'openai', masked: '••••3f9a' }] }
    })
    await fireEvent.click(view.getByRole('button', { name: 'Remove key' }))
    await waitFor(() => expect(dialog()).not.toBeNull())
    expect(dialog()!.textContent).toContain('Remove the OpenAI key?')
    const confirm = Array.from(dialog()!.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Remove key'
    ) as HTMLButtonElement
    await fireEvent.click(confirm)
    const [event, provider] = view.emitted<unknown[]>('remove')![0]
    expect(event).toBeInstanceOf(MouseEvent)
    expect(provider).toBe('openai')
    await waitFor(() => expect(dialog()).toBeNull())
    await view.rerender({ providers, savedKeys: [] })
    await waitFor(() => expect(document.activeElement).toBe(keyField(view.container)))
    expect(statusRegion(view.container).textContent).toContain('No key saved')
  })

  it('switches the provider through the Select and reports it with update:provider', async () => {
    const view = render(AiApiKey, {
      props: { providers, savedKeys: [{ provider: 'openai', masked: '••••3f9a' }] }
    })
    await userEvent.click(view.getByRole('combobox', { name: 'Provider' }))
    const option = await waitFor(() => {
      const found = Array.from(document.querySelectorAll('[role="option"]')).find(
        (node) => node.textContent?.trim() === 'Anthropic'
      )
      if (!found) throw new Error('no option')
      return found as HTMLElement
    })
    await userEvent.click(option)
    await waitFor(() => expect(view.emitted('update:provider')).toEqual([['anthropic']]))
    await waitFor(() => expect(statusRegion(view.container).textContent).toContain('No key saved'))
    expect(view.queryByRole('button', { name: 'Remove key' })).toBeNull()
  })
})
