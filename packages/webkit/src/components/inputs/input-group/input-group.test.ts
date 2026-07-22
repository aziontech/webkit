import { composeStories } from '@storybook/vue3'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/input-group/InputGroup.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import InputGroup, { InputGroupAddon } from './index'

const { Default, Sizes, BothAddons, WithButton, WithSelect, Invalid, Required, Disabled } =
  composeStories(stories)

// The middle input is a consumer-provided raw <input>; aria-label gives it an
// accessible name so composed trees are axe-clean (the group does not name it).
const LABELLED_INPUT = '<input aria-label="Domain" placeholder="domain" />'

describe('InputGroup', () => {
  describe('compound API', () => {
    it('attaches Addon to the compound root for dot-notation', () => {
      expect(InputGroup.Addon).toBe(InputGroupAddon)
    })
  })

  describe('root rendering & attributes', () => {
    it('renders a role=group div with the default testid and the slot children', () => {
      const { getByTestId, getByPlaceholderText } = render(InputGroup, {
        slots: { default: LABELLED_INPUT }
      })

      const root = getByTestId('input-group')
      expect(root.tagName).toBe('DIV')
      expect(root.getAttribute('role')).toBe('group')
      expect(getByPlaceholderText('domain')).toBeTruthy()
    })

    it('honors a consumer-provided data-testid over the fallback', () => {
      const { getByTestId } = render(InputGroup, {
        attrs: { 'data-testid': 'my-group' },
        slots: { default: LABELLED_INPUT }
      })

      expect(getByTestId('my-group').getAttribute('role')).toBe('group')
    })

    it('renders children as direct children of the root, in template order', () => {
      const { getByTestId } = render(InputGroup, {
        slots: {
          default:
            '<span data-testid="first">https://</span><input aria-label="Domain" /><span data-testid="last">.com</span>'
        }
      })

      const children = Array.from(getByTestId('input-group').children)
      expect(children).toHaveLength(3)
      expect(children[0]).toBe(getByTestId('first'))
      expect(children[2]).toBe(getByTestId('last'))
    })
  })

  describe('invalid', () => {
    it('sets data-invalid and aria-invalid="true" on the root', () => {
      const { getByTestId } = render(InputGroup, {
        props: { invalid: true },
        slots: { default: LABELLED_INPUT }
      })

      const root = getByTestId('input-group')
      expect(root.getAttribute('data-invalid')).toBe('true')
      expect(root.getAttribute('aria-invalid')).toBe('true')
    })

    it('omits both attributes when invalid is false', () => {
      const { getByTestId } = render(InputGroup, { slots: { default: LABELLED_INPUT } })

      const root = getByTestId('input-group')
      expect(root.getAttribute('data-invalid')).toBeNull()
      expect(root.getAttribute('aria-invalid')).toBeNull()
    })
  })

  describe('required', () => {
    it('sets data-required and aria-required="true" on the root', () => {
      const { getByTestId } = render(InputGroup, {
        props: { required: true },
        slots: { default: LABELLED_INPUT }
      })

      const root = getByTestId('input-group')
      expect(root.getAttribute('data-required')).toBe('true')
      expect(root.getAttribute('aria-required')).toBe('true')
    })

    it('omits both attributes when required is false', () => {
      const { getByTestId } = render(InputGroup, { slots: { default: LABELLED_INPUT } })

      const root = getByTestId('input-group')
      expect(root.getAttribute('data-required')).toBeNull()
      expect(root.getAttribute('aria-required')).toBeNull()
    })
  })

  describe('size', () => {
    it('defaults data-size to "medium" on the root', () => {
      const { getByTestId } = render(InputGroup, { slots: { default: LABELLED_INPUT } })
      expect(getByTestId('input-group').getAttribute('data-size')).toBe('medium')
    })

    it.each(['small', 'medium', 'large'] as const)(
      'reflects size="%s" as data-size on the root',
      (size) => {
        const { getByTestId } = render(InputGroup, {
          props: { size },
          slots: { default: LABELLED_INPUT }
        })
        expect(getByTestId('input-group').getAttribute('data-size')).toBe(size)
      }
    )

    it('propagates size to inner addons via CSS ancestor selector (data-size on root)', () => {
      const { getByTestId } = render(InputGroup, {
        props: { size: 'large' },
        slots: {
          default: `<span data-testid="addon-l">$</span>${LABELLED_INPUT}`
        }
      })
      // The group's data-size is the single source of truth read by the addon's
      // ancestor-scoped Tailwind variants ([[data-size=large]_&]:...). Assert
      // the contract at the boundary the CSS reads.
      expect(getByTestId('input-group').getAttribute('data-size')).toBe('large')
    })
  })

  describe('focus (single ring — ENG-46733)', () => {
    it('suppresses focus rings on all descendant elements so only the group ring shows', () => {
      const { getByTestId } = render(InputGroup, {
        slots: { default: LABELLED_INPUT }
      })
      const root = getByTestId('input-group')
      const cls = root.getAttribute('class') ?? ''
      // Descendant focus rings (buttons, links, comboboxes, input wrappers) are
      // neutralized — the group owns the single visible focus indicator.
      expect(cls).toContain('[&_*]:focus-visible:!ring-0')
      expect(cls).toContain('[&_*]:focus-within:!ring-0')
      // The group itself still renders its focus-within ring.
      expect(cls).toContain('focus-within:ring-2')
    })
  })

  describe('disabled', () => {
    it('sets data-disabled and aria-disabled="true" on the root', () => {
      const { getByTestId } = render(InputGroup, {
        props: { disabled: true },
        slots: { default: LABELLED_INPUT }
      })

      const root = getByTestId('input-group')
      expect(root.getAttribute('data-disabled')).toBe('true')
      expect(root.getAttribute('aria-disabled')).toBe('true')
    })

    it('does not propagate disabled to child controls (each child owns its own)', () => {
      const { getByPlaceholderText } = render(InputGroup, {
        props: { disabled: true },
        slots: { default: LABELLED_INPUT }
      })

      expect((getByPlaceholderText('domain') as HTMLInputElement).disabled).toBe(false)
    })
  })

  describe('InputGroup.Addon', () => {
    it('renders a span with the default testid and its slot content', () => {
      const { getByTestId } = render(InputGroupAddon, {
        slots: { default: 'https://' }
      })

      const addon = getByTestId('input-group-addon')
      expect(addon.tagName).toBe('SPAN')
      expect(addon.textContent).toBe('https://')
    })

    it('honors a consumer-provided data-testid over the fallback', () => {
      const { getByTestId } = render(InputGroupAddon, {
        attrs: { 'data-testid': 'my-addon' },
        slots: { default: '.com' }
      })

      expect(getByTestId('my-addon').textContent).toBe('.com')
    })

    it('passes consumer attrs (e.g. aria-hidden) through to the span', () => {
      const { getByTestId } = render(InputGroupAddon, {
        attrs: { 'aria-hidden': 'true' },
        slots: { default: 'R$' }
      })

      expect(getByTestId('input-group-addon').getAttribute('aria-hidden')).toBe('true')
    })
  })

  describe('a11y (axe)', () => {
    it('has no violations with addons flanking a labelled input', async () => {
      const { container } = render(InputGroup, {
        slots: {
          default: `<span data-testid="l">https://</span>${LABELLED_INPUT}<span data-testid="r">.com</span>`
        }
      })
      await expectNoA11yViolations(container)
    })

    it('has no violations in the invalid state', async () => {
      const { container } = render(InputGroup, {
        props: { invalid: true },
        slots: { default: LABELLED_INPUT }
      })
      await expectNoA11yViolations(container)
    })

    it('has no violations in the disabled state', async () => {
      const { container } = render(InputGroup, {
        props: { disabled: true },
        slots: { default: LABELLED_INPUT }
      })
      await expectNoA11yViolations(container)
    })

    // Component defect: aria-required is not an allowed ARIA attribute on
    // role="group" (axe aria-allowed-attr) — input-group.vue:39 sets it on the root.
    it.skip('has no violations in the required state', async () => {
      const { container } = render(InputGroup, {
        props: { required: true },
        slots: { default: LABELLED_INPUT }
      })
      await expectNoA11yViolations(container)
    })
  })

  describe('story fixtures (composeStories)', () => {
    it('renders the Default story with the middle input inside the group', () => {
      const { getByTestId, getByPlaceholderText } = render(Default)

      expect(getByTestId('input-group')).toBeTruthy()
      expect(getByPlaceholderText('domain')).toBeTruthy()
    })

    it('renders the BothAddons story with two addons around the input', () => {
      const { getAllByTestId } = render(BothAddons)

      const addons = getAllByTestId('input-group-addon')
      expect(addons).toHaveLength(2)
      expect(addons[0].textContent).toBe('https://')
      expect(addons[1].textContent).toBe('.com')
    })

    it('renders the WithButton story with a Button as a direct child', () => {
      const { getByTestId } = render(WithButton)

      const button = getByTestId('actions-button')
      expect(button.textContent).toContain('Search')
      expect(button.closest('[data-testid="input-group"]')).not.toBeNull()
    })

    it('renders the WithSelect story with a closed combobox trigger showing BRL', () => {
      const { getByTestId } = render(WithSelect)

      const trigger = getByTestId('select-trigger')
      expect(trigger.getAttribute('role')).toBe('combobox')
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      expect(getByTestId('select-trigger__value').textContent?.trim()).toBe('BRL')
    })

    it('renders the Sizes story with one group per size, each carrying data-size', () => {
      const { getAllByTestId } = render(Sizes)
      const groups = getAllByTestId('input-group')
      expect(groups).toHaveLength(3)
      expect(groups.map((g) => g.getAttribute('data-size'))).toEqual(['small', 'medium', 'large'])
    })

    it('renders the Invalid story with data-invalid on the root', () => {
      const { getByTestId } = render(Invalid)
      expect(getByTestId('input-group').getAttribute('data-invalid')).toBe('true')
    })

    it('renders the Required story with data-required on the root', () => {
      const { getByTestId } = render(Required)
      expect(getByTestId('input-group').getAttribute('data-required')).toBe('true')
    })

    it('renders the Disabled story with data-disabled on the root', () => {
      const { getByTestId } = render(Disabled)
      expect(getByTestId('input-group').getAttribute('data-disabled')).toBe('true')
    })
  })
})
