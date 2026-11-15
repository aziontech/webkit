<script setup lang="ts">
  import { computed, onBeforeUnmount, provide, ref, useAttrs, watch } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { useFocusTrap } from '../../../composables/use-focus-trap'
  import { usePortalLocale, useTranslate } from '../../../composables/use-locale/use-translate'
  import { usePlacement } from '../../../composables/use-placement'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import DatePickerFields from './date-picker-fields/date-picker-fields.vue'
  import DatePickerGrid from './date-picker-grid/date-picker-grid.vue'
  import { asSingle, formatValueLabel, withTime } from './format'
  import {
    DatePickerInjectionKey,
    type DatePickerMonth,
    type DatePickerOrientation,
    type DatePickerRange,
    type DatePickerSize,
    type DatePickerValue
  } from './injection-key'

  defineOptions({
    name: 'DatePicker',
    inheritAttrs: false
  })

  interface Props {
    /** Size token; affects the trigger, day-cell hit-area, and typography. */
    size?: DatePickerSize
    /** Earliest selectable date; earlier days render disabled. */
    min?: Date
    /** Latest selectable date; later days render disabled. */
    max?: Date
    /** Disables the trigger, grid, and all controls, applying disabled tokens. */
    disabled?: boolean
    /** Marks the trigger invalid: sets aria-invalid and the danger border. An enclosing Field's invalid sets it too. */
    invalid?: boolean
    /** Initial open state of the popover when uncontrolled (v-model:open unbound). */
    defaultOpen?: boolean
    /** Trigger text shown when there is no selection. Empty uses the locale catalog (`Select a date`). */
    placeholder?: string
    /** Shows the date field (and the time field with showTime) in the panel. */
    showFields?: boolean
    /** Shows a time field beside the date field, so the value carries a time of day. */
    showTime?: boolean
    /** Places the fields and Apply column below the calendar (vertical) or beside it (horizontal). */
    orientation?: DatePickerOrientation
    /** Accessible name of the trigger; the current value is appended. Empty uses the Field label or the trigger text. */
    ariaLabel?: string
    /** Shows a clear control on the trigger that empties the committed selection. */
    clearable?: boolean
    /** Stages edits in a draft and requires Apply to commit; when false, every edit commits immediately. */
    showApply?: boolean
    /** Renders the trigger as a split control with a separate chevron affordance. */
    split?: boolean
  }
  export type DatePickerProps = Props

  const props = withDefaults(defineProps<Props>(), {
    size: 'medium',
    min: undefined,
    max: undefined,
    disabled: false,
    invalid: false,
    defaultOpen: false,
    placeholder: '',
    showFields: true,
    showTime: false,
    orientation: 'vertical',
    ariaLabel: '',
    clearable: false,
    showApply: true,
    split: false
  })

  const emit = defineEmits<{
    'month-change': [value: DatePickerMonth]
    apply: [event: Event, value: DatePickerValue]
  }>()

  /** Committed date for v-model, or null. Only updated on Apply (or immediately when showApply is false). */
  const model = defineModel<DatePickerValue>({ default: null })

  /** Controlled open state of the popover (v-model:open); omit for uncontrolled, seeded by defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  /** IANA time zone the trigger formats the value in (v-model:time-zone). Empty resolves to the local zone. */
  const timeZone = defineModel<string>('timeZone', { default: '' })

  defineSlots<{
    trigger(props: { open: boolean; value: DatePickerValue; displayValue: string }): unknown
    footer(): unknown
  }>()

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ datePicker: en.datePicker })
  const placeholderText = computed(() => props.placeholder || t('datePicker.placeholder'))

  const field = useFieldControl({
    invalid: () => props.invalid,
    disabled: () => props.disabled
  })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-date-picker')

  const isDisabled = computed(() => field.disabled.value)
  const isHorizontal = computed(() => props.orientation === 'horizontal')

  const triggerRef = ref<globalThis.HTMLElement | null>(null)
  const panelRef = ref<globalThis.HTMLElement | null>(null)

  const isOpen = computed(() => openModel.value ?? props.defaultOpen)
  const isOpenRef = computed(() => isOpen.value)

  const setOpen = (value: boolean) => {
    if (value && isDisabled.value) {
      return
    }
    openModel.value = value
  }

  const toggleOpen = () => setOpen(!isOpen.value)

  const cloneValue = (value: DatePickerValue): DatePickerValue => {
    const date = asSingle(value)
    return date ? new Date(date.getTime()) : null
  }

  const draft = ref<DatePickerValue>(cloneValue(model.value))
  const draftRef = computed(() => draft.value)

  watch(isOpen, (open) => {
    if (open) {
      draft.value = cloneValue(model.value)
    }
  })

  const commitIfImmediate = () => {
    if (props.showApply) {
      return
    }
    model.value = cloneValue(draft.value)
    if (asSingle(draft.value)) {
      setOpen(false)
    }
  }

  const selectDay = (date: Date) => {
    if (isDisabled.value) {
      return
    }
    draft.value = withTime(date, asSingle(draft.value), false)
    commitIfImmediate()
  }

  const selectValue = (_event: Event, value: Date | DatePickerRange) => {
    if (isDisabled.value) {
      return
    }
    const date = value instanceof Date ? value : (value.start ?? value.end ?? null)
    draft.value = date ? new Date(date.getTime()) : null
    commitIfImmediate()
  }

  const setEndpoint = (_which: 'start' | 'end', date: Date | null) => {
    if (isDisabled.value) {
      return
    }
    draft.value = date
    commitIfImmediate()
  }

  const clearDraft = () => {
    if (isDisabled.value) {
      return
    }
    draft.value = null
    commitIfImmediate()
  }

  const changeMonth = (month: DatePickerMonth) => {
    emit('month-change', month)
  }

  const hasSelection = computed<boolean>(() => asSingle(draft.value) !== null)

  const applySelection = (event: Event) => {
    if (isDisabled.value) {
      return
    }
    model.value = cloneValue(draft.value)
    emit('apply', event, cloneValue(draft.value))
    setOpen(false)
  }

  const clearCommitted = () => {
    if (isDisabled.value) {
      return
    }
    model.value = null
    draft.value = null
  }

  const displayValue = computed(() =>
    formatValueLabel(model.value, 'single', timeZone.value, locale.value)
  )
  const hasCommitted = computed(() => displayValue.value !== '')
  const triggerText = computed(() => displayValue.value || placeholderText.value)

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

  const onDocumentMousedown = (event: globalThis.MouseEvent) => {
    const target = event.target as globalThis.Node | null
    if (!target) {
      return
    }
    if (isOpen.value && !triggerRef.value?.contains(target) && !panelRef.value?.contains(target)) {
      setOpen(false)
    }
  }

  const onPanelKeydown = (event: globalThis.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      triggerRef.value?.querySelector<globalThis.HTMLElement>('button')?.focus()
    }
  }

  watch(
    isOpen,
    (open) => {
      if (open) globalThis.document?.addEventListener('mousedown', onDocumentMousedown)
      else globalThis.document?.removeEventListener('mousedown', onDocumentMousedown)
    },
    { immediate: true }
  )

  onBeforeUnmount(() => {
    globalThis.document?.removeEventListener('mousedown', onDocumentMousedown)
  })

  provide(DatePickerInjectionKey, {
    testId: testId.value,
    mode: computed<'single'>(() => 'single'),
    size: computed(() => props.size),
    disabled: isDisabled,
    min: computed(() => props.min),
    max: computed(() => props.max),
    showTime: computed(() => props.showTime),
    horizontal: isHorizontal,
    draft: draftRef,
    hasSelection,
    timezone: computed(() => timeZone.value),
    timezones: computed<string[]>(() => []),
    selectDay,
    selectValue,
    setEndpoint,
    clear: clearDraft,
    setTimezone: (value: string) => {
      timeZone.value = value
    },
    changeMonth
  })

  const portalLocale = usePortalLocale()
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-state="isOpen ? 'open' : 'closed'"
    :data-size="size"
    :data-disabled="isDisabled || null"
    :data-invalid="field.invalid.value || null"
    class="inline-flex max-w-full"
  >
    <span
      ref="triggerRef"
      class="inline-flex max-w-full"
    >
      <slot
        name="trigger"
        :open="isOpen"
        :value="model"
        :display-value="displayValue"
      >
        <span
          :data-size="size"
          :data-state="isOpen ? 'open' : 'closed'"
          :data-disabled="isDisabled || null"
          :data-invalid="field.invalid.value || null"
          class="inline-flex w-(--container-3xs) max-w-full items-stretch overflow-hidden rounded-(--shape-elements) border border-(--border-input) bg-(--bg-surface) transition-colors duration-150 ease-out [&:not(:focus-within):not([data-disabled])]:hover:border-(--border-strong) data-[invalid]:border-(--danger-border) data-[disabled]:cursor-not-allowed data-[disabled]:bg-(--bg-disabled) data-[disabled]:text-(--text-disabled) motion-reduce:transition-none"
        >
          <button
            type="button"
            :disabled="isDisabled"
            :data-size="size"
            :data-empty="!hasCommitted || null"
            :data-testid="`${testId}__trigger`"
            :id="field.controlId.value"
            :aria-label="ariaLabel ? `${ariaLabel}: ${triggerText}` : undefined"
            :aria-describedby="field.describedBy.value"
            :aria-invalid="field.invalid.value || undefined"
            aria-haspopup="dialog"
            :aria-expanded="isOpen"
            class="text-label-sm inline-flex min-w-0 flex-1 items-center gap-(--spacing-xs) px-(--spacing-sm) text-(--text-default) transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) disabled:cursor-not-allowed disabled:text-(--text-disabled) data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 data-[empty]:text-(--text-muted) motion-reduce:transition-none"
            @click="toggleOpen"
          >
            <i
              class="ai ai-calendar shrink-0 text-[length:inherit] leading-none text-(--text-muted)"
              aria-hidden="true"
            />
            <span class="min-w-0 flex-1 truncate text-start">{{ triggerText }}</span>
            <i
              v-if="!split && !(clearable && hasCommitted)"
              :data-state="isOpen ? 'open' : 'closed'"
              class="ai ai-chevron-down shrink-0 text-[length:inherit] leading-none text-(--text-muted) transition-transform duration-150 ease-out data-[state=open]:rotate-180 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </button>

          <button
            v-if="clearable && hasCommitted"
            type="button"
            :disabled="isDisabled"
            :aria-label="t('datePicker.clear')"
            :data-testid="`${testId}__clear-trigger`"
            class="inline-flex shrink-0 items-center justify-center px-(--spacing-xs) text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
            @click="clearCommitted"
          >
            <i
              class="ai ai-x text-[length:inherit] leading-none"
              aria-hidden="true"
            />
          </button>

          <button
            v-if="split"
            type="button"
            :disabled="isDisabled"
            :aria-label="t('datePicker.open')"
            :aria-expanded="isOpen"
            :data-testid="`${testId}__split`"
            class="inline-flex shrink-0 items-center justify-center border-s border-(--border-input) px-(--spacing-xs) text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
            @click="toggleOpen"
          >
            <i
              :data-state="isOpen ? 'open' : 'closed'"
              class="ai ai-chevron-down text-[length:inherit] leading-none transition-transform duration-150 ease-out data-[state=open]:rotate-180 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </button>
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
          :dir="portalLocale.dir"
          :lang="portalLocale.lang"
          ref="panelRef"
          role="dialog"
          :aria-label="t('datePicker.chooseDate')"
          :data-testid="`${testId}__popover`"
          :data-state="isOpen ? 'open' : 'closed'"
          :data-placement="resolvedPlacement"
          :style="panelStyle"
          class="flex max-w-[min(90vw,44rem)] flex-col overflow-x-hidden overflow-y-auto rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) shadow-(--shadow-sm) outline-none [transform-origin:var(--popup-origin,top_left)]"
          @keydown="onPanelKeydown"
        >
          <div
            class="flex items-stretch"
            :data-horizontal="isHorizontal || null"
            :class="isHorizontal ? 'flex-row' : 'flex-col'"
          >
            <div class="p-(--spacing-sm)">
              <DatePickerGrid />
            </div>

            <div
              :data-size="size"
              class="flex flex-col gap-(--spacing-sm) p-(--spacing-sm)"
              :class="
                isHorizontal
                  ? 'min-w-(--container-3xs) border-s border-(--border-default)'
                  : 'border-t border-(--border-default) data-[size=small]:max-w-[calc(7*var(--size-8)_+_2*var(--spacing-sm))] data-[size=medium]:max-w-[calc(7*var(--size-9)_+_2*var(--spacing-sm))] data-[size=large]:max-w-[calc(7*var(--size-10)_+_2*var(--spacing-sm))]'
              "
            >
              <DatePickerFields v-if="showFields" />

              <span
                v-if="$slots['footer']"
                class="inline-flex items-center gap-(--spacing-xs)"
              >
                <slot name="footer" />
              </span>

              <Button
                v-if="showApply"
                :label="t('datePicker.apply')"
                kind="outlined"
                :size="size"
                :disabled="isDisabled"
                icon="ai ai-arrow-down-left"
                class="w-full justify-center"
                :data-testid="`${testId}__apply`"
                @click="applySelection"
              />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
