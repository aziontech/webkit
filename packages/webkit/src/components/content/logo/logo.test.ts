import { cleanup, render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Default from '../../../../examples/logo/default.vue'
import Types from '../../../../examples/logo/types.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import Logo from './logo.vue'

afterEach(() => cleanup())

const DARK = 'https://example.com/acme-dark.svg'
const LIGHT = 'https://example.com/acme-light.svg'

const root = (): HTMLElement =>
  document.body.querySelector<HTMLElement>('[data-testid="content-logo"]')!

describe('Logo', () => {
  it('renders the derived test id and lets the consumer override it', () => {
    render(Logo, { props: { name: 'Acme Inc.', src: DARK } })
    expect(root()).not.toBeNull()
    cleanup()
    const view = render(Logo, {
      props: { name: 'Acme Inc.', src: DARK },
      attrs: { 'data-testid': 'acme' }
    })
    expect(view.getByTestId('acme')).toHaveAttribute('data-route', 'single')
  })

  it('renders both files of a light/dark pair and announces the mark once', () => {
    const view = render(Logo, { props: { name: 'Acme Inc.', src: DARK, srcLight: LIGHT } })
    const mark = view.getByRole('img', { name: 'Acme Inc.' })
    expect(mark).toHaveAttribute('data-route', 'pair')
    expect(mark).toHaveAttribute('data-kind', 'color')
    const files = mark.querySelectorAll('img')
    expect(files).toHaveLength(2)
    expect(mark.querySelector('[data-theme-file="dark"]')).toHaveAttribute('src', DARK)
    expect(mark.querySelector('[data-theme-file="light"]')).toHaveAttribute('src', LIGHT)
    files.forEach((file) => {
      expect(file).toHaveAttribute('alt', '')
      expect(file).toHaveAttribute('aria-hidden', 'true')
    })
  })

  it.each(['color', 'light', 'dark'] as const)(
    'carries the %s artwork on a single file',
    (artwork) => {
      const view = render(Logo, { props: { name: 'Acme Inc.', src: DARK, artwork } })
      const mark = view.getByRole('img', { name: 'Acme Inc.' })
      expect(mark).toHaveAttribute('data-route', 'single')
      expect(mark).toHaveAttribute('data-artwork', artwork)
      expect(mark.querySelector('img')).toHaveAttribute('data-artwork', artwork)
    }
  )

  it.each(['monochrome', 'knockout'] as const)(
    'draws one file for the %s ink, even with a pair',
    (kind) => {
      const view = render(Logo, { props: { name: 'Acme Inc.', src: DARK, srcLight: LIGHT, kind } })
      const mark = view.getByRole('img', { name: 'Acme Inc.' })
      expect(mark).toHaveAttribute('data-route', 'single')
      expect(mark).toHaveAttribute('data-kind', kind)
      const files = mark.querySelectorAll('img')
      expect(files).toHaveLength(1)
      expect(files[0]).toHaveAttribute('src', DARK)
      expect(files[0]).toHaveAttribute('data-ink', kind)
    }
  )

  it('paints the current ink through a mask of the file', () => {
    const view = render(Logo, { props: { name: 'Acme Inc.', srcLight: LIGHT, kind: 'current' } })
    const mark = view.getByRole('img', { name: 'Acme Inc.' })
    const layer = mark.querySelector<HTMLElement>('[data-ink-layer]')!
    expect(layer).toHaveAttribute('aria-hidden', 'true')
    expect(layer.style.getPropertyValue('--logo-mask')).toContain(LIGHT)
    expect(mark.querySelector('img')).toHaveAttribute('src', LIGHT)
  })

  it('draws the name as a wordmark when there is no file', () => {
    const view = render(Logo, { props: { name: 'Acme Inc.' } })
    const mark = view.getByRole('img', { name: 'Acme Inc.' })
    expect(mark).toHaveAttribute('data-route', 'wordmark')
    expect(mark.querySelector('img')).toBeNull()
    const word = mark.querySelector('span')!
    expect(word).toHaveTextContent('Acme Inc.')
    expect(word).toHaveAttribute('dir', 'auto')
  })

  it('takes its accessible name from ariaLabel when set', () => {
    const view = render(Logo, { props: { name: 'Acme', ariaLabel: 'Acme Inc. logo', src: DARK } })
    expect(view.getByRole('img', { name: 'Acme Inc. logo' })).toBeInTheDocument()
  })

  it('hides a decorative mark from assistive technology', () => {
    const view = render(Logo, { props: { name: 'Acme Inc.', src: DARK, decorative: true } })
    expect(view.queryByRole('img')).toBeNull()
    expect(root()).toHaveAttribute('aria-hidden', 'true')
    expect(root()).not.toHaveAttribute('aria-label')
  })

  it('marks the root sized only when the caller sets a height', () => {
    render(Logo, { props: { name: 'Acme Inc.', src: DARK } })
    expect(root()).not.toHaveAttribute('data-sized')
    cleanup()
    render(Logo, { props: { name: 'Acme Inc.', src: DARK }, attrs: { class: 'max-w-40 md:h-10' } })
    expect(root()).toHaveAttribute('data-sized')
    cleanup()
    render(Logo, { props: { name: 'Acme Inc.', src: DARK }, attrs: { class: 'max-h-8' } })
    expect(root()).not.toHaveAttribute('data-sized')
  })

  it.each([
    ['Default', Default],
    ['Types', Types]
  ])('has no a11y violations in the %s example', async (_name, example) => {
    const { container } = render(example)
    await expectNoA11yViolations(container)
  })
})
