/**
 * @param {import('./use-navigation-menu-root.js').ChangeReason} reason
 * @param {Event} event
 * @param {Element | undefined} trigger
 */
export function createChangeEventDetails(reason, event, trigger) {
  let canceled = false
  let propagationAllowed = false

  return {
    reason,
    event,
    trigger,
    cancel() {
      canceled = true
    },
    allowPropagation() {
      propagationAllowed = true
    },
    get isCanceled() {
      return canceled
    },
    get isPropagationAllowed() {
      return propagationAllowed
    }
  }
}
