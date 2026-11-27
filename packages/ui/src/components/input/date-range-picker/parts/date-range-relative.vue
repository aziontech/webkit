<script setup lang="ts">
  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Button from '../../../action/button/button.vue'
  import NumberInput from '../../number-input/number-input.vue'
  import Select from '../../select/select.vue'
  import SelectContent from '../../select/select-content/select-content.vue'
  import SelectItem from '../../select/select-item/select-item.vue'
  import SelectTrigger from '../../select/select-trigger/select-trigger.vue'
  import { DATE_RANGE_UNITS, type DateRangeUnit, type RelativeOption } from '../date-range'
  import type { DateRangePickerSize } from '../date-range-picker.vue'
  import { CUSTOM } from '../lib/range-draft'
  import { optionText, relativeText, unitText } from '../lib/range-text'

  defineOptions({ name: 'DateRangeRelative', inheritAttrs: false })

  defineProps<{
    uid: string
    testId: string
    size: DateRangePickerSize
    panelClass: string
    view: 'quick' | 'custom'
    options: RelativeOption[]
    quickRows: number
    draftKey: string
    offersAbsolute: boolean
    customAmount: string
    customUnit: DateRangeUnit
    parsedAmount: number | null
    invalid: boolean
    describedBy: string
  }>()

  const emit = defineEmits<{
    pick: [key: string]
    custom: []
    quick: []
    amount: [value: string]
    unit: [unit: DateRangeUnit | undefined]
  }>()

  const { t } = useTranslate({ dateRangePicker: en.dateRangePicker })

  const OPTION_CLASS =
    'text-label-sm flex min-h-8 cursor-pointer items-center justify-between gap-(--spacing-xs) rounded-(--shape-control) px-(--spacing-xs) py-(--spacing-2xs) text-(--text-default) ' +
    'transition-colors duration-150 ease-out hover:bg-(--bg-hover) has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-(--ring-color) has-[:focus-visible]:ring-inset ' +
    'data-[selected]:bg-(--bg-selected) ' +
    'motion-reduce:transition-none pointer-coarse:min-h-11'
</script>

<template>
  <div
    :data-size="size"
    :data-view="view"
    :class="panelClass"
    :data-testid="`${testId}__relative`"
  >
    <template v-if="view === 'quick'">
      <fieldset
        v-if="options.length"
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
            v-for="option in options"
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
              @change="emit('pick', option.key)"
            />
            <span class="min-w-0 [overflow-wrap:anywhere]">{{ optionText(t, option) }}</span>
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
          :id="`${uid}-custom-range`"
          variant="link"
          :label="t('dateRangePicker.custom')"
          icon="az az-sliders-horizontal"
          :size="size"
          :data-selected="draftKey === CUSTOM || null"
          :data-autofocus="(!offersAbsolute && draftKey === CUSTOM) || null"
          :data-testid="`${testId}__custom-range`"
          class="pointer-coarse:min-h-11"
          @click="emit('custom')"
        />
        <span
          v-if="draftKey === CUSTOM && parsedAmount"
          :data-testid="`${testId}__custom-value`"
          class="text-label-sm min-w-0 text-(--text-muted) [overflow-wrap:anywhere]"
          >{{ relativeText(t, parsedAmount, customUnit) }}</span
        >
      </div>
    </template>

    <div
      v-else
      role="group"
      :aria-labelledby="`${uid}-custom`"
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
        @click="emit('quick')"
      />
      <span
        :id="`${uid}-custom`"
        class="text-label-sm text-(--text-default)"
        >{{ t('dateRangePicker.custom') }}</span
      >
      <div class="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] items-end gap-x-(--spacing-xs)">
        <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <label
            :for="`${uid}-amount`"
            class="text-label-sm text-(--text-default)"
            >{{ t('dateRangePicker.amount') }}</label
          >
          <NumberInput
            :id="`${uid}-amount`"
            :model-value="customAmount === '' ? null : Number(customAmount)"
            nullable
            :show-buttons="false"
            :size="size"
            :invalid="invalid"
            :aria-describedby="describedBy || undefined"
            :data-testid="`${testId}__amount`"
            @update:model-value="emit('amount', $event === null ? '' : String($event))"
          />
        </div>
        <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
          <span
            :id="`${uid}-unit-label`"
            class="text-label-sm text-(--text-default)"
            >{{ t('dateRangePicker.unit') }}</span
          >
          <Select
            :model-value="customUnit"
            :size="size"
            :aria-labelledby="`${uid}-unit-label`"
            :data-testid="`${testId}__unit-select`"
            @update:model-value="emit('unit', $event)"
          >
            <SelectTrigger
              :id="`${uid}-unit`"
              :data-testid="`${testId}__unit`"
              class="pointer-coarse:h-11"
            />
            <SelectContent :data-testid="`${testId}__unit-list`">
              <SelectItem
                v-for="unit in DATE_RANGE_UNITS"
                :key="unit"
                :value="unit"
                >{{ unitText(t, unit) }}</SelectItem
              >
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  </div>
</template>
