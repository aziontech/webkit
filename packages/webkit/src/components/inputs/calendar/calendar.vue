<script setup lang="ts">
  import {
    computed,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
    useAttrs,
    useSlots,
    watch
  } from 'vue'

  import { useFocusTrap } from '../../../composables/use-focus-trap'
  import { usePlacement } from '../../../composables/use-placement'
  import Button from '../../actions/button/button.vue'
  import CalendarFields from './calendar-fields/calendar-fields.vue'
  import CalendarGrid from './calendar-grid/calendar-grid.vue'
  import CalendarPeriod from './calendar-period/calendar-period.vue'
  import CalendarTimezone from './calendar-timezone/calendar-timezone.vue'
  import {
    asRange,
    asSingle,
    formatValueLabel,
    formatWindowLabel,
    startOfDay,
    withTime
  } from './format'
  import {
    CalendarInjectionKey,
    type CalendarMode,
    type CalendarMonth,
    type CalendarPresetItem,
    type CalendarRange,
    type CalendarSize,
    type CalendarValue
  } from './injection-key'

  defineOptions({
    name: 'Calendar',
    inheritAttrs: false
  })

  interface Props {
    /** Committed selection for v-model. A Date (or null) in single mode; a range in range mode. Only updated on Apply (or immediately when showApply is false). */
    modelValue?: CalendarValue
    /** Selection mode. Single picks one date; range picks a start and end date. */
    mode?: CalendarMode
    /** Size token; affects the trigger, day-cell hit-area, and typography. */
    size?: CalendarSize
    /** Earliest selectable date; earlier days render disabled. */
    min?: Date
    /** Latest selectable date; later days render disabled. */
    max?: Date
    /** Disables the trigger, grid, and all controls, applying disabled tokens. */
    disabled?: boolean
    /** Controlled open state of the popover (v-model:open); omit for uncontrolled. */
    open?: boolean
    /** Trigger text shown when there is no selection. */
    placeholder?: string
    /** Data-driven shortcuts rendered in the presets rail; each is { label, value }. */
    presets?: CalendarPresetItem[]
    /** Shows Start/End time fields alongside the date fields. */
    showTime?: boolean
    /** Shows the timezone selector below the fields. */
    showTimezone?: boolean
    /** Selected IANA timezone for display formatting (v-model:timezone). Empty resolves to the local zone. */
    timezone?: string
    /** Timezone options for the selector; empty falls back to a curated list derived from Intl. */
    timezones?: string[]
    /** Lays the fields/apply column beside the calendar instead of below it. */
    horizontal?: boolean
    /** Shows a clear control on the trigger that empties the committed selection. */
    clearable?: boolean
    /** Stages edits in a draft and requires Apply to commit; when false, every edit commits immediately. */
    showApply?: boolean
    /** Enables the Select Period relative-time mode (relative-preset list + parsed text input). */
    period?: boolean
    /** Renders the trigger as a split control with a separate chevron affordance. */
    split?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    mode: 'range',
    size: 'medium',
    min: undefined,
    max: undefined,
    disabled: false,
    open: undefined,
    placeholder: 'Select a Date Range',
    presets: () => [],
    showTime: false,
    showTimezone: false,
    timezone: '',
    timezones: () => [],
    horizontal: false,
    clearable: false,
    showApply: true,
    period: false,
    split: false
  })

  const emit = defineEmits<{
    'update:modelValue': [value: CalendarValue]
    'update:open': [value: boolean]
    'update:timezone': [value: string]
    'month-change': [value: CalendarMonth]
    apply: [value: CalendarValue]
  }>()

  defineSlots<{
    trigger(props: { open: boolean; value: CalendarValue; displayValue: string }): unknown
    presets(): unknown
    footer(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-calendar')

  const triggerRef = ref<globalThis.HTMLElement | null>(null)
  const panelRef = ref<globalThis.HTMLElement | null>(null)
  const presetsTriggerRef = ref<globalThis.HTMLElement | null>(null)
  const presetsPanelRef = ref<globalThis.HTMLElement | null>(null)

  /* ---- open state (controlled / uncontrolled) ---- */
  const internalOpen = ref(false)
  const internalPresetsOpen = ref(false)
  const isOpen = computed(() => (props.open !== undefined ? props.open : internalOpen.value))
  const isOpenRef = computed(() => isOpen.value)

  const setOpen = (value: boolean) => {
    if (value && props.disabled) {
      return
    }
    // The two-part trigger's dropdowns are mutually exclusive.
    if (value) {
      internalPresetsOpen.value = false
    }
    if (props.open === undefined) {
      internalOpen.value = value
    }
    emit('update:open', value)
  }

  const toggleOpen = () => setOpen(!isOpen.value)

  /* ---- presets menu (left segment of the two-part trigger) ---- */
  const isPresetsOpen = computed(() => internalPresetsOpen.value)
  const isPresetsOpenRef = computed(() => isPresetsOpen.value)

  const setPresetsOpen = (value: boolean) => {
    if (value && props.disabled) {
      return
    }
    if (value) {
      setOpen(false)
    }
    internalPresetsOpen.value = value
  }

  const togglePresets = () => setPresetsOpen(!isPresetsOpen.value)

  /* ---- timezone state (controlled / uncontrolled) ---- */
  const internalTimezone = ref(props.timezone)
  const timezoneValue = computed(() => props.timezone || internalTimezone.value)
  const setTimezone = (value: string) => {
    internalTimezone.value = value
    emit('update:timezone', value)
  }
  watch(
    () => props.timezone,
    (value) => {
      if (value) {
        internalTimezone.value = value
      }
    }
  )

  /* ---- draft (staged selection) ---- */
  const emptyValue = (): CalendarValue =>
    props.mode === 'range' ? { start: null, end: null } : null

  const cloneValue = (value: CalendarValue): CalendarValue => {
    if (value instanceof Date) {
      return new Date(value.getTime())
    }
    if (value && typeof value === 'object') {
      return {
        start: value.start ? new Date(value.start.getTime()) : null,
        end: value.end ? new Date(value.end.getTime()) : null
      }
    }
    return emptyValue()
  }

  const draft = ref<CalendarValue>(cloneValue(props.modelValue))
  const draftRef = computed(() => draft.value)

  /* The relative token of the committed period (e.g. `45m`). Set when a period is
     applied, cleared on any non-period commit or clear, so the trigger only shows
     the two-line period display while a period selection is actually live. */
  const committedPeriodLabel = ref('')

  const resetDraft = () => {
    draft.value = cloneValue(props.modelValue)
  }

  watch(isOpen, (open) => {
    if (open) {
      resetDraft()
    }
  })

  const isComplete = (value: CalendarValue): boolean => {
    if (props.mode === 'range') {
      const range = asRange(value)
      return Boolean(range.start && range.end)
    }
    return asSingle(value) !== null
  }

  const commitIfImmediate = () => {
    if (props.showApply) {
      return
    }
    emit('update:modelValue', cloneValue(draft.value))
    if (isComplete(draft.value)) {
      setOpen(false)
    }
  }

  const selectDay = (date: Date) => {
    if (props.disabled) {
      return
    }
    if (props.mode === 'range') {
      const range = asRange(draft.value)
      if (!range.start || range.end) {
        draft.value = { start: withTime(date, null, false), end: null }
      } else if (startOfDay(date) < startOfDay(range.start)) {
        draft.value = {
          start: withTime(date, null, false),
          end: withTime(range.start, range.start, true)
        }
      } else {
        draft.value = { start: range.start, end: withTime(date, null, true) }
      }
    } else {
      draft.value = withTime(date, asSingle(draft.value), false)
    }
    commitIfImmediate()
  }

  const selectValue = (value: Date | CalendarRange, periodLabel?: string) => {
    if (props.disabled) {
      return
    }
    if (props.mode === 'range') {
      const range = value instanceof Date ? { start: value, end: value } : value
      draft.value = {
        start: range.start ? new Date(range.start.getTime()) : null,
        end: range.end ? new Date(range.end.getTime()) : null
      }
    } else {
      const date = value instanceof Date ? value : (value.start ?? value.end ?? null)
      draft.value = date ? new Date(date.getTime()) : null
    }
    // Period selections are complete ranges — commit and close immediately.
    if (props.period) {
      committedPeriodLabel.value = periodLabel ?? ''
      emit('update:modelValue', cloneValue(draft.value))
      emit('apply', cloneValue(draft.value))
      setOpen(false)
      return
    }
    committedPeriodLabel.value = ''
    commitIfImmediate()
  }

  /* Left-segment preset selection: applies the consumer-provided range immediately
     (no separate Apply), records its label for the trigger, and closes the menu. */
  const applyPreset = (value: Date | CalendarRange, label: string) => {
    if (props.disabled) {
      return
    }
    if (props.mode === 'range') {
      const range = value instanceof Date ? { start: value, end: value } : value
      draft.value = {
        start: range.start ? new Date(range.start.getTime()) : null,
        end: range.end ? new Date(range.end.getTime()) : null
      }
    } else {
      const date = value instanceof Date ? value : (value.start ?? value.end ?? null)
      draft.value = date ? new Date(date.getTime()) : null
    }
    committedPeriodLabel.value = label
    emit('update:modelValue', cloneValue(draft.value))
    emit('apply', cloneValue(draft.value))
    setPresetsOpen(false)
  }

  const setEndpoint = (which: 'start' | 'end', date: Date | null) => {
    if (props.disabled) {
      return
    }
    if (props.mode === 'range') {
      const range = asRange(draft.value)
      draft.value =
        which === 'start' ? { start: date, end: range.end } : { start: range.start, end: date }
    } else {
      draft.value = date
    }
    commitIfImmediate()
  }

  const clearDraft = () => {
    if (props.disabled) {
      return
    }
    draft.value = emptyValue()
    commitIfImmediate()
  }

  const changeMonth = (month: CalendarMonth) => {
    emit('month-change', month)
  }

  const hasSelection = computed<boolean>(
    () => isComplete(draft.value) || hasAnyEndpoint(draft.value)
  )

  function hasAnyEndpoint(value: CalendarValue): boolean {
    if (props.mode === 'range') {
      const range = asRange(value)
      return Boolean(range.start || range.end)
    }
    return asSingle(value) !== null
  }

  const applySelection = () => {
    if (props.disabled) {
      return
    }
    committedPeriodLabel.value = ''
    emit('update:modelValue', cloneValue(draft.value))
    emit('apply', cloneValue(draft.value))
    setOpen(false)
  }

  const clearCommitted = () => {
    if (props.disabled) {
      return
    }
    committedPeriodLabel.value = ''
    emit('update:modelValue', emptyValue())
    draft.value = emptyValue()
  }

  /* ---- trigger display ---- */
  const displayValue = computed(() =>
    formatValueLabel(props.modelValue, props.mode, timezoneValue.value)
  )
  const hasCommitted = computed(() => displayValue.value !== '')
  const triggerIcon = computed(() => (props.period ? 'pi pi-clock' : 'pi pi-calendar'))
  const triggerText = computed(
    () => displayValue.value || (props.period ? 'Period' : props.placeholder)
  )

  /* A committed period selects a time interval, not whole days: the trigger stacks the
     relative token (`45m`) over the concrete window it resolves to (`14:44 – 23:59`). */
  const isPeriodDisplay = computed(
    () => props.period && committedPeriodLabel.value !== '' && hasCommitted.value
  )
  const windowLabel = computed(() =>
    formatWindowLabel(props.modelValue, props.mode, timezoneValue.value)
  )

  const hasPresets = computed(() => props.presets.length > 0 || Boolean(slots['presets']))

  /* When presets are configured, the trigger splits into two segments: a preset
     dropdown (left) and the calendar (right) — the Vercel-style two-part control. */
  const isTwoPart = computed(() => hasPresets.value && !props.period)
  const presetLabel = computed(() => committedPeriodLabel.value || 'Select Period')
  const rangeText = computed(() => windowLabel.value || props.placeholder)

  /* ---- positioning + focus + dismissal ---- */
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

  const { resolvedPlacement: presetsPlacement, panelStyle: presetsPanelStyle } = usePlacement({
    triggerRef: presetsTriggerRef,
    panelRef: presetsPanelRef,
    isOpen: isPresetsOpenRef,
    placement: 'bottom-start',
    offset: 6,
    autoPlacements: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    onDismiss: () => setPresetsOpen(false)
  })

  useFocusTrap(presetsPanelRef, isPresetsOpenRef)

  const onDocumentMousedown = (event: globalThis.MouseEvent) => {
    const target = event.target as globalThis.Node | null
    if (!target) {
      return
    }
    const insideTrigger = triggerRef.value?.contains(target)
    if (isOpen.value && !insideTrigger && !panelRef.value?.contains(target)) {
      setOpen(false)
    }
    if (isPresetsOpen.value && !insideTrigger && !presetsPanelRef.value?.contains(target)) {
      setPresetsOpen(false)
    }
  }

  const onPanelKeydown = (event: globalThis.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      triggerRef.value?.querySelector<globalThis.HTMLElement>('button')?.focus()
    }
  }

  const onPresetsKeydown = (event: globalThis.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      setPresetsOpen(false)
      presetsTriggerRef.value?.focus()
    }
  }

  onMounted(() => {
    globalThis.document?.addEventListener('mousedown', onDocumentMousedown)
  })

  onBeforeUnmount(() => {
    globalThis.document?.removeEventListener('mousedown', onDocumentMousedown)
  })

  provide(CalendarInjectionKey, {
    testId: testId.value,
    mode: computed(() => props.mode),
    size: computed(() => props.size),
    disabled: computed(() => props.disabled),
    min: computed(() => props.min),
    max: computed(() => props.max),
    showTime: computed(() => props.showTime),
    horizontal: computed(() => props.horizontal),
    draft: draftRef,
    hasSelection,
    timezone: timezoneValue,
    timezones: computed(() => props.timezones),
    selectDay,
    selectValue,
    setEndpoint,
    clear: clearDraft,
    setTimezone,
    changeMonth
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-size="size"
    :data-disabled="disabled || null"
    class="inline-flex"
  >
    <span
      ref="triggerRef"
      class="inline-flex max-w-full"
    >
      <slot
        name="trigger"
        :open="isOpen"
        :value="modelValue"
        :display-value="displayValue"
      >
        <span
          :data-size="size"
          :data-state="isOpen ? 'open' : 'closed'"
          :data-disabled="disabled || null"
          class="inline-flex max-w-full items-stretch overflow-hidden rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)] data-[disabled]:opacity-60"
        >
          <template v-if="isTwoPart">
            <button
              ref="presetsTriggerRef"
              type="button"
              :disabled="disabled"
              :data-size="size"
              :data-testid="`${testId}__presets-trigger`"
              aria-haspopup="menu"
              :aria-expanded="isPresetsOpen"
              class="text-body-sm inline-flex min-w-0 items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] text-[var(--text-default)] transition-colors duration-150 ease-out hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)] data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 motion-reduce:transition-none"
              @click="togglePresets"
            >
              <i
                class="pi pi-clock shrink-0 text-[length:inherit] leading-none text-[var(--text-muted)]"
                aria-hidden="true"
              />
              <span class="min-w-0 truncate text-left">{{ presetLabel }}</span>
              <i
                class="pi pi-chevron-down shrink-0 text-[length:inherit] leading-none text-[var(--text-muted)]"
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              :disabled="disabled"
              :data-size="size"
              :data-empty="!hasCommitted || null"
              :data-testid="`${testId}__trigger`"
              aria-haspopup="dialog"
              :aria-expanded="isOpen"
              class="text-body-sm inline-flex min-w-0 flex-1 items-center gap-[var(--spacing-xs)] border-l border-[var(--border-default)] px-[var(--spacing-sm)] text-[var(--text-default)] transition-colors duration-150 ease-out hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)] data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 data-[empty]:text-[var(--text-muted)] motion-reduce:transition-none"
              @click="toggleOpen"
            >
              <i
                class="pi pi-calendar shrink-0 text-[length:inherit] leading-none text-[var(--text-muted)]"
                aria-hidden="true"
              />
              <span class="min-w-0 flex-1 truncate text-left">{{ rangeText }}</span>
            </button>
          </template>

          <template v-else>
            <button
              v-if="isPeriodDisplay"
              type="button"
              :disabled="disabled"
              :data-size="size"
              :data-testid="`${testId}__trigger`"
              aria-haspopup="dialog"
              :aria-expanded="isOpen"
              class="text-body-sm inline-flex min-w-0 flex-1 items-stretch text-[var(--text-default)] transition-colors duration-150 ease-out hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)] data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 motion-reduce:transition-none"
              @click="toggleOpen"
            >
              <span
                class="flex min-w-0 items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)]"
              >
                <i
                  class="pi pi-clock shrink-0 text-[length:inherit] leading-none text-[var(--text-muted)]"
                  aria-hidden="true"
                />
                <span class="min-w-0 truncate text-left">{{ committedPeriodLabel }}</span>
                <i
                  class="pi pi-chevron-down shrink-0 text-[length:inherit] leading-none text-[var(--text-muted)]"
                  aria-hidden="true"
                />
              </span>
              <span
                class="flex min-w-0 flex-1 items-center gap-[var(--spacing-xs)] border-l border-[var(--border-default)] px-[var(--spacing-sm)]"
              >
                <i
                  class="pi pi-calendar shrink-0 text-[length:inherit] leading-none text-[var(--text-muted)]"
                  aria-hidden="true"
                />
                <span class="min-w-0 flex-1 truncate text-left">{{ windowLabel }}</span>
              </span>
            </button>

            <button
              v-else
              type="button"
              :disabled="disabled"
              :data-size="size"
              :data-empty="!hasCommitted || null"
              :data-testid="`${testId}__trigger`"
              aria-haspopup="dialog"
              :aria-expanded="isOpen"
              class="text-body-sm inline-flex min-w-0 flex-1 items-center gap-[var(--spacing-xs)] px-[var(--spacing-sm)] text-[var(--text-default)] transition-colors duration-150 ease-out hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)] data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 data-[empty]:text-[var(--text-muted)] motion-reduce:transition-none"
              @click="toggleOpen"
            >
              <i
                :class="triggerIcon"
                class="shrink-0 text-[length:inherit] leading-none text-[var(--text-muted)]"
                aria-hidden="true"
              />
              <span class="min-w-0 flex-1 truncate text-left">{{ triggerText }}</span>
              <i
                v-if="!split && !(clearable && hasCommitted)"
                class="pi pi-chevron-down shrink-0 text-[length:inherit] leading-none text-[var(--text-muted)]"
                aria-hidden="true"
              />
            </button>

            <button
              v-if="clearable && hasCommitted"
              type="button"
              :disabled="disabled"
              aria-label="Clear selection"
              :data-testid="`${testId}__clear-trigger`"
              class="inline-flex shrink-0 items-center justify-center px-[var(--spacing-xs)] text-[var(--text-muted)] transition-colors duration-150 ease-out hover:bg-[var(--bg-hover)] hover:text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] motion-reduce:transition-none"
              @click="clearCommitted"
            >
              <i
                class="pi pi-times text-[length:inherit] leading-none"
                aria-hidden="true"
              />
            </button>

            <button
              v-if="split"
              type="button"
              :disabled="disabled"
              aria-label="Open calendar"
              :aria-expanded="isOpen"
              :data-testid="`${testId}__split`"
              class="inline-flex shrink-0 items-center justify-center border-l border-[var(--border-default)] px-[var(--spacing-xs)] text-[var(--text-muted)] transition-colors duration-150 ease-out hover:bg-[var(--bg-hover)] hover:text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] motion-reduce:transition-none"
              @click="toggleOpen"
            >
              <i
                class="pi pi-chevron-down text-[length:inherit] leading-none"
                aria-hidden="true"
              />
            </button>
          </template>
        </span>
      </slot>
    </span>

    <Teleport to="body">
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      >
        <div
          v-if="isOpen"
          ref="panelRef"
          role="dialog"
          aria-label="Choose date"
          :data-testid="`${testId}__popover`"
          :data-state="isOpen ? 'open' : 'closed'"
          :data-placement="resolvedPlacement"
          :style="panelStyle"
          class="flex flex-col overflow-hidden rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] shadow-[var(--shadow-sm)] outline-none [transform-origin:var(--popup-origin,top_left)]"
          @keydown="onPanelKeydown"
        >
          <div
            class="flex items-stretch"
            :data-horizontal="horizontal || null"
            :class="horizontal ? 'flex-row' : 'flex-col'"
          >
            <div class="p-[var(--spacing-sm)]">
              <CalendarPeriod v-if="period" />
              <CalendarGrid v-else />
            </div>

            <div
              v-if="!period"
              class="flex flex-col gap-[var(--spacing-sm)] p-[var(--spacing-sm)]"
              :class="
                horizontal
                  ? 'min-w-[var(--container-3xs)] border-l border-[var(--border-default)]'
                  : 'border-t border-[var(--border-default)]'
              "
            >
              <CalendarFields />

              <span
                v-if="$slots['footer']"
                class="inline-flex items-center gap-[var(--spacing-xs)]"
              >
                <slot name="footer" />
              </span>

              <Button
                v-if="showApply"
                label="Apply Range"
                kind="outlined"
                :size="size"
                :disabled="disabled"
                icon="pi pi-arrow-down-left"
                class="w-full justify-center"
                :data-testid="`${testId}__apply`"
                @click="applySelection"
              />

              <CalendarTimezone v-if="showTimezone" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition
        enter-active-class="animate-popup-scale-in motion-reduce:animate-none"
        leave-active-class="animate-popup-scale-out motion-reduce:animate-none"
      >
        <div
          v-if="isPresetsOpen"
          ref="presetsPanelRef"
          role="menu"
          aria-label="Presets"
          :data-testid="`${testId}__presets-menu`"
          :data-state="isPresetsOpen ? 'open' : 'closed'"
          :data-placement="presetsPlacement"
          :style="presetsPanelStyle"
          class="flex min-w-[var(--container-4xs)] flex-col gap-[var(--spacing-xxs)] rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface-raised)] p-[var(--spacing-sm)] shadow-[var(--shadow-sm)] outline-none [transform-origin:var(--popup-origin,top_left)]"
          @keydown="onPresetsKeydown"
        >
          <slot name="presets">
            <button
              v-for="preset in presets"
              :key="preset.label"
              type="button"
              role="menuitem"
              :disabled="disabled"
              :data-selected="preset.label === committedPeriodLabel || null"
              :data-testid="`${testId}__preset`"
              class="text-body-sm inline-flex w-full items-center justify-between gap-[var(--spacing-xs)] rounded-[var(--shape-elements)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-left text-[var(--text-default)] transition-colors duration-150 ease-out hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface-raised)] data-[selected]:bg-[var(--bg-selected)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)] motion-reduce:transition-none"
              @click="applyPreset(preset.value, preset.label)"
            >
              <span class="min-w-0 truncate">{{ preset.label }}</span>
              <i
                v-if="preset.label === committedPeriodLabel"
                class="pi pi-check shrink-0 text-[length:inherit] leading-none text-[var(--text-muted)]"
                aria-hidden="true"
              />
            </button>
          </slot>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
