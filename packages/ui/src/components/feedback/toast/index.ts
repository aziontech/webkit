import type { App, Plugin } from 'vue'
import { createVNode, render } from 'vue'

import { toast, toastStore, useToast, useToastStore } from './composables/use-toast-store'
import Toaster from './toast.vue'
import ToastAction from './toast-action/toast-action.vue'
import ToastClose from './toast-close/toast-close.vue'
import ToastDescription from './toast-description/toast-description.vue'
import ToastItem from './toast-item/toast-item.vue'
import ToastTitle from './toast-title/toast-title.vue'

type CompoundToast = typeof Toaster & {
  Item: typeof ToastItem
  Title: typeof ToastTitle
  Description: typeof ToastDescription
  Action: typeof ToastAction
  Close: typeof ToastClose
}

const Toast = Object.assign(Toaster, {
  Item: ToastItem,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose
}) as CompoundToast

export default Toast

export type {
  ToastAction as ToastActionConfig,
  ToastEntry,
  ToastEntryPatch,
  ToastOptions,
  ToastPromiseMessages,
  ToastSeverity,
  ToastStore
} from './composables/use-toast-store'
export type { ToastPosition } from './toast.vue'
export { default as Toaster } from './toast.vue'
type ToasterProps = InstanceType<typeof Toaster>['$props']

export const ToastPlugin: Plugin = {
  install(app: App, options?: ToasterProps) {
    app.component('Toaster', Toaster)
    app.config.globalProperties['$toast'] = toast
    app.provide('azion-ui-toast', toast)
    if (typeof document === 'undefined') return
    const host = document.createElement('div')
    host.setAttribute('data-azion-toaster', '')
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
export type { ToastProps } from './toast.vue'
export type { ToastActionProps } from './toast-action/toast-action.vue'
export type { ToastItemProps } from './toast-item/toast-item.vue'
