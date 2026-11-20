import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import EditFunction, {
  type FunctionEditorValues
} from '../../../../blocks/edit/edit-function/edit-function.vue'
import FunctionEditorArguments from '../../../../blocks/edit/edit-function/variants/arguments.vue'
import FunctionEditorSaving from '../../../../blocks/edit/edit-function/variants/saving.vue'
import FunctionEditorTestRun from '../../../../blocks/edit/edit-function/variants/test-run.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const wait = { timeout: 4000 }

const visibleText = (element: HTMLElement) => {
  const copy = element.cloneNode(true) as HTMLElement
  copy.querySelectorAll('[aria-hidden="true"]').forEach((node) => node.remove())
  return copy.textContent?.trim()
}

const buttonIn = (root: Document | HTMLElement, text: string) =>
  Array.from(root.querySelectorAll('button')).find(
    (button) => visibleText(button) === text
  ) as HTMLButtonElement

afterEach(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
})
describe('edit-function#Arguments', () => {
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

  const argumentsProps = { document: 'arguments' as const, defaultOpenKeys: ['field-1'] }

  it('emits submit with the values, then toasts when loading ends', async () => {
    const view = render(EditFunction, { props: argumentsProps })
    await userEvent.click(view.getByRole('button', { name: 'Move quality up' }))
    await fireEvent.click(await waitFor(() => buttonIn(document, 'Save')))
    const emitted = view.emitted<unknown[]>('submit') as [Event, FunctionEditorValues][]
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
    const view = render(EditFunction, { props: argumentsProps })
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
    expect(view.emitted<unknown[]>('discard')).toHaveLength(1)
  })
})

describe('edit-function data contract', () => {
  it('renders the service and fields it is given instead of the sample', async () => {
    const view = render(EditFunction, {
      props: {
        document: 'arguments',
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

  it('asks before Remove form wipes the fields', async () => {
    const view = render(FunctionEditorArguments)
    await userEvent.click(view.getByRole('button', { name: 'Remove form' }))
    const dialog = await waitFor(() => {
      const found = document.querySelector<HTMLElement>('[role="alertdialog"]')
      expect(found).toBeTruthy()
      return found!
    }, wait)
    expect(view.container.textContent).toContain('2 fields')
    await userEvent.click(buttonIn(dialog, 'Cancel'))
    await waitFor(() => expect(document.querySelector('[role="alertdialog"]')).toBeNull(), wait)
    expect(view.container.textContent).toContain('2 fields')
    await userEvent.click(view.getByRole('button', { name: 'Remove form' }))
    const again = await waitFor(() => {
      const found = document.querySelector<HTMLElement>('[role="alertdialog"]')
      expect(found).toBeTruthy()
      return found!
    }, wait)
    await userEvent.click(buttonIn(again, 'Remove form'))
    await waitFor(
      () => expect(view.container.textContent).toContain('This form has no fields'),
      wait
    )
  })

  it('shows the empty form state for fields []', async () => {
    const view = render(EditFunction, { props: { document: 'arguments', fields: [] } })
    await waitFor(() => expect(view.container.textContent).toContain('This form has no fields'))
  })
})

describe('edit-function#Saving', () => {
  it('holds Save in its loading state with Discard disabled', async () => {
    render(FunctionEditorSaving)
    await waitFor(() => expect(buttonIn(document, 'Discard').disabled).toBe(true))
    expect(buttonIn(document, 'Save').getAttribute('aria-busy')).toBe('true')
  })
})

const apple = /mac/i.test(navigator.platform || navigator.userAgent)
const pressShortcut = (key: string, target: Element = document.body) => {
  const event = new KeyboardEvent('keydown', {
    key,
    metaKey: apple,
    ctrlKey: !apple,
    bubbles: true,
    cancelable: true
  })
  target.dispatchEvent(event)
  return event
}

describe('edit-function keyboard', () => {
  const argumentsProps = { document: 'arguments' as const, defaultOpenKeys: ['field-1'] }

  it('saves on Command S only while the function has changes', async () => {
    const view = render(EditFunction, { props: argumentsProps })
    expect(pressShortcut('s').defaultPrevented).toBe(false)
    expect(view.emitted('submit')).toBeUndefined()
    await userEvent.click(view.getByRole('button', { name: 'Move quality up' }))
    const save = await waitFor(() => buttonIn(document, 'Save'))
    expect(save.getAttribute('aria-keyshortcuts')).toBe('Meta+S Control+S')
    expect(save.querySelector('[data-testid="kbd"]')).not.toBeNull()
    const event = pressShortcut('s')
    expect(event.defaultPrevented).toBe(true)
    const emitted = view.emitted<unknown[]>('submit') as [Event, FunctionEditorValues][]
    expect(emitted).toHaveLength(1)
    expect(emitted[0]![0]).toBe(event)
  })

  it('runs the test on Command Enter in the Test run variant', async () => {
    const view = render(FunctionEditorTestRun)
    const run = view.getByRole('button', { name: 'Run test' })
    expect(run.getAttribute('aria-keyshortcuts')).toBe('Meta+Enter Control+Enter')
    expect(run.getAttribute('aria-busy')).not.toBe('true')
    expect(pressShortcut('Enter').defaultPrevented).toBe(true)
    await waitFor(() => expect(run.getAttribute('aria-busy')).toBe('true'))
  })
})

describe('edit-function#TestRun', () => {
  it('renders the block with the test run pane under the editor and saves through it', async () => {
    const view = render(FunctionEditorTestRun)
    expect(view.getByRole('group', { name: 'Code and test run' })).toBeTruthy()
    expect(view.getByRole('group', { name: 'Source code' })).toBeTruthy()
    expect(view.getByRole('heading', { name: 'Test run' })).toBeTruthy()
    await userEvent.click(view.getByRole('tab', { name: 'Settings' }))
    expect(pressShortcut('Enter').defaultPrevented).toBe(false)
    const name = document.getElementById('service-name') as HTMLInputElement
    await userEvent.type(name, '-v2')
    await fireEvent.click(await waitFor(() => buttonIn(document, 'Save')))
    await waitFor(
      () => expect(document.body.textContent).toContain('image-optimizer-v2 saved.'),
      wait
    )
  })

  it('leaves the plain block without the split', () => {
    const view = render(EditFunction)
    expect(view.queryByRole('group', { name: 'Code and test run' })).toBeNull()
  })
})
