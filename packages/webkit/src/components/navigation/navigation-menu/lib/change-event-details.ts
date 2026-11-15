export type ChangeReason =
  | 'trigger-press'
  | 'trigger-hover'
  | 'outside-press'
  | 'list-navigation'
  | 'focus-out'
  | 'escape-key'
  | 'link-press'
  | 'none'

export interface NavigationMenuChangeEventDetails {
  readonly reason: ChangeReason
  readonly event: Event
  readonly trigger: Element | undefined
  cancel: () => void
  allowPropagation: () => void
  readonly isCanceled: boolean
  readonly isPropagationAllowed: boolean
}

export function createChangeEventDetails(
  reason: ChangeReason,
  event: Event,
  trigger: Element | undefined
): NavigationMenuChangeEventDetails {
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
