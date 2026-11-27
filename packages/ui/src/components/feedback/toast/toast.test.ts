import { render, within } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent as keyboardUser } from 'vitest/browser'
import { createApp, defineComponent, h, nextTick } from 'vue'

import Default from '../../../../examples/toast/default.vue'
import ProgressExample from '../../../../examples/toast/progress.vue'
import Severities from '../../../../examples/toast/severities.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import ConfigProvider from '../../provider/config-provider/config-provider.vue'
import Toast, { toast, Toaster, ToastPlugin, useToast, useToastStore } from './index'
import { edgeInset } from './lib/toast-layout'
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
  return document.body.querySelector<HTMLElement>(`[data-testid="toast__${position}"]`)
}

describe('Toast', () => {
  describe('composition and imperative store', () => {
    describe('compound API (Object.assign dot-notation)', () => {
      it('attaches every public sub-component to the root compound', () => {
        expect(Toast).toBe(Toaster)
        expect(Toast.Item).toBe(ToastItem)
        expect(Toast.Title).toBe(ToastTitle)
        expect(Toast.Description).toBe(ToastDescription)
        expect(Toast.Action).toBe(ToastAction)
        expect(Toast.Close).toBe(ToastClose)
      })

      it('attaches only the parts, not the root under a second name', () => {
        const members = Object.keys(Toast).filter((key) => /^[A-Z]/.test(key))
        expect(members.sort()).toEqual(['Action', 'Close', 'Description', 'Item', 'Title'])
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
        await mountToaster({ position: 'bottom-end', duration: 0 })

        toast('Event has been created', { description: 'Sunday, December 03, 2023' })
        const region = await regionFor('bottom-end')

        expect(region).not.toBeNull()
        // data-position mirrors the effective corner (source: regionStyle / template).
        expect(region!.getAttribute('data-position')).toBe('bottom-end')
        const scope = within(region!)
        expect(scope.getByText('Event has been created')).toBeTruthy()
        expect(scope.getByText('Sunday, December 03, 2023')).toBeTruthy()
      })

      it('renders through the built-in sub-components (ToastItem role + title/description testids)', async () => {
        await mountToaster({ position: 'bottom-end', duration: 0 })

        toast('Saved', { description: 'All changes persisted' })
        const region = await regionFor('bottom-end')
        const scope = within(region!)

        const item = scope.getByTestId('toast-item')
        expect(item.hasAttribute('role')).toBe(false)
        expect(item.getAttribute('data-severity')).toBe('neutral')
        expect(scope.getByTestId('toast-title').textContent).toContain('Saved')
        expect(scope.getByTestId('toast-description').textContent).toContain(
          'All changes persisted'
        )
      })

      it('toast() returns an id that toast.dismiss(id) can remove', async () => {
        await mountToaster({ position: 'bottom-end', duration: 0 })

        const id = toast('Removable')
        expect(typeof id).toBe('string')
        let region = await regionFor('bottom-end')
        expect(within(region!).getByText('Removable')).toBeTruthy()

        toast.dismiss(id)
        // Item stays in DOM through the exit transition, then unmounts.
        await vi.waitFor(() => {
          region = document.body.querySelector('[data-testid="toast__bottom-end"]')
          expect(region === null || within(region).queryByText('Removable') === null).toBe(true)
        })
      })
    })

    describe('typed variants map to data-severity, with no nested live role (source: ToastItem)', () => {
      it.each([
        ['success', 'success'],
        ['info', 'info'],
        ['warning', 'warning'],
        ['error', 'danger']
      ] as const)(
        'toast.%s renders data-severity=%s with no nested live role',
        async (fn, severity) => {
          await mountToaster({ position: 'bottom-end', duration: 0 })
          ;(toast as unknown as Record<string, (m: string, o?: object) => string>)[fn](
            `${fn} message`
          )
          const region = await regionFor('bottom-end')
          const scope = within(region!)

          const item = scope.getByTestId('toast-item')
          expect(item.getAttribute('data-severity')).toBe(severity)
          expect(item.hasAttribute('data-type')).toBe(false)
          expect(item.hasAttribute('role')).toBe(false)
          expect(scope.getByText(`${fn} message`)).toBeTruthy()
        }
      )

      it('toast.loading persists (duration 0)', async () => {
        // toast.loading forces duration: 0 (source: toastFn.loading).
        await mountToaster({ position: 'bottom-end' })

        toast.loading('Working…')
        const region = await regionFor('bottom-end')
        const scope = within(region!)

        const item = scope.getByTestId('toast-item')
        expect(item.getAttribute('data-severity')).toBe('neutral')
        expect(item.hasAttribute('data-loading')).toBe(true)
        expect(scope.getByText('Working…')).toBeTruthy()
      })

      it('toast.promise drops loading and takes the outcome severity when it settles', async () => {
        await mountToaster({ position: 'bottom-end', duration: 0 })
        let resolve: (value: string) => void = () => {}
        toast.promise(new Promise<string>((r) => (resolve = r)), {
          loading: 'Deploying',
          success: 'Deployed',
          error: 'Failed'
        })
        const region = await regionFor('bottom-end')
        const item = within(region!).getByTestId('toast-item')
        expect(item.hasAttribute('data-loading')).toBe(true)
        resolve('ok')
        await vi.waitFor(() => {
          const settled = within(region!).getByTestId('toast-item')
          expect(settled.hasAttribute('data-loading')).toBe(false)
          expect(settled.getAttribute('data-severity')).toBe('success')
        })
      })
    })

    describe('inline action (ToastAction) fires the option onClick', () => {
      it('clicking the action button invokes action.onClick and shows the label', async () => {
        await mountToaster({ position: 'bottom-end', duration: 0 })
        const onClick = vi.fn()

        toast('Event has been created', { action: { label: 'Undo', onClick } })
        const region = await regionFor('bottom-end')
        const scope = within(region!)

        // ToastAction renders a Button with the label; find and click it.
        const actionBtn = scope.getByTestId('toast-action')
        expect(actionBtn.textContent).toContain('Undo')
        actionBtn.click()

        expect(onClick).toHaveBeenCalledTimes(1)
        // Payload is the MouseEvent (ToastAction emits click[event]).
        expect(onClick.mock.calls[0][0]).toBeInstanceOf(MouseEvent)
      })

      it('renders up to two actions from `actions`, each firing its own onClick', async () => {
        await mountToaster({ position: 'bottom-end', duration: 0 })
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
        const region = await regionFor('bottom-end')
        const buttons = within(region!).getAllByTestId('toast-action')
        expect(buttons.map((button) => button.textContent?.trim())).toEqual(['Edit', 'Redeploy'])
        buttons[1].click()
        expect(onRedeploy).toHaveBeenCalledTimes(1)
        expect(onEdit).not.toHaveBeenCalled()
      })
    })

    describe('close control (ToastClose) dismisses the toast', () => {
      it('shows a close control only when closable and dismisses on click', async () => {
        await mountToaster({ position: 'bottom-end', duration: 0, closable: true })
        const onClose = vi.fn()

        toast('Closable toast', { onClose })
        let region = await regionFor('bottom-end')
        const scope = within(region!)

        const closeBtn = scope.getByTestId('toast-close')
        // IconButton renders an accessible name (source: ariaLabel="Close notification").
        expect(closeBtn.getAttribute('aria-label')).toBe('Close notification')
        closeBtn.click()

        // dismiss -> store.remove -> onClose invoked, then card unmounts after exit.
        await vi.waitFor(() => {
          expect(onClose).toHaveBeenCalledTimes(1)
          region = document.body.querySelector('[data-testid="toast__bottom-end"]')
          expect(region === null || within(region).queryByText('Closable toast') === null).toBe(
            true
          )
        })
      })

      it('renders no close control when closable is false (default)', async () => {
        await mountToaster({ position: 'bottom-end', duration: 0 })

        toast('No close here')
        const region = await regionFor('bottom-end')

        expect(within(region!).queryByTestId('toast-close')).toBeNull()
      })

      it('honours a per-toast closable over a Toaster that closes nothing', async () => {
        // Source: `item.entry.closable ?? closable` — the per-toast option wins.
        // It only can if the region's projection of the store entry carries
        // `closable`; when it did not, this option was silently inert.
        await mountToaster({ position: 'bottom-end', duration: 0, closable: false })

        toast.error('Deployment failed', { closable: true })
        const region = await regionFor('bottom-end')
        const scope = within(region!)

        expect(scope.getByText('Deployment failed')).toBeTruthy()
        expect(scope.getByTestId('toast-close')).toBeTruthy()
      })

      it('keeps a per-toast closable through an in-place update', async () => {
        // The async pattern: a `loading` toast is raised first and only becomes
        // closable when it settles into its error state under the SAME id.
        await mountToaster({ position: 'bottom-end', duration: 0, closable: false })

        const id = toast.loading('Deploying…')
        let region = await regionFor('bottom-end')
        expect(within(region!).queryByTestId('toast-close')).toBeNull()

        useToastStore().update(id, {
          severity: 'danger',
          message: 'Deployment failed',
          duration: 0,
          closable: true
        })
        region = await regionFor('bottom-end')

        expect(within(region!).getByTestId('toast-close')).toBeTruthy()
      })
    })

    describe('per-toast position overrides the Toaster default', () => {
      it('anchors a toast to its own corner (source: entry.position ?? props.position)', async () => {
        await mountToaster({ position: 'bottom-end', duration: 0 })

        toast('Top-start toast', { position: 'top-start' })
        const region = await regionFor('top-start')

        expect(region).not.toBeNull()
        expect(region!.getAttribute('data-position')).toBe('top-start')
        expect(within(region!).getByText('Top-start toast')).toBeTruthy()
      })
    })

    describe('start and end follow the reading direction', () => {
      afterEach(() => document.documentElement.removeAttribute('dir'))

      it('anchors bottom-end to the right edge in ltr', async () => {
        await mountToaster({ position: 'bottom-end', duration: 0 })
        const region = await regionFor('bottom-end')
        expect(region!.style.right).toBe(edgeInset('right'))
        expect(region!.style.left).toBe('auto')
        const start = await regionFor('bottom-start')
        expect(start!.style.left).toBe(edgeInset('left'))
      })

      it('keeps the stack clear of the safe-area insets on a notched phone', async () => {
        await mountToaster({ position: 'bottom-end', duration: 0 })
        const bottom = await regionFor('bottom-end')
        expect(bottom!.style.bottom).toContain('env(safe-area-inset-bottom)')
        expect(bottom!.style.right).toContain('env(safe-area-inset-right)')
        const top = await regionFor('top-start')
        expect(top!.style.top).toBe('max(var(--spacing-md), env(safe-area-inset-top))')
      })

      it('mirrors to the left edge when the document is rtl', async () => {
        document.documentElement.setAttribute('dir', 'rtl')
        await mountToaster({ position: 'bottom-end', duration: 0 })
        const region = await regionFor('bottom-end')
        expect(region!.getAttribute('data-position')).toBe('bottom-end')
        expect(region!.style.left).toBe(edgeInset('left'))
        expect(region!.style.right).toBe('auto')
        const start = await regionFor('top-start')
        expect(start!.style.right).toBe(edgeInset('right'))
      })

      it('mirrors under an rtl ConfigProvider', async () => {
        render(
          defineComponent({
            setup: () => () =>
              h(ConfigProvider, { dir: 'rtl' }, () =>
                h(Toaster, { position: 'bottom-end', duration: 0 })
              )
          })
        )
        await nextTick()
        const region = await regionFor('bottom-end')
        expect(region!.getAttribute('dir')).toBe('rtl')
        expect(region!.style.left).toBe(edgeInset('left'))
        expect(region!.style.right).toBe('auto')
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

        toast('via imperative fn', { position: 'bottom-end' })
        const region = await regionFor('bottom-end')
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
          const r = document.body.querySelector('[data-testid="toast__bottom-end"]')
          expect(
            r === null || within(r as HTMLElement).queryByText(/^slot:via imperative fn/) === null
          ).toBe(true)
        })
      })
    })

    describe('update in place (store.update via toast id)', () => {
      it('re-raising with the same id replaces the entry in place', async () => {
        await mountToaster({ position: 'bottom-end', duration: 0 })

        const id = toast('First message', { id: 'fixed-id' })
        let region = await regionFor('bottom-end')
        expect(within(region!).getByText('First message')).toBeTruthy()

        // Same id -> add() splices in place; useToastStore().update also works.
        useToastStore().update(id, { message: 'Second message' })
        region = await regionFor('bottom-end')
        await vi.waitFor(() => {
          expect(within(region!).getByText('Second message')).toBeTruthy()
          expect(within(region!).queryByText('First message')).toBeNull()
        })
      })
    })

    describe('accessibility (axe on the Teleported region)', () => {
      it('the rendered toast region has no WCAG violations', async () => {
        await mountToaster({ position: 'bottom-end', duration: 0, closable: true })

        toast.success('Event has been created', {
          description: 'Sunday, December 03, 2023',
          action: { label: 'Undo', onClick: () => {} }
        })
        const region = await regionFor('bottom-end')
        expect(region).not.toBeNull()

        await expectNoA11yViolations(region!)
      })
    })

    describe('documented examples smoke', () => {
      it('Default story mounts a Toaster and its trigger button', async () => {
        const { container } = render(Default)
        await nextTick()

        expect(within(container as HTMLElement).getByText('Delete application')).toBeTruthy()
      })
    })

    describe('severities example copy', () => {
      it('gives every severity a message that fits it', async () => {
        const { getByRole } = render(Severities)
        const titles: Record<string, string> = {
          Success: 'Deployment finished',
          Warning: 'Request limit at 90%',
          Error: 'Deploy failed'
        }
        for (const [label, title] of Object.entries(titles)) {
          getByRole('button', { name: label }).click()
          await vi.waitFor(() => expect(document.body.textContent).toContain(title))
        }
      })
    })

    describe('ToastPlugin (service mode)', () => {
      it('app.use(ToastPlugin) auto-mounts the region, renders toasts, and tears down on unmount', async () => {
        const app = createApp(defineComponent({ template: '<div />' }))
        app.use(ToastPlugin, { position: 'bottom-end' })
        const root = document.createElement('div')
        document.body.appendChild(root)
        app.mount(root)
        await nextTick()
        await nextTick()

        // The plugin mounted the region itself — no manual Toaster anywhere.
        expect(document.body.querySelector('[data-azion-toaster]')).not.toBeNull()

        toast('Raised through the service', { duration: 0 })
        const region = await regionFor('bottom-end')
        expect(region).not.toBeNull()
        expect(within(region!).getByText('Raised through the service')).toBeTruthy()

        // Unmounting the app removes the auto-mounted host (and its region with it).
        app.unmount()
        root.remove()
        await nextTick()
        expect(document.body.querySelector('[data-azion-toaster]')).toBeNull()
      })
    })
  })

  describe('live region (spec)', () => {
    const liveRegion = (channel: 'polite' | 'assertive') =>
      document.body.querySelector<HTMLElement>(`[data-testid="toast__live-${channel}"]`)

    it('both live regions are in the DOM, empty, before the first toast arrives', async () => {
      await mountToaster({ position: 'bottom-end', duration: 0 })
      await nextTick()
      const polite = liveRegion('polite')
      const assertive = liveRegion('assertive')
      expect(polite!.getAttribute('role')).toBe('status')
      expect(polite!.getAttribute('aria-live')).toBe('polite')
      expect(assertive!.getAttribute('role')).toBe('alert')
      expect(assertive!.getAttribute('aria-live')).toBe('assertive')
      expect(polite!.textContent?.trim()).toBe('')
      expect(assertive!.textContent?.trim()).toBe('')
    })

    it('a danger toast interrupts: it is announced in the assertive region only', async () => {
      await mountToaster({ position: 'bottom-end', duration: 0 })
      toast.error('Deploy failed', { description: 'The build step exited with code 1' })
      await vi.waitFor(() => {
        expect(liveRegion('assertive')!.textContent).toBe(
          'Deploy failed. The build step exited with code 1'
        )
      })
      expect(liveRegion('polite')!.textContent?.trim()).toBe('')
    })

    it('does not double the stop when the title already ends a sentence', async () => {
      await mountToaster({ position: 'bottom-end', duration: 0 })
      toast.success('Teams updated.', { description: 'Access changes on their next request.' })
      await vi.waitFor(() => {
        expect(liveRegion('polite')!.textContent).toBe(
          'Teams updated. Access changes on their next request.'
        )
      })
    })

    it.each(['success', 'info', 'warning', 'loading'] as const)(
      'a %s toast waits its turn: it is announced in the polite region only',
      async (fn) => {
        await mountToaster({ position: 'bottom-end', duration: 0 })
        ;(toast as unknown as Record<string, (m: string) => string>)[fn](`${fn} message`)
        await vi.waitFor(() => {
          expect(liveRegion('polite')!.textContent).toBe(`${fn} message`)
        })
        expect(liveRegion('assertive')!.textContent?.trim()).toBe('')
      }
    )

    it('a loading toast that settles as an error is announced again, assertively', async () => {
      await mountToaster({ position: 'bottom-end', duration: 0 })
      const id = toast.loading('Deploying')
      await vi.waitFor(() => expect(liveRegion('polite')!.textContent).toBe('Deploying'))
      useToastStore().update(id, {
        severity: 'danger',
        loading: false,
        message: 'Deployment failed'
      })
      await vi.waitFor(() => expect(liveRegion('assertive')!.textContent).toBe('Deployment failed'))
    })

    it('progress steps are not announced again', async () => {
      await mountToaster({ position: 'bottom-end', duration: 0 })
      const id = toast.progress('Uploading', 10)
      await vi.waitFor(() => expect(liveRegion('polite')!.textContent).toBe('Uploading'))
      liveRegion('polite')!.textContent = ''
      toast.progress('Uploading', 60, { id })
      await nextTick()
      await nextTick()
      expect(liveRegion('polite')!.textContent).toBe('')
    })

    it('the visible stack is not a live region, so a toast is never announced twice', async () => {
      await mountToaster({ position: 'bottom-end', duration: 0 })
      const before = await regionFor('bottom-end')
      toast.error('Deploy failed')
      const region = await regionFor('bottom-end')
      expect(region).toBe(before)
      expect(region!.hasAttribute('aria-live')).toBe(false)
      expect(within(region!).getAllByText('Deploy failed')).toHaveLength(1)
      expect(
        region!.querySelector('[aria-live], [role="status"], [role="alert"], [role="log"]')
      ).toBeNull()
    })

    it('renders every corner region empty before any toast', async () => {
      await mountToaster({ position: 'bottom-end', duration: 0 })
      await nextTick()
      for (const position of [
        'top-start',
        'top-center',
        'top-end',
        'bottom-start',
        'bottom-center',
        'bottom-end'
      ]) {
        const region = await regionFor(position)
        expect(region).not.toBeNull()
        expect(region!.textContent?.trim()).toBe('')
      }
    })

    it('names a region that holds toasts after the focus hotkey', async () => {
      await mountToaster({ position: 'bottom-end', duration: 0 })
      const empty = await regionFor('bottom-end')
      expect(empty!.hasAttribute('role')).toBe(false)
      toast('Saved')
      const region = await regionFor('bottom-end')
      expect(region!.getAttribute('role')).toBe('region')
      expect(region!.getAttribute('aria-label')).toBe('Notifications (Alt+T)')
      await expectNoA11yViolations(region!)
    })

    it('ToastItem outside a Toaster is an alert for danger only, a status otherwise', () => {
      const { getAllByTestId } = render({
        components: { ToastItem },
        template: `<div><ToastItem severity="success">Saved</ToastItem><ToastItem severity="warning">Careful</ToastItem><ToastItem severity="danger">Failed</ToastItem></div>`
      })
      const [success, warning, danger] = getAllByTestId('toast-item')
      expect(success!.getAttribute('role')).toBe('status')
      expect(warning!.getAttribute('role')).toBe('status')
      expect(danger!.getAttribute('role')).toBe('alert')
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
      await regionFor('bottom-end')
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
      const region = await regionFor('bottom-end')
      view.getByTestId('work').focus()
      await keyboardUser.keyboard('{Tab}')
      const action = within(region!).getByText('Undo').closest('button')
      expect(document.activeElement).toBe(action)
      await keyboardUser.keyboard('{Enter}')
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('severity (audit: type renamed to severity, error to danger)', () => {
    it('toast.error raises a danger toast with no retired data-type', async () => {
      await mountToaster({ position: 'bottom-end', duration: 0 })
      toast.error('Deploy failed')
      const region = await regionFor('bottom-end')
      const item = within(region!).getByTestId('toast-item')
      expect(item.getAttribute('data-severity')).toBe('danger')
      expect(item.hasAttribute('data-type')).toBe(false)
      expect(useToastStore().toasts[0]!.severity).toBe('danger')
      expect('type' in useToastStore().toasts[0]!).toBe(false)
    })

    it('a store entry added without a severity is neutral', () => {
      useToastStore().add({ id: 'plain', message: 'Plain', duration: 0 })
      expect(useToastStore().toasts.find((t) => t.id === 'plain')!.severity).toBe('neutral')
    })
  })

  describe('timing adjustable (audit: WCAG 2.2.1)', () => {
    const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

    it('a toast with an action outlives the default duration', async () => {
      await mountToaster({ position: 'bottom-end', duration: 4000 })
      toast('Saved', { action: { label: 'Undo', onClick: () => {} } })
      toast('Plain')
      const [withAction, plain] = useToastStore().toasts
      expect(withAction!.duration).toBeGreaterThanOrEqual(10000)
      expect(plain!.duration).toBe(4000)
    })

    it('auto-dismiss pauses while focus is inside the region and resumes when it leaves', async () => {
      const view = render({
        components: { Toaster },
        template: `<div><button type="button" data-testid="work">Work</button><Toaster :duration="300" /></div>`
      })
      await nextTick()
      await nextTick()
      toast('Saved', { duration: 300, action: { label: 'Undo', onClick: () => {} } })
      const region = await regionFor('bottom-end')
      within(region!).getByText('Undo').closest('button')!.focus()
      await wait(600)
      expect(useToastStore().toasts).toHaveLength(1)
      view.getByTestId('work').focus()
      await vi.waitFor(() => expect(useToastStore().toasts).toHaveLength(0), {
        timeout: 3000,
        interval: 50
      })
    })

    it('Alt+T moves focus to the front toast action', async () => {
      const view = render({
        components: { Toaster },
        template: `<div><button type="button" data-testid="work">Work</button><Toaster :duration="0" /></div>`
      })
      await nextTick()
      await nextTick()
      toast('Saved', { action: { label: 'Undo', onClick: () => {} } })
      const region = await regionFor('bottom-end')
      view.getByTestId('work').focus()
      await keyboardUser.keyboard('{Alt>}t{/Alt}')
      expect(document.activeElement).toBe(within(region!).getByText('Undo').closest('button'))
    })
  })

  describe('Escape dismisses the focused toast', () => {
    it('closes the toast that holds focus and returns focus to where Alt+T came from', async () => {
      const view = render({
        components: { Toaster },
        template: `<div><button type="button" data-testid="work">Work</button><Toaster :duration="0" /></div>`
      })
      await nextTick()
      await nextTick()
      toast('Saved', { action: { label: 'Undo', onClick: () => {} } })
      await regionFor('bottom-end')
      view.getByTestId('work').focus()
      await keyboardUser.keyboard('{Alt>}t{/Alt}')
      await keyboardUser.keyboard('{Escape}')
      await vi.waitFor(() => expect(useToastStore().toasts).toHaveLength(0))
      expect(document.activeElement).toBe(view.getByTestId('work'))
    })
  })

  describe('reduced motion (audit: no inline transition)', () => {
    it('neither the region nor a toast sets an inline transition', async () => {
      await mountToaster({ position: 'bottom-end', duration: 0 })
      toast('Saved')
      const region = await regionFor('bottom-end')
      expect(region!.style.transition).toBe('')
      const card = region!.querySelector<HTMLElement>('[data-front]')!
      expect(card.style.transition).toBe('')
    })
  })

  describe('toast.progress', () => {
    it('raises a persistent toast with a progressbar named by the message and its percentage', async () => {
      await mountToaster({ position: 'bottom-end', duration: 4000 })

      const id = toast.progress('Uploading site-assets.zip', 25, { description: '12 of 48 MB' })
      const region = await regionFor('bottom-end')

      const bar = within(region!).getByRole('progressbar', { name: 'Uploading site-assets.zip' })
      expect(bar).toHaveAttribute('aria-valuenow', '25')
      expect(within(region!).getByTestId('toast__progress').textContent).toContain('25%')
      expect(within(region!).getByText('12 of 48 MB')).toBeTruthy()
      expect(useToastStore().toasts.find((entry) => entry.id === id)?.duration).toBe(0)
    })

    it('updates the same toast in place when called again with its id', async () => {
      await mountToaster({ position: 'bottom-end', duration: 0 })

      const id = toast.progress('Uploading', 10)
      let region = await regionFor('bottom-end')
      const card = within(region!).getByRole('progressbar').closest('[data-front]')

      toast.progress('Uploading', 70, { id })
      region = await regionFor('bottom-end')

      expect(within(region!).getAllByRole('progressbar')).toHaveLength(1)
      expect(within(region!).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '70')
      expect(within(region!).getByRole('progressbar').closest('[data-front]')).toBe(card)
      expect(useToastStore().toasts.filter((entry) => entry.id === id)).toHaveLength(1)
    })

    it('clamps the value to 0..100', async () => {
      await mountToaster({ position: 'bottom-end', duration: 0 })

      toast.progress('Uploading', 140)
      const region = await regionFor('bottom-end')

      expect(within(region!).getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
      expect(within(region!).getByTestId('toast__progress').textContent).toContain('100%')
    })

    it('runs the action with the click event and drops the bar once a typed toast replaces it', async () => {
      await mountToaster({ position: 'bottom-end', duration: 0 })
      const onClick = vi.fn()

      const id = toast.progress('Uploading', 40, { action: { label: 'Cancel', onClick } })
      let region = await regionFor('bottom-end')
      within(region!).getByRole('button', { name: 'Cancel' }).click()
      expect(onClick).toHaveBeenCalledWith(expect.any(MouseEvent))

      toast.success('Uploaded', { id, duration: 0 })
      region = await regionFor('bottom-end')
      expect(within(region!).queryByRole('progressbar')).toBeNull()
      expect(within(region!).getByText('Uploaded')).toBeTruthy()
    })

    it('renders no progress row on a toast without progress', async () => {
      await mountToaster({ position: 'bottom-end', duration: 0 })

      toast('Saved')
      const region = await regionFor('bottom-end')

      expect(within(region!).queryByTestId('toast__progress')).toBeNull()
    })

    it('starts the Progress example upload from its button with no a11y violations', async () => {
      const { getByRole } = render(ProgressExample)
      await nextTick()
      await nextTick()

      getByRole('button', { name: 'Upload file' }).click()
      const region = await regionFor('bottom-end')

      expect(
        within(region!).getByRole('progressbar', { name: 'Uploading site-assets.zip' })
      ).toBeTruthy()
      expect(within(region!).getByRole('button', { name: 'Cancel' })).toBeTruthy()
      await expectNoA11yViolations(region!)
      within(region!).getByRole('button', { name: 'Cancel' }).click()
      await nextTick()
      expect(useToastStore().toasts).toHaveLength(0)
    })
  })
})
