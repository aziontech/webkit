import type { InjectionKey, Ref } from 'vue'

import type { ConsoleLayoutCrumb } from './console-layout.vue'

/** What a page rendered inside `ConsoleLayout` can reach of its chrome. */
export interface ConsoleLayoutContext {
  /** Opens the layout's search palette. */
  openSearch: () => void
  /** Closes the layout's search palette. */
  closeSearch: () => void
  /** Whether the search palette is open. */
  searchOpen: Readonly<Ref<boolean>>
}

/** One page's trail, registered by `ConsoleLayout.Breadcrumbs`. */
export interface ConsoleLayoutTrail {
  /** The page's crumbs. */
  items: () => ConsoleLayoutCrumb[]
  /** Whether the page passed a control crumb. */
  hasControl: () => boolean
  /** Renders the page's control crumb. */
  control: () => unknown
}

/** The layout's registry of page trails; the most recent one is shown. */
export interface ConsoleLayoutTrails {
  /** Shows a page trail until it is removed. */
  add: (trail: ConsoleLayoutTrail) => void
  /** Removes a page trail. */
  remove: (trail: ConsoleLayoutTrail) => void
}

export const ConsoleLayoutInjectionKey: InjectionKey<ConsoleLayoutContext> = Symbol('ConsoleLayout')

export const ConsoleLayoutTrailsKey: InjectionKey<ConsoleLayoutTrails> =
  Symbol('ConsoleLayoutBreadcrumbs')
