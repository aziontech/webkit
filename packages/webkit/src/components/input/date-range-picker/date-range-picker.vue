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
  import { useFocusTrap } from '../../../composables/use-focus-trap'
  import { useOverlayLayer } from '../../../composables/use-overlay-layer'
  import { usePlacement } from '../../../composables/use-placement'
  import {
    useLocaleContext,
    usePortalLocale,
    useTranslate
  } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import ToggleGroup from '../../action/toggle-group/toggle-group.vue'
  import {
    asRange,
    cityName,
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
  import DatePickerFields from '../date-picker/parts/date-picker-fields.vue'
  import DatePickerGrid from '../date-picker/parts/date-picker-grid.vue'
  import DatePickerTimezone from '../date-picker/parts/date-picker-timezone.vue'
  import Input from '../input/input.vue'
  import Select from '../select/select.vue'
  import SelectContent from '../select/select-content/select-content.vue'
  import SelectItem from '../select/select-item/select-item.vue'
  import SelectTrigger from '../select/select-trigger/select-trigger.vue'
  import Switch from '../switch/switch.vue'
  import {
    DATE_RANGE_UNITS,
    type DateRangeRefreshUnit,
    type DateRangeUnit,
    type DateRangeValue,
    DEFAULT_RELATIVE_OPTIONS,
    endsNow,
    fromWallClock,
    REFRESH_INTERVALS,
    REFRESH_UNITS,
    type RelativeOption,
    resolveDateRange,
    sameRelative,
    stepDateRange,
    toWallClock,
    zoneOffsetLabel
  } from './date-range'

  export type {
    DateRangeRefreshUnit,
    DateRangeUnit,
    DateRangeValue,
    RelativeOption
  } from './date-range'

  export type DateRangePickerSize = 'small' | 'medium' | 'large'
  type RangeSelectorMode = 'default' | 'relative-only' | 'absolute-only'
  type PanelMode = 'relative' | 'absolute'

  defineOptions({
    name: 'DateRangePicker',
    inheritAttrs: false
  })

  export interface DateRangePickerProps {
    /** Quick ranges listed on the Relative tab. */
    relativeOptions?: RelativeOption[]
    /** Zones offered by the selector. Empty falls back to the zones `Intl` supports. */
    timeZones?: string[]
    /** Shows the time zone selector in the panel. Off, the panel names the zone in a read-only line. */
    showTimeZone?: boolean
    /** Shows the start and end time fields of an absolute range. Off, a range covers whole days (a report or billing period). */
    showTime?: boolean
    /** Shows Previous and Next buttons that move the range back or forward by its own length. */
    showStep?: boolean
    /** Shows the Refresh every selector in the panel while it offers relative ranges; bind v-model:refresh-interval and run the query on refresh. */
    showRefresh?: boolean
    /** Which kinds of range the panel offers. */
    rangeSelectorMode?: RangeSelectorMode
    /** Earliest instant an absolute range may start at. */
    min?: Date
    /** Latest instant an absolute range may end at. */
    max?: Date
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
  const refreshLabelId = `${uid}-refresh-label`
  const untilNowLabelId = `${uid}-until-now`
  const refreshId = `${uid}-refresh`

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
      unitDisplay: 'long'
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

  const triggerText = computed<string>(() =>
    [triggerParts.value.text, triggerParts.value.zone].filter(Boolean).join(' ')
  )

  const offersRelative = computed(() => props.rangeSelectorMode !== 'absolute-only')
  const offersAbsolute = computed(() => props.rangeSelectorMode !== 'relative-only')
  const isOpen = computed<boolean>(() => openModel.value ?? props.defaultOpen)
  const triggerEl = ref<HTMLElement | null>(null)
  const panelEl = ref<HTMLElement | null>(null)

  const panelMode = ref<PanelMode>('relative')
  const draftKey = ref<string>('')
  const customAmount = ref<string>('1')
  const customUnit = ref<DateRangeUnit>('hour')
  const draftRange = ref<DatePickerRange>({ start: null, end: null })
  const draftZone = ref<string>('')
  const draftUntilNow = ref(false)
  const draftRefresh = ref<number>(0)
  const showError = ref(false)

  const offersRefresh = computed(() => props.showRefresh && offersRelative.value)

  const refreshChoices = computed<number[]>(() => {
    const current = draftRefresh.value
    const list = [0, ...REFRESH_INTERVALS]
    return current > 0 && !list.includes(current) ? [...list, current].sort((a, b) => a - b) : list
  })

  const editRefresh = (seconds: number | undefined): void => {
    if (seconds !== undefined) draftRefresh.value = seconds
  }

  const CUSTOM = '__custom'

  const quickRows = computed<number>(() => Math.max(1, Math.ceil(props.relativeOptions.length / 2)))

  const resetRefresh = (): void => {
    draftRefresh.value = refreshInterval.value > 0 ? refreshInterval.value : 0
  }

  const resetDraft = (): void => {
    const value = model.value
    draftZone.value = zone.value
    showError.value = false
    draftUntilNow.value = value?.type === 'since'
    resetRefresh()
    if (offersRelative.value && (!value || value.type === 'relative' || !offersAbsolute.value)) {
      panelMode.value = 'relative'
      const option = value
        ? props.relativeOptions.find((item) => sameRelative(value, item))
        : props.relativeOptions[0]
      draftKey.value = option ? option.key : CUSTOM
      customAmount.value = String(value?.type === 'relative' ? value.amount : (option?.amount ?? 1))
      customUnit.value = value?.type === 'relative' ? value.unit : (option?.unit ?? 'hour')
    } else {
      panelMode.value = offersAbsolute.value ? 'absolute' : 'relative'
      const first = props.relativeOptions[0]
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

  const rangeError = computed<string>(() => {
    if (panelMode.value === 'relative') {
      return draftKey.value === CUSTOM && !parsedAmount.value
        ? t('dateRangePicker.invalidAmount')
        : ''
    }
    const value = draftValue.value
    if (value?.type === 'since') {
      const start = new Date(value.start).getTime()
      if (start >= clock().getTime()) return t('dateRangePicker.order')
      return props.min && start < props.min.getTime() ? t('dateRangePicker.outOfBounds') : ''
    }
    if (!value || value.type !== 'absolute') return t('dateRangePicker.incomplete')
    const start = new Date(value.start).getTime()
    const end = new Date(value.end).getTime()
    if (end <= start) return t('dateRangePicker.order')
    if ((props.min && start < props.min.getTime()) || (props.max && end > props.max.getTime())) {
      return t('dateRangePicker.outOfBounds')
    }
    return ''
  })

  const draftError = computed<string>(() => rangeError.value)

  const zoneNote = computed<string>(() => {
    const offset = zoneOffsetLabel(draftZone.value, clock())
    const city = cityName(draftZone.value)
    return city === draftZone.value && !draftZone.value.includes('/')
      ? offset
      : `${offset} · ${city}`
  })

  const visibleError = computed<string>(() => {
    if (showError.value) return draftError.value
    return panelMode.value === 'absolute' &&
      draftValue.value &&
      rangeError.value === t('dateRangePicker.order')
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
    if (!props.min) return true
    const span = range.end.getTime() - range.start.getTime()
    return range.start.getTime() - span >= props.min.getTime()
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
      showError.value = false
    }
  }

  const isOpenRef = computed(() => isOpen.value)

  const { resolvedSide, resolvedAlign, panelStyle } = usePlacement({
    triggerRef: triggerEl,
    panelRef: panelEl,
    isOpen: isOpenRef,
    side: 'bottom',
    align: 'start',
    sideOffset: 6,
    onDismiss: () => setOpen(false)
  })

  useFocusTrap(panelEl, isOpenRef)
  const { isInsideHigherLayer } = useOverlayLayer(isOpenRef, { element: panelEl })

  const onDocumentMousedown = (event: MouseEvent): void => {
    const target = event.target as Node | null
    if (!target || !isOpen.value || isInsideHigherLayer(target)) return
    if (!triggerEl.value?.contains(target) && !panelEl.value?.contains(target)) setOpen(false)
  }

  const onPanelKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape' && !event.defaultPrevented) {
      event.preventDefault()
      close()
    }
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

  onMounted(() => {
    globalThis.document?.addEventListener('mousedown', onDocumentMousedown)
  })

  onBeforeUnmount(() => {
    stopRefresh()
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
    :data-disabled="isDisabled || null"
    :data-invalid="field.invalid.value || null"
    class="inline-flex max-w-full"
  >
    <span
      ref="triggerEl"
      :data-disabled="isDisabled || null"
      :data-invalid="field.invalid.value || null"
      class="inline-flex max-w-full items-stretch overflow-hidden rounded-(--shape-control) border border-(--border-input) bg-(--bg-surface) transition-colors duration-150 ease-out [&:not(:focus-within):not([data-disabled])]:hover:border-(--border-strong) data-[invalid]:border-(--danger-border) data-[disabled]:cursor-not-allowed data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) motion-reduce:transition-none"
    >
      <button
        v-if="showStep"
        type="button"
        :disabled="!canStepBack"
        :aria-label="t('dateRangePicker.previous')"
        :data-size="size"
        :data-testid="`${testId}__previous`"
        class="inline-flex shrink-0 items-center justify-center border-e border-(--border-input) px-(--spacing-xs) text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset disabled:cursor-not-allowed disabled:text-(--text-disabled) data-[size=small]:min-h-7 data-[size=medium]:min-h-8 data-[size=large]:min-h-10 motion-reduce:transition-none pointer-coarse:min-w-11"
        @click="step(-1)"
      >
        <i
          class="az az-chevron-left text-[length:inherit] leading-none rtl:-scale-x-100"
          aria-hidden="true"
        />
      </button>
      <button
        type="button"
        data-slot="date-range-picker-trigger"
        :disabled="isDisabled"
        :data-size="size"
        :data-empty="!triggerText || null"
        :data-testid="`${testId}__trigger`"
        :id="field.controlId.value"
        :aria-label="
          ariaLabel || !field.field
            ? `${ariaLabel || t('dateRangePicker.label')}: ${triggerText || placeholder || t('dateRangePicker.placeholder')}${refreshText ? `, ${refreshText}` : ''}`
            : undefined
        "
        :aria-describedby="field.describedBy.value"
        :aria-invalid="field.invalid.value || undefined"
        aria-haspopup="dialog"
        :aria-expanded="isOpen"
        class="text-label-sm inline-flex min-w-0 flex-1 items-center gap-(--spacing-xs) px-(--spacing-sm) py-(--spacing-2xs) text-(--text-default) transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset disabled:cursor-not-allowed disabled:text-(--text-disabled) data-[size=small]:min-h-7 data-[size=medium]:min-h-8 data-[size=large]:min-h-10 data-[empty]:text-(--text-muted) motion-reduce:transition-none"
        @click="setOpen(!isOpen)"
      >
        <i
          :class="model?.type === 'relative' ? 'az az-clock' : 'az az-calendar'"
          class="shrink-0 text-[length:inherit] leading-none text-(--text-muted)"
          aria-hidden="true"
        />
        <span
          :data-testid="`${testId}__value`"
          class="min-w-0 flex-1 text-start tabular-nums [overflow-wrap:anywhere]"
          ><bdi>{{ triggerParts.text || placeholder || t('dateRangePicker.placeholder') }}</bdi
          ><template v-if="triggerParts.zone"
            >{{ ' '
            }}<span class="whitespace-nowrap text-(--text-muted)">{{
              triggerParts.zone
            }}</span></template
          ></span
        >
        <i
          :data-state="isOpen ? 'open' : 'closed'"
          class="az az-chevron-down shrink-0 text-[length:inherit] leading-none text-(--text-muted) transition-transform duration-150 ease-out data-[state=open]:rotate-180 motion-reduce:transition-none"
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
        class="inline-flex shrink-0 items-center justify-center border-s border-(--border-input) px-(--spacing-xs) text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset disabled:cursor-not-allowed disabled:text-(--text-disabled) data-[size=small]:min-h-7 data-[size=medium]:min-h-8 data-[size=large]:min-h-10 motion-reduce:transition-none pointer-coarse:min-w-11"
        @click="step(1)"
      >
        <i
          class="az az-chevron-right text-[length:inherit] leading-none rtl:-scale-x-100"
          aria-hidden="true"
        />
      </button>
    </span>

    <Teleport to="body">
      <div
        v-if="isOpen"
        aria-hidden="true"
        :data-testid="`${testId}__backdrop`"
        class="fixed inset-0 z-1099 bg-(--bg-backdrop) sm:hidden"
      />
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      >
        <div
          v-if="isOpen"
          ref="panelEl"
          :dir="portalLocale.dir"
          :lang="portalLocale.lang"
          role="dialog"
          :aria-label="t('dateRangePicker.dialog')"
          :data-testid="`${testId}__popover`"
          :data-state="isOpen ? 'open' : 'closed'"
          :data-side="resolvedSide"
          :data-align="resolvedAlign"
          :data-size="size"
          :style="panelStyle"
          class="flex w-min max-w-[calc(100vw-2*var(--spacing-sm))] flex-col overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) shadow-(--shadow-sm) outline-none [transform-origin:var(--popup-origin,top_left)] [--input-ring-offset:var(--bg-surface-raised)] max-sm:inset-x-0! max-sm:top-auto! max-sm:bottom-0! max-sm:w-full! max-sm:max-w-none! max-sm:max-h-[85dvh]! max-sm:translate-none! max-sm:rounded-b-none max-sm:border-x-0 max-sm:border-b-0 max-sm:pb-[env(safe-area-inset-bottom)] max-sm:[transform-origin:bottom_center]"
          @keydown="onPanelKeydown"
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
            class="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain data-[size=small]:w-[calc(7*var(--size-8)_+_2*var(--spacing-sm))] data-[size=medium]:w-[calc(7*var(--size-9)_+_2*var(--spacing-sm))] data-[size=large]:w-[calc(7*var(--size-10)_+_2*var(--spacing-sm))] max-sm:w-full!"
            :data-testid="`${testId}__relative`"
          >
            <fieldset
              class="@container m-0 flex min-w-0 shrink-0 flex-col border-x-0 border-t-0 border-b border-solid border-(--border-default) px-(--spacing-2xs) py-(--spacing-xs)"
              :data-testid="`${testId}__quick`"
            >
              <legend
                :data-testid="`${testId}__legend`"
                class="text-label-sm float-start w-full px-(--spacing-xs) py-(--spacing-2xs) text-(--text-muted)"
              >
                {{ t('dateRangePicker.quickRanges') }}
              </legend>
              <div
                :style="{ '--date-range-picker-quick-rows': quickRows }"
                class="grid grid-cols-1 gap-(--spacing-2xs) @[15rem]:grid-flow-col @[15rem]:grid-cols-2 @[15rem]:grid-rows-[repeat(var(--date-range-picker-quick-rows),auto)]"
              >
                <label
                  v-for="option in relativeOptions"
                  :key="option.key"
                  :data-selected="draftKey === option.key || null"
                  :data-testid="`${testId}__option`"
                  class="text-label-sm flex min-h-8 cursor-pointer items-center justify-between gap-(--spacing-xs) rounded-(--shape-control) px-(--spacing-xs) py-(--spacing-2xs) text-(--text-default) transition-colors duration-150 ease-out hover:bg-(--bg-hover) has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-(--ring-color) has-[:focus-visible]:ring-inset data-[selected]:bg-(--bg-selected) motion-reduce:transition-none pointer-coarse:min-h-11"
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
              role="group"
              :aria-labelledby="customLabelId"
              :data-selected="draftKey === CUSTOM || null"
              :data-testid="`${testId}__custom`"
              class="flex flex-col gap-(--spacing-xs) p-(--spacing-sm)"
            >
              <span
                :id="customLabelId"
                class="text-label-sm text-(--text-muted)"
                >{{ t('dateRangePicker.custom') }}</span
              >
              <div
                class="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] items-end gap-x-(--spacing-xs)"
              >
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
            class="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain data-[size=small]:w-[calc(7*var(--size-8)_+_2*var(--spacing-sm))] data-[size=medium]:w-[calc(7*var(--size-9)_+_2*var(--spacing-sm))] data-[size=large]:w-[calc(7*var(--size-10)_+_2*var(--spacing-sm))] max-sm:w-full!"
            :data-testid="`${testId}__absolute`"
          >
            <div
              class="p-(--spacing-sm)"
              :data-testid="`${testId}__calendar`"
            >
              <div class="mx-auto w-fit">
                <DatePickerGrid />
              </div>
            </div>
            <div
              class="flex flex-col gap-(--spacing-sm) border-t border-(--border-default) p-(--spacing-sm)"
              :data-testid="`${testId}__bounds`"
            >
              <DatePickerFields />
              <div
                v-if="offersRelative"
                class="flex items-center gap-(--spacing-xs)"
              >
                <Switch
                  :model-value="draftUntilNow"
                  :aria-labelledby="untilNowLabelId"
                  :data-testid="`${testId}__until-now`"
                  @update:model-value="setUntilNow"
                />
                <span
                  :id="untilNowLabelId"
                  class="text-label-sm text-(--text-default)"
                  >{{ t('dateRangePicker.untilNow') }}</span
                >
              </div>
            </div>
          </div>

          <div
            v-if="offersRefresh"
            class="grid shrink-0 grid-cols-[minmax(0,1fr)_minmax(0,2fr)] items-center gap-x-(--spacing-xs) border-t border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
            :data-testid="`${testId}__refresh`"
          >
            <span
              :id="refreshLabelId"
              class="text-label-sm min-w-0 text-(--text-default) [overflow-wrap:anywhere]"
              >{{ t('dateRangePicker.refreshEvery') }}</span
            >
            <Select
              :model-value="draftRefresh"
              :size="size"
              :aria-labelledby="refreshLabelId"
              :data-testid="`${testId}__refresh-select`"
              @update:model-value="editRefresh"
            >
              <SelectTrigger
                :id="refreshId"
                :data-testid="`${testId}__refresh-interval`"
                class="pointer-coarse:h-11"
              />
              <SelectContent :data-testid="`${testId}__refresh-list`">
                <SelectItem
                  v-for="seconds in refreshChoices"
                  :key="seconds"
                  :value="seconds"
                  >{{ intervalLabel(seconds) }}</SelectItem
                >
              </SelectContent>
            </Select>
          </div>

          <div
            class="flex shrink-0 flex-col gap-(--spacing-sm) border-t border-(--border-default) p-(--spacing-sm)"
          >
            <DatePickerTimezone v-if="showTimeZone" />
            <p
              v-else
              :data-testid="`${testId}__zone`"
              class="text-label-sm m-0 text-(--text-muted)"
            >
              {{ t('dateRangePicker.zoneNote', { zone: zoneNote }) }}
            </p>
            <p
              v-if="visibleError"
              :id="errorId"
              role="alert"
              :data-testid="`${testId}__error`"
              class="text-body-sm m-0 text-(--danger-foreground)"
            >
              {{ visibleError }}
            </p>
            <div
              class="flex items-center justify-end gap-(--spacing-xs) max-sm:*:flex-1 max-sm:*:justify-center"
            >
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
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
