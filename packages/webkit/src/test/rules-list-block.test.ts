import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import RulesList from '../../blocks/platform/view/rules-list/rules-list.vue'
import ReviewChanges from '../../blocks/platform/view/rules-list/variants/review-changes.vue'
import Searching from '../../blocks/platform/view/rules-list/variants/searching.vue'

const namesIn = (root: HTMLElement, phase: string) =>
  Array.from(root.querySelectorAll(`[data-rule-cell^="${phase}"] a[data-rule-name]`)).map((a) =>
    a.textContent?.trim()
  )

const requestNames = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('a[data-rule-name]')).map((a) => a.textContent?.trim())

describe('platform/view/rules-list block', () => {
  it('moves a rule with the arrow keys on its grip, announces it and keeps focus on the moved rule', async () => {
    const view = render(RulesList)
    const grip = view.getByRole('button', { name: /^Reorder Docs rewrite, position 5 of 5/ })
    grip.focus()
    await fireEvent.keyDown(grip, { key: 'ArrowUp' })
    await waitFor(() =>
      expect(view.getByTestId('rules-list__announcer').textContent).toContain(
        'Docs rewrite moved to position 4 of 5 in the Request phase.'
      )
    )
    expect(requestNames(view.container).slice(0, 5)).toEqual([
      'Default rule',
      'Maintenance page',
      'Redirect www',
      'Docs rewrite',
      'API gateway'
    ])
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label')).toMatch(
        /^Reorder Docs rewrite, position 4 of 5/
      )
    )
  })

  it('keeps the locked default rule first and disables its controls with the reason', async () => {
    const view = render(RulesList)
    const grip = view.getByRole('button', { name: /^Default rule cannot be reordered/ })
    expect(grip.hasAttribute('disabled')).toBe(true)
    expect(grip.getAttribute('aria-label')).toContain(
      'The default rule runs first and stays first.'
    )
    const up = view.getByRole('button', { name: 'Move Maintenance page up' })
    expect(up.hasAttribute('disabled')).toBe(true)
    expect(view.getByRole('switch', { name: 'Run Default rule' }).hasAttribute('disabled')).toBe(
      true
    )
  })

  it('moves a rule to a typed position and refocuses its position field', async () => {
    const view = render(RulesList)
    const field = view.getByRole('textbox', { name: /^Position of Maintenance page/ })
    await fireEvent.update(field, '4')
    await fireEvent.keyDown(field, { key: 'Enter' })
    expect(requestNames(view.container).slice(0, 5)).toEqual([
      'Default rule',
      'Redirect www',
      'API gateway',
      'Maintenance page',
      'Docs rewrite'
    ])
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label')).toMatch(
        /^Position of Maintenance page/
      )
    )
  })

  it('raises the save bar after a change, and Discard restores the saved order', async () => {
    const view = render(RulesList)
    expect(view.queryByRole('button', { name: 'Review changes' })).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Move Compress assets up' }))
    await fireEvent.click(view.getByRole('switch', { name: 'Run Cache bypass' }))
    expect(view.container.textContent).toMatch(/3\s+changes to the rules, not saved yet\./)
    await fireEvent.click(view.getByRole('button', { name: 'Discard' }))
    expect(view.queryByRole('button', { name: 'Review changes' })).toBeNull()
    expect(namesIn(view.container, 're-c')).toEqual(['Cache bypass', 'Compress assets'])
    await waitFor(() =>
      expect(view.getByTestId('rules-list__announcer').textContent).toContain('Changes discarded.')
    )
  })

  it('lists every moved and toggled rule per phase in the review dialog, then saves', async () => {
    render(ReviewChanges)
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).not.toBeNull())
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement
    expect(dialog.textContent).toContain('Request phase')
    expect(dialog.textContent).toContain('Response phase')
    expect(dialog.textContent).toMatch(/Docs rewrite\s*moves from position 5 to 3\./)
    expect(dialog.textContent).toMatch(/API gateway\s*moves from position 4 to 5\./)
    expect(dialog.textContent).toMatch(/Maintenance page\s*is turned on\./)
    expect(dialog.textContent).toMatch(/Security headers\s*moves from position 2 to 1\./)
    const save = Array.from(dialog.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Save'
    ) as HTMLButtonElement
    await fireEvent.click(save)
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull(), {
      timeout: 3000
    })
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label')).toBe('Rules by phase')
    )
  })

  it('turns reordering off while a search narrows the list', async () => {
    const view = render(Searching)
    expect(view.getByText(/Reordering is off while a search narrows the list/)).toBeTruthy()
    const grips = view.getAllByRole('button', { name: /cannot be reordered/ })
    expect(grips.length).toBeGreaterThan(0)
    for (const grip of grips) {
      expect(grip.getAttribute('aria-label')).toMatch(
        /The default rule runs first|Clear the search to change the order/
      )
    }
    expect(view.getByTestId('rules-list__count-response').textContent?.trim()).toBe('1 of 3')
  })
})
