<script setup lang="ts">
  import { computed, inject, onMounted, ref } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import { cityName, defaultTimezones, formatTimezoneLabel, localTimezone } from '../format'
  import { DatePickerInjectionKey } from '../injection-key'

  defineOptions({
    name: 'DatePickerTimezone',
    inheritAttrs: false
  })

  const { t } = useTranslate({ datePicker: en.datePicker })

  const ctx = inject(DatePickerInjectionKey, null)

  const size = computed(() => ctx?.size.value ?? 'medium')
  const disabled = computed(() => ctx?.disabled.value ?? false)

  const mounted = ref(false)
  onMounted(() => {
    mounted.value = true
  })

  const value = computed<string>(
    () => ctx?.timezone.value || (mounted.value ? localTimezone() : '')
  )

  const options = computed<string[]>(() => {
    if (!mounted.value) return [value.value]
    const provided = ctx?.timezones.value ?? []
    return provided.length > 0 ? provided : defaultTimezones()
  })

  const optionLabel = (zone: string): string => {
    const local = t('datePicker.localTimezone')
    if (mounted.value) return formatTimezoneLabel(zone, local)
    return zone ? cityName(zone) : local
  }

  const onChange = (event: globalThis.Event) => {
    const target = event.target as globalThis.HTMLSelectElement
    ctx?.setTimezone(target.value)
  }
</script>

<template>
  <label
    class="flex flex-col gap-(--spacing-2xs)"
    data-testid="input-date-picker__timezone"
  >
    <span class="text-label-sm text-(--text-muted)"> {{ t('datePicker.timezone') }} </span>
    <span class="relative inline-flex w-full items-center">
      <select
        :value="value"
        :disabled="disabled"
        :data-size="size"
        class="text-label-sm w-full appearance-none rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface) ps-(--spacing-sm) pe-(--spacing-lg) text-(--text-default) transition-colors duration-150 ease-out [&:not(:focus):not(:disabled)]:hover:border-(--border-strong) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface-raised) disabled:cursor-not-allowed disabled:bg-(--bg-disabled) disabled:text-(--text-disabled) data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 motion-reduce:transition-none"
        @change="onChange"
      >
        <option
          v-for="zone in options"
          :key="zone"
          :value="zone"
        >
          {{ optionLabel(zone) }}
        </option>
      </select>
      <i
        class="ai ai-chevron-down pointer-events-none absolute end-(--spacing-sm) text-[length:inherit] leading-none text-(--text-muted)"
        aria-hidden="true"
      />
    </span>
  </label>
</template>
