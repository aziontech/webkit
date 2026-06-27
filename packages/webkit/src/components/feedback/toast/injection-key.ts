import type { InjectionKey } from 'vue'

import type { ToastStore } from './use-toast-store'

/**
 * Shared provide/inject key. The Toaster provides the singleton toast store so
 * its sub-components (and any bespoke body rendered through the default slot)
 * read the same reactive stack the imperative `toast()` function drives.
 */
export const ToastInjectionKey: InjectionKey<ToastStore> = Symbol('ToastContext')
