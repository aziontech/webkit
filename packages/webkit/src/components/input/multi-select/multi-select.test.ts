import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/multi-select/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import MultiSelect, {
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger
} from './index'

// Content Teleports to body, escaping the render container — query it from
// document.body and remove lingering listbox nodes between tests for isolation.
const cleanupTeleported = () => {
  document.body
    .querySelectorAll('[data-testid="multi-select-content"], [role="listbox"]')
    .forEach((el) => el.remove())
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
                    h(MultiSelectItem, { value: 'opt-1' }, { default: () => 'Option 1' }),
                    h(MultiSelectItem, { value: 'opt-2' }, { default: () => 'Option 2' })
                  ]
                }
              ),
              h(
                MultiSelectGroup,
                { label: 'Group B' },
                {
                  default: () => [
                    h(
                      MultiSelectItem,
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

describe('MultiSelect', () => {
  describe('composition / overlay', () => {
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
                      h(MultiSelectItem, { key: i, value: i }, { default: () => `Option ${i}` })
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
      expect(MultiSelect.Item).toBe(MultiSelectItem)
    })

    // A transform on an ancestor of the Teleport target becomes the fixed panel's
    // containing block, re-scaling its viewport top/left — a zoomed preview container
    // does exactly this.
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
                          h(MultiSelectItem, { key: i, value: `o-${i}` }, () => `Option ${i}`)
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

      const panel = document.body.querySelector<HTMLElement>(
        '[data-testid="multi-select-content"]'
      ) as HTMLElement
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

    it('closes from its own trigger on a real pointer click instead of reopening', async () => {
      const { getByTestId } = render(Harness, { props: { open: false } })
      cleanupTeleported()
      const trigger = getByTestId('multi-select-trigger')

      await userEvent.click(trigger)
      expect(listbox()).not.toBeNull()

      await userEvent.click(trigger)
      await nextTick()
      expect(listbox()).toBeNull()
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
      cleanupTeleported()
    })

    it('opens from the closed trigger with Home, End and a typed character', async () => {
      const { getByTestId } = render(Harness, { props: { open: false } })
      cleanupTeleported()
      const trigger = getByTestId('multi-select-trigger')
      const focused = () => (document.activeElement as HTMLElement | null)?.textContent?.trim()

      trigger.focus()
      await userEvent.keyboard('{End}')
      await vi.waitFor(() => expect(focused()).toBe('Option 2'))
      await userEvent.keyboard('{Escape}')
      await vi.waitFor(() => expect(listbox()).toBeNull())

      trigger.focus()
      await userEvent.keyboard('{Home}')
      await vi.waitFor(() => expect(focused()).toBe('Option 1'))
      cleanupTeleported()
    })

    it('names the listbox after the trigger label and keeps it free of axe violations', async () => {
      render(Harness, { props: { open: true } })
      await nextTick()
      await nextTick()
      const list = listbox() as HTMLElement
      expect(list.getAttribute('aria-label') ?? list.getAttribute('aria-labelledby')).toBeTruthy()
      await expectNoA11yViolations(list.parentElement as HTMLElement)
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
      const content = document.body.querySelector<HTMLElement>(
        '[data-testid="multi-select-content"]'
      )
      expect(content?.getAttribute('data-side')).toMatch(/^(bottom|top)$/)
      expect(content?.getAttribute('data-align')).toBe('start')

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
      expect(panel.querySelector('[data-testid="multi-select-item__indicator"]')).not.toBeNull()

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

    it('renders no hidden options while closed with nothing selected', async () => {
      const { getByTestId } = render(Harness, { props: { initial: [], open: false } })
      expect(document.querySelector('[data-testid="multi-select-content__labels"]')).toBeNull()
      expect(document.querySelectorAll('[role="option"]').length).toBe(0)
      expect(getByTestId('multi-select-trigger__value').textContent?.trim()).toBe('Pick options')
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

    it.each(['small', 'medium', 'large'] as const)(
      'carries data-size=%s on the trigger',
      (size) => {
        const { getByTestId } = render(Harness, { props: { open: false, size } })
        cleanupTeleported()
        expect(getByTestId('multi-select-trigger').getAttribute('data-size')).toBe(size)
      }
    )

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
                h(MultiSelectItem, { value: 'a', icon: 'ai ai-heart' }, () => 'With icon'),
                h(MultiSelectItem, { value: 'b' }, () => 'Without icon')
              ])
            ])
        }
      })

      render(WithIcons)
      await nextTick()

      const boxes = Array.from(
        document.body.querySelectorAll('[data-testid="multi-select-item__leading"]')
      ) as HTMLElement[]
      expect(boxes).toHaveLength(2)

      for (const box of boxes) {
        expect(box.className).toContain('size-4')
        expect(box.className).toContain('group-has-[[data-leading]]/options:flex')
      }

      expect(boxes[0].hasAttribute('data-leading')).toBe(true)
      expect(boxes[1].hasAttribute('data-leading')).toBe(false)
      expect(boxes[0].querySelector('i.ai-heart')).not.toBeNull()
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
                  h(MultiSelectItem, { value: 'a' }, () => 'A1')
                ]),
                h(MultiSelectGroup, { label: 'B' }, () => [
                  h(MultiSelectItem, { value: 'b' }, () => 'B1')
                ])
              ])
            ])
        }
      })

      render(Grouped)
      await nextTick()

      const groups = Array.from(
        document.body.querySelectorAll('[data-testid="multi-select-group"]')
      )
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

    it('typing a character moves focus to the next option whose label starts with it', async () => {
      await openWith('{Enter}')
      expect(focusedText()).toBe('Option 1')
      await userEvent.keyboard('o')
      expect(focusedText()).toBe('Option 2')
    })

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

  describe('defineModel', () => {
    const parts = () => [
      h(MultiSelectTrigger, { 'aria-label': 'Pick' }),
      h(MultiSelectContent, null, () => [
        h(MultiSelectItem, { value: 'a' }, () => 'Alpha'),
        h(MultiSelectItem, { value: 'b' }, () => 'Beta')
      ])
    ]
    const options = () => Array.from(document.body.querySelectorAll<HTMLElement>('[role="option"]'))

    it('keeps its own selection and open state when nothing is bound', async () => {
      const { getByTestId, emitted } = render(MultiSelect, {
        props: { defaultOpen: true },
        slots: { default: parts }
      })
      expect(getByTestId('multi-select').getAttribute('data-state')).toBe('open')

      await fireEvent.click(options()[0])
      await fireEvent.click(options()[1])
      await nextTick()

      expect(getByTestId('multi-select-trigger__value').textContent?.trim()).toBe('Alpha, Beta')
      expect(emitted()['update:modelValue']).toEqual([[['a']], [['a', 'b']]])
      expect(getByTestId('multi-select').getAttribute('data-state')).toBe('open')
      cleanupTeleported()
    })

    it('round-trips v-model and v-model:open with the parent', async () => {
      const value = ref<string[]>(['a'])
      const open = ref(false)
      const Parent = defineComponent({
        setup: () => () =>
          h(
            MultiSelect,
            {
              modelValue: value.value,
              'onUpdate:modelValue': (v: string[]) => (value.value = v),
              open: open.value,
              'onUpdate:open': (v: boolean) => (open.value = v)
            },
            parts
          )
      })
      const { getByTestId } = render(Parent)
      const root = getByTestId('multi-select')
      expect(root.getAttribute('data-state')).toBe('closed')

      await fireEvent.click(getByTestId('multi-select-trigger'))
      await nextTick()
      expect(open.value).toBe(true)
      expect(root.getAttribute('data-state')).toBe('open')

      await fireEvent.click(options()[1])
      await nextTick()
      expect(value.value).toEqual(['a', 'b'])

      value.value = []
      await nextTick()
      expect(root.hasAttribute('data-filled')).toBe(false)
      cleanupTeleported()
    })
  })

  describe('native form submit', () => {
    it('submits every selected value under its name', () => {
      const { getByTestId } = render(
        defineComponent({
          components: { MultiSelect, MultiSelectTrigger, MultiSelectContent, MultiSelectItem },
          setup: () => ({ value: ref(['edge', 'storage']) }),
          template: `
          <form data-testid="form">
            <MultiSelect v-model="value" name="products">
              <MultiSelectTrigger aria-label="Products" />
              <MultiSelectContent>
                <MultiSelectItem value="edge">Edge</MultiSelectItem>
                <MultiSelectItem value="storage">Storage</MultiSelectItem>
              </MultiSelectContent>
            </MultiSelect>
          </form>
        `
        })
      )
      expect(new FormData(getByTestId('form') as HTMLFormElement).getAll('products')).toEqual([
        'edge',
        'storage'
      ])
    })

    it('blocks an empty submit when required', () => {
      const { getByTestId } = render(
        defineComponent({
          components: { MultiSelect, MultiSelectTrigger },
          template: `
          <form data-testid="form">
            <MultiSelect name="products" required><MultiSelectTrigger aria-label="Products" /></MultiSelect>
          </form>
        `
        })
      )
      expect((getByTestId('form') as HTMLFormElement).checkValidity()).toBe(false)
    })
  })

  const FieldHarness = defineComponent({
    props: {
      variant: { type: String, default: 'chips' },
      searchable: { type: Boolean, default: false },
      allowCustom: { type: Boolean, default: false },
      filter: { type: Boolean, default: true },
      chipLimit: { type: Number, default: 0 },
      loading: { type: Boolean, default: false },
      error: { type: String, default: '' },
      emptyTitle: { type: String, default: '' },
      disabled: { type: Boolean, default: false },
      count: { type: Number, default: 4 },
      initial: { type: Array as () => string[], default: () => ['a', 'b'] }
    },
    emits: ['create', 'search'],
    setup(props) {
      const value = ref<string[]>([...props.initial])
      const open = ref(false)
      return { value, open }
    },
    render() {
      const labels = ['Alpha', 'Beta', 'Gamma', 'Délta']
      const options = Array.from({ length: this.count }, (_, i) => ({
        value: i < 4 ? 'abcd'[i] : `v${i}`,
        label: i < 4 ? labels[i] : `Option ${i}`
      }))
      return h(
        MultiSelect,
        {
          modelValue: this.value,
          'onUpdate:modelValue': (v: string[]) => {
            this.value = v
          },
          open: this.open,
          'onUpdate:open': (o: boolean) => {
            this.open = o
          },
          variant: this.variant,
          searchable: this.searchable,
          allowCustom: this.allowCustom,
          filter: this.filter,
          chipLimit: this.chipLimit,
          loading: this.loading,
          error: this.error,
          emptyTitle: this.emptyTitle,
          disabled: this.disabled,
          placeholder: 'Pick',
          'aria-label': 'Letters',
          onCreate: (event: Event, value: string) => this.$emit('create', event, value),
          onSearch: (text: string) => this.$emit('search', text)
        },
        {
          default: () => [
            h(MultiSelectTrigger),
            h(MultiSelectContent, null, {
              default: () =>
                options.map((o) =>
                  h(MultiSelectItem, { key: o.value, value: o.value }, () => o.label)
                )
            })
          ]
        }
      )
    }
  })

  const visibleOptions = () =>
    Array.from(
      document.body.querySelectorAll<HTMLElement>('[role="listbox"] [role="option"]')
    ).filter((el) => el.style.display !== 'none' && el.dataset['variant'] !== 'create')

  describe('chips, typed filter and list states (spec v4)', () => {
    it('renders one removable chip per selected value with its label', async () => {
      const { container } = render(FieldHarness)
      await nextTick()
      await nextTick()
      const chips = container.querySelectorAll('[data-testid="multi-select-trigger__chip"]')
      expect(Array.from(chips).map((c) => c.textContent?.trim())).toEqual(['Alpha', 'Beta'])
      const trigger = container.querySelector('[data-testid="multi-select-trigger"]')
      expect(trigger?.getAttribute('data-variant')).toBe('chips')
      expect(container.querySelector('[role="combobox"]')?.tagName).toBe('BUTTON')
      cleanupTeleported()
    })

    it('removing a chip updates the model without opening the panel', async () => {
      const { container, getByRole } = render(FieldHarness)
      await nextTick()
      await nextTick()
      await fireEvent.click(getByRole('button', { name: /Beta/ }))
      await nextTick()
      const chips = container.querySelectorAll('[data-testid="multi-select-trigger__chip"]')
      expect(Array.from(chips).map((c) => c.textContent?.trim())).toEqual(['Alpha'])
      expect(listbox()).toBeNull()
      cleanupTeleported()
    })

    it('caps chips at chipLimit with a +N more chip', async () => {
      const { container } = render(FieldHarness, {
        props: { chipLimit: 1, initial: ['a', 'b', 'c'] }
      })
      await nextTick()
      await nextTick()
      expect(container.querySelectorAll('[data-testid="multi-select-trigger__chip"]')).toHaveLength(
        1
      )
      expect(
        container.querySelector('[data-testid="multi-select-trigger__more"]')?.textContent
      ).toContain('+2 more')
      cleanupTeleported()
    })

    it('disabled chips are not removable', async () => {
      const { container } = render(FieldHarness, { props: { disabled: true } })
      await nextTick()
      expect(
        container.querySelector('[data-testid="multi-select-trigger"] button[aria-label^="Remove"]')
      ).toBeNull()
      cleanupTeleported()
    })

    it('typing filters the options (case and accent insensitive) and emits search', async () => {
      const { getByRole, emitted } = render(FieldHarness, { props: { searchable: true } })
      const input = getByRole('combobox') as HTMLInputElement
      expect(input.tagName).toBe('INPUT')
      expect(input.getAttribute('aria-autocomplete')).toBe('list')
      await userEvent.type(input, 'DEL')
      await nextTick()
      expect(listbox()).not.toBeNull()
      expect(visibleOptions().map((o) => o.textContent?.trim())).toEqual(['Délta'])
      expect(emitted('search')?.at(-1)).toEqual(['DEL'])
      cleanupTeleported()
    })

    it('shows the empty row and announces it when nothing matches', async () => {
      const { getByRole } = render(FieldHarness, {
        props: { searchable: true, emptyTitle: 'Nothing' }
      })
      await userEvent.type(getByRole('combobox'), 'zzz')
      await nextTick()
      expect(
        document.body.querySelector('[data-testid="multi-select-content__empty"]')?.textContent
      ).toContain('Nothing')
      expect(
        document.body.querySelector('[data-testid="multi-select-content__status"]')?.textContent
      ).toBe('Nothing')
      cleanupTeleported()
    })

    it('filter=false leaves every option visible for server-side search', async () => {
      const { getByRole } = render(FieldHarness, { props: { searchable: true, filter: false } })
      await userEvent.type(getByRole('combobox'), 'zzz')
      await nextTick()
      expect(visibleOptions()).toHaveLength(4)
      cleanupTeleported()
    })

    it('Backspace in an empty field removes the last chip', async () => {
      const { container, getByRole } = render(FieldHarness, { props: { searchable: true } })
      const input = getByRole('combobox')
      input.focus()
      await userEvent.keyboard('{Backspace}')
      await nextTick()
      const chips = container.querySelectorAll('[data-testid="multi-select-trigger__chip"]')
      expect(Array.from(chips).map((c) => c.textContent?.trim())).toEqual(['Alpha'])
      cleanupTeleported()
    })

    it('offers an Add row for unknown text and emits create (event, value) on Enter and click', async () => {
      const { getByRole, emitted } = render(FieldHarness, {
        props: { searchable: true, allowCustom: true }
      })
      const input = getByRole('combobox') as HTMLInputElement
      await userEvent.type(input, 'alpha')
      await nextTick()
      expect(document.body.querySelector('[data-testid="multi-select-content__create"]')).toBeNull()
      await userEvent.clear(input)
      await userEvent.type(input, ' Omega ')
      await nextTick()
      const row = document.body.querySelector<HTMLElement>(
        '[data-testid="multi-select-content__create"]'
      )
      expect(row?.getAttribute('role')).toBe('option')
      expect(row?.textContent).toContain('Add "Omega"')
      await userEvent.keyboard('{Enter}')
      const [event, value] = emitted('create')?.[0] as [Event, string]
      expect(event).toBeInstanceOf(KeyboardEvent)
      expect(value).toBe('Omega')
      expect(input.value).toBe('')
      await userEvent.type(input, 'Zeta')
      await nextTick()
      await fireEvent.click(
        document.body.querySelector('[data-testid="multi-select-content__create"]')!
      )
      expect((emitted('create')?.[1] as [Event, string])[1]).toBe('Zeta')
      cleanupTeleported()
    })

    it('ArrowDown from the field focuses the first visible option; Escape returns to the field', async () => {
      const { getByRole } = render(FieldHarness, { props: { searchable: true } })
      const input = getByRole('combobox')
      await userEvent.type(input, 'ga')
      await userEvent.keyboard('{ArrowDown}')
      await nextTick()
      expect(document.activeElement?.textContent?.trim()).toBe('Gamma')
      await userEvent.keyboard('{Escape}')
      await nextTick()
      await nextTick()
      expect(document.activeElement).toBe(input)
      expect(listbox()).toBeNull()
      cleanupTeleported()
    })

    it('loading and error replace the options with their rows', async () => {
      const { rerender } = render(FieldHarness, { props: { loading: true, variant: 'summary' } })
      await fireEvent.click(document.querySelector('[role="combobox"]')!)
      await nextTick()
      expect(listbox()?.getAttribute('aria-busy')).toBe('true')
      expect(
        document.body.querySelector('[data-testid="multi-select-content__loading"]')
      ).not.toBeNull()
      expect(visibleOptions()).toHaveLength(0)
      await rerender({ loading: false, error: 'Could not load' })
      await nextTick()
      expect(
        document.body.querySelector('[data-testid="multi-select-content__error"]')?.textContent
      ).toContain('Could not load')
      expect(visibleOptions()).toHaveLength(0)
      cleanupTeleported()
    })

    it('has no a11y violations as a searchable chips field', async () => {
      const { container, getByRole } = render(FieldHarness, {
        props: { searchable: true, allowCustom: true }
      })
      await userEvent.type(getByRole('combobox'), 'Om')
      await nextTick()
      await expectNoA11yViolations(container)
      cleanupTeleported()
    })

    it('filters 1,000 options as the person types', async () => {
      const { getByRole } = render(FieldHarness, { props: { searchable: true, count: 1000 } })
      await userEvent.type(getByRole('combobox'), 'Option 99')
      await nextTick()
      expect(visibleOptions().map((o) => o.textContent?.trim())).toEqual([
        'Option 99',
        ...Array.from({ length: 10 }, (_, i) => `Option ${990 + i}`)
      ])
      cleanupTeleported()
    })
  })
})
