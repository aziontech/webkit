import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import FunctionEditorArguments from '../../../../blocks/edit/function-editor/variants/arguments.vue'
import FunctionEditorSaving from '../../../../blocks/edit/function-editor/variants/saving.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const wait = { timeout: 4000 }

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
describe('function-editor#Arguments', () => {
  it('reorders fields with native Move buttons and announces the move', async () => {
    const view = render(FunctionEditorArguments)
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
    const view = render(FunctionEditorArguments)
    await userEvent.click(view.getByRole('button', { name: 'Move quality up' }))
    const save = await waitFor(() => buttonIn(document, 'Save'))
    await fireEvent.click(save)
    await waitFor(() => expect(buttonIn(document, 'Discard').disabled).toBe(true))
    await waitFor(() => expect(document.body.textContent).toContain('image-optimizer saved.'), wait)
  })

  it('keeps the bar with a danger alert when the save fails', async () => {
    Object.defineProperty(globalThis.navigator, 'onLine', { configurable: true, value: false })
    const view = render(FunctionEditorArguments)
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

describe('function-editor#Saving', () => {
  it('holds Save in its loading state with Discard disabled', async () => {
    render(FunctionEditorSaving)
    await waitFor(() => expect(buttonIn(document, 'Discard').disabled).toBe(true))
    expect(buttonIn(document, 'Save').getAttribute('aria-busy')).toBe('true')
  })
})
