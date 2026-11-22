import { getCurrentScope, onScopeDispose } from 'vue'

export function useBeforeUnloadGuard(isGuarded: () => boolean, onDispose: () => void): void {
  if (typeof window === 'undefined') return
  const onBeforeunload = (event: BeforeUnloadEvent) => {
    if (!isGuarded()) return
    event.preventDefault()
    event.returnValue = ''
  }
  window.addEventListener('beforeunload', onBeforeunload)
  if (getCurrentScope()) {
    onScopeDispose(() => {
      window.removeEventListener('beforeunload', onBeforeunload)
      onDispose()
    })
  }
}
