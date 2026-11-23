import {
  useUnsavedChanges,
  type UseUnsavedChangesReturn
} from '@aziontech/webkit/use-unsaved-changes'
import { type MaybeRefOrGetter, onScopeDispose, toValue, watch } from 'vue'

export function useTeamLeaveGuard<T>(
  rootEl: MaybeRefOrGetter<HTMLElement | null>,
  source: MaybeRefOrGetter<T>,
  enabled: MaybeRefOrGetter<boolean>
): UseUnsavedChangesReturn<T> {
  const guard = useUnsavedChanges(source, { enabled })

  const onLeaveClick = async (event: MouseEvent) => {
    const target = event.target instanceof Element ? event.target : null
    const link = target?.closest<HTMLAnchorElement>('a[href]')
    if (!link || !guard.isDirty.value || event.defaultPrevented) return
    event.preventDefault()
    if (await guard.confirmLeave()) window.location.assign(link.href)
  }

  const stop = watch(
    () => toValue(rootEl),
    (next, before) => {
      before?.removeEventListener('click', onLeaveClick, true)
      next?.addEventListener('click', onLeaveClick, true)
    },
    { immediate: true, flush: 'post' }
  )

  onScopeDispose(() => {
    stop()
    toValue(rootEl)?.removeEventListener('click', onLeaveClick, true)
  })

  return guard
}
