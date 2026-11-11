import {
  computed,
  type ComputedRef,
  getCurrentScope,
  isRef,
  type MaybeRefOrGetter,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  toValue
} from 'vue'

import * as en from '../../i18n/messages/en'
import { useTranslate } from '../use-locale/use-translate'

/** Options of `useUnsavedChanges`. */
export interface UseUnsavedChangesOptions<T> {
  /** Offers Save changes in the leave dialog; needs `onSave`. Defaults to true when `onSave` is set. */
  savable?: MaybeRefOrGetter<boolean>
  /** Saves the form from the leave dialog. The page leaves when it resolves and the form is clean. */
  onSave?: () => unknown
  /** Called by `discard()` with a copy of the baseline when the source is a getter, not a ref. */
  onDiscard?: (baseline: T) => void
  /** Turns the guards off (for example while a successful save navigates away). */
  enabled?: MaybeRefOrGetter<boolean>
  /** Asks the browser to confirm a reload or a tab close while dirty. */
  beforeUnload?: boolean
}

/** Props for `ConfirmDialog`, bound with `v-bind`. */
export interface UnsavedChangesDialogProps {
  open: boolean
  title: string
  description: string
  kind: 'danger' | 'primary'
  loading: boolean
  'onUpdate:open': (open: boolean) => void
}

/** What `useUnsavedChanges` returns. */
export interface UseUnsavedChangesReturn<T> {
  /** True while the source differs from the baseline. */
  isDirty: ComputedRef<boolean>
  /** The last committed value. */
  baseline: Readonly<Ref<T>>
  /** True while `onSave` runs from the leave dialog. */
  saving: Readonly<Ref<boolean>>
  /** Makes the current value (or `next`) the new baseline, after a save. */
  commit: (next?: T) => void
  /** Puts the baseline back into the source and returns a copy of it. */
  discard: () => T
  /** Resolves true when the page may leave: at once when clean, after the dialog when dirty. */
  confirmLeave: () => Promise<boolean>
  /** Whether Save changes is offered in the dialog. */
  savable: ComputedRef<boolean>
  /** `ConfirmDialog` props: open state, built-in title and description. */
  dialogProps: ComputedRef<UnsavedChangesDialogProps>
  /** Built-in labels for the dialog actions. */
  labels: ComputedRef<{ keepEditing: string; discard: string; save: string }>
  /** Closes the dialog and stays on the page. */
  keepEditing: () => void
  /** Discards the changes and leaves. */
  discardAndLeave: () => void
  /** Runs `onSave`, then leaves when the form is clean. */
  saveAndLeave: () => Promise<void>
}

const snapshot = (value: unknown) => JSON.stringify(value ?? null)

/**
 * Dirty baseline and leave guard for a form: compares the source with the last committed value,
 * warns before a reload while dirty, and drives a `ConfirmDialog` from a router leave guard.
 */
export function useUnsavedChanges<T>(
  source: MaybeRefOrGetter<T>,
  options: UseUnsavedChangesOptions<T> = {}
): UseUnsavedChangesReturn<T> {
  const { t } = useTranslate({ unsavedChanges: en.unsavedChanges })
  const baselineText = ref(snapshot(toValue(source)))
  const baseline = computed(() => JSON.parse(baselineText.value) as T)
  const open = ref(false)
  const saving = ref(false)
  let release: ((allowed: boolean) => void) | null = null

  const enabled = () => toValue(options.enabled) ?? true
  const isDirty = computed(() => snapshot(toValue(source)) !== baselineText.value)
  const savable = computed(() => Boolean(options.onSave) && (toValue(options.savable) ?? true))

  const settle = (allowed: boolean) => {
    const resolve = release
    release = null
    open.value = false
    resolve?.(allowed)
  }

  const commit = (next?: T) => {
    baselineText.value = snapshot(next === undefined ? toValue(source) : next)
  }

  const discard = () => {
    const copy = JSON.parse(baselineText.value) as T
    if (isRef(source)) {
      ;(source as Ref<T>).value = copy
    } else {
      options.onDiscard?.(JSON.parse(baselineText.value) as T)
    }
    return copy
  }

  const confirmLeave = () => {
    if (!enabled() || !isDirty.value) return Promise.resolve(true)
    release?.(false)
    open.value = true
    return new Promise<boolean>((resolve) => {
      release = resolve
    })
  }

  const keepEditing = () => {
    if (saving.value) return
    settle(false)
  }

  const discardAndLeave = () => {
    if (saving.value) return
    discard()
    settle(true)
  }

  const saveAndLeave = async () => {
    if (!options.onSave || saving.value) return
    saving.value = true
    try {
      await options.onSave()
    } catch {
      saving.value = false
      return
    }
    saving.value = false
    if (isDirty.value) return
    settle(true)
  }

  const dialogProps = computed<UnsavedChangesDialogProps>(() => ({
    open: open.value,
    title: t('unsavedChanges.title'),
    description: savable.value
      ? t('unsavedChanges.descriptionSavable')
      : t('unsavedChanges.description'),
    kind: 'danger',
    loading: saving.value,
    'onUpdate:open': (next: boolean) => {
      if (next) return
      if (saving.value) return
      settle(false)
    }
  }))

  const labels = computed(() => ({
    keepEditing: t('unsavedChanges.keepEditing'),
    discard: t('unsavedChanges.discard'),
    save: t('unsavedChanges.save')
  }))

  if (options.beforeUnload !== false && typeof window !== 'undefined') {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!enabled() || !isDirty.value) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    if (getCurrentScope()) {
      onScopeDispose(() => {
        window.removeEventListener('beforeunload', onBeforeUnload)
        release?.(false)
      })
    }
  }

  return {
    isDirty,
    baseline: readonly(baseline) as Readonly<Ref<T>>,
    saving: readonly(saving),
    commit,
    discard,
    confirmLeave,
    savable,
    dialogProps,
    labels,
    keepEditing,
    discardAndLeave,
    saveAndLeave
  }
}
