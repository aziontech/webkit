import { reactive, watch } from 'vue'

export type ThemeSetting = 'system' | 'dark' | 'light'

export const settings = reactive({
  theme: 'dark' as ThemeSetting,
  locale: 'en',
  dir: 'ltr' as 'ltr' | 'rtl'
})

const KEY = 'webkit-docs:'

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

export function resolvedTheme(theme: ThemeSetting): 'dark' | 'light' {
  if (theme !== 'system') return theme
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme: ThemeSetting) {
  const root = globalThis.document?.documentElement
  if (!root) return
  const mode = resolvedTheme(theme)
  root.classList.remove('azion-dark', 'azion-light')
  root.classList.add('azion', `azion-${mode}`)
  root.dataset.theme = mode
}

export function restoreSettings(overrides: URLSearchParams | null = null) {
  const theme = overrides?.get('theme') ?? read('theme')
  const locale = overrides?.get('lang') ?? read('locale')
  const dir = overrides?.get('dir') ?? read('dir')
  if (theme === 'dark' || theme === 'light' || theme === 'system') settings.theme = theme
  if (locale && ['en', 'pt-BR', 'es'].includes(locale)) settings.locale = locale
  if (dir === 'ltr' || dir === 'rtl') settings.dir = dir
  applyTheme(settings.theme)
}

export function persistSettings() {
  watch(
    () => ({ ...settings }),
    (value) => {
      write('theme', value.theme)
      write('locale', value.locale)
      write('dir', value.dir)
      applyTheme(value.theme)
      const root = globalThis.document?.documentElement
      if (root) root.lang = value.locale
    }
  )
}
