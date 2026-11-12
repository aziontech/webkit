/** A client's brand colours: content, not theme tokens. */
export interface ClientBrand {
  /** Base colour of a face painted in the brand. */
  base: string
  /** Colour of the glows drawn over the base. */
  glow: string
  /** Ink of text on the face: `dark` when the base is light, otherwise light. */
  ink?: 'dark' | 'light'
}

export const normalizeClientName = (name: string | null | undefined): string =>
  (name ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

export const CLIENT_BRANDS: Record<string, ClientBrand> = {
  agibank: { base: '#0e89ff', glow: '#0e89ff' },
  americanas: { base: '#e60014', glow: '#ff4d5e' },
  arezzo: { base: '#2b2b2b', glow: '#6b6b6b' },
  dafiti: { base: '#ffffff', glow: '#ffffff', ink: 'dark' },
  herospark: { base: '#a31e3a', glow: '#ff305c' },
  madeiramadeira: { base: '#ae3d00', glow: '#f0801c' },
  magalu: { base: '#00264b', glow: '#0f88ff' },
  renner: { base: '#7a0202', glow: '#ef0000' }
}

export const clientBrand = (name: string | null | undefined): ClientBrand | null =>
  CLIENT_BRANDS[normalizeClientName(name)] ?? null
