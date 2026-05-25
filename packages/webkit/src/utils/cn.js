import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

/** Matches generated typography utilities from `@aziontech/theme` (`texts.data.js`). */
const SEMANTIC_TEXT_SIZE_RE = /^(?:big-number|heading|body|label|overline|button)-/

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // Default twMerge treats `text-body-*` as text-color, so pairing
      // `text-body-sm` + `text-[var(--text-muted)]` drops the typography class.
      'font-size': [{ text: [(part) => SEMANTIC_TEXT_SIZE_RE.test(part)] }]
    }
  }
})

/**
 * Merge Tailwind class values while resolving conflicts.
 *
 * Combines `clsx` (truthy filter, nested arrays/objects) with `tailwind-merge`
 * (token-aware deduplication). Consumer overrides win predictably:
 *
 *   cn('px-4 text-body-sm', 'px-6')                            -> 'text-body-sm px-6'
 *   cn('text-body-sm', 'text-[var(--text-muted)]')             -> both kept
 *   cn('text-[var(--text-default)]', cond && 'text-[var(--text-muted)]')
 *
 * Use inside `rootClasses` computeds when consumer-provided `attrs.class`
 * may override internal token choices. For simple additive cases, plain
 * arrays still work.
 *
 * @param {...import('clsx').ClassValue} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
