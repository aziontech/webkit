import type { ClientBrand } from '../../../../assets/logos/clients/brands'

const AA_TEXT = 4.5

const channel = (value: number): number => {
  const unit = value / 255
  return unit <= 0.04045 ? unit / 12.92 : ((unit + 0.055) / 1.055) ** 2.4
}

const luminance = (hex: string): number | null => {
  const match = /^#([0-9a-f]{6})$/i.exec(hex.trim())
  if (!match) return null
  const value = Number.parseInt(match[1]!, 16)
  return (
    0.2126 * channel((value >> 16) & 255) +
    0.7152 * channel((value >> 8) & 255) +
    0.0722 * channel(value & 255)
  )
}

export function faceInk(brand: ClientBrand): 'dark' | 'light' {
  if (brand.ink) return brand.ink
  const base = luminance(brand.base)
  if (base === null) return 'light'
  return 1.05 / (base + 0.05) < AA_TEXT ? 'dark' : 'light'
}
