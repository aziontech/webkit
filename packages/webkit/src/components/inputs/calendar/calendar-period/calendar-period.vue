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

  const apply = (expr: string) => {
    const range = parsePeriod(expr)
    if (range) {
      activeExpr.value = expr
      ctx?.selectValue(range)
    }
  }
</script>

<template>
  <div
    class="flex gap-[var(--spacing-md)]"
    :class="horizontal ? 'flex-row items-start' : 'flex-col items-stretch'"
    data-testid="input-calendar__period"
  >
    <div
      class="flex min-w-[var(--container-4xs)] flex-col gap-[var(--spacing-xxs)]"
      :class="horizontal ? '' : 'border-b border-[var(--border-default)] pb-[var(--spacing-sm)]'"
    >
      <button
        v-for="preset in PRESETS"
        :key="preset.expr"
        type="button"
        :disabled="disabled"
        :data-active="activeExpr === preset.expr || null"
        class="text-body-sm inline-flex w-full items-center justify-between gap-[var(--spacing-xs)] rounded-[var(--shape-elements)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-left text-[var(--text-default)] transition-colors duration-150 ease-out hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface-raised)] data-[active]:bg-[var(--bg-selected)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)] motion-reduce:transition-none"
        @click="apply(preset.expr)"
      >
        <span>{{ preset.label }}</span>
        <i
          v-if="activeExpr === preset.expr"
          class="pi pi-check shrink-0 text-[length:inherit] leading-none text-[var(--text-muted)]"
          aria-hidden="true"
        />
      </button>
    </div>

    <div class="flex flex-col gap-[var(--spacing-sm)]">
      <div class="flex flex-col gap-[var(--spacing-xxs)]">
        <span class="text-label-sm text-[var(--text-muted)]"> Type relative times </span>
        <div class="flex max-w-[var(--container-2xs)] flex-wrap gap-[var(--spacing-xxs)]">
          <button
            v-for="hint in RELATIVE_HINTS"
            :key="hint"
            type="button"
            :disabled="disabled"
            class="text-label-sm inline-flex items-center rounded-[var(--shape-elements)] border border-[var(--border-default)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-[var(--text-default)] transition-colors duration-150 ease-out hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface-raised)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)] motion-reduce:transition-none"
            @click="apply(hint)"
          >
            {{ hint }}
          </button>
        </div>
      </div>

      <div class="flex flex-col gap-[var(--spacing-xxs)]">
        <span class="text-label-sm text-[var(--text-muted)]"> Type fixed times </span>
        <div class="flex max-w-[var(--container-2xs)] flex-wrap gap-[var(--spacing-xxs)]">
          <button
            v-for="hint in FIXED_HINTS"
            :key="hint"
            type="button"
            :disabled="disabled"
            class="text-label-sm inline-flex items-center rounded-[var(--shape-elements)] border border-[var(--border-default)] px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-[var(--text-default)] transition-colors duration-150 ease-out hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface-raised)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)] motion-reduce:transition-none"
            @click="apply(hint)"
          >
            {{ hint }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
