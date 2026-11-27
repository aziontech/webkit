<script setup lang="ts">
  import { computed, inject, onMounted, ref, useId } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Combobox from '../../combobox/combobox.vue'
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

  const labelId = useId()

  const optionLabel = (zone: string): string => {
    const local = t('datePicker.localTimezone')
    if (mounted.value) return formatTimezoneLabel(zone, local)
    return zone ? cityName(zone) : local
  }

  const zoneOptions = computed(() =>
    options.value.map((zone) => ({ value: zone, label: optionLabel(zone) }))
  )

  const onPick = (zone: string) => {
    if (zone && zone !== value.value && options.value.includes(zone)) ctx?.setTimezone(zone)
  }
</script>

<template>
  <div
    class="flex flex-col gap-(--spacing-2xs)"
    data-testid="date-picker__timezone"
  >
    <span
      :id="labelId"
      class="text-label-sm text-(--text-muted)"
    >
      {{ t('datePicker.timezone') }}
    </span>
    <Combobox
      :model-value="value"
      :options="zoneOptions"
      icon="az az-globe"
      :size="size"
      :disabled="disabled"
      :allow-custom="false"
      :aria-labelledby="labelId"
      data-testid="date-picker__timezone-field"
      @update:model-value="onPick"
    />
  </div>
</template>
