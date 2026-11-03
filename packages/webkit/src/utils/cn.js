import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const SEMANTIC_TEXT_SIZE_RE = /^(?:big-number|heading|body|label|overline|button)-/

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [(part) => SEMANTIC_TEXT_SIZE_RE.test(part)] }]
    }
  }
})

/**
 * @param {...import('clsx').ClassValue} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
