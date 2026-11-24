<script setup lang="ts">
  import { computed, ref, useAttrs, useId } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Button from '../../action/button/button.vue'
  import ToggleGroup from '../../action/toggle-group/toggle-group.vue'
  import Checkbox from '../checkbox/checkbox.vue'
  import DatePickerControl from '../date-picker/parts/date-picker-control.vue'
  import DatePickerControlButton from '../date-picker/parts/date-picker-control-button.vue'
  import DatePickerFields from '../date-picker/parts/date-picker-fields.vue'
  import DatePickerGrid from '../date-picker/parts/date-picker-grid.vue'
  import DatePickerPopover from '../date-picker/parts/date-picker-popover.vue'
  import DatePickerTrigger from '../date-picker/parts/date-picker-trigger.vue'
  import { useDateRangeClock } from './composables/use-date-range-clock'
  import { useDateRangeDraft } from './composables/use-date-range-draft'
  import { provideDateRangeGrid } from './composables/use-date-range-grid'
  import { useDateRangeOpen } from './composables/use-date-range-open'
  import { useDateRangeTrigger } from './composables/use-date-range-trigger'
  import {
    type DateRangeDuration,
    type DateRangeValue,
    DEFAULT_RELATIVE_OPTIONS,
    type RelativeOption,
    toWallClock
  } from './date-range'
  import { relativeFits } from './lib/range-bounds'
  import {
    type DateRangePanel,
    editAmount,
    editUnit,
    emptyPanel,
    pickOption,
    resetPanel,
    setPanelMode,
    setUntilNow,
    showAbsoluteView,
    showCustom,
    showQuick
  } from './lib/range-panel'
  import DateRangeFooter from './parts/date-range-footer.vue'
  import DateRangeRelative from './parts/date-range-relative.vue'

  export type {
    DateRangeDuration,
    DateRangeRefreshUnit,
    DateRangeUnit,
    DateRangeValue,
    RelativeOption
  } from './date-range'

  export type DateRangePickerSize = 'small' | 'medium' | 'large'
  type RangeSelectorMode = 'default' | 'relative-only' | 'absolute-only'

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

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'date-range-picker'
  )
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const uid = useId()
  const offersRelative = computed(() => props.rangeSelectorMode !== 'absolute-only')
  const offersRefresh = computed(() => props.showRefresh && offersRelative.value)
  const { zone, resolveOptions, bounds } = useDateRangeClock(props, timeZone, {
    seconds: refreshInterval,
    active: () => offersRefresh.value && !isDisabled.value,
    onTick: () => emit('refresh')
  })

  const offersAbsolute = computed(() => props.rangeSelectorMode !== 'relative-only')
  const controlEl = ref<InstanceType<typeof DatePickerControl> | null>(null)

  const availableOptions = computed<RelativeOption[]>(() =>
    props.relativeOptions.filter((option) =>
      relativeFits(option, bounds.now(), bounds.min(), props.maxDuration, resolveOptions.value)
    )
  )
  const panel = ref<DateRangePanel>(emptyPanel())
  const nowWall = (): Date => toWallClock(bounds.now(), panel.value.zone)

  const { isOpen, triggerEl, setOpen, close, onPopoverClose } = useDateRangeOpen(
    openModel,
    props,
    isDisabled,
    controlEl,
    () =>
      resetPanel(panel.value, {
        value: model.value,
        available: availableOptions.value,
        offersRelative: offersRelative.value,
        offersAbsolute: offersAbsolute.value,
        zone: zone.value,
        refresh: refreshInterval.value,
        now: bounds.now(),
        options: resolveOptions.value
      })
  )

  provideDateRangeGrid(props, panel, testId.value, isOpen, isDisabled, bounds)
  const { parsedAmount, draftValue, draftError, visibleError } = useDateRangeDraft(
    panel,
    availableOptions,
    props,
    { t, locale },
    bounds
  )

  const apply = (): void => {
    const value = draftValue.value
    if (draftError.value || !value) {
      panel.value.showError = true
      return
    }
    if (panel.value.zone !== zone.value) timeZone.value = panel.value.zone
    if (offersRefresh.value && panel.value.refresh !== refreshInterval.value) {
      refreshInterval.value = panel.value.refresh
    }
    model.value = value
    close()
  }

  const { triggerParts, triggerText, triggerLabel, step, canStepBack, canStepForward } =
    useDateRangeTrigger(
      model,
      props,
      { t, locale, refresh: () => (offersRefresh.value ? refreshInterval.value : 0) },
      { disabled: isDisabled, zone },
      resolveOptions,
      bounds
    )

  const modeOptions = computed(() => [
    { label: t('dateRangePicker.relative'), value: 'relative' },
    { label: t('dateRangePicker.absolute'), value: 'absolute' }
  ])

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
        :aria-label="ariaLabel || !field.field ? triggerLabel : undefined"
        :aria-describedby="
          [field.describedBy.value, field.required.value && field.field?.requiredId]
            .filter(Boolean)
            .join(' ') || undefined
        "
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
          :model-value="panel.mode"
          :options="modeOptions"
          :aria-label="t('dateRangePicker.rangeType')"
          :data-testid="`${testId}__mode`"
          :size="size"
          fluid
          @update:model-value="setPanelMode(panel, $event)"
        />
      </div>

      <DateRangeRelative
        v-if="panel.mode === 'relative'"
        :uid="uid"
        :test-id="testId"
        :size="size"
        :panel-class="PANEL_BODY_CLASS"
        :view="panel.view"
        :options="availableOptions"
        :quick-rows="Math.max(1, Math.ceil(availableOptions.length / 2))"
        :draft-key="panel.key"
        :offers-absolute="offersAbsolute"
        :custom-amount="panel.amount"
        :custom-unit="panel.unit"
        :parsed-amount="parsedAmount"
        :invalid="panel.showError && !!draftError"
        :described-by="panel.showError && draftError ? `${uid}-error` : ''"
        @pick="pickOption(panel, relativeOptions, $event)"
        @custom="showCustom(panel, uid)"
        @quick="showQuick(panel, availableOptions, uid)"
        @amount="editAmount(panel, $event)"
        @unit="editUnit(panel, $event)"
      />
      <div
        v-else
        :data-size="size"
        :data-view="panel.absoluteView"
        :class="PANEL_BODY_CLASS"
        :data-testid="`${testId}__absolute`"
      >
        <div
          v-if="panel.absoluteView === 'calendar'"
          :id="`${uid}-calendar`"
          class="px-(--spacing-sm) pt-(--spacing-sm)"
          :data-testid="`${testId}__calendar`"
        >
          <div class="mx-auto w-fit">
            <DatePickerGrid />
          </div>
        </div>
        <div
          v-else
          :id="`${uid}-fields`"
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
              :id="`${uid}-until-now-check`"
              :model-value="panel.untilNow"
              :data-testid="`${testId}__until-now`"
              @update:model-value="setUntilNow(panel, Boolean($event), nowWall)"
            />
            <label
              :for="`${uid}-until-now-check`"
              class="text-label-sm cursor-pointer text-(--text-default)"
              >{{ t('dateRangePicker.untilNow') }}</label
            >
          </div>
          <Button
            variant="link"
            :label="
              panel.absoluteView === 'calendar'
                ? t('dateRangePicker.enterDates')
                : t('dateRangePicker.showCalendar')
            "
            :icon="panel.absoluteView === 'calendar' ? 'az az-pencil' : 'az az-calendar'"
            :size="size"
            :data-testid="`${testId}__switch-view`"
            class="ms-auto pointer-coarse:min-h-11"
            @click="
              showAbsoluteView(
                panel,
                panel.absoluteView === 'calendar' ? 'fields' : 'calendar',
                uid
              )
            "
          />
        </div>
      </div>

      <DateRangeFooter
        :uid="uid"
        :test-id="testId"
        :size="size"
        :show-time-zone="showTimeZone"
        :error="visibleError"
        :offers-refresh="offersRefresh"
        :refresh="panel.refresh"
        @refresh="(seconds) => seconds !== undefined && (panel.refresh = seconds)"
        @cancel="close"
        @apply="apply"
      />
    </DatePickerPopover>
  </div>
</template>
