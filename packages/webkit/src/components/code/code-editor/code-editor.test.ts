import userEvent from '@testing-library/user-event'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Borderless from '../../../../examples/code-editor/borderless.vue'
import Default from '../../../../examples/code-editor/default.vue'
import Diff from '../../../../examples/code-editor/diff.vue'
import ReadOnly from '../../../../examples/code-editor/read-only.vue'
import WithToolbar from '../../../../examples/code-editor/with-toolbar.vue'
import { en, provideLocale } from '../../../composables/use-locale'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import Field from '../../inputs/field/field.vue'
import FieldDescription from '../../inputs/field/field-description/field-description.vue'
import FieldLabel from '../../inputs/field/field-label/field-label.vue'
import CodeEditor from './code-editor.vue'
import {
  type CodeEditorMonaco,
  type CodeEditorMonacoJsonDiagnostics,
  type CodeEditorMonacoMarker,
  type CodeEditorMonacoModel,
  fontFromTokens,
  highlightCalls,
  padLineNumber,
  toCodeEditorMarkers
} from './monaco'

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

const TOKENS = `:root{--bg-surface:#ffffff;--text-default:#171717;--border-default:#e5e5e5}:root[data-theme=dark]{--bg-surface:#0a0a0a;--text-default:#fafafa}`
const withTokens = () => {
  const style = document.head.appendChild(document.createElement('style'))
  style.textContent = TOKENS
  return () => style.remove()
}

const pressTab = (input: HTMLElement, shiftKey = false) =>
  input.dispatchEvent(
    new KeyboardEvent('keydown', { key: 'Tab', shiftKey, bubbles: true, cancelable: true })
  )

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
    expect(pressTab(input)).toBe(true)
    expect(value.value).toBe('  a\nb')
  })

  it('does not trap Tab when read-only', async () => {
    const view = render(CodeEditor, { props: { modelValue: 'x', readonly: true, ariaLabel: 'Q' } })
    const input = textarea(view.container)
    expect(input.readOnly).toBe(true)
    expect(pressTab(input)).toBe(true)
  })

  it('suppresses edits when read-only or disabled, and leaves the tab order when disabled', async () => {
    const readonly = render(CodeEditor, {
      props: { modelValue: 'x', readonly: true, ariaLabel: 'Read only' }
    })
    const ro = textarea(readonly.container)
    await userEvent.type(ro, 'abc')
    await userEvent.keyboard('{Tab}')
    expect(readonly.emitted()['update:modelValue']).toBeUndefined()
    expect(ro.value).toBe('x')
    readonly.unmount()

    const disabled = render(CodeEditor, {
      props: { modelValue: 'y', disabled: true, ariaLabel: 'Disabled' }
    })
    const input = textarea(disabled.container)
    expect(input.disabled).toBe(true)
    await userEvent.type(input, 'abc')
    expect(disabled.emitted()['update:modelValue']).toBeUndefined()
    expect(disabled.getByTestId('code-code-editor').hasAttribute('data-disabled')).toBe(true)
  })

  it('takes the consumer data-testid over the fallback', () => {
    const view = render(CodeEditor, {
      props: { modelValue: 'z', ariaLabel: 'Code' },
      attrs: { 'data-testid': 'rules-editor' }
    })
    expect(view.getByTestId('rules-editor')).toBeTruthy()
    expect(view.queryByTestId('code-code-editor')).toBeNull()
    expect(view.getByTestId('rules-editor__input')).toBeTruthy()
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

  it('zero-pads the gutter to two digits with padLineNumbers', async () => {
    const lines = Array.from({ length: 12 }, (_, index) => `line ${index + 1}`).join('\n')
    const view = render(CodeEditor, { props: { modelValue: lines, ariaLabel: 'Script' } })
    const labels = () =>
      [...view.getByTestId('code-code-editor__gutter').querySelectorAll('li')].map((li) =>
        li.textContent?.trim()
      )
    expect(labels().slice(0, 2)).toEqual(['1', '2'])
    await view.rerender({ padLineNumbers: true })
    expect(labels().slice(0, 2)).toEqual(['01', '02'])
    expect(labels().at(-1)).toBe('12')
    expect(padLineNumber(7)).toBe('07')
    expect(padLineNumber(120)).toBe('120')
  })

  it('passes the padded line-number formatter to Monaco', async () => {
    const fake = fakeMonaco()
    const view = render(CodeEditor, {
      props: {
        modelValue: 'a\nb',
        loader: () => Promise.resolve(fake.api),
        padLineNumbers: true,
        ariaLabel: 'Script'
      }
    })
    await waitFor(() =>
      expect(view.getByTestId('code-code-editor').getAttribute('data-mode')).toBe('monaco')
    )
    const format = fake.calls.options[0]?.['lineNumbers'] as (line: number) => string
    expect(format(3)).toBe('03')
    await view.rerender({ padLineNumbers: false })
    expect(fake.calls.options.at(-1)?.['lineNumbers']).toBe('on')
  })

  it('creates Monaco at the editor line height token, 16 px when the theme is absent', async () => {
    const fake = fakeMonaco()
    const view = render(CodeEditor, {
      props: { modelValue: 'a', loader: () => Promise.resolve(fake.api), ariaLabel: 'Script' }
    })
    await waitFor(() =>
      expect(view.getByTestId('code-code-editor').getAttribute('data-mode')).toBe('monaco')
    )
    expect(fake.calls.options[0]?.['lineHeight']).toBe(16)
  })

  it('reads the editor line height from --code-editor-line-height, in px or rem', () => {
    const host = document.createElement('div')
    document.body.appendChild(host)
    host.style.setProperty('--code-editor-line-height', '18px')
    expect(fontFromTokens(host).lineHeight).toBe(18)
    host.style.setProperty('--code-editor-line-height', '1.25rem')
    const root = parseFloat(getComputedStyle(document.documentElement).fontSize)
    expect(fontFromTokens(host).lineHeight).toBe(Math.round(1.25 * root))
    host.style.setProperty('--code-editor-line-height', 'normal')
    expect(fontFromTokens(host).lineHeight).toBe(16)
    host.remove()
  })

  it('colours function calls: JavaScript and TypeScript grammars gain call rules once', async () => {
    const providers: [string, { tokenizer: Record<string, unknown[]> }][] = []
    const grammar = { keywords: ['if'], tokenizer: { root: [], common: [['base']] } }
    const loader = vi.fn(() => Promise.resolve({ language: grammar }))
    const api = {
      languages: {
        getLanguages: () => [
          { id: 'javascript', loader },
          { id: 'typescript', loader },
          { id: 'json', loader }
        ],
        setMonarchTokensProvider: (id: string, language: object) =>
          providers.push([id, language as { tokenizer: Record<string, unknown[]> }])
      }
    }
    await highlightCalls(api)
    await highlightCalls(api)
    expect(providers.map(([id]) => id)).toEqual(['javascript', 'typescript'])
    expect(loader).toHaveBeenCalledTimes(2)
    const common = providers[0]![1].tokenizer['common']!
    expect(common.at(-1)).toEqual(['base'])
    const call = common.find(
      (rule) => Array.isArray(rule) && rule[0] instanceof RegExp && rule[0].test('fetch(')
    ) as [RegExp, { cases: Record<string, string> }]
    expect(call[1].cases['@default']).toBe('function')
    expect(call[1].cases['@keywords']).toBe('keyword')
    expect(grammar.tokenizer.common).toEqual([['base']])
  })

  it('mounts Monaco when the module has no languages API', async () => {
    const fake = fakeMonaco()
    const view = render(CodeEditor, {
      props: { modelValue: 'x', loader: () => Promise.resolve(fake.api), ariaLabel: 'Script' }
    })
    await waitFor(() =>
      expect(view.getByTestId('code-code-editor').getAttribute('data-mode')).toBe('monaco')
    )
  })

  it('mounts Monaco from the loader with a token theme and syncs value and markers', async () => {
    const removeTokens = withTokens()
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
    removeTokens()
    expect(fake.calls.disposed).toBeGreaterThan(0)
  })

  it('settles when two editors share the page and setTheme touches the body class', async () => {
    const removeTokens = withTokens()
    const fake = fakeMonaco()
    fake.api.editor.setTheme = (name: string) => {
      document.body.classList.toggle('monaco-theme-probe')
      void name
    }
    const loader = () => Promise.resolve(fake.api)
    const view = render(
      defineComponent({
        setup: () => () => [
          h(CodeEditor, { loader, ariaLabel: 'One' }),
          h(CodeEditor, { loader, ariaLabel: 'Two' })
        ]
      })
    )
    await waitFor(() =>
      expect(view.getAllByTestId('code-code-editor').map((el) => el.dataset['mode'])).toEqual([
        'monaco',
        'monaco'
      ])
    )
    for (let i = 0; i < 20; i += 1) await new Promise((resolve) => requestAnimationFrame(resolve))
    const settled = fake.calls.themes.length
    for (let i = 0; i < 20; i += 1) await new Promise((resolve) => requestAnimationFrame(resolve))
    expect(fake.calls.themes.length).toBe(settled)
    expect(settled).toBeLessThanOrEqual(2)
    document.body.classList.remove('monaco-theme-probe')
    removeTokens()
  })

  it('re-applies the theme when the document theme changes', async () => {
    const removeTokens = withTokens()
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
    removeTokens()
  })

  it('draws the frame by default and drops it with bordered false', () => {
    const view = render(CodeEditor, { props: { modelValue: 'x', ariaLabel: 'Script' } })
    expect(view.getByTestId('code-code-editor').hasAttribute('data-bordered')).toBe(true)
    view.unmount()
    const flush = render(CodeEditor, {
      props: { modelValue: 'x', ariaLabel: 'Script', bordered: false }
    })
    expect(flush.getByTestId('code-code-editor').hasAttribute('data-bordered')).toBe(false)
  })

  it('maps Monaco markers to the marker shape, sorted, without its own', () => {
    const marker = (line: number, severity: number, owner = 'json'): CodeEditorMonacoMarker => ({
      owner,
      severity,
      message: `m${line}`,
      startLineNumber: line,
      startColumn: 3,
      endLineNumber: line,
      endColumn: 9
    })
    expect(
      toCodeEditorMarkers(
        [marker(4, 1), marker(2, 8), marker(3, 4), marker(1, 8, 'webkit')],
        { Error: 8, Warning: 4, Info: 2 },
        'webkit'
      )
    ).toEqual([
      { line: 2, column: 3, endLine: 2, endColumn: 9, severity: 'error', message: 'm2' },
      { line: 3, column: 3, endLine: 3, endColumn: 9, severity: 'warning', message: 'm3' },
      { line: 4, column: 3, endLine: 4, endColumn: 9, severity: 'info', message: 'm4' }
    ])
  })

  it('registers the JSON schema for its model and emits validate when its markers change', async () => {
    const fake = fakeMonaco()
    let options: CodeEditorMonacoJsonDiagnostics = {
      validate: true,
      schemas: [{ uri: 'inmemory://other/schema.json', fileMatch: ['other.json'], schema: {} }]
    }
    const listeners: ((resources: readonly unknown[]) => void)[] = []
    const stored: CodeEditorMonacoMarker[] = []
    const createModel = fake.api.editor.createModel
    fake.api.Uri = { parse: (value: string) => ({ toString: () => value }) }
    fake.api.editor.createModel = (value, language, uri) =>
      Object.assign(createModel(value, language, uri), { uri: uri as { toString(): string } })
    fake.api.editor.getModelMarkers = () => stored
    fake.api.editor.onDidChangeMarkers = (listener) => {
      listeners.push(listener)
      return { dispose: () => listeners.splice(listeners.indexOf(listener), 1) }
    }
    fake.api.json = {
      jsonDefaults: {
        get diagnosticsOptions() {
          return options
        },
        setDiagnosticsOptions: (next) => {
          options = next
        }
      }
    }
    const schema = ref<Record<string, unknown> | undefined>({
      type: 'object',
      required: ['greeting']
    })
    const onValidate = vi.fn()
    const view = render(
      defineComponent({
        setup: () => () =>
          h(CodeEditor, {
            modelValue: '{}',
            loader: () => Promise.resolve(fake.api),
            language: 'json',
            schema: schema.value,
            ariaLabel: 'Arguments',
            onValidate
          })
      })
    )
    await waitFor(() =>
      expect(view.getByTestId('code-code-editor').getAttribute('data-mode')).toBe('monaco')
    )
    const mine = options.schemas?.find((entry) => entry.uri !== 'inmemory://other/schema.json')
    expect(options.schemas).toHaveLength(2)
    expect(options).toMatchObject({ validate: true, enableSchemaRequest: false })
    expect(mine?.schema).toEqual({ type: 'object', required: ['greeting'] })
    expect(mine?.fileMatch?.[0]).toMatch(/model\.json$/)

    stored.push({
      owner: 'json',
      severity: 4,
      message: 'Missing property "greeting".',
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: 3
    })
    listeners.forEach((listener) => listener([{ toString: () => 'inmemory://elsewhere.json' }]))
    expect(onValidate).not.toHaveBeenCalled()
    listeners.forEach((listener) => listener([{ toString: () => mine?.fileMatch?.[0] }]))
    expect(onValidate).toHaveBeenLastCalledWith([
      {
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 3,
        severity: 'warning',
        message: 'Missing property "greeting".'
      }
    ])

    schema.value = undefined
    await nextTick()
    expect(options.schemas).toHaveLength(1)
    view.unmount()
    expect(listeners).toHaveLength(0)
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
          provideLocale({ locale: 'pt-BR', catalogs: { en, ...LOCALES } })
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

  it('is labelled and described by a surrounding Field', async () => {
    const view = render({
      components: { CodeEditor, Field, FieldLabel, FieldDescription },
      template: `<Field invalid><FieldLabel>Function code</FieldLabel><CodeEditor model-value="x" /><FieldDescription>Runs on request.</FieldDescription></Field>`
    })
    await nextTick()
    const input = view.getByRole('textbox', { name: 'Function code' })
    expect(input.getAttribute('aria-invalid')).toBe('true')
    const ids = input.getAttribute('aria-describedby')?.split(' ') ?? []
    expect(ids.map((id) => document.getElementById(id)?.textContent?.trim())).toContain(
      'Runs on request.'
    )
  })

  it.each([
    ['Borderless', Borderless],
    ['Default', Default],
    ['Diff', Diff],
    ['ReadOnly', ReadOnly],
    ['WithToolbar', WithToolbar]
  ])('renders the %s example without a11y violations', async (_name, Example) => {
    const { container } = render(Example)
    await expectNoA11yViolations(container)
  })
})
