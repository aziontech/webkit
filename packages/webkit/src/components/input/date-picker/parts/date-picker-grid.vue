<script setup lang="ts">
  import { computed, inject, nextTick, ref, watch } from 'vue'

  import { eventDirection, logicalArrowKey } from '../../../../composables/use-direction'
  import { intlLocale, useLocaleContext, useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import {
    getTabViewPanelTransitionStyle,
    type TabsSlideDirection
  } from '../../../navigation/tabs/presets/transitions'
  import Select from '../../select/select.vue'
  import SelectContent from '../../select/select-content/select-content.vue'
  import SelectItem from '../../select/select-item/select-item.vue'
  import SelectTrigger from '../../select/select-trigger/select-trigger.vue'
  import { asRange, asSingle, sameDay, startOfDay } from '../format'
  import { DatePickerInjectionKey } from '../injection-key'

  defineOptions({
    name: 'DatePickerGrid',
    inheritAttrs: false
  })

  const { t, locale } = useTranslate({ datePicker: en.datePicker })
  const { context: localeContext } = useLocaleContext()
  const now = (): Date => new Date(localeContext?.now?.value ?? Date.now())
  const monthLabel = computed(
    () => new Intl.DateTimeFormat(intlLocale(locale.value), { month: 'long', year: 'numeric' })
  )
  const monthNames = computed(() =>
    Array.from({ length: 12 }, (_, month) =>
      new Intl.DateTimeFormat(intlLocale(locale.value), { month: 'long' }).format(
        new Date(2023, month, 1)
      )
    )
  )
  const yearName = (year: number): string =>
    new Intl.DateTimeFormat(intlLocale(locale.value), { year: 'numeric' }).format(
      new Date(year, 0, 1)
    )
  const weekdayLabels = computed(() =>
    Array.from({ length: 7 }, (_, day) =>
      new Intl.DateTimeFormat(intlLocale(locale.value), { weekday: 'narrow' }).format(
        new Date(2023, 0, day + 1)
      )
    )
  )

  const ctx = inject(DatePickerInjectionKey, null)

  const MS_PER_DAY = 86_400_000

  const mode = computed(() => ctx?.mode.value ?? 'single')
  const size = computed(() => ctx?.size.value ?? 'medium')
  const disabledAll = computed(() => ctx?.disabled.value ?? false)
  const draft = computed(() => ctx?.draft.value ?? null)

  const seedDate = (): Date => {
    if (mode.value === 'range') {
      const range = asRange(draft.value)
      if (range.start) {
        return range.start
      }
    } else {
      const single = asSingle(draft.value)
      if (single) {
        return single
      }
    }
    return now()
  }

  const seed = seedDate()
  const viewDate = ref<Date>(new Date(seed.getFullYear(), seed.getMonth(), 1))

  const viewYear = computed(() => viewDate.value.getFullYear())
  const viewMonth = computed(() => viewDate.value.getMonth())

  const slideDirection = ref<TabsSlideDirection>(null)
  const transitioning = ref(false)

  const monthsKey = computed(() => `${viewYear.value}-${viewMonth.value}`)
  const monthsTransitionStyle = computed(() => getTabViewPanelTransitionStyle())

  const monthsEnterFromClass = computed(() =>
    slideDirection.value === 'left'
      ? 'motion-safe:-translate-x-full rtl:motion-safe:translate-x-full motion-safe:opacity-0'
      : 'motion-safe:translate-x-full rtl:motion-safe:-translate-x-full motion-safe:opacity-0'
  )
  const monthsLeaveToClass = computed(() =>
    slideDirection.value === 'left'
      ? 'motion-safe:translate-x-full rtl:motion-safe:-translate-x-full motion-safe:opacity-0'
      : 'motion-safe:-translate-x-full rtl:motion-safe:translate-x-full motion-safe:opacity-0'
  )

  watch(
    () => viewDate.value.getTime(),
    (next, previous) => {
      if (previous !== undefined && next !== previous) {
        slideDirection.value = next > previous ? 'right' : 'left'
      }
    }
  )

  const isMonthVisible = (date: Date): boolean =>
    date.getFullYear() === viewYear.value && date.getMonth() === viewMonth.value

  watch(
    () => ctx?.draft.value,
    () => {
      const next = seedDate()
      if (!isMonthVisible(next)) {
        viewDate.value = new Date(next.getFullYear(), next.getMonth(), 1)
      }
    }
  )

  const today = startOfDay(now())

  const isBeforeMin = (date: Date): boolean => {
    const min = ctx?.min.value
    return Boolean(min && date < startOfDay(min))
  }
  const isAfterMax = (date: Date): boolean => {
    const max = ctx?.max.value
    return Boolean(max && date > startOfDay(max))
  }
  const isOutOfBounds = (date: Date): boolean => isBeforeMin(date) || isAfterMax(date)

  type DatePickerDayBand = 'none' | 'single' | 'start' | 'middle' | 'end'

  interface DatePickerDay {
    date: Date
    time: number
    label: number
    outside: boolean
    disabled: boolean
    today: boolean
    selected: boolean
    band: DatePickerDayBand
  }

  interface DatePickerMonthGrid {
    key: string
    year: number
    month: number
    label: string
    weeks: DatePickerDay[][]
  }

  const dayBand = (date: Date): DatePickerDayBand => {
    if (mode.value !== 'range') {
      return sameDay(date, asSingle(draft.value)) ? 'single' : 'none'
    }

    const range = asRange(draft.value)
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

  const buildWeeks = (year: number, month: number): DatePickerDay[][] => {
    const firstOfMonth = new Date(year, month, 1)
    const gridStart = new Date(year, month, 1 - firstOfMonth.getDay())
    const rows: DatePickerDay[][] = []
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const rowCount = ctx?.trimWeeks?.value
      ? Math.ceil((firstOfMonth.getDay() + daysInMonth) / 7)
      : 6

    for (let row = 0; row < rowCount; row += 1) {
      const cells: DatePickerDay[] = []
      for (let col = 0; col < 7; col += 1) {
        const date = new Date(
          gridStart.getFullYear(),
          gridStart.getMonth(),
          gridStart.getDate() + row * 7 + col
        )
        const outside = date.getMonth() !== month
        const band = dayBand(date)
        cells.push({
          date,
          time: date.getTime(),
          label: date.getDate(),
          outside,
          disabled: disabledAll.value || isOutOfBounds(date),
          today: sameDay(date, today),
          selected: band === 'single' || band === 'start' || band === 'end',
          band
        })
      }
      rows.push(cells)
    }

    return rows
  }

  const monthGrid = computed<DatePickerMonthGrid>(() => {
    const date = new Date(viewYear.value, viewMonth.value, 1)
    const year = date.getFullYear()
    const month = date.getMonth()
    return {
      key: `${year}-${month}`,
      year,
      month,
      label: monthLabel.value.format(date),
      weeks: buildWeeks(year, month)
    }
  })

  const focusedTime = ref<number | null>(null)

  const inMonthDays = computed<DatePickerDay[]>(() =>
    monthGrid.value.weeks.flat().filter((day) => !day.outside)
  )

  const activeTime = computed<number | null>(() => {
    const flat = inMonthDays.value
    if (
      focusedTime.value !== null &&
      flat.some((day) => day.time === focusedTime.value && !day.disabled)
    ) {
      return focusedTime.value
    }
    const selected = flat.find((day) => day.selected && !day.disabled)
    if (selected) {
      return selected.time
    }
    const current = flat.find((day) => day.today && !day.disabled)
    if (current) {
      return current.time
    }
    const firstEnabled = flat.find((day) => !day.disabled)
    return firstEnabled ? firstEnabled.time : null
  })

  const gridEl = ref<globalThis.HTMLElement | null>(null)

  const focusActiveCell = () => {
    nextTick(() => {
      const buttons =
        gridEl.value?.querySelectorAll<globalThis.HTMLButtonElement>('button[tabindex="0"]')
      const target =
        [...(buttons ?? [])].find((button) => !button.closest('.absolute')) ?? buttons?.[0]
      target?.focus()
    })
  }

  const goToMonth = (year: number, month: number) => {
    viewDate.value = new Date(year, month, 1)
    ctx?.changeMonth({ year: viewDate.value.getFullYear(), month: viewDate.value.getMonth() })
  }

  const YEAR_SPAN = 10

  const yearOptions = computed<number[]>(() => {
    const current = now().getFullYear()
    const min = ctx?.min.value
    const max = ctx?.max.value
    const first = Math.min(min ? min.getFullYear() : current - YEAR_SPAN, viewYear.value)
    const last = Math.max(max ? max.getFullYear() : current + YEAR_SPAN, viewYear.value, first)
    return Array.from({ length: last - first + 1 }, (_, index) => first + index)
  })

  const monthOutOfBounds = (year: number, month: number): boolean => {
    const min = ctx?.min.value
    const max = ctx?.max.value
    const first = new Date(year, month, 1)
    const last = new Date(year, month + 1, 0)
    return Boolean((min && last < startOfDay(min)) || (max && first > startOfDay(max)))
  }

  const pickMonth = (month: number | undefined) => {
    if (month === undefined || disabledAll.value) return
    goToMonth(viewYear.value, month)
  }

  const pickYear = (year: number | undefined) => {
    if (year === undefined || disabledAll.value) return
    const min = ctx?.min.value
    const max = ctx?.max.value
    let month = viewMonth.value
    if (min && year === min.getFullYear()) month = Math.max(month, min.getMonth())
    if (max && year === max.getFullYear()) month = Math.min(month, max.getMonth())
    goToMonth(year, month)
  }

  const goToPreviousMonth = () => {
    if (disabledAll.value) {
      return
    }
    goToMonth(viewYear.value, viewMonth.value - 1)
  }

  const goToYearOffset = (years: number) => {
    if (disabledAll.value) {
      return
    }
    goToMonth(viewYear.value + years, viewMonth.value)
  }

  const goToNextMonth = () => {
    if (disabledAll.value) {
      return
    }
    goToMonth(viewYear.value, viewMonth.value + 1)
  }

  const selectDay = (day: DatePickerDay) => {
    if (day.disabled) {
      return
    }
    focusedTime.value = day.time
    if (!isMonthVisible(day.date)) {
      goToMonth(day.date.getFullYear(), day.date.getMonth())
    }
    ctx?.selectDay(day.date)
  }

  const moveFocus = (fromTime: number, deltaDays: number) => {
    const normalized = startOfDay(new Date(fromTime + deltaDays * MS_PER_DAY))
    focusedTime.value = normalized.getTime()
    if (!isMonthVisible(normalized)) {
      goToMonth(normalized.getFullYear(), normalized.getMonth())
    }
    focusActiveCell()
  }

  const onDayKeydown = (event: globalThis.KeyboardEvent, day: DatePickerDay) => {
    switch (logicalArrowKey(event.key, eventDirection(event))) {
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
      case 'Home':
        event.preventDefault()
        moveFocus(day.time, -day.date.getDay())
        break
      case 'End':
        event.preventDefault()
        moveFocus(day.time, 6 - day.date.getDay())
        break
      case 'PageUp':
        event.preventDefault()
        if (event.shiftKey) goToYearOffset(-1)
        else goToPreviousMonth()
        focusActiveCell()
        break
      case 'PageDown':
        event.preventDefault()
        if (event.shiftKey) goToYearOffset(1)
        else goToNextMonth()
        focusActiveCell()
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
    ref="gridEl"
    data-testid="date-picker__grid"
    class="flex flex-col items-start gap-(--spacing-md)"
  >
    <div
      class="flex w-full items-center justify-between gap-(--spacing-2xs)"
      data-testid="date-picker__caption"
    >
      <button
        type="button"
        data-testid="date-picker__previous-month"
        :disabled="disabledAll"
        :aria-label="t('datePicker.previousMonth')"
        class="inline-flex size-7 shrink-0 items-center justify-center rounded-(--shape-control) text-(--text-muted) transition-colors duration-150 ease-out hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface-raised) disabled:cursor-not-allowed disabled:text-(--text-disabled) motion-reduce:transition-none"
        @click="goToPreviousMonth"
      >
        <i
          class="az az-chevron-left text-[length:inherit] leading-none rtl:-scale-x-100"
          aria-hidden="true"
        />
      </button>

      <div class="flex min-w-0 flex-1 flex-wrap items-center justify-center">
        <Select
          :model-value="viewMonth"
          variant="ghost"
          size="small"
          :disabled="disabledAll"
          :aria-label="t('datePicker.month')"
          data-testid="date-picker__month"
          @update:model-value="pickMonth"
        >
          <SelectTrigger data-testid="date-picker__month-trigger" />
          <SelectContent data-testid="date-picker__month-list">
            <SelectItem
              v-for="(name, month) in monthNames"
              :key="month"
              :value="month"
              :disabled="monthOutOfBounds(viewYear, month)"
              >{{ name }}</SelectItem
            >
          </SelectContent>
        </Select>
        <Select
          :model-value="viewYear"
          variant="ghost"
          size="small"
          :disabled="disabledAll"
          :aria-label="t('datePicker.year')"
          data-testid="date-picker__year"
          @update:model-value="pickYear"
        >
          <SelectTrigger data-testid="date-picker__year-trigger" />
          <SelectContent data-testid="date-picker__year-list">
            <SelectItem
              v-for="year in yearOptions"
              :key="year"
              :value="year"
              >{{ yearName(year) }}</SelectItem
            >
          </SelectContent>
        </Select>
      </div>

      <button
        type="button"
        data-testid="date-picker__next-month"
        :disabled="disabledAll"
        :aria-label="t('datePicker.nextMonth')"
        class="inline-flex size-7 shrink-0 items-center justify-center rounded-(--shape-control) text-(--text-muted) transition-colors duration-150 ease-out hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface-raised) disabled:cursor-not-allowed disabled:text-(--text-disabled) motion-reduce:transition-none"
        @click="goToNextMonth"
      >
        <i
          class="az az-chevron-right text-[length:inherit] leading-none rtl:-scale-x-100"
          aria-hidden="true"
        />
      </button>
    </div>

    <div
      :data-transitioning="transitioning || null"
      class="relative w-full data-[transitioning]:overflow-hidden"
    >
      <Transition
        :enter-from-class="monthsEnterFromClass"
        :leave-to-class="monthsLeaveToClass"
        enter-active-class="transform motion-reduce:transition-none"
        leave-active-class="absolute inset-0 transform motion-reduce:transition-none"
        @before-enter="transitioning = true"
        @after-enter="transitioning = false"
        @enter-cancelled="transitioning = false"
      >
        <div
          :key="monthsKey"
          :style="monthsTransitionStyle"
        >
          <div
            role="grid"
            :aria-label="monthGrid.label"
          >
            <div
              role="row"
              class="flex items-start"
            >
              <span
                v-for="(weekday, index) in weekdayLabels"
                :key="`weekday-${index}`"
                role="columnheader"
                :data-size="size"
                class="text-label-sm flex items-start justify-center text-(--text-muted) data-[size=small]:w-8 data-[size=medium]:w-9 data-[size=large]:w-10"
              >
                {{ weekday }}
              </span>
            </div>

            <div class="flex flex-col items-start gap-(--spacing-2xs)">
              <div
                v-for="(week, weekIndex) in monthGrid.weeks"
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
                  class="leading-none"
                >
                  <button
                    type="button"
                    :disabled="day.disabled"
                    :data-size="size"
                    :data-band="day.band"
                    :data-selected="day.selected || null"
                    :data-today="day.today || null"
                    :data-outside="day.outside || null"
                    :data-disabled="day.disabled || null"
                    data-testid="date-picker__day"
                    :tabindex="!day.outside && day.time === activeTime ? 0 : -1"
                    class="flex items-center justify-center text-(--text-default) transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface-raised) data-[size=small]:size-8 data-[size=small]:text-body-xs data-[size=medium]:size-9 data-[size=medium]:text-body-sm data-[size=large]:size-10 data-[size=large]:text-body-md data-[band=none]:rounded-(--shape-control) data-[band=none]:hover:bg-(--bg-hover) data-[band=single]:rounded-(--shape-control) data-[band=single]:bg-(--secondary-selected) data-[band=single]:text-(--secondary-foreground) data-[band=start]:rounded-s-(--shape-control) data-[band=start]:bg-(--secondary-selected) data-[band=start]:text-(--secondary-foreground) data-[band=end]:rounded-e-(--shape-control) data-[band=end]:bg-(--secondary-selected) data-[band=end]:text-(--secondary-foreground) data-[band=middle]:bg-(--bg-selected) data-[outside]:not-data-[disabled]:text-(--text-muted) data-[disabled]:cursor-not-allowed data-[disabled]:text-(--text-disabled) motion-reduce:transition-none"
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
      </Transition>
    </div>
  </div>
</template>
