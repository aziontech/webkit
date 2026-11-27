import { computed, type ComputedRef, nextTick, type Ref, ref } from 'vue'

import { eventDirection, logicalArrowKey } from '../../../../composables/use-direction'
import { startOfDay } from '../format'
import type { DatePickerContext } from '../injection-key'
import type { DatePickerDay } from '../lib/calendar-weeks'

const MS_PER_DAY = 86_400_000

const DAY_STEPS = new Map<string, (day: DatePickerDay) => number>([
  ['ArrowLeft', () => -1],
  ['ArrowRight', () => 1],
  ['ArrowUp', () => -7],
  ['ArrowDown', () => 7],
  ['Home', (day) => -day.date.getDay()],
  ['End', (day) => 6 - day.date.getDay()]
])

const PAGE_STEPS = new Map<string, number>([
  ['PageUp', -1],
  ['PageDown', 1]
])

export interface UseDatePickerGridFocusReturn {
  activeTime: ComputedRef<number | null>
  selectDay: (day: DatePickerDay) => void
  onDayKeydown: (event: globalThis.KeyboardEvent, day: DatePickerDay) => void
}

const pickActive = (days: DatePickerDay[], focused: number | null): number | null => {
  if (focused !== null && days.some((day) => day.time === focused && !day.disabled)) {
    return focused
  }
  const target =
    days.find((day) => day.selected && !day.disabled) ??
    days.find((day) => day.today && !day.disabled) ??
    days.find((day) => !day.disabled)
  return target ? target.time : null
}

export function useDatePickerGridFocus(
  ctx: DatePickerContext | null,
  inMonthDays: ComputedRef<DatePickerDay[]>,
  gridEl: Ref<globalThis.HTMLElement | null>,
  showMonthOf: (date: Date) => void,
  turnPage: (step: number, byYear: boolean) => void
): UseDatePickerGridFocusReturn {
  const focusedTime = ref<number | null>(null)

  const activeTime = computed<number | null>(() => pickActive(inMonthDays.value, focusedTime.value))

  const focusActiveCell = () => {
    nextTick(() => {
      const buttons =
        gridEl.value?.querySelectorAll<globalThis.HTMLButtonElement>('button[tabindex="0"]')
      const target =
        [...(buttons ?? [])].find((button) => !button.closest('.absolute')) ?? buttons?.[0]
      target?.focus()
    })
  }

  const selectDay = (day: DatePickerDay) => {
    if (day.disabled) {
      return
    }
    focusedTime.value = day.time
    showMonthOf(day.date)
    ctx?.selectDay(day.date)
  }

  const moveFocus = (fromTime: number, deltaDays: number) => {
    const normalized = startOfDay(new Date(fromTime + deltaDays * MS_PER_DAY))
    focusedTime.value = normalized.getTime()
    showMonthOf(normalized)
    focusActiveCell()
  }

  const onDayKeydown = (event: globalThis.KeyboardEvent, day: DatePickerDay) => {
    const key = logicalArrowKey(event.key, eventDirection(event))
    const step = DAY_STEPS.get(key)
    const page = PAGE_STEPS.get(key)
    if (step) {
      event.preventDefault()
      moveFocus(day.time, step(day))
    } else if (page !== undefined) {
      event.preventDefault()
      turnPage(page, event.shiftKey)
      focusActiveCell()
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault()
      selectDay(day)
    }
  }

  return { activeTime, selectDay, onDayKeydown }
}
