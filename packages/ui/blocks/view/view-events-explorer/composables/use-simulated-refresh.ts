import { computed, type ComputedRef, onScopeDispose, ref } from 'vue'

/** A refresh the sample answers after a short delay. */
export interface UseSimulatedRefreshReturn {
  /** The refresh is in flight. */
  loading: ComputedRef<boolean>
  /** Starts a refresh unless one is in flight. */
  refresh: () => void
}

export function useSimulatedRefresh(delay = 700): UseSimulatedRefreshReturn {
  const busy = ref(false)
  let refreshTimer: ReturnType<typeof setTimeout> | undefined
  const refresh = () => {
    if (busy.value) return
    busy.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      busy.value = false
    }, delay)
  }
  onScopeDispose(() => clearTimeout(refreshTimer))
  return { loading: computed(() => busy.value), refresh }
}
