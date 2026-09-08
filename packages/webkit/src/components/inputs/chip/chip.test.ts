import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/chip/Chip.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Chip from './chip.vue'

const { Clickable, Default, Removable, Sizes, Types } = composeStories(stories)

describe('Chip', () => {
  it('renders a <span> root carrying the default data-testid and default size', () => {
    const { getByTestId } = render(Chip, { props: { label: 'Filter' } })

    const root = getByTestId('input-chip')
    expect(root.tagName).toBe('SPAN')
    expect(root).toHaveAttribute('data-size', 'medium')
    expect(root).toHaveAttribute('data-kind', 'filled')
  })

  it.each([
    ['filled', 'filled' as const],
    ['outlined', 'outlined' as const],
    ['dashed', 'dashed' as const]
  ])('maps kind=%s onto data-kind', (expected, kind) => {
    const { getByTestId } = render(Chip, { props: { label: 'K', kind } })
    expect(getByTestId('input-chip')).toHaveAttribute('data-kind', expected)
  })

  it('shows the label prop text via the label sub-node', () => {
    const { getByTestId } = render(Chip, { props: { label: 'Production' } })

    expect(getByTestId('input-chip__label')).toHaveTextContent('Production')
  })

  it('renders default-slot content in place of the label fallback', () => {
    const { getByTestId, queryByTestId } = render(Chip, {
      props: { label: 'Fallback' },
      slots: { default: 'Slotted' }
    })

    // Slot wins: the label sub-node is not rendered when the slot is present.
    expect(queryByTestId('input-chip__label')).toBeNull()
    expect(getByTestId('input-chip')).toHaveTextContent('Slotted')
    expect(getByTestId('input-chip')).not.toHaveTextContent('Fallback')
  })

  it('sets data-size to the provided size token', () => {
    const { getByTestId } = render(Chip, { props: { label: 'Small', size: 'small' } })

    expect(getByTestId('input-chip')).toHaveAttribute('data-size', 'small')
  })

  it('honours a consumer-supplied data-testid on the root and derived sub-nodes', () => {
    const { getByTestId } = render(Chip, {
      props: { label: 'Env', removable: true },
      attrs: { 'data-testid': 'my-chip' }
    })

    expect(getByTestId('my-chip').tagName).toBe('SPAN')
    expect(getByTestId('my-chip__label')).toHaveTextContent('Env')
    expect(getByTestId('my-chip__remove')).toBeInTheDocument()
  })

  it('forwards arbitrary attributes onto the root via $attrs', () => {
    const { getByTestId } = render(Chip, {
      props: { label: 'Attr' },
      attrs: { id: 'chip-id', title: 'a chip' }
    })

    const root = getByTestId('input-chip')
    expect(root).toHaveAttribute('id', 'chip-id')
    expect(root).toHaveAttribute('title', 'a chip')
  })

  describe('removable', () => {
    it('renders no remove button and no data-removable by default', () => {
      const { getByTestId, queryByTestId } = render(Chip, { props: { label: 'Static' } })

      expect(getByTestId('input-chip')).not.toHaveAttribute('data-removable')
      expect(queryByTestId('input-chip__remove')).toBeNull()
    })

    it('renders a remove button whose accessible name NAMES what it removes', () => {
      const { getByTestId } = render(Chip, { props: { label: 'Removable', removable: true } })

      expect(getByTestId('input-chip')).toHaveAttribute('data-removable')

      const removeBtn = getByTestId('input-chip__remove')
      expect(removeBtn.tagName).toBe('BUTTON')
      expect(removeBtn).toHaveAttribute('type', 'button')
      // Four identical "Remove" controls in a row of chips are indistinguishable.
      expect(removeBtn).toHaveAttribute('aria-label', 'Remove Removable')

      const icon = getByTestId('input-chip__remove-icon')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })

    it('falls back to a bare "Remove" name when there is no label', () => {
      const { getByTestId } = render(Chip, {
        props: { removable: true },
        slots: { default: 'Slotted' }
      })

      expect(getByTestId('input-chip__remove')).toHaveAttribute('aria-label', 'Remove')
    })

    it('wraps the remove control in a tooltip carrying the same text', async () => {
      const { getByTestId } = render(Chip, { props: { label: 'Env', removable: true } })

      const removeBtn = getByTestId('input-chip__remove')
      // The tooltip wrapper is the button's parent; hovering it reveals the text.
      await fireEvent.mouseEnter(removeBtn.parentElement as HTMLElement)
      await new Promise((resolve) => setTimeout(resolve, 350))

      expect(document.body.textContent).toContain('Remove Env')
    })

    it('emits "remove" immediately with the native MouseEvent and the label', async () => {
      const { getByTestId, emitted } = render(Chip, {
        props: { label: 'Dismiss me', removable: true }
      })

      await fireEvent.click(getByTestId('input-chip__remove'))

      expect(emitted('remove')).toHaveLength(1)
      expect(emitted('remove')[0][0]).toBeInstanceOf(Event)
      expect(emitted('remove')[0][1]).toBe('Dismiss me')
    })

    it('STAYS MOUNTED after remove — presence belongs to the consumer', async () => {
      const { getByTestId } = render(Chip, { props: { label: 'Survivor', removable: true } })

      await fireEvent.click(getByTestId('input-chip__remove'))

      // The chip must not hide or unmount itself: a filter bar keeps the field on
      // screen as an `outlined` offer after its value is dropped, and a self-hiding
      // chip made that impossible (the instance stayed invisible forever).
      expect(getByTestId('input-chip')).toBeInTheDocument()
      expect(getByTestId('input-chip')).toBeVisible()
    })

    it('emits "remove" once per click, repeatedly', async () => {
      const { getByTestId, emitted } = render(Chip, {
        props: { label: 'Twice', removable: true }
      })

      const removeBtn = getByTestId('input-chip__remove')
      await fireEvent.click(removeBtn)
      await fireEvent.click(removeBtn)

      // No internal "already dismissed" latch swallowing the second activation.
      expect(emitted('remove')).toHaveLength(2)
    })

    it('declares no inline transition on the root, so consumer motion is not overridden', () => {
      const { getByTestId } = render(Chip, { props: { label: 'Motion', removable: true } })

      // An inline `style="transition: …"` beats every class, which silently discarded
      // any `transition-*` utility a consumer put on the chip.
      expect(getByTestId('input-chip').style.transition).toBe('')
    })

    it('does not emit "click" when the remove button is activated', async () => {
      const { getByTestId, emitted } = render(Chip, {
        props: { label: 'Both', removable: true, clickable: true }
      })

      await fireEvent.click(getByTestId('input-chip__remove'))

      expect(emitted('remove')).toHaveLength(1)
      expect(emitted().click).toBeUndefined()
    })
  })

  it.each([
    ['small', { label: 'S', size: 'small' as const }],
    ['medium', { label: 'M', size: 'medium' as const }]
  ])('renders the %s size variant', (size, props) => {
    const { getByTestId } = render(Chip, { props })
    expect(getByTestId('input-chip')).toHaveAttribute('data-size', size)
  })

  describe('clickable', () => {
    it('is a focusable role=button that emits click with the label', async () => {
      const { getByTestId, emitted } = render(Chip, {
        props: { label: 'Pick me', clickable: true }
      })

      const root = getByTestId('input-chip')
      expect(root).toHaveAttribute('role', 'button')
      expect(root).toHaveAttribute('tabindex', '0')

      await fireEvent.click(root)
      expect(emitted('click')).toHaveLength(1)
      expect(emitted('click')[0][1]).toBe('Pick me')
    })

    it.each([['Enter'], [' ']])('activates on %s from the keyboard', async (key) => {
      const { getByTestId, emitted } = render(Chip, {
        props: { label: 'Key', clickable: true }
      })

      await fireEvent.keyDown(getByTestId('input-chip'), { key })
      expect(emitted('click')).toHaveLength(1)
    })

    it('emits nothing on activation when not clickable', async () => {
      const { getByTestId, emitted } = render(Chip, { props: { label: 'Inert' } })

      const root = getByTestId('input-chip')
      expect(root).not.toHaveAttribute('role')
      await fireEvent.click(root)
      expect(emitted().click).toBeUndefined()
    })
  })

  describe('accessibility', () => {
    it('has no a11y violations for a plain labelled chip', async () => {
      const { container } = render(Chip, { props: { label: 'Accessible' } })
      await expectNoA11yViolations(container)
    })

    it('has no a11y violations for a removable chip (labelled remove button)', async () => {
      const { container } = render(Chip, { props: { label: 'Accessible', removable: true } })
      await expectNoA11yViolations(container)
    })
  })

  it('composes the Default story fixture', () => {
    const { getByTestId } = render(Default())

    expect(getByTestId('input-chip')).toHaveTextContent('Label')
    expect(getByTestId('input-chip')).toHaveAttribute('data-size', 'medium')
    expect(getByTestId('input-chip')).not.toHaveAttribute('data-removable')
  })

  it('composes the Types story fixture with all three kinds', () => {
    const { getAllByTestId } = render(Types())

    const kinds = getAllByTestId('input-chip').map((chip) => chip.getAttribute('data-kind'))
    expect(kinds).toEqual(expect.arrayContaining(['filled', 'outlined', 'dashed']))
  })

  it('composes the Sizes story fixture with both size tokens', () => {
    const { getAllByTestId } = render(Sizes())

    const chips = getAllByTestId('input-chip')
    const sizes = chips.map((chip) => chip.getAttribute('data-size'))
    expect(sizes).toContain('small')
    expect(sizes).toContain('medium')
  })

  it('composes the Removable story fixture with the remove button', () => {
    const { getByTestId } = render(Removable())

    expect(getByTestId('input-chip')).toHaveAttribute('data-removable')
    expect(getByTestId('input-chip__remove')).toHaveAttribute('aria-label', 'Remove Label')
  })

  it('composes the Clickable story fixture as an interactive root', () => {
    const { getByTestId } = render(Clickable())

    expect(getByTestId('input-chip')).toHaveAttribute('data-clickable')
    expect(getByTestId('input-chip')).toHaveAttribute('role', 'button')
  })

  describe('accessibility of the new kinds', () => {
    it.each([['outlined' as const], ['dashed' as const]])(
      'has no a11y violations for a clickable %s chip',
      async (kind) => {
        const { container } = render(Chip, {
          props: { label: 'Offer', kind, clickable: true }
        })
        await expectNoA11yViolations(container)
      }
    )
  })
})
