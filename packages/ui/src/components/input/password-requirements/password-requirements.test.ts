import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/password-requirements/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import PasswordRequirements, { DEFAULT_PASSWORD_REQUIREMENTS } from './index'

const labelOf = (chip: HTMLElement) =>
  Array.from(chip.childNodes)
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .map((node) => node.textContent)
    .join('')
    .trim()

const validated = (chips: HTMLElement[]) =>
  chips.map((chip) => [labelOf(chip), chip.hasAttribute('data-validated')])

describe('PasswordRequirements', () => {
  it('renders the caption and one chip per built-in rule', () => {
    const { getByTestId, getAllByTestId } = render(PasswordRequirements)

    expect(getByTestId('password-requirements__title').textContent).toContain('Must contain:')
    expect(getAllByTestId('password-requirements__chip')).toHaveLength(
      DEFAULT_PASSWORD_REQUIREMENTS.length
    )
  })

  it('names the group by its caption', () => {
    const { getByRole } = render(PasswordRequirements, { props: { title: 'Needs:' } })
    expect(getByRole('group', { name: 'Needs:' })).toBeTruthy()
  })

  it('marks the rules the value meets', () => {
    const { getAllByTestId } = render(PasswordRequirements, { props: { value: 'abcdefghijk1' } })

    expect(validated(getAllByTestId('password-requirements__chip'))).toEqual([
      ['12-128 characters', true],
      ['Lowercase letter', true],
      ['Uppercase letter', false],
      ['Number', true],
      ['Special character', false]
    ])
  })

  it('states each rule as met or not met in text, not only in colour', () => {
    const { getAllByTestId } = render(PasswordRequirements, { props: { value: 'abcdefghijk1' } })
    const states = getAllByTestId('password-requirements__chip-state').map((el) =>
      el.textContent?.trim()
    )
    expect(states).toEqual([', met', ', met', ', not met', ', met', ', not met'])
    expect(getAllByTestId('password-requirements__chip')[2].textContent).toContain(
      'Uppercase letter, not met'
    )
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
    const chips = getAllByTestId('password-requirements__chip')
    expect(validated(chips)).toEqual([
      ['Two a', true],
      ['Letter', true]
    ])
  })

  it('re-evaluates as the PasswordInput in the example changes', async () => {
    const { container, getAllByTestId } = render(Default)
    const input = container.querySelector('input') as HTMLInputElement

    await fireEvent.update(input, 'Abcdefghij!1')

    expect(
      getAllByTestId('password-requirements__chip').every((chip) =>
        chip.hasAttribute('data-validated')
      )
    ).toBe(true)
  })

  it('joins the rules to the password field description in the Default example', async () => {
    const { container, getAllByTestId } = render(Default)
    const input = container.querySelector('input') as HTMLInputElement
    const rules = getAllByTestId('password-requirements__chip')[0]!.parentElement as HTMLElement
    await waitFor(() =>
      expect((input.getAttribute('aria-describedby') ?? '').split(/\s+/)).toContain(rules.id)
    )
  })

  it('announces how many rules are met once typing pauses, and nothing on load', async () => {
    const { container, getByTestId } = render(Default)
    const status = getByTestId('password-requirements__progress')
    expect(status.getAttribute('role')).toBe('status')
    expect(status.textContent).toBe('')
    await fireEvent.update(container.querySelector('input') as HTMLInputElement, 'abcdefghijkl')
    expect(status.textContent).toBe('')
    await waitFor(() => expect(status.textContent).toBe('2 of 5 requirements met'), {
      timeout: 2000
    })
  })

  it('animates no layout property: the row reflows, the check only fades and slides', () => {
    const { getByTestId, container } = render(PasswordRequirements, { props: { value: 'a' } })
    const classes = [getByTestId('password-requirements'), ...container.querySelectorAll('i')]
      .map((el) => el.getAttribute('class') ?? '')
      .join(' ')
    expect(classes).not.toMatch(/transition-\[[^\]]*(height|width|margin|left)/)
  })

  it('has no axe violations in the Default example', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })

  describe('test ids', () => {
    it('falls back to input-password-requirements and lets a passed data-testid win', () => {
      const view = render(PasswordRequirements)
      expect(view.getByTestId('password-requirements')).toBeTruthy()
      view.unmount()
      const custom = render(PasswordRequirements, { attrs: { 'data-testid': 'signup-rules' } })
      expect(custom.getByTestId('signup-rules')).toBeTruthy()
    })
  })
})
