import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import Kbd from './kbd.vue'

// Starter suite emitted by the scaffold — a FLOOR, not the ceiling. Expand per
// .claude/rules/testing.md: reuse the Storybook story via composeStories once it
// exists, and add assertions for every OS-aware modifier glyph combination.
describe('Kbd', () => {
  it('renders and exposes the fallback data-testid', () => {
    const { getByTestId } = render(Kbd, { slots: { default: () => 'K' } })
    expect(getByTestId('content-kbd')).toBeTruthy()
  })

  it('lets a consumer override data-testid', () => {
    const { getByTestId } = render(Kbd, {
      attrs: { 'data-testid': 'custom-testid' },
      slots: { default: () => 'K' }
    })
    expect(getByTestId('custom-testid')).toBeTruthy()
  })

  it('defaults data-size to medium', () => {
    const { getByTestId } = render(Kbd, { slots: { default: () => 'K' } })
    expect(getByTestId('content-kbd')).toHaveAttribute('data-size', 'medium')
  })

  it('maps size=small to the data-size attribute', () => {
    const { getByTestId } = render(Kbd, {
      props: { size: 'small' },
      slots: { default: () => 'K' }
    })
    expect(getByTestId('content-kbd')).toHaveAttribute('data-size', 'small')
  })

  it('renders the shift modifier glyph before the key', () => {
    const { getByTestId } = render(Kbd, {
      props: { shift: true },
      slots: { default: () => 'K' }
    })

    const root = getByTestId('content-kbd')
    expect(root).toHaveTextContent('⇧')
    expect(root).toHaveTextContent('K')
  })

  it('has no axe violations on the default render', async () => {
    const { container } = render(Kbd, { slots: { default: () => 'K' } })
    await expectNoA11yViolations(container)
  })

  describe('key names from the locale catalog', () => {
    afterEach(() => vi.unstubAllGlobals())

    const inProvider = (props: Record<string, unknown>, providerProps: Record<string, unknown>) =>
      defineComponent({
        setup: () => () =>
          h(
            WebkitProvider,
            { catalogs: LOCALES, ...providerProps },
            { default: () => h(Kbd, props) }
          )
      })

    it('prints a named key from the active catalog', () => {
      const { getByTestId, unmount } = render(inProvider({ keyName: 'space' }, { locale: 'pt-BR' }))
      expect(getByTestId('content-kbd')).toHaveTextContent('Espaço')
      unmount()
      const english = render(inProvider({ keyName: 'escape' }, { locale: 'en' }))
      expect(english.getByTestId('content-kbd')).toHaveTextContent('Esc')
    })

    it('renames a modifier through the provider messages (Strg)', () => {
      vi.stubGlobal('navigator', { platform: 'Win32', userAgent: 'Windows' })
      const { getByTestId } = render(
        inProvider(
          { meta: true, keyName: 'delete' },
          {
            locale: 'de',
            messages: { kbd: { ctrl: 'Strg', delete: 'Entf' } }
          }
        )
      )
      expect(getByTestId('content-kbd')).toHaveTextContent('StrgEntf')
    })

    it('keeps the ⌘ symbol on macOS whatever the locale', () => {
      vi.stubGlobal('navigator', { platform: 'MacIntel', userAgent: 'Macintosh' })
      const { getByTestId } = render(inProvider({ meta: true }, { locale: 'pt-BR' }))
      expect(getByTestId('content-kbd')).toHaveTextContent('⌘')
    })
  })
})
