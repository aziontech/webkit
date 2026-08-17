// An activation the SPA handles has to be TAKEN from the browser.
//
// Every navigational component in webkit that can point somewhere — Breadcrumb, Menu,
// NavigationMenu — renders a REAL `<a href>` and emits its `navigate` / `click` event
// with the DOM event first (.claude/rules/event-payloads.md), precisely so the consumer
// can decide who handles it. That decision is not optional: leaving it unmade means the
// router pushes the route AND the browser follows the same href as a document load.
//
// Usually that costs only a full reload nobody asked for. On a page holding uncommitted
// work it costs the reader two dialogs for one click: ours, from the route guard
// (ui/UnsavedChangesGuard.vue), and the browser's own "Leave site?" from the
// `beforeunload` the document load fires — stacked, worded differently, and answering
// them in the wrong order silently drops the edit. That is the bug this exists to make
// impossible to reintroduce: the crumb on a dirty create page.
//
// A MODIFIED click is deliberately left alone. Cmd/Ctrl/Shift/Alt-click and middle-click
// are the reader asking the BROWSER for a new tab or window, which is exactly what the
// real `href` under the crumb is for — routing those would take away the one behaviour
// rendering an anchor buys.

/**
 * Claims an activation for the router, cancelling the browser's own navigation.
 *
 * @param {MouseEvent | KeyboardEvent} [event] the DOM event the component emitted first
 * @returns {boolean} true when the SPA should handle it — the caller routes only then.
 *   False means the reader asked for a new tab/window and the anchor was left to it.
 */
export function routeActivation(event) {
  if (!event) return true
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false
  // `button` is absent on a keyboard activation, which is a plain one.
  if (typeof event.button === 'number' && event.button !== 0) return false
  event.preventDefault()
  return true
}
