export function safeHref(href?: string | null, file?: boolean): string | null {
  const value = href?.trim() ?? ''
  const plain = value.replace(/[\s\p{Cf}]/gu, '')
  const scheme = /[:&]/.test(plain.split(/[/?#\\]/)[0])
  const allowed = file ? /^(https?|mailto|tel|blob|data):/i : /^(https?|mailto|tel):/i
  return !value || /\p{Cc}|^[/\\]{2}/u.test(plain + value) || (scheme && !allowed.test(plain))
    ? null
    : value
}

export function safeWebUrl(url?: string | null): string | null {
  const value = safeHref(url)
  return value && /^https?:/i.test(value.replace(/[\s\p{Cf}]/gu, '')) ? value : null
}
