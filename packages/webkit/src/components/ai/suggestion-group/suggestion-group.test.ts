import { userEvent } from '@storybook/test'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import SuggestionGroup from './suggestion-group.vue'

const items = [
  { id: 'ttl', label: 'What TTL should my images use?' },
  { id: 'purge', label: 'How do I purge one URL?', icon: 'pi pi-bolt' }
]

describe('SuggestionGroup', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(
      render(SuggestionGroup, { props: { items } }).getByTestId('ai-suggestion-group')
    ).toBeTruthy()
    expect(
      render(SuggestionGroup, { props: { items }, attrs: { 'data-testid': 'mine' } }).getByTestId(
        'mine'
      )
    ).toBeTruthy()
  })

  it('is a named group of buttons', () => {
    const { getByRole, getAllByRole } = render(SuggestionGroup, { props: { items } })
    expect(getByRole('group', { name: 'Suggested prompts' })).toBeTruthy()
    expect(getAllByRole('button')).toHaveLength(2)
  })

  it('emits select with the item on click and on Enter', async () => {
    const { getAllByRole, emitted } = render(SuggestionGroup, { props: { items } })
    await userEvent.click(getAllByRole('button')[0] as HTMLElement)
    expect(emitted('select')?.[0]).toEqual([items[0]])
    await userEvent.tab()
    await userEvent.keyboard('{Enter}')
    expect(emitted('select')?.[1]).toEqual([items[1]])
  })

  it('emits nothing while disabled', async () => {
    const { getAllByRole, emitted } = render(SuggestionGroup, { props: { items, disabled: true } })
    const first = getAllByRole('button')[0] as HTMLButtonElement
    expect(first).toBeDisabled()
    await userEvent.click(first)
    expect(emitted('select')).toBeUndefined()
  })

  it('maps orientation to data-orientation', () => {
    const { getByTestId } = render(SuggestionGroup, { props: { items, orientation: 'vertical' } })
    expect(getByTestId('ai-suggestion-group')).toHaveAttribute('data-orientation', 'vertical')
  })

  it('renders nothing without items', () => {
    expect(render(SuggestionGroup).queryByRole('group')).toBeNull()
  })

  it('has no axe violations', async () => {
    const { container } = render(SuggestionGroup, { props: { items } })
    await expectNoA11yViolations(container)
  })
})
