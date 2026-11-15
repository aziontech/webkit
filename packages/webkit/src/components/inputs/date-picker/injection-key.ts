import type { ComputedRef, InjectionKey } from 'vue'

/** Selection mode of the shared grid: DatePicker picks one day, DateRangePicker a range. */
export type DatePickerMode = 'single' | 'range'

/** Size token; affects the trigger, day-cell hit-area, and typography. */
export type DatePickerSize = 'small' | 'medium' | 'large'

/** Where the fields and Apply column sit relative to the calendar grid. */
export type DatePickerOrientation = 'vertical' | 'horizontal'

/** A start and end the shared grid builds for DateRangePicker. */
export interface DatePickerRange {
  start: Date | null
  end: Date | null
}

/** Visible month payload emitted on navigation. month is 0-indexed. */
export interface DatePickerMonth {
  year: number
  month: number
}

/** v-model value of DatePicker: the picked date, or null. */
export type DatePickerValue = Date | null

/** What the shared grid and fields edit: one date, or a range for DateRangePicker. */
export type DatePickerDraft = Date | null | DatePickerRange

/**
 * Shared state the root picker provides. Sub-components inject it and drive the
 * popover's DRAFT selection (staged until Apply) so the consumer wires nothing.
 */
export interface DatePickerContext {
  /** Root data-testid; sub-components derive BEM-suffixed ids from it. */
  testId: string
  /** Selection mode. */
  mode: ComputedRef<DatePickerMode>
  /** Active size token. */
  size: ComputedRef<DatePickerSize>
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
  draft: ComputedRef<DatePickerDraft>
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
  selectValue: (event: Event, value: Date | DatePickerRange, periodLabel?: string) => void
  /** Set a range endpoint (or the single value) from the date/time fields. */
  setEndpoint: (which: 'start' | 'end', date: Date | null) => void
  /** Clear the draft selection. */
  clear: () => void
  /** Update the selected timezone. */
  setTimezone: (timezone: string) => void
  /** Notify the root that the first visible month changed. */
  changeMonth: (month: DatePickerMonth) => void
}

export const DatePickerInjectionKey: InjectionKey<DatePickerContext> = Symbol('DatePickerContext')
