import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import FunctionEditor, {
  type FunctionEditorValues
} from '../../../../blocks/edit/function-editor/function-editor.vue'
import FunctionEditorArguments from '../../../../blocks/edit/function-editor/variants/arguments.vue'
import FunctionEditorSaving from '../../../../blocks/edit/function-editor/variants/saving.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const wait = { timeout: 4000 }

const buttonIn = (root: Document | HTMLElement, text: string) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === text
  ) as HTMLButtonElement

afterEach(() => {
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

  const argumentsProps = { defaultDocument: 'arguments', defaultExpanded: ['field-1'] } as const

  it('emits submit with the values, then toasts when loading ends', async () => {
    const view = render(FunctionEditor, { props: argumentsProps })
    await userEvent.click(view.getByRole('button', { name: 'Move quality up' }))
    await fireEvent.click(await waitFor(() => buttonIn(document, 'Save')))
    const emitted = view.emitted('submit') as [Event, FunctionEditorValues][]
    expect(emitted).toHaveLength(1)
    expect(emitted[0][0]).toBeInstanceOf(Event)
    expect(emitted[0][1].name).toBe('image-optimizer')
    expect(emitted[0][1].fields.map((field) => field.key)).toEqual(['quality', 'defaultFormat'])
    await view.rerender({ loading: true })
    await waitFor(() => expect(buttonIn(document, 'Discard').disabled).toBe(true))
    await view.rerender({ loading: false })
    await waitFor(() => expect(document.body.textContent).toContain('image-optimizer saved.'), wait)
  })

  it('keeps the bar with a danger alert when the save fails', async () => {
    const view = render(FunctionEditor, { props: argumentsProps })
    await userEvent.click(view.getByRole('button', { name: 'Move quality up' }))
    await fireEvent.click(await waitFor(() => buttonIn(document, 'Save')))
    await view.rerender({ loading: true })
    await view.rerender({
      loading: false,
      error: 'Not saved. You are offline; check your connection and save again.'
    })
    await waitFor(
      () =>
        expect(
          document.querySelector('[data-testid="code-editor-save-error"]')?.textContent
        ).toContain('Not saved.'),
      wait
    )
    expect(buttonIn(document, 'Discard').disabled).toBe(false)
    await fireEvent.click(buttonIn(document, 'Discard'))
    expect(view.emitted('discard')).toHaveLength(1)
  })
})

describe('function-editor data contract', () => {
  it('renders the service and fields it is given instead of the sample', async () => {
    const view = render(FunctionEditor, {
      props: {
        defaultDocument: 'arguments',
        service: {
          name: 'acme-router',
          executionEnvironment: 'gateway',
          active: false,
          code: 'export default () => fetch(request)',
          schema: '{}'
        },
        fields: [
          {
            id: 'region',
            key: 'region',
            type: 'string',
            title: 'Region',
            description: '',
            required: false,
            default: '',
            minLength: '',
            maxLength: '',
            pattern: '',
            minimum: '',
            maximum: '',
            options: [],
            itemType: 'string'
          }
        ]
      }
    })
    await waitFor(() => expect(view.getByRole('button', { name: 'Move region up' })).toBeTruthy())
    expect(view.queryByRole('button', { name: 'Move quality up' })).toBeNull()
    expect(view.container.textContent).toContain('1 field')
  })

  it('shows the empty form state for fields []', async () => {
    const view = render(FunctionEditor, { props: { defaultDocument: 'arguments', fields: [] } })
    await waitFor(() => expect(view.container.textContent).toContain('This form has no fields'))
  })
})

describe('function-editor#Saving', () => {
  it('holds Save in its loading state with Discard disabled', async () => {
    render(FunctionEditorSaving)
    await waitFor(() => expect(buttonIn(document, 'Discard').disabled).toBe(true))
    expect(buttonIn(document, 'Save').getAttribute('aria-busy')).toBe('true')
  })
})
