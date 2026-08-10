<script setup lang="ts">
  import { computed, inject, ref } from 'vue'

  import { CalendarInjectionKey } from '../injection-key'
  import { parsePeriod } from '../parse-period'

  defineOptions({
    name: 'CalendarPeriod',
    inheritAttrs: false
  })

  const ctx = inject(CalendarInjectionKey, null)

  const disabled = computed(() => ctx?.disabled.value ?? false)
  const horizontal = computed(() => ctx?.horizontal.value ?? false)

  const PRESETS = [
    { label: 'Last 3 Days', expr: '3d' },
    { label: 'Last Week', expr: 'last week' },
    { label: 'Last Month', expr: 'last month' },
    { label: 'Last Quarter', expr: '3mo' },
    { label: 'Last Year', expr: 'last year' }
  ] as const

  const RELATIVE_HINTS = ['45m', '12 hours', '10d', '2 weeks', 'last month', 'yesterday', 'today']
  const FIXED_HINTS = ['Jan 1', '1/1 - 1/2', '36 hours', '48 hours']

  const activeExpr = ref('')

  const apply = (expr: string, label: string) => {
    const range = parsePeriod(expr)
    if (range) {
      activeExpr.value = expr
      ctx?.selectValue(range, label)
    }
  }
</script>

<template>
  <div
    class="flex gap-(--spacing-md)"
    :class="horizontal ? 'flex-row items-start' : 'flex-col items-stretch'"
    data-testid="input-calendar__period"
  >
    <div
      class="flex min-w-(--container-4xs) flex-col gap-(--spacing-xxs)"
      :class="horizontal ? '' : 'border-b border-(--border-default) pb-(--spacing-sm)'"
    >
      <button
        v-for="preset in PRESETS"
        :key="preset.expr"
        type="button"
        :disabled="disabled"
        :data-active="activeExpr === preset.expr || null"
        class="text-label-sm inline-flex h-8 min-h-8 w-full items-center justify-between gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs) text-left text-(--text-default) transition-colors duration-150 ease-out hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface-raised) data-[active]:bg-(--bg-selected) disabled:cursor-not-allowed disabled:text-(--text-disabled) motion-reduce:transition-none"
        @click="apply(preset.expr, preset.label)"
      >
        <span>{{ preset.label }}</span>
        <i
          v-if="activeExpr === preset.expr"
          class="pi pi-check shrink-0 text-[length:inherit] leading-none text-(--text-muted)"
          aria-hidden="true"
        />
      </button>
    </div>

    <div class="flex flex-col gap-(--spacing-sm)">
      <div class="flex flex-col gap-(--spacing-xxs)">
        <span class="text-label-sm text-(--text-muted)"> Type relative times </span>
        <div class="flex max-w-(--container-2xs) flex-wrap gap-(--spacing-xxs)">
          <button
            v-for="hint in RELATIVE_HINTS"
            :key="hint"
            type="button"
            :disabled="disabled"
            class="text-label-sm inline-flex items-center rounded-(--shape-elements) border border-(--border-default) px-(--spacing-xs) py-(--spacing-xxs) text-(--text-default) transition-colors duration-150 ease-out hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface-raised) disabled:cursor-not-allowed disabled:text-(--text-disabled) motion-reduce:transition-none"
            @click="apply(hint, hint)"
          >
            {{ hint }}
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-(--spacing-xxs)">
        <span class="text-label-sm text-(--text-muted)"> Type fixed times </span>
        <div class="flex max-w-(--container-2xs) flex-wrap gap-(--spacing-xxs)">
          <button
            v-for="hint in FIXED_HINTS"
            :key="hint"
            type="button"
            :disabled="disabled"
            class="text-label-sm inline-flex items-center rounded-(--shape-elements) border border-(--border-default) px-(--spacing-xs) py-(--spacing-xxs) text-(--text-default) transition-colors duration-150 ease-out hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface-raised) disabled:cursor-not-allowed disabled:text-(--text-disabled) motion-reduce:transition-none"
            @click="apply(hint, hint)"
          >
            {{ hint }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
