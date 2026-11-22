import {
  computed,
  type ComputedRef,
  isRef,
  type MaybeRefOrGetter,
  readonly,
  type Ref,
  ref,
  toValue
} from 'vue'

import { useBeforeUnloadGuard } from './composables/use-before-unload-guard'
import { useLeaveDialog } from './composables/use-leave-dialog'

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
  variant: 'danger' | 'primary'
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

export function useUnsavedChanges<T>(
  source: MaybeRefOrGetter<T>,
  options: UseUnsavedChangesOptions<T> = {}
): UseUnsavedChangesReturn<T> {
  const baselineText = ref(snapshot(toValue(source)))
  const baseline = computed(() => JSON.parse(baselineText.value) as T)

  const enabled = () => toValue(options.enabled) ?? true
  const isDirty = computed(() => snapshot(toValue(source)) !== baselineText.value)
  const savable = computed(() => Boolean(options.onSave) && (toValue(options.savable) ?? true))

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

  const { cancel, ...dialog } = useLeaveDialog({
    isDirty,
    enabled,
    savable,
    discard,
    onSave: options.onSave
  })

  if (options.beforeUnload !== false) {
    useBeforeUnloadGuard(() => enabled() && isDirty.value, cancel)
  }

  return {
    isDirty,
    baseline: readonly(baseline) as Readonly<Ref<T>>,
    commit,
    discard,
    savable,
    ...dialog
  }
}
