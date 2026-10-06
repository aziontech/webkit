import { computed, ref, watch } from 'vue'

const STORAGE_KEY = 'webkit-sample-mode'

export const SAMPLE_MODES = [
  { value: 'empty', label: 'Empty account', icon: 'pi pi-inbox' },
  { value: 'populated', label: 'Populated account', icon: 'pi pi-database' }
]

const isMode = (value) => SAMPLE_MODES.some((option) => option.value === value)

const DEFAULT_MODE = 'populated'

const readStored = () => {
  if (typeof localStorage === 'undefined') return DEFAULT_MODE
  const stored = localStorage.getItem(STORAGE_KEY)
  return isMode(stored) ? stored : DEFAULT_MODE
}

const mode = ref(readStored())

watch(mode, (value) => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, value)
})

export function useSampleMode() {
  return {
    mode,
    accountEmpty: computed(() => mode.value === 'empty'),
    setMode
  }
}

export function setMode(value) {
  if (isMode(value)) mode.value = value
}

export function installSampleMode(router) {
  router.afterEach((to) => {
    const requested = to.query.state
    if (typeof requested === 'string') setMode(requested)
  })
}
