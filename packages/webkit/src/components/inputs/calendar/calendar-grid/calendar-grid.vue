<script setup lang="ts">
  import { computed, inject, nextTick, ref, watch } from 'vue'

  import {
    getTabViewPanelTransitionStyle,
    type TabViewSlideDirection
  } from '../../../navigation/tab-view/presets/transitions'
  import { asRange, asSingle, sameDay, startOfDay } from '../format'
  import { CalendarInjectionKey } from '../injection-key'

  defineOptions({
    name: 'CalendarGrid',
    inheritAttrs: false
  })

  const ctx = inject(CalendarInjectionKey, null)

  const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const
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
    return new Date()
  }

  const seed = seedDate()
  const viewDate = ref<Date>(new Date(seed.getFullYear(), seed.getMonth(), 1))

  const viewYear = computed(() => viewDate.value.getFullYear())
  const viewMonth = computed(() => viewDate.value.getMonth())

  /* ---- month-change motion — a horizontal scroll. Keying the strip by month swaps it
     through a <Transition>: the outgoing strip slides out one side while the incoming
     slides in from the other, both on screen at once, so it reads as a continuous scroll
     instead of a fade/blink. Forward → positive translate, backward → negative; the
     productive-entrance transform+opacity is shared with the TabView panel. ---- */
  const slideDirection = ref<TabViewSlideDirection>(null)
  const transitioning = ref(false)

  const monthsKey = computed(() => `${viewYear.value}-${viewMonth.value}`)
  const monthsTransitionStyle = computed(() => getTabViewPanelTransitionStyle())

  // The incoming strip starts off-screen on the side being navigated toward; the outgoing
  // one leaves to the opposite side. `motion-safe:` gates the offset/opacity so a
  // reduced-motion swap is instant, with no movement.
  const monthsEnterFromClass = computed(() =>
    slideDirection.value === 'left'
      ? 'motion-safe:-translate-x-full motion-safe:opacity-0'
      : 'motion-safe:translate-x-full motion-safe:opacity-0'
  )
  const monthsLeaveToClass = computed(() =>
    slideDirection.value === 'left'
      ? 'motion-safe:translate-x-full motion-safe:opacity-0'
      : 'motion-safe:-translate-x-full motion-safe:opacity-0'
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

  const today = startOfDay(new Date())

  const isBeforeMin = (date: Date): boolean => {
    const min = ctx?.min.value
    return Boolean(min && date < startOfDay(min))
  }
  const isAfterMax = (date: Date): boolean => {
    const max = ctx?.max.value
    return Boolean(max && date > startOfDay(max))
  }
  const isOutOfBounds = (date: Date): boolean => isBeforeMin(date) || isAfterMax(date)

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

  interface CalendarMonthGrid {
    key: string
    year: number
    month: number
    label: string
    weeks: CalendarDay[][]
  }

  const dayBand = (date: Date): CalendarDayBand => {
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

  const buildWeeks = (year: number, month: number): CalendarDay[][] => {
    const firstOfMonth = new Date(year, month, 1)
    const gridStart = new Date(year, month, 1 - firstOfMonth.getDay())
    const rows: CalendarDay[][] = []

    for (let row = 0; row < 6; row += 1) {
      const cells: CalendarDay[] = []
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

  const monthGrid = computed<CalendarMonthGrid>(() => {
    const date = new Date(viewYear.value, viewMonth.value, 1)
    const year = date.getFullYear()
    const month = date.getMonth()
    return {
      key: `${year}-${month}`,
      year,
      month,
      label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      weeks: buildWeeks(year, month)
    }
  })

  const focusedTime = ref<number | null>(null)

  const inMonthDays = computed<CalendarDay[]>(() =>
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

  const gridRef = ref<globalThis.HTMLElement | null>(null)

  const focusActiveCell = () => {
    nextTick(() => {
      const buttons =
        gridRef.value?.querySelectorAll<globalThis.HTMLButtonElement>('button[tabindex="0"]')
      // While a month scroll is running two strips coexist; focus the incoming (in-flow)
      // one, never the outgoing strip (positioned absolutely and about to unmount).
      const target =
        [...(buttons ?? [])].find((button) => !button.closest('.absolute')) ?? buttons?.[0]
      target?.focus()
    })
  }

  const goToMonth = (year: number, month: number) => {
    viewDate.value = new Date(year, month, 1)
    ctx?.changeMonth({ year: viewDate.value.getFullYear(), month: viewDate.value.getMonth() })
  }

  const goToPreviousMonth = () => {
    if (disabledAll.value) {
      return
    }
    goToMonth(viewYear.value, viewMonth.value - 1)
  }

  const goToNextMonth = () => {
    if (disabledAll.value) {
      return
    }
    goToMonth(viewYear.value, viewMonth.value + 1)
  }

  const selectDay = (day: CalendarDay) => {
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
        focusActiveCell()
        break
      case 'PageDown':
        event.preventDefault()
        goToNextMonth()
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
    ref="gridRef"
    :data-transitioning="transitioning || null"
    data-testid="input-calendar__grid"
    class="relative data-[transitioning]:overflow-hidden"
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
        class="flex flex-col items-start gap-[var(--spacing-md)]"
      >
        <div class="flex w-full items-center justify-between gap-[var(--spacing-xs)]">
          <span class="text-body-sm text-[var(--text-default)]">
            {{ monthGrid.label }}
          </span>

          <div class="flex shrink-0 items-center gap-[var(--spacing-xxs)]">
            <button
              type="button"
              :disabled="disabledAll"
              aria-label="Previous month"
              class="inline-flex size-7 shrink-0 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-muted)] transition-colors duration-150 ease-out hover:bg-[var(--bg-hover)] hover:text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface-raised)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)] motion-reduce:transition-none"
              @click="goToPreviousMonth"
            >
              <i
                class="pi pi-chevron-left text-[length:inherit] leading-none"
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              :disabled="disabledAll"
              aria-label="Next month"
              class="inline-flex size-7 shrink-0 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-muted)] transition-colors duration-150 ease-out hover:bg-[var(--bg-hover)] hover:text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface-raised)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)] motion-reduce:transition-none"
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
          role="grid"
          :aria-label="monthGrid.label"
        >
          <div
            role="row"
            class="flex items-start"
          >
            <span
              v-for="(weekday, index) in WEEKDAY_LABELS"
              :key="`weekday-${index}`"
              role="columnheader"
              :data-size="size"
              class="text-label-sm flex items-start justify-center text-[var(--text-muted)] data-[size=small]:w-8 data-[size=medium]:w-9 data-[size=large]:w-10"
            >
              {{ weekday }}
            </span>
          </div>

          <div class="flex flex-col items-start gap-[var(--spacing-xxs)]">
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
                  data-testid="input-calendar__day"
                  :tabindex="!day.outside && day.time === activeTime ? 0 : -1"
                  class="flex items-center justify-center text-[var(--text-default)] transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface-raised)] data-[size=small]:size-8 data-[size=small]:text-body-xs data-[size=medium]:size-9 data-[size=medium]:text-body-sm data-[size=large]:size-10 data-[size=large]:text-body-md data-[band=none]:rounded-[var(--shape-elements)] data-[band=none]:hover:bg-[var(--bg-hover)] data-[band=single]:rounded-[var(--shape-elements)] data-[band=single]:bg-[var(--secondary-selected)] data-[band=single]:text-[var(--secondary-contrast)] data-[band=start]:rounded-l-[var(--shape-elements)] data-[band=start]:bg-[var(--secondary-selected)] data-[band=start]:text-[var(--secondary-contrast)] data-[band=end]:rounded-r-[var(--shape-elements)] data-[band=end]:bg-[var(--secondary-selected)] data-[band=end]:text-[var(--secondary-contrast)] data-[band=middle]:bg-[var(--bg-selected)] data-[outside]:text-[var(--text-disabled)] data-[disabled]:cursor-not-allowed data-[disabled]:text-[var(--text-disabled)] motion-reduce:transition-none"
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
</template>
