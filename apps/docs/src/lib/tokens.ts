import { toast } from '@aziontech/ui/toast'
import { copyText } from '@aziontech/ui/utils/clipboard'

import { messages } from './i18n'
import type { Token } from './types'

export { type TokenGroup, usageGroups, usageSections } from './token-usage'

export type TokenKind =
  | 'color'
  | 'palette'
  | 'spacing'
  | 'radius'
  | 'shadow'
  | 'z-index'
  | 'ease'
  | 'duration'
  | 'font'
  | 'breakpoint'
  | 'container'
  | 'type'
  | 'animation'

export type TokenSampleKind =
  | 'swatch'
  | 'bar'
  | 'radius'
  | 'shadow'
  | 'type'
  | 'font'
  | 'weight'
  | 'ease'
  | 'duration'
  | 'animation'
  | 'none'

function colorUtility(name: string): string {
  if (/^--(text|code-syntax)-/.test(name) || /-foreground$/.test(name)) return 'text'
  if (/^--border-/.test(name) || /-border$/.test(name)) return 'border'
  if (/^--ring-/.test(name)) return 'ring'
  return 'bg'
}

export function tailwindClass(name: string, kind: TokenKind): string {
  const bare = name.replace(/^--/, '')
  switch (kind) {
    case 'color':
      return `${colorUtility(name)}-(${name})`
    case 'spacing':
      return /^--spacing-\d+$/.test(name) ? `p-${bare.replace('spacing-', '')}` : `p-(${name})`
    case 'radius':
      return name.startsWith('--radius') ? bare.replace(/^radius/, 'rounded') : `rounded-(${name})`
    case 'shadow':
      return bare
    case 'z-index':
      return `z-(${name})`
    case 'ease':
      return bare.startsWith('ease-') ? bare : ''
    case 'duration':
      return bare.replace(/^transition-duration-/, 'duration-').startsWith('duration-')
        ? bare.replace(/^transition-duration-/, 'duration-')
        : ''
    case 'font':
      return bare.startsWith('font-') ? bare.replace('font-weight-', 'font-') : ''
    case 'breakpoint':
      return `${bare.replace('breakpoint-', '')}:`
    case 'container':
      return /^--(container|layout-measure)/.test(name) ? `max-w-(${name})` : ''
    default:
      return ''
  }
}

export async function copyValue(value: string): Promise<void> {
  if (await copyText(value)) toast.success(messages.value.copiedValue, { description: value })
  else toast.error(messages.value.copyFailed, { description: value })
}

export const BREAKPOINT_ORDER = ['_', 'sm', 'md', 'lg', 'xl', '2xl']

const SIZE_STEPS = ['3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs', '2xs']

const TYPE_FAMILIES = [
  'heading',
  'title',
  'body',
  'label',
  'button',
  'link',
  'tag',
  'overline',
  'amount',
  'big-number'
]

function stepIndex(name: string): number {
  const step = SIZE_STEPS.indexOf(name.split('-').at(-1) ?? '')
  return step === -1 ? SIZE_STEPS.length : step
}

function typeFamily(name: string): string {
  return TYPE_FAMILIES.find((family) => name.startsWith(`text-${family}`)) ?? 'other'
}

export function typeGroups(styles: Token[]): { id: string; vars: Token[] }[] {
  return [...TYPE_FAMILIES, 'other']
    .map((id) => ({
      id,
      vars: styles
        .filter((style) => typeFamily(style.name) === id)
        .sort(
          (a, b) =>
            stepIndex(a.name) - stepIndex(b.name) ||
            a.name.split('-').length - b.name.split('-').length ||
            a.name.localeCompare(b.name)
        )
    }))
    .filter((group) => group.vars.length)
}

export function cubicBezier(value: string): [number, number, number, number] | null {
  const match = /cubic-bezier\(([^)]+)\)/.exec(value)
  const points = match?.[1].split(',').map((part) => Number.parseFloat(part))
  return points?.length === 4 && points.every(Number.isFinite)
    ? (points as [number, number, number, number])
    : null
}

export function milliseconds(value: string): number {
  const match = /^([\d.]+)(ms|s)$/.exec(value.trim())
  if (!match) return 0
  return Number.parseFloat(match[1]) * (match[2] === 's' ? 1000 : 1)
}
