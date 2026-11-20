import {
  computed,
  getCurrentInstance,
  getCurrentScope,
  onMounted,
  onScopeDispose,
  readonly,
  type Ref,
  ref,
  type WritableComputedRef
} from 'vue'

/** A theme choice: follow the operating system, or force light or dark. */
export type ColorMode = 'system' | 'light' | 'dark'

/** The theme that is on screen once `system` is resolved. */
export type ResolvedColorMode = 'light' | 'dark'

/** What `useColorMode()` returns. */
export interface UseColorModeReturn {
  /** The stored choice; bind it to ThemeSwitcher with v-model. Writing it stores and applies the choice. */
  mode: WritableComputedRef<ColorMode>
  /** The theme on screen: `mode`, or the operating-system preference when `mode` is `system`. */
  resolved: Readonly<Ref<ResolvedColorMode>>
  /** Stores the choice and sets `data-theme` on the document element. */
  setMode: (next: ColorMode) => void
}

export const COLOR_MODE_STORAGE_KEY = 'webkit-color-mode'

export const colorModeScript = `(function(){var d=document.documentElement,m;try{m=localStorage.getItem('${COLOR_MODE_STORAGE_KEY}')}catch(e){}d.setAttribute('data-theme',m==='light'||m==='dark'?m:'system')})()`

const DARK_QUERY = '(prefers-color-scheme: dark)'

const state = ref<ColorMode>('system')
const prefersDark = ref(false)
let hydrated = false
let users = 0
let media: MediaQueryList | null = null

const isColorMode = (value: unknown): value is ColorMode =>
  value === 'system' || value === 'light' || value === 'dark'

const readStored = (): ColorMode | null => {
  try {
    const value = globalThis.localStorage?.getItem(COLOR_MODE_STORAGE_KEY)
    return isColorMode(value) ? value : null
  } catch {
    return null
  }
}

const writeStored = (value: ColorMode): boolean => {
  try {
    globalThis.localStorage?.setItem(COLOR_MODE_STORAGE_KEY, value)
    return true
  } catch {
    return false
  }
}

const onMediaChange = (event: MediaQueryListEvent) => {
  prefersDark.value = event.matches
}

const listen = () => {
  users += 1
  if (media || typeof globalThis.matchMedia !== 'function') return
  media = globalThis.matchMedia(DARK_QUERY)
  prefersDark.value = media.matches
  media.addEventListener('change', onMediaChange)
}

const unlisten = () => {
  users = Math.max(0, users - 1)
  if (users > 0 || !media) return
  media.removeEventListener('change', onMediaChange)
  media = null
}

const hydrate = () => {
  listen()
  if (hydrated || typeof document === 'undefined') return
  hydrated = true
  const attribute = document.documentElement.getAttribute('data-theme')
  state.value = readStored() ?? (isColorMode(attribute) ? attribute : 'system')
}

export function setColorMode(next: ColorMode): void {
  state.value = next
  hydrated = true
  writeStored(next)
  if (typeof document !== 'undefined') document.documentElement.setAttribute('data-theme', next)
}

export function useColorMode(): UseColorModeReturn {
  let listening = false
  const start = () => {
    if (listening) return
    listening = true
    hydrate()
  }
  if (getCurrentInstance()) onMounted(start)
  else start()
  if (getCurrentScope()) {
    onScopeDispose(() => {
      if (listening) unlisten()
    })
  }

  const mode = computed<ColorMode>({
    get: () => state.value,
    set: (next) => setColorMode(next)
  })
  const resolved = computed<ResolvedColorMode>(() =>
    state.value === 'system' ? (prefersDark.value ? 'dark' : 'light') : state.value
  )

  return { mode, resolved: readonly(resolved), setMode: setColorMode }
}
