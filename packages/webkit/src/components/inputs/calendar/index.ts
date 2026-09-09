/**
 * Compound API per `.claude/rules/compound-api.md`. A `.ts` file so vue-tsc emits the
 * adjacent `index.d.ts`; the explicit `CompoundCalendar` annotation makes declaration
 * emit reference the sub-component types instead of expanding the root's private `Props`.
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
