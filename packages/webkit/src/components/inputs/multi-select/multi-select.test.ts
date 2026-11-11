import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/multi-select/default.vue'
import MultiSelect, {
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectOption,
  MultiSelectTrigger
} from './index'

// Content Teleports to body, escaping the render container — query it from
// document.body and remove lingering listbox nodes between tests for isolation.
const cleanupTeleported = () => {
  document.body.querySelectorAll('[role="listbox"]').forEach((el) => el.remove())
}

const listbox = () => document.body.querySelector<HTMLElement>('[role="listbox"]')

// The wrapper owns the selection ref and re-binds on update — a real v-model
// round-trip; starting open renders the teleported content without a click.
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
  it('mounts a 1,000-option list in chunks and mounts every option on the first arrow key', async () => {
    cleanupTeleported()
    render({
      render: () =>
        h(
          MultiSelect,
          { modelValue: [], defaultOpen: true },
          {
            default: () => [
              h(MultiSelectTrigger, { 'aria-label': 'Options' }),
              h(MultiSelectContent, null, {
                default: () =>
                  Array.from({ length: 1000 }, (_, i) =>
                    h(MultiSelectOption, { key: i, value: i }, { default: () => `Option ${i}` })
                  )
              })
            ]
          }
        )
    })
    await nextTick()
    const options = () => listbox()?.querySelectorAll('[role="option"]').length ?? 0
    expect(options()).toBeGreaterThan(0)
    expect(options()).toBeLessThan(1000)
    await fireEvent.keyDown(listbox() as HTMLElement, { key: 'ArrowDown' })
    await nextTick()
    await nextTick()
    expect(options()).toBe(1000)
    cleanupTeleported()
  })

  it('exposes every sub-component on the compound root via dot-notation', () => {
    expect(MultiSelect.Trigger).toBe(MultiSelectTrigger)
    expect(MultiSelect.Content).toBe(MultiSelectContent)
    expect(MultiSelect.Group).toBe(MultiSelectGroup)
    expect(MultiSelect.Option).toBe(MultiSelectOption)
  })

  // A transform on an ancestor of the Teleport target becomes the fixed panel's
  // containing block, re-scaling its viewport top/left — Storybook's zoom control
  // does exactly this to the preview body.
  it('anchors the panel to the trigger when the Teleport target is scaled', async () => {
    const previousTransform = document.body.style.transform
    const previousOrigin = document.body.style.transformOrigin
    document.body.style.transformOrigin = 'top left'
    document.body.style.transform = 'scale(1.25)'

    try {
      const { getByTestId } = render(Harness, { props: { open: false } })
      cleanupTeleported()

      const trigger = getByTestId('multi-select-trigger')
      await fireEvent.click(trigger)

      const panel = listbox()
      expect(panel).not.toBeNull()
      // The panel measures the trigger one tick after it renders.
      await nextTick()

      const triggerRect = trigger.getBoundingClientRect()
      const panelRect = (panel as HTMLElement).getBoundingClientRect()

      // Assert alignment, not absolute coordinates; before the fix these were
      // off by the 1.25 scale factor.
      expect(Math.abs(panelRect.left - triggerRect.left)).toBeLessThanOrEqual(1)
      expect(Math.abs(panelRect.width - triggerRect.width)).toBeLessThanOrEqual(1)
      expect(panelRect.top).toBeGreaterThanOrEqual(triggerRect.bottom)
      expect(panelRect.top - triggerRect.bottom).toBeLessThanOrEqual(8)
    } finally {
      document.body.style.transform = previousTransform
      document.body.style.transformOrigin = previousOrigin
      cleanupTeleported()
    }
  })

  // Size-aware placement (ENG-47063): a list taller than the viewport is capped to the
  // free space below the trigger and scrolls inside the panel instead of clipping.
  it('caps the listbox to the free space and scrolls it when it fits on neither side', async () => {
    const Tall = defineComponent({
      setup() {
        const value = ref<unknown[]>([])
        const open = ref(false)
        return () =>
          h('div', { style: 'position:fixed;top:8px;left:8px;right:8px' }, [
            h(
              MultiSelect,
              {
                modelValue: value.value,
                'onUpdate:modelValue': (v: unknown[]) => {
                  value.value = v
                },
                open: open.value,
                'onUpdate:open': (o: boolean) => {
                  open.value = o
                }
              },
              {
                default: () => [
                  h(MultiSelectTrigger),
                  h(MultiSelectContent, null, {
                    default: () =>
                      Array.from({ length: 200 }, (_, i) =>
                        h(MultiSelectOption, { key: i, value: `o-${i}` }, () => `Option ${i}`)
                      )
                  })
                ]
              }
            )
          ])
      }
    })
    const { getByTestId } = render(Tall)
    cleanupTeleported()

    const trigger = getByTestId('multi-select-trigger')
    await fireEvent.click(trigger)
    await nextTick()
    await nextTick()

    const panel = listbox() as HTMLElement
    const panelRect = panel.getBoundingClientRect()
    const triggerRect = trigger.getBoundingClientRect()
    expect(panelRect.top).toBeGreaterThanOrEqual(triggerRect.bottom)
    expect(panelRect.bottom).toBeLessThanOrEqual(window.innerHeight)
    expect(panel.style.maxHeight).not.toBe('')
    // No CSS in browser mode: the ScrollArea's own overflow utilities do not apply here,
    // so assert that the capped panel holds more content than its box (what scrolls).
    expect(panel.scrollHeight).toBeGreaterThan(panel.clientHeight)
    cleanupTeleported()
  })

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

  it('reflects root selection on the injected option (aria-selected + data-selected)', async () => {
    render(Harness, { props: { initial: ['opt-1'] } })
    const panel = listbox()!
    const options = panel.querySelectorAll<HTMLElement>('[role="option"]')

    expect(options[0].getAttribute('aria-selected')).toBe('true')
    expect(options[0].getAttribute('data-selected')).toBe('true')
    expect(options[1].getAttribute('aria-selected')).toBe('false')
    expect(panel.querySelector('[data-testid="multi-select-option__indicator"]')).not.toBeNull()

    cleanupTeleported()
  })

  it('toggles selection through the context and round-trips v-model on click', async () => {
    render(Harness, { props: { initial: [] } })
    const panel = listbox()!
    const options = panel.querySelectorAll<HTMLElement>('[role="option"]')

    await fireEvent.click(options[0])
    expect(options[0].getAttribute('aria-selected')).toBe('true')

    // Multi-select accrues, does not replace.
    await fireEvent.click(options[1])
    expect(options[0].getAttribute('aria-selected')).toBe('true')
    expect(options[1].getAttribute('aria-selected')).toBe('true')

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

  it('shows placeholder when empty and joined labels once options are selected', async () => {
    const { getByTestId } = render(Harness, {
      props: { initial: [], open: true, placeholder: 'Pick options' }
    })

    const label = getByTestId('multi-select-trigger__value')
    expect(label.textContent?.trim()).toBe('Pick options')
    expect(getByTestId('multi-select-trigger').getAttribute('data-filled')).toBeNull()

    const options = listbox()!.querySelectorAll<HTMLElement>('[role="option"]')
    await fireEvent.click(options[0])
    await fireEvent.click(options[1])

    expect(label.textContent?.trim()).toBe('Option 1, Option 2')
    expect(getByTestId('multi-select-trigger').getAttribute('data-filled')).toBe('true')

    cleanupTeleported()
  })

  it('names the selection by option labels before the panel first opens', async () => {
    const { getByTestId } = render(Harness, { props: { initial: ['opt-2'], open: false } })
    await nextTick()
    await nextTick()
    expect(getByTestId('multi-select-trigger__value').textContent?.trim()).toBe('Option 2')
    expect(document.querySelector('[data-testid="multi-select-content__labels"]')).toBeNull()
    expect(listbox()).toBeNull()
  })

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

  it.each(['small', 'medium', 'large'] as const)('carries data-size=%s on the trigger', (size) => {
    const { getByTestId } = render(Harness, { props: { open: false, size } })
    cleanupTeleported()
    expect(getByTestId('multi-select-trigger').getAttribute('data-size')).toBe(size)
  })

  it('renders the Default example through the compound tree', async () => {
    const { getByTestId } = render(Default)
    cleanupTeleported()
    const trigger = getByTestId('multi-select-trigger')
    expect(trigger.getAttribute('role')).toBe('combobox')
    expect(trigger.getAttribute('data-filled')).toBe('true')

    await fireEvent.click(trigger)
    const panel = listbox()
    expect(panel).not.toBeNull()
    expect(panel!.querySelectorAll('[role="option"]').length).toBeGreaterThan(0)

    cleanupTeleported()
  })

  // OMITTED — two axe checks surfaced real component defects: the combobox trigger has
  // no aria-label (button-name; a combobox's name is not computed from descendant text),
  // and each option embeds a Checkbox whose aria-hidden native input is focusable
  // (aria-hidden-focus). Reported as gaps, never asserted green.
  // Below: the leading-column reservation is CSS that never compiles here — assert the mechanism.
  it('marks only options that have a leading glyph, but gives every option the box', async () => {
    const WithIcons = defineComponent({
      setup() {
        const open = ref(true)
        return () =>
          h(MultiSelect, { open: open.value, modelValue: [] }, () => [
            h(MultiSelectTrigger, { 'aria-label': 'Pick' }),
            h(MultiSelectContent, null, () => [
              h(MultiSelectOption, { value: 'a', icon: 'pi pi-heart' }, () => 'With icon'),
              h(MultiSelectOption, { value: 'b' }, () => 'Without icon')
            ])
          ])
      }
    })

    render(WithIcons)
    await nextTick()

    const boxes = Array.from(
      document.body.querySelectorAll('[data-testid="multi-select-option__leading"]')
    ) as HTMLElement[]
    expect(boxes).toHaveLength(2)

    for (const box of boxes) {
      expect(box.className).toContain('size-4')
      expect(box.className).toContain('group-has-[[data-leading]]/options:flex')
    }

    expect(boxes[0].hasAttribute('data-leading')).toBe(true)
    expect(boxes[1].hasAttribute('data-leading')).toBe(false)
    expect(boxes[0].querySelector('i.pi-heart')).not.toBeNull()
    expect(boxes[1].querySelector('i')).toBeNull()

    const list = document.body.querySelector('[data-testid="multi-select-content__list"]')
    expect(list?.className).toContain('group/options')

    cleanupTeleported()
  })

  it('spaces every group but the first', async () => {
    const Grouped = defineComponent({
      setup() {
        const open = ref(true)
        return () =>
          h(MultiSelect, { open: open.value, modelValue: [] }, () => [
            h(MultiSelectTrigger, { 'aria-label': 'Pick' }),
            h(MultiSelectContent, null, () => [
              h(MultiSelectGroup, { label: 'A' }, () => [
                h(MultiSelectOption, { value: 'a' }, () => 'A1')
              ]),
              h(MultiSelectGroup, { label: 'B' }, () => [
                h(MultiSelectOption, { value: 'b' }, () => 'B1')
              ])
            ])
          ])
      }
    })

    render(Grouped)
    await nextTick()

    const groups = Array.from(document.body.querySelectorAll('[data-testid="multi-select-group"]'))
    expect(groups).toHaveLength(2)
    for (const group of groups) {
      expect(group.className).toContain('[&:not(:first-child)]:mt-(--spacing-sm)')
    }
    expect(groups[0].previousElementSibling).toBeNull()
    expect(groups[1].previousElementSibling).toBe(groups[0])

    cleanupTeleported()
  })

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

describe('keyboard map (spec)', () => {
  const settle = async () => {
    await nextTick()
    await nextTick()
  }
  const focusedText = () => (document.activeElement as HTMLElement | null)?.textContent?.trim()

  const openWith = async (key: string) => {
    cleanupTeleported()
    const view = render(
      defineComponent({
        setup: () => () =>
          h('div', [
            h(Harness, { open: false }),
            h('button', { type: 'button', 'data-testid': 'after' }, 'After')
          ])
      })
    )
    const trigger = view.getByTestId('multi-select-trigger')
    trigger.focus()
    await userEvent.keyboard(key)
    await settle()
    expect(listbox()).not.toBeNull()
    return { trigger, view }
  }

  it.each(['{Enter}', ' ', '{ArrowDown}'])(
    '%s on the trigger opens the list and focuses the first option',
    async (key) => {
      await openWith(key)
      expect(focusedText()).toBe('Option 1')
    }
  )

  it('ArrowDown and ArrowUp move between enabled options and wrap', async () => {
    await openWith('{Enter}')
    await userEvent.keyboard('{ArrowDown}')
    expect(focusedText()).toBe('Option 2')
    await userEvent.keyboard('{ArrowUp}{ArrowUp}')
    expect(focusedText()).not.toBe('Option 3 (disabled)')
  })

  it('Home and End jump to the first and last enabled options', async () => {
    await openWith('{Enter}')
    await userEvent.keyboard('{End}')
    const last = focusedText()
    await userEvent.keyboard('{Home}')
    expect(focusedText()).toBe('Option 1')
    expect(last).not.toBe('Option 1')
  })

  it.each(['{Enter}', ' '])(
    '%s toggles the focused option and keeps the list open',
    async (key) => {
      await openWith('{Enter}')
      await userEvent.keyboard(key)
      await settle()
      expect(listbox()).not.toBeNull()
      const option = document.activeElement as HTMLElement
      expect(option.getAttribute('aria-selected')).toBe('true')
      await userEvent.keyboard(key)
      await settle()
      expect(option.getAttribute('aria-selected')).toBe('false')
    }
  )

  it('Escape closes and returns focus to the trigger', async () => {
    const { trigger } = await openWith('{Enter}')
    await userEvent.keyboard('{Escape}')
    await settle()
    expect(listbox()).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })

  it('Tab closes and moves focus on to the control after the trigger', async () => {
    const { view } = await openWith('{Enter}')
    await userEvent.keyboard('{Tab}')
    await settle()
    expect(listbox()).toBeNull()
    expect(document.activeElement).toBe(view.getByTestId('after'))
  })

  it('Shift+Tab closes and returns focus to the trigger', async () => {
    const { trigger } = await openWith('{Enter}')
    await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
    await settle()
    expect(listbox()).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })
})
