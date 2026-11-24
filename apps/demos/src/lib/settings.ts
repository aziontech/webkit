import { computed, reactive, ref, watch } from 'vue'

export type Theme = 'dark' | 'light' | 'system'
export type ResolvedTheme = 'dark' | 'light'
export type Direction = 'ltr' | 'rtl'

export const LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'pt-BR', label: 'Português (Brasil)' }
]

export const settings = reactive({
  theme: 'system' as Theme,
  locale: 'en',
  dir: 'ltr' as Direction
})

const darkScheme = globalThis.matchMedia?.('(prefers-color-scheme: dark)')
const systemTheme = ref<ResolvedTheme>(darkScheme?.matches ? 'dark' : 'light')
darkScheme?.addEventListener?.('change', (event) => {
  systemTheme.value = event.matches ? 'dark' : 'light'
})

export const resolvedTheme = computed<ResolvedTheme>(() =>
  settings.theme === 'system' ? systemTheme.value : settings.theme
)

const KEY = 'webkit-demos:'

function read(name: string): string | null {
  try {
    return globalThis.localStorage?.getItem(KEY + name) ?? null
  } catch {
    return null
  }
}

function write(name: string, value: string) {
  try {
    globalThis.localStorage?.setItem(KEY + name, value)
  } catch {}
}

function apply() {
  const root = globalThis.document?.documentElement
  if (!root) return
  root.dataset.theme = resolvedTheme.value
  root.lang = settings.locale
}

export function restoreSettings() {
  const params = new URLSearchParams(globalThis.location?.search ?? '')
  const theme = params.get('theme') ?? read('theme')
  const locale = params.get('lang') ?? read('locale')
  const dir = params.get('dir') ?? read('dir')
  if (theme === 'dark' || theme === 'light' || theme === 'system') settings.theme = theme
  if (locale && LOCALES.some((option) => option.value === locale)) settings.locale = locale
  if (dir === 'ltr' || dir === 'rtl') settings.dir = dir
  apply()
  watch(
    () => ({ ...settings, resolved: resolvedTheme.value }),
    (value) => {
      write('theme', value.theme)
      write('locale', value.locale)
      write('dir', value.dir)
      apply()
    }
  )
}
