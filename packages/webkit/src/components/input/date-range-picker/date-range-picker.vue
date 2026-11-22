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

  import { useFieldControl } from '../../../composables/use-field-control'
  import { useLocaleContext, useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import ToggleGroup from '../../action/toggle-group/toggle-group.vue'
  import Checkbox from '../checkbox/checkbox.vue'
  import {
    asRange,
    formatValueLabel,
    localTimezone,
    startOfDay,
    withTime
  } from '../date-picker/format'
  import {
    type DatePickerDraft,
    DatePickerInjectionKey,
    type DatePickerRange
  } from '../date-picker/injection-key'
  import DatePickerControl from '../date-picker/parts/date-picker-control.vue'
  import DatePickerControlButton from '../date-picker/parts/date-picker-control-button.vue'
  import DatePickerFields from '../date-picker/parts/date-picker-fields.vue'
  import DatePickerGrid from '../date-picker/parts/date-picker-grid.vue'
  import DatePickerPopover from '../date-picker/parts/date-picker-popover.vue'
  import DatePickerTimezone from '../date-picker/parts/date-picker-timezone.vue'
  import DatePickerTrigger from '../date-picker/parts/date-picker-trigger.vue'
  import Input from '../input/input.vue'
  import Select from '../select/select.vue'
  import SelectContent from '../select/select-content/select-content.vue'
  import SelectItem from '../select/select-item/select-item.vue'
  import SelectTrigger from '../select/select-trigger/select-trigger.vue'
  import {
    DATE_RANGE_UNITS,
    type DateRangeDuration,
    type DateRangeRefreshUnit,
    type DateRangeUnit,
    type DateRangeValue,
    DEFAULT_HISTORY_YEARS,
    DEFAULT_RELATIVE_OPTIONS,
    endsNow,
    fromWallClock,
    REFRESH_INTERVALS,
    REFRESH_UNITS,
    type RelativeOption,
    resolveDateRange,
    sameRelative,
    shiftByUnit,
    shiftWallClock,
    stepDateRange,
    toWallClock,
    zoneOffsetLabel
  } from './date-range'

  export type {
    DateRangeDuration,
    DateRangeRefreshUnit,
    DateRangeUnit,
    DateRangeValue,
    RelativeOption
  } from './date-range'

  export type DateRangePickerSize = 'small' | 'medium' | 'large'
  type RangeSelectorMode = 'default' | 'relative-only' | 'absolute-only'
  type PanelMode = 'relative' | 'absolute'
  type RelativeView = 'quick' | 'custom'
  type AbsoluteView = 'calendar' | 'fields'

  defineOptions({
    name: 'DateRangePicker',
    inheritAttrs: false
  })

  export interface DateRangePickerProps {
    /** Quick ranges listed on the Relative tab. */
    relativeOptions?: RelativeOption[]
    /** Zones offered by the selector. Empty falls back to the zones `Intl` supports. */
    timeZones?: string[]
    /** Shows the time zone selector in the panel. Off, the panel says nothing about the zone and the page states it. */
    showTimeZone?: boolean
    /** Shows the start and end time fields of an absolute range. Off, a range covers whole days (a report or billing period). */
    showTime?: boolean
    /** Shows Previous and Next buttons that move the range back or forward by its own length. */
    showStep?: boolean
    /** Shows the Refresh every selector in the panel while it offers relative ranges; bind v-model:refresh-interval and run the query on refresh. */
    showRefresh?: boolean
    /** Which kinds of range the panel offers. */
    rangeSelectorMode?: RangeSelectorMode
    /** Earliest selectable instant. Unset, the start of the day five years before today. */
    min?: Date
    /** Latest selectable instant. Unset, the end of today; pass a later date to allow future dates. */
    max?: Date
    /** Longest range a person may pick, for example 90 days. Unset, any length between min and max. */
    maxDuration?: DateRangeDuration
    /** Reference clock for relative ranges and stepping. Unset uses the nearest ConfigProvider now, then the real clock. */
    now?: Date
    /** Trigger text with no range. Empty uses the locale catalog. */
    placeholder?: string
    /** Accessible name of the trigger. Empty uses the locale catalog. */
    ariaLabel?: string
    /** Disables the trigger and the step buttons. */
    disabled?: boolean
    /** Marks the trigger invalid: sets aria-invalid and the danger border. An enclosing Field's invalid sets it too. */
    invalid?: boolean
    /** Initial open state of the panel when uncontrolled (v-model:open unbound). */
    defaultOpen?: boolean
    /** Size token of the trigger and the panel controls. */
    size?: DateRangePickerSize
  }
  const props = withDefaults(defineProps<DateRangePickerProps>(), {
    relativeOptions: () => DEFAULT_RELATIVE_OPTIONS,
    timeZones: () => [],
    showTimeZone: false,
    showTime: true,
    showStep: false,
    showRefresh: true,
    rangeSelectorMode: 'default',
    min: undefined,
    max: undefined,
    maxDuration: undefined,
    now: undefined,
    placeholder: '',
    ariaLabel: '',
    disabled: false,
    invalid: false,
    defaultOpen: false,
    size: 'medium'
  })

  const emit = defineEmits<{
    /** Fired on every auto-refresh tick while the refresh interval is above 0 and the page is visible. */
    refresh: []
  }>()

  const model = defineModel<DateRangeValue | null>({ default: null })
  const timeZone = defineModel<string>('timeZone', { default: '' })
  /** Controlled open state of the panel (v-model:open); omit for uncontrolled, seeded by defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })
  /** Auto-refresh interval in seconds; 0 turns it off. */
  const refreshInterval = defineModel<number>('refreshInterval', { default: 300 })

  const attrs = useAttrs()
  const field = useFieldControl({
    invalid: () => props.invalid,
    disabled: () => props.disabled
  })
  const isDisabled = computed(() => field.disabled.value)
  const { t, locale } = useTranslate({
    dateRangePicker: en.dateRangePicker,
    datePicker: en.datePicker
  })
  const { context: localeContext } = useLocaleContext()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'date-range-picker'
  )
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const uid = useId()
  const errorId = `${uid}-error`
  const customAmountId = `${uid}-amount`
  const customUnitId = `${uid}-unit`
  const customLabelId = `${uid}-custom`
  const unitLabelId = `${uid}-unit-label`
  const refreshId = `${uid}-refresh`
  const customRangeId = `${uid}-custom-range`
  const calendarId = `${uid}-calendar`
  const fieldsId = `${uid}-fields`
  const untilNowCheckId = `${uid}-until-now-check`

  const mounted = ref(false)
  onMounted(() => {
    mounted.value = true
  })

  const zone = computed<string>(
    () =>
      timeZone.value || localeContext?.timeZone?.value || (mounted.value ? localTimezone() : 'UTC')
  )
  const clock = (): Date => {
    if (props.now) return props.now
    const provided = localeContext?.now?.value
    return provided === undefined ? new Date() : new Date(provided)
  }

  const snapKeys: Partial<
    Record<
      DateRangeUnit,
      | 'dateRangePicker.today'
      | 'dateRangePicker.thisWeek'
      | 'dateRangePicker.thisMonth'
      | 'dateRangePicker.thisYear'
    >
  > = {
    day: 'dateRangePicker.today',
    week: 'dateRangePicker.thisWeek',
    month: 'dateRangePicker.thisMonth',
    year: 'dateRangePicker.thisYear'
  }

  const relativeText = (amount: number, unit: DateRangeUnit, snap = false): string => {
    const snapKey = snap && amount === 1 ? snapKeys[unit] : undefined
    return snapKey ? t(snapKey) : t(`dateRangePicker.${unit}`, { count: amount })
  }

  const optionLabel = (option: RelativeOption): string =>
    option.label || relativeText(option.amount, option.unit, option.snap)

  const resolveOptions = computed(() => ({ timeZone: zone.value, weekStart: 0 }))

  const minBound = (): Date => {
    if (props.min) return props.min
    const today = toWallClock(clock(), zone.value)
    return fromWallClock(
      new Date(today.getFullYear() - DEFAULT_HISTORY_YEARS, today.getMonth(), today.getDate()),
      zone.value
    )
  }

  const maxBound = (): Date => {
    if (props.max) return props.max
    const today = toWallClock(clock(), zone.value)
    return fromWallClock(
      new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999),
      zone.value
    )
  }

  const durationText = (duration: DateRangeDuration): string =>
    new Intl.NumberFormat(locale.value, {
      style: 'unit',
      unit: duration.unit,
      unitDisplay: 'long'
    }).format(duration.amount)

  const relativeFits = (amount: number, unit: DateRangeUnit, snap = false): boolean => {
    const now = clock()
    const range = resolveDateRange(
      { type: 'relative', amount, unit, snap },
      now,
      resolveOptions.value
    )
    if (!range || range.start.getTime() < minBound().getTime()) return false
    const limit = props.maxDuration
    return !limit || range.start.getTime() >= shiftByUnit(now, -limit.amount, limit.unit).getTime()
  }

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

  const UNIT_SECONDS: Record<DateRangeRefreshUnit, number> = { second: 1, minute: 60, hour: 3600 }

  const intervalUnit = (seconds: number): DateRangeRefreshUnit =>
    [...REFRESH_UNITS].reverse().find((item) => seconds % UNIT_SECONDS[item] === 0) ?? 'second'

  const refreshText = computed<string>(() => {
    const seconds = offersRefresh.value ? refreshInterval.value : 0
    if (!seconds || seconds <= 0) return ''
    const unit = intervalUnit(seconds)
    const keys = {
      second: 'dateRangePicker.refreshSecond',
      minute: 'dateRangePicker.refreshMinute',
      hour: 'dateRangePicker.refreshHour'
    } as const
    return t(keys[unit], { count: seconds / UNIT_SECONDS[unit] })
  })

  const intervalLabel = (seconds: number): string => {
    if (seconds <= 0) return t('dateRangePicker.refreshOff')
    const unit = intervalUnit(seconds)
    return new Intl.NumberFormat(locale.value, {
      style: 'unit',
      unit,
      unitDisplay: 'short'
    }).format(seconds / UNIT_SECONDS[unit])
  }

  const triggerParts = computed<{ text: string; zone: string }>(() => {
    const value = model.value
    if (!value) return { text: '', zone: '' }
    if (value.type === 'relative') {
      const option = props.relativeOptions.find((item) => sameRelative(value, item))
      return {
        text: option ? optionLabel(option) : relativeText(value.amount, value.unit, value.snap),
        zone: ''
      }
    }
    const range = resolveDateRange(value, clock())
    if (!range) return { text: '', zone: '' }
    const offset = `(${zoneOffsetLabel(zone.value, range.start)})`
    if (value.type === 'since') {
      const start = { start: toWallClock(range.start, zone.value), end: null }
      return {
        text: `${formatValueLabel(start, 'range', '', locale.value)} ${t('dateRangePicker.now')}`,
        zone: offset
      }
    }
    const wall = {
      start: toWallClock(range.start, zone.value),
      end: toWallClock(range.end, zone.value)
    }
    return { text: formatValueLabel(wall, 'range', '', locale.value), zone: offset }
  })

  const availableOptions = computed<RelativeOption[]>(() =>
    props.relativeOptions.filter((option) => relativeFits(option.amount, option.unit, option.snap))
  )

  const triggerText = computed<string>(() =>
    [triggerParts.value.text, triggerParts.value.zone].filter(Boolean).join(' ')
  )

  const offersRelative = computed(() => props.rangeSelectorMode !== 'absolute-only')
  const offersAbsolute = computed(() => props.rangeSelectorMode !== 'relative-only')
  const isOpen = computed<boolean>(() => openModel.value ?? props.defaultOpen)
  const controlEl = ref<InstanceType<typeof DatePickerControl> | null>(null)
  const triggerEl = computed<HTMLElement | null>(
    () => (controlEl.value?.$el as HTMLElement | undefined) ?? null
  )

  const panelMode = ref<PanelMode>('relative')
  const relativeView = ref<RelativeView>('quick')
  const quickKey = ref<string>('')
  const draftKey = ref<string>('')
  const customAmount = ref<string>('1')
  const customUnit = ref<DateRangeUnit>('hour')
  const draftRange = ref<DatePickerRange>({ start: null, end: null })
  const draftZone = ref<string>('')
  const draftUntilNow = ref(false)
  const draftRefresh = ref<number>(0)
  const showError = ref(false)

  const offersRefresh = computed(() => props.showRefresh && offersRelative.value)
  const absoluteView = ref<AbsoluteView>('calendar')

  const refreshChoices = computed<number[]>(() => {
    const current = draftRefresh.value
    const list = [0, ...REFRESH_INTERVALS]
    return current > 0 && !list.includes(current) ? [...list, current].sort((a, b) => a - b) : list
  })

  const editRefresh = (seconds: number | undefined): void => {
    if (seconds !== undefined) draftRefresh.value = seconds
  }

  const CUSTOM = '__custom'

  const quickRows = computed<number>(() =>
    Math.max(1, Math.ceil(availableOptions.value.length / 2))
  )

  const resetRefresh = (): void => {
    draftRefresh.value = refreshInterval.value > 0 ? refreshInterval.value : 0
  }

  const resetDraft = (): void => {
    const value = model.value
    draftZone.value = zone.value
    showError.value = false
    draftUntilNow.value = value?.type === 'since'
    resetRefresh()
    relativeView.value = 'quick'
    absoluteView.value = 'calendar'
    if (offersRelative.value && (!value || value.type === 'relative' || !offersAbsolute.value)) {
      panelMode.value = 'relative'
      const option = value
        ? availableOptions.value.find((item) => sameRelative(value, item))
        : availableOptions.value[0]
      draftKey.value = option ? option.key : CUSTOM
      customAmount.value = String(value?.type === 'relative' ? value.amount : (option?.amount ?? 1))
      customUnit.value = value?.type === 'relative' ? value.unit : (option?.unit ?? 'hour')
    } else {
      panelMode.value = offersAbsolute.value ? 'absolute' : 'relative'
      const first = availableOptions.value[0]
      draftKey.value = first?.key ?? CUSTOM
      customAmount.value = String(first?.amount ?? 1)
      customUnit.value = first?.unit ?? 'hour'
    }
    const resolved = resolveDateRange(value, clock(), resolveOptions.value)
    draftRange.value = resolved
      ? {
          start: toWallClock(resolved.start, zone.value),
          end: value?.type === 'since' ? null : toWallClock(resolved.end, zone.value)
        }
      : { start: null, end: null }
  }

  const pickOption = (key: string): void => {
    draftKey.value = key
    const option = props.relativeOptions.find((item) => item.key === key)
    if (!option) return
    customAmount.value = String(option.amount)
    customUnit.value = option.unit
  }

  const editCustomAmount = (value: string): void => {
    customAmount.value = value
    draftKey.value = CUSTOM
  }

  const editCustomUnit = (unit: DateRangeUnit | undefined): void => {
    if (!unit) return
    customUnit.value = unit
    draftKey.value = CUSTOM
  }

  const focusIn = (id: string): void => {
    nextTick(() => globalThis.document?.getElementById(id)?.focus())
  }

  const showCustom = (): void => {
    quickKey.value = draftKey.value
    draftKey.value = CUSTOM
    relativeView.value = 'custom'
    showError.value = false
    focusIn(customAmountId)
  }

  const showAbsoluteView = (view: AbsoluteView): void => {
    absoluteView.value = view
    nextTick(() => {
      const target =
        view === 'fields'
          ? globalThis.document?.getElementById(fieldsId)?.querySelector<HTMLElement>('input')
          : globalThis.document
              ?.getElementById(calendarId)
              ?.querySelector<HTMLElement>('[role="grid"] button[tabindex="0"]')
      target?.focus()
    })
  }

  const showQuick = (): void => {
    const option = availableOptions.value.find((item) => item.key === quickKey.value)
    if (
      option &&
      String(option.amount) === customAmount.value &&
      option.unit === customUnit.value
    ) {
      draftKey.value = option.key
    }
    relativeView.value = 'quick'
    showError.value = false
    focusIn(customRangeId)
  }

  const setOpen = (open: boolean): void => {
    if (open && isDisabled.value) return
    if (open === isOpen.value) return
    openModel.value = open
  }

  watch(
    isOpen,
    (open) => {
      if (open) resetDraft()
    },
    { immediate: true, flush: 'sync' }
  )

  const focusTrigger = (): void => {
    triggerEl.value?.querySelector<HTMLElement>('[data-slot="date-range-picker-trigger"]')?.focus()
  }

  const close = (): void => {
    setOpen(false)
    nextTick(focusTrigger)
  }

  const pickingEnd = computed<boolean>(
    () => !draftUntilNow.value && Boolean(draftRange.value.start) && !draftRange.value.end
  )

  const minWall = computed<Date>(() => {
    const floor = toWallClock(minBound(), draftZone.value)
    const limit = props.maxDuration
    if (!isOpen.value || !limit) return floor
    const anchor = draftUntilNow.value
      ? toWallClock(clock(), draftZone.value)
      : pickingEnd.value && draftRange.value.start
        ? shiftWallClock(startOfDay(draftRange.value.start), 1, 'day')
        : null
    if (!anchor) return floor
    const reach = shiftWallClock(anchor, -limit.amount, limit.unit)
    return reach > floor ? reach : floor
  })

  const maxWall = computed<Date>(() => {
    const ceiling = toWallClock(maxBound(), draftZone.value)
    const limit = props.maxDuration
    const start = draftRange.value.start
    if (!isOpen.value || !limit || !pickingEnd.value || !start) return ceiling
    const reach = new Date(
      shiftWallClock(startOfDay(start), limit.amount, limit.unit).getTime() - 1
    )
    return reach < ceiling ? reach : ceiling
  })

  const exceedsDuration = (startWall: Date, endWall: Date): boolean => {
    const limit = props.maxDuration
    return Boolean(limit && endWall > shiftWallClock(startWall, limit.amount, limit.unit))
  }

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
      const option = availableOptions.value.find((item) => item.key === draftKey.value)
      if (!option) return null
      return option.snap
        ? {
            type: 'relative',
            amount: option.amount,
            unit: option.unit,
            key: option.key,
            snap: true
          }
        : { type: 'relative', amount: option.amount, unit: option.unit, key: option.key }
    }
    const { start, end } = draftRange.value
    if (draftUntilNow.value) {
      return start
        ? { type: 'since', start: fromWallClock(start, draftZone.value).toISOString() }
        : null
    }
    if (!start || !end) return null
    return {
      type: 'absolute',
      start: fromWallClock(start, draftZone.value).toISOString(),
      end: fromWallClock(end, draftZone.value).toISOString()
    }
  })

  const tooLongText = computed<string>(() =>
    props.maxDuration
      ? t('dateRangePicker.tooLong', { duration: durationText(props.maxDuration) })
      : ''
  )

  const rangeError = computed<string>(() => {
    if (panelMode.value === 'relative') {
      if (draftKey.value !== CUSTOM) return ''
      if (!parsedAmount.value) return t('dateRangePicker.invalidAmount')
      const now = clock()
      const start = shiftByUnit(now, -parsedAmount.value, customUnit.value).getTime()
      const limit = props.maxDuration
      if (limit && start < shiftByUnit(now, -limit.amount, limit.unit).getTime()) {
        return tooLongText.value
      }
      return start < minBound().getTime() ? t('dateRangePicker.outOfBounds') : ''
    }
    const value = draftValue.value
    if (value?.type === 'since') {
      const start = new Date(value.start).getTime()
      if (start >= clock().getTime()) return t('dateRangePicker.order')
      if (start < minBound().getTime()) return t('dateRangePicker.outOfBounds')
      const wallStart = draftRange.value.start
      return wallStart && exceedsDuration(wallStart, toWallClock(clock(), draftZone.value))
        ? tooLongText.value
        : ''
    }
    if (!value || value.type !== 'absolute') return t('dateRangePicker.incomplete')
    const start = new Date(value.start).getTime()
    const end = new Date(value.end).getTime()
    if (end <= start) return t('dateRangePicker.order')
    if (start < minBound().getTime() || end > maxBound().getTime()) {
      return t('dateRangePicker.outOfBounds')
    }
    const { start: wallStart, end: wallEnd } = draftRange.value
    return wallStart && wallEnd && exceedsDuration(wallStart, wallEnd) ? tooLongText.value : ''
  })

  const draftError = computed<string>(() => rangeError.value)

  const visibleError = computed<string>(() => {
    if (showError.value) return draftError.value
    return panelMode.value === 'absolute' &&
      draftValue.value &&
      (rangeError.value === t('dateRangePicker.order') ||
        (tooLongText.value && rangeError.value === tooLongText.value))
      ? rangeError.value
      : ''
  })

  const apply = (): void => {
    if (draftError.value || !draftValue.value) {
      showError.value = true
      return
    }
    if (draftZone.value !== zone.value) timeZone.value = draftZone.value
    if (offersRefresh.value && draftRefresh.value !== refreshInterval.value) {
      refreshInterval.value = draftRefresh.value
    }
    model.value = draftValue.value
    close()
  }

  const step = (direction: -1 | 1): void => {
    if (isDisabled.value) return
    const next = stepDateRange(model.value, direction, clock(), resolveOptions.value)
    if (next) model.value = next
  }

  const resolvedNow = computed(() => resolveDateRange(model.value, clock(), resolveOptions.value))

  const canStepBack = computed<boolean>(() => {
    const range = resolvedNow.value
    if (!range || isDisabled.value) return false
    const span = range.end.getTime() - range.start.getTime()
    return range.start.getTime() - span >= minBound().getTime()
  })

  const canStepForward = computed<boolean>(() => {
    const range = resolvedNow.value
    if (!range || isDisabled.value || endsNow(model.value)) return false
    const span = range.end.getTime() - range.start.getTime()
    const limit = props.max ?? clock()
    return range.end.getTime() + span <= limit.getTime()
  })

  const selectDay = (date: Date): void => {
    if (draftUntilNow.value) {
      const current = draftRange.value.start
      draftRange.value = { start: withTime(date, current, false), end: null }
      return
    }
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

  const selectValue = (_event: Event, value: Date | DatePickerRange): void => {
    if (draftUntilNow.value) {
      draftRange.value = { start: value instanceof Date ? value : value.start, end: null }
      return
    }
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

  const setUntilNow = (on: boolean): void => {
    draftUntilNow.value = on
    showError.value = false
    if (on) {
      draftRange.value = { start: draftRange.value.start, end: null }
    } else if (draftRange.value.start && !draftRange.value.end) {
      draftRange.value = {
        start: draftRange.value.start,
        end: toWallClock(clock(), draftZone.value)
      }
    }
  }

  provide(DatePickerInjectionKey, {
    testId: testId.value,
    mode: computed(() => (draftUntilNow.value ? ('single' as const) : ('range' as const))),
    size: computed(() => props.size),
    disabled: isDisabled,
    min: minWall,
    max: maxWall,
    showTime: computed(() => props.showTime),
    horizontal: computed(() => false),
    trimWeeks: computed(() => true),
    draft: computed<DatePickerDraft>(() =>
      draftUntilNow.value ? draftRange.value.start : draftRange.value
    ),
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
      relativeView.value = 'quick'
      absoluteView.value = 'calendar'
      showError.value = false
    }
  }

  const onPopoverClose = (event: Event | null): void => {
    if (event?.type === 'keydown') close()
    else setOpen(false)
  }

  watch(
    () => isDisabled.value,
    (disabled) => {
      if (disabled) setOpen(false)
    }
  )

  let refreshTimer: ReturnType<typeof setInterval> | undefined

  const stopRefresh = (): void => {
    if (refreshTimer !== undefined) clearInterval(refreshTimer)
    refreshTimer = undefined
  }

  const startRefresh = (): void => {
    stopRefresh()
    const seconds = offersRefresh.value ? refreshInterval.value : 0
    if (!mounted.value || isDisabled.value || !seconds || seconds <= 0) return
    refreshTimer = setInterval(() => {
      if (globalThis.document?.visibilityState !== 'hidden') emit('refresh')
    }, seconds * 1000)
  }

  watch([refreshInterval, offersRefresh, isDisabled, mounted], startRefresh)

  onBeforeUnmount(stopRefresh)

  const STEP_CLASS =
    'border-(--border-input) focus-visible:ring-inset disabled:cursor-not-allowed disabled:text-(--text-disabled) ' +
    'data-[size=small]:min-h-7 data-[size=medium]:min-h-8 data-[size=large]:min-h-10 pointer-coarse:min-w-11'

  const POPOVER_CLASS =
    'w-min max-w-[calc(100vw-2*var(--spacing-sm))] overflow-hidden [--input-ring-offset:var(--bg-surface-raised)]'

  const PANEL_BODY_CLASS =
    'flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain ' +
    'data-[size=small]:w-[calc(7*var(--size-8)_+_2*var(--spacing-sm))] data-[size=medium]:w-[calc(7*var(--size-9)_+_2*var(--spacing-sm))] ' +
    'data-[size=large]:w-[calc(7*var(--size-10)_+_2*var(--spacing-sm))] ' +
    'max-sm:w-full!'

  const OPTION_CLASS =
    'text-label-sm flex min-h-8 cursor-pointer items-center justify-between gap-(--spacing-xs) rounded-(--shape-control) px-(--spacing-xs) py-(--spacing-2xs) text-(--text-default) ' +
    'transition-colors duration-150 ease-out hover:bg-(--bg-hover) has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-(--ring-color) has-[:focus-visible]:ring-inset ' +
    'data-[selected]:bg-(--bg-selected) ' +
    'motion-reduce:transition-none pointer-coarse:min-h-11'
</script>

<template>
  <div
    v-bind="rootAttrs"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-size="size"
    :data-disabled="isDisabled || null"
    :data-invalid="field.invalid.value || null"
    class="inline-flex max-w-full"
  >
    <DatePickerControl
      ref="controlEl"
      :data-disabled="isDisabled || null"
      :data-invalid="field.invalid.value || null"
    >
      <DatePickerControlButton
        v-if="showStep"
        key="previous"
        :disabled="!canStepBack"
        :aria-label="t('dateRangePicker.previous')"
        :data-size="size"
        :data-testid="`${testId}__previous`"
        class="border-e"
        :class="STEP_CLASS"
        @click="step(-1)"
      >
        <i
          class="az az-chevron-left text-[length:inherit] leading-none rtl:-scale-x-100"
          aria-hidden="true"
        />
      </DatePickerControlButton>
      <DatePickerTrigger
        :id="field.controlId.value"
        :test-id="testId"
        :size="size"
        :disabled="isDisabled"
        :open="isOpen"
        :show-placeholder="!triggerText"
        :icon="model?.type === 'relative' ? 'az az-clock' : 'az az-calendar'"
        data-slot="date-range-picker-trigger"
        :aria-label="
          ariaLabel || !field.field
            ? `${ariaLabel || t('dateRangePicker.label')}: ${triggerText || placeholder || t('dateRangePicker.placeholder')}${refreshText ? `, ${refreshText}` : ''}`
            : undefined
        "
        :aria-describedby="field.describedBy.value"
        :aria-invalid="field.invalid.value || undefined"
        class="focus-visible:ring-inset"
        @click="setOpen(!isOpen)"
        ><bdi>{{ triggerParts.text || placeholder || t('dateRangePicker.placeholder') }}</bdi
        ><template v-if="triggerParts.zone"
          >{{ ' '
          }}<span class="whitespace-nowrap text-(--text-muted)">{{
            triggerParts.zone
          }}</span></template
        ></DatePickerTrigger
      >
      <DatePickerControlButton
        v-if="showStep"
        key="next"
        :disabled="!canStepForward"
        :aria-label="t('dateRangePicker.next')"
        :data-size="size"
        :data-testid="`${testId}__next`"
        class="border-s"
        :class="STEP_CLASS"
        @click="step(1)"
      >
        <i
          class="az az-chevron-right text-[length:inherit] leading-none rtl:-scale-x-100"
          aria-hidden="true"
        />
      </DatePickerControlButton>
    </DatePickerControl>

    <DatePickerPopover
      :test-id="testId"
      :open="isOpen"
      :anchor="triggerEl"
      :aria-label="t('dateRangePicker.dialog')"
      :data-size="size"
      :class="POPOVER_CLASS"
      @close="onPopoverClose"
    >
      <div
        v-if="offersRelative && offersAbsolute"
        class="shrink-0 border-b border-(--border-default) p-(--spacing-sm)"
      >
        <ToggleGroup
          :model-value="panelMode"
          :options="modeOptions"
          :aria-label="t('dateRangePicker.rangeType')"
          :data-testid="`${testId}__mode`"
          :size="size"
          fluid
          @update:model-value="setPanelMode"
        />
      </div>

      <div
        v-if="panelMode === 'relative'"
        :data-size="size"
        :data-view="relativeView"
        :class="PANEL_BODY_CLASS"
        :data-testid="`${testId}__relative`"
      >
        <template v-if="relativeView === 'quick'">
          <fieldset
            v-if="availableOptions.length"
            class="@container m-0 flex min-w-0 shrink-0 flex-col border-0 px-(--spacing-2xs) pt-(--spacing-xs)"
            :data-testid="`${testId}__quick`"
          >
            <legend
              :data-testid="`${testId}__legend`"
              class="text-label-sm float-start w-full px-(--spacing-xs) py-(--spacing-2xs) text-(--text-muted)"
            >
              {{ t('dateRangePicker.quickRanges') }}
            </legend>
            <div
              :style="{
                '--date-range-picker-quick-rows': quickRows
              }"
              class="grid grid-cols-1 gap-(--spacing-2xs) @[15rem]:grid-flow-col @[15rem]:grid-cols-2 @[15rem]:grid-rows-[repeat(var(--date-range-picker-quick-rows),auto)]"
            >
              <label
                v-for="option in availableOptions"
                :key="option.key"
                :data-selected="draftKey === option.key || null"
                :data-testid="`${testId}__option`"
                :class="OPTION_CLASS"
              >
                <input
                  :checked="draftKey === option.key"
                  type="radio"
                  :name="`${uid}-relative`"
                  :value="option.key"
                  :data-autofocus="(!offersAbsolute && draftKey === option.key) || null"
                  class="sr-only"
                  @change="pickOption(option.key)"
                />
                <span class="min-w-0 [overflow-wrap:anywhere]">{{ optionLabel(option) }}</span>
                <i
                  v-if="draftKey === option.key"
                  class="az az-check shrink-0 text-[length:inherit] leading-none text-(--text-default)"
                  aria-hidden="true"
                />
              </label>
            </div>
          </fieldset>

          <div
            class="flex shrink-0 flex-wrap items-center gap-x-(--spacing-xs) gap-y-(--spacing-2xs) px-(--spacing-sm) pt-(--spacing-2xs) pb-(--spacing-sm)"
          >
            <Button
              :id="customRangeId"
              variant="link"
              :label="t('dateRangePicker.custom')"
              icon="az az-sliders-horizontal"
              :size="size"
              :data-selected="draftKey === CUSTOM || null"
              :data-autofocus="(!offersAbsolute && draftKey === CUSTOM) || null"
              :data-testid="`${testId}__custom-range`"
              class="pointer-coarse:min-h-11"
              @click="showCustom"
            />
            <span
              v-if="draftKey === CUSTOM && parsedAmount"
              :data-testid="`${testId}__custom-value`"
              class="text-label-sm min-w-0 text-(--text-muted) [overflow-wrap:anywhere]"
              >{{ relativeText(parsedAmount, customUnit) }}</span
            >
          </div>
        </template>

        <div
          v-else
          role="group"
          :aria-labelledby="customLabelId"
          :data-selected="draftKey === CUSTOM || null"
          :data-testid="`${testId}__custom`"
          class="flex flex-col gap-(--spacing-xs) p-(--spacing-sm)"
        >
          <Button
            variant="link"
            icon="az az-chevron-left"
            :label="t('dateRangePicker.showQuickRanges')"
            :size="size"
            :data-testid="`${testId}__quick-ranges`"
            class="w-fit pointer-coarse:min-h-11"
            @click="showQuick"
          />
          <span
            :id="customLabelId"
            class="text-label-sm text-(--text-default)"
            >{{ t('dateRangePicker.custom') }}</span
          >
          <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] items-end gap-x-(--spacing-xs)">
            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <label
                :for="customAmountId"
                class="text-label-sm text-(--text-default)"
                >{{ t('dateRangePicker.amount') }}</label
              >
              <Input
                :id="customAmountId"
                :model-value="customAmount"
                type="number"
                :size="size"
                :invalid="showError && !!rangeError"
                :aria-describedby="showError && draftError ? errorId : undefined"
                :data-testid="`${testId}__amount`"
                @update:model-value="editCustomAmount"
              />
            </div>
            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <span
                :id="unitLabelId"
                class="text-label-sm text-(--text-default)"
                >{{ t('dateRangePicker.unit') }}</span
              >
              <Select
                :model-value="customUnit"
                :size="size"
                :aria-labelledby="unitLabelId"
                :data-testid="`${testId}__unit-select`"
                @update:model-value="editCustomUnit"
              >
                <SelectTrigger
                  :id="customUnitId"
                  :data-testid="`${testId}__unit`"
                  class="pointer-coarse:h-11"
                />
                <SelectContent :data-testid="`${testId}__unit-list`">
                  <SelectItem
                    v-for="unit in DATE_RANGE_UNITS"
                    :key="unit"
                    :value="unit"
                    >{{ unitLabel(unit) }}</SelectItem
                  >
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        :data-size="size"
        :data-view="absoluteView"
        :class="PANEL_BODY_CLASS"
        :data-testid="`${testId}__absolute`"
      >
        <div
          v-if="absoluteView === 'calendar'"
          :id="calendarId"
          class="px-(--spacing-sm) pt-(--spacing-sm)"
          :data-testid="`${testId}__calendar`"
        >
          <div class="mx-auto w-fit">
            <DatePickerGrid />
          </div>
        </div>
        <div
          v-else
          :id="fieldsId"
          class="px-(--spacing-sm) pt-(--spacing-sm)"
          :data-testid="`${testId}__bounds`"
        >
          <DatePickerFields inline-labels />
        </div>
        <div
          class="flex min-h-8 flex-wrap items-center justify-between gap-x-(--spacing-sm) gap-y-(--spacing-2xs) px-(--spacing-sm) pt-(--spacing-xs) pb-(--spacing-sm)"
        >
          <div
            v-if="offersRelative"
            class="flex items-center gap-(--spacing-xs)"
          >
            <Checkbox
              :id="untilNowCheckId"
              :model-value="draftUntilNow"
              :data-testid="`${testId}__until-now`"
              @update:model-value="setUntilNow(Boolean($event))"
            />
            <label
              :for="untilNowCheckId"
              class="text-label-sm cursor-pointer text-(--text-default)"
              >{{ t('dateRangePicker.untilNow') }}</label
            >
          </div>
          <Button
            variant="link"
            :label="
              absoluteView === 'calendar'
                ? t('dateRangePicker.enterDates')
                : t('dateRangePicker.showCalendar')
            "
            :icon="absoluteView === 'calendar' ? 'az az-pencil' : 'az az-calendar'"
            :size="size"
            :data-testid="`${testId}__switch-view`"
            class="ms-auto pointer-coarse:min-h-11"
            @click="showAbsoluteView(absoluteView === 'calendar' ? 'fields' : 'calendar')"
          />
        </div>
      </div>

      <div
        class="flex shrink-0 flex-col gap-(--spacing-sm) border-t border-(--border-default) p-(--spacing-sm)"
      >
        <DatePickerTimezone v-if="showTimeZone" />
        <p
          v-if="visibleError"
          :id="errorId"
          role="alert"
          :data-testid="`${testId}__error`"
          class="text-body-sm m-0 text-(--danger-foreground)"
        >
          {{ visibleError }}
        </p>
        <div class="flex items-center justify-end gap-(--spacing-xs)">
          <Select
            v-if="offersRefresh"
            :model-value="draftRefresh"
            variant="ghost"
            :size="size"
            :aria-label="t('dateRangePicker.refreshEvery')"
            :data-testid="`${testId}__refresh-select`"
            class="me-auto min-w-0"
            @update:model-value="editRefresh"
          >
            <SelectTrigger
              :id="refreshId"
              :data-testid="`${testId}__refresh-interval`"
              class="pointer-coarse:h-11"
            >
              <template #leading>
                <i
                  class="az az-refresh shrink-0 text-[length:inherit] leading-none text-(--text-muted)"
                  aria-hidden="true"
                />
              </template>
            </SelectTrigger>
            <SelectContent :data-testid="`${testId}__refresh-list`">
              <SelectItem
                v-for="seconds in refreshChoices"
                :key="seconds"
                :value="seconds"
                >{{ intervalLabel(seconds) }}</SelectItem
              >
            </SelectContent>
          </Select>
          <Button
            :label="t('dateRangePicker.cancel')"
            variant="ghost"
            :size="size"
            :data-testid="`${testId}__cancel`"
            @click="close"
          />
          <Button
            :label="t('dateRangePicker.apply')"
            variant="primary"
            :size="size"
            :data-testid="`${testId}__apply`"
            @click="apply"
          />
        </div>
      </div>
    </DatePickerPopover>
  </div>
</template>
