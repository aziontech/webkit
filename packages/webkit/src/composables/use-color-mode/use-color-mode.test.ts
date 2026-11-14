import { fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { commands } from 'vitest/browser'
import { defineComponent, effectScope, nextTick } from 'vue'

import ThemeSwitcher from '../../components/inputs/theme-switcher/theme-switcher.vue'
import { COLOR_MODE_STORAGE_KEY, colorModeScript, setColorMode, useColorMode } from './index'

const scopes: ReturnType<typeof effectScope>[] = []
const run = () => {
  const scope = effectScope()
  scopes.push(scope)
  return scope.run(() => useColorMode())!
}

afterEach(async () => {
  scopes.splice(0).forEach((scope) => scope.stop())
  setColorMode('system')
  localStorage.removeItem(COLOR_MODE_STORAGE_KEY)
  document.documentElement.removeAttribute('data-theme')
  await commands.emulateMedia({ colorScheme: null })
})

describe('useColorMode', () => {
  it('starts from the stored choice', () => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'dark')
    expect(run().mode.value).toBe('dark')
  })

  it('stores the choice and sets data-theme on the document element', () => {
    const { mode, setMode } = run()
    setMode('light')
    expect(mode.value).toBe('light')
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe('light')
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    mode.value = 'system'
    expect(document.documentElement.getAttribute('data-theme')).toBe('system')
  })

  it('resolves system from the operating-system preference and tracks its changes', async () => {
    await commands.emulateMedia({ colorScheme: 'dark' })
    const { mode, resolved } = run()
    mode.value = 'system'
    expect(resolved.value).toBe('dark')
    await commands.emulateMedia({ colorScheme: 'light' })
    await expect.poll(() => resolved.value).toBe('light')
    mode.value = 'dark'
    expect(resolved.value).toBe('dark')
  })

  it('drives a ThemeSwitcher bound with v-model', async () => {
    const view = render(
      defineComponent({
        components: { ThemeSwitcher },
        setup: () => ({ mode: useColorMode().mode }),
        template: '<ThemeSwitcher v-model="mode" />'
      })
    )
    await nextTick()
    await fireEvent.click(view.getByRole('radio', { name: 'Dark' }))
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(localStorage.getItem(COLOR_MODE_STORAGE_KEY)).toBe('dark')
    view.unmount()
  })

  it('ships a pre-paint script that applies the stored choice before the app mounts', () => {
    localStorage.setItem(COLOR_MODE_STORAGE_KEY, 'light')
    new Function(colorModeScript)()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
    localStorage.removeItem(COLOR_MODE_STORAGE_KEY)
    new Function(colorModeScript)()
    expect(document.documentElement.getAttribute('data-theme')).toBe('system')
  })
})
