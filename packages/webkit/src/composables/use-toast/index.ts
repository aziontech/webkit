import type { ToastServiceMethods } from 'primevue/toastservice'

import { usePrimeToast } from '../../plugins/primevue/primevue-internals.js'

export function useToast(): ToastServiceMethods & {
  success: (detail: string, life?: number) => void
  error: (detail: string) => void
  warn: (detail: string, life?: number) => void
  info: (detail: string, life?: number) => void
} {
  const toast = usePrimeToast()

  return {
    ...toast,
    success: (detail: string, life: number = 5000): void =>
      toast.add({ severity: 'success', summary: 'Success', detail, life }),
    error: (detail: string): void =>
      toast.add({ severity: 'error', summary: 'Error', detail, life: 0 }),
    warn: (detail: string, life: number = 5000): void =>
      toast.add({ severity: 'warn', summary: 'Warning', detail, life }),
    info: (detail: string, life: number = 5000): void =>
      toast.add({ severity: 'info', summary: 'Info', detail, life })
  }
}
