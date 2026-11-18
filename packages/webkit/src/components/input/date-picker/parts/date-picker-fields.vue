<script setup lang="ts">
  import { computed, inject, nextTick, ref, useId, watch } from 'vue'

  import { useLocaleContext, useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Combobox from '../../combobox/combobox.vue'
  import Input from '../../input/input.vue'
  import { asRange, asSingle, formatDate, formatTime } from '../format'
  import { DatePickerInjectionKey } from '../injection-key'
  import { parseFixedDate, parseTime } from '../parse-period'

  defineOptions({
    name: 'DatePickerFields',
    inheritAttrs: false
  })

  const { t, locale } = useTranslate({ datePicker: en.datePicker })

  const ctx = inject(DatePickerInjectionKey, null)

  const mode = computed(() => ctx?.mode.value ?? 'single')
  const showTime = computed(() => ctx?.showTime.value ?? false)
  const size = computed(() => ctx?.size.value ?? 'medium')
  const disabled = computed(() => ctx?.disabled.value ?? false)

  const startDate = computed<Date | null>(() =>
    mode.value === 'range'
      ? asRange(ctx?.draft.value ?? null).start
      : asSingle(ctx?.draft.value ?? null)
  )
  const endDate = computed<Date | null>(() => asRange(ctx?.draft.value ?? null).end)

  const startDateText = ref('')
  const startTimeText = ref('')
  const endDateText = ref('')
  const endTimeText = ref('')

  const startDateId = useId()
  const endDateId = useId()

  const startLabel = computed(() =>
    mode.value === 'range' ? t('datePicker.start') : t('datePicker.date')
  )
  const startTimeLabel = computed(() =>
    mode.value === 'range' ? t('datePicker.startTime') : t('datePicker.time')
  )

  const syncFromDraft = () => {
    startDateText.value = startDate.value ? formatDate(startDate.value, '', locale.value) : ''
    startTimeText.value = startDate.value ? formatTime(startDate.value, '', locale.value) : ''
    endDateText.value = endDate.value ? formatDate(endDate.value, '', locale.value) : ''
    endTimeText.value = endDate.value ? formatTime(endDate.value, '', locale.value) : ''
  }

  watch([() => ctx?.draft.value, locale], syncFromDraft, { immediate: true, deep: true })

  const { context: localeContext } = useLocaleContext()
  const placeholderYear = new Date(localeContext?.now?.value ?? Date.now()).getFullYear()
  const datePlaceholder = computed(() =>
    t('datePicker.example', {
      value: formatDate(new Date(placeholderYear, 0, 31), '', locale.value)
    })
  )

  const halfHours = computed(() =>
    Array.from({ length: 48 }, (_, index) => ({
      minutes: index * 30,
      value: formatTime(
        new Date(placeholderYear, 0, 1, Math.floor(index / 2), (index % 2) * 30),
        '',
        locale.value
      )
    }))
  )

  const timeOptionsFor = (current: string) => {
    const time = parseTime(current)
    const entries = [...halfHours.value]
    if (time && !entries.some((entry) => entry.value === current)) {
      entries.push({ minutes: time.hours * 60 + time.minutes, value: current })
      entries.sort((a, b) => a.minutes - b.minutes)
    }
    return entries.map(({ value }) => ({ value }))
  }

  const startTimeOptions = computed(() => timeOptionsFor(startTimeText.value))
  const endTimeOptions = computed(() => timeOptionsFor(endTimeText.value))

  const commitDate = (which: 'start' | 'end', text: string) => {
    const parsed = parseFixedDate(text, new Date(), { locale: locale.value })
    if (!parsed) {
      syncFromDraft()
      return
    }
    const existing = which === 'start' ? startDate.value : endDate.value
    const hours = existing ? existing.getHours() : which === 'end' ? 23 : 0
    const minutes = existing ? existing.getMinutes() : which === 'end' ? 59 : 0
    ctx?.setEndpoint(
      which,
      new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), hours, minutes)
    )
  }

  const commitTime = (which: 'start' | 'end', text: string) => {
    if (which === 'start') startTimeText.value = text
    else endTimeText.value = text
    const time = parseTime(text)
    const base = which === 'start' ? startDate.value : endDate.value
    if (!time || !base) {
      nextTick(syncFromDraft)
      return
    }
    ctx?.setEndpoint(
      which,
      new Date(base.getFullYear(), base.getMonth(), base.getDate(), time.hours, time.minutes)
    )
  }
</script>

<template>
  <div
    class="flex flex-col gap-(--spacing-sm) [--input-ring-offset:var(--bg-surface-raised)]"
    data-testid="date-picker__fields"
  >
    <div class="flex flex-col gap-(--spacing-2xs)">
      <label
        :for="startDateId"
        class="text-label-sm text-(--text-muted)"
      >
        {{ startLabel }}
      </label>
      <div class="flex items-center gap-(--spacing-xs)">
        <div class="min-w-0 flex-1">
          <Input
            :id="startDateId"
            :model-value="startDateText"
            :size="size"
            :disabled="disabled"
            :placeholder="datePlaceholder"
            @update:model-value="startDateText = $event"
            @change="commitDate('start', startDateText)"
          />
        </div>
        <div
          v-if="showTime"
          class="w-22 shrink-0"
        >
          <Combobox
            :model-value="startTimeText"
            :options="startTimeOptions"
            icon="az az-clock"
            :size="size"
            :disabled="disabled"
            :aria-label="startTimeLabel"
            :placeholder="t('datePicker.timePlaceholder')"
            data-testid="date-picker__start-time"
            @update:model-value="commitTime('start', $event)"
          />
        </div>
      </div>
    </div>

    <div
      v-if="mode === 'range'"
      class="flex flex-col gap-(--spacing-2xs)"
    >
      <label
        :for="endDateId"
        class="text-label-sm text-(--text-muted)"
      >
        {{ t('datePicker.end') }}
      </label>
      <div class="flex items-center gap-(--spacing-xs)">
        <div class="min-w-0 flex-1">
          <Input
            :id="endDateId"
            :model-value="endDateText"
            :size="size"
            :disabled="disabled"
            :placeholder="datePlaceholder"
            @update:model-value="endDateText = $event"
            @change="commitDate('end', endDateText)"
          />
        </div>
        <div
          v-if="showTime"
          class="w-22 shrink-0"
        >
          <Combobox
            :model-value="endTimeText"
            :options="endTimeOptions"
            icon="az az-clock"
            :size="size"
            :disabled="disabled"
            :aria-label="t('datePicker.endTime')"
            :placeholder="t('datePicker.timePlaceholder')"
            data-testid="date-picker__end-time"
            @update:model-value="commitTime('end', $event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
