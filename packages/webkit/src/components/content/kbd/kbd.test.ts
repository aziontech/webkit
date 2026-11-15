import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import Kbd from './kbd.vue'

// Starter suite emitted by the scaffold — a FLOOR, not the ceiling. Expand per
// .claude/rules/testing.md: mount its example from examples/kbd once it
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

    it('keeps the ⌘ symbol on macOS whatever the locale', async () => {
      vi.stubGlobal('navigator', { platform: 'MacIntel', userAgent: 'Macintosh' })
      const { getByTestId } = render(inProvider({ meta: true }, { locale: 'pt-BR' }))
      await nextTick()
      expect(getByTestId('content-kbd')).toHaveTextContent('⌘')
    })

    it('prints the macOS glyphs for meta, ctrl and alt once mounted', async () => {
      vi.stubGlobal('navigator', { platform: 'MacIntel', userAgent: 'Macintosh' })
      const { getByTestId } = render(Kbd, { props: { meta: true, ctrl: true, alt: true } })
      await nextTick()
      expect(getByTestId('content-kbd')).toHaveTextContent('⌘⌃⌥')
    })

    it('prints Ctrl and Alt for meta, ctrl and alt on other platforms', async () => {
      vi.stubGlobal('navigator', { platform: 'Win32', userAgent: 'Windows' })
      const { getByTestId } = render(Kbd, { props: { meta: true, ctrl: true, alt: true } })
      await nextTick()
      expect(getByTestId('content-kbd')).toHaveTextContent('CtrlCtrlAlt')
    })
  })

  describe('keys and kind', () => {
    afterEach(() => vi.unstubAllGlobals())

    it('prints the arrow keys and the Return glyph from the catalog', () => {
      const { getByTestId } = render(Kbd, { props: { keys: ['arrow-up', 'arrow-down', 'return'] } })
      expect(getByTestId('content-kbd')).toHaveTextContent('↑↓↵')
    })

    it('resolves modifiers, named keys and single characters in a keys list', async () => {
      vi.stubGlobal('navigator', { platform: 'MacIntel', userAgent: 'Macintosh' })
      const { getByTestId } = render(Kbd, { props: { keys: ['meta', 'shift', 'p', 'Enter'] } })
      await nextTick()
      expect(getByTestId('content-kbd')).toHaveTextContent('⌘⇧PEnter')
    })

    it('draws one keycap by default and one nested keycap per key with kind=separate', () => {
      const combined = render(Kbd, { props: { keys: ['ctrl', 'k'] } })
      expect(combined.getByTestId('content-kbd')).toHaveAttribute('data-kind', 'combined')
      expect(combined.queryAllByTestId('content-kbd__key')).toHaveLength(0)
      combined.unmount()

      const { getByTestId, getAllByTestId } = render(Kbd, {
        props: { keys: ['ctrl', 'k'], kind: 'separate', size: 'small' },
        slots: { default: () => '/' }
      })
      expect(getByTestId('content-kbd')).toHaveAttribute('data-kind', 'separate')
      const caps = getAllByTestId('content-kbd__key')
      expect(caps).toHaveLength(3)
      expect(caps.every((cap) => cap.tagName === 'KBD')).toBe(true)
      expect(caps.map((cap) => cap.textContent)).toEqual([expect.any(String), 'K', '/'])
      expect(caps[0]).toHaveAttribute('data-size', 'small')
    })

    it('has no axe violations with separate keycaps', async () => {
      const { container } = render(Kbd, {
        props: { keys: ['arrow-left', 'arrow-right'], kind: 'separate' }
      })
      await expectNoA11yViolations(container)
    })
  })
})
