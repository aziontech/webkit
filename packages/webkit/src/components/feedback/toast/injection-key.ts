import type { InjectionKey } from 'vue'

import type { ToastStore } from './composables/use-toast-store'

export const ToastInjectionKey: InjectionKey<ToastStore> = Symbol('Toast')
