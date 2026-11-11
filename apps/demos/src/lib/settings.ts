import { reactive, watch } from 'vue'

export type Theme = 'dark' | 'light'
export type Direction = 'ltr' | 'rtl'

export const LOCALES = [
  { value: 'en', label: 'English' },
  { value: 'pt-BR', label: 'Português (Brasil)' }
]

export const settings = reactive({
  theme: 'dark' as Theme,
  locale: 'en',
  dir: 'ltr' as Direction
})

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
  root.classList.remove('azion-dark', 'azion-light')
  root.classList.add('azion', `azion-${settings.theme}`)
  root.dataset.theme = settings.theme
  root.lang = settings.locale
}

export function restoreSettings() {
  const params = new URLSearchParams(globalThis.location?.search ?? '')
  const theme = params.get('theme') ?? read('theme')
  const locale = params.get('lang') ?? read('locale')
  const dir = params.get('dir') ?? read('dir')
  if (theme === 'dark' || theme === 'light') settings.theme = theme
  if (locale && LOCALES.some((option) => option.value === locale)) settings.locale = locale
  if (dir === 'ltr' || dir === 'rtl') settings.dir = dir
  apply()
  watch(
    () => ({ ...settings }),
    (value) => {
      write('theme', value.theme)
      write('locale', value.locale)
      write('dir', value.dir)
      apply()
    }
  )
}
