const sanitize = (raw: string): string => raw.replace(/[^\d:]/g, '')

const padDigits = (sanitized: string): string =>
  sanitized
    .split(':')
    .map((part, index, parts) =>
      part.length === 1 && index < parts.length - 1 ? `0${part}` : part
    )
    .join('')

const groupDigits = (digits: string): string => digits.replace(/(\d{2})(?=\d)/g, '$1:')

export const maxTimeDigits = (segments: number): number => segments * 2

export const maskTime = (raw: string, segments: number): string =>
  groupDigits(padDigits(sanitize(raw)).slice(0, maxTimeDigits(segments)))

export const digitsBeforeCaret = (raw: string, caret: number, segments: number): number => {
  const followedByColon = sanitize(raw.slice(caret)).startsWith(':')
  const prefix = sanitize(raw.slice(0, caret)) + (followedByColon ? ':' : '')
  return Math.min(padDigits(prefix).length, maxTimeDigits(segments))
}

export const caretAfterDigits = (masked: string, digits: number): number => {
  if (digits <= 0) return 0
  let seen = 0
  for (let index = 0; index < masked.length; index += 1) {
    if (/\d/.test(masked.charAt(index))) seen += 1
    if (seen === digits) return index + 1
  }
  return masked.length
}

export const isTimeComplete = (masked: string, segments: number): boolean =>
  masked.length === segments * 3 - 1

export const isTimeInRange = (masked: string): boolean =>
  masked.split(':').every((part, index) => Number(part) <= (index === 0 ? 23 : 59))
