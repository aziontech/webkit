import { nextTick } from 'vue'

export const INVALID_FIELD_ATTR = 'data-field-invalid'

const FOCUSABLE = [
  'input:not([type="hidden"])',
  'select',
  'textarea',
  'button',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])'
].join(',')

const rendered = (el) => el.getClientRects().length > 0

const focusable = (el) =>
  !!el && !el.disabled && el.getAttribute('aria-hidden') !== 'true' && rendered(el)

const focusControl = (anchor) => {
  const doc = anchor.ownerDocument
  const owner = anchor.querySelector('label[for]')?.getAttribute('for')
  const labelled = owner ? doc.getElementById(owner) : null
  if (focusable(labelled)) {
    labelled.focus({ preventScroll: true })
    return labelled
  }

  const control = Array.from(anchor.querySelectorAll(FOCUSABLE)).find(
    (el) => focusable(el) && !el.closest('label')
  )
  control?.focus({ preventScroll: true })
  return control ?? null
}

const prefersReducedMotion = () =>
  globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

export async function revealFirstInvalid(root) {
  await nextTick()

  const scope = root?.$el ?? root ?? globalThis.document
  if (!scope?.querySelectorAll) return false

  const anchors = Array.from(scope.querySelectorAll(`[${INVALID_FIELD_ATTR}]`))
  const anchor = anchors.find(rendered) ?? anchors[0]
  if (!anchor) return false

  focusControl(anchor)

  const tall = anchor.getBoundingClientRect().height > (globalThis.innerHeight ?? 0) * 0.6
  anchor.scrollIntoView({
    block: tall ? 'start' : 'center',
    behavior: prefersReducedMotion() ? 'auto' : 'smooth'
  })

  return true
}
