export type IllustrationRole =
  | 'ground'
  | 'surface'
  | 'surface-raised'
  | 'block'
  | 'line'
  | 'line-muted'
  | 'line-strong'
  | 'highlight'
  | 'ink'
  | 'ink-muted'
  | 'primary'
  | 'accent'
  | 'code-punctuation'
  | 'code-keyword'
  | 'success'
  | 'success-surface'
  | 'danger'
  | 'warning'
  | 'warning-surface'
  | 'info'
  | 'info-surface'

export const illustrationPalette: Record<string, IllustrationRole | null> = {
  '#000000': 'ground',
  '#0A0A0A': 'surface',
  '#141414': 'surface-raised',
  '#1A1A1A': 'block',
  '#2B2B2B': 'line',
  '#242424': 'line-muted',
  '#4D4D4D': 'line-strong',
  '#FFFFFF': 'highlight',
  '#FAFAFA': 'ink',
  '#EDEDED': 'ink',
  '#808080': 'ink-muted',
  '#F3652B': 'primary',
  '#0072F5': 'accent',
  '#999999': 'code-punctuation',
  '#3392FF': 'code-keyword',
  '#52E086': 'success',
  '#0A2916': 'success-surface',
  '#ED7878': 'danger',
  '#F7BD08': 'warning',
  '#312602': 'warning-surface',
  '#66ADFF': 'info',
  '#001833': 'info-surface',
  '#666666': null,
  '#E51A1A': null,
  '#F8CA3A': null,
  '#18B452': null,
  '#D83333': null,
  '#F041FF': null,
  '#00BCD4': null,
  '#41B883': null,
  '#35495E': null,
  '#FF3E00': null,
  '#FE601F': null,
  '#4040B2': null,
  '#5C4EE5': null,
  '#0098CC': null,
  '#F88100': null,
  '#FDAD33': null,
  '#FE292C': null
}

const NAMED_COLORS: Record<string, string> = { white: '#FFFFFF', black: '#000000' }

export function normalizeIllustrationColor(value: string): string {
  return NAMED_COLORS[value.toLowerCase()] ?? value.toUpperCase()
}
