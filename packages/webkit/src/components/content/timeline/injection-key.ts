import type { ComputedRef, InjectionKey } from 'vue'

/** Density of every item: small for a side panel or drawer, medium for a page body. */
export type TimelineSize = 'small' | 'medium'

/** How every item's time reads, passed to Timestamp as its format. */
export type TimelineTimeFormat = 'relative' | 'local' | 'utc'

export interface TimelineContext {
  /** The root's density; every item mirrors it. */
  size: ComputedRef<TimelineSize>
  /** The format every item's Timestamp renders in. */
  timeFormat: ComputedRef<TimelineTimeFormat>
}

export const TimelineInjectionKey: InjectionKey<TimelineContext> = Symbol('Timeline')

export interface TimelineGroupContext {
  /** True inside a Timeline.Group, whose label already carries the date. */
  grouped: boolean
}

export const TimelineGroupInjectionKey: InjectionKey<TimelineGroupContext> = Symbol('TimelineGroup')
