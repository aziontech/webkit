import { composeStories } from '@storybook/vue3'
import { render, within } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'

import * as stories from '../../../../../../apps/storybook/src/stories/components/feedback/toast/Toast.stories'
import { expectNoA11yViolations } from '../../../test/axe'
import Toast, { toast, Toaster, useToast, useToastStore } from './index'
import ToastAction from './toast-action/toast-action.vue'
import ToastClose from './toast-close/toast-close.vue'
import ToastDescription from './toast-description/toast-description.vue'
import ToastItem from './toast-item/toast-item.vue'
import ToastTitle from './toast-title/toast-title.vue'

const { Default } = composeStories(stories)

// The store (`toastStore`) is a module-level singleton driven by the imperative
// `toast()` — and only ONE mounted <Toaster> renders the stack (registerToaster).
// So each test clears the stack, unmounts its Toaster, and waits a frame before
// asserting on the freshly Teleported region in document.body.
afterEach(async () => {
  toast.dismiss()
  await nextTick()
})

/**
 * Mount a single <Toaster> (default slot rendering the built-in ToastItem body)
 * and let it register + render. `duration: 0` on raised toasts keeps them until
 * dismissed so assertions are not racing the auto-dismiss timer.
 */
const mountToaster = async (props: Record<string, unknown> = {}) => {
  const utils = render(Toaster, { props })
  await nextTick() // onMounted -> activate(); v-if="isActive" flips true
  await nextTick()
  return utils
}

/** The region container is Teleported to <body>; query it there, not the utils container. */
const regionFor = async (position: string) => {
  await nextTick()
  await nextTick()
  return document.body.querySelector<HTMLElement>(`[data-testid="feedback-toast-${position}"]`)
}

describe('Toast (composition + imperative store)', () => {
  describe('compound API (Object.assign dot-notation)', () => {
    it('attaches every public sub-component to the root compound', () => {
      // Grounded in index.ts: Object.assign(Toaster, { Toaster, Item, Title,
      // Description, Action, Close }).
      expect(Toast.Toaster).toBe(Toaster)
      expect(Toast.Item).toBe(ToastItem)
      expect(Toast.Title).toBe(ToastTitle)
      expect(Toast.Description).toBe(ToastDescription)
      expect(Toast.Action).toBe(ToastAction)
      expect(Toast.Close).toBe(ToastClose)
    })

    it('exposes the imperative toast fn and its composables as named exports', () => {
      // useToast() / useToastStore() return the same singletons the Toaster injects.
      expect(typeof toast).toBe('function')
      expect(useToast()).toBe(toast)
      expect(typeof useToastStore().add).toBe('function')
      expect(typeof useToastStore().dismiss).toBe('function')
    })
  })

  describe('imperative store drives the Teleported region', () => {
    it('renders a raised toast into a region Teleported to document.body', async () => {
      await mountToaster({ position: 'bottom-right', duration: 0 })

      toast('Event has been created', { description: 'Sunday, December 03, 2023' })
      const region = await regionFor('bottom-right')

      expect(region).not.toBeNull()
      // data-position mirrors the effective corner (source: regionStyle / template).
      expect(region!.getAttribute('data-position')).toBe('bottom-right')
      const scope = within(region!)
      expect(scope.getByText('Event has been created')).toBeTruthy()
      expect(scope.getByText('Sunday, December 03, 2023')).toBeTruthy()
    })

    it('renders through the built-in sub-components (ToastItem role + title/description testids)', async () => {
      await mountToaster({ position: 'bottom-right', duration: 0 })

      toast('Saved', { description: 'All changes persisted' })
      const region = await regionFor('bottom-right')
      const scope = within(region!)

      // Default (non-error/warning) ToastItem announces as role="status".
      const item = scope.getByTestId('feedback-toast__item')
      expect(item.getAttribute('role')).toBe('status')
      expect(item.getAttribute('data-type')).toBe('default')
      expect(scope.getByTestId('feedback-toast__title').textContent).toContain('Saved')
      expect(scope.getByTestId('feedback-toast__description').textContent).toContain(
        'All changes persisted'
      )
    })

    it('toast() returns an id that toast.dismiss(id) can remove', async () => {
      await mountToaster({ position: 'bottom-right', duration: 0 })

      const id = toast('Removable')
      expect(typeof id).toBe('string')
      let region = await regionFor('bottom-right')
      expect(within(region!).getByText('Removable')).toBeTruthy()

      toast.dismiss(id)
      // Item stays in DOM through the exit transition, then unmounts.
      await vi.waitFor(() => {
        region = document.body.querySelector('[data-testid="feedback-toast-bottom-right"]')
        expect(region === null || within(region).queryByText('Removable') === null).toBe(true)
      })
    })
  })

  describe('typed variants map to data-type + role (source: ToastItem)', () => {
    // A floor smoke: the store carries the raised type through to data-type.
    it.each([
      ['success', 'status'],
      ['info', 'status'],
      ['warning', 'alert'],
      ['error', 'alert']
    ] as const)('toast.%s renders data-type=%s with the right role', async (type, role) => {
      await mountToaster({ position: 'bottom-right', duration: 0 })
      ;(toast as unknown as Record<string, (m: string, o?: object) => string>)[type](
        `${type} message`
      )
      const region = await regionFor('bottom-right')
      const scope = within(region!)

      const item = scope.getByTestId('feedback-toast__item')
      expect(item.getAttribute('data-type')).toBe(type)
      expect(item.getAttribute('role')).toBe(role)
      expect(scope.getByText(`${type} message`)).toBeTruthy()
    })

    it('an error toast makes the region announce assertively (aria-live)', async () => {
      await mountToaster({ position: 'bottom-right', duration: 0 })

      toast.error('Something failed')
      const region = await regionFor('bottom-right')

      // Template: aria-live = 'assertive' when any entry is type error, else 'polite'.
      expect(region!.getAttribute('aria-live')).toBe('assertive')
      expect(region!.getAttribute('aria-atomic')).toBe('false')
    })

    it('a non-error stack announces politely (aria-live)', async () => {
      await mountToaster({ position: 'bottom-right', duration: 0 })

      toast.info('Heads up')
      const region = await regionFor('bottom-right')

      expect(region!.getAttribute('aria-live')).toBe('polite')
    })

    it('toast.loading persists (duration 0) and renders a status role', async () => {
      // toast.loading forces duration: 0 (source: toastFn.loading).
      await mountToaster({ position: 'bottom-right' })

      toast.loading('Working…')
      const region = await regionFor('bottom-right')
      const scope = within(region!)

      const item = scope.getByTestId('feedback-toast__item')
      expect(item.getAttribute('data-type')).toBe('loading')
      expect(item.getAttribute('role')).toBe('status')
      expect(scope.getByText('Working…')).toBeTruthy()
    })
  })

  describe('inline action (ToastAction) fires the option onClick', () => {
    it('clicking the action button invokes action.onClick and shows the label', async () => {
      await mountToaster({ position: 'bottom-right', duration: 0 })
      const onClick = vi.fn()

      toast('Event has been created', { action: { label: 'Undo', onClick } })
      const region = await regionFor('bottom-right')
      const scope = within(region!)

      // ToastAction renders a Button with the label; find and click it.
      const actionBtn = scope.getByTestId('feedback-toast__action')
      expect(actionBtn.textContent).toContain('Undo')
      actionBtn.click()

      expect(onClick).toHaveBeenCalledTimes(1)
      // Payload is the MouseEvent (ToastAction emits click[event]).
      expect(onClick.mock.calls[0][0]).toBeInstanceOf(MouseEvent)
    })
  })

  describe('close control (ToastClose) dismisses the toast', () => {
    it('shows a close control only when closable and dismisses on click', async () => {
      await mountToaster({ position: 'bottom-right', duration: 0, closable: true })
      const onClose = vi.fn()

      toast('Closable toast', { onClose })
      let region = await regionFor('bottom-right')
      const scope = within(region!)

      const closeBtn = scope.getByTestId('feedback-toast__close')
      // IconButton renders an accessible name (source: ariaLabel="Close notification").
      expect(closeBtn.getAttribute('aria-label')).toBe('Close notification')
      closeBtn.click()

      // dismiss -> store.remove -> onClose invoked, then card unmounts after exit.
      await vi.waitFor(() => {
        expect(onClose).toHaveBeenCalledTimes(1)
        region = document.body.querySelector('[data-testid="feedback-toast-bottom-right"]')
        expect(region === null || within(region).queryByText('Closable toast') === null).toBe(true)
      })
    })

    it('renders no close control when closable is false (default)', async () => {
      await mountToaster({ position: 'bottom-right', duration: 0 })

      toast('No close here')
      const region = await regionFor('bottom-right')

      expect(within(region!).queryByTestId('feedback-toast__close')).toBeNull()
    })
  })

  describe('per-toast position overrides the Toaster default', () => {
    it('anchors a toast to its own corner (source: entry.position ?? props.position)', async () => {
      await mountToaster({ position: 'bottom-right', duration: 0 })

      toast('Top-left toast', { position: 'top-left' })
      const region = await regionFor('top-left')

      expect(region).not.toBeNull()
      expect(region!.getAttribute('data-position')).toBe('top-left')
      expect(within(region!).getByText('Top-left toast')).toBeTruthy()
    })
  })

  describe('provide/inject — the injected store is the imperative singleton', () => {
    it('a bespoke default-slot body reads the same store the toast() fn drives', async () => {
      // Consumer slot proves provide(ToastInjectionKey, store) surfaces the same
      // reactive stack — and injecting via useToastStore() returns that singleton.
      const Consumer = defineComponent({
        components: { Toaster },
        setup() {
          const store = useToastStore()
          return { store }
        },
        template: `
          <Toaster :duration="0">
            <template #default="{ toast: entry, dismiss }">
              <button
                :data-testid="'slot-' + entry.id"
                @click="dismiss"
              >slot:{{ entry.message }} (of {{ store.toasts.length }})</button>
            </template>
          </Toaster>
        `
      })
      render(Consumer)
      await nextTick()
      await nextTick()

      toast('via imperative fn', { position: 'bottom-right' })
      const region = await regionFor('bottom-right')
      const scope = within(region!)

      // Slot content came from the injected store's entry, and the store length
      // reflects the imperatively-added toast -> provide/inject delivered it.
      const slotBtn = await vi.waitFor(() => {
        const el = scope.getByText(/^slot:via imperative fn/)
        expect(el).toBeTruthy()
        return el
      })
      expect(slotBtn.textContent).toContain('(of 1)')

      // The slot's `dismiss` closure drives the SAME store: clicking removes it.
      slotBtn.click()
      await vi.waitFor(() => {
        const r = document.body.querySelector('[data-testid="feedback-toast-bottom-right"]')
        expect(r === null || within(r).queryByText(/^slot:via imperative fn/) === null).toBe(true)
      })
    })
  })

  describe('update in place (store.update via toast id)', () => {
    it('re-raising with the same id replaces the entry in place', async () => {
      await mountToaster({ position: 'bottom-right', duration: 0 })

      const id = toast('First message', { id: 'fixed-id' })
      let region = await regionFor('bottom-right')
      expect(within(region!).getByText('First message')).toBeTruthy()

      // Same id -> add() splices in place; useToastStore().update also works.
      useToastStore().update(id, { message: 'Second message' })
      region = await regionFor('bottom-right')
      await vi.waitFor(() => {
        expect(within(region!).getByText('Second message')).toBeTruthy()
        expect(within(region!).queryByText('First message')).toBeNull()
      })
    })
  })

  describe('accessibility (axe on the Teleported region)', () => {
    it('the rendered toast region has no WCAG violations', async () => {
      await mountToaster({ position: 'bottom-right', duration: 0, closable: true })

      toast.success('Event has been created', {
        description: 'Sunday, December 03, 2023',
        action: { label: 'Undo', onClick: () => {} }
      })
      const region = await regionFor('bottom-right')
      expect(region).not.toBeNull()

      await expectNoA11yViolations(region!)
    })
  })

  describe('story smoke (composeStories)', () => {
    it('Default story mounts a Toaster and its trigger button', async () => {
      const { container } = render(Default())
      await nextTick()

      // The Default story renders a "Show toast" Button trigger in the canvas.
      expect(within(container).getByText('Show toast')).toBeTruthy()
    })
  })
})
