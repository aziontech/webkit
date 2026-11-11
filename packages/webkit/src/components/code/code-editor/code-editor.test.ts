import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/code-editor/default.vue'
import Diff from '../../../../examples/code-editor/diff.vue'
import ReadOnly from '../../../../examples/code-editor/read-only.vue'
import WithToolbar from '../../../../examples/code-editor/with-toolbar.vue'
import { BUILT_IN_CATALOGS, provideLocale } from '../../../composables/use-locale'
import { expectNoA11yViolations } from '../../../test/axe'
import Field from '../../inputs/field/field.vue'
import FieldDescription from '../../inputs/field/field-description/field-description.vue'
import FieldLabel from '../../inputs/field/field-label/field-label.vue'
import CodeEditor from './code-editor.vue'
import type { CodeEditorMonaco, CodeEditorMonacoModel } from './monaco'

const fakeMonaco = () => {
  const calls = {
    themes: [] as { name: string; theme: { base: string; colors: Record<string, string> } }[],
    markers: [] as object[][],
    options: [] as Record<string, unknown>[],
    disposed: 0
  }
  const makeModel = (initial: string): CodeEditorMonacoModel & { emit: () => void } => {
    let value = initial
    const listeners: ((event: unknown) => void)[] = []
    return {
      getValue: () => value,
      setValue: (next: string) => {
        value = next
        listeners.forEach((listener) => listener({}))
      },
      onDidChangeContent: (listener) => {
        listeners.push(listener)
        return { dispose: () => listeners.splice(listeners.indexOf(listener), 1) }
      },
      getLineMaxColumn: () => 10,
      dispose: () => {
        calls.disposed += 1
      },
      emit: () => listeners.forEach((listener) => listener({}))
    }
  }
  const models: ReturnType<typeof makeModel>[] = []
  const makeEditor = (options: Record<string, unknown>) => {
    calls.options.push(options)
    return {
      getModel: () => (options['model'] as CodeEditorMonacoModel) ?? null,
      setModel: vi.fn(),
      updateOptions: (next: Record<string, unknown>) => calls.options.push(next),
      focus: vi.fn(),
      setPosition: vi.fn(),
      revealLineInCenter: vi.fn(),
      dispose: () => {
        calls.disposed += 1
      }
    }
  }
  const editors: ReturnType<typeof makeEditor>[] = []
  const api: CodeEditorMonaco = {
    editor: {
      create: (_el, options = {}) => {
        const editor = makeEditor(options)
        editors.push(editor)
        return editor
      },
      createDiffEditor: (_el, options = {}) => {
        const modified = makeEditor(options)
        editors.push(modified)
        return {
          setModel: vi.fn(),
          getModifiedEditor: () => modified,
          updateOptions: vi.fn(),
          dispose: () => {
            calls.disposed += 1
          }
        }
      },
      createModel: (value) => {
        const model = makeModel(value)
        models.push(model)
        return model
      },
      defineTheme: (name, theme) => calls.themes.push({ name, theme }),
      setTheme: vi.fn(),
      setModelMarkers: (_model, _owner, markers) => calls.markers.push(markers)
    },
    MarkerSeverity: { Error: 8, Warning: 4, Info: 2 }
  }
  return { api, calls, models, editors }
}

const textarea = (container: Element) =>
  container.querySelector<HTMLTextAreaElement>('[data-testid="code-code-editor__input"]')!

describe('CodeEditor', () => {
  it('renders the plain editor with a gutter and updates v-model', async () => {
    const view = render(CodeEditor, {
      props: { modelValue: 'one\ntwo\nthree', ariaLabel: 'Script' }
    })
    const root = view.getByTestId('code-code-editor')
    expect(root.getAttribute('data-mode')).toBe('plain')
    expect(view.getByTestId('code-code-editor__gutter').querySelectorAll('li')).toHaveLength(3)
    const input = view.getByRole('textbox', { name: 'Script' })
    await fireEvent.update(input, 'one\ntwo')
    expect(view.emitted()['update:modelValue']?.at(-1)).toEqual(['one\ntwo'])
  })

  it('indents with Tab, outdents with Shift+Tab and lets Escape then Tab leave', async () => {
    const value = ref('a\nb')
    const view = render(
      defineComponent({
        setup: () => () =>
          h(CodeEditor, {
            modelValue: value.value,
            'onUpdate:modelValue': (next: string) => (value.value = next),
            ariaLabel: 'Code'
          })
      })
    )
    const input = textarea(view.container)
    input.focus()
    input.setSelectionRange(0, 0)
    await fireEvent.keyDown(input, { key: 'Tab' })
    expect(value.value).toBe('  a\nb')
    input.setSelectionRange(0, input.value.length)
    await fireEvent.keyDown(input, { key: 'Tab' })
    expect(value.value).toBe('    a\n  b')
    await fireEvent.keyDown(input, { key: 'Tab', shiftKey: true })
    expect(value.value).toBe('  a\nb')
    await fireEvent.keyDown(input, { key: 'Escape' })
    const escaped = await fireEvent.keyDown(input, { key: 'Tab' })
    expect(escaped).toBe(true)
    expect(value.value).toBe('  a\nb')
  })

  it('does not trap Tab when read-only', async () => {
    const view = render(CodeEditor, { props: { modelValue: 'x', readonly: true, ariaLabel: 'Q' } })
    const input = textarea(view.container)
    expect(input.readOnly).toBe(true)
    expect(await fireEvent.keyDown(input, { key: 'Tab' })).toBe(true)
  })

  it('paints markers on their lines, lists them and moves the caret to one', async () => {
    const view = render(CodeEditor, {
      props: {
        modelValue: 'a\nbb\nccc',
        ariaLabel: 'Code',
        markers: [
          { line: 3, column: 2, severity: 'error', message: 'Broken' },
          { line: 2, severity: 'warning', message: 'Careful' }
        ]
      }
    })
    const lines = view.getByTestId('code-code-editor__gutter').querySelectorAll('li')
    expect(lines[1]?.getAttribute('data-severity')).toBe('warning')
    expect(lines[2]?.getAttribute('data-severity')).toBe('error')
    expect(view.getByRole('status').textContent?.trim()).toBe('2 problems')
    const problems = view.getAllByTestId('code-code-editor__problem')
    expect(problems.map((p) => p.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      'Warning: Line 2 Careful',
      'Error: Line 3 Broken'
    ])
    await fireEvent.click(problems[1] as HTMLElement)
    const input = textarea(view.container)
    expect(document.activeElement).toBe(input)
    expect(input.selectionStart).toBe('a\nbb\n'.length + 1)
    expect(input.getAttribute('aria-describedby')).toContain(
      view.getByRole('status').getAttribute('id')
    )
  })

  it('renders the original and modified panes in diff mode', () => {
    const view = render(CodeEditor, {
      props: { modelValue: 'b', original: 'a', diff: true }
    })
    expect(view.getByRole('textbox', { name: 'Original' }).getAttribute('readonly')).not.toBeNull()
    expect(view.getByRole('textbox', { name: 'Modified' })).toBeTruthy()
  })

  it('takes the id and description from attrs and paints invalid', () => {
    const view = render(CodeEditor, {
      props: { modelValue: '', invalid: true },
      attrs: { id: 'code', 'aria-describedby': 'help' }
    })
    const input = textarea(view.container)
    expect(input.id).toBe('code')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(input.getAttribute('aria-describedby')?.split(' ')[0]).toBe('help')
    expect(view.getByTestId('code-code-editor').hasAttribute('data-invalid')).toBe(true)
  })

  it('mounts Monaco from the loader with a token theme and syncs value and markers', async () => {
    const fake = fakeMonaco()
    const onReady = vi.fn()
    const value = ref('let a = 1')
    const markers = ref([{ line: 1, severity: 'error' as const, message: 'Nope' }])
    const view = render(
      defineComponent({
        setup: () => () =>
          h(CodeEditor, {
            modelValue: value.value,
            'onUpdate:modelValue': (next: string) => (value.value = next),
            loader: () => Promise.resolve({ default: fake.api }),
            language: 'javascript',
            markers: markers.value,
            ariaLabel: 'Script',
            onReady
          })
      })
    )
    const root = view.getByTestId('code-code-editor')
    await waitFor(() => expect(root.getAttribute('data-mode')).toBe('monaco'))
    expect(onReady).toHaveBeenCalledOnce()
    expect(fake.calls.themes[0]?.name).toBe('webkit')
    expect(fake.calls.themes[0]?.theme.colors['editor.background']).toMatch(/^#[0-9a-f]{6}/)
    expect(fake.calls.options[0]).toMatchObject({ readOnly: false, ariaLabel: 'Script' })
    expect(fake.calls.markers.at(-1)).toEqual([
      expect.objectContaining({ startLineNumber: 1, severity: 8, message: 'Nope', endColumn: 10 })
    ])
    expect(view.queryByTestId('code-code-editor__input')).toBeNull()

    fake.models[0]!.setValue('let a = 2')
    expect(value.value).toBe('let a = 2')
    value.value = 'let b = 3'
    await nextTick()
    expect(fake.models[0]!.getValue()).toBe('let b = 3')
    markers.value = []
    await nextTick()
    expect(fake.calls.markers.at(-1)).toEqual([])

    view.unmount()
    expect(fake.calls.disposed).toBeGreaterThan(0)
  })

  it('re-applies the theme when the document theme changes', async () => {
    const fake = fakeMonaco()
    const view = render(CodeEditor, {
      props: { loader: () => Promise.resolve(fake.api), ariaLabel: 'Code' }
    })
    await waitFor(() =>
      expect(view.getByTestId('code-code-editor').getAttribute('data-mode')).toBe('monaco')
    )
    const before = fake.calls.themes.length
    document.documentElement.setAttribute('data-theme', 'dark')
    await waitFor(() => expect(fake.calls.themes.length).toBeGreaterThan(before))
    expect(fake.calls.themes.at(-1)?.theme.base).toBe('vs-dark')
    document.documentElement.removeAttribute('data-theme')
  })

  it('keeps the plain editor and says so when the loader fails', async () => {
    const onError = vi.fn()
    const view = render(CodeEditor, {
      props: {
        modelValue: 'x',
        ariaLabel: 'Code',
        loader: () => Promise.reject(new Error('offline')),
        'onLoad-error': onError
      }
    })
    await waitFor(() => expect(onError).toHaveBeenCalledOnce())
    expect(view.getByTestId('code-code-editor').getAttribute('data-mode')).toBe('plain')
    expect(view.getByTestId('code-code-editor__status').textContent).toContain('could not load')
    expect(textarea(view.container)).toBeTruthy()
  })

  it('reads its built-in strings from the locale catalog', () => {
    const view = render(
      defineComponent({
        setup() {
          provideLocale({ locale: 'pt-BR', catalogs: BUILT_IN_CATALOGS })
          return () =>
            h(CodeEditor, {
              modelValue: 'a',
              markers: [{ line: 1, severity: 'error', message: 'x' }]
            })
        }
      })
    )
    expect(view.getByRole('textbox', { name: 'Editor de código' })).toBeTruthy()
    expect(view.getByRole('status').textContent?.trim()).toBe('1 problema')
  })

  it('keeps the code left to right under dir="rtl"', async () => {
    const view = render(CodeEditor, {
      props: { modelValue: 'a', ariaLabel: 'Code' },
      container: document.body.appendChild(
        Object.assign(document.createElement('div'), { dir: 'rtl' })
      )
    })
    const scroller = textarea(view.container).closest('[dir="ltr"]')
    expect(scroller).not.toBeNull()
    await expectNoA11yViolations(view.container as HTMLElement)
  })

  it('is labelled and described by a surrounding Field', () => {
    const view = render({
      components: { CodeEditor, Field, FieldLabel, FieldDescription },
      template: `<Field invalid><FieldLabel>Function code</FieldLabel><CodeEditor model-value="x" /><FieldDescription>Runs on request.</FieldDescription></Field>`
    })
    const input = view.getByRole('textbox', { name: 'Function code' })
    expect(input.getAttribute('aria-invalid')).toBe('true')
    const ids = input.getAttribute('aria-describedby')?.split(' ') ?? []
    expect(ids.map((id) => document.getElementById(id)?.textContent?.trim())).toContain(
      'Runs on request.'
    )
  })

  it.each([
    ['Default', Default],
    ['Diff', Diff],
    ['ReadOnly', ReadOnly],
    ['WithToolbar', WithToolbar]
  ])('renders the %s example without a11y violations', async (_name, Example) => {
    const { container } = render(Example)
    await expectNoA11yViolations(container)
  })
})
