<script setup lang="ts">
  import { computed, inject, ref, watch } from 'vue'

  import InputText from '../../input-text/input-text.vue'
  import { asRange, asSingle, formatDate, formatTime } from '../format'
  import { CalendarInjectionKey } from '../injection-key'
  import { parseFixedDate } from '../parse-period'

  defineOptions({
    name: 'CalendarFields',
    inheritAttrs: false
  })

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

  const syncFromDraft = () => {
    startDateText.value = startDate.value ? formatDate(startDate.value) : ''
    startTimeText.value = startDate.value ? formatTime(startDate.value) : ''
    endDateText.value = endDate.value ? formatDate(endDate.value) : ''
    endTimeText.value = endDate.value ? formatTime(endDate.value) : ''
  }

  watch(() => ctx?.draft.value, syncFromDraft, { immediate: true, deep: true })

  const parseTime = (text: string): { hours: number; minutes: number } | null => {
    const match = text.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)?$/i)
    if (!match) {
      return null
    }
    let hours = Number(match[1])
    const minutes = Number(match[2])
    const meridiem = match[3]?.toLowerCase()
    if (minutes > 59) {
      return null
    }
    if (meridiem) {
      if (hours < 1 || hours > 12) {
        return null
      }
      if (meridiem === 'pm' && hours !== 12) {
        hours += 12
      }
      if (meridiem === 'am' && hours === 12) {
        hours = 0
      }
    } else if (hours > 23) {
      return null
    }
    return { hours, minutes }
  }

  const commitDate = (which: 'start' | 'end', text: string) => {
    const parsed = parseFixedDate(text)
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
    class="flex flex-col gap-[var(--spacing-sm)]"
    data-testid="input-calendar__fields"
  >
    <div class="flex flex-col gap-[var(--spacing-xxs)]">
      <span class="text-label-sm text-[var(--text-muted)]">
        {{ mode === 'range' ? 'Start' : 'Date' }}
      </span>
      <div class="flex items-center gap-[var(--spacing-xs)]">
        <InputText
          :model-value="startDateText"
          :size="size"
          :disabled="disabled"
          placeholder="Jun 1, 2026"
          class="flex-1"
          @update:model-value="startDateText = $event"
          @change="commitDate('start', startDateText)"
        />
        <InputText
          v-if="showTime"
          :model-value="startTimeText"
          :size="size"
          :disabled="disabled"
          placeholder="09:00 AM"
          class="w-24 shrink-0"
          @update:model-value="startTimeText = $event"
          @change="commitTime('start', startTimeText)"
        />
      </div>
    </div>

    <div
      v-if="mode === 'range'"
      class="flex flex-col gap-[var(--spacing-xxs)]"
    >
      <span class="text-label-sm text-[var(--text-muted)]"> End </span>
      <div class="flex items-center gap-[var(--spacing-xs)]">
        <InputText
          :model-value="endDateText"
          :size="size"
          :disabled="disabled"
          placeholder="Jun 30, 2026"
          class="flex-1"
          @update:model-value="endDateText = $event"
          @change="commitDate('end', endDateText)"
        />
        <InputText
          v-if="showTime"
          :model-value="endTimeText"
          :size="size"
          :disabled="disabled"
          placeholder="05:00 PM"
          class="w-24 shrink-0"
          @update:model-value="endTimeText = $event"
          @change="commitTime('end', endTimeText)"
        />
      </div>
    </div>
  </div>
</template>
