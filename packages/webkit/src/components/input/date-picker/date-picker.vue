<script setup lang="ts">
  import { computed, provide, ref, useAttrs, watch } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import { useDatePickerPanel } from './composables/use-date-picker-panel'
  import { asSingle, formatValueLabel, withTime } from './format'
  import {
    DatePickerInjectionKey,
    type DatePickerMonth,
    type DatePickerOrientation,
    type DatePickerRange,
    type DatePickerSize,
    type DatePickerValue
  } from './injection-key'
  import DatePickerControl from './parts/date-picker-control.vue'
  import DatePickerControlButton from './parts/date-picker-control-button.vue'
  import DatePickerPopover from './parts/date-picker-popover.vue'
  import DatePickerTrigger from './parts/date-picker-trigger.vue'

  defineOptions({
    name: 'DatePicker',
    inheritAttrs: false
  })

  export interface DatePickerProps {
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
  const props = withDefaults(defineProps<DatePickerProps>(), {
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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'date-picker')

  const isDisabled = computed(() => field.disabled.value)
  const isHorizontal = computed(() => props.orientation === 'horizontal')

  const triggerEl = ref<globalThis.HTMLElement | null>(null)

  const isOpen = computed(() => openModel.value ?? props.defaultOpen)

  const setOpen = (value: boolean) => {
    if (value && isDisabled.value) {
      return
    }
    openModel.value = value
  }

  const toggleOpen = () => setOpen(!isOpen.value)

  const { panel, panelOpen } = useDatePickerPanel(isOpen)

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

  const cancelSelection = () => {
    draft.value = cloneValue(model.value)
    setOpen(false)
    triggerEl.value?.querySelector<globalThis.HTMLElement>('button')?.focus()
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

  const onPopoverClose = (event: Event | null) => {
    setOpen(false)
    if (event?.type === 'keydown') {
      triggerEl.value?.querySelector<globalThis.HTMLElement>('button')?.focus()
    }
  }

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

  const FOOTER_CLASS =
    'flex flex-col gap-(--spacing-sm) border-t border-(--border-default) p-(--spacing-sm) ' +
    'data-[size=small]:max-w-[calc(7*var(--size-8)_+_2*var(--spacing-sm))] data-[size=medium]:max-w-[calc(7*var(--size-9)_+_2*var(--spacing-sm))] ' +
    'data-[size=large]:max-w-[calc(7*var(--size-10)_+_2*var(--spacing-sm))] ' +
    'data-[horizontal]:sm:min-w-(--container-3xs) data-[horizontal]:sm:max-w-none data-[horizontal]:sm:border-t-0 data-[horizontal]:sm:border-s'
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
      ref="triggerEl"
      class="inline-flex max-w-full"
    >
      <slot
        name="trigger"
        :open="isOpen"
        :value="model"
        :display-value="displayValue"
      >
        <DatePickerControl
          :data-size="size"
          :data-state="isOpen ? 'open' : 'closed'"
          :data-disabled="isDisabled || null"
          :data-invalid="field.invalid.value || null"
          class="w-(--container-3xs)"
        >
          <DatePickerTrigger
            :id="field.controlId.value"
            :test-id="testId"
            :size="size"
            :disabled="isDisabled"
            :open="isOpen"
            :show-placeholder="!hasCommitted"
            :show-chevron="!split && !(clearable && hasCommitted)"
            :aria-label="ariaLabel ? `${ariaLabel}: ${triggerText}` : undefined"
            :aria-describedby="field.describedBy.value"
            :aria-invalid="field.invalid.value || undefined"
            class="focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)"
            @click="toggleOpen"
            >{{ triggerText }}</DatePickerTrigger
          >

          <DatePickerControlButton
            v-if="clearable && hasCommitted"
            key="clear"
            :disabled="isDisabled"
            :aria-label="t('datePicker.clear')"
            :data-testid="`${testId}__clear-trigger`"
            @click="clearCommitted"
          >
            <i
              class="az az-x text-[length:inherit] leading-none"
              aria-hidden="true"
            />
          </DatePickerControlButton>

          <DatePickerControlButton
            v-if="split"
            key="split"
            :disabled="isDisabled"
            :aria-label="t('datePicker.open')"
            :aria-expanded="isOpen"
            :data-testid="`${testId}__split`"
            class="border-s border-(--border-input)"
            @click="toggleOpen"
          >
            <i
              :data-state="isOpen ? 'open' : 'closed'"
              class="az az-chevron-down text-[length:inherit] leading-none transition-transform duration-150 ease-out data-[state=open]:rotate-180 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </DatePickerControlButton>
        </DatePickerControl>
      </slot>
    </span>

    <DatePickerPopover
      :test-id="testId"
      :open="panelOpen"
      :anchor="triggerEl"
      :aria-label="t('datePicker.chooseDate')"
      class="max-w-[min(calc(100vw-2*var(--spacing-sm)),44rem)] overflow-x-hidden overflow-y-auto overscroll-contain max-sm:items-center"
      @close="onPopoverClose"
    >
      <div
        v-if="panel"
        class="flex flex-col items-stretch data-[horizontal]:sm:flex-row"
        :data-horizontal="isHorizontal || null"
      >
        <div class="p-(--spacing-sm)">
          <component :is="panel.grid" />
        </div>

        <div
          :data-size="size"
          :data-horizontal="isHorizontal || null"
          :class="FOOTER_CLASS"
        >
          <component
            :is="panel.fields"
            v-if="showFields"
          />

          <span
            v-if="$slots['footer']"
            class="inline-flex items-center gap-(--spacing-xs)"
          >
            <slot name="footer" />
          </span>

          <div
            v-if="showApply"
            class="flex items-center justify-end gap-(--spacing-xs)"
          >
            <Button
              :label="t('datePicker.cancel')"
              variant="ghost"
              :size="size"
              :data-testid="`${testId}__cancel`"
              @click="cancelSelection"
            />
            <Button
              :label="t('datePicker.apply')"
              variant="primary"
              :size="size"
              :disabled="isDisabled"
              :data-testid="`${testId}__apply`"
              @click="applySelection"
            />
          </div>
        </div>
      </div>
    </DatePickerPopover>
  </div>
</template>
