import type { NavigationMenuTriggerEntry } from '../composables/use-navigation-menu-keyboard'

type NavigationMenuDirection = 'left' | 'right' | 'up' | 'down' | null

export function resolveActivationDirection(
  triggers: NavigationMenuTriggerEntry[],
  previous: string | number | null,
  nextValue: string | number | null,
  orientation: 'horizontal' | 'vertical',
  rtl: boolean
): NavigationMenuDirection | undefined {
  if (previous == null || nextValue == null) return null
  const previousIndex = triggers.findIndex((entry) => entry.value === previous)
  const nextIndex = triggers.findIndex((entry) => entry.value === nextValue)
  if (previousIndex === -1 || nextIndex === -1) return undefined
  if (orientation === 'horizontal') return nextIndex > previousIndex !== rtl ? 'right' : 'left'
  return nextIndex > previousIndex ? 'down' : 'up'
}
