<script setup lang="ts">
  import { computed, inject } from 'vue'

  import { defaultTimezones, formatTimezoneLabel, localTimezone } from '../format'
  import { CalendarInjectionKey } from '../injection-key'

  defineOptions({
    name: 'CalendarTimezone',
    inheritAttrs: false
  })

  const ctx = inject(CalendarInjectionKey, null)

  const size = computed(() => ctx?.size.value ?? 'medium')
  const disabled = computed(() => ctx?.disabled.value ?? false)

  const options = computed<string[]>(() => {
    const provided = ctx?.timezones.value ?? []
    return provided.length > 0 ? provided : defaultTimezones()
  })

  const value = computed<string>(() => ctx?.timezone.value || localTimezone())

  const onChange = (event: globalThis.Event) => {
    const target = event.target as globalThis.HTMLSelectElement
    ctx?.setTimezone(target.value)
  }
</script>

<template>
  <label
    class="flex flex-col gap-[var(--spacing-xxs)]"
    data-testid="input-calendar__timezone"
  >
    <span class="text-label-sm text-[var(--text-muted)]"> Timezone </span>
    <span class="relative inline-flex w-full items-center">
      <select
        :value="value"
        :disabled="disabled"
        :data-size="size"
        class="text-body-sm w-full appearance-none rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)] pl-[var(--spacing-sm)] pr-[var(--spacing-lg)] text-[var(--text-default)] transition-colors duration-150 ease-out hover:border-[var(--border-strong)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface-raised)] disabled:cursor-not-allowed disabled:bg-[var(--bg-disabled)] disabled:text-[var(--text-disabled)] data-[size=small]:h-7 data-[size=medium]:h-8 data-[size=large]:h-10 motion-reduce:transition-none"
        @change="onChange"
      >
        <option
          v-for="zone in options"
          :key="zone"
          :value="zone"
        >
          {{ formatTimezoneLabel(zone) }}
        </option>
      </select>
      <i
        class="pi pi-chevron-down pointer-events-none absolute right-[var(--spacing-sm)] text-[length:inherit] leading-none text-[var(--text-muted)]"
        aria-hidden="true"
      />
    </span>
  </label>
</template>
