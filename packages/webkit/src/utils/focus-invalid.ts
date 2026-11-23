import { nextTick } from 'vue'

const INVALID_FIELD = '[aria-invalid="true"]:not(:disabled)'

const isShown = (field: HTMLElement) =>
  typeof field.checkVisibility === 'function' ? field.checkVisibility() : true

export async function focusFirstInvalid(root: HTMLElement | null | undefined): Promise<boolean> {
  await nextTick()
  const fields = Array.from(root?.querySelectorAll<HTMLElement>(INVALID_FIELD) ?? [])
  for (const field of fields) {
    if (!isShown(field)) continue
    field.focus({ preventScroll: true })
    if (document.activeElement !== field) continue
    field.scrollIntoView({ block: 'center' })
    return true
  }
  return false
}
