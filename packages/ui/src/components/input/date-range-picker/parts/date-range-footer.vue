<script setup lang="ts">
  import { computed } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Button from '../../../action/button/button.vue'
  import DatePickerTimezone from '../../date-picker/parts/date-picker-timezone.vue'
  import Select from '../../select/select.vue'
  import SelectContent from '../../select/select-content/select-content.vue'
  import SelectItem from '../../select/select-item/select-item.vue'
  import SelectTrigger from '../../select/select-trigger/select-trigger.vue'
  import { REFRESH_INTERVALS } from '../date-range'
  import type { DateRangePickerSize } from '../date-range-picker.vue'
  import { intervalText } from '../lib/range-text'

  defineOptions({ name: 'DateRangeFooter', inheritAttrs: false })

  const props = defineProps<{
    uid: string
    testId: string
    size: DateRangePickerSize
    showTimeZone: boolean
    error: string
    offersRefresh: boolean
    refresh: number
  }>()

  const emit = defineEmits<{
    refresh: [seconds: number | undefined]
    cancel: []
    apply: []
  }>()

  const { t, locale } = useTranslate({ dateRangePicker: en.dateRangePicker })

  const choices = computed<number[]>(() => {
    const list = [0, ...REFRESH_INTERVALS]
    const current = props.refresh
    return current > 0 && !list.includes(current) ? [...list, current].sort((a, b) => a - b) : list
  })
</script>

<template>
  <div
    class="flex shrink-0 flex-col gap-(--spacing-sm) border-t border-(--border-default) p-(--spacing-sm)"
  >
    <DatePickerTimezone v-if="showTimeZone" />
    <p
      v-if="error"
      :id="`${uid}-error`"
      role="alert"
      :data-testid="`${testId}__error`"
      class="text-body-sm m-0 text-(--danger-foreground)"
    >
      {{ error }}
    </p>
    <div class="flex items-center justify-end gap-(--spacing-xs)">
      <Select
        v-if="offersRefresh"
        :model-value="refresh"
        variant="ghost"
        :size="size"
        :aria-label="t('dateRangePicker.refreshEvery')"
        :data-testid="`${testId}__refresh-select`"
        class="me-auto min-w-0"
        @update:model-value="emit('refresh', $event)"
      >
        <SelectTrigger
          :id="`${uid}-refresh`"
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
            v-for="seconds in choices"
            :key="seconds"
            :value="seconds"
            >{{ intervalText(t, locale, seconds) }}</SelectItem
          >
        </SelectContent>
      </Select>
      <Button
        :label="t('dateRangePicker.cancel')"
        variant="ghost"
        :size="size"
        :data-testid="`${testId}__cancel`"
        @click="emit('cancel')"
      />
      <Button
        :label="t('dateRangePicker.apply')"
        variant="primary"
        :size="size"
        :data-testid="`${testId}__apply`"
        @click="emit('apply')"
      />
    </div>
  </div>
</template>
