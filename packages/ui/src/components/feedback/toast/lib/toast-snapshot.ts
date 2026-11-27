import type { ToastEntry } from '../composables/use-toast-store'

export const toastSnapshot = (t: ToastEntry): ToastEntry => ({
  id: t.id,
  severity: t.severity,
  loading: t.loading,
  message: t.message,
  description: t.description,
  action: t.action,
  actions: t.actions,
  duration: t.duration,
  position: t.position,
  closable: t.closable,
  progress: t.progress
})
