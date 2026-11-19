import { toast } from '@aziontech/webkit/toast'
import { copyText } from '@aziontech/webkit/utils/clipboard'

import { messages } from './i18n'
import type { Token, TokenUsage } from './types'

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

export const SIZE_STEPS = ['3xl', '2xl', 'xl', 'lg', 'md', 'sm', 'xs', '2xs']

export const TYPE_FAMILIES = [
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

export function typeFamily(name: string): string {
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

const usageKey = (usage: TokenUsage) => `${usage.job}\u0000${usage.usedBy}`

export function sharedUsage(tokens: Token[]): { usage?: TokenUsage; tokens: Token[] } {
  const keys = [...new Set(tokens.flatMap((token) => (token.usage ? [usageKey(token.usage)] : [])))]
  const first = tokens.find((token) => token.usage)?.usage
  if (keys.length === 1 && first)
    return { usage: first, tokens: tokens.map(({ usage: _usage, ...token }) => token) }
  const rank = (token: Token) => (token.usage ? keys.indexOf(usageKey(token.usage)) : keys.length)
  return { tokens: [...tokens].sort((a, b) => rank(a) - rank(b)) }
}

export type TokenGroup = { usage?: TokenUsage; tokens: Token[] }

export function usageGroups(tokens: Token[]): TokenGroup[] {
  const runs = new Map<string, TokenGroup>()
  for (const token of tokens) {
    if (!token.usage) continue
    const key = usageKey(token.usage)
    const run = runs.get(key) ?? { usage: token.usage, tokens: [] }
    run.tokens.push(token)
    runs.set(key, run)
  }
  const shared = [...runs.values()].filter((run) => run.tokens.length > 1)
  const grouped = new Set(shared.flatMap((run) => run.tokens))
  const alone = tokens.filter((token) => !grouped.has(token))
  return [
    ...(alone.length ? [{ tokens: alone }] : []),
    ...shared.map((run) => ({
      usage: run.usage,
      tokens: run.tokens.map(({ usage: _usage, ...token }) => token)
    }))
  ]
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
