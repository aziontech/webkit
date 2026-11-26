<script setup lang="ts">
  export interface SummaryFactProps {
    /** The muted label over the value. */
    label?: string
    /** The utilities the value row adds, such as its gap. */
    valueClass?: string
    /** The muted text shown when no value is given, such as None. */
    empty?: string
  }

  withDefaults(defineProps<SummaryFactProps>(), {
    label: '',
    valueClass: 'gap-(--spacing-xs)',
    empty: ''
  })

  defineSlots<{
    default?(): unknown
    label?(): unknown
  }>()
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
    <slot name="label">
      <span class="text-label-sm text-(--text-muted)">{{ label }}</span>
    </slot>
    <div
      class="flex min-h-7 min-w-0 items-center"
      :class="valueClass"
    >
      <slot>
        <span class="truncate text-body-sm text-(--text-muted)">{{ empty }}</span>
      </slot>
    </div>
  </div>
</template>
