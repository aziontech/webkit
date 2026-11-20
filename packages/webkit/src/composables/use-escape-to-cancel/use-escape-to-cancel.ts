import { getCurrentScope, type MaybeRefOrGetter, onScopeDispose, toValue } from 'vue'

/** Options of `useEscapeToCancel`. */
export interface UseEscapeToCancelOptions {
  /** Turns the shortcut off (for example while the create request is in flight). */
  enabled?: MaybeRefOrGetter<boolean>
}

const OVERLAY_SELECTOR = [
  '[role="dialog"]',
  '[role="alertdialog"]',
  '[role="menu"]',
  '[role="tooltip"]',
  'dialog[open]',
  '[data-state="open"][role="listbox"]',
  '[data-state="open"] [role="listbox"]'
].join(', ')

const OWN_ESCAPE_SELECTOR = [
  '[role="dialog"]',
  '[role="alertdialog"]',
  '[role="menu"]',
  '[role="listbox"]',
  '[role="tooltip"]',
  'dialog',
  'input[type="search"]'
].join(', ')

const isShown = (element: globalThis.Element) =>
  element.getClientRects().length > 0 && !element.closest('[hidden], [inert]')

const usesEscape = (target: globalThis.EventTarget | null) => {
  if (!(target instanceof globalThis.Element)) return false
  if (target.closest(OWN_ESCAPE_SELECTOR)) return true
  const popup = target.closest('[aria-expanded="true"]')
  if (!popup) return false
  return popup.getAttribute('role') === 'combobox' || popup.hasAttribute('aria-haspopup')
}

const overlayOpen = () =>
  Array.from(document.querySelectorAll(OVERLAY_SELECTOR)).some(isShown) ||
  Array.from(document.querySelectorAll(':popover-open')).length > 0

export function useEscapeToCancel(
  onEscape: (event: globalThis.KeyboardEvent) => void,
  options: UseEscapeToCancelOptions = {}
): void {
  if (typeof document === 'undefined') return

  let claimed = false

  const onKeydownCapture = (event: globalThis.KeyboardEvent) => {
    if (event.key !== 'Escape') return
    claimed =
      event.isComposing ||
      event.keyCode === 229 ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      usesEscape(event.target) ||
      usesEscape(document.activeElement) ||
      overlayOpen()
  }

  const onKeydown = (event: globalThis.KeyboardEvent) => {
    if (event.key !== 'Escape') return
    const skip = claimed || event.defaultPrevented
    claimed = false
    if (skip || !(toValue(options.enabled) ?? true)) return
    event.preventDefault()
    onEscape(event)
  }

  document.addEventListener('keydown', onKeydownCapture, true)
  document.addEventListener('keydown', onKeydown)
  if (getCurrentScope()) {
    onScopeDispose(() => {
      document.removeEventListener('keydown', onKeydownCapture, true)
      document.removeEventListener('keydown', onKeydown)
    })
  }
}
