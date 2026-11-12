import type { InjectionKey, Ref } from 'vue'

/** What a page rendered inside `ConsoleLayout` can reach of its chrome. */
export interface ConsoleLayoutContext {
  /** Opens the layout's search palette. */
  openSearch: () => void
  /** Closes the layout's search palette. */
  closeSearch: () => void
  /** Whether the search palette is open. */
  searchOpen: Readonly<Ref<boolean>>
}

export const ConsoleLayoutInjectionKey: InjectionKey<ConsoleLayoutContext> = Symbol('ConsoleLayout')
