import { type ClassValue, clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const SEMANTIC_TEXT_SIZE_RE = /^(?:big-number|heading|body|label|overline|button)-/

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: [(part: string) => SEMANTIC_TEXT_SIZE_RE.test(part)] }]
    }
  }
})

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
