import { composeStories } from '@storybook/vue3'
import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/overlay/drawer/Drawer.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Drawer from './drawer.vue'
import DrawerClose from './drawer-close.vue'
import DrawerContent from './drawer-content.vue'
import DrawerDescription from './drawer-description.vue'
import DrawerOverlay from './drawer-overlay.vue'
import DrawerPortal from './drawer-portal.vue'
import DrawerTitle from './drawer-title.vue'
import DrawerTrigger from './drawer-trigger.vue'

const { Default } = composeStories(stories)

// The panel + backdrop are Teleported to <body> by DrawerPortal, so they escape
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

const panel = () => byTestId('overlay-drawer__panel')
const backdrop = () => byTestId('overlay-drawer__backdrop')

/**
 * A realistic composed tree wired like the Storybook Default: Root > Trigger
 * (button-like) + Portal > Overlay + Content (Title / Description / Close).
 * Slots take plain strings so the assertions stay grounded in the drawer
 * sub-components under test (DrawerContent still wraps its internal Panel).
 */
const composed = (props: Record<string, unknown> = {}) =>
  defineComponent({
    components: {
      Drawer,
      DrawerTrigger,
      DrawerPortal,
      DrawerOverlay,
      DrawerContent,
      DrawerTitle,
      DrawerDescription,
      DrawerClose
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
        <DrawerPortal>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerTitle>Edit settings</DrawerTitle>
            <DrawerDescription>Update the workspace configuration.</DrawerDescription>
            <DrawerClose />
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    `
  })

afterEach(async () => {
  await settle()
})

describe('Drawer (overlay: composition sub-components + provide/inject)', () => {
  describe('compound sub-components resolve as real components', () => {
    it('every drawer sub-component is a mountable Vue component', () => {
      for (const sub of [
        DrawerTrigger,
        DrawerPortal,
        DrawerOverlay,
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

      // The Root + Trigger render in-place; DrawerPortal renders nothing until open.
      expect(getByTestId('overlay-drawer').getAttribute('data-state')).toBe('closed')
      const trigger = getByTestId('overlay-drawer__trigger')
      expect(trigger.getAttribute('role')).toBe('button')
      expect(trigger.getAttribute('tabindex')).toBe('0')

      expect(panel()).toBeNull()
      expect(backdrop()).toBeNull()
    })
  })

  describe('opening via the trigger', () => {
    it('clicking the trigger Teleports a role=dialog panel to document.body', async () => {
      const { getByTestId } = render(composed())
      await settle()

      await fireEvent.click(getByTestId('overlay-drawer__trigger'))
      await settle()

      // Root reflects the injected open state.
      expect(getByTestId('overlay-drawer').getAttribute('data-state')).toBe('open')

      const dlg = panel()
      expect(dlg).not.toBeNull()
      // DrawerContent: role=dialog + aria-modal + labelled/described by the ids
      // the root provides (titleId / descriptionId).
      expect(dlg!.getAttribute('role')).toBe('dialog')
      expect(dlg!.getAttribute('aria-modal')).toBe('true')

      const title = byTestId('overlay-drawer__title')!
      const description = byTestId('overlay-drawer__description')!
      expect(dlg!.getAttribute('aria-labelledby')).toBe(title.id)
      expect(dlg!.getAttribute('aria-describedby')).toBe(description.id)
      expect(title.textContent).toContain('Edit settings')
      expect(description.textContent).toContain('Update the workspace configuration.')
      // The internal Panel shell mounts under the same injected testId.
      expect(byTestId('overlay-drawer__panel-shell')).not.toBeNull()
    })

    it('opens on Enter and on Space keydown on the trigger', async () => {
      const enter = render(composed())
      await settle()
      await fireEvent.keyDown(enter.getByTestId('overlay-drawer__trigger'), { key: 'Enter' })
      await settle()
      expect(panel()).not.toBeNull()

      enter.unmount()
      await settle()

      const space = render(composed())
      await settle()
      await fireEvent.keyDown(space.getByTestId('overlay-drawer__trigger'), { key: ' ' })
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

      await fireEvent.click(getByTestId('overlay-drawer__trigger'))
      await settle()

      expect(onUpdate).toHaveBeenCalledWith(true)
    })

    it('a controlled parent drives open; DrawerClose emits update:open(false)', async () => {
      const onUpdate = vi.fn()
      const Wrapper = defineComponent({
        components: { Drawer, DrawerTrigger, DrawerPortal, DrawerContent, DrawerClose },
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
            <DrawerPortal>
              <DrawerContent>
                <DrawerClose />
              </DrawerContent>
            </DrawerPortal>
          </Drawer>
        `
      })

      const { getByTestId } = render(Wrapper)
      await settle()

      // Opens because parent seeds open=true (controlled).
      expect(getByTestId('overlay-drawer').getAttribute('data-state')).toBe('open')
      expect(panel()).not.toBeNull()

      // DrawerClose (IconButton) calls ctx.close() -> update:open(false).
      const close = byTestId('overlay-drawer__close')!
      await fireEvent.click(close)
      await settle()

      expect(onUpdate).toHaveBeenLastCalledWith(false)
      expect(getByTestId('overlay-drawer').getAttribute('data-state')).toBe('closed')
    })
  })

  describe('closing behaviors (dismissible)', () => {
    it('Escape closes the drawer and returns focus to the trigger', async () => {
      const { getByTestId } = render(composed())
      await settle()

      const trigger = getByTestId('overlay-drawer__trigger')
      await fireEvent.click(trigger)
      await settle()
      expect(panel()).not.toBeNull()

      // DrawerContent listens on document for Escape (guarded by ctx.dismissible).
      await fireEvent.keyDown(document, { key: 'Escape' })
      await settle()

      expect(getByTestId('overlay-drawer').getAttribute('data-state')).toBe('closed')
      // Focus is restored to the trigger element (watch on isOpen -> triggerRef.focus()).
      await vi.waitFor(() => {
        expect(document.activeElement).toBe(trigger)
      })
    })

    it('clicking the overlay backdrop closes the drawer', async () => {
      const { getByTestId } = render(composed())
      await settle()

      await fireEvent.click(getByTestId('overlay-drawer__trigger'))
      await settle()

      const bd = backdrop()
      expect(bd).not.toBeNull()
      expect(bd!.getAttribute('aria-hidden')).toBe('true')

      await fireEvent.click(bd!)
      await settle()

      expect(getByTestId('overlay-drawer').getAttribute('data-state')).toBe('closed')
    })

    it('the DrawerClose control closes the drawer', async () => {
      const { getByTestId } = render(composed())
      await settle()

      await fireEvent.click(getByTestId('overlay-drawer__trigger'))
      await settle()

      const close = byTestId('overlay-drawer__close')!
      // dismissible (default) -> the IconButton is enabled.
      expect(close.hasAttribute('disabled')).toBe(false)

      await fireEvent.click(close)
      await settle()

      expect(getByTestId('overlay-drawer').getAttribute('data-state')).toBe('closed')
    })
  })

  describe('dismissible=false suppresses dismissal', () => {
    it('Escape and backdrop click do NOT close, and DrawerClose is disabled', async () => {
      const { getByTestId } = render(composed({ dismissible: false }))
      await settle()

      await fireEvent.click(getByTestId('overlay-drawer__trigger'))
      await settle()
      expect(panel()).not.toBeNull()

      // Escape: guarded by ctx.dismissible.
      await fireEvent.keyDown(document, { key: 'Escape' })
      await settle()
      expect(getByTestId('overlay-drawer').getAttribute('data-state')).toBe('open')

      // Backdrop click: guarded by ctx.dismissible.
      await fireEvent.click(backdrop()!)
      await settle()
      expect(getByTestId('overlay-drawer').getAttribute('data-state')).toBe('open')

      // DrawerClose reflects !dismissible via disabled.
      const close = byTestId('overlay-drawer__close')!
      expect(close.hasAttribute('disabled')).toBe(true)
    })
  })

  describe('side prop flows through the injected context', () => {
    it.each(['left', 'right'] as const)(
      'renders the Teleported role=dialog panel for side=%s',
      async (side) => {
        const { getByTestId } = render(composed({ defaultOpen: true, side }))
        await settle()

        expect(getByTestId('overlay-drawer').getAttribute('data-state')).toBe('open')
        const dlg = panel()
        expect(dlg).not.toBeNull()
        expect(dlg!.getAttribute('role')).toBe('dialog')
      }
    )
  })

  describe('size prop flows through the injected context', () => {
    // Floor smoke over the DrawerSize enum: the panel shell mounts for each size.
    it.each(['small', 'medium', 'large'] as const)(
      'renders the Teleported panel for size=%s',
      async (size) => {
        const { getByTestId } = render(composed({ defaultOpen: true, size }))
        await settle()

        expect(getByTestId('overlay-drawer').getAttribute('data-state')).toBe('open')
        expect(panel()).not.toBeNull()
        // Panel shell testid is derived from the same injected testId.
        expect(byTestId('overlay-drawer__panel-shell')).not.toBeNull()
      }
    )
  })

  describe('defaultOpen (uncontrolled)', () => {
    it('mounts already open when defaultOpen is set', async () => {
      const { getByTestId } = render(composed({ defaultOpen: true }))
      await settle()

      expect(getByTestId('overlay-drawer').getAttribute('data-state')).toBe('open')
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
          DrawerPortal,
          DrawerOverlay,
          DrawerContent,
          DrawerTitle,
          DrawerDescription,
          DrawerClose
        },
        template: `
          <Drawer default-open>
            <DrawerTrigger>Open drawer</DrawerTrigger>
            <DrawerPortal>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerTitle>Edit settings</DrawerTitle>
                <DrawerDescription>Update the workspace configuration.</DrawerDescription>
                <DrawerClose />
              </DrawerContent>
            </DrawerPortal>
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

  describe('Storybook Default story composes and opens', () => {
    it('renders the composed Default and opens via its trigger', async () => {
      const { getByTestId } = render(Default())
      await settle()

      await fireEvent.click(getByTestId('overlay-drawer__trigger'))
      await settle()

      const dlg = panel()
      expect(dlg).not.toBeNull()
      expect(dlg!.getAttribute('role')).toBe('dialog')
      expect(byTestId('overlay-drawer__title')!.textContent).toContain('Drawer Title')
    })
  })
})
