function copyWithSelection(text: string): boolean {
  const doc = globalThis.document
  const active = doc?.activeElement as globalThis.HTMLElement | null
  const field = doc?.createElement('textarea')
  if (!field) return false
  field.value = text
  field.readOnly = true
  field.style.cssText = 'position:fixed;top:0;opacity:0'
  ;(active?.closest('dialog,[role=dialog],[popover]') ?? doc.body).append(field)
  field.select()
  let copied = false
  try {
    copied = doc.execCommand('copy')
  } catch {}
  field.remove()
  active?.focus({ preventScroll: true })
  return copied
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await globalThis.navigator.clipboard.writeText(text)
    return true
  } catch {
    return copyWithSelection(text)
  }
}
