import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Clickable from '../../../../examples/chip/clickable.vue'
import Default from '../../../../examples/chip/default.vue'
import Disabled from '../../../../examples/chip/disabled.vue'
import Removable from '../../../../examples/chip/removable.vue'
import Selectable from '../../../../examples/chip/selectable.vue'
import Sizes from '../../../../examples/chip/sizes.vue'
import Types from '../../../../examples/chip/variants.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Chip from './chip.vue'

describe('Chip', () => {
  it('renders a <span> root carrying the default data-testid and default size', () => {
    const { getByTestId } = render(Chip, { props: { label: 'Filter' } })

    const root = getByTestId('chip')
    expect(root.tagName).toBe('SPAN')
    expect(root).toHaveAttribute('data-size', 'medium')
    expect(root).toHaveAttribute('data-variant', 'filled')
  })

  it.each([
    ['filled', 'filled' as const],
    ['outline', 'outline' as const],
    ['dashed', 'dashed' as const]
  ])('maps variant=%s onto data-variant', (expected, variant) => {
    const { getByTestId } = render(Chip, { props: { label: 'K', variant: variant } })
    expect(getByTestId('chip')).toHaveAttribute('data-variant', expected)
  })

  it('shows the label prop text via the label sub-node', () => {
    const { getByTestId } = render(Chip, { props: { label: 'Production' } })

    expect(getByTestId('chip__label')).toHaveTextContent('Production')
  })

  it('renders default-slot content in place of the label fallback', () => {
    const { getByTestId, queryByTestId } = render(Chip, {
      props: { label: 'Fallback' },
      slots: { default: 'Slotted' }
    })

    // Slot wins: the label sub-node is not rendered when the slot is present.
    expect(queryByTestId('chip__label')).toBeNull()
    expect(getByTestId('chip')).toHaveTextContent('Slotted')
    expect(getByTestId('chip')).not.toHaveTextContent('Fallback')
  })

  it('sets data-size to the provided size token', () => {
    const { getByTestId } = render(Chip, { props: { label: 'Small', size: 'small' } })

    expect(getByTestId('chip')).toHaveAttribute('data-size', 'small')
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

    const root = getByTestId('chip')
    expect(root).toHaveAttribute('id', 'chip-id')
    expect(root).toHaveAttribute('title', 'a chip')
  })

  describe('removable', () => {
    it('renders no remove button and no data-removable by default', () => {
      const { getByTestId, queryByTestId } = render(Chip, { props: { label: 'Static' } })

      expect(getByTestId('chip')).not.toHaveAttribute('data-removable')
      expect(queryByTestId('chip__remove')).toBeNull()
    })

    it('renders a remove button whose accessible name NAMES what it removes', () => {
      const { getByTestId } = render(Chip, { props: { label: 'Removable', removable: true } })

      expect(getByTestId('chip')).toHaveAttribute('data-removable')

      const removeBtn = getByTestId('chip__remove')
      expect(removeBtn.tagName).toBe('BUTTON')
      expect(removeBtn).toHaveAttribute('type', 'button')
      // Four identical "Remove" controls in a row of chips are indistinguishable.
      expect(removeBtn).toHaveAttribute('aria-label', 'Remove Removable')

      const icon = getByTestId('chip__remove-icon')
      expect(icon).toHaveAttribute('aria-hidden', 'true')
    })

    it('falls back to a bare "Remove" name when there is no label', () => {
      const { getByTestId } = render(Chip, {
        props: { removable: true },
        slots: { default: 'Slotted' }
      })

      expect(getByTestId('chip__remove')).toHaveAttribute('aria-label', 'Remove')
    })

    it('wraps the remove control in a tooltip carrying the same text', async () => {
      const { getByTestId } = render(Chip, { props: { label: 'Env', removable: true } })

      const removeBtn = getByTestId('chip__remove')
      // The tooltip wrapper is the button's parent; hovering it reveals the text.
      await fireEvent.mouseEnter(removeBtn.parentElement as HTMLElement)
      await new Promise((resolve) => setTimeout(resolve, 350))

      expect(document.body.textContent).toContain('Remove Env')
    })

    it('emits "remove" immediately with the native MouseEvent and the label', async () => {
      const { getByTestId, emitted } = render(Chip, {
        props: { label: 'Dismiss me', removable: true }
      })

      await fireEvent.click(getByTestId('chip__remove'))

      expect(emitted('remove')).toHaveLength(1)
      expect(emitted<unknown[]>('remove')[0][0]).toBeInstanceOf(Event)
      expect(emitted<unknown[]>('remove')[0][1]).toBe('Dismiss me')
    })

    it('STAYS MOUNTED after remove — presence belongs to the consumer', async () => {
      const { getByTestId } = render(Chip, { props: { label: 'Survivor', removable: true } })

      await fireEvent.click(getByTestId('chip__remove'))

      // The chip must not hide or unmount itself: a filter bar keeps the field on
      // screen as an `outline` offer after its value is dropped, and a self-hiding
      // chip made that impossible (the instance stayed invisible forever).
      expect(getByTestId('chip')).toBeInTheDocument()
      expect(getByTestId('chip')).toBeVisible()
    })

    it('emits "remove" once per click, repeatedly', async () => {
      const { getByTestId, emitted } = render(Chip, {
        props: { label: 'Twice', removable: true }
      })

      const removeBtn = getByTestId('chip__remove')
      await fireEvent.click(removeBtn)
      await fireEvent.click(removeBtn)

      // No internal "already dismissed" latch swallowing the second activation.
      expect(emitted('remove')).toHaveLength(2)
    })

    it('declares no inline transition on the root, so consumer motion is not overridden', () => {
      const { getByTestId } = render(Chip, { props: { label: 'Motion', removable: true } })

      // An inline `style="transition: …"` beats every class, which silently discarded
      // any `transition-*` utility a consumer put on the chip.
      expect(getByTestId('chip').style.transition).toBe('')
    })

    it('does not emit "click" when the remove button is activated', async () => {
      const { getByTestId, emitted } = render(Chip, {
        props: { label: 'Both', removable: true, clickable: true }
      })

      await fireEvent.click(getByTestId('chip__remove'))

      expect(emitted('remove')).toHaveLength(1)
      expect(emitted().click).toBeUndefined()
    })
  })

  it.each([
    ['small', { label: 'S', size: 'small' as const }],
    ['medium', { label: 'M', size: 'medium' as const }]
  ])('renders the %s size variant', (size, props) => {
    const { getByTestId } = render(Chip, { props })
    expect(getByTestId('chip')).toHaveAttribute('data-size', size)
  })

  describe('clickable', () => {
    it('is a focusable role=button that emits click with the label', async () => {
      const { getByTestId, emitted } = render(Chip, {
        props: { label: 'Pick me', clickable: true }
      })

      const root = getByTestId('chip')
      expect(root).toHaveAttribute('role', 'button')
      expect(root).toHaveAttribute('tabindex', '0')

      await fireEvent.click(root)
      expect(emitted('click')).toHaveLength(1)
      expect(emitted<unknown[]>('click')[0][1]).toBe('Pick me')
    })

    it.each([['Enter'], [' ']])('activates on %s from the keyboard', async (key) => {
      const { getByTestId, emitted } = render(Chip, {
        props: { label: 'Key', clickable: true }
      })

      await fireEvent.keyDown(getByTestId('chip'), { key })
      expect(emitted('click')).toHaveLength(1)
    })

    it('emits nothing on activation when not clickable', async () => {
      const { getByTestId, emitted } = render(Chip, { props: { label: 'Inert' } })

      const root = getByTestId('chip')
      expect(root).not.toHaveAttribute('role')
      await fireEvent.click(root)
      expect(emitted().click).toBeUndefined()
    })
  })

  describe('selectable', () => {
    it('is a focusable toggle button that starts unpressed', () => {
      const { getByTestId } = render(Chip, { props: { label: 'Env', selectable: true } })

      const root = getByTestId('chip')
      expect(root).toHaveAttribute('role', 'button')
      expect(root).toHaveAttribute('tabindex', '0')
      expect(root).toHaveAttribute('aria-pressed', 'false')
      expect(root).not.toHaveAttribute('data-selected')
    })

    it('toggles on click, keeps the state, and emits update:selected with the new value', async () => {
      const { getByTestId, emitted } = render(Chip, { props: { label: 'Env', selectable: true } })

      const root = getByTestId('chip')
      await fireEvent.click(root)

      expect(root).toHaveAttribute('aria-pressed', 'true')
      expect(root).toHaveAttribute('data-selected')
      expect(emitted('update:selected')).toEqual([[true]])

      await fireEvent.click(root)

      expect(root).toHaveAttribute('aria-pressed', 'false')
      expect(root).not.toHaveAttribute('data-selected')
      expect(emitted('update:selected')).toEqual([[true], [false]])
    })

    it('still emits click with the event first and the label second', async () => {
      const { getByTestId, emitted } = render(Chip, { props: { label: 'Env', selectable: true } })

      await fireEvent.click(getByTestId('chip'))

      expect(emitted('click')).toHaveLength(1)
      expect(emitted<unknown[]>('click')[0][0]).toBeInstanceOf(Event)
      expect(emitted<unknown[]>('click')[0][1]).toBe('Env')
    })

    it.each([['Enter'], [' ']])('toggles on %s from the keyboard', async (key) => {
      const { getByTestId, emitted } = render(Chip, { props: { label: 'Env', selectable: true } })

      const root = getByTestId('chip')
      await fireEvent.keyDown(root, { key })

      expect(root).toHaveAttribute('aria-pressed', 'true')
      expect(emitted('update:selected')).toEqual([[true]])
    })

    it('round-trips a controlled v-model:selected', async () => {
      const state = ref(true)
      const Host = defineComponent({
        setup: () => () =>
          h(Chip, {
            label: 'Env',
            selectable: true,
            selected: state.value,
            'onUpdate:selected': (value: boolean) => {
              state.value = value
            }
          })
      })
      const { getByTestId } = render(Host)

      const root = getByTestId('chip')
      expect(root).toHaveAttribute('aria-pressed', 'true')

      await fireEvent.click(root)
      expect(state.value).toBe(false)
      expect(root).toHaveAttribute('aria-pressed', 'false')

      state.value = true
      await nextTick()
      expect(root).toHaveAttribute('aria-pressed', 'true')
      expect(root).toHaveAttribute('data-selected')
    })

    it('does not toggle or emit when disabled', async () => {
      const { getByTestId, emitted } = render(Chip, {
        props: { label: 'Env', selectable: true, disabled: true }
      })

      const root = getByTestId('chip')
      expect(root).toHaveAttribute('aria-disabled', 'true')
      expect(root).not.toHaveAttribute('tabindex')

      await fireEvent.click(root)
      await fireEvent.keyDown(root, { key: 'Enter' })

      expect(root).toHaveAttribute('aria-pressed', 'false')
      expect(emitted('update:selected')).toBeUndefined()
      expect(emitted().click).toBeUndefined()
    })

    it('gives a non-selectable chip no toggle semantics', () => {
      const { getAllByTestId } = render({
        components: { Chip },
        template: '<div><Chip label="Plain" /><Chip label="Pick" clickable /></div>'
      })

      for (const chip of getAllByTestId('chip')) {
        expect(chip).not.toHaveAttribute('aria-pressed')
        expect(chip).not.toHaveAttribute('data-selected')
        expect(chip).not.toHaveAttribute('data-disabled')
        expect(chip).not.toHaveAttribute('aria-disabled')
      }
    })

    it('composes the Selectable story fixture as independent toggles', async () => {
      const { getAllByTestId } = render(Selectable)

      const chips = getAllByTestId('chip')
      expect(chips.map((chip) => chip.getAttribute('aria-pressed'))).toEqual([
        'true',
        'false',
        'false'
      ])

      await fireEvent.click(chips[1])
      expect(chips.map((chip) => chip.getAttribute('aria-pressed'))).toEqual([
        'true',
        'true',
        'false'
      ])
    })

    it('has no a11y violations unpressed and pressed', async () => {
      const { container, getByTestId } = render(Chip, {
        props: { label: 'Env', selectable: true }
      })
      await expectNoA11yViolations(container)

      await fireEvent.click(getByTestId('chip'))
      expect(getByTestId('chip')).toHaveAttribute('aria-pressed', 'true')
      await expectNoA11yViolations(container)
    })
  })

  describe('disabled', () => {
    it('suppresses click on a clickable chip', async () => {
      const { getByTestId, emitted } = render(Chip, {
        props: { label: 'Pick', clickable: true, disabled: true }
      })

      const root = getByTestId('chip')
      expect(root).toHaveAttribute('data-disabled')
      expect(root).toHaveAttribute('aria-disabled', 'true')

      await fireEvent.click(root)
      expect(emitted().click).toBeUndefined()
    })

    it('disables the remove control', async () => {
      const { getByTestId, emitted } = render(Chip, {
        props: { label: 'Env', removable: true, disabled: true }
      })

      expect(getByTestId('chip')).toHaveAttribute('aria-disabled', 'true')
      const removeBtn = getByTestId('chip__remove')
      expect(removeBtn).toBeDisabled()

      await fireEvent.click(removeBtn)
      expect(emitted('remove')).toBeUndefined()
    })
  })

  describe('accessibility', () => {
    it('has no a11y violations for a plain labelled chip', async () => {
      const { container } = render(Chip, { props: { label: 'Accessible' } })
      await expectNoA11yViolations(container)
    })

    it('keeps the remove button beside, not inside, the button of a clickable removable chip', async () => {
      const { getByTestId, emitted, container } = render(Chip, {
        props: { label: 'Region', clickable: true, removable: true }
      })
      const root = getByTestId('chip')
      const body = getByTestId('chip__body')
      const remove = getByTestId('chip__remove')

      expect(root).not.toHaveAttribute('role')
      expect(root).not.toHaveAttribute('tabindex')
      expect(body).toHaveAttribute('role', 'button')
      expect(body).toHaveAttribute('tabindex', '0')
      expect(body.contains(remove)).toBe(false)

      body.focus()
      await fireEvent.keyDown(body, { key: 'Enter' })
      expect(emitted('click')).toHaveLength(1)
      await fireEvent.click(remove)
      expect(emitted('remove')).toHaveLength(1)
      expect(emitted('click')).toHaveLength(1)
      await expectNoA11yViolations(container)
    })

    it('puts aria-pressed on the body of a selectable removable chip', async () => {
      const { getByTestId } = render(Chip, {
        props: { label: 'Region', selectable: true, removable: true }
      })
      const body = getByTestId('chip__body')
      expect(body).toHaveAttribute('aria-pressed', 'false')
      await fireEvent.click(body)
      expect(body).toHaveAttribute('aria-pressed', 'true')
    })

    it('has no a11y violations for a removable chip (labelled remove button)', async () => {
      const { container } = render(Chip, { props: { label: 'Accessible', removable: true } })
      await expectNoA11yViolations(container)
    })
  })

  it('composes the Default story fixture', () => {
    const { getByTestId } = render(Default)

    expect(getByTestId('chip')).toHaveTextContent('Label')
    expect(getByTestId('chip')).toHaveAttribute('data-size', 'medium')
    expect(getByTestId('chip')).not.toHaveAttribute('data-removable')
  })

  it('composes the Types story fixture with all three variants', () => {
    const { getAllByTestId } = render(Types)

    const variants = getAllByTestId('chip').map((chip) => chip.getAttribute('data-variant'))
    expect(variants).toEqual(expect.arrayContaining(['filled', 'outline', 'dashed']))
  })

  it('composes the Sizes story fixture with both size tokens', () => {
    const { getAllByTestId } = render(Sizes)

    const chips = getAllByTestId('chip')
    const sizes = chips.map((chip) => chip.getAttribute('data-size'))
    expect(sizes).toContain('small')
    expect(sizes).toContain('medium')
  })

  it('composes the Removable story fixture with the remove button', () => {
    const { getByTestId } = render(Removable)

    expect(getByTestId('chip')).toHaveAttribute('data-removable')
    expect(getByTestId('chip__remove')).toHaveAttribute('aria-label', 'Remove Label')
  })

  it('composes the Clickable story fixture as an interactive root', () => {
    const { getByTestId } = render(Clickable)

    expect(getByTestId('chip')).toHaveAttribute('data-clickable')
    expect(getByTestId('chip')).toHaveAttribute('role', 'button')
  })

  it('draws an applied filter (clickable + removable) as the default filled variant, with a body and a named remove control', async () => {
    const { getByTestId, container } = render(Chip, {
      props: { label: 'Period', clickable: true, removable: true }
    })

    const root = getByTestId('chip')
    expect(root).toHaveAttribute('data-variant', 'filled')
    expect(root).not.toHaveAttribute('data-selected')
    expect(getByTestId('chip__body')).toHaveAttribute('role', 'button')
    expect(getByTestId('chip__remove')).toHaveAccessibleName('Remove Period')
    await expectNoA11yViolations(container)
  })

  it('keeps a filled toggle off until it is activated, so the fill never reads as selected', async () => {
    const { getByTestId } = render(Chip, {
      props: { label: 'Production', selectable: true }
    })

    const root = getByTestId('chip')
    expect(root).toHaveAttribute('data-variant', 'filled')
    expect(root).toHaveAttribute('aria-pressed', 'false')
    expect(root).not.toHaveAttribute('data-selected')

    await fireEvent.click(root)
    expect(root).toHaveAttribute('aria-pressed', 'true')
    expect(root).toHaveAttribute('data-selected')
  })

  describe('accessibility of the new variants', () => {
    it.each([['outline' as const], ['dashed' as const]])(
      'has no a11y violations for a clickable %s chip',
      async (variant) => {
        const { container } = render(Chip, {
          props: { label: 'Offer', variant: variant, clickable: true }
        })
        await expectNoA11yViolations(container)
      }
    )
  })

  describe('remove touch target', () => {
    it.each(['small', 'medium'] as const)('extends the %s remove hit area', (size) => {
      const { getByTestId } = render(Chip, { props: { label: 'region', removable: true, size } })
      const target = getByTestId('chip__remove').querySelector('[data-slot="touch-target"]')
      expect(target?.getAttribute('aria-hidden')).toBe('true')
    })

    it('does not clip the remove hit area to the chip edge', () => {
      const { getByTestId } = render(Chip, { props: { label: 'region', removable: true } })
      let node: HTMLElement | null = getByTestId('chip__remove').parentElement
      while (node && node !== getByTestId('chip').parentElement) {
        expect(node.classList).not.toContain('overflow-hidden')
        node = node.parentElement
      }
    })
  })

  describe('Disabled example', () => {
    it('renders a disabled remove button', () => {
      const { getAllByTestId } = render(Disabled)
      expect((getAllByTestId('chip__remove')[0] as HTMLButtonElement).disabled).toBe(true)
    })
  })
})
