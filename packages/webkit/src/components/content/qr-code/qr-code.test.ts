import { cleanup, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import Default from '../../../../examples/qr-code/default.vue'
import Sizes from '../../../../examples/qr-code/sizes.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import QrCode from './qr-code.vue'
import { encodeQr } from './qr-encode'

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

const root = (): HTMLElement =>
  document.body.querySelector<HTMLElement>('[data-testid="content-qr-code"]')!

const URI = 'otpauth://totp/Azion:ana%40example.com?secret=JBSWY3DPEHPK3PXP&issuer=Azion'

describe('encodeQr', () => {
  it('picks the smallest version for the length and level', () => {
    expect(encodeQr('hi', 'L')).toHaveLength(21)
    expect(encodeQr(URI, 'M')).toHaveLength(37)
    expect(encodeQr('x'.repeat(300), 'M')).toHaveLength(69)
  })

  it('draws the three finder patterns and the timing lines', () => {
    const grid = encodeQr(URI)
    const n = grid.length
    for (const [x, y] of [
      [0, 0],
      [n - 7, 0],
      [0, n - 7]
    ]) {
      expect(grid[y].slice(x, x + 7)).toEqual(Array(7).fill(true))
      expect(grid[y + 1].slice(x, x + 7)).toEqual([true, false, false, false, false, false, true])
      expect(grid[y + 3].slice(x, x + 7)).toEqual([true, false, true, true, true, false, true])
    }
    for (let i = 8; i < n - 8; i++) {
      expect(grid[6][i]).toBe(i % 2 === 0)
      expect(grid[i][6]).toBe(i % 2 === 0)
    }
    expect(grid[n - 8][8]).toBe(true)
  })

  it('is deterministic and throws past version 40', () => {
    expect(encodeQr(URI)).toEqual(encodeQr(URI))
    expect(() => encodeQr('z'.repeat(1300), 'H')).toThrow(RangeError)
  })
})

describe('QrCode', () => {
  it('is an image named by the label, with the code dark on a light plate', () => {
    const view = render(QrCode, { props: { value: URI, label: 'QR code to add ana' } })
    const img = view.getByRole('img', { name: 'QR code to add ana' })
    expect(img).toHaveAttribute('data-theme', 'light')
    expect(img).toHaveAttribute('data-version', '5')
    expect(img).toHaveAttribute('data-modules', '37')
    const svg = img.querySelector('svg')!
    expect(svg).toHaveAttribute('aria-hidden', 'true')
    expect(svg).toHaveAttribute('viewBox', '0 0 45 45')
    expect(svg.querySelector('path')!.getAttribute('fill')).toBe('currentColor')
    const plate = getComputedStyle(img)
    expect(plate.color).not.toBe(plate.backgroundColor)
  })

  it('takes a size', () => {
    render(QrCode, { props: { value: 'a', size: 'small' } })
    expect(root()).toHaveAttribute('data-size', 'small')
  })

  it('draws nothing for an empty value and keeps the plate', () => {
    render(QrCode, { props: { value: '' } })
    expect(root()).not.toHaveAttribute('data-version')
    expect(root().querySelector('path')).toBeNull()
  })

  it('warns once and draws nothing for a value too long to encode', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    render(QrCode, { props: { value: 'z'.repeat(1300), errorCorrection: 'H' } })
    expect(root().querySelector('path')).toBeNull()
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('reads the default name from the locale catalog', () => {
    render(WebkitProvider, {
      props: { locale: 'pt-BR', catalogs: LOCALES },
      slots: { default: () => h(QrCode, { value: 'a' }) }
    })
    expect(root()).toHaveAccessibleName('Código QR')
  })

  it('keeps the code unmirrored under rtl', () => {
    const host = document.createElement('div')
    host.dir = 'rtl'
    document.body.appendChild(host)
    render(QrCode, { props: { value: 'a' }, container: host })
    expect(root().querySelector('svg')).toHaveAttribute('dir', 'ltr')
    host.remove()
  })

  it('honors a consumer data-testid', () => {
    const view = render(QrCode, { props: { value: 'a' }, attrs: { 'data-testid': 'mfa-qr' } })
    expect(view.getByTestId('mfa-qr')).toHaveAttribute('role', 'img')
  })

  it('renders the examples without axe violations', async () => {
    const a = render(Default)
    await expectNoA11yViolations(a.container)
    a.unmount()
    const b = render(Sizes)
    expect(b.getAllByRole('img')).toHaveLength(3)
    await expectNoA11yViolations(b.container)
  })
})
