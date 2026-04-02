import { usePrimeToast } from '../../plugins/primevue/primevue-internals.js'

export function useToast() {
  const toast = usePrimeToast()

  return {
    ...toast,
    success: (detail, life = 5000) =>
      toast.add({ severity: 'success', summary: 'Success', detail, life }),
    error: (detail) =>
      toast.add({ severity: 'error', summary: 'Error', detail, life: 0 }),
    warn: (detail, life = 5000) =>
      toast.add({ severity: 'warn', summary: 'Warning', detail, life }),
    info: (detail, life = 5000) =>
      toast.add({ severity: 'info', summary: 'Info', detail, life })
  }
}
