import { useUnsavedChanges, type UseUnsavedChangesReturn } from '@aziontech/ui/use-unsaved-changes'
import { leavingLink } from '@aziontech/ui/utils/leave-link'
import { type MaybeRefOrGetter, onScopeDispose, toValue } from 'vue'

export function useTeamLeaveGuard<T>(
  rootEl: MaybeRefOrGetter<HTMLElement | null>,
  source: MaybeRefOrGetter<T>,
  enabled: MaybeRefOrGetter<boolean>
): UseUnsavedChangesReturn<T> {
  const guard = useUnsavedChanges(source, { enabled })

  const onLeaveClick = async (event: MouseEvent) => {
    const root = toValue(rootEl)
    const link = root ? leavingLink(event, root) : null
    if (!link || !guard.isDirty.value) return
    event.preventDefault()
    if (await guard.confirmLeave()) window.location.assign(link.href)
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('click', onLeaveClick, true)
    onScopeDispose(() => document.removeEventListener('click', onLeaveClick, true))
  }

  return guard
}
