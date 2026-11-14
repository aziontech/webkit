import { toast } from '@aziontech/webkit/toast'

import { messages } from './i18n'

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

function colorUtility(name: string): string {
  if (/^--(text|code-sintax)-/.test(name) || /-contrast$/.test(name)) return 'text'
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
      return bare.startsWith('duration-') ? bare : ''
    case 'font':
      return bare.startsWith('font-') ? bare : ''
    case 'breakpoint':
      return `${bare.replace('breakpoint-', '')}:`
    case 'container':
      return /^--(container|layout-measure)/.test(name) ? `max-w-(${name})` : ''
    default:
      return ''
  }
}

export async function copyValue(value: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(value)
    toast.success(messages.value.copiedValue, { description: value })
  } catch {
    toast.error(messages.value.copyFailed, { description: value })
  }
}

export const BREAKPOINT_ORDER = ['_', 'sm', 'md', 'lg', 'xl', '2xl']
