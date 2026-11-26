import { inject } from 'vue'

import { type ConsoleLayoutContext, ConsoleLayoutInjectionKey } from '../injection-key'

export type { ConsoleLayoutContext }

/** Options of `useConsoleLayout`. */
export interface UseConsoleLayoutOptions<Optional extends boolean = boolean> {
  /** Returns null outside a ConsoleLayout instead of throwing, for a page body that also renders standalone. */
  optional?: Optional
}

/** The context, or null when `optional` is true and no ConsoleLayout is above the caller. */
export type UseConsoleLayoutReturn<Optional extends boolean = false> = Optional extends true
  ? ConsoleLayoutContext | null
  : ConsoleLayoutContext

export function useConsoleLayout<Optional extends boolean = false>(
  options: UseConsoleLayoutOptions<Optional> = {}
): UseConsoleLayoutReturn<Optional> {
  const ctx = inject(ConsoleLayoutInjectionKey, null)
  if (ctx || options.optional) return ctx as UseConsoleLayoutReturn<Optional>
  throw new Error(
    'useConsoleLayout must be used within <ConsoleLayout>; pass { optional: true } for a page body that also renders on its own.'
  )
}
