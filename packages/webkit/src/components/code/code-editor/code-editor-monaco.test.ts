import '../../../test/reflow.css'

import { cleanup, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { nextTick } from 'vue'

import Monaco from '../../../../examples/code-editor/monaco.vue'
import { expectNoA11yViolations } from '../../../test/axe'

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
    input.focus()
    await userEvent.keyboard('{Control>}{End}{/Control}// x')
    await waitFor(() =>
      expect(main!.host.querySelector('.view-lines')!.textContent).toContain('// x')
    )
  }, 60_000)

  it('follows the theme: the editor background is the dark surface under data-theme="dark"', async () => {
    await mounted()
    document.documentElement.dataset['theme'] = 'dark'
    await nextTick()
    const [main] = editors()
    await waitFor(
      () => {
        const surface = getComputedStyle(main!.root).getPropertyValue('--bg-surface').trim()
        const background = getComputedStyle(
          main!.host.querySelector<HTMLElement>('.monaco-editor-background')!
        ).backgroundColor
        expect(background).toBe(toRgb(surface))
      },
      { timeout: 5_000 }
    )
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
