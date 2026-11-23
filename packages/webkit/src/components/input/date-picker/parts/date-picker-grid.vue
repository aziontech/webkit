<script setup lang="ts">
  import { computed, inject, ref, watch } from 'vue'

  import { intlLocale, useLocaleContext, useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import {
    getTabViewPanelTransitionStyle,
    type TabsSlideDirection
  } from '../../../navigation/tabs/presets/transitions'
  import Select from '../../select/select.vue'
  import SelectContent from '../../select/select-content/select-content.vue'
  import SelectItem from '../../select/select-item/select-item.vue'
  import SelectTrigger from '../../select/select-trigger/select-trigger.vue'
  import { useDatePickerGridFocus } from '../composables/use-date-picker-grid-focus'
  import { asRange, asSingle, startOfDay } from '../format'
  import { DatePickerInjectionKey } from '../injection-key'
  import { clampMonth, dayOutOfBounds, monthOutOfBounds, yearRange } from '../lib/calendar-bounds'
  import { buildWeeks, type DatePickerDay, dayBand } from '../lib/calendar-weeks'

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

  const size = computed(() => ctx?.size.value ?? 'medium')

  const disabledAll = computed(() => ctx?.disabled.value ?? false)
  const min = (): Date | undefined => ctx?.min.value
  const max = (): Date | undefined => ctx?.max.value

  const seedDate = (): Date => {
    const draft = ctx?.draft.value ?? null
    const seed = (ctx?.mode.value ?? 'single') === 'range' ? asRange(draft).start : asSingle(draft)
    return seed ?? now()
  }

  const seed = seedDate()
  const viewDate = ref<Date>(new Date(seed.getFullYear(), seed.getMonth(), 1))
  const viewYear = computed(() => viewDate.value.getFullYear())
  const viewMonth = computed(() => viewDate.value.getMonth())
  const slideDirection = ref<TabsSlideDirection>(null)

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

  const goToMonth = (year: number, month: number) => {
    viewDate.value = new Date(year, month, 1)
    ctx?.changeMonth({ year: viewDate.value.getFullYear(), month: viewDate.value.getMonth() })
  }

  const showMonthOf = (date: Date) => {
    if (!isMonthVisible(date)) goToMonth(date.getFullYear(), date.getMonth())
  }

  const yearOptions = computed<number[]>(() =>
    yearRange(now().getFullYear(), viewYear.value, min(), max())
  )

  const pickMonth = (month: number | undefined) => {
    if (month === undefined || disabledAll.value) return
    goToMonth(viewYear.value, month)
  }

  const pickYear = (year: number | undefined) => {
    if (year === undefined || disabledAll.value) return
    goToMonth(year, clampMonth(year, viewMonth.value, min(), max()))
  }

  const turnPage = (step: number, byYear = false) => {
    if (disabledAll.value) return
    if (byYear) goToMonth(viewYear.value + step, viewMonth.value)
    else goToMonth(viewYear.value, viewMonth.value + step)
  }

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

  const today = startOfDay(now())

  const monthGrid = computed(() => {
    const date = new Date(viewYear.value, viewMonth.value, 1)
    const year = date.getFullYear()
    const month = date.getMonth()
    return {
      key: `${year}-${month}`,
      year,
      month,
      label: monthLabel.value.format(date),
      weeks: buildWeeks(
        year,
        month,
        Boolean(ctx?.trimWeeks?.value),
        today,
        (day) => disabledAll.value || dayOutOfBounds(day, min(), max()),
        (day) => dayBand(day, ctx?.mode.value ?? 'single', ctx?.draft.value ?? null)
      )
    }
  })

  const inMonthDays = computed<DatePickerDay[]>(() =>
    monthGrid.value.weeks.flat().filter((day) => !day.outside)
  )

  const gridEl = ref<globalThis.HTMLElement | null>(null)

  const { activeTime, selectDay, onDayKeydown } = useDatePickerGridFocus(
    ctx,
    inMonthDays,
    gridEl,
    showMonthOf,
    turnPage
  )
  const DAY_CLASS =
    'flex items-center justify-center text-(--text-default) transition-colors duration-150 ease-out ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface-raised) ' +
    'data-[size=small]:size-8 data-[size=small]:text-body-xs data-[size=medium]:size-9 data-[size=medium]:text-body-sm data-[size=large]:size-10 data-[size=large]:text-body-md ' +
    'data-[band=none]:rounded-(--shape-control) data-[band=none]:hover:bg-(--bg-hover) data-[band=single]:rounded-(--shape-control) data-[band=single]:bg-(--secondary-selected) ' +
    'data-[band=single]:text-(--secondary-foreground) data-[band=start]:rounded-s-(--shape-control) data-[band=start]:bg-(--secondary-selected) ' +
    'data-[band=start]:text-(--secondary-foreground) data-[band=end]:rounded-e-(--shape-control) data-[band=end]:bg-(--secondary-selected) data-[band=end]:text-(--secondary-foreground) ' +
    'data-[band=middle]:bg-(--bg-selected) ' +
    'data-[outside]:not-data-[disabled]:text-(--text-muted) ' +
    'data-[disabled]:cursor-not-allowed data-[disabled]:text-(--text-disabled) ' +
    'motion-reduce:transition-none'
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
      <IconButton
        icon="az az-chevron-left"
        variant="ghost"
        size="small"
        data-testid="date-picker__previous-month"
        :disabled="disabledAll"
        :aria-label="t('datePicker.previousMonth')"
        @click="turnPage(-1)"
      />

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
              :disabled="monthOutOfBounds(viewYear, month, min(), max())"
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

      <IconButton
        icon="az az-chevron-right"
        variant="ghost"
        size="small"
        data-testid="date-picker__next-month"
        :disabled="disabledAll"
        :aria-label="t('datePicker.nextMonth')"
        @click="turnPage(1)"
      />
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
                    :data-autofocus="(!day.outside && day.time === activeTime) || null"
                    :class="DAY_CLASS"
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
