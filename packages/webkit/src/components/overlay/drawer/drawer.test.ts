import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/drawer/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Drawer from './drawer.vue'
import DrawerClose from './drawer-close.vue'
import DrawerContent from './drawer-content.vue'
import DrawerDescription from './drawer-description.vue'
import DrawerOverlay from './drawer-overlay.vue'
import DrawerPortal from './drawer-portal.vue'
import DrawerTitle from './drawer-title.vue'
import DrawerTrigger from './drawer-trigger.vue'

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
 * A realistic composed tree wired like the Default example: Root > Trigger
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
      expect(onUpdate).toHaveBeenCalledTimes(1)
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
        expect(document.activeElement).toBe(trigger.querySelector('button'))
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

  describe('Default fixture composes and opens', () => {
    it('renders the composed Default and opens via its trigger', async () => {
      const { getByTestId } = render(Default)
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

describe('Drawer on phones', () => {
  it('opens as a full-height, full-width sheet below sm', async () => {
    render(composed({ defaultOpen: true }))
    await settle()

    const shell = byTestId('overlay-drawer__panel-shell')
    expect(shell?.className).toContain('max-sm:h-dvh')
    expect(byTestId('overlay-drawer__panel')?.className).toContain('max-sm:top-0')
  })
})

describe('keyboard map (spec)', () => {
  const twoActions = defineComponent({
    components: { Drawer, DrawerTrigger, DrawerPortal, DrawerOverlay, DrawerContent, DrawerTitle },
    setup() {
      const open = ref(false)
      return { open }
    },
    template: `
      <Drawer v-model:open="open">
        <DrawerTrigger>
          <button type="button">Open drawer</button>
        </DrawerTrigger>
        <DrawerPortal>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerTitle>Edit</DrawerTitle>
            <button type="button" data-testid="first-action">First</button>
            <button type="button" data-testid="last-action">Last</button>
          </DrawerContent>
        </DrawerPortal>
      </Drawer>
    `
  })

  const openWithKey = async (key: string) => {
    const { getByTestId } = render(twoActions)
    await settle()
    const trigger = getByTestId('overlay-drawer__trigger').querySelector('button')!
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

describe('DrawerPortal data-testid', () => {
  it('derives the portal testid from the root and lets a consumer override it', async () => {
    const { unmount } = render(composed({ defaultOpen: true }))
    await settle()
    const portal = byTestId('overlay-drawer__portal')
    expect(portal).not.toBeNull()
    expect(portal!.contains(panel())).toBe(true)
    unmount()
    await settle()

    render(
      defineComponent({
        components: { Drawer, DrawerPortal, DrawerContent, DrawerTitle },
        template: `
          <Drawer default-open>
            <DrawerPortal data-testid="custom-portal">
              <DrawerContent><DrawerTitle>Title</DrawerTitle></DrawerContent>
            </DrawerPortal>
          </Drawer>
        `
      })
    )
    await settle()
    expect(byTestId('custom-portal')).not.toBeNull()
    expect(byTestId('overlay-drawer__portal')).toBeNull()
  })
})

describe('Drawer unmounted while open', () => {
  it('cancels its pending motion frames and runs nothing after dispose', async () => {
    const pending = new Map<number, (time: number) => void>()
    let nextId = 0
    const request = vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((callback) => {
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
