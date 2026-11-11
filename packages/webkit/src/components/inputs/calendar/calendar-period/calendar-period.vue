<script setup lang="ts">
  import { computed, inject, ref } from 'vue'

  import { useLocale } from '../../../../composables/use-locale'
  import * as en from '../../../../i18n/messages/en'
  import { CalendarInjectionKey } from '../injection-key'
  import { parsePeriod } from '../parse-period'

  defineOptions({
    name: 'CalendarPeriod',
    inheritAttrs: false
  })

  const { t } = useLocale({ calendar: en.calendar })

  const ctx = inject(CalendarInjectionKey, null)

  const disabled = computed(() => ctx?.disabled.value ?? false)
  const horizontal = computed(() => ctx?.horizontal.value ?? false)

  const PRESETS = computed(() => [
    { label: t('calendar.last3Days'), expr: '3d' },
    { label: t('calendar.lastWeek'), expr: 'last week' },
    { label: t('calendar.lastMonth'), expr: 'last month' },
    { label: t('calendar.lastQuarter'), expr: '3mo' },
    { label: t('calendar.lastYear'), expr: 'last year' }
  ])

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
        class="text-label-sm inline-flex h-8 min-h-8 w-full items-center justify-between gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-xxs) text-start text-(--text-default) transition-colors duration-150 ease-out hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface-raised) data-[active]:bg-(--bg-selected) disabled:cursor-not-allowed disabled:text-(--text-disabled) motion-reduce:transition-none"
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
        <span class="text-label-sm text-(--text-muted)"> {{ t('calendar.relativeHints') }} </span>
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
        <span class="text-label-sm text-(--text-muted)"> {{ t('calendar.fixedHints') }} </span>
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
