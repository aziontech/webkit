<script setup lang="ts">
  import { computed, inject, ref, useId, watch } from 'vue'

  import { useLocale } from '../../../../composables/use-locale'
  import * as en from '../../../../i18n/messages/en'
  import Input from '../../input/input.vue'
  import { asRange, asSingle, formatDate, formatTime } from '../format'
  import { CalendarInjectionKey } from '../injection-key'
  import { parseFixedDate, parseTime } from '../parse-period'

  defineOptions({
    name: 'CalendarFields',
    inheritAttrs: false
  })

  const { t, locale } = useLocale({ calendar: en.calendar })

  const ctx = inject(CalendarInjectionKey, null)

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
    mode.value === 'range' ? t('calendar.start') : t('calendar.date')
  )
  const startTimeLabel = computed(() =>
    mode.value === 'range' ? t('calendar.startTime') : t('calendar.time')
  )

  const syncFromDraft = () => {
    startDateText.value = startDate.value ? formatDate(startDate.value, '', locale.value) : ''
    startTimeText.value = startDate.value ? formatTime(startDate.value, '', locale.value) : ''
    endDateText.value = endDate.value ? formatDate(endDate.value, '', locale.value) : ''
    endTimeText.value = endDate.value ? formatTime(endDate.value, '', locale.value) : ''
  }

  watch([() => ctx?.draft.value, locale], syncFromDraft, { immediate: true, deep: true })

  const placeholderYear = new Date().getFullYear()
  const startDatePlaceholder = computed(() =>
    formatDate(new Date(placeholderYear, 5, 1), '', locale.value)
  )
  const endDatePlaceholder = computed(() =>
    formatDate(new Date(placeholderYear, 5, 30), '', locale.value)
  )
  const startTimePlaceholder = computed(() =>
    formatTime(new Date(placeholderYear, 0, 1, 0, 0), '', locale.value)
  )
  const endTimePlaceholder = computed(() =>
    formatTime(new Date(placeholderYear, 0, 1, 23, 59), '', locale.value)
  )

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
    const time = parseTime(text)
    const base = which === 'start' ? startDate.value : endDate.value
    if (!time || !base) {
      syncFromDraft()
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
    data-testid="input-calendar__fields"
  >
    <div class="flex flex-col gap-(--spacing-xxs)">
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
            :placeholder="startDatePlaceholder"
            @update:model-value="startDateText = $event"
            @change="commitDate('start', startDateText)"
          />
        </div>
        <div
          v-if="showTime"
          class="w-24 shrink-0"
        >
          <Input
            :model-value="startTimeText"
            :size="size"
            :disabled="disabled"
            :aria-label="startTimeLabel"
            :placeholder="startTimePlaceholder"
            @update:model-value="startTimeText = $event"
            @change="commitTime('start', startTimeText)"
          />
        </div>
      </div>
    </div>

    <div
      v-if="mode === 'range'"
      class="flex flex-col gap-(--spacing-xxs)"
    >
      <label
        :for="endDateId"
        class="text-label-sm text-(--text-muted)"
      >
        {{ t('calendar.end') }}
      </label>
      <div class="flex items-center gap-(--spacing-xs)">
        <div class="min-w-0 flex-1">
          <Input
            :id="endDateId"
            :model-value="endDateText"
            :size="size"
            :disabled="disabled"
            :placeholder="endDatePlaceholder"
            @update:model-value="endDateText = $event"
            @change="commitDate('end', endDateText)"
          />
        </div>
        <div
          v-if="showTime"
          class="w-24 shrink-0"
        >
          <Input
            :model-value="endTimeText"
            :size="size"
            :disabled="disabled"
            :aria-label="t('calendar.endTime')"
            :placeholder="endTimePlaceholder"
            @update:model-value="endTimeText = $event"
            @change="commitTime('end', endTimeText)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
