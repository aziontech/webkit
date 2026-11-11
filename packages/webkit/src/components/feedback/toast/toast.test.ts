import { render, within } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent as keyboardUser } from 'vitest/browser'
import { createApp, defineComponent, nextTick } from 'vue'

import Default from '../../../../examples/toast/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Toast, { toast, Toaster, ToastPlugin, useToast, useToastStore } from './index'
import ToastAction from './toast-action/toast-action.vue'
import ToastClose from './toast-close/toast-close.vue'
import ToastDescription from './toast-description/toast-description.vue'
import ToastItem from './toast-item/toast-item.vue'
import ToastTitle from './toast-title/toast-title.vue'

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

      const item = scope.getByTestId('feedback-toast__item')
      expect(item.hasAttribute('role')).toBe(false)
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

  describe('typed variants map to data-type, announced by the region alone (source: ToastItem)', () => {
    it.each(['success', 'info', 'warning', 'error'] as const)(
      'toast.%s renders its data-type with no nested live role',
      async (type) => {
        await mountToaster({ position: 'bottom-right', duration: 0 })
        ;(toast as unknown as Record<string, (m: string, o?: object) => string>)[type](
          `${type} message`
        )
        const region = await regionFor('bottom-right')
        const scope = within(region!)

        const item = scope.getByTestId('feedback-toast__item')
        expect(item.getAttribute('data-type')).toBe(type)
        expect(item.hasAttribute('role')).toBe(false)
        expect(scope.getByText(`${type} message`)).toBeTruthy()
      }
    )

    it('an error toast keeps the region polite (one stable live region)', async () => {
      await mountToaster({ position: 'bottom-right', duration: 0 })

      toast.error('Something failed')
      const region = await regionFor('bottom-right')

      expect(region!.getAttribute('aria-live')).toBe('polite')
      expect(region!.getAttribute('aria-atomic')).toBe('false')
    })

    it('a non-error stack announces politely (aria-live)', async () => {
      await mountToaster({ position: 'bottom-right', duration: 0 })

      toast.info('Heads up')
      const region = await regionFor('bottom-right')

      expect(region!.getAttribute('aria-live')).toBe('polite')
    })

    it('toast.loading persists (duration 0)', async () => {
      // toast.loading forces duration: 0 (source: toastFn.loading).
      await mountToaster({ position: 'bottom-right' })

      toast.loading('Working…')
      const region = await regionFor('bottom-right')
      const scope = within(region!)

      const item = scope.getByTestId('feedback-toast__item')
      expect(item.getAttribute('data-type')).toBe('loading')
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

    it('renders up to two actions from `actions`, each firing its own onClick', async () => {
      await mountToaster({ position: 'bottom-right', duration: 0 })
      const onEdit = vi.fn()
      const onRedeploy = vi.fn()

      toast.error('Deploy failed', {
        action: { label: 'Ignored', onClick: () => {} },
        actions: [
          { label: 'Edit', onClick: onEdit },
          { label: 'Redeploy', onClick: onRedeploy },
          { label: 'Third', onClick: () => {} }
        ]
      })
      const region = await regionFor('bottom-right')
      const buttons = within(region!).getAllByTestId('feedback-toast__action')
      expect(buttons.map((button) => button.textContent?.trim())).toEqual(['Edit', 'Redeploy'])
      buttons[1].click()
      expect(onRedeploy).toHaveBeenCalledTimes(1)
      expect(onEdit).not.toHaveBeenCalled()
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

    it('honours a per-toast closable over a Toaster that closes nothing', async () => {
      // Source: `item.entry.closable ?? closable` — the per-toast option wins.
      // It only can if the region's projection of the store entry carries
      // `closable`; when it did not, this option was silently inert.
      await mountToaster({ position: 'bottom-right', duration: 0, closable: false })

      toast.error('Deployment failed', { closable: true })
      const region = await regionFor('bottom-right')
      const scope = within(region!)

      expect(scope.getByText('Deployment failed')).toBeTruthy()
      expect(scope.getByTestId('feedback-toast__close')).toBeTruthy()
    })

    it('keeps a per-toast closable through an in-place update', async () => {
      // The async pattern: a `loading` toast is raised first and only becomes
      // closable when it settles into its error state under the SAME id.
      await mountToaster({ position: 'bottom-right', duration: 0, closable: false })

      const id = toast.loading('Deploying…')
      let region = await regionFor('bottom-right')
      expect(within(region!).queryByTestId('feedback-toast__close')).toBeNull()

      useToastStore().update(id, {
        type: 'error',
        message: 'Deployment failed',
        duration: 0,
        closable: true
      })
      region = await regionFor('bottom-right')

      expect(within(region!).getByTestId('feedback-toast__close')).toBeTruthy()
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

  describe('documented examples smoke', () => {
    it('Default story mounts a Toaster and its trigger button', async () => {
      const { container } = render(Default)
      await nextTick()

      // The Default story renders a "Show toast" Button trigger in the canvas.
      expect(within(container).getByText('Show toast')).toBeTruthy()
    })
  })

  describe('ToastPlugin (service mode)', () => {
    it('app.use(ToastPlugin) auto-mounts the region, renders toasts, and tears down on unmount', async () => {
      const app = createApp(defineComponent({ template: '<div />' }))
      app.use(ToastPlugin, { position: 'bottom-right' })
      const root = document.createElement('div')
      document.body.appendChild(root)
      app.mount(root)
      await nextTick()
      await nextTick()

      // The plugin mounted the region itself — no manual Toaster anywhere.
      expect(document.body.querySelector('[data-webkit-toaster]')).not.toBeNull()

      toast('Raised through the service', { duration: 0 })
      const region = await regionFor('bottom-right')
      expect(region).not.toBeNull()
      expect(within(region!).getByText('Raised through the service')).toBeTruthy()

      // Unmounting the app removes the auto-mounted host (and its region with it).
      app.unmount()
      root.remove()
      await nextTick()
      expect(document.body.querySelector('[data-webkit-toaster]')).toBeNull()
    })
  })
})

describe('live region (spec)', () => {
  it('the polite region is in the DOM before the first toast arrives', async () => {
    await mountToaster({ position: 'bottom-right', duration: 0 })
    const region = await regionFor('bottom-right')
    expect(region).not.toBeNull()
    expect(region!.getAttribute('aria-live')).toBe('polite')
    expect(region!.getAttribute('aria-atomic')).toBe('false')
    expect(region!.textContent?.trim()).toBe('')
  })

  it('a toast is added to the existing region once, with no nested live region', async () => {
    await mountToaster({ position: 'bottom-right', duration: 0 })
    const before = await regionFor('bottom-right')
    toast.error('Deploy failed')
    const region = await regionFor('bottom-right')
    expect(region).toBe(before)
    expect(within(region!).getAllByText('Deploy failed')).toHaveLength(1)
    expect(
      region!.querySelector('[aria-live], [role="status"], [role="alert"], [role="log"]')
    ).toBeNull()
  })

  it('ToastItem outside a Toaster keeps its own status/alert role', () => {
    const { getAllByTestId } = render({
      components: { ToastItem },
      template: `<div><ToastItem type="success">Saved</ToastItem><ToastItem type="error">Failed</ToastItem></div>`
    })
    const [success, error] = getAllByTestId('feedback-toast__item')
    expect(success!.getAttribute('role')).toBe('status')
    expect(error!.getAttribute('role')).toBe('alert')
  })
})

describe('keyboard map (spec)', () => {
  it('a toast never takes focus from the current control', async () => {
    const view = render({
      components: { Toaster },
      template: `<div><button type="button" data-testid="work">Work</button><Toaster :duration="0" /></div>`
    })
    await nextTick()
    await nextTick()
    const work = view.getByTestId('work')
    work.focus()
    toast('Saved', { action: { label: 'Undo', onClick: () => {} } })
    await regionFor('bottom-right')
    expect(document.activeElement).toBe(work)
  })

  it('Tab reaches the toast action, and Enter activates it', async () => {
    const onClick = vi.fn()
    const view = render({
      components: { Toaster },
      template: `<div><button type="button" data-testid="work">Work</button><Toaster :duration="0" /></div>`
    })
    await nextTick()
    await nextTick()
    toast('Saved', { action: { label: 'Undo', onClick } })
    const region = await regionFor('bottom-right')
    view.getByTestId('work').focus()
    await keyboardUser.keyboard('{Tab}')
    const action = within(region!).getByText('Undo').closest('button')
    expect(document.activeElement).toBe(action)
    await keyboardUser.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
