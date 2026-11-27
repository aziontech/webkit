import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import type { Component } from 'vue'

const examples = import.meta.glob<{ default: Component }>(
  [
    '../../examples/input/*.vue',
    '../../examples/textarea/*.vue',
    '../../examples/password-input/*.vue',
    '../../examples/number-input/*.vue',
    '../../examples/slider/*.vue'
  ],
  { eager: true }
)

const CONTROLS = 'input:not([type=hidden]):not([type=file]), textarea, [role=slider]'

const nameOf = (control: HTMLElement): string => {
  const labelledBy = (control.getAttribute('aria-labelledby') ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .map((id) => document.getElementById(id)?.textContent ?? '')
    .join(' ')
  const labels = Array.from(
    (control as HTMLInputElement).labels ?? [],
    (label) => label.textContent ?? ''
  )
  return [control.getAttribute('aria-label') ?? '', labelledBy, ...labels].join(' ').trim()
}

describe('field examples name every control without the placeholder', () => {
  it.each(Object.keys(examples))('%s', (path) => {
    const { container } = render(examples[path]!.default)
    const controls = Array.from(container.querySelectorAll<HTMLElement>(CONTROLS))
    expect(controls.length).toBeGreaterThan(0)
    for (const control of controls) {
      expect(nameOf(control), control.outerHTML).not.toBe('')
    }
  })
})

const identifierExamples = import.meta.glob<{ default: Component }>(
  [
    '../../examples/tag-editor/*.vue',
    '../../examples/attribute-editor/*.vue',
    '../../examples/combobox/*.vue',
    '../../examples/multi-select/searchable.vue'
  ],
  { eager: true }
)

describe('identifier fields turn off phone autocapitalize and autocorrect', () => {
  it.each(Object.keys(identifierExamples))('%s', (path) => {
    const { container } = render(identifierExamples[path]!.default)
    const fields = Array.from(container.querySelectorAll<HTMLElement>('input[spellcheck="false"]'))
    for (const field of fields) {
      expect(field.getAttribute('autocapitalize'), field.outerHTML).toBe('none')
      expect(field.getAttribute('autocorrect'), field.outerHTML).toBe('off')
    }
  })
})
