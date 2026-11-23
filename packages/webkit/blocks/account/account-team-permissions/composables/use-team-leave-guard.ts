import {
  useUnsavedChanges,
  type UseUnsavedChangesReturn
} from '@aziontech/webkit/use-unsaved-changes'
import { type MaybeRefOrGetter, onScopeDispose, toValue } from 'vue'

export function useTeamLeaveGuard<T>(
  rootEl: MaybeRefOrGetter<HTMLElement | null>,
  source: MaybeRefOrGetter<T>,
  enabled: MaybeRefOrGetter<boolean>
): UseUnsavedChangesReturn<T> {
  const guard = useUnsavedChanges(source, { enabled })

  const onLeaveClick = async (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null
    const link = target?.closest<HTMLAnchorElement>('a[href]')
    if (!link || !toValue(rootEl)?.contains(link)) return
    if (!guard.isDirty.value) return
    event.preventDefault()
    if (await guard.confirmLeave()) window.location.assign(link.href)
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('click', onLeaveClick, true)
    onScopeDispose(() => document.removeEventListener('click', onLeaveClick, true))
  }

  return guard
}
