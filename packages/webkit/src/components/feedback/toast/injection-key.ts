import type { InjectionKey } from 'vue'

import type { ToastStore } from './use-toast-store'

export const ToastInjectionKey: InjectionKey<ToastStore> = Symbol('ToastContext')
