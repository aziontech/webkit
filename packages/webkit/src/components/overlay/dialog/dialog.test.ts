import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/dialog/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import PanelHeader from '../panel/panel-header.vue'
import Dialog from './dialog.vue'
import DialogClose from './dialog-close.vue'
import DialogContent from './dialog-content.vue'
import DialogDescription from './dialog-description.vue'
import DialogTitle from './dialog-title.vue'
import DialogTrigger from './dialog-trigger.vue'

// The panel + backdrop are Teleported to <body> by DialogContent, so they escape
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
 * A realistic composed tree wired exactly like the Default example: Root >
 * Trigger (Button-like) + Content (header with the Title, Description). The
 * Content renders the overlay and the header gets the close button on its own.
 */
const composed = (props: Record<string, unknown> = {}) =>
  defineComponent({
    components: {
      Dialog,
      DialogTrigger,
      DialogContent,
      DialogTitle,
      DialogDescription,
      PanelHeader
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
        <DialogContent>
          <PanelHeader><DialogTitle>Delete domain</DialogTitle></PanelHeader>
          <DialogDescription>This action cannot be undone.</DialogDescription>
        </DialogContent>
      </Dialog>
    `
  })

afterEach(async () => {
  await settle()
})

describe('Dialog', () => {
  describe('overlay: composition sub-components and provide/inject', () => {
    describe('closed state', () => {
      it('renders the trigger but no Teleported panel/backdrop while closed', async () => {
        const { getByTestId } = render(composed())
        await settle()

        // The Root + Trigger render in-place; DialogContent teleports nothing until open.
        expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('closed')
        const trigger = getByTestId('overlay-dialog__trigger')
        expect(trigger.hasAttribute('role')).toBe(false)
        expect(trigger.hasAttribute('tabindex')).toBe(false)
        const button = trigger.querySelector('button') as HTMLElement
        expect(button.getAttribute('aria-haspopup')).toBe('dialog')
        expect(button.getAttribute('aria-expanded')).toBe('false')

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

        expect(onUpdate).toHaveBeenCalledTimes(1)
        expect(onUpdate).toHaveBeenCalledWith(true)
      })

      it('a controlled parent drives open; DialogClose emits update:open(false)', async () => {
        const onUpdate = vi.fn()
        const Wrapper = defineComponent({
          components: { Dialog, DialogTrigger, DialogContent, DialogClose },
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
            <DialogContent>
              <DialogClose />
            </DialogContent>
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

        expect(onUpdate).toHaveBeenCalledTimes(1)
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
          expect(document.activeElement).toBe(trigger.querySelector('button'))
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
      it('Escape and backdrop click do NOT close; the close button still closes', async () => {
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

        const close = byTestId('overlay-dialog__close')!
        expect(close.hasAttribute('disabled')).toBe(false)
        await fireEvent.click(close)
        await settle()
        expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('closed')
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

    describe('page scroll lock while open', () => {
      // DialogContent locks the page behind the overlay via useScrollLock(body).
      // Asserted through the inline style the lock writes, which is real in this
      // env — unlike the panel's own scrolling, which is Tailwind layout and so
      // lives in the styled visual suite (see LongContentMobile).
      it('locks body scroll while open and restores it on close', async () => {
        const before = document.body.style.overflow

        const { getByTestId } = render(composed())
        await settle()
        expect(document.body.style.overflow).toBe(before)

        await fireEvent.click(getByTestId('overlay-dialog__trigger'))
        await settle()
        expect(document.body.style.overflow).toBe('hidden')

        await fireEvent.keyDown(document, { key: 'Escape' })
        await settle()
        expect(document.body.style.overflow).toBe(before)
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
            DialogContent,
            DialogTitle,
            DialogDescription,
            DialogClose
          },
          template: `
          <Dialog default-open>
            <DialogTrigger>Open dialog</DialogTrigger>
            <DialogContent>
              <DialogTitle>Delete domain</DialogTitle>
              <DialogDescription>This action cannot be undone.</DialogDescription>
              <DialogClose />
            </DialogContent>
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

    describe('Default fixture composes and opens', () => {
      it('renders the composed Default and opens via its trigger', async () => {
        const { getByTestId } = render(Default)
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

  describe('keyboard map (spec)', () => {
    const twoActions = defineComponent({
      components: {
        Dialog,
        DialogTrigger,
        DialogContent,
        DialogTitle
      },
      setup() {
        const open = ref(false)
        return { open }
      },
      template: `
      <Dialog v-model:open="open">
        <DialogTrigger>
          <button type="button">Open dialog</button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Rename</DialogTitle>
          <button type="button" data-testid="first-action">First</button>
          <button type="button" data-testid="last-action">Last</button>
        </DialogContent>
      </Dialog>
    `
    })

    const openWithKey = async (key: string) => {
      const { getByTestId } = render(twoActions)
      await settle()
      const trigger = getByTestId('overlay-dialog__trigger').querySelector('button')!
      trigger.focus()
      await userEvent.keyboard(key)
      await settle()
      return { trigger, getByTestId }
    }

    it.each(['{Enter}', ' '])(
      '%s on the trigger opens and focuses the first control',
      async (key) => {
        await openWithKey(key)
        expect(panel()).not.toBeNull()
        await vi.waitFor(() => {
          expect(document.activeElement).toBe(byTestId('first-action'))
        })
      }
    )

    it('Tab on the last control wraps to the first (focus is trapped)', async () => {
      await openWithKey('{Enter}')
      byTestId('last-action')!.focus()
      await userEvent.keyboard('{Tab}')
      expect(document.activeElement).toBe(byTestId('first-action'))
    })

    it('Shift+Tab on the first control wraps to the last', async () => {
      await openWithKey('{Enter}')
      byTestId('first-action')!.focus()
      await userEvent.keyboard('{Shift>}{Tab}{/Shift}')
      expect(document.activeElement).toBe(byTestId('last-action'))
    })

    it('Escape closes and returns focus to the trigger', async () => {
      const { trigger, getByTestId } = await openWithKey('{Enter}')
      await userEvent.keyboard('{Escape}')
      await settle()
      expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('closed')
      await vi.waitFor(() => {
        expect(document.activeElement).toBe(trigger)
      })
    })

    it('returns focus to the previously focused element when opened without a trigger', async () => {
      const controlled = defineComponent({
        components: { Dialog, DialogContent, DialogTitle },
        setup() {
          const open = ref(false)
          return { open }
        },
        template: `
        <div>
          <button type="button" data-testid="opener" @click="open = true">Open</button>
          <Dialog v-model:open="open">
            <DialogContent>
              <DialogTitle>Controlled</DialogTitle>
              <button type="button">Inside</button>
            </DialogContent>
          </Dialog>
        </div>
      `
      })
      const { getByTestId } = render(controlled)
      await settle()
      const opener = getByTestId('opener')
      opener.focus()
      await userEvent.keyboard('{Enter}')
      await settle()
      expect(panel()).not.toBeNull()
      await userEvent.keyboard('{Escape}')
      await settle()
      await vi.waitFor(() => {
        expect(document.activeElement).toBe(opener)
      })
    })
  })

  describe('portal and overlay (rendered by DialogContent)', () => {
    it('teleports the panel inside a portal wrapper derived from the root testid', async () => {
      render(composed({ defaultOpen: true }))
      await settle()
      const portal = byTestId('overlay-dialog__portal')
      expect(portal).not.toBeNull()
      expect(portal!.parentElement).toBe(document.body)
      expect(portal!.contains(panel())).toBe(true)
    })

    it('renders the overlay behind every open dialog with no hand-assembled parts', async () => {
      render(
        defineComponent({
          components: { Dialog, DialogContent, DialogTitle },
          template: `<Dialog default-open><DialogContent><DialogTitle>Title</DialogTitle></DialogContent></Dialog>`
        })
      )
      await settle()
      const bd = backdrop()
      expect(bd).not.toBeNull()
      expect(bd!.getAttribute('aria-hidden')).toBe('true')
      expect(byTestId('overlay-dialog__portal')!.contains(bd)).toBe(true)
      expect(panel()!.getAttribute('aria-modal')).toBe('true')
    })
  })

  describe('unmounted while open', () => {
    it('cancels its pending motion frames and runs nothing after dispose', async () => {
      const pending = new Map<number, (time: number) => void>()
      let nextId = 0
      const request = vi
        .spyOn(globalThis, 'requestAnimationFrame')
        .mockImplementation((callback) => {
          nextId += 1
          pending.set(nextId, callback)
          return nextId
        })
      const cancel = vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation((id) => {
        pending.delete(id)
      })
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined)

      try {
        const { unmount } = render(composed({ defaultOpen: true }))
        await nextTick()
        await nextTick()
        const scheduled = [...pending.keys()]
        expect(scheduled.length).toBeGreaterThan(0)

        unmount()

        for (const id of scheduled) expect(cancel).toHaveBeenCalledWith(id)
        const leftover = [...pending.values()]
        pending.clear()
        expect(() => leftover.forEach((callback) => callback(performance.now()))).not.toThrow()
        await nextTick()
        expect(warn).not.toHaveBeenCalled()
        expect(error).not.toHaveBeenCalled()
      } finally {
        request.mockRestore()
        cancel.mockRestore()
        warn.mockRestore()
        error.mockRestore()
      }
    })
  })

  describe('audit fixes', () => {
    const bare = (props: Record<string, unknown> = {}) =>
      defineComponent({
        components: { Dialog, DialogContent, DialogTitle },
        setup: () => ({ props }),
        template: `
        <Dialog v-bind="props" :default-open="true">
          <DialogContent><DialogTitle>Title only</DialogTitle><button type="button">Act</button></DialogContent>
        </Dialog>
      `
      })

    it('references no description id when no DialogDescription is mounted', async () => {
      render(bare())
      await settle()
      expect(panel()!.hasAttribute('aria-describedby')).toBe(false)
    })

    it('forwards consumer attributes on the root', async () => {
      const { getByTestId } = render(bare({ id: 'billing-dialog', 'aria-label': 'Billing' }))
      await settle()
      const root = getByTestId('overlay-dialog')
      expect(root.id).toBe('billing-dialog')
      expect(root.getAttribute('aria-label')).toBe('Billing')
    })

    it('reads size reactively', async () => {
      const size = ref('small')
      render(
        defineComponent({
          components: { Dialog, DialogContent, DialogTitle },
          setup: () => ({ size }),
          template: `<Dialog :size="size" :default-open="true"><DialogContent><DialogTitle>T</DialogTitle></DialogContent></Dialog>`
        })
      )
      await settle()
      const wrapper = () => panel()!.querySelector<HTMLElement>('[data-size]')!
      expect(wrapper().getAttribute('data-size')).toBe('small')
      size.value = 'large'
      await settle()
      expect(wrapper().getAttribute('data-size')).toBe('large')
    })

    it('sets no inline transition on the panel or the backdrop', async () => {
      render(composed({ defaultOpen: true }))
      await settle()
      const wrapper = panel()!.querySelector<HTMLElement>('[data-state]')!
      expect(wrapper.style.transition).toBe('')
      expect(backdrop()!.style.transition).toBe('')
    })
  })

  describe('nested overlays', () => {
    const nested = defineComponent({
      components: { Dialog, DialogContent, DialogTitle },
      setup() {
        const outer = ref(true)
        const inner = ref(false)
        return { outer, inner }
      },
      template: `
      <Dialog v-model:open="outer" data-testid="outer">
        <DialogContent>
          <DialogTitle>Outer</DialogTitle>
          <button type="button" data-testid="outer-first">Outer first</button>
          <button type="button" data-testid="open-inner" @click="inner = true">Open inner</button>
        </DialogContent>
      </Dialog>
      <Dialog v-model:open="inner" data-testid="inner">
        <DialogContent>
          <DialogTitle>Inner</DialogTitle>
          <button type="button" data-testid="inner-a">A</button>
          <button type="button" data-testid="inner-b">B</button>
        </DialogContent>
      </Dialog>
    `
    })

    it('Escape closes only the top dialog', async () => {
      render(nested)
      await settle()
      await fireEvent.click(byTestId('open-inner')!)
      await settle()
      expect(byTestId('inner')!.getAttribute('data-state')).toBe('open')

      await fireEvent.keyDown(document, { key: 'Escape' })
      await settle()
      expect(byTestId('inner')!.getAttribute('data-state')).toBe('closed')
      expect(byTestId('outer')!.getAttribute('data-state')).toBe('open')

      await fireEvent.keyDown(document, { key: 'Escape' })
      await settle()
      expect(byTestId('outer')!.getAttribute('data-state')).toBe('closed')
    })

    it('Tab stays in the top dialog', async () => {
      render(nested)
      await settle()
      await fireEvent.click(byTestId('open-inner')!)
      await settle()
      byTestId('inner-b')!.focus()
      await userEvent.keyboard('{Tab}')
      expect(document.activeElement).toBe(byTestId('inner-a'))
    })
  })

  describe('closable (the close button, separate from light-dismiss)', () => {
    it('renders the close button at the end of the header by default', async () => {
      render(composed({ defaultOpen: true }))
      await settle()
      const close = byTestId('overlay-dialog__close')!
      expect(close).not.toBeNull()
      expect(close.closest('header')).toBe(byTestId('overlay-dialog__panel-shell__header'))
      expect(close.hasAttribute('disabled')).toBe(false)
    })

    it('dismissible false: Escape and overlay stay shut, the close button closes', async () => {
      const { getByTestId } = render(composed({ defaultOpen: true, dismissible: false }))
      await settle()
      await settle()

      await fireEvent.keyDown(document, { key: 'Escape' })
      await fireEvent.click(byTestId('overlay-dialog__backdrop')!)
      await settle()
      expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('open')

      await fireEvent.click(byTestId('overlay-dialog__close')!)
      await settle()
      expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('closed')
    })

    it('closable false removes the close button and keeps light-dismiss', async () => {
      const { getByTestId } = render(composed({ defaultOpen: true, closable: false }))
      await settle()
      await settle()

      expect(byTestId('overlay-dialog__close')).toBeNull()
      expect(byTestId('overlay-dialog__panel-shell__header')).not.toBeNull()
      await fireEvent.keyDown(document, { key: 'Escape' })
      await settle()
      expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('closed')
    })

    it('an explicit DialogClose in a custom header always closes', async () => {
      const { getByTestId } = render(
        defineComponent({
          components: { Dialog, DialogContent, DialogTitle, DialogClose },
          template: `<Dialog default-open :closable="false" :dismissible="false"><DialogContent><DialogTitle>T</DialogTitle><DialogClose /></DialogContent></Dialog>`
        })
      )
      await settle()
      await fireEvent.click(byTestId('overlay-dialog__close')!)
      await settle()
      expect(getByTestId('overlay-dialog').getAttribute('data-state')).toBe('closed')
    })
  })

  describe('compound API (index.ts)', () => {
    it('attaches every part and the Panel regions for dot-notation', async () => {
      const { default: Compound } = await import('./index')
      const PanelContent = (await import('../panel/panel-content.vue')).default
      const PanelFooter = (await import('../panel/panel-footer.vue')).default
      expect(Compound).toBe(Dialog)
      expect(Compound.Trigger).toBe(DialogTrigger)
      expect('Portal' in Compound).toBe(false)
      expect('Overlay' in Compound).toBe(false)
      expect(Compound.Content).toBe(DialogContent)
      expect(Compound.Title).toBe(DialogTitle)
      expect(Compound.Description).toBe(DialogDescription)
      expect(Compound.Close).toBe(DialogClose)
      expect(Compound.Header).toBe(PanelHeader)
      expect(Compound.Body).toBe(PanelContent)
      expect(Compound.Footer).toBe(PanelFooter)
    })

    it('renders the compound Default example and opens it', async () => {
      const { default: Example } = await import('../../../../examples/dialog/default.vue')
      const view = render(Example)
      await settle()
      await fireEvent.click(view.getByRole('button', { name: 'Open dialog' }))
      await settle()
      expect(byTestId('overlay-dialog__panel')).not.toBeNull()
      expect(byTestId('overlay-dialog__close')).not.toBeNull()
    })
  })
})
