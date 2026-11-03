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

export const ToastPlugin: Plugin = {
  install(app: App, options?: ToasterProps) {
    app.component('Toaster', Toaster)
    ;(app.config.globalProperties as { $toast: typeof toast }).$toast = toast
    app.provide('webkit-toast', toast)
    if (typeof document === 'undefined') return
    const host = document.createElement('div')
    host.setAttribute('data-webkit-toaster', '')
    ;(document.body ?? document.documentElement).appendChild(host)
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
