import {
  type Component,
  computed,
  type ComputedRef,
  type FunctionalComponent,
  inject,
  type MaybeRefOrGetter,
  toValue
} from 'vue'

import { SidebarInjectionKey } from '../../../layout/sidebar/injection-key'

/** The wrapper a sidebar row renders around its control. */
export interface SidebarMenuTip {
  is: Component
  props: Record<string, string>
}

export interface UseSidebarMenuTipReturn {
  /** Whether the sidebar is collapsed to its icon rail. */
  rail: ComputedRef<boolean>
  /** The sidebar's tooltip naming the row on the rail, a pass-through everywhere else. */
  tip: ComputedRef<SidebarMenuTip>
}

const Passthrough: FunctionalComponent = (_, { slots: inner }) => inner['default']?.()

export function useSidebarMenuTip(label: MaybeRefOrGetter<string>): UseSidebarMenuTipReturn {
  const sidebar = inject(SidebarInjectionKey, null)
  const rail = computed(() => sidebar?.rail === true)

  const tip = computed((): SidebarMenuTip =>
    rail.value && sidebar?.tooltip
      ? {
          is: sidebar.tooltip,
          props: { content: toValue(label), side: 'end' }
        }
      : { is: Passthrough, props: {} }
  )

  return { rail, tip }
}
