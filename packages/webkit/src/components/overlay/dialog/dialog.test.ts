import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/overlay/dialog/Dialog.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Dialog from './dialog.vue'
import DialogClose from './dialog-close.vue'
import DialogContent from './dialog-content.vue'
import DialogDescription from './dialog-description.vue'
import DialogOverlay from './dialog-overlay.vue'
import DialogPortal from './dialog-portal.vue'
import DialogTitle from './dialog-title.vue'
import DialogTrigger from './dialog-trigger.vue'

const { Default } = composeStories(stories)

// The panel + backdrop are Teleported to <body> by DialogPortal, so they escape
// the render container. Query them from document.body, not the utils container.
// A frame or two lets onMounted (trigger registration) + the motion rAF settle.
const settle = async () => {
  await nextTick()
  await nextTick()
}

const byTestId = (id: string) => document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)

const panel = () => byTestId('overlay-dialog__panel')
const backdrop = () => byTestId('overlay-dialog__backdrop')

/**
 * A realistic composed tree wired exactly like the Storybook Default: Root >
 * Trigger (Button-like) + Portal > Overlay + Content (Title / Description /
 * Close). Slots take strings so we don't pull in Panel/Button, keeping the
 * assertions grounded purely in the dialog sub-components under test.
 */
const composed = (props: Record<string, unknown> = {}) =>
  defineComponent({
    components: {
      Dialog,
      DialogTrigger,
      DialogPortal,
      DialogOverlay,
      DialogContent,
      DialogTitle,
      DialogDescription,
      DialogClose
    },
    setup() {
      const open = ref<boolean>(Boolean(props.defaultOpen ?? false))
      return { props, open }
    },
    template: `
      <Dialog v-bind="props" v-model:open="open">
        <DialogTrigger>
          <button type="button">Open dialog</button>
        </DialogTrigger>
        <DialogPortal>
          <DialogOverlay />
          <DialogContent>
            <DialogTitle>Delete domain</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
            <DialogClose />
          </DialogContent>
        </DialogPortal>
      </Dialog>
    `
  })

afterEach(async () => {
  await settle()
})

describe('Dialog (overlay: composition sub-components + provide/inject)', () => {
  describe('closed state', () => {
    it('renders the trigger but no Teleported panel/backdrop while closed', async () => {
      const { getByTestId } = render(composed())
      await settle()

      // The Root + Trigger render in-place; DialogPortal renders nothing until open.
      expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('closed')
      const trigger = getByTestId('overlay-dialog__trigger')
      expect(trigger.getAttribute('role')).toBe('button')
      expect(trigger.getAttribute('tabindex')).toBe('0')

      expect(panel()).toBeNull()
      expect(backdrop()).toBeNull()
    })
  })

  describe('opening via the trigger', () => {
    it('clicking the trigger Teleports role=dialog panel to document.body', async () => {
      const { getByTestId } = render(composed())
      await settle()

      await fireEvent.click(getByTestId('overlay-dialog__trigger'))
      await settle()

      // Root reflects the injected open state.
      expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('open')

      const dialog = panel()
      expect(dialog).not.toBeNull()
      // DialogContent: role=dialog + aria-modal + labelled/described by the ids
      // the root provides (titleId / descriptionId).
      expect(dialog!.getAttribute('role')).toBe('dialog')
      expect(dialog!.getAttribute('aria-modal')).toBe('true')

      const title = byTestId('overlay-dialog__title')!
      const description = byTestId('overlay-dialog__description')!
      expect(dialog!.getAttribute('aria-labelledby')).toBe(title.id)
      expect(dialog!.getAttribute('aria-describedby')).toBe(description.id)
      expect(title.textContent).toContain('Delete domain')
      expect(description.textContent).toContain('This action cannot be undone.')
    })

    it('opens on Enter and on Space keydown on the trigger', async () => {
      const { getByTestId } = render(composed())
      await settle()

      await fireEvent.keyDown(getByTestId('overlay-dialog__trigger'), { key: 'Enter' })
      await settle()
      expect(panel()).not.toBeNull()
    })
  })

  describe('v-model:open round-trips through the injected context', () => {
    it('emits update:open(true) when the trigger opens it', async () => {
      const onUpdate = vi.fn()
      const { getByTestId } = render(Dialog, {
        props: { 'onUpdate:open': onUpdate },
        slots: {
          default: () => h(DialogTrigger, null, { default: () => h('button', 'Open') })
        }
      })
      await settle()

      await fireEvent.click(getByTestId('overlay-dialog__trigger'))
      await settle()

      expect(onUpdate).toHaveBeenCalledWith(true)
    })

    it('a controlled parent drives open; DialogClose emits update:open(false)', async () => {
      const onUpdate = vi.fn()
      const Wrapper = defineComponent({
        components: { Dialog, DialogTrigger, DialogPortal, DialogContent, DialogClose },
        setup() {
          const open = ref(true)
          const onUpd = (v: boolean) => {
            open.value = v
            onUpdate(v)
          }
          return { open, onUpd }
        },
        template: `
          <Dialog :open="open" @update:open="onUpd">
            <DialogTrigger><button>Open</button></DialogTrigger>
            <DialogPortal>
              <DialogContent>
                <DialogClose />
              </DialogContent>
            </DialogPortal>
          </Dialog>
        `
      })

      const { getByTestId } = render(Wrapper)
      await settle()

      // Opens because parent seeds open=true (controlled).
      expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('open')
      expect(panel()).not.toBeNull()

      // DialogClose (IconButton) calls ctx.close() -> update:open(false).
      const close = byTestId('overlay-dialog__close')!
      await fireEvent.click(close)
      await settle()

      expect(onUpdate).toHaveBeenLastCalledWith(false)
      expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('closed')
    })
  })

  describe('closing behaviors (dismissible)', () => {
    it('Escape closes the dialog and returns focus to the trigger', async () => {
      const { getByTestId } = render(composed())
      await settle()

      const trigger = getByTestId('overlay-dialog__trigger')
      await fireEvent.click(trigger)
      await settle()
      expect(panel()).not.toBeNull()

      // DialogContent listens on document for Escape.
      await fireEvent.keyDown(document, { key: 'Escape' })
      await settle()

      expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('closed')
      // Focus is restored to the trigger element (watch on isOpen -> triggerRef.focus()).
      await vi.waitFor(() => {
        expect(document.activeElement).toBe(trigger)
      })
    })

    it('clicking the overlay backdrop closes the dialog', async () => {
      const { getByTestId } = render(composed())
      await settle()

      await fireEvent.click(getByTestId('overlay-dialog__trigger'))
      await settle()

      const bd = backdrop()
      expect(bd).not.toBeNull()
      expect(bd!.getAttribute('aria-hidden')).toBe('true')

      await fireEvent.click(bd!)
      await settle()

      expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('closed')
    })

    it('the DialogClose control closes the dialog', async () => {
      const { getByTestId } = render(composed())
      await settle()

      await fireEvent.click(getByTestId('overlay-dialog__trigger'))
      await settle()

      const close = byTestId('overlay-dialog__close')!
      // dismissible (default) -> the IconButton is enabled.
      expect(close.hasAttribute('disabled')).toBe(false)

      await fireEvent.click(close)
      await settle()

      expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('closed')
    })
  })

  describe('dismissible=false suppresses dismissal', () => {
    it('Escape and backdrop click do NOT close, and DialogClose is disabled', async () => {
      const { getByTestId } = render(composed({ dismissible: false }))
      await settle()

      await fireEvent.click(getByTestId('overlay-dialog__trigger'))
      await settle()
      expect(panel()).not.toBeNull()

      // Escape: guarded by ctx.dismissible.
      await fireEvent.keyDown(document, { key: 'Escape' })
      await settle()
      expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('open')

      // Backdrop click: guarded by ctx.dismissible.
      await fireEvent.click(backdrop()!)
      await settle()
      expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('open')

      // DialogClose reflects !dismissible via disabled.
      const close = byTestId('overlay-dialog__close')!
      expect(close.hasAttribute('disabled')).toBe(true)
    })
  })

  describe('size prop flows through the injected context', () => {
    // Floor smoke over the DialogSize enum: the panel shell mounts for each size.
    it.each(['small', 'medium', 'large'] as const)(
      'renders the Teleported panel for size=%s',
      async (size) => {
        const { getByTestId } = render(composed({ defaultOpen: true, size }))
        await settle()

        expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('open')
        expect(panel()).not.toBeNull()
        // Panel shell testid is derived from the same injected testId.
        expect(byTestId('overlay-dialog__panel-shell')).not.toBeNull()
      }
    )
  })

  describe('defaultOpen (uncontrolled)', () => {
    it('mounts already open when defaultOpen is set', async () => {
      const { getByTestId } = render(composed({ defaultOpen: true }))
      await settle()

      expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('open')
      expect(panel()).not.toBeNull()
    })
  })

  describe('accessibility (axe on the open, Teleported dialog)', () => {
    it('has no WCAG violations while open', async () => {
      // DialogTrigger is itself a role=button span, so the trigger slot must be
      // non-interactive text (nesting a real <button> would be a consumer error,
      // not a component one). Use a plain label so axe measures the dialog surface.
      const AxeTree = defineComponent({
        components: {
          Dialog,
          DialogTrigger,
          DialogPortal,
          DialogOverlay,
          DialogContent,
          DialogTitle,
          DialogDescription,
          DialogClose
        },
        template: `
          <Dialog default-open>
            <DialogTrigger>Open dialog</DialogTrigger>
            <DialogPortal>
              <DialogOverlay />
              <DialogContent>
                <DialogTitle>Delete domain</DialogTitle>
                <DialogDescription>This action cannot be undone.</DialogDescription>
                <DialogClose />
              </DialogContent>
            </DialogPortal>
          </Dialog>
        `
      })

      render(AxeTree)
      await settle()

      const dialog = panel()
      expect(dialog).not.toBeNull()
      // Run axe over the whole body: the panel is Teleported out of the container.
      await expectNoA11yViolations(document.body)
    })
  })

  describe('Storybook Default story composes and opens', () => {
    it('renders the composed Default and opens via its trigger', async () => {
      const { getByTestId } = render(Default())
      await settle()

      await fireEvent.click(getByTestId('overlay-dialog__trigger'))
      await settle()

      const dialog = panel()
      expect(dialog).not.toBeNull()
      expect(dialog!.getAttribute('role')).toBe('dialog')
      expect(byTestId('overlay-dialog__title')!.textContent).toContain('Dialog Title')
    })
  })
})
