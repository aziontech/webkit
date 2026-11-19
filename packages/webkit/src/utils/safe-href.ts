const SAFE = /^(https?|mailto|tel):/i

const plainOf = (value: string): string => value.replace(/[\s\p{Cf}]/gu, '')

export function safeHref(href?: string | null): string | null {
  const value = href?.trim() ?? ''
  const plain = plainOf(value)
  if (!value || /\p{Cc}|^[/\\]{2}/u.test(plain + value)) return null
  return /[:&]/.test(plain.split(/[/?#\\]/)[0]) && !SAFE.test(plain) ? null : value
}

export function safeWebUrl(url?: string | null): string | null {
  const value = safeHref(url)
  return value && /^https?:/i.test(plainOf(value)) ? value : null
}

export function safeDownloadHref(href?: string | null): string | null {
  const value = href?.trim() ?? ''
  return /^(blob|data):/i.test(value) && !/\p{Cc}/u.test(value) ? value : safeHref(value)
}
