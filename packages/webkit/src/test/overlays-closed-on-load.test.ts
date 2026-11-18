import './reflow.css'

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import type { Component } from 'vue'
import { nextTick } from 'vue'

const examples = import.meta.glob<{ default: Component }>('../../examples/**/*.vue')

const FLOATING =
  '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], [role="tooltip"], [data-state="open"]'

function frame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()))
}

function floatingOutside(container: Element): string[] {
  const found: string[] = []
  for (const node of Array.from(document.body.children)) {
    if (node === container || node.contains(container)) continue
    const candidates = [node, ...Array.from(node.querySelectorAll(FLOATING))].filter((element) =>
      element.matches(FLOATING)
    )
    for (const element of candidates) {
      if (!element.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue
      const rect = element.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) continue
      const testId = element.getAttribute('data-testid') ?? element.tagName.toLowerCase()
      found.push(`${testId} (${element.getAttribute('role') ?? 'data-state=open'})`)
    }
  }
  return found
}

describe('examples · no floating overlay is open on mount', () => {
  it.each(
    Object.keys(examples)
      .sort()
      .map((file) => [file.replace('../../', '')])
  )('%s', { timeout: 60_000 }, async (file) => {
    const mod = await examples[`../../${file}`]!()
    const { container } = render(mod.default)
    await nextTick()
    await frame()
    await frame()
    expect(floatingOutside(container), 'opens on the reader click, hover or focus').toEqual([])
  })
})
