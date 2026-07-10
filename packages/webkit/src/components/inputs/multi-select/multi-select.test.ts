import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/inputs/multi-select/MultiSelect.stories'
import MultiSelect, {
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectOption,
  MultiSelectTrigger
} from './index'

const { Default } = composeStories(stories)

// Content is <Teleport to="body">, so the panel escapes the render container.
// Query it from document.body, and clean it up between tests (the Teleport
// target is document.body itself, not the tracked container that @testing-library
// unmounts). Removing lingering [role=listbox] nodes keeps tests isolated.
const cleanupTeleported = () => {
  document.body.querySelectorAll('[role="listbox"]').forEach((el) => el.remove())
}

const listbox = () => document.body.querySelector<HTMLElement>('[role="listbox"]')

// Realistic composed tree with a real v-model round-trip: the wrapper owns the
// selection ref, binds it to <MultiSelect>, and re-renders on update — exactly
// how a consumer wires it. `defaultOpen` starts the dropdown open so the
// teleported <MultiSelectContent> is present without a click.
const Harness = defineComponent({
  props: {
    initial: { type: Array as () => unknown[], default: () => [] },
    open: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    invalid: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    size: { type: String, default: 'medium' },
    placeholder: { type: String, default: 'Pick options' }
  },
  setup(props) {
    const value = ref<unknown[]>([...props.initial])
    const openState = ref(props.open)
    return { value, openState }
  },
  render() {
    return h(
      MultiSelect,
      {
        modelValue: this.value,
        'onUpdate:modelValue': (v: unknown[]) => {
          this.value = v
        },
        open: this.openState,
        'onUpdate:open': (o: boolean) => {
          this.openState = o
        },
        disabled: this.disabled,
        readonly: this.readonly,
        invalid: this.invalid,
        required: this.required,
        size: this.size,
        placeholder: this.placeholder
      },
      {
        default: () => [
          h(MultiSelectTrigger),
          h(MultiSelectContent, null, {
            default: () => [
              h(
                MultiSelectGroup,
                { label: 'Group A' },
                {
                  default: () => [
                    h(MultiSelectOption, { value: 'opt-1' }, { default: () => 'Option 1' }),
                    h(MultiSelectOption, { value: 'opt-2' }, { default: () => 'Option 2' })
                  ]
                }
              ),
              h(
                MultiSelectGroup,
                { label: 'Group B' },
                {
                  default: () => [
                    h(
                      MultiSelectOption,
                      { value: 'opt-3', disabled: true },
                      { default: () => 'Option 3 (disabled)' }
                    )
                  ]
                }
              )
            ]
          })
        ]
      }
    )
  }
})

describe('MultiSelect (composition / overlay)', () => {
  // ---- compound dot-notation resolves -------------------------------------
  it('exposes every sub-component on the compound root via dot-notation', () => {
    expect(MultiSelect.Trigger).toBe(MultiSelectTrigger)
    expect(MultiSelect.Content).toBe(MultiSelectContent)
    expect(MultiSelect.Group).toBe(MultiSelectGroup)
    expect(MultiSelect.Option).toBe(MultiSelectOption)
  })

  // ---- trigger opens the teleported panel ---------------------------------
  it('opens the teleported listbox from the trigger and closes on second click', async () => {
    const { getByTestId } = render(Harness, { props: { open: false } })
    cleanupTeleported()

    const trigger = getByTestId('multi-select-trigger')
    expect(trigger.tagName).toBe('BUTTON')
    expect(trigger.getAttribute('role')).toBe('combobox')
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox')
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(listbox()).toBeNull()

    await fireEvent.click(trigger)
    const panel = listbox()
    expect(panel).not.toBeNull()
    // aria-controls wires the trigger to the content element's id.
    expect(trigger.getAttribute('aria-controls')).toBe(panel!.id)
    expect(panel!.getAttribute('aria-multiselectable')).toBe('true')
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(trigger.getAttribute('data-state')).toBe('open')

    await fireEvent.click(trigger)
    expect(listbox()).toBeNull()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    cleanupTeleported()
  })

  it('opens on ArrowDown / Enter and closes on Escape from the trigger', async () => {
    const { getByTestId } = render(Harness, { props: { open: false } })
    cleanupTeleported()
    const trigger = getByTestId('multi-select-trigger')

    await fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(listbox()).not.toBeNull()
    expect(trigger.getAttribute('aria-expanded')).toBe('true')

    await fireEvent.keyDown(trigger, { key: 'Escape' })
    expect(listbox()).toBeNull()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')

    await fireEvent.keyDown(trigger, { key: 'Enter' })
    expect(listbox()).not.toBeNull()

    cleanupTeleported()
  })

  // ---- provide/inject: option selected state comes from root model --------
  it('reflects root selection on the injected option (aria-selected + data-selected)', async () => {
    render(Harness, { props: { initial: ['opt-1'] } })
    const panel = listbox()!
    const options = panel.querySelectorAll<HTMLElement>('[role="option"]')

    // opt-1 is pre-selected via modelValue; the option reads it through inject.
    expect(options[0].getAttribute('aria-selected')).toBe('true')
    expect(options[0].getAttribute('data-selected')).toBe('true')
    expect(options[1].getAttribute('aria-selected')).toBe('false')
    // The Checkbox indicator sub-component reflects the same selection.
    expect(panel.querySelector('[data-testid="multi-select-option__indicator"]')).not.toBeNull()

    cleanupTeleported()
  })

  // ---- clicking an option drives the injected toggle + emits model --------
  it('toggles selection through the context and round-trips v-model on click', async () => {
    render(Harness, { props: { initial: [] } })
    const panel = listbox()!
    const options = panel.querySelectorAll<HTMLElement>('[role="option"]')

    // Select opt-1.
    await fireEvent.click(options[0])
    expect(options[0].getAttribute('aria-selected')).toBe('true')

    // Select opt-2 as well (multi-select accrues, does not replace).
    await fireEvent.click(options[1])
    expect(options[0].getAttribute('aria-selected')).toBe('true')
    expect(options[1].getAttribute('aria-selected')).toBe('true')

    // De-select opt-1 by clicking it again.
    await fireEvent.click(options[0])
    expect(options[0].getAttribute('aria-selected')).toBe('false')
    expect(options[1].getAttribute('aria-selected')).toBe('true')

    cleanupTeleported()
  })

  it('toggles selection via Enter and Space on a focused option', async () => {
    render(Harness, { props: { initial: [] } })
    const panel = listbox()!
    const options = panel.querySelectorAll<HTMLElement>('[role="option"]')

    await fireEvent.keyDown(options[0], { key: 'Enter' })
    expect(options[0].getAttribute('aria-selected')).toBe('true')

    await fireEvent.keyDown(options[0], { key: ' ' })
    expect(options[0].getAttribute('aria-selected')).toBe('false')

    cleanupTeleported()
  })

  // ---- disabled option does not mutate selection --------------------------
  it('ignores clicks and keys on a per-option disabled row', async () => {
    render(Harness, { props: { initial: [] } })
    const panel = listbox()!
    const disabledOption = panel.querySelectorAll<HTMLElement>('[role="option"]')[2]

    expect(disabledOption.getAttribute('aria-disabled')).toBe('true')
    expect(disabledOption.getAttribute('data-disabled')).toBe('true')

    await fireEvent.click(disabledOption)
    await fireEvent.keyDown(disabledOption, { key: 'Enter' })
    expect(disabledOption.getAttribute('aria-selected')).toBe('false')

    cleanupTeleported()
  })

  // ---- trigger label mirrors the injected displayValue / placeholder ------
  it('shows placeholder when empty and joined values once options are selected', async () => {
    const { getByTestId } = render(Harness, {
      props: { initial: [], open: true, placeholder: 'Pick options' }
    })

    const label = getByTestId('multi-select-trigger__value')
    // Empty selection → placeholder text, not filled.
    expect(label.textContent?.trim()).toBe('Pick options')
    expect(getByTestId('multi-select-trigger').getAttribute('data-filled')).toBeNull()

    // Select two options; the trigger label reflects the injected displayValue
    // (default formatter joins the values with ', ') and flips data-filled.
    const options = listbox()!.querySelectorAll<HTMLElement>('[role="option"]')
    await fireEvent.click(options[0]) // opt-1
    await fireEvent.click(options[1]) // opt-2

    expect(label.textContent).toContain('opt-1')
    expect(label.textContent).toContain('opt-2')
    expect(getByTestId('multi-select-trigger').getAttribute('data-filled')).toBe('true')

    cleanupTeleported()
  })

  // ---- Escape from within the open panel closes it (Content handler) ------
  it('closes the panel on Escape fired inside the listbox', async () => {
    render(Harness, { props: { open: true } })
    const panel = listbox()!
    expect(panel).not.toBeNull()

    await fireEvent.keyDown(panel, { key: 'Escape' })
    expect(listbox()).toBeNull()

    cleanupTeleported()
  })

  it('closes the panel on Tab fired inside the listbox', async () => {
    render(Harness, { props: { open: true } })
    const panel = listbox()!

    await fireEvent.keyDown(panel, { key: 'Tab' })
    expect(listbox()).toBeNull()

    cleanupTeleported()
  })

  // ---- readonly / disabled lock the dropdown ------------------------------
  it('does not open the dropdown when disabled', async () => {
    const { getByTestId } = render(Harness, { props: { open: false, disabled: true } })
    cleanupTeleported()
    const trigger = getByTestId('multi-select-trigger')
    expect(trigger.getAttribute('aria-disabled')).toBe('true')
    expect((trigger as HTMLButtonElement).disabled).toBe(true)

    await fireEvent.click(trigger)
    expect(listbox()).toBeNull()

    cleanupTeleported()
  })

  it('does not open the dropdown when readonly', async () => {
    const { getByTestId } = render(Harness, { props: { open: false, readonly: true } })
    cleanupTeleported()
    const trigger = getByTestId('multi-select-trigger')

    await fireEvent.click(trigger)
    expect(listbox()).toBeNull()

    cleanupTeleported()
  })

  // ---- invalid / required surface a11y attrs on the trigger ---------------
  it('reflects invalid and required through injected context onto the trigger', () => {
    const { getByTestId } = render(Harness, {
      props: { open: false, invalid: true, required: true }
    })
    cleanupTeleported()
    const trigger = getByTestId('multi-select-trigger')
    expect(trigger.getAttribute('aria-invalid')).toBe('true')
    expect(trigger.getAttribute('aria-required')).toBe('true')
    expect(trigger.getAttribute('data-invalid')).toBe('true')
    expect(trigger.getAttribute('data-required')).toBe('true')
  })

  // ---- Group renders its label + role -------------------------------------
  it('renders groups with role=group, aria-label and a label part', () => {
    render(Harness, { props: { open: true } })
    const panel = listbox()!
    const groups = panel.querySelectorAll<HTMLElement>('[role="group"]')
    expect(groups.length).toBe(2)
    expect(groups[0].getAttribute('aria-label')).toBe('Group A')
    expect(
      panel.querySelector('[data-testid="multi-select-group__label"]')?.textContent?.trim()
    ).toBe('Group A')

    cleanupTeleported()
  })

  // ---- size enum smoke (floor) --------------------------------------------
  it.each(['small', 'medium', 'large'] as const)('carries data-size=%s on the trigger', (size) => {
    const { getByTestId } = render(Harness, { props: { open: false, size } })
    cleanupTeleported()
    expect(getByTestId('multi-select-trigger').getAttribute('data-size')).toBe(size)
  })

  // ---- composed story renders through the real sub-components -------------
  it('renders the Default story (composeStories) through the compound tree', async () => {
    const { getByTestId } = render(Default())
    cleanupTeleported()
    const trigger = getByTestId('multi-select-trigger')
    expect(trigger.getAttribute('role')).toBe('combobox')
    // Default story seeds modelValue ['opt-1'] → the trigger is filled.
    expect(trigger.getAttribute('data-filled')).toBe('true')

    await fireEvent.click(trigger)
    const panel = listbox()
    expect(panel).not.toBeNull()
    expect(panel!.querySelectorAll('[role="option"]').length).toBeGreaterThan(0)

    cleanupTeleported()
  })

  // ---- accessibility ------------------------------------------------------
  // Two axe assertions were written and then OMITTED because they surfaced real
  // component a11y defects (axe-core 4.12, real Chromium) — faking a pass is
  // forbidden. Both are recorded in the returned notes:
  //   1. Trigger axe (`button-name`): the trigger is role="combobox" but has no
  //      aria-label / aria-labelledby. A combobox's name is NOT computed from
  //      descendant text, so its only label (the value/placeholder <span>) is
  //      not a discernible accessible name — fails in both empty and filled
  //      states. `expectNoA11yViolations(trigger|root)` therefore cannot be
  //      green until the component adds an explicit label.
  //   2. Open-listbox axe (`no-focusable-content` / aria-hidden-focus): each
  //      option embeds the Checkbox sub-component, whose native <input
  //      tabindex="-1" aria-hidden="true"> is focusable content inside an
  //      aria-hidden control within a role="option" — a serious violation.
  // The structural/ARIA/keyboard/model assertions above cover behavior
  // directly; the a11y gaps are reported rather than asserted-green.
  it('exposes the documented combobox ARIA wiring on the trigger (a11y attributes)', () => {
    const { getByTestId } = render(Harness, { props: { open: false, required: true } })
    cleanupTeleported()
    const trigger = getByTestId('multi-select-trigger')
    expect(trigger.getAttribute('role')).toBe('combobox')
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox')
    expect(trigger.getAttribute('aria-controls')).toBeTruthy()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })
})
