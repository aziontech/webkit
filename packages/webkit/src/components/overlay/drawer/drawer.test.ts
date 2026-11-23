import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, nextTick, onMounted, ref } from 'vue'

import Default from '../../../../examples/drawer/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import ConfirmDialog from '../confirm-dialog/confirm-dialog.vue'
import PanelHeader from '../panel/panel-header.vue'
import Drawer from './drawer.vue'
import DrawerClose from './drawer-close.vue'
import DrawerContent from './drawer-content.vue'
import DrawerDescription from './drawer-description.vue'
import DrawerTitle from './drawer-title.vue'
import DrawerTrigger from './drawer-trigger.vue'

// The panel + backdrop are Teleported to <body> by DrawerContent, so they escape
// the render container. Query them from document.body, not the utils container.
// A couple of frames lets onMounted (trigger registration) + the motion rAF and
// the delayed portal unmount settle.
const settle = async () => {
  await nextTick()
  await nextTick()
  await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
  await nextTick()
}

const byTestId = (id: string) => document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)

const panel = () => byTestId('drawer-content')
const backdrop = () => byTestId('drawer-content__backdrop')

/**
 * A realistic composed tree wired like the Default example: Root > Trigger
 * (button-like) + Content (header with the Title, Description). The Content
 * renders the overlay and the header gets the close button on its own.
 */
const composed = (props: Record<string, unknown> = {}) =>
  defineComponent({
    components: {
      Drawer,
      DrawerTrigger,
      DrawerContent,
      DrawerTitle,
      DrawerDescription,
      PanelHeader
    },
    setup() {
      const open = ref<boolean>(Boolean(props.defaultOpen ?? false))
      return { props, open }
    },
    template: `
      <Drawer v-bind="props" v-model:open="open">
        <DrawerTrigger>
          <button type="button">Open drawer</button>
        </DrawerTrigger>
        <DrawerContent>
          <PanelHeader><DrawerTitle>Edit settings</DrawerTitle></PanelHeader>
          <DrawerDescription>Update the workspace configuration.</DrawerDescription>
        </DrawerContent>
      </Drawer>
    `
  })

afterEach(async () => {
  await settle()
})

describe('Drawer', () => {
  describe('overlay: composition sub-components and provide/inject', () => {
    describe('compound sub-components resolve as real components', () => {
      it('every drawer sub-component is a mountable Vue component', () => {
        for (const sub of [
          DrawerTrigger,
          DrawerContent,
          DrawerTitle,
          DrawerDescription,
          DrawerClose
        ]) {
          // SFCs compile to objects with a render/setup — never undefined.
          expect(sub).toBeTruthy()
          expect(typeof sub === 'object' || typeof sub === 'function').toBe(true)
        }
      })
    })

    describe('closed state', () => {
      it('renders the trigger but no Teleported panel/backdrop while closed', async () => {
        const { getByTestId } = render(composed())
        await settle()

        // The Root + Trigger render in-place; DrawerContent teleports nothing until open.
        expect(getByTestId('drawer').getAttribute('data-state')).toBe('closed')
        const trigger = getByTestId('drawer-trigger')
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
      it('clicking the trigger Teleports a role=dialog panel to document.body', async () => {
        const { getByTestId } = render(composed())
        await settle()

        await fireEvent.click(getByTestId('drawer-trigger'))
        await settle()

        // Root reflects the injected open state.
        expect(getByTestId('drawer').getAttribute('data-state')).toBe('open')

        const dlg = panel()
        expect(dlg).not.toBeNull()
        // DrawerContent: role=dialog + aria-modal + labelled/described by the ids
        // the root provides (titleId / descriptionId).
        expect(dlg!.getAttribute('role')).toBe('dialog')
        expect(dlg!.getAttribute('aria-modal')).toBe('true')

        const title = byTestId('drawer-title')!
        const description = byTestId('drawer-description')!
        expect(dlg!.getAttribute('aria-labelledby')).toBe(title.id)
        expect(dlg!.getAttribute('aria-describedby')).toBe(description.id)
        expect(title.textContent).toContain('Edit settings')
        expect(description.textContent).toContain('Update the workspace configuration.')
        // The internal Panel shell mounts under the same injected testId.
        expect(byTestId('drawer-content__panel-shell')).not.toBeNull()
      })

      it('opens on Enter and on Space keydown on the trigger', async () => {
        const enter = render(composed())
        await settle()
        await fireEvent.keyDown(enter.getByTestId('drawer-trigger'), { key: 'Enter' })
        await settle()
        expect(panel()).not.toBeNull()

        enter.unmount()
        await settle()

        const space = render(composed())
        await settle()
        await fireEvent.keyDown(space.getByTestId('drawer-trigger'), { key: ' ' })
        await settle()
        expect(panel()).not.toBeNull()
      })
    })

    describe('v-model:open round-trips through the injected context', () => {
      it('emits update:open(true) when the trigger opens it', async () => {
        const onUpdate = vi.fn()
        const { getByTestId } = render(Drawer, {
          props: { 'onUpdate:open': onUpdate },
          slots: {
            default: () => h(DrawerTrigger, null, { default: () => h('button', 'Open') })
          }
        })
        await settle()

        await fireEvent.click(getByTestId('drawer-trigger'))
        await settle()

        expect(onUpdate).toHaveBeenCalledWith(true)
        expect(onUpdate).toHaveBeenCalledTimes(1)
      })

      it('a controlled parent drives open; DrawerClose emits update:open(false)', async () => {
        const onUpdate = vi.fn()
        const Wrapper = defineComponent({
          components: { Drawer, DrawerTrigger, DrawerContent, DrawerClose },
          setup() {
            const open = ref(true)
            const onUpd = (v: boolean) => {
              open.value = v
              onUpdate(v)
            }
            return { open, onUpd }
          },
          template: `
          <Drawer :open="open" @update:open="onUpd">
            <DrawerTrigger><button>Open</button></DrawerTrigger>
            <DrawerContent>
              <DrawerClose />
            </DrawerContent>
          </Drawer>
        `
        })

        const { getByTestId } = render(Wrapper)
        await settle()

        // Opens because parent seeds open=true (controlled).
        expect(getByTestId('drawer').getAttribute('data-state')).toBe('open')
        expect(panel()).not.toBeNull()

        // DrawerClose (IconButton) calls ctx.close() -> update:open(false).
        const close = byTestId('drawer-close')!
        await fireEvent.click(close)
        await settle()

        expect(onUpdate).toHaveBeenLastCalledWith(false)
        expect(getByTestId('drawer').getAttribute('data-state')).toBe('closed')
      })
    })

    describe('closing behaviors (dismissible)', () => {
      it('Escape closes the drawer and returns focus to the trigger', async () => {
        const { getByTestId } = render(composed())
        await settle()

        const trigger = getByTestId('drawer-trigger')
        await fireEvent.click(trigger)
        await settle()
        expect(panel()).not.toBeNull()

        // DrawerContent listens on document for Escape (guarded by ctx.dismissible).
        await fireEvent.keyDown(document, { key: 'Escape' })
        await settle()

        expect(getByTestId('drawer').getAttribute('data-state')).toBe('closed')
        // Focus is restored to the trigger element (watch on isOpen -> triggerEl.focus()).
        await vi.waitFor(() => {
          expect(document.activeElement).toBe(trigger.querySelector('button'))
        })
      })

      it('clicking the overlay backdrop closes the drawer', async () => {
        const { getByTestId } = render(composed())
        await settle()

        await fireEvent.click(getByTestId('drawer-trigger'))
        await settle()

        const bd = backdrop()
        expect(bd).not.toBeNull()
        expect(bd!.getAttribute('aria-hidden')).toBe('true')

        await fireEvent.click(bd!)
        await settle()

        expect(getByTestId('drawer').getAttribute('data-state')).toBe('closed')
      })

      it('the DrawerClose control closes the drawer', async () => {
        const { getByTestId } = render(composed())
        await settle()

        await fireEvent.click(getByTestId('drawer-trigger'))
        await settle()

        const close = byTestId('drawer__close')!
        // dismissible (default) -> the IconButton is enabled.
        expect(close.hasAttribute('disabled')).toBe(false)

        await fireEvent.click(close)
        await settle()

        expect(getByTestId('drawer').getAttribute('data-state')).toBe('closed')
      })
    })

    describe('dismissible=false suppresses dismissal', () => {
      it('Escape and backdrop click do NOT close; the close button still closes', async () => {
        const { getByTestId } = render(composed({ dismissible: false }))
        await settle()

        await fireEvent.click(getByTestId('drawer-trigger'))
        await settle()
        expect(panel()).not.toBeNull()

        // Escape: guarded by ctx.dismissible.
        await fireEvent.keyDown(document, { key: 'Escape' })
        await settle()
        expect(getByTestId('drawer').getAttribute('data-state')).toBe('open')

        // Backdrop click: guarded by ctx.dismissible.
        await fireEvent.click(backdrop()!)
        await settle()
        expect(getByTestId('drawer').getAttribute('data-state')).toBe('open')

        const close = byTestId('drawer__close')!
        expect(close.hasAttribute('disabled')).toBe(false)
        await fireEvent.click(close)
        await settle()
        expect(getByTestId('drawer').getAttribute('data-state')).toBe('closed')
      })
    })

    describe('side prop flows through the injected context', () => {
      it.each(['start', 'end'] as const)(
        'renders the Teleported role=dialog panel for side=%s',
        async (side) => {
          const { getByTestId } = render(composed({ defaultOpen: true, side }))
          await settle()

          expect(getByTestId('drawer').getAttribute('data-state')).toBe('open')
          const dlg = panel()
          expect(dlg).not.toBeNull()
          expect(dlg!.getAttribute('role')).toBe('dialog')
        }
      )
    })

    describe('size prop flows through the injected context', () => {
      it('defaults to the large panel when no size is passed', async () => {
        render(composed({ defaultOpen: true }))
        await settle()

        expect(panel()!.getAttribute('data-size')).toBe('large')
      })

      it('mirrors an explicit size on the panel', async () => {
        render(composed({ defaultOpen: true, size: 'medium' }))
        await settle()

        expect(panel()!.getAttribute('data-size')).toBe('medium')
      })

      // Floor smoke over the DrawerSize enum: the panel shell mounts for each size.
      it.each(['small', 'medium', 'large'] as const)(
        'renders the Teleported panel for size=%s',
        async (size) => {
          const { getByTestId } = render(composed({ defaultOpen: true, size }))
          await settle()

          expect(getByTestId('drawer').getAttribute('data-state')).toBe('open')
          expect(panel()).not.toBeNull()
          // Panel shell testid is derived from the same injected testId.
          expect(byTestId('drawer-content__panel-shell')).not.toBeNull()
        }
      )
    })

    describe('defaultOpen (uncontrolled)', () => {
      it('mounts already open when defaultOpen is set', async () => {
        const { getByTestId } = render(composed({ defaultOpen: true }))
        await settle()

        expect(getByTestId('drawer').getAttribute('data-state')).toBe('open')
        expect(panel()).not.toBeNull()
      })
    })

    describe('accessibility (axe on the open, Teleported drawer)', () => {
      it('has no WCAG violations while open', async () => {
        // DrawerTrigger is itself role="button"; give it non-interactive text
        // content so the fixture does not introduce a nested-interactive control
        // (the trigger span is the button). Keeps axe grounded on the real drawer
        // sub-components: role=dialog panel, labelled title, described description.
        const AxeTree = defineComponent({
          components: {
            Drawer,
            DrawerTrigger,
            DrawerContent,
            DrawerTitle,
            DrawerDescription,
            DrawerClose
          },
          template: `
          <Drawer default-open>
            <DrawerTrigger>Open drawer</DrawerTrigger>
            <DrawerContent>
              <DrawerTitle>Edit settings</DrawerTitle>
              <DrawerDescription>Update the workspace configuration.</DrawerDescription>
              <DrawerClose />
            </DrawerContent>
          </Drawer>
        `
        })

        render(AxeTree)
        await settle()

        const dlg = panel()
        expect(dlg).not.toBeNull()
        // Run axe over the whole body: the panel is Teleported out of the container.
        await expectNoA11yViolations(document.body)
      })
    })

    describe('Default fixture composes and opens', () => {
      it('renders the composed Default and opens via its trigger', async () => {
        const { getByTestId } = render(Default)
        await settle()

        await fireEvent.click(getByTestId('drawer-trigger'))
        await settle()

        const dlg = panel()
        expect(dlg).not.toBeNull()
        expect(dlg!.getAttribute('role')).toBe('dialog')
        expect(byTestId('drawer-title')!.textContent).toContain('Drawer Title')
      })
    })
  })

  describe('keyboard map (spec)', () => {
    const twoActions = defineComponent({
      components: { Drawer, DrawerTrigger, DrawerContent, DrawerTitle },
      setup() {
        const open = ref(false)
        return { open }
      },
      template: `
      <Drawer v-model:open="open">
        <DrawerTrigger>
          <button type="button">Open drawer</button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Edit</DrawerTitle>
          <button type="button" data-testid="first-action">First</button>
          <button type="button" data-testid="last-action">Last</button>
        </DrawerContent>
      </Drawer>
    `
    })

    const openWithKey = async (key: string) => {
      const { getByTestId } = render(twoActions)
      await settle()
      const trigger = getByTestId('drawer-trigger').querySelector('button')!
      trigger.focus()
      await userEvent.keyboard(key)
      await settle()
      return { trigger }
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

    it('opens a form on its first field, not on the close button', async () => {
      const withForm = defineComponent({
        components: { Drawer, DrawerClose, DrawerContent, DrawerTitle },
        setup() {
          return { open: ref(true) }
        },
        template: `
        <Drawer v-model:open="open">
          <DrawerContent>
            <DrawerTitle>Create</DrawerTitle>
            <DrawerClose />
            <form>
              <input type="text" aria-label="Name" data-testid="name-field" />
            </form>
          </DrawerContent>
        </Drawer>
      `
      })
      render(withForm)
      await settle()
      await vi.waitFor(() => {
        expect(document.activeElement).toBe(byTestId('name-field'))
      })
    })

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
      const { trigger } = await openWithKey('{Enter}')
      await userEvent.keyboard('{Escape}')
      await settle()
      await vi.waitFor(() => {
        expect(panel()).toBeNull()
        expect(document.activeElement).toBe(trigger)
      })
    })
  })

  describe('portal and overlay (rendered by DrawerContent)', () => {
    it('teleports the panel inside a portal wrapper derived from the root testid', async () => {
      render(composed({ defaultOpen: true }))
      await settle()
      const portal = byTestId('drawer-content__portal')
      expect(portal).not.toBeNull()
      expect(portal!.parentElement).toBe(document.body)
      expect(portal!.contains(panel())).toBe(true)
    })

    it('renders the overlay behind every open drawer with no hand-assembled parts', async () => {
      render(
        defineComponent({
          components: { Drawer, DrawerContent, DrawerTitle },
          template: `<Drawer default-open><DrawerContent><DrawerTitle>Title</DrawerTitle></DrawerContent></Drawer>`
        })
      )
      await settle()
      const bd = backdrop()
      expect(bd).not.toBeNull()
      expect(bd!.getAttribute('aria-hidden')).toBe('true')
      expect(byTestId('drawer-content__portal')!.contains(bd)).toBe(true)
      expect(panel()!.getAttribute('aria-modal')).toBe('true')
    })
  })

  describe('modal', () => {
    const nonModal = () =>
      defineComponent({
        components: { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, PanelHeader },
        setup() {
          const open = ref(false)
          return { open }
        },
        template: `
        <div>
          <Drawer v-model:open="open" :modal="false">
            <DrawerTrigger><button type="button">Open assistant</button></DrawerTrigger>
            <DrawerContent>
              <PanelHeader><DrawerTitle>Assistant</DrawerTitle></PanelHeader>
              <button type="button">Ask</button>
            </DrawerContent>
          </Drawer>
          <button type="button">Page action</button>
        </div>
      `
      })

    it('false renders no overlay, no scroll lock and aria-modal false', async () => {
      const view = render(nonModal())
      await settle()
      await fireEvent.click(view.getByRole('button', { name: 'Open assistant' }))
      await settle()
      expect(panel()).not.toBeNull()
      expect(backdrop()).toBeNull()
      expect(panel()!.getAttribute('aria-modal')).toBe('false')
      expect(document.body.style.overflow).not.toBe('hidden')
    })

    it('false moves focus in, does not trap Tab, and Escape still closes and restores focus', async () => {
      const view = render(nonModal())
      await settle()
      const opener = view.getByRole('button', { name: 'Open assistant' })
      opener.focus()
      await userEvent.keyboard('{Enter}')
      await settle()
      expect(panel()!.contains(document.activeElement)).toBe(true)

      const lastInPanel = Array.from(panel()!.querySelectorAll<HTMLElement>('button')).pop()!
      lastInPanel.focus()
      const tab = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true })
      document.dispatchEvent(tab)
      expect(tab.defaultPrevented).toBe(false)

      await fireEvent.keyDown(document, { key: 'Escape' })
      await settle()
      await vi.waitFor(() => {
        expect(document.activeElement).toBe(opener)
      })
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
    it('locks an open drawer when dismissible turns false, and unlocks it again', async () => {
      const dismissible = ref(true)
      const open = ref(true)
      render(
        defineComponent({
          components: { Drawer, DrawerContent, DrawerTitle },
          setup: () => ({ dismissible, open }),
          template: `<Drawer v-model:open="open" :dismissible="dismissible"><DrawerContent><DrawerTitle>T</DrawerTitle><button type="button">Act</button></DrawerContent></Drawer>`
        })
      )
      await settle()
      dismissible.value = false
      await settle()
      await fireEvent.keyDown(document, { key: 'Escape' })
      await settle()
      expect(open.value).toBe(true)
      dismissible.value = true
      await settle()
      await fireEvent.keyDown(document, { key: 'Escape' })
      await settle()
      expect(open.value).toBe(false)
    })

    it('reads side reactively and references no missing description', async () => {
      const side = ref<'start' | 'end'>('end')
      render(
        defineComponent({
          components: { Drawer, DrawerContent, DrawerTitle },
          setup: () => ({ side }),
          template: `<Drawer :side="side" :default-open="true" id="details"><DrawerContent><DrawerTitle>T</DrawerTitle></DrawerContent></Drawer>`
        })
      )
      await settle()
      expect(panel()!.getAttribute('data-side')).toBe('end')
      expect(panel()!.hasAttribute('aria-describedby')).toBe(false)
      expect(panel()!.style.transition).toBe('')
      expect(byTestId('drawer')!.id).toBe('details')
      side.value = 'start'
      await settle()
      expect(panel()!.getAttribute('data-side')).toBe('start')
    })
  })

  describe('nested overlays', () => {
    it('Escape in a ConfirmDialog opened from the drawer closes the confirm only', async () => {
      const drawerOpen = ref(true)
      const confirmOpen = ref(false)
      render(
        defineComponent({
          components: { Drawer, DrawerContent, DrawerTitle, ConfirmDialog },
          setup: () => ({ drawerOpen, confirmOpen }),
          template: `
          <Drawer v-model:open="drawerOpen">
            <DrawerContent>
              <DrawerTitle>Edit</DrawerTitle>
              <button type="button" data-testid="discard" @click="confirmOpen = true">Discard</button>
            </DrawerContent>
          </Drawer>
          <ConfirmDialog v-model:open="confirmOpen" title="Discard changes?" />
        `
        })
      )
      await settle()
      await fireEvent.click(byTestId('discard')!)
      await settle()
      expect(confirmOpen.value).toBe(true)
      await fireEvent.keyDown(document, { key: 'Escape' })
      await settle()
      expect(confirmOpen.value).toBe(false)
      expect(drawerOpen.value).toBe(true)
    })

    it('Escape while the confirm is loading closes nothing', async () => {
      const drawerOpen = ref(true)
      render(
        defineComponent({
          components: { Drawer, DrawerContent, DrawerTitle, ConfirmDialog },
          setup: () => ({ drawerOpen }),
          template: `
          <Drawer v-model:open="drawerOpen">
            <DrawerContent><DrawerTitle>Edit</DrawerTitle><button type="button">Act</button></DrawerContent>
          </Drawer>
          <ConfirmDialog :open="true" :loading="true" title="Deleting" />
        `
        })
      )
      await settle()
      await fireEvent.keyDown(document, { key: 'Escape' })
      await settle()
      expect(drawerOpen.value).toBe(true)
    })
  })

  describe('closable (the close button, separate from light-dismiss)', () => {
    it('renders the close button at the end of the header by default', async () => {
      render(composed({ defaultOpen: true }))
      await settle()
      const close = byTestId('drawer__close')!
      expect(close).not.toBeNull()
      expect(close.closest('header')).toBe(byTestId('panel-header'))
      expect(close.hasAttribute('disabled')).toBe(false)
    })

    it('dismissible false: Escape and overlay stay shut, the close button closes', async () => {
      const { getByTestId } = render(composed({ defaultOpen: true, dismissible: false }))
      await settle()
      await settle()

      await fireEvent.keyDown(document, { key: 'Escape' })
      await fireEvent.click(byTestId('drawer-content__backdrop')!)
      await settle()
      expect(getByTestId('drawer').getAttribute('data-state')).toBe('open')

      await fireEvent.click(byTestId('drawer__close')!)
      await settle()
      expect(getByTestId('drawer').getAttribute('data-state')).toBe('closed')
    })

    it('closable false removes the close button and keeps light-dismiss', async () => {
      const { getByTestId } = render(composed({ defaultOpen: true, closable: false }))
      await settle()
      await settle()

      expect(byTestId('drawer__close')).toBeNull()
      await fireEvent.keyDown(document, { key: 'Escape' })
      await settle()
      expect(getByTestId('drawer').getAttribute('data-state')).toBe('closed')
    })
  })

  describe('compound API (index.ts)', () => {
    it('attaches every part and the Panel regions for dot-notation', async () => {
      const { default: Compound } = await import('./index')
      const PanelBody = (await import('../panel/panel-body.vue')).default
      const PanelFooter = (await import('../panel/panel-footer.vue')).default
      expect(Compound).toBe(Drawer)
      expect(Compound.Trigger).toBe(DrawerTrigger)
      expect('Portal' in Compound).toBe(false)
      expect('Overlay' in Compound).toBe(false)
      expect(Compound.Content).toBe(DrawerContent)
      expect(Compound.Title).toBe(DrawerTitle)
      expect(Compound.Description).toBe(DrawerDescription)
      expect(Compound.Close).toBe(DrawerClose)
      expect(Compound.Header).toBe(PanelHeader)
      expect(Compound.Body).toBe(PanelBody)
      expect(Compound.Footer).toBe(PanelFooter)
    })

    it('renders the compound Default example and opens it', async () => {
      const { default: Example } = await import('../../../../examples/drawer/default.vue')
      const view = render(Example)
      await settle()
      await fireEvent.click(view.getByRole('button', { name: 'Open drawer' }))
      await settle()
      expect(byTestId('drawer-content')).not.toBeNull()
      expect(byTestId('drawer__close')).not.toBeNull()
    })
  })

  describe('DrawerTrigger in the mount tick', () => {
    it('opens on a synthetic click fired in the same millisecond the trigger mounted', async () => {
      const Host = defineComponent({
        setup() {
          const buttonEl = ref<HTMLButtonElement | null>(null)
          onMounted(() => buttonEl.value?.click())
          return () =>
            h(Drawer, null, {
              default: () => [
                h(DrawerTrigger, null, {
                  default: () =>
                    h('button', { ref: buttonEl, type: 'button', onClick: () => {} }, 'Open')
                }),
                h(DrawerContent, null, { default: () => h(DrawerTitle, null, () => 'Edit') })
              ]
            })
        }
      })
      const frozen = vi.spyOn(Date, 'now').mockReturnValue(Date.now())
      try {
        render(Host)
      } finally {
        frozen.mockRestore()
      }
      await settle()
      expect(panel()).not.toBeNull()
    })
  })
})
