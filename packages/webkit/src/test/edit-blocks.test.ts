import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import AttributeEditorList from '../../blocks/platform/edit/attribute-editor/attribute-editor.vue'
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
