/**
 * Compound API — each sub-component stays available as its own import
 * (`@aziontech/webkit/toast-item`, ...) and is also attached to the
 * root for dot-notation usage: `<Toast.Toaster>`, `<Toast.Item>`,
 * `<Toast.Title>`, etc. The same module also exposes the imperative `toast`
 * function (a named export) and the reactive store that backs it.
 *
 * This is a `.ts` file so vue-tsc generates the adjacent `index.d.ts`, giving
 * `<Toast.Toaster>` full type-checking. `Object.assign` keeps one source of
 * truth; the explicit `CompoundToast` annotation lets declaration emit
 * reference the sub-component types instead of expanding private props.
 *
 * There is no `Trigger` / `Content`: a toast has no disclosure open/closed
 * state — its lifecycle is presence in the stack, reflected via `data-type`
 * and the enter/leave transitions. See `.claude/rules/compound-api.md`.
 */
import type { App, Plugin } from 'vue'

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

// Named export so the root can be imported directly: `import { Toaster, toast }`.
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
/**
 * Two ways to use the toast — both drive the SAME singleton stack:
 *  1. Direct: mount `<Toaster />` once, then `import { toast }`
 *     (or `useToast()`) and call it from anywhere.
 *  2. Service: `app.use(ToastPlugin)` in main.js registers `<Toaster>` globally
 *     and exposes the imperative API as `this.$toast` and via `inject`.
 */
export const ToastPlugin: Plugin = {
  install(app: App) {
    app.component('Toaster', Toaster)
    ;(app.config.globalProperties as { $toast: typeof toast }).$toast = toast
    app.provide('webkit-toast', toast)
  }
}

export { toast, toastStore, useToast, useToastStore }
