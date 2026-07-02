import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/overlay/Tooltip.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Tooltip from './tooltip.vue'

const { Default } = composeStories(stories)

// The tooltip panel is Teleported to <body> (escapes the render container), so
// it must be queried from document.body — not the utils container. A frame or
// two lets onMounted (keydown listener) + the enter Transition mount settle.
const settle = async () => {
  await nextTick()
  await nextTick()
}

const byTestId = (id: string) => document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)

const panel = () => byTestId('overlay-tooltip__panel')

// The trigger slot is a plain <button> so the trigger has something focusable
// and interactive to hover/focus, exactly like the Storybook default.
const composed = (props: Record<string, unknown> = {}) =>
  defineComponent({
    components: { Tooltip },
    setup() {
      return { props }
    },
    template: `
      <Tooltip v-bind="props" text="Delete domain">
        <button type="button">Trigger</button>
      </Tooltip>
    `
  })

afterEach(async () => {
  await settle()
})

describe('Tooltip (overlay: Teleport, data-state, hover/focus/Escape)', () => {
  describe('closed state', () => {
    it('renders the trigger with data-state=closed and no Teleported panel', async () => {
      const { getByTestId } = render(composed())
      await settle()

      const trigger = getByTestId('overlay-tooltip')
      expect(trigger.getAttribute('data-state')).toBe('closed')
      // aria-describedby is only wired while open.
      expect(trigger.getAttribute('aria-describedby')).toBeNull()
      // The panel (v-if="isOpen && text") is not mounted while closed.
      expect(panel()).toBeNull()
    })
  })

  describe('opening on focus (immediate, no delay)', () => {
    it('focusin Teleports a role=tooltip panel to document.body and wires aria-describedby', async () => {
      const { getByTestId } = render(composed())
      await settle()

      const trigger = getByTestId('overlay-tooltip')
      // @focusin="setOpen(true)" opens synchronously (bypasses the hover delay).
      await fireEvent.focusIn(trigger)
      await settle()

      expect(trigger.getAttribute('data-state')).toBe('open')

      const tip = panel()
      expect(tip).not.toBeNull()
      expect(tip!.getAttribute('role')).toBe('tooltip')
      expect(tip!.textContent).toContain('Delete domain')

      // The trigger's aria-describedby points at the panel's id (tooltipId).
      const describedBy = trigger.getAttribute('aria-describedby')
      expect(describedBy).not.toBeNull()
      expect(tip!.getAttribute('id')).toBe(describedBy)
      expect(tip!.getAttribute('aria-hidden')).toBe('false')
    })
  })

  describe('closing behaviors', () => {
    it('mouseleave closes an open tooltip', async () => {
      const { getByTestId } = render(composed())
      await settle()

      const trigger = getByTestId('overlay-tooltip')
      await fireEvent.focusIn(trigger)
      await settle()
      expect(panel()).not.toBeNull()

      // @mouseleave="closeTooltip"
      await fireEvent.mouseLeave(trigger)
      await settle()

      expect(trigger.getAttribute('data-state')).toBe('closed')
      expect(panel()).toBeNull()
    })

    it('Escape closes an open tooltip', async () => {
      const { getByTestId } = render(composed())
      await settle()

      const trigger = getByTestId('overlay-tooltip')
      await fireEvent.focusIn(trigger)
      await settle()
      expect(panel()).not.toBeNull()

      // A document-level keydown listener handles Escape while open.
      await fireEvent.keyDown(document, { key: 'Escape' })
      await settle()

      expect(trigger.getAttribute('data-state')).toBe('closed')
      expect(panel()).toBeNull()
    })

    it('focusout to an element outside the trigger closes it', async () => {
      const { getByTestId } = render(composed())
      await settle()

      const trigger = getByTestId('overlay-tooltip')
      await fireEvent.focusIn(trigger)
      await settle()
      expect(panel()).not.toBeNull()

      // onFocusOut closes when relatedTarget is not inside the trigger.
      await fireEvent.focusOut(trigger, { relatedTarget: document.body })
      await settle()

      expect(trigger.getAttribute('data-state')).toBe('closed')
      expect(panel()).toBeNull()
    })
  })

  describe('hover open delay', () => {
    it('mouseenter opens only after the configured delay', async () => {
      vi.useFakeTimers()
      try {
        const { getByTestId } = render(composed({ delay: 200 }))
        await nextTick()

        const trigger = getByTestId('overlay-tooltip')
        // scheduleOpen sets a timeout; nothing opens synchronously.
        await fireEvent.mouseEnter(trigger)
        await nextTick()
        expect(trigger.getAttribute('data-state')).toBe('closed')
        expect(panel()).toBeNull()

        // Advance past the delay -> setOpen(true) fires.
        vi.advanceTimersByTime(200)
        await nextTick()
        await nextTick()

        expect(trigger.getAttribute('data-state')).toBe('open')
        expect(panel()).not.toBeNull()
      } finally {
        vi.useRealTimers()
      }
    })
  })

  describe('v-model:open round-trips', () => {
    it('emits update:open(true) when focus opens it', async () => {
      const onUpdate = vi.fn()
      const { getByTestId } = render(Tooltip, {
        props: { text: 'Hint', 'onUpdate:open': onUpdate },
        slots: { default: () => h('button', { type: 'button' }, 'Trigger') }
      })
      await settle()

      await fireEvent.focusIn(getByTestId('overlay-tooltip'))
      await settle()

      expect(onUpdate).toHaveBeenCalledWith(true)
    })

    it('emits update:open(false) when it closes, and a controlled parent drives open', async () => {
      const onUpdate = vi.fn()
      const Wrapper = defineComponent({
        components: { Tooltip },
        setup() {
          const open = ref(true)
          const onUpd = (v: boolean) => {
            open.value = v
            onUpdate(v)
          }
          return { open, onUpd }
        },
        template: `
          <Tooltip text="Hint" :open="open" @update:open="onUpd">
            <button type="button">Trigger</button>
          </Tooltip>
        `
      })

      const { getByTestId } = render(Wrapper)
      await settle()

      // Parent seeds open=true (controlled) -> panel is shown.
      const trigger = getByTestId('overlay-tooltip')
      expect(trigger.getAttribute('data-state')).toBe('open')
      expect(panel()).not.toBeNull()

      await fireEvent.keyDown(document, { key: 'Escape' })
      await settle()

      expect(onUpdate).toHaveBeenLastCalledWith(false)
      expect(trigger.getAttribute('data-state')).toBe('closed')
      expect(panel()).toBeNull()
    })
  })

  // NOTE: the `show` / `hide` events are intentionally omitted. They are emitted
  // from the panel's <Transition> @before-enter / @before-leave hooks. In this
  // headless Chromium environment those JS transition-lifecycle hooks never fire
  // (probed directly: the panel mounts, but onShow stays at 0 calls after 400ms),
  // so an honest assertion is impossible without faking it. The sibling
  // dialog/drawer overlay tests skip their transition-lifecycle events for the
  // same reason. `update:open` (covered above) is the reliable open/close signal.

  describe('disabled suppresses activation', () => {
    it('does not open on focus and reflects data-disabled', async () => {
      const { getByTestId } = render(composed({ disabled: true }))
      await settle()

      const trigger = getByTestId('overlay-tooltip')
      expect(trigger.getAttribute('data-disabled')).toBe('true')

      // setOpen no-ops while disabled.
      await fireEvent.focusIn(trigger)
      await settle()

      expect(trigger.getAttribute('data-state')).toBe('closed')
      expect(panel()).toBeNull()
    })
  })

  describe('empty text never surfaces a panel', () => {
    it('focus does not open when text is empty', async () => {
      const { getByTestId } = render(Tooltip, {
        props: { text: '' },
        slots: { default: () => h('button', { type: 'button' }, 'Trigger') }
      })
      await settle()

      const trigger = getByTestId('overlay-tooltip')
      // setOpen guards `if (!props.text && next) return`.
      await fireEvent.focusIn(trigger)
      await settle()

      expect(trigger.getAttribute('data-state')).toBe('closed')
      expect(panel()).toBeNull()
    })
  })

  describe('placement is reflected on trigger and panel', () => {
    // Floor smoke over the four sides: each opens a panel and both the trigger
    // and panel carry the SAME resolved data-placement. We do not assert the
    // resolved side equals the requested side: usePlacement is collision-aware
    // and flips to the opposite side when the requested one overflows the
    // viewport (the trigger renders near the top-left, so `top`/`left` legitimately
    // resolve to `bottom`/`right`). The invariant under test is trigger↔panel
    // agreement on a valid resolved side.
    const SIDES = ['top', 'right', 'bottom', 'left']
    it.each(['top', 'right', 'bottom', 'left'] as const)(
      'requested placement=%s opens and reflects a consistent resolved data-placement',
      async (placement) => {
        const { getByTestId } = render(composed({ placement, defaultOpen: true }))
        await settle()

        const trigger = getByTestId('overlay-tooltip')
        expect(trigger.getAttribute('data-state')).toBe('open')

        const tip = panel()
        expect(tip).not.toBeNull()

        const resolved = trigger.getAttribute('data-placement')
        expect(SIDES).toContain(resolved)
        // Trigger and panel always agree on the resolved side.
        expect(tip!.getAttribute('data-placement')).toBe(resolved)
      }
    )
  })

  describe('defaultOpen (uncontrolled)', () => {
    it('mounts already open when defaultOpen is set', async () => {
      const { getByTestId } = render(composed({ defaultOpen: true }))
      await settle()

      expect(getByTestId('overlay-tooltip').getAttribute('data-state')).toBe('open')
      expect(panel()).not.toBeNull()
    })
  })

  describe('accessibility (axe on the open, Teleported tooltip)', () => {
    it('the open, Teleported panel has no WCAG violations', async () => {
      render(composed({ defaultOpen: true }))
      await settle()

      const tip = panel()
      expect(tip).not.toBeNull()
      // Scope axe to the Teleported panel itself — the component's a11y-critical
      // output (role=tooltip, aria-hidden=false, theme-CSS text/bg contrast).
      // Running over the whole document.body would trip axe's best-practice
      // `region` rule on the bare test-harness content (a role=tooltip node is
      // not a landmark), which is a harness artifact, not a tooltip defect.
      await expectNoA11yViolations(tip!)
    })

    it('the trigger exposes a valid aria-describedby relationship while open', async () => {
      const { getByTestId } = render(composed({ defaultOpen: true }))
      await settle()

      const trigger = getByTestId('overlay-tooltip')
      // Scope axe to the trigger: validates the aria-describedby attribute value
      // and role semantics on the component's own root element.
      await expectNoA11yViolations(trigger)
    })
  })

  describe('Storybook Default story renders and opens', () => {
    it('composes the Default trigger and opens on focus', async () => {
      const { getByTestId } = render(Default())
      await settle()

      const trigger = getByTestId('overlay-tooltip')
      await fireEvent.focusIn(trigger)
      await settle()

      const tip = panel()
      expect(tip).not.toBeNull()
      expect(tip!.getAttribute('role')).toBe('tooltip')
      expect(tip!.textContent).toContain('This is a Tooltip')
    })
  })
})
