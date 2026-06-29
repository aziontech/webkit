<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  defineOptions({
    name: 'Calendar',
    inheritAttrs: false
  })

  /** Selection mode for the calendar grid. */
  export type CalendarMode = 'single' | 'range'

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

  interface Props {
    /** Selected value for v-model. A Date (or null) in single mode; a range object in range mode. */
    modelValue?: CalendarValue
    /** Selection mode. Single picks one date; range picks a start and end date. */
    mode?: CalendarMode
    /** Earliest selectable date; earlier days render disabled. */
    min?: Date
    /** Latest selectable date; later days render disabled. */
    max?: Date
    /** Disables the whole grid and navigation, applying disabled tokens. */
    disabled?: boolean
    /** Shows the month/year label and previous/next month navigation. */
    showHeader?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    mode: 'single',
    min: undefined,
    max: undefined,
    disabled: false,
    showHeader: true
  })

  const emit = defineEmits<{
    'update:modelValue': [value: CalendarValue]
    'month-change': [value: CalendarMonth]
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-calendar')

  const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const
  const MS_PER_DAY = 86_400_000

  const startOfDay = (date: Date): Date =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const sameDay = (a: Date | null | undefined, b: Date | null | undefined): boolean => {
    if (!a || !b) {
      return false
    }

    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    )
  }

  const asRange = (value: CalendarValue): CalendarRange => {
    if (value && !(value instanceof Date)) {
      return value
    }

    return { start: null, end: null }
  }

  const asSingle = (value: CalendarValue): Date | null => (value instanceof Date ? value : null)

  /** Anchor date that drives the visible month; seeded from the model value or today. */
  const seedDate = (): Date => {
    if (props.mode === 'range') {
      const range = asRange(props.modelValue)

      if (range.start) {
        return range.start
      }
    } else {
      const single = asSingle(props.modelValue)

      if (single) {
        return single
      }
    }

    return new Date()
  }

  const viewDate = ref<Date>(startOfDay(seedDate()))

  watch(
    () => props.modelValue,
    () => {
      viewDate.value = startOfDay(seedDate())
    }
  )

  const viewYear = computed(() => viewDate.value.getFullYear())
  const viewMonth = computed(() => viewDate.value.getMonth())

  const monthLabel = computed(() =>
    viewDate.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  )

  const focusedTime = ref<number | null>(null)

  const today = startOfDay(new Date())

  const isBeforeMin = (date: Date): boolean => Boolean(props.min && date < startOfDay(props.min))
  const isAfterMax = (date: Date): boolean => Boolean(props.max && date > startOfDay(props.max))
  const isOutOfBounds = (date: Date): boolean => isBeforeMin(date) || isAfterMax(date)

  /** Range-band classification used to render the connected range highlight. */
  type CalendarDayBand = 'none' | 'single' | 'start' | 'middle' | 'end'

  interface CalendarDay {
    date: Date
    time: number
    label: number
    outside: boolean
    disabled: boolean
    today: boolean
    selected: boolean
    band: CalendarDayBand
  }

  /** Classifies a day for the range band: the lone selection (`single`), a range
      endpoint (`start`/`end`), an in-between day (`middle`), or `none`. */
  const dayBand = (date: Date): CalendarDayBand => {
    if (props.mode !== 'range') {
      return sameDay(date, asSingle(props.modelValue)) ? 'single' : 'none'
    }

    const range = asRange(props.modelValue)
    const time = startOfDay(date).getTime()
    const start = range.start ? startOfDay(range.start).getTime() : null
    const end = range.end ? startOfDay(range.end).getTime() : null

    if (start !== null && end !== null) {
      const lo = Math.min(start, end)
      const hi = Math.max(start, end)

      if (lo === hi) {
        return time === lo ? 'single' : 'none'
      }
      if (time === lo) {
        return 'start'
      }
      if (time === hi) {
        return 'end'
      }

      return time > lo && time < hi ? 'middle' : 'none'
    }

    if ((start !== null && time === start) || (end !== null && time === end)) {
      return 'single'
    }

    return 'none'
  }

  /** 6 rows of 7 days, leading/trailing adjacent-month cells, week starting Sunday. */
  const weeks = computed<CalendarDay[][]>(() => {
    const firstOfMonth = new Date(viewYear.value, viewMonth.value, 1)
    const gridStart = new Date(viewYear.value, viewMonth.value, 1 - firstOfMonth.getDay())
    const rows: CalendarDay[][] = []

    for (let row = 0; row < 6; row += 1) {
      const cells: CalendarDay[] = []

      for (let col = 0; col < 7; col += 1) {
        const date = new Date(
          gridStart.getFullYear(),
          gridStart.getMonth(),
          gridStart.getDate() + row * 7 + col
        )
        const outside = date.getMonth() !== viewMonth.value

        const band = dayBand(date)

        cells.push({
          date,
          time: date.getTime(),
          label: date.getDate(),
          outside,
          disabled: props.disabled || isOutOfBounds(date),
          today: sameDay(date, today),
          selected: band === 'single' || band === 'start' || band === 'end',
          band
        })
      }

      rows.push(cells)
    }

    return rows
  })

  /** Day that owns the roving tabindex: tracked focus, else selection, else today, else first enabled. */
  const activeTime = computed<number | null>(() => {
    const flat: CalendarDay[] = weeks.value.flat()

    if (focusedTime.value !== null && flat.some((day) => day.time === focusedTime.value)) {
      return focusedTime.value
    }

    const selected = flat.find((day) => day.selected && !day.disabled)

    if (selected) {
      return selected.time
    }

    const current = flat.find((day) => day.today && !day.outside && !day.disabled)

    if (current) {
      return current.time
    }

    const firstEnabled = flat.find((day) => !day.outside && !day.disabled)

    return firstEnabled ? firstEnabled.time : null
  })

  const goToMonth = (year: number, month: number) => {
    viewDate.value = new Date(year, month, 1)
    emit('month-change', { year: viewDate.value.getFullYear(), month: viewDate.value.getMonth() })
  }

  const goToPreviousMonth = () => {
    if (props.disabled) {
      return
    }

    goToMonth(viewYear.value, viewMonth.value - 1)
  }

  const goToNextMonth = () => {
    if (props.disabled) {
      return
    }

    goToMonth(viewYear.value, viewMonth.value + 1)
  }

  const selectDay = (day: CalendarDay) => {
    if (day.disabled) {
      return
    }

    focusedTime.value = day.time

    if (day.outside) {
      viewDate.value = new Date(day.date.getFullYear(), day.date.getMonth(), 1)
      emit('month-change', { year: day.date.getFullYear(), month: day.date.getMonth() })
    }

    if (props.mode === 'range') {
      const range = asRange(props.modelValue)

      if (!range.start || range.end) {
        emit('update:modelValue', { start: day.date, end: null })
        return
      }

      if (day.date < range.start) {
        emit('update:modelValue', { start: day.date, end: range.start })
        return
      }

      emit('update:modelValue', { start: range.start, end: day.date })
      return
    }

    emit('update:modelValue', day.date)
  }

  const moveFocus = (fromTime: number, deltaDays: number) => {
    const next = new Date(fromTime + deltaDays * MS_PER_DAY)
    const normalized = startOfDay(next)
    focusedTime.value = normalized.getTime()

    if (normalized.getMonth() !== viewMonth.value || normalized.getFullYear() !== viewYear.value) {
      goToMonth(normalized.getFullYear(), normalized.getMonth())
    }
  }

  const onDayKeydown = (event: globalThis.KeyboardEvent, day: CalendarDay) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        moveFocus(day.time, -1)
        break
      case 'ArrowRight':
        event.preventDefault()
        moveFocus(day.time, 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        moveFocus(day.time, -7)
        break
      case 'ArrowDown':
        event.preventDefault()
        moveFocus(day.time, 7)
        break
      case 'PageUp':
        event.preventDefault()
        goToPreviousMonth()
        break
      case 'PageDown':
        event.preventDefault()
        goToNextMonth()
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        selectDay(day)
        break
      default:
        break
    }
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-disabled="disabled || null"
    class="inline-flex max-w-full flex-col items-start overflow-hidden rounded-[var(--shape-button)] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] data-[disabled]:opacity-60"
  >
    <div
      v-if="showHeader"
      class="flex w-full items-center justify-between py-[var(--spacing-xs)] pl-[var(--spacing-md)] pr-[var(--spacing-sm)]"
      :data-testid="`${testId}__header`"
    >
      <span
        class="text-body-sm text-[var(--text-default)]"
        :data-testid="`${testId}__label`"
      >
        {{ monthLabel }}
      </span>

      <div class="flex items-center gap-[var(--spacing-xxs)]">
        <button
          type="button"
          :disabled="disabled"
          aria-label="Previous month"
          :data-testid="`${testId}__prev`"
          class="inline-flex size-7 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-default)] transition-colors duration-150 ease-out hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)] motion-reduce:transition-none"
          @click="goToPreviousMonth"
        >
          <i
            class="pi pi-chevron-left text-[length:inherit] leading-none"
            aria-hidden="true"
          />
        </button>

        <button
          type="button"
          :disabled="disabled"
          aria-label="Next month"
          :data-testid="`${testId}__next`"
          class="inline-flex size-7 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-default)] transition-colors duration-150 ease-out hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)] motion-reduce:transition-none"
          @click="goToNextMonth"
        >
          <i
            class="pi pi-chevron-right text-[length:inherit] leading-none"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>

    <div
      class="flex flex-col items-start gap-[var(--spacing-md)] p-[var(--spacing-sm)]"
      role="grid"
      :aria-label="monthLabel"
      :data-testid="`${testId}__grid`"
    >
      <div
        role="row"
        class="flex items-start"
      >
        <span
          v-for="(weekday, index) in WEEKDAY_LABELS"
          :key="`weekday-${index}`"
          role="columnheader"
          class="text-label-sm flex w-9 items-start justify-center text-[var(--text-muted)]"
        >
          {{ weekday }}
        </span>
      </div>

      <div class="flex flex-col items-start gap-[var(--spacing-xxs)]">
        <div
          v-for="(week, weekIndex) in weeks"
          :key="`week-${weekIndex}`"
          role="row"
          class="flex items-start"
        >
          <div
            v-for="day in week"
            :key="day.time"
            role="gridcell"
            :aria-selected="day.selected || undefined"
            :aria-current="day.today ? 'date' : undefined"
            class="size-9"
          >
            <button
              type="button"
              :disabled="day.disabled"
              :data-band="day.band"
              :data-selected="day.selected || null"
              :data-today="day.today || null"
              :data-outside="day.outside || null"
              :data-disabled="day.disabled || null"
              :data-testid="`${testId}__day`"
              :tabindex="day.time === activeTime ? 0 : -1"
              class="text-body-sm flex size-full items-center justify-center text-[var(--text-default)] transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface-raised)] data-[band=none]:rounded-[var(--shape-elements)] data-[band=none]:hover:bg-[var(--bg-hover)] data-[band=single]:rounded-[var(--shape-elements)] data-[band=single]:bg-[var(--secondary)] data-[band=single]:text-[var(--secondary-contrast)] data-[band=start]:rounded-l-[var(--shape-elements)] data-[band=start]:bg-[var(--secondary)] data-[band=start]:text-[var(--secondary-contrast)] data-[band=end]:rounded-r-[var(--shape-elements)] data-[band=end]:bg-[var(--secondary)] data-[band=end]:text-[var(--secondary-contrast)] data-[band=middle]:bg-[var(--bg-mask)] data-[outside]:text-[var(--text-disabled)] data-[disabled]:cursor-not-allowed data-[disabled]:text-[var(--text-disabled)] motion-reduce:transition-none"
              @click="selectDay(day)"
              @keydown="onDayKeydown($event, day)"
            >
              {{ day.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
