<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  import { logicalArrowKey, useDirection } from '../../../composables/use-direction'
  import { useLocale } from '../../../composables/use-locale'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import {
    buildCalendarGrid,
    type ContributionGraphDay,
    type ContributionGraphItem,
    type ContributionGraphLevel
  } from './lib/calendar-grid'

  defineOptions({ name: 'ContributionGraph', inheritAttrs: false })

  export type { ContributionGraphDay, ContributionGraphItem, ContributionGraphLevel }

  export interface ContributionGraphProps {
    /** Daily contribution entries ({ date, count, level?, label? }). Missing days render at level 0. */
    items?: ContributionGraphItem[]
    /** Calendar year to display (Jan 1 - Dec 31). When omitted, displays 52 weeks ending at endDate or the latest item date. */
    year?: number
    /** ISO date (YYYY-MM-DD) ending a rolling 52-week window when year is omitted. */
    endDate?: string
    /** Renders the Less ... More intensity legend in the footer. */
    showLegend?: boolean
    /** Renders a Skeleton placeholder in place of the calendar grid. */
    loading?: boolean
    /** Error message; when set, renders an inline danger alert in place of the grid. */
    error?: string
    /** Accessible name of the contribution grid. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<ContributionGraphProps>(), {
    items: () => [],
    year: undefined,
    endDate: '',
    showLegend: true,
    loading: false,
    error: '',
    ariaLabel: ''
  })

  const emit = defineEmits<{
    select: [event: globalThis.MouseEvent | globalThis.KeyboardEvent, item: ContributionGraphDay]
  }>()

  /** ISO date (YYYY-MM-DD) of the selected day, or null. */
  const selectedDate = defineModel<string | null>('selectedDate', { default: null })

  const attrs = useAttrs()
  const dir = useDirection()
  const { formatDate } = useLocale()
  const { t } = useTranslate({ contributionGraph: en.contributionGraph })

  const testId = computed(() => String(attrs['data-testid'] ?? 'contribution-graph'))
  const hasError = computed(() => !props.loading && props.error.length > 0)

  const grid = computed(() => buildCalendarGrid(props.items, props.year, props.endDate))
  const isEmpty = computed(() => !props.loading && !hasError.value && grid.value.days.length === 0)

  const hoveredIndex = ref<number | null>(null)
  const focusedIndex = ref<number>(0)
  const gridEl = ref<globalThis.HTMLDivElement | null>(null)

  const MONTH_FORMAT: Intl.DateTimeFormatOptions = { month: 'short', timeZone: 'UTC' }
  const WEEKDAY_FORMAT: Intl.DateTimeFormatOptions = { weekday: 'short', timeZone: 'UTC' }
  const DAY_FORMAT: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC'
  }

  const range = computed(() => {
    const days = grid.value.days
    const first = days.findIndex((d) => d.inRange)
    const last = days.length - 1 - [...days].reverse().findIndex((d) => d.inRange)
    return { first: Math.max(0, first), last: Math.max(0, last) }
  })

  const rows = computed(() =>
    [0, 1, 2, 3, 4, 5, 6].map((dow) =>
      grid.value.days
        .map((day, index) => ({ day, index }))
        .filter((cell) => cell.day.dayOfWeek === dow)
    )
  )

  const weekdayLabels = computed(() => {
    const sunday = Date.UTC(2026, 0, 4)
    return [1, 3, 5].map((dow) => ({
      row: dow + 1,
      label: formatDate(new Date(sunday + dow * 86_400_000), WEEKDAY_FORMAT)
    }))
  })

  const monthLabels = computed(() =>
    grid.value.months.map((m) => ({
      key: m.key,
      column: m.weekIndex + 1,
      label: formatDate(m.utcDate, MONTH_FORMAT)
    }))
  )

  function labelForDay(day: ContributionGraphDay): string {
    if (day.label) return day.label
    const formattedDate = formatDate(day.utcDate, DAY_FORMAT)
    if (day.count <= 0) return t('contributionGraph.dayZero', { date: formattedDate })
    return t('contributionGraph.dayLabel', { count: day.count, date: formattedDate })
  }

  const dayLabels = computed(() => grid.value.days.map(labelForDay))

  const selectedIndex = computed(() => {
    if (!selectedDate.value) return -1
    return grid.value.days.findIndex((day) => day.date === selectedDate.value)
  })

  const readoutText = computed(() => {
    const index =
      hoveredIndex.value !== null && grid.value.days[hoveredIndex.value]
        ? hoveredIndex.value
        : selectedIndex.value
    return index >= 0 ? (dayLabels.value[index] ?? '') : t('contributionGraph.hint')
  })

  const announcement = computed(() => {
    if (props.loading || hasError.value) return ''
    if (isEmpty.value) return t('contributionGraph.noData')
    return selectedIndex.value >= 0 ? (dayLabels.value[selectedIndex.value] ?? '') : ''
  })

  function onGridPointer(event: globalThis.PointerEvent | globalThis.FocusEvent) {
    const cell =
      event.target instanceof globalThis.Element ? event.target.closest('[data-day-index]') : null
    if (cell) hoveredIndex.value = Number(cell.getAttribute('data-day-index'))
  }

  function onGridFocusout(event: globalThis.FocusEvent) {
    const next = event.relatedTarget
    if (!(next instanceof globalThis.Node) || !gridEl.value?.contains(next))
      hoveredIndex.value = null
  }

  watch(
    () => grid.value.days,
    (days) => {
      hoveredIndex.value = null
      if (!days.length) {
        focusedIndex.value = 0
        return
      }
      if (selectedDate.value) {
        const idx = days.findIndex((d) => d.date === selectedDate.value)
        if (idx >= 0) {
          focusedIndex.value = idx
          return
        }
      }
      focusedIndex.value = range.value.last
    },
    { immediate: true }
  )

  function toggleDay(
    event: globalThis.MouseEvent | globalThis.KeyboardEvent,
    day: ContributionGraphDay,
    index: number
  ) {
    focusedIndex.value = index
    hoveredIndex.value = index
    selectedDate.value = selectedDate.value === day.date ? null : day.date
    emit('select', event, day)
  }

  function focusCell(index: number) {
    const clamped = Math.max(range.value.first, Math.min(range.value.last, index))
    focusedIndex.value = clamped
    hoveredIndex.value = clamped
    const btn = gridEl.value?.querySelector<globalThis.HTMLButtonElement>(
      `[data-day-index="${clamped}"]`
    )
    btn?.focus()
  }

  function onCellKeydown(event: globalThis.KeyboardEvent, index: number) {
    if (!grid.value.days.length) return
    const key = logicalArrowKey(event.key, dir.value)
    if (key === 'ArrowRight') focusCell(index + 7)
    else if (key === 'ArrowLeft') focusCell(index - 7)
    else if (event.key === 'ArrowDown') focusCell(index + 1)
    else if (event.key === 'ArrowUp') focusCell(index - 1)
    else if (event.key === 'Home') focusCell(range.value.first)
    else if (event.key === 'End') focusCell(range.value.last)
    else if (event.key === 'Escape') {
      selectedDate.value = null
      hoveredIndex.value = null
    } else return
    event.preventDefault()
  }

  const LEGEND_LEVELS: ContributionGraphLevel[] = [0, 1, 2, 3, 4]

  const LEVEL_CLASS =
    'forced-color-adjust-none ' +
    'data-[level=0]:bg-(--bg-placeholder) data-[level=1]:bg-(--chart-sequential-2) ' +
    'data-[level=2]:bg-(--chart-sequential-4) data-[level=3]:bg-(--chart-sequential-5) ' +
    'data-[level=4]:bg-(--chart-sequential-7)'

  const CELL_CLASS =
    'size-2.75 shrink-0 cursor-pointer rounded-xs border-0 p-0 outline-none ' +
    'transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none ' +
    'data-[selected]:ring-2 data-[selected]:ring-(--ring-color) data-[selected]:ring-offset-1 ' +
    'data-[selected]:ring-offset-(--bg-surface) focus-visible:ring-2 focus-visible:ring-(--ring-color) ' +
    'focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-surface) ' +
    LEVEL_CLASS

  const LEGEND_CELL_CLASS = 'inline-block size-2.75 rounded-xs ' + LEVEL_CLASS
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    data-plain-ground
    :data-loading="loading || null"
    :data-error="hasError || null"
    :aria-busy="loading || undefined"
    class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
  >
    <Skeleton
      v-if="loading"
      width="100%"
      height="7.5rem"
      :data-testid="`${testId}__loading`"
    />
    <div
      v-else-if="hasError"
      role="alert"
      class="flex"
    >
      <EmptyState
        :title="t('contributionGraph.errorTitle')"
        :description="error"
        icon="az az-triangle-alert"
        size="small"
        bordered
        class="flex-1"
        :data-testid="`${testId}__error`"
      />
    </div>
    <EmptyState
      v-else-if="isEmpty"
      :title="t('contributionGraph.noData')"
      icon="az az-calendar"
      size="small"
      bordered
      :data-testid="`${testId}__empty`"
    />
    <template v-else>
      <div class="w-full overflow-x-auto pb-(--spacing-2xs)">
        <div class="inline-flex min-w-max flex-col gap-(--spacing-2xs)">
          <div
            :data-testid="`${testId}__months`"
            aria-hidden="true"
            class="grid items-center gap-0.5 ps-8 text-label-sm text-(--text-muted)"
            :style="{ gridTemplateColumns: `repeat(${grid.weeks}, 0.6875rem)` }"
          >
            <span
              v-for="month in monthLabels"
              :key="month.key"
              class="whitespace-nowrap"
              :style="{ gridColumn: `${month.column} / span 3`, gridRow: 1 }"
            >
              {{ month.label }}
            </span>
          </div>
          <div class="flex items-start gap-(--spacing-2xs)">
            <div
              :data-testid="`${testId}__weekdays`"
              aria-hidden="true"
              class="grid w-7 shrink-0 grid-rows-7 gap-0.5 text-label-sm text-(--text-muted)"
            >
              <span
                v-for="day in weekdayLabels"
                :key="day.row"
                class="flex h-2.75 items-center leading-none"
                :style="{ gridRow: day.row }"
              >
                {{ day.label }}
              </span>
            </div>
            <div
              ref="gridEl"
              role="grid"
              :aria-roledescription="t('contributionGraph.roleDescription')"
              :aria-label="ariaLabel || t('contributionGraph.label')"
              :data-testid="`${testId}__grid`"
              class="flex flex-col gap-0.5"
              @pointerleave="hoveredIndex = null"
              @pointerover="onGridPointer"
              @focusin="onGridPointer"
              @focusout="onGridFocusout"
            >
              <div
                v-for="(row, dow) in rows"
                :key="dow"
                role="row"
                class="flex gap-0.5"
              >
                <template
                  v-for="cell in row"
                  :key="cell.day.date"
                >
                  <button
                    v-if="cell.day.inRange"
                    type="button"
                    role="gridcell"
                    :data-day-index="cell.index"
                    :data-testid="`${testId}__cell`"
                    :data-date="cell.day.date"
                    :data-level="cell.day.level"
                    :data-selected="selectedDate === cell.day.date || null"
                    :aria-label="dayLabels[cell.index]"
                    :aria-selected="selectedDate === cell.day.date"
                    :tabindex="cell.index === focusedIndex ? 0 : -1"
                    :class="CELL_CLASS"
                    @click="toggleDay($event, cell.day, cell.index)"
                    @keydown="onCellKeydown($event, cell.index)"
                  />
                  <span
                    v-else
                    aria-hidden="true"
                    class="size-2.75 shrink-0"
                  />
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        :data-testid="`${testId}__footer`"
        class="flex flex-wrap items-center justify-between gap-(--spacing-xs) text-label-sm text-(--text-muted)"
      >
        <span
          :data-testid="`${testId}__readout`"
          class="tabular-nums text-(--text-default)"
        >
          {{ readoutText }}
        </span>
        <div
          v-if="showLegend"
          :data-testid="`${testId}__legend`"
          aria-hidden="true"
          class="flex items-center gap-(--spacing-2xs)"
        >
          <span>{{ t('contributionGraph.less') }}</span>
          <span
            v-for="level in LEGEND_LEVELS"
            :key="level"
            :data-level="level"
            :class="LEGEND_CELL_CLASS"
          />
          <span>{{ t('contributionGraph.more') }}</span>
        </div>
      </div>
    </template>

    <p
      aria-live="polite"
      class="sr-only"
      :data-testid="`${testId}__live`"
    >
      {{ announcement }}
    </p>
  </div>
</template>
