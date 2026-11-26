import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { commands } from 'vitest/browser'
import { defineComponent, effectScope, h, nextTick, ref } from 'vue'

import { useMediaQuery } from './index'

const REDUCED = '(prefers-reduced-motion: reduce)'

afterEach(async () => {
  await commands.emulateMedia({ reducedMotion: null })
})

describe('useMediaQuery', () => {
  it('starts a component at the server value and reads the query once it is mounted', async () => {
    await commands.emulateMedia({ reducedMotion: 'reduce' })
    const seen: boolean[] = []
    render(
      defineComponent({
        setup() {
          const reduced = useMediaQuery(REDUCED)
          seen.push(reduced.value)
          return () => h('p', { 'data-reduced': String(reduced.value) })
        }
      })
    )
    expect(seen).toEqual([false])
    await nextTick()
    expect(document.querySelector('[data-reduced]')?.getAttribute('data-reduced')).toBe('true')
  })

  it('keeps the given server value until mount', () => {
    const seen: boolean[] = []
    render(
      defineComponent({
        setup() {
          seen.push(useMediaQuery('(min-width: 99999px)', true).value)
          return () => h('p')
        }
      })
    )
    expect(seen).toEqual([true])
  })

  it('tracks changes and stops when its scope is disposed', async () => {
    const scope = effectScope()
    const reduced = scope.run(() => useMediaQuery(REDUCED))!
    expect(reduced.value).toBe(false)
    await commands.emulateMedia({ reducedMotion: 'reduce' })
    await expect.poll(() => reduced.value).toBe(true)
    scope.stop()
    await commands.emulateMedia({ reducedMotion: 'no-preference' })
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(reduced.value).toBe(true)
  })

  it('follows a query that changes', async () => {
    await commands.emulateMedia({ reducedMotion: 'reduce' })
    const scope = effectScope()
    const source = ref('(prefers-reduced-motion: no-preference)')
    const matches = scope.run(() => useMediaQuery(source))!
    expect(matches.value).toBe(false)
    source.value = REDUCED
    await nextTick()
    expect(matches.value).toBe(true)
    scope.stop()
  })
})
