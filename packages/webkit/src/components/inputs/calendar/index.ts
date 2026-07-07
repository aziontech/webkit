/**
 * Compound API — each sub-component stays available as its own import
 * (`@aziontech/webkit/calendar-preset`, `@aziontech/webkit/calendar-clear`) and is
 * also attached to the root for dot-notation usage: `<Calendar.Preset>`, `<Calendar.Clear>`.
 *
 * This is a `.ts` file so vue-tsc generates the adjacent `index.d.ts`, giving
 * `<Calendar.Preset>` full type-checking. `Object.assign` keeps one source of truth;
 * the explicit `CompoundCalendar` annotation lets declaration emit reference the
 * sub-component types instead of expanding the root's private `Props`.
 * See `.claude/rules/compound-api.md`.
 */
import Calendar from './calendar.vue'
import CalendarClear from './calendar-clear/calendar-clear.vue'
import CalendarPreset from './calendar-preset/calendar-preset.vue'

type CompoundCalendar = typeof Calendar & {
  Preset: typeof CalendarPreset
  Clear: typeof CalendarClear
}

const CalendarRoot = Object.assign(Calendar, {
  Preset: CalendarPreset,
  Clear: CalendarClear
}) as CompoundCalendar

export type {
  CalendarMode,
  CalendarMonth,
  CalendarRange,
  CalendarSize,
  CalendarValue
} from './injection-key'

export default CalendarRoot
