import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind class values while resolving conflicts.
 *
 * Combines `clsx` (truthy filter, nested arrays/objects) with `tailwind-merge`
 * (token-aware deduplication). Consumer overrides win predictably:
 *
 * ```ts
 * cn('px-4 text-body-sm', 'px-6') // -> 'text-body-sm px-6'
 * cn('text-[var(--text-default)]', condition && 'text-[var(--text-muted)]')
 * ```
 *
 * Use inside `rootClasses` computeds when consumer-provided `attrs.class`
 * may override internal token choices. For simple additive cases, plain
 * arrays still work.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export type { ClassValue }
