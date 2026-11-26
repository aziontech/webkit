import { computed, type ComputedRef, inject, onMounted, onScopeDispose, ref } from 'vue'

import { LocaleInjectionKey } from '../use-translate'

const TICK_MS = 60_000
const now = ref<number>(Date.now())
let subscribers = 0
let timer: ReturnType<typeof setInterval> | undefined

function start(): void {
  now.value = Date.now()
  if (timer === undefined) timer = setInterval(() => (now.value = Date.now()), TICK_MS)
}

function stop(): void {
  if (timer === undefined) return
  clearInterval(timer)
  timer = undefined
}

function onVisibilitychange(): void {
  if (document.visibilityState === 'hidden') stop()
  else start()
}

function subscribe(): void {
  subscribers += 1
  if (subscribers === 1) document.addEventListener('visibilitychange', onVisibilitychange)
  if (document.visibilityState === 'hidden') now.value = Date.now()
  else start()
}

function unsubscribe(): void {
  if (subscribers === 0) return
  subscribers -= 1
  if (subscribers > 0) return
  document.removeEventListener('visibilitychange', onVisibilitychange)
  stop()
}

export function useMinuteClock(): ComputedRef<number> {
  const provided = inject(LocaleInjectionKey, null)?.now
  if (subscribers === 0) now.value = Date.now()
  let subscribed = false
  onMounted(() => {
    subscribed = true
    subscribe()
  })
  onScopeDispose(() => {
    if (subscribed) unsubscribe()
  })
  return computed(() => provided?.value ?? now.value)
}
