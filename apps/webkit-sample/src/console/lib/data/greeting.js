import { computed, onScopeDispose, ref } from 'vue'

const BANDS = [
  [22, 'Working late'],
  [18, 'Good evening'],
  [12, 'Good afternoon'],
  [5, 'Good morning'],
  [2, 'Up before the sun'],
  [0, 'Working late']
]

const labelFor = (hour) => BANDS.find(([start]) => hour >= start)?.[1] ?? 'Hello'

const msToNextHour = (now) =>
  (60 - now.getMinutes()) * 60_000 - now.getSeconds() * 1000 - now.getMilliseconds()

const ACCOUNT_OWNER = 'Gabriel'

export const nameFromEmail = (address) => {
  const local = String(address ?? '')
    .split('@')[0]
    .trim()
  if (!local || local.toLowerCase() === 'myemail') return ACCOUNT_OWNER
  const first = local.split(/[._+-]/).filter(Boolean)[0] ?? ''
  if (!first || /^\d+$/.test(first)) return ACCOUNT_OWNER
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase()
}

const ACCOUNT_OWNER_FULL_NAME = 'Gabriel Lisboa'
const ACCOUNT_OWNER_EMAIL = 'gabriel.mendonca@azion.com'

const isPlaceholderEmail = (address) => {
  const local = String(address ?? '')
    .split('@')[0]
    .trim()
  return !local || local.toLowerCase() === 'myemail'
}

export const emailOrOwner = (address) =>
  isPlaceholderEmail(address) ? ACCOUNT_OWNER_EMAIL : String(address).trim()

export const fullNameFromEmail = (address) => {
  if (isPlaceholderEmail(address)) return ACCOUNT_OWNER_FULL_NAME
  const parts = String(address)
    .split('@')[0]
    .split(/[._+-]/)
    .filter((part) => part && !/^\d+$/.test(part))
  if (!parts.length) return ACCOUNT_OWNER_FULL_NAME
  return parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(' ')
}

export function useGreeting() {
  const label = ref(labelFor(new Date().getHours()))

  let timer
  const tick = () => {
    label.value = labelFor(new Date().getHours())
    timer = globalThis.setTimeout(tick, msToNextHour(new Date()) + 1000)
  }
  timer = globalThis.setTimeout(tick, msToNextHour(new Date()) + 1000)

  onScopeDispose(() => globalThis.clearTimeout(timer))

  return {
    greeting: computed(() => label.value),
    nameFor: (address) => nameFromEmail(address),
    greetingFor: (address) => {
      const name = nameFromEmail(address)
      return name ? `${label.value}, ${name}` : label.value
    }
  }
}
