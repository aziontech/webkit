import { fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'

import EditRule from '../../../../blocks/view/view-rule-list/variants/edit-rule.vue'
import Searching from '../../../../blocks/view/view-rule-list/variants/searching.vue'
import RulesList from '../../../../blocks/view/view-rule-list/view-rule-list.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const namesIn = (root: HTMLElement, phase: string) =>
  Array.from(root.querySelectorAll(`[data-reorder-row^="${phase}"] [data-rule-name]`)).map((a) =>
    a.textContent?.trim()
  )

const requestNames = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('[data-rule-name]')).map((a) => a.textContent?.trim())
describe('view/view-rule-list block', () => {
  beforeEach(async () => {
    await page.viewport(1280, 900)
  })
  afterEach(async () => {
    await page.viewport(414, 896)
  })

  it('moves a rule with the arrow keys on its Table grip, announces it and keeps focus on the moved rule', async () => {
    const view = render(RulesList)
    const grip = view.getByRole('button', { name: 'Reorder Docs rewrite, position 5 of 5' })
    grip.focus()
    await fireEvent.keyDown(grip, { key: 'ArrowUp' })
    await waitFor(() =>
      expect(view.container.textContent).toContain('Moved Docs rewrite to position 4 of 5.')
    )
    expect(requestNames(view.container as HTMLElement).slice(0, 5)).toEqual([
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
    expect(requestNames(view.container as HTMLElement)[0]).toBe('Default rule')
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
    expect(requestNames(view.container as HTMLElement).slice(0, 3)).toEqual([
      'Default rule',
      'Redirect www',
      'Maintenance page'
    ])
    await waitFor(() =>
      expect(view.getByTestId('rule-list__announcer').textContent).toContain(
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
    expect(namesIn(view.container as HTMLElement, 're-c')).toEqual([
      'Cache bypass',
      'Compress assets'
    ])
    await waitFor(() =>
      expect(view.getByTestId('rule-list__announcer').textContent).toContain('Changes discarded.')
    )
  })

  it('lists every moved and toggled rule per phase in the review dialog, emits save, then closes when saving ends', async () => {
    const view = render(RulesList, {
      props: {
        defaultEdits: [
          { phase: 'request', id: 're-docs', to: 2 },
          { phase: 'request', id: 're-maintenance', active: true },
          { phase: 'response', id: 're-security-headers', to: 0 }
        ],
        defaultReviewOpen: true
      }
    })
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
    const [event, rules] = view.emitted<unknown[]>('save')![0] as [
      MouseEvent,
      { id: string; active: boolean }[]
    ]
    expect(event).toBeInstanceOf(MouseEvent)
    expect(rules.map((rule) => rule.id).slice(0, 5)).toEqual([
      're-default',
      're-maintenance',
      're-docs',
      're-www',
      're-gateway'
    ])
    expect(rules.find((rule) => rule.id === 're-maintenance')?.active).toBe(true)
    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
    await view.rerender({ saving: true })
    await view.rerender({ saving: false })
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull(), {
      timeout: 3000
    })
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('aria-label')).toBe('Rules by phase')
    )
  })

  it('keeps the review dialog open with Save again when the save fails', async () => {
    const view = render(RulesList, {
      props: {
        defaultEdits: [{ phase: 'request', id: 're-docs', to: 2 }],
        defaultReviewOpen: true,
        saving: true
      }
    })
    await waitFor(() => expect(document.querySelector('[role="dialog"]')).not.toBeNull())
    await view.rerender({ saving: false, saveError: "The new order wasn't saved." })
    const dialog = document.querySelector('[role="dialog"]') as HTMLElement
    await waitFor(() => expect(dialog.textContent).toContain("The new order wasn't saved."))
    expect(
      Array.from(dialog.querySelectorAll('button')).some(
        (button) => button.textContent?.trim() === 'Save again'
      )
    ).toBe(true)
  })

  it('renders the rules it is given instead of the sample, and an empty phase for none', () => {
    const view = render(RulesList, {
      props: {
        rules: [
          {
            id: 'r-1',
            name: 'Block bots',
            description: 'Refuses known bots.',
            phase: 'request',
            author: 'Jane Doe',
            modified: 'today',
            active: true,
            locked: false
          }
        ]
      }
    })
    expect(requestNames(view.container as HTMLElement)).toEqual(['Block bots'])
    expect(view.queryByText('Docs rewrite')).toBeNull()
    expect(view.getByText('No response rules yet')).toBeTruthy()
  })

  it('emits create from Add Rule in the heading and with the phase from an empty phase', async () => {
    const view = render(RulesList, { props: { subject: 'firewall', rules: [] } })
    const adds = view.getAllByRole('button', { name: 'Add Rule' })
    await fireEvent.click(adds[0])
    await fireEvent.click(adds[1])
    const calls = view.emitted<unknown[]>('create') as [MouseEvent, string?][]
    expect(calls).toHaveLength(2)
    expect(calls[0][0]).toBeInstanceOf(MouseEvent)
    expect(calls[0][1]).toBeUndefined()
    expect(calls[1][1]).toBe('request')
  })

  it('moves a rule to the position typed in its Order cell and keeps focus in the field', async () => {
    const view = render(RulesList)
    const field = view.getByRole('textbox', {
      name: 'Position of Docs rewrite in the Request phase. Type a number from 2 to 5 to move it.'
    }) as HTMLInputElement
    expect(field.value).toBe('5')
    field.focus()
    await fireEvent.update(field, '2')
    await fireEvent.keyDown(field, { key: 'Enter' })
    expect(requestNames(view.container as HTMLElement).slice(0, 3)).toEqual([
      'Default rule',
      'Docs rewrite',
      'Maintenance page'
    ])
    await waitFor(() =>
      expect(view.getByTestId('rule-list__announcer').textContent).toContain(
        'Docs rewrite moved to position 2 of 5 in the Request phase.'
      )
    )
    await waitFor(() =>
      expect(document.activeElement?.getAttribute('data-control')).toBe('position')
    )
    expect((document.activeElement as HTMLInputElement).value).toBe('2')
  })

  it('keeps a rule in place when the typed position is cancelled or not a number', async () => {
    const view = render(RulesList)
    const name =
      'Position of Redirect www in the Request phase. Type a number from 2 to 5 to move it.'
    const field = view.getByRole('textbox', { name }) as HTMLInputElement
    await fireEvent.update(field, '5')
    await fireEvent.keyDown(field, { key: 'Escape' })
    await fireEvent.blur(field)
    expect(requestNames(view.container as HTMLElement)[2]).toBe('Redirect www')
    expect((view.getByRole('textbox', { name }) as HTMLInputElement).value).toBe('3')
    await fireEvent.update(view.getByRole('textbox', { name }), 'x')
    await fireEvent.blur(view.getByRole('textbox', { name }))
    expect(requestNames(view.container as HTMLElement)[2]).toBe('Redirect www')
  })

  it('disables the position of the locked rule with its reason', () => {
    const view = render(RulesList)
    const field = view.getByRole('textbox', {
      name: 'Position 1 of Default rule in the Request phase. The default rule runs first and stays first.'
    }) as HTMLInputElement
    expect(field.disabled).toBe(true)
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
    expect(view.getByTestId('rule-list__count-response').textContent?.trim()).toBe('1 of 3')
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

  it('names each rule with a link button that emits edit with the event and the rule', async () => {
    const view = render(RulesList)
    await fireEvent.click(view.getByRole('button', { name: 'Edit Docs rewrite' }))
    const [event, rule] = view.emitted<unknown[]>('edit')![0] as [MouseEvent, { name: string }]
    expect(event).toBeInstanceOf(MouseEvent)
    expect(rule.name).toBe('Docs rewrite')
  })

  it('offers Clear search in a phase the search empties', async () => {
    const view = render(RulesList)
    await fireEvent.update(view.getByRole('textbox', { name: 'Search rules' }), 'kubernetes')
    const clear = await waitFor(() => view.getAllByRole('button', { name: 'Clear search' }))
    await fireEvent.click(clear[0])
    await waitFor(() => expect(view.queryAllByRole('button', { name: 'Clear search' })).toEqual([]))
  })

  it('replaces the phases with a danger alert whose Retry emits retry when the rules fail to load', async () => {
    const view = render(RulesList, {
      props: { error: "Couldn't load the rules. Check your connection and retry." }
    })
    expect(view.getByText("Couldn't load the rules. Check your connection and retry.")).toBeTruthy()
    expect(view.queryByText('Docs rewrite')).toBeNull()
    expect(view.getByRole('button', { name: 'Add Rule' }).hasAttribute('disabled')).toBe(true)
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted<unknown[]>('retry')).toHaveLength(1)
  })

  it('folds the position controls into a Move menu on a phone and moves the rule from it', async () => {
    await page.viewport(390, 844)
    const view = render(RulesList)
    const trigger = await waitFor(() =>
      view.getByRole('button', { name: 'Move Docs rewrite, position 5 of 5' })
    )
    expect(view.queryByRole('textbox', { name: /^Position of Docs rewrite/ })).toBeNull()
    await fireEvent.click(trigger)
    const up = await waitFor(() => {
      const item = Array.from(document.body.querySelectorAll('[role="menuitem"]')).find((node) =>
        node.textContent?.includes('Move up')
      )
      expect(item).toBeTruthy()
      return item as HTMLElement
    })
    await fireEvent.click(up)
    await waitFor(() =>
      expect(requestNames(view.container as HTMLElement).slice(0, 5)).toEqual([
        'Default rule',
        'Maintenance page',
        'Redirect www',
        'Docs rewrite',
        'API gateway'
      ])
    )
  })
})
