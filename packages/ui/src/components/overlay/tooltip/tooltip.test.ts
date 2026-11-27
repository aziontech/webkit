import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/tooltip/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Tooltip from './tooltip.vue'

// The tooltip panel is Teleported to <body> (escapes the render container), so
// it must be queried from document.body — not the utils container. A frame or
// two lets onMounted (keydown listener) + the enter Transition mount settle.
const settle = async () => {
  await nextTick()
  await nextTick()
}

const byTestId = (id: string) => document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)

const panel = () => byTestId('tooltip__panel')

// The trigger slot is a plain <button> so the trigger has something focusable
// and interactive to hover/focus, exactly like the Default example.
const composed = (props: Record<string, unknown> = {}) =>
  defineComponent({
    components: { Tooltip },
    setup() {
      return { props }
    },
    template: `
      <Tooltip v-bind="props" content="Delete domain">
        <button type="button">Trigger</button>
      </Tooltip>
    `
  })

afterEach(async () => {
  await settle()
})

describe('Tooltip', () => {
  describe('overlay: Teleport, data-state, hover/focus/Escape', () => {
    describe('closed state', () => {
      it('renders the trigger with data-state=closed and no Teleported panel', async () => {
        const { getByTestId } = render(composed())
        await settle()

        const trigger = getByTestId('tooltip')
        expect(trigger.getAttribute('data-state')).toBe('closed')
        // aria-describedby is only wired while open.
        expect(trigger.getAttribute('aria-describedby')).toBeNull()
        // The panel (v-if="isOpen && content") is not mounted while closed.
        expect(panel()).toBeNull()
      })
    })

    describe('opening on focus (immediate, no delay)', () => {
      it('focusin Teleports a role=tooltip panel to document.body and wires aria-describedby', async () => {
        const { getByTestId } = render(composed())
        await settle()

        const trigger = getByTestId('tooltip')
        // @focusin="setOpen(true)" opens synchronously (bypasses the hover delay).
        await fireEvent.focusIn(trigger)
        await settle()

        expect(trigger.getAttribute('data-state')).toBe('open')

        const tip = panel()
        expect(tip).not.toBeNull()
        expect(tip!.getAttribute('role')).toBe('tooltip')
        expect(tip!.textContent).toContain('Delete domain')

        expect(trigger.hasAttribute('aria-describedby')).toBe(false)
        const describedBy = trigger.querySelector('button')!.getAttribute('aria-describedby')
        expect(describedBy).not.toBeNull()
        expect(tip!.getAttribute('id')).toBe(describedBy)
        expect(tip!.getAttribute('aria-hidden')).toBe('false')
      })
    })

    describe('long content', () => {
      it('starts every wrapped line at the start edge instead of centring it', async () => {
        const { getByTestId } = render(composed())
        await settle()
        await fireEvent.focusIn(getByTestId('tooltip'))
        await settle()
        expect(panel()!.classList).toContain('text-start')
        expect(panel()!.classList).not.toContain('text-center')
      })
    })

    describe('closing behaviors', () => {
      it('mouseleave closes an open tooltip', async () => {
        const { getByTestId } = render(composed())
        await settle()

        const trigger = getByTestId('tooltip')
        await fireEvent.focusIn(trigger)
        await settle()
        expect(panel()).not.toBeNull()

        await userEvent.hover(trigger)
        await userEvent.unhover(trigger)
        await new Promise((resolve) => setTimeout(resolve, 150))
        await settle()

        expect(trigger.getAttribute('data-state')).toBe('closed')
        expect(panel()).toBeNull()
      })

      it('Escape closes an open tooltip', async () => {
        const { getByTestId } = render(composed())
        await settle()

        const trigger = getByTestId('tooltip')
        await fireEvent.focusIn(trigger)
        await settle()
        expect(panel()).not.toBeNull()

        // A document-level keydown listener handles Escape while open.
        await fireEvent.keyDown(document, { key: 'Escape' })
        await settle()

        expect(trigger.getAttribute('data-state')).toBe('closed')
        expect(panel()).toBeNull()
      })

      it('stays closed after Escape when the pointer comes back over the trigger, until it leaves', async () => {
        const { getByTestId } = render(composed())
        await settle()

        const trigger = getByTestId('tooltip')
        await fireEvent.focusIn(trigger)
        await settle()
        await fireEvent.keyDown(document, { key: 'Escape' })
        await settle()

        await fireEvent.mouseEnter(trigger)
        await new Promise((resolve) => setTimeout(resolve, 400))
        await settle()
        expect(trigger.getAttribute('data-state')).toBe('closed')

        await fireEvent.mouseLeave(trigger)
        await fireEvent.mouseEnter(trigger)
        await vi.waitFor(() => expect(trigger.getAttribute('data-state')).toBe('open'))
      })

      it('inside an open Dialog, Escape closes only the tooltip', async () => {
        const { default: Dialog } = await import('../dialog/dialog.vue')
        const { default: DialogContent } = await import('../dialog/dialog-content.vue')
        const { default: DialogTitle } = await import('../dialog/dialog-title.vue')
        render(
          defineComponent({
            components: { Dialog, DialogContent, DialogTitle, Tooltip },
            template: `
            <Dialog :default-open="true" data-testid="host-dialog">
              <DialogContent>
                <DialogTitle>Settings</DialogTitle>
                <Tooltip content="Delete domain"><button type="button">Delete</button></Tooltip>
              </DialogContent>
            </Dialog>
          `
          })
        )
        await settle()
        await fireEvent.focusIn(byTestId('tooltip') as HTMLElement)
        await settle()
        expect(panel()).not.toBeNull()

        await fireEvent.keyDown(document, { key: 'Escape' })
        await settle()
        expect(panel()).toBeNull()
        expect(byTestId('host-dialog')!.getAttribute('data-state')).toBe('open')

        await fireEvent.keyDown(document, { key: 'Escape' })
        await settle()
        expect(byTestId('host-dialog')!.getAttribute('data-state')).toBe('closed')
      })

      it('focusout to an element outside the trigger closes it', async () => {
        const { getByTestId } = render(composed())
        await settle()

        const trigger = getByTestId('tooltip')
        await fireEvent.focusIn(trigger)
        await settle()
        expect(panel()).not.toBeNull()

        // onFocusout closes when relatedTarget is not inside the trigger.
        await fireEvent.focusOut(trigger, { relatedTarget: document.body })
        await settle()

        expect(trigger.getAttribute('data-state')).toBe('closed')
        expect(panel()).toBeNull()
      })
    })

    describe('hoverable content (WCAG 1.4.13) and long-press', () => {
      it('stays open while the pointer moves from the trigger onto the tooltip', async () => {
        const { getByTestId } = render(composed())
        await settle()
        const trigger = getByTestId('tooltip')
        await fireEvent.focusIn(trigger)
        await settle()
        await fireEvent.mouseLeave(trigger)
        await fireEvent.mouseEnter(panel()!)
        await new Promise((resolve) => setTimeout(resolve, 200))
        await settle()
        expect(panel()).not.toBeNull()

        await fireEvent.mouseLeave(panel()!)
        await new Promise((resolve) => setTimeout(resolve, 200))
        await settle()
        expect(panel()).toBeNull()
      })

      it('opens on a touch long-press and hides after release', async () => {
        vi.useFakeTimers()
        try {
          const { getByTestId } = render(composed())
          await nextTick()
          const trigger = getByTestId('tooltip')
          await fireEvent.pointerDown(trigger, { pointerType: 'touch' })
          vi.advanceTimersByTime(500)
          await nextTick()
          await nextTick()
          expect(trigger.getAttribute('data-state')).toBe('open')
          await fireEvent.pointerUp(trigger, { pointerType: 'touch' })
          vi.advanceTimersByTime(1500)
          await nextTick()
          expect(trigger.getAttribute('data-state')).toBe('closed')
        } finally {
          vi.useRealTimers()
        }
      })

      it('a mouse press does not open it', async () => {
        vi.useFakeTimers()
        try {
          const { getByTestId } = render(composed())
          await nextTick()
          const trigger = getByTestId('tooltip')
          await fireEvent.pointerDown(trigger, { pointerType: 'mouse' })
          vi.advanceTimersByTime(600)
          await nextTick()
          expect(trigger.getAttribute('data-state')).toBe('closed')
        } finally {
          vi.useRealTimers()
        }
      })
    })

    describe('hover open delay', () => {
      it('mouseenter opens only after the configured delay', async () => {
        vi.useFakeTimers()
        try {
          const { getByTestId } = render(composed({ delay: 200 }))
          await nextTick()

          const trigger = getByTestId('tooltip')
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
          props: { content: 'Hint', 'onUpdate:open': onUpdate },
          slots: { default: () => h('button', { type: 'button' }, 'Trigger') }
        })
        await settle()

        await fireEvent.focusIn(getByTestId('tooltip'))
        await settle()

        expect(onUpdate).toHaveBeenCalledTimes(1)
        expect(onUpdate).toHaveBeenCalledWith(true)
      })

      it('emits no show or hide echo, only update:open', async () => {
        const { getByTestId, emitted } = render(Tooltip, {
          props: { content: 'Hint', defaultOpen: true },
          slots: { default: () => h('button', { type: 'button' }, 'Trigger') }
        })
        await settle()
        await fireEvent.focusIn(getByTestId('tooltip'))
        await settle()

        expect(emitted().show).toBeUndefined()
        expect(emitted().hide).toBeUndefined()
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
          <Tooltip content="Hint" :open="open" @update:open="onUpd">
            <button type="button">Trigger</button>
          </Tooltip>
        `
        })

        const { getByTestId } = render(Wrapper)
        await settle()

        // Parent seeds open=true (controlled) -> panel is shown.
        const trigger = getByTestId('tooltip')
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

        const trigger = getByTestId('tooltip')
        expect(trigger.getAttribute('data-disabled')).toBe('true')

        // setOpen no-ops while disabled.
        await fireEvent.focusIn(trigger)
        await settle()

        expect(trigger.getAttribute('data-state')).toBe('closed')
        expect(panel()).toBeNull()
      })
    })

    describe('empty content never surfaces a panel', () => {
      it('focus does not open when content is empty', async () => {
        const { getByTestId } = render(Tooltip, {
          props: { content: '' },
          slots: { default: () => h('button', { type: 'button' }, 'Trigger') }
        })
        await settle()

        const trigger = getByTestId('tooltip')
        // setOpen guards `if (!props.content && next) return`.
        await fireEvent.focusIn(trigger)
        await settle()

        expect(trigger.getAttribute('data-state')).toBe('closed')
        expect(panel()).toBeNull()
      })
    })

    describe('side and align are reflected on trigger and panel', () => {
      const SIDES = ['top', 'bottom', 'start', 'end']
      it.each(['top', 'end', 'bottom', 'start'] as const)(
        'requested side=%s opens and reflects a consistent resolved data-side',
        async (side) => {
          const { getByTestId } = render(composed({ side, defaultOpen: true }))
          await settle()

          const trigger = getByTestId('tooltip')
          expect(trigger.getAttribute('data-state')).toBe('open')

          const tip = panel()
          expect(tip).not.toBeNull()

          const resolved = trigger.getAttribute('data-side')
          expect(SIDES).toContain(resolved)
          expect(tip!.getAttribute('data-side')).toBe(resolved)
          expect(tip!.getAttribute('data-align')).toBe('center')
        }
      )

      it('renders the requested align on the panel', async () => {
        render(composed({ side: 'bottom', align: 'start', defaultOpen: true }))
        await settle()
        expect(panel()!.getAttribute('data-align')).toBe('start')
      })
    })

    describe('text direction', () => {
      const atInlineEdge = (dir: 'ltr' | 'rtl') =>
        defineComponent({
          components: { Tooltip },
          template: `
            <div dir="${dir}" style="position:fixed;inset-block-start:200px;inset-inline-end:0">
              <Tooltip content="Delete domain" side="end" :default-open="true">
                <button type="button">Trigger</button>
              </Tooltip>
            </div>
          `
        })

      it('resolves side=end to the right in ltr, so a trigger on the right edge flips to start', async () => {
        render(atInlineEdge('ltr'))
        await settle()
        expect(panel()!.getAttribute('data-side')).toBe('start')
      })

      it('resolves side=end to the left in rtl, so a trigger on the left edge flips to start', async () => {
        render(atInlineEdge('rtl'))
        await settle()
        expect(panel()!.getAttribute('data-side')).toBe('start')
      })

      it('keeps side=start under rtl when the trigger sits on the left edge (start is the right side)', async () => {
        render(
          defineComponent({
            components: { Tooltip },
            template: `
              <div dir="rtl" style="position:fixed;top:200px;left:0">
                <Tooltip content="Delete domain" side="start" :default-open="true">
                  <button type="button">Trigger</button>
                </Tooltip>
              </div>
            `
          })
        )
        await settle()
        expect(panel()!.getAttribute('data-side')).toBe('start')
      })
    })

    describe('defaultOpen (uncontrolled)', () => {
      it('mounts already open when defaultOpen is set', async () => {
        const { getByTestId } = render(composed({ defaultOpen: true }))
        await settle()

        expect(getByTestId('tooltip').getAttribute('data-state')).toBe('open')
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

        const trigger = getByTestId('tooltip')
        // Scope axe to the trigger: validates the aria-describedby attribute value
        // and role semantics on the component's own root element.
        await expectNoA11yViolations(trigger)
      })
    })

    describe('Default fixture renders and opens', () => {
      it('composes the Default trigger and opens on focus', async () => {
        const { getByTestId } = render(Default)
        await settle()

        const trigger = getByTestId('tooltip')
        await fireEvent.focusIn(trigger)
        await settle()

        const tip = panel()
        expect(tip).not.toBeNull()
        expect(tip!.getAttribute('role')).toBe('tooltip')
        expect(tip!.textContent).toContain('Copies the request ID to the clipboard')
      })
    })
  })

  describe('keyboard map (spec)', () => {
    const sandwich = defineComponent({
      components: { Tooltip },
      template: `
      <div>
        <button type="button" data-testid="before">Before</button>
        <Tooltip content="Delete domain">
          <button type="button" data-testid="target">Trigger</button>
        </Tooltip>
        <button type="button" data-testid="after">After</button>
      </div>
    `
    })

    const focusTarget = async () => {
      const view = render(sandwich)
      await settle()
      view.getByTestId('before').focus()
      await userEvent.keyboard('{Tab}')
      await settle()
      return view
    }

    it('Tab onto the trigger opens the tooltip at once', async () => {
      const { getByTestId } = await focusTarget()
      expect(document.activeElement).toBe(getByTestId('target'))
      expect(panel()).not.toBeNull()
    })

    it('Escape closes the tooltip and keeps focus on the trigger', async () => {
      const { getByTestId } = await focusTarget()
      await userEvent.keyboard('{Escape}')
      await settle()
      await vi.waitFor(() => expect(panel()).toBeNull())
      expect(document.activeElement).toBe(getByTestId('target'))
    })

    it('Tab away from the trigger closes the tooltip', async () => {
      const { getByTestId } = await focusTarget()
      await userEvent.keyboard('{Tab}')
      await settle()
      expect(document.activeElement).toBe(getByTestId('after'))
      await vi.waitFor(() => expect(panel()).toBeNull())
    })
  })

  describe('global listeners', () => {
    it('listens for Escape on the document only while open', async () => {
      const add = vi.spyOn(document, 'addEventListener')
      const remove = vi.spyOn(document, 'removeEventListener')
      const keydowns = (spy: typeof add) =>
        spy.mock.calls.filter(
          ([type, listener]) =>
            type === 'keydown' && (listener as { name?: string }).name === 'onDocumentKeydown'
        ).length
      try {
        const { getByRole } = render(composed())
        await settle()
        expect(keydowns(add)).toBe(0)
        await fireEvent.focusIn(getByRole('button', { name: 'Trigger' }))
        await settle()
        expect(panel()).not.toBeNull()
        expect(keydowns(add)).toBe(1)
        const removedBefore = keydowns(remove)
        await fireEvent.keyDown(document, { key: 'Escape' })
        await settle()
        expect(keydowns(remove)).toBe(removedBefore + 1)
      } finally {
        vi.restoreAllMocks()
      }
    })
  })
})
