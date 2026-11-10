import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/password-requirements/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import PasswordRequirements, { DEFAULT_PASSWORD_REQUIREMENTS } from './index'

const validated = (chips: HTMLElement[]) =>
  chips.map((chip) => [chip.textContent?.trim(), chip.hasAttribute('data-validated')])

describe('PasswordRequirements', () => {
  it('renders the caption and one chip per built-in rule', () => {
    const { getByTestId, getAllByTestId } = render(PasswordRequirements)

    expect(getByTestId('input-password-requirements__title').textContent).toContain('Must contain:')
    expect(getAllByTestId('input-password-requirements__chip')).toHaveLength(
      DEFAULT_PASSWORD_REQUIREMENTS.length
    )
  })

  it('names the group by its caption', () => {
    const { getByRole } = render(PasswordRequirements, { props: { title: 'Needs:' } })
    expect(getByRole('group', { name: 'Needs:' })).toBeTruthy()
  })

  it('marks the rules the value meets', () => {
    const { getAllByTestId } = render(PasswordRequirements, { props: { value: 'abcdefgh1' } })

    expect(validated(getAllByTestId('input-password-requirements__chip'))).toEqual([
      ['8-128 characters', true],
      ['Uppercase letter', false],
      ['Special character', false],
      ['Number', true],
      ['Lowercase letter', true]
    ])
  })

  it('accepts a custom rule set with predicates and global regexes', () => {
    const { getAllByTestId } = render(PasswordRequirements, {
      props: {
        value: 'aa',
        requirements: [
          { key: 'two', label: 'Two a', test: (v: string) => v === 'aa' },
          { label: 'Letter', test: /a/g }
        ]
      }
    })
    const chips = getAllByTestId('input-password-requirements__chip')
    expect(validated(chips)).toEqual([
      ['Two a', true],
      ['Letter', true]
    ])
  })

  it('re-evaluates as the PasswordInput in the example changes', async () => {
    const { container, getAllByTestId } = render(Default)
    const input = container.querySelector('input') as HTMLInputElement

    await fireEvent.update(input, 'Abcdefg!1')

    expect(
      getAllByTestId('input-password-requirements__chip').every((chip) =>
        chip.hasAttribute('data-validated')
      )
    ).toBe(true)
  })

  it('has no axe violations in the Default example', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })
})
