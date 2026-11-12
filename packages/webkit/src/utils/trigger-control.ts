export const TRIGGER_CONTROL_SELECTOR =
  'button, a[href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])'

export function triggerControl(host: globalThis.HTMLElement): globalThis.HTMLElement {
  return host.querySelector<globalThis.HTMLElement>(TRIGGER_CONTROL_SELECTOR) ?? host
}
