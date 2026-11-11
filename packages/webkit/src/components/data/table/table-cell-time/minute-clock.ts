import { onBeforeUnmount, onMounted, type Ref, ref } from 'vue'

const TICK_MS = 60_000
const now = ref<number>(Date.now())
let subscribers = 0
let timer: ReturnType<typeof setInterval> | undefined

function subscribe(): void {
  subscribers += 1
  now.value = Date.now()
  if (timer === undefined) timer = setInterval(() => (now.value = Date.now()), TICK_MS)
}

function unsubscribe(): void {
  subscribers = Math.max(0, subscribers - 1)
  if (subscribers > 0 || timer === undefined) return
  clearInterval(timer)
  timer = undefined
}

export function useMinuteClock(): Readonly<Ref<number>> {
  onMounted(subscribe)
  onBeforeUnmount(unsubscribe)
  return now
}
