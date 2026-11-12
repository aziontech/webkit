import '../../../test/reflow.css'

import { cleanup, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { nextTick } from 'vue'

import Monaco from '../../../../examples/code-editor/monaco.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import type { CodeEditorMonacoModule } from './monaco'

const typedLoader: () => Promise<CodeEditorMonacoModule> = () => import('monaco-editor')

const editors = () =>
  [...document.querySelectorAll<HTMLElement>('[data-testid="code-code-editor"]')].map((root) => ({
    root,
    host: root.querySelector<HTMLElement>('[data-testid="code-code-editor__monaco"]')!
  }))

const toRgb = (color: string): string => {
  const probe = document.createElement('div')
  probe.style.color = color
  document.body.appendChild(probe)
  const value = getComputedStyle(probe).color
  probe.remove()
  return value
}

const mounted = async () => {
  render(Monaco)
  await waitFor(
    () => {
      for (const { root } of editors()) expect(root).toHaveAttribute('data-mode', 'monaco')
    },
    { timeout: 30_000, interval: 100 }
  )
  await waitFor(
    () => expect(document.querySelectorAll('.monaco-editor .view-lines').length).toBeGreaterThan(1),
    {
      timeout: 10_000
    }
  )
}

afterEach(() => {
  cleanup()
  delete document.documentElement.dataset['theme']
})

describe('CodeEditor · real monaco-editor (lazy loader with workers)', () => {
  it('loads Monaco, its workers and the token theme in place of the plain editor', async () => {
    await mounted()
    const [main, diff] = editors()
    expect(main!.root.getAttribute('data-mode')).toBe('monaco')
    expect(main!.host.querySelector('.monaco-editor')).toBeTruthy()
    expect(diff!.host.querySelector('.monaco-diff-editor')).toBeTruthy()
    const background = getComputedStyle(
      main!.host.querySelector<HTMLElement>('.monaco-editor-background')!
    ).backgroundColor
    const surface = getComputedStyle(main!.root).getPropertyValue('--bg-surface').trim()
    expect(background).toBe(toRgb(surface))
    const workerReady = await waitFor(
      () => {
        const folding = main!.host.querySelectorAll(
          '.codicon-folding-expanded, .codicon-folding-collapsed, .cldr'
        )
        expect(folding.length).toBeGreaterThan(0)
        return true
      },
      { timeout: 15_000 }
    )
    expect(workerReady).toBe(true)
  }, 60_000)

  it('paints the markers and edits through v-model', async () => {
    await mounted()
    const [main] = editors()
    await waitFor(() => expect(main!.host.querySelector('.squiggly-warning')).toBeTruthy(), {
      timeout: 10_000
    })
    const input = main!.host.querySelector<HTMLElement>('[role="textbox"]')!
    expect(input).toHaveAccessibleName('Cache settings')
    // Monaco 0.57's JSON completion adapter ignores cancellation and reads the model after its
    // worker answers, which can be seconds later; if cleanup disposed the model by then it throws
    // `TextModelPart is disposed!` as an unhandled error. Completion is not under test here, so
    // no completion request is ever sent.
    const monaco = await import('monaco-editor')
    for (const editor of monaco.editor.getEditors())
      editor.updateOptions({ quickSuggestions: false, suggestOnTriggerCharacters: false })
    input.focus()
    await userEvent.keyboard('{Control>}{End}{/Control}// x')
    const text = (host: HTMLElement) =>
      [...host.querySelectorAll('.view-lines')]
        .map((lines) => lines.textContent ?? '')
        .join('\n')
        .replace(/\u00a0/g, ' ')
    await waitFor(() => expect(text(main!.host)).toContain('// x'))
    const [, diff] = editors()
    await waitFor(() => expect(text(diff!.host)).toContain('// x'))
  }, 60_000)

  it('follows the theme: the editor background is the dark surface under data-theme="dark"', async () => {
    await mounted()
    document.documentElement.dataset['theme'] = 'dark'
    await nextTick()
    const [main] = editors()
    const expected = toRgb(getComputedStyle(main!.root).getPropertyValue('--bg-surface').trim())
    const background = () =>
      getComputedStyle(main!.host.querySelector<HTMLElement>('.monaco-editor-background')!)
        .backgroundColor
    await waitFor(() => expect(background()).toBe(expected), { timeout: 5_000 })
    expect(expected).not.toBe(toRgb('#ffffff'))
  }, 60_000)

  it('names both sides of the diff editor', async () => {
    await mounted()
    const [, diff] = editors()
    const sides = [...diff!.host.querySelectorAll<HTMLElement>('[role="textbox"]')]
    expect(sides.map((side) => side.getAttribute('aria-label'))).toEqual([
      'Cache settings, compared with the saved version, Original',
      'Cache settings, compared with the saved version, Modified'
    ])
  }, 60_000)

  it('colours function calls with the function token and zero-pads the function editor', async () => {
    await mounted()
    const functionEditor = editors()[2]!
    await waitFor(
      () =>
        expect(
          functionEditor.host.querySelector('.margin-view-overlays .line-numbers')?.textContent
        ).toBe('01'),
      { timeout: 10_000 }
    )
    const span = (text: string) =>
      [...functionEditor.host.querySelectorAll<HTMLElement>('.view-line span span')].find(
        (node) => node.textContent === text
      )
    const expected = toRgb(
      getComputedStyle(functionEditor.root).getPropertyValue('--code-sintax-function').trim()
    )
    await waitFor(() => expect(getComputedStyle(span('handleRequest')!).color).toBe(expected), {
      timeout: 10_000
    })
    expect(getComputedStyle(span('fetch')!).color).toBe(expected)
    expect(getComputedStyle(span('request')!).color).not.toBe(expected)
  }, 60_000)

  it('types the real monaco-editor module as a loader result, languages API included', async () => {
    const module = await typedLoader()
    const api = 'editor' in module ? module : module.default
    expect(typeof api.languages?.getLanguages).toBe('function')
  }, 30_000)

  it('has no axe violations once Monaco is live', async () => {
    const view = render(Monaco)
    await waitFor(
      () => {
        for (const { root } of editors()) expect(root).toHaveAttribute('data-mode', 'monaco')
      },
      { timeout: 30_000, interval: 100 }
    )
    await expectNoA11yViolations(view.container)
  }, 60_000)
})
