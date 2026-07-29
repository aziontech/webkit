<script setup lang="ts">
  import { computed, inject, ref, useId, watch } from 'vue'

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

  /* Stable ids so each visible label is programmatically bound to its field; the
     time inputs share a row with their date field and carry their own aria-label. */
  const startDateId = useId()
  const startTimeId = useId()
  const endDateId = useId()
  const endTimeId = useId()

  const startLabel = computed(() => (mode.value === 'range' ? 'Start' : 'Date'))
  const startTimeLabel = computed(() => (mode.value === 'range' ? 'Start time' : 'Time'))

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
  <!-- These fields sit on the popover's raised surface, not the canvas, so the
       focus ring's offset has to match it. --input-ring-offset is InputText's hook
       for that; declared once here it inherits to every field below. -->
  <div
    class="flex flex-col gap-[var(--spacing-sm)] [--input-ring-offset:var(--bg-surface-raised)]"
    data-testid="input-calendar__fields"
  >
    <div class="flex flex-col gap-[var(--spacing-xxs)]">
      <label
        :for="startDateId"
        class="text-label-sm text-[var(--text-muted)]"
      >
        {{ startLabel }}
      </label>
      <div class="flex items-center gap-[var(--spacing-xs)]">
        <div class="min-w-0 flex-1">
          <InputText
            :id="startDateId"
            :model-value="startDateText"
            :size="size"
            :disabled="disabled"
            placeholder="Jun 1, 2026"
            @update:model-value="startDateText = $event"
            @change="commitDate('start', startDateText)"
          />
        </div>
        <div
          v-if="showTime"
          class="w-24 shrink-0"
        >
          <InputText
            :id="startTimeId"
            :model-value="startTimeText"
            :size="size"
            :disabled="disabled"
            :aria-label="startTimeLabel"
            placeholder="00:00"
            @update:model-value="startTimeText = $event"
            @change="commitTime('start', startTimeText)"
          />
        </div>
      </div>
    </div>

    <div
      v-if="mode === 'range'"
      class="flex flex-col gap-[var(--spacing-xxs)]"
    >
      <label
        :for="endDateId"
        class="text-label-sm text-[var(--text-muted)]"
      >
        End
      </label>
      <div class="flex items-center gap-[var(--spacing-xs)]">
        <div class="min-w-0 flex-1">
          <InputText
            :id="endDateId"
            :model-value="endDateText"
            :size="size"
            :disabled="disabled"
            placeholder="Jun 30, 2026"
            @update:model-value="endDateText = $event"
            @change="commitDate('end', endDateText)"
          />
        </div>
        <div
          v-if="showTime"
          class="w-24 shrink-0"
        >
          <InputText
            :id="endTimeId"
            :model-value="endTimeText"
            :size="size"
            :disabled="disabled"
            aria-label="End time"
            placeholder="23:59"
            @update:model-value="endTimeText = $event"
            @change="commitTime('end', endTimeText)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
