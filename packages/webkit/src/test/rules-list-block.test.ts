import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import RulesList from '../../blocks/platform/view/rules-list/rules-list.vue'
import EditRule from '../../blocks/platform/view/rules-list/variants/edit-rule.vue'
import ReviewChanges from '../../blocks/platform/view/rules-list/variants/review-changes.vue'
import Searching from '../../blocks/platform/view/rules-list/variants/searching.vue'

const namesIn = (root: HTMLElement, phase: string) =>
  Array.from(root.querySelectorAll(`[data-reorder-row^="${phase}"] a[data-rule-name]`)).map((a) =>
    a.textContent?.trim()
  )

const requestNames = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('a[data-rule-name]')).map((a) => a.textContent?.trim())

describe('platform/view/rules-list block', () => {
  it('moves a rule with the arrow keys on its Table grip, announces it and keeps focus on the moved rule', async () => {
    const view = render(RulesList)
    const grip = view.getByRole('button', { name: 'Reorder Docs rewrite, position 5 of 5' })
    grip.focus()
    await fireEvent.keyDown(grip, { key: 'ArrowUp' })
    await waitFor(() =>
      expect(view.container.textContent).toContain('Moved Docs rewrite to position 4 of 5.')
    )
    expect(requestNames(view.container).slice(0, 5)).toEqual([
      'Default rule',
      'Maintenance page',
      'Redirect www',
      'Docs rewrite',
      'API gateway'
    ])
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label')).toBe(
        'Reorder Docs rewrite, position 4 of 5'
      )
    )
    expect(view.container.textContent).toMatch(/2\s+changes to the rules, not saved yet\./)
  })

  it('keeps the locked default rule first and disables its controls with the reason', async () => {
    const view = render(RulesList)
    const grip = view.getByRole('button', { name: 'Reorder Default rule, position 1 of 5' })
    expect(grip.hasAttribute('disabled')).toBe(true)
    await fireEvent.keyDown(view.getByRole('button', { name: /^Reorder Maintenance page/ }), {
      key: 'Home'
    })
    expect(requestNames(view.container)[0]).toBe('Default rule')
    const up = view.getByRole('button', {
      name: 'Move Default rule down. The default rule runs first and stays first.'
    })
    expect(up.hasAttribute('disabled')).toBe(true)
    expect(
      view.getByRole('button', { name: 'Move Maintenance page up' }).hasAttribute('disabled')
    ).toBe(true)
    expect(view.getByRole('switch', { name: 'Run Default rule' }).hasAttribute('disabled')).toBe(
      true
    )
  })

  it('moves a rule one place with Move down, announces it in its phase and keeps focus', async () => {
    const view = render(RulesList)
    await fireEvent.click(view.getByRole('button', { name: 'Move Maintenance page down' }))
    expect(requestNames(view.container).slice(0, 3)).toEqual([
      'Default rule',
      'Redirect www',
      'Maintenance page'
    ])
    await waitFor(() =>
      expect(view.getByTestId('rules-list__announcer').textContent).toContain(
        'Maintenance page moved to position 3 of 5 in the Request phase.'
      )
    )
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label')).toBe('Move Maintenance page down')
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
    const moves = view.getAllByRole('button', { name: /^Move .+ (up|down)\. / })
    expect(moves.length).toBeGreaterThan(0)
    for (const move of moves) {
      expect(move.getAttribute('aria-label')).toMatch(
        /The default rule runs first|Clear the search to change the order/
      )
    }
    const grips = Array.from(document.querySelectorAll('[data-reorder-handle]'))
    expect(grips.length).toBeGreaterThan(0)
    expect(grips.every((grip) => grip.hasAttribute('disabled'))).toBe(true)
    expect(view.getByTestId('rules-list__count-response').textContent?.trim()).toBe('1 of 3')
  })

  it('opens the rule builder as Edit Rule from a name and as Add Rule from the header (EditRule)', async () => {
    const view = render(EditRule)
    await fireEvent.click(view.getByRole('button', { name: 'Edit Docs rewrite' }))
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).not.toBeNull())
    const drawer = document.querySelector('[role="dialog"]') as HTMLElement
    expect(drawer.textContent).toContain('Edit Rule')
    const name = drawer.querySelector<HTMLInputElement>('#rule-name')!
    expect(name.value).toBe('Docs rewrite')
    await fireEvent.update(name, 'Docs rewrite v2')
    const save = Array.from(drawer.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Save'
    ) as HTMLButtonElement
    await fireEvent.click(save)
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull(), {
      timeout: 3000
    })
    expect(view.getByRole('button', { name: 'Edit Docs rewrite v2' })).toBeTruthy()
    expect(view.queryByRole('button', { name: 'Review changes' })).toBeNull()

    await fireEvent.click(view.getAllByRole('button', { name: 'Add Rule' })[0])
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).not.toBeNull())
    const adding = document.querySelector('[role="dialog"]') as HTMLElement
    expect(adding.textContent).toContain('Add Rule')
    expect(adding.querySelector<HTMLInputElement>('#rule-name')!.value).toBe('')
  })
})
