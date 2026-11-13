<script setup lang="ts">
  import {
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
    useAttrs,
    useId,
    watch
  } from 'vue'

  import { useFocusTrap } from '../../../composables/use-focus-trap'
  import {
    useLocaleContext,
    usePortalLocale,
    useTranslate
  } from '../../../composables/use-locale/use-translate'
  import { usePlacement } from '../../../composables/use-placement'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import ToggleGroup from '../../actions/toggle-group/toggle-group.vue'
  import CalendarFields from '../calendar/calendar-fields/calendar-fields.vue'
  import CalendarGrid from '../calendar/calendar-grid/calendar-grid.vue'
  import CalendarTimezone from '../calendar/calendar-timezone/calendar-timezone.vue'
  import {
    asRange,
    formatValueLabel,
    localTimezone,
    startOfDay,
    withTime
  } from '../calendar/format'
  import {
    CalendarInjectionKey,
    type CalendarRange,
    type CalendarValue
  } from '../calendar/injection-key'
  import Input from '../input/input.vue'
  import {
    DATE_RANGE_UNITS,
    type DateRangeUnit,
    type DateRangeValue,
    DEFAULT_RELATIVE_OPTIONS,
    fromWallClock,
    type RelativeOption,
    resolveDateRange,
    sameRelative,
    stepDateRange,
    toWallClock,
    zoneOffsetLabel
  } from './date-range'

  export type { DateRangeUnit, DateRangeValue, RelativeOption } from './date-range'

  type RangeSize = 'small' | 'medium' | 'large'
  type RangeSelectorMode = 'default' | 'relative-only' | 'absolute-only'
  type PanelMode = 'relative' | 'absolute'

  defineOptions({
    name: 'DateRangePicker',
    inheritAttrs: false
  })

  interface Props {
    /** Quick ranges listed on the Relative tab. */
    relativeOptions?: RelativeOption[]
    /** Zones offered by the selector. Empty falls back to the zones `Intl` supports. */
    timeZones?: string[]
    /** Shows the time zone selector in the panel. */
    showTimeZone?: boolean
    /** Shows Previous and Next buttons that move the range back or forward by its own length. */
    showStep?: boolean
    /** Which kinds of range the panel offers. */
    rangeSelectorMode?: RangeSelectorMode
    /** Earliest instant an absolute range may start at. */
    min?: Date
    /** Latest instant an absolute range may end at. */
    max?: Date
    /** Reference clock for relative ranges and stepping. Unset uses the nearest WebkitProvider now, then the real clock. */
    now?: Date
    /** Trigger text with no range. Empty uses the locale catalog. */
    placeholder?: string
    /** Accessible name of the trigger. Empty uses the locale catalog. */
    ariaLabel?: string
    /** Disables the trigger and the step buttons. */
    disabled?: boolean
    /** Size token of the trigger and the panel controls. */
    size?: RangeSize
  }

  const props = withDefaults(defineProps<Props>(), {
    relativeOptions: () => DEFAULT_RELATIVE_OPTIONS,
    timeZones: () => [],
    showTimeZone: true,
    showStep: false,
    rangeSelectorMode: 'default',
    min: undefined,
    max: undefined,
    now: undefined,
    placeholder: '',
    ariaLabel: '',
    disabled: false,
    size: 'medium'
  })

  const model = defineModel<DateRangeValue | null>({ default: null })
  const timeZone = defineModel<string>('timeZone', { default: '' })

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ dateRangePicker: en.dateRangePicker, calendar: en.calendar })
  const { context: localeContext } = useLocaleContext()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-date-range-picker'
  )
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const uid = useId()
  const errorId = `${uid}-error`
  const customAmountId = `${uid}-amount`
  const customUnitId = `${uid}-unit`

  const mounted = ref(false)
  onMounted(() => {
    mounted.value = true
  })

  const zone = computed<string>(() => timeZone.value || (mounted.value ? localTimezone() : 'UTC'))
  const clock = (): Date => {
    if (props.now) return props.now
    const provided = localeContext?.now?.value
    return provided === undefined ? new Date() : new Date(provided)
  }

  const relativeText = (amount: number, unit: DateRangeUnit): string =>
    t(`dateRangePicker.${unit}`, { count: amount })

  const optionLabel = (option: RelativeOption): string =>
    option.label || relativeText(option.amount, option.unit)

  const unitKeys = {
    second: 'dateRangePicker.unitSecond',
    minute: 'dateRangePicker.unitMinute',
    hour: 'dateRangePicker.unitHour',
    day: 'dateRangePicker.unitDay',
    week: 'dateRangePicker.unitWeek',
    month: 'dateRangePicker.unitMonth',
    year: 'dateRangePicker.unitYear'
  } as const

  const unitLabel = (unit: DateRangeUnit): string => t(unitKeys[unit])

  const triggerText = computed<string>(() => {
    const value = model.value
    if (!value) return ''
    if (value.type === 'relative') {
      const option = props.relativeOptions.find((item) => sameRelative(value, item))
      return option ? optionLabel(option) : relativeText(value.amount, value.unit)
    }
    const range = resolveDateRange(value)
    if (!range) return ''
    const wall = {
      start: toWallClock(range.start, zone.value),
      end: toWallClock(range.end, zone.value)
    }
    return `${formatValueLabel(wall, 'range', '', locale.value)} (${zoneOffsetLabel(zone.value, range.start)})`
  })

  const offersRelative = computed(() => props.rangeSelectorMode !== 'absolute-only')
  const offersAbsolute = computed(() => props.rangeSelectorMode !== 'relative-only')

  const isOpen = ref(false)
  const triggerRef = ref<HTMLElement | null>(null)
  const panelRef = ref<HTMLElement | null>(null)

  const panelMode = ref<PanelMode>('relative')
  const draftKey = ref<string>('')
  const customAmount = ref<string>('1')
  const customUnit = ref<DateRangeUnit>('hour')
  const draftRange = ref<CalendarRange>({ start: null, end: null })
  const draftZone = ref<string>('')
  const showError = ref(false)

  const CUSTOM = '__custom'

  const resetDraft = (): void => {
    const value = model.value
    draftZone.value = zone.value
    showError.value = false
    if (value?.type !== 'absolute' && offersRelative.value) {
      panelMode.value = 'relative'
      const option = value
        ? props.relativeOptions.find((item) => sameRelative(value, item))
        : props.relativeOptions[0]
      draftKey.value = option ? option.key : CUSTOM
      customAmount.value = String(value?.amount ?? 1)
      customUnit.value = value?.unit ?? 'hour'
    } else {
      panelMode.value = offersAbsolute.value ? 'absolute' : 'relative'
      draftKey.value = props.relativeOptions[0]?.key ?? CUSTOM
    }
    const resolved = resolveDateRange(value, clock())
    draftRange.value = resolved
      ? {
          start: toWallClock(resolved.start, zone.value),
          end: toWallClock(resolved.end, zone.value)
        }
      : { start: null, end: null }
  }

  const setOpen = (open: boolean): void => {
    if (open && props.disabled) return
    if (open) resetDraft()
    isOpen.value = open
  }

  const focusTrigger = (): void => {
    triggerRef.value?.querySelector<HTMLElement>('[data-part="trigger"]')?.focus()
  }

  const close = (): void => {
    setOpen(false)
    nextTick(focusTrigger)
  }

  const minWall = computed(() => (props.min ? toWallClock(props.min, draftZone.value) : undefined))
  const maxWall = computed(() => (props.max ? toWallClock(props.max, draftZone.value) : undefined))

  const parsedAmount = computed<number | null>(() => {
    const amount = Number(customAmount.value)
    return Number.isInteger(amount) && amount > 0 ? amount : null
  })

  const draftValue = computed<DateRangeValue | null>(() => {
    if (panelMode.value === 'relative') {
      if (draftKey.value === CUSTOM) {
        return parsedAmount.value
          ? { type: 'relative', amount: parsedAmount.value, unit: customUnit.value }
          : null
      }
      const option = props.relativeOptions.find((item) => item.key === draftKey.value)
      return option
        ? { type: 'relative', amount: option.amount, unit: option.unit, key: option.key }
        : null
    }
    const { start, end } = draftRange.value
    if (!start || !end) return null
    return {
      type: 'absolute',
      start: fromWallClock(start, draftZone.value).toISOString(),
      end: fromWallClock(end, draftZone.value).toISOString()
    }
  })

  const draftError = computed<string>(() => {
    if (panelMode.value === 'relative') {
      return draftKey.value === CUSTOM && !parsedAmount.value
        ? t('dateRangePicker.invalidAmount')
        : ''
    }
    const value = draftValue.value
    if (!value || value.type !== 'absolute') return t('dateRangePicker.incomplete')
    const start = new Date(value.start).getTime()
    const end = new Date(value.end).getTime()
    if (end <= start) return t('dateRangePicker.order')
    if ((props.min && start < props.min.getTime()) || (props.max && end > props.max.getTime())) {
      return t('dateRangePicker.outOfBounds')
    }
    return ''
  })

  const apply = (): void => {
    if (draftError.value || !draftValue.value) {
      showError.value = true
      return
    }
    if (draftZone.value !== zone.value) timeZone.value = draftZone.value
    model.value = draftValue.value
    close()
  }

  const step = (direction: -1 | 1): void => {
    if (props.disabled) return
    const next = stepDateRange(model.value, direction, clock())
    if (next) model.value = next
  }

  const resolvedNow = computed(() => resolveDateRange(model.value, clock()))

  const canStepBack = computed<boolean>(() => {
    const range = resolvedNow.value
    if (!range || props.disabled) return false
    if (!props.min) return true
    const span = range.end.getTime() - range.start.getTime()
    return range.start.getTime() - span >= props.min.getTime()
  })

  const canStepForward = computed<boolean>(() => {
    const range = resolvedNow.value
    if (!range || props.disabled || model.value?.type === 'relative') return false
    const span = range.end.getTime() - range.start.getTime()
    const limit = props.max ?? clock()
    return range.end.getTime() + span <= limit.getTime()
  })

  const selectDay = (date: Date): void => {
    const range = asRange(draftRange.value)
    if (!range.start || range.end) {
      draftRange.value = { start: withTime(date, null, false), end: null }
    } else if (startOfDay(date) < startOfDay(range.start)) {
      draftRange.value = {
        start: withTime(date, null, false),
        end: withTime(range.start, range.start, true)
      }
    } else {
      draftRange.value = { start: range.start, end: withTime(date, null, true) }
    }
  }

  const selectValue = (_event: Event, value: Date | CalendarRange): void => {
    const range = value instanceof Date ? { start: value, end: value } : value
    draftRange.value = { start: range.start, end: range.end }
  }

  const setEndpoint = (which: 'start' | 'end', date: Date | null): void => {
    draftRange.value =
      which === 'start'
        ? { start: date, end: draftRange.value.end }
        : { start: draftRange.value.start, end: date }
  }

  const setZone = (next: string): void => {
    const previous = draftZone.value
    const { start, end } = draftRange.value
    draftRange.value = {
      start: start ? toWallClock(fromWallClock(start, previous), next) : null,
      end: end ? toWallClock(fromWallClock(end, previous), next) : null
    }
    draftZone.value = next
  }

  provide(CalendarInjectionKey, {
    testId: testId.value,
    mode: computed(() => 'range' as const),
    size: computed(() => props.size),
    disabled: computed(() => props.disabled),
    min: minWall,
    max: maxWall,
    showTime: computed(() => true),
    horizontal: computed(() => false),
    draft: computed<CalendarValue>(() => draftRange.value),
    hasSelection: computed(() => Boolean(draftRange.value.start || draftRange.value.end)),
    timezone: computed(() => draftZone.value),
    timezones: computed(() => props.timeZones),
    selectDay,
    selectValue,
    setEndpoint,
    clear: () => {
      draftRange.value = { start: null, end: null }
    },
    setTimezone: setZone,
    changeMonth: () => undefined
  })

  const modeOptions = computed(() => [
    { label: t('dateRangePicker.relative'), value: 'relative' },
    { label: t('dateRangePicker.absolute'), value: 'absolute' }
  ])

  const setPanelMode = (value: string | undefined): void => {
    if (value === 'relative' || value === 'absolute') {
      panelMode.value = value
      showError.value = false
    }
  }

  const isOpenRef = computed(() => isOpen.value)

  const { resolvedPlacement, panelStyle } = usePlacement({
    triggerRef,
    panelRef,
    isOpen: isOpenRef,
    placement: 'bottom-start',
    offset: 6,
    autoPlacements: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    onDismiss: () => setOpen(false)
  })

  useFocusTrap(panelRef, isOpenRef)

  const onDocumentMousedown = (event: MouseEvent): void => {
    const target = event.target as Node | null
    if (!target || !isOpen.value) return
    if (!triggerRef.value?.contains(target) && !panelRef.value?.contains(target)) setOpen(false)
  }

  const onPanelKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
  }

  watch(
    () => props.disabled,
    (disabled) => {
      if (disabled) setOpen(false)
    }
  )

  onMounted(() => {
    globalThis.document?.addEventListener('mousedown', onDocumentMousedown)
  })

  onBeforeUnmount(() => {
    globalThis.document?.removeEventListener('mousedown', onDocumentMousedown)
  })

  const portalLocale = usePortalLocale()
</script>

<template>
  <div
    v-bind="rootAttrs"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-size="size"
    :data-disabled="disabled || null"
    class="inline-flex max-w-full"
  >
    <span
      ref="triggerRef"
      :data-disabled="disabled || null"
      class="inline-flex max-w-full items-stretch overflow-hidden rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) transition-colors duration-150 ease-out [&:not(:focus-within):not([data-disabled])]:hover:border-(--border-strong) data-[disabled]:cursor-not-allowed data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) motion-reduce:transition-none"
    >
      <button
        v-if="showStep"
        type="button"
        :disabled="!canStepBack"
        :aria-label="t('dateRangePicker.previous')"
        :data-size="size"
        :data-testid="`${testId}__previous`"
        class="inline-flex shrink-0 items-center justify-center border-e border-(--border-default) px-(--spacing-xs) text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset disabled:cursor-not-allowed disabled:text-(--text-disabled) data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 motion-reduce:transition-none"
        @click="step(-1)"
      >
        <i
          class="pi pi-chevron-left text-[length:inherit] leading-none rtl:-scale-x-100"
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        data-part="trigger"
        :disabled="disabled"
        :data-size="size"
        :data-empty="!triggerText || null"
        :data-testid="`${testId}__trigger`"
        :aria-label="`${ariaLabel || t('dateRangePicker.label')}: ${triggerText || placeholder || t('dateRangePicker.placeholder')}`"
        aria-haspopup="dialog"
        :aria-expanded="isOpen"
        class="text-label-sm inline-flex min-w-0 flex-1 items-center gap-(--spacing-xs) px-(--spacing-sm) text-(--text-default) transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset disabled:cursor-not-allowed disabled:text-(--text-disabled) data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 data-[empty]:text-(--text-muted) motion-reduce:transition-none"
        @click="setOpen(!isOpen)"
      >
        <i
          :class="model?.type === 'absolute' ? 'pi pi-calendar' : 'pi pi-clock'"
          class="shrink-0 text-[length:inherit] leading-none text-(--text-muted)"
          aria-hidden="true"
        />
        <span class="min-w-0 flex-1 truncate text-start tabular-nums"
          ><bdi>{{ triggerText || placeholder || t('dateRangePicker.placeholder') }}</bdi></span
        >
        <i
          :data-state="isOpen ? 'open' : 'closed'"
          class="pi pi-chevron-down shrink-0 text-[length:inherit] leading-none text-(--text-muted) transition-transform duration-150 ease-out data-[state=open]:rotate-180 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </button>
      <button
        v-if="showStep"
        type="button"
        :disabled="!canStepForward"
        :aria-label="t('dateRangePicker.next')"
        :data-size="size"
        :data-testid="`${testId}__next`"
        class="inline-flex shrink-0 items-center justify-center border-s border-(--border-default) px-(--spacing-xs) text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset disabled:cursor-not-allowed disabled:text-(--text-disabled) data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 motion-reduce:transition-none"
        @click="step(1)"
      >
        <i
          class="pi pi-chevron-right text-[length:inherit] leading-none rtl:-scale-x-100"
          aria-hidden="true"
        />
      </button>
    </span>

    <Teleport to="body">
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      >
        <div
          v-if="isOpen"
          ref="panelRef"
          :dir="portalLocale.dir"
          :lang="portalLocale.lang"
          role="dialog"
          :aria-label="t('dateRangePicker.dialog')"
          :data-testid="`${testId}__popover`"
          :data-state="isOpen ? 'open' : 'closed'"
          :data-placement="resolvedPlacement"
          :data-size="size"
          :style="panelStyle"
          class="flex max-w-[min(90vw,24rem)] flex-col overflow-x-hidden overflow-y-auto rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) shadow-(--shadow-sm) outline-none [transform-origin:var(--popup-origin,top_left)] [--input-ring-offset:var(--bg-surface-raised)]"
          @keydown="onPanelKeydown"
        >
          <div
            v-if="offersRelative && offersAbsolute"
            class="border-b border-(--border-default) p-(--spacing-sm)"
          >
            <ToggleGroup
              :model-value="panelMode"
              :options="modeOptions"
              :aria-label="t('dateRangePicker.rangeType')"
              :data-testid="`${testId}__mode`"
              size="small"
              fluid
              @update:model-value="setPanelMode"
            />
          </div>

          <fieldset
            v-if="panelMode === 'relative'"
            class="m-0 flex min-w-0 flex-col gap-(--spacing-xxs) border-0 p-(--spacing-sm)"
            :data-testid="`${testId}__relative`"
          >
            <legend class="text-label-sm mb-(--spacing-xxs) p-0 text-(--text-muted)">
              {{ t('dateRangePicker.quickRanges') }}
            </legend>
            <label
              v-for="option in relativeOptions"
              :key="option.key"
              :data-selected="draftKey === option.key || null"
              :data-testid="`${testId}__option`"
              class="text-label-sm flex min-h-8 cursor-pointer items-center justify-between gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs) text-(--text-default) transition-colors duration-150 ease-out hover:bg-(--bg-hover) has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-(--ring-color) data-[selected]:bg-(--bg-selected) motion-reduce:transition-none pointer-coarse:min-h-11"
            >
              <input
                v-model="draftKey"
                type="radio"
                :name="`${uid}-relative`"
                :value="option.key"
                class="sr-only"
              />
              <span class="min-w-0 truncate">{{ optionLabel(option) }}</span>
              <i
                v-if="draftKey === option.key"
                class="pi pi-check shrink-0 text-[length:inherit] leading-none text-(--text-muted)"
                aria-hidden="true"
              />
            </label>
            <label
              :data-selected="draftKey === CUSTOM || null"
              :data-testid="`${testId}__option`"
              class="text-label-sm flex min-h-8 cursor-pointer items-center justify-between gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs) text-(--text-default) transition-colors duration-150 ease-out hover:bg-(--bg-hover) has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-(--ring-color) data-[selected]:bg-(--bg-selected) motion-reduce:transition-none pointer-coarse:min-h-11"
            >
              <input
                v-model="draftKey"
                type="radio"
                :name="`${uid}-relative`"
                :value="CUSTOM"
                class="sr-only"
              />
              <span class="min-w-0 truncate">{{ t('dateRangePicker.custom') }}</span>
              <i
                v-if="draftKey === CUSTOM"
                class="pi pi-check shrink-0 text-[length:inherit] leading-none text-(--text-muted)"
                aria-hidden="true"
              />
            </label>
            <div
              v-if="draftKey === CUSTOM"
              class="flex items-end gap-(--spacing-xs) pt-(--spacing-xs)"
            >
              <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
                <label
                  :for="customAmountId"
                  class="text-label-sm text-(--text-muted)"
                  >{{ t('dateRangePicker.amount') }}</label
                >
                <Input
                  :id="customAmountId"
                  v-model="customAmount"
                  type="number"
                  :size="size"
                  :invalid="showError && !!draftError"
                  :aria-describedby="showError && draftError ? errorId : undefined"
                  :data-testid="`${testId}__amount`"
                />
              </div>
              <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
                <label
                  :for="customUnitId"
                  class="text-label-sm text-(--text-muted)"
                  >{{ t('dateRangePicker.unit') }}</label
                >
                <span class="relative inline-flex w-full items-center">
                  <select
                    :id="customUnitId"
                    v-model="customUnit"
                    :data-size="size"
                    :data-testid="`${testId}__unit`"
                    class="text-label-sm w-full appearance-none rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) ps-(--spacing-sm) pe-(--spacing-lg) text-(--text-default) transition-colors duration-150 ease-out [&:not(:focus)]:hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface-raised) data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 motion-reduce:transition-none"
                  >
                    <option
                      v-for="unit in DATE_RANGE_UNITS"
                      :key="unit"
                      :value="unit"
                    >
                      {{ unitLabel(unit) }}
                    </option>
                  </select>
                  <i
                    class="pi pi-chevron-down pointer-events-none absolute end-(--spacing-sm) text-[length:inherit] leading-none text-(--text-muted)"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </div>
          </fieldset>

          <div
            v-else
            class="flex flex-col"
            :data-testid="`${testId}__absolute`"
          >
            <div class="p-(--spacing-sm)">
              <CalendarGrid />
            </div>
            <div class="border-t border-(--border-default) p-(--spacing-sm)">
              <CalendarFields />
            </div>
          </div>

          <div
            class="flex flex-col gap-(--spacing-sm) border-t border-(--border-default) p-(--spacing-sm)"
          >
            <CalendarTimezone v-if="showTimeZone && panelMode === 'absolute'" />
            <p
              v-if="showError && draftError"
              :id="errorId"
              role="alert"
              :data-testid="`${testId}__error`"
              class="text-body-sm m-0 text-(--danger-contrast)"
            >
              {{ draftError }}
            </p>
            <div class="flex items-center justify-end gap-(--spacing-xs)">
              <Button
                :label="t('dateRangePicker.cancel')"
                kind="transparent"
                :size="size"
                :data-testid="`${testId}__cancel`"
                @click="close"
              />
              <Button
                :label="t('dateRangePicker.apply')"
                kind="primary"
                :size="size"
                :data-testid="`${testId}__apply`"
                @click="apply"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
