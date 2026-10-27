import { reactive, readonly, ref } from 'vue'

/** Severity / lifecycle variants reflected on each toast via `data-type`. */
export type ToastType = 'default' | 'success' | 'info' | 'warning' | 'error' | 'loading'

/** Corner (or edge-center) a toast (or the whole Toaster) is anchored to. */
export type ToastPosition =
  'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'

/** An inline action affordance rendered as a text button inside the toast. */
export interface ToastAction {
  /** Visible label of the action control. */
  label: string
  /** Invoked when the action control is clicked. */
  onClick: (event: MouseEvent) => void
}

/** Options accepted by `toast()` and its typed shortcuts. */
export interface ToastOptions {
  /** Supporting line rendered below the title. */
  description?: string
  /** Inline action affordance. */
  action?: ToastAction
  /** Auto-dismiss time in ms for this toast; `0` keeps it until dismissed. Falls back to the Toaster default. */
  duration?: number
  /** Anchor this single toast to a specific corner, overriding the Toaster's `position`. */
  position?: ToastPosition
  /** When true, show an always-visible close control; falls back to the Toaster's `closable`. */
  closable?: boolean
  /** Called when the toast is dismissed — by the close control, auto-dismiss, or programmatically. */
  onClose?: () => void
  /** Stable id; pass an existing id to update a toast in place. */
  id?: string
}

/** Messages shown across the lifecycle of a tracked promise. */
export interface ToastPromiseMessages<T> {
  /** Shown while the promise is pending. */
  loading: string
  /** Shown when the promise resolves; may map the resolved value to a string. */
  success: string | ((value: T) => string)
  /** Shown when the promise rejects; may map the error to a string. */
  error: string | ((error: unknown) => string)
}

/** A single entry in the reactive stack. */
export interface ToastEntry {
  /** Stable identity used for keying and dismissal. */
  id: string
  /** Severity / lifecycle variant. */
  type: ToastType
  /** Primary line. */
  message: string
  /** Supporting line. */
  description?: string
  /** Inline action affordance. */
  action?: ToastAction
  /** Resolved auto-dismiss time in ms; `0` means persist. */
  duration: number
  /** Per-toast anchor override (falls back to the Toaster's `position`). */
  position?: ToastPosition
  /** Per-toast close override (falls back to the Toaster's `closable`). */
  closable?: boolean
  /** Called when the toast is dismissed (close control, auto-dismiss, or programmatic). */
  onClose?: () => void
}

/** Patch applied by `update()` (every field optional except identity, which is positional). */
export type ToastEntryPatch = Partial<Omit<ToastEntry, 'id'>>

/** The reactive store shape provided to the Toaster and shared with the imperative API. */
export interface ToastStore {
  /** The live, read-only stack the Toaster renders. */
  toasts: readonly ToastEntry[]
  /** Push a new entry (or replace one with the same id) and return its id. */
  add: (entry: Omit<ToastEntry, 'duration'> & { duration?: number }) => string
  /** Patch an existing entry in place; no-op when the id is unknown. */
  update: (id: string, patch: ToastEntryPatch) => void
  /** Remove one entry by id, or clear the whole stack when no id is given. */
  dismiss: (id?: string) => void
  /** Pause every running auto-dismiss timer (e.g. while the stack is hovered). */
  pause: () => void
  /** Resume the paused timers, each with its remaining time. */
  resume: () => void
  /** Set the default auto-dismiss time (ms) new toasts inherit (driven by the active Toaster's `duration`). */
  setDefaultDuration: (ms: number) => void
}

const DEFAULT_DURATION = 4000

const defaultDuration = ref(DEFAULT_DURATION)

const entries = reactive<ToastEntry[]>([])
const timers = new Map<string, ReturnType<typeof setTimeout>>()
const expiry = new Map<string, { remaining: number; startedAt: number }>()

let counter = 0
const nextId = () => `toast-${++counter}`

const clearTimer = (id: string) => {
  const timer = timers.get(id)
  if (timer !== undefined) {
    clearTimeout(timer)
    timers.delete(id)
  }
}

const remove = (id?: string) => {
  if (id === undefined) {
    timers.forEach((timer) => clearTimeout(timer))
    timers.clear()
    expiry.clear()
    entries.forEach((entry) => entry.onClose?.())
    entries.splice(0, entries.length)
    return
  }
  clearTimer(id)
  expiry.delete(id)
  const index = entries.findIndex((entry) => entry.id === id)
  if (index !== -1) {
    entries[index].onClose?.()
    entries.splice(index, 1)
  }
}

const scheduleDismiss = (id: string, duration: number) => {
  clearTimer(id)
  if (duration > 0) {
    expiry.set(id, { remaining: duration, startedAt: Date.now() })
    timers.set(
      id,
      setTimeout(() => remove(id), duration)
    )
  } else {
    expiry.delete(id)
  }
}

const pauseAll = () => {
  const now = Date.now()
  timers.forEach((timer, id) => {
    clearTimeout(timer)
    const meta = expiry.get(id)
    if (meta) meta.remaining = Math.max(0, meta.remaining - (now - meta.startedAt))
  })
  timers.clear()
}

const resumeAll = () => {
  const now = Date.now()
  expiry.forEach((meta, id) => {
    if (!entries.some((entry) => entry.id === id)) return
    clearTimer(id)
    meta.startedAt = now
    timers.set(
      id,
      setTimeout(() => remove(id), meta.remaining)
    )
  })
}

const add: ToastStore['add'] = (entry) => {
  const duration = entry.duration ?? defaultDuration.value
  const next: ToastEntry = { ...entry, duration }
  const existing = entries.findIndex((item) => item.id === next.id)
  if (existing !== -1) {
    entries.splice(existing, 1, next)
  } else {
    entries.push(next)
  }
  scheduleDismiss(next.id, duration)
  return next.id
}

const update: ToastStore['update'] = (id, patch) => {
  const index = entries.findIndex((entry) => entry.id === id)
  if (index === -1) {
    return
  }
  const merged: ToastEntry = { ...entries[index], ...patch }
  entries.splice(index, 1, merged)
  scheduleDismiss(id, merged.duration)
}

export const toastStore: ToastStore = {
  get toasts() {
    return readonly(entries) as readonly ToastEntry[]
  },
  add,
  update,
  dismiss: remove,
  pause: pauseAll,
  resume: resumeAll,
  setDefaultDuration: (ms) => {
    defaultDuration.value = ms
  }
}

export const useToastStore = (): ToastStore => toastStore

const raise = (type: ToastType, message: string, options: ToastOptions = {}): string =>
  toastStore.add({
    id: options.id ?? nextId(),
    type,
    message,
    description: options.description,
    action: options.action,
    duration: options.duration,
    position: options.position,
    closable: options.closable,
    onClose: options.onClose
  })

interface ToastFn {
  (message: string, options?: ToastOptions): string
  success: (message: string, options?: ToastOptions) => string
  error: (message: string, options?: ToastOptions) => string
  info: (message: string, options?: ToastOptions) => string
  warning: (message: string, options?: ToastOptions) => string
  loading: (message: string, options?: ToastOptions) => string
  promise: <T>(
    promise: Promise<T>,
    messages: ToastPromiseMessages<T>,
    options?: ToastOptions
  ) => string
  dismiss: (id?: string) => void
}

const base = (message: string, options?: ToastOptions): string => raise('default', message, options)

const toastFn = base as ToastFn

toastFn.success = (message, options) => raise('success', message, options)
toastFn.error = (message, options) => raise('error', message, options)
toastFn.info = (message, options) => raise('info', message, options)
toastFn.warning = (message, options) => raise('warning', message, options)
toastFn.loading = (message, options) => raise('loading', message, { duration: 0, ...options })

toastFn.promise = (promise, messages, options) => {
  const id = raise('loading', messages.loading, { duration: 0, ...options })
  promise.then(
    (value) => {
      const text =
        typeof messages.success === 'function' ? messages.success(value) : messages.success
      toastStore.update(id, { type: 'success', message: text, duration: defaultDuration.value })
    },
    (reason) => {
      const text = typeof messages.error === 'function' ? messages.error(reason) : messages.error
      toastStore.update(id, { type: 'error', message: text, duration: defaultDuration.value })
    }
  )
  return id
}

toastFn.dismiss = (id) => toastStore.dismiss(id)

export const toast: ToastFn = toastFn

export const useToast = (): ToastFn => toast

let toasterSeq = 0
const activeToasterId = ref<number | null>(null)

export const registerToaster = () => {
  const id = ++toasterSeq
  return {
    activate: () => {
      if (activeToasterId.value === null) activeToasterId.value = id
    },
    release: () => {
      if (activeToasterId.value === id) activeToasterId.value = null
    },
    isActive: () => activeToasterId.value === id
  }
}
