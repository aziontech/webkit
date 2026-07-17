import { composeStories } from '@storybook/vue3'
import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/chip/Chip.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Chip from './chip.vue'

const { Default, Sizes, Removable } = composeStories(stories)

// @testing-library/vue mounts through @vue/test-utils, which stubs <Transition>
// by default. The stub skips the JS transition lifecycle, so the component's
// `@after-leave` (which emits `remove`) never fires. Rendering the REAL
// transition lets the fade-out run and fire `@after-leave` as it does in prod.
const realTransition = { global: { stubs: { transition: false } } }

describe('Chip', () => {
  it('renders a <span> root carrying the default data-testid and default size', () => {
    const { getByTestId } = render(Chip, { props: { label: 'Filter' } })

    const root = getByTestId('input-chip')
    expect(root.tagName).toBe('SPAN')
    expect(root).toHaveAttribute('data-size', 'medium')
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

    it('renders a remove button with the Remove aria-label and an aria-hidden icon when removable', () => {
      const { getByTestId } = render(Chip, { props: { label: 'Removable', removable: true } })

      expect(getByTestId('input-chip')).toHaveAttribute('data-removable')

      const removeBtn = getByTestId('input-chip__remove')
      expect(removeBtn.tagName).toBe('BUTTON')
      expect(removeBtn).toHaveAttribute('type', 'button')
      expect(removeBtn).toHaveAttribute('aria-label', 'Remove')

      const icon = getByTestId('input-chip__remove-icon')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })

    it('emits "remove" with the native MouseEvent after the dismiss fade completes', async () => {
      const { getByTestId, queryByTestId, emitted } = render(Chip, {
        props: { label: 'Dismiss me', removable: true },
        ...realTransition
      })

      await fireEvent.click(getByTestId('input-chip__remove'))

      // "remove" is emitted from @after-leave, once the leave transition ends.
      await waitFor(() => {
        expect(emitted('remove')).toHaveLength(1)
      })
      // Payload is the native MouseEvent forwarded from the button click.
      expect(emitted('remove')[0][0]).toBeInstanceOf(Event)

      // After the transition, the chip is unmounted.
      await waitFor(() => {
        expect(queryByTestId('input-chip')).toBeNull()
      })
    })

    it('does not emit "remove" a second time on a repeated click after dismissal starts', async () => {
      const { getByTestId, emitted } = render(Chip, {
        props: { label: 'Once', removable: true },
        ...realTransition
      })

      const removeBtn = getByTestId('input-chip__remove')
      await fireEvent.click(removeBtn)
      // Second click while already leaving: onRemove guards on visible.value.
      await fireEvent.click(removeBtn)

      await waitFor(() => {
        expect(emitted('remove')).toHaveLength(1)
      })
    })
  })

  it.each([
    ['small', { label: 'S', size: 'small' as const }],
    ['medium', { label: 'M', size: 'medium' as const }]
  ])('renders the %s size variant', (size, props) => {
    const { getByTestId } = render(Chip, { props })
    expect(getByTestId('input-chip')).toHaveAttribute('data-size', size)
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
    expect(getByTestId('input-chip__remove')).toHaveAttribute('aria-label', 'Remove')
  })
})
