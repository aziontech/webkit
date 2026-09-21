/**
 * Compound toast API: sub-components attach to the root for dot-notation and stay
 * individually importable; the imperative toast function and store are named exports.
 * The CompoundToast annotation keeps declaration emit from expanding private props.
 */
import type { App, Plugin } from 'vue'
import { createVNode, render } from 'vue'

import ToastAction from './toast-action/toast-action.vue'
import ToastClose from './toast-close/toast-close.vue'
import ToastDescription from './toast-description/toast-description.vue'
import ToastItem from './toast-item/toast-item.vue'
import ToastTitle from './toast-title/toast-title.vue'
import Toaster from './toaster.vue'
import { toast, toastStore, useToast, useToastStore } from './use-toast-store'

type CompoundToast = typeof Toaster & {
  Toaster: typeof Toaster
  Item: typeof ToastItem
  Title: typeof ToastTitle
  Description: typeof ToastDescription
  Action: typeof ToastAction
  Close: typeof ToastClose
}

const Toast = Object.assign(Toaster, {
  Toaster,
  Item: ToastItem,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose
}) as CompoundToast

export default Toast

export type { ToastPosition } from './toaster.vue'
export { default as Toaster } from './toaster.vue'
export type {
  ToastAction as ToastActionConfig,
  ToastEntry,
  ToastEntryPatch,
  ToastOptions,
  ToastPromiseMessages,
  ToastStore,
  ToastType
} from './use-toast-store'
type ToasterProps = InstanceType<typeof Toaster>['$props']

/**
 * Direct use (mount Toaster, call toast) and the plugin drive the same singleton
 * stack. The plugin auto-mounts the region and exposes the API as $toast and via
 * inject; a second mounted Toaster is inert — only the first region activates.
 */
export const ToastPlugin: Plugin = {
  install(app: App, options?: ToasterProps) {
    app.component('Toaster', Toaster)
    ;(app.config.globalProperties as { $toast: typeof toast }).$toast = toast
    app.provide('webkit-toast', toast)
    // Auto-mount the region on a dedicated host, sharing the app's context so the
    // region sees the app's provides/config. SSR-safe: skipped without a DOM.
    if (typeof document === 'undefined') return
    const host = document.createElement('div')
    host.setAttribute('data-webkit-toaster', '')
    // body can be null when use() runs from a non-deferred head script.
    ;(document.body ?? document.documentElement).appendChild(host)
    // The SFC $props type is readonly without an index signature; createVNode wants Data.
    const vnode = createVNode(Toaster, options as Record<string, unknown> | undefined)
    vnode.appContext = app._context
    render(vnode, host)
    app.onUnmount(() => {
      render(null, host)
      host.remove()
    })
  }
}

export { toast, toastStore, useToast, useToastStore }
