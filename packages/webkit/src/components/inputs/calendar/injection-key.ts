import type { ComputedRef, InjectionKey } from 'vue'

/** Selection mode for the calendar grid. */
export type CalendarMode = 'single' | 'range'

/** Size token; affects the trigger, day-cell hit-area, and typography. */
export type CalendarSize = 'small' | 'medium' | 'large'

/** Range value emitted and accepted in range mode. */
export interface CalendarRange {
  start: Date | null
  end: Date | null
}

/** Visible month payload emitted on navigation. month is 0-indexed. */
export interface CalendarMonth {
  year: number
  month: number
}

/** v-model value: a Date (or null) in single mode, a range object in range mode. */
export type CalendarValue = Date | null | CalendarRange

/** A data-driven preset shortcut rendered in the presets rail. */
export interface CalendarPresetItem {
  label: string
  value: Date | CalendarRange
}

/**
 * Shared state the root picker provides. Sub-components inject it and drive the
 * popover's DRAFT selection (staged until Apply) so the consumer wires nothing.
 */
export interface CalendarContext {
  /** Root data-testid; sub-components derive BEM-suffixed ids from it. */
  testId: string
  /** Selection mode. */
  mode: ComputedRef<CalendarMode>
  /** Active size token. */
  size: ComputedRef<CalendarSize>
  /** Whether the whole picker is disabled. */
  disabled: ComputedRef<boolean>
  /** Earliest selectable date (or undefined). */
  min: ComputedRef<Date | undefined>
  /** Latest selectable date (or undefined). */
  max: ComputedRef<Date | undefined>
  /** Whether Start/End time fields are shown. */
  showTime: ComputedRef<boolean>
  /** Whether the popover uses the horizontal (side-by-side) layout. */
  horizontal: ComputedRef<boolean>
  /** Staged (pre-Apply) selection the popover edits. */
  draft: ComputedRef<CalendarValue>
  /** Whether the draft has any selection (drives the clear control). */
  hasSelection: ComputedRef<boolean>
  /** Selected IANA timezone (display only). */
  timezone: ComputedRef<string>
  /** Timezone options for the selector. */
  timezones: ComputedRef<string[]>
  /** Grid day click — range-building / single select on the draft. */
  selectDay: (date: Date) => void
  /** Apply a full value (preset / period) to the draft; `periodLabel` records the
   * relative token (e.g. `45m`) so the trigger can show it above the resolved window. */
  selectValue: (value: Date | CalendarRange, periodLabel?: string) => void
  /** Set a range endpoint (or the single value) from the date/time fields. */
  setEndpoint: (which: 'start' | 'end', date: Date | null) => void
  /** Clear the draft selection. */
  clear: () => void
  /** Update the selected timezone. */
  setTimezone: (timezone: string) => void
  /** Notify the root that the first visible month changed. */
  changeMonth: (month: CalendarMonth) => void
}

export const CalendarInjectionKey: InjectionKey<CalendarContext> = Symbol('CalendarContext')
