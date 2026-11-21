import {
  useUnsavedChanges,
  type UseUnsavedChangesReturn
} from '@aziontech/webkit/use-unsaved-changes'
import type { Ref } from 'vue'

export interface UseDrawerGuardOptions<T> {
  /** Whether the drawer is open; the composable closes it once leaving is confirmed. */
  open: Ref<boolean>
  /** True while the form is being sent: the guard is off. */
  busy: () => boolean
  /** The values the unsaved-changes guard watches. */
  source: () => T
  /** Puts the baseline back into the form when the changes are discarded. */
  onDiscard?: (baseline: T) => void
}

export interface UseDrawerGuardReturn<T> {
  /** The unsaved-changes guard of the form. */
  guard: UseUnsavedChangesReturn<T>
  /** Opens at once; closes only after the guard confirms leaving. */
  onOpenChange: (next: boolean) => Promise<void>
}

export function useDrawerGuard<T>(options: UseDrawerGuardOptions<T>): UseDrawerGuardReturn<T> {
  const { open, busy, source, onDiscard } = options

  const guard = useUnsavedChanges(source, {
    onDiscard,
    enabled: () => open.value && !busy()
  })

  const onOpenChange = async (next: boolean) => {
    if (next) {
      open.value = true
      return
    }
    if (await guard.confirmLeave()) open.value = false
  }

  return { guard, onOpenChange }
}
