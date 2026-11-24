<script setup lang="ts">
  defineOptions({ name: 'CacheVaryHeading' })

  interface Props {
    /** Whether the setting is open, which points the chevron down. */
    open?: boolean
  }

  withDefaults(defineProps<Props>(), { open: false })

  defineSlots<{
    /** Name of the cache setting. */
    title(): unknown
    /** Label of the value the setting is summed up by. */
    label(): unknown
    /** The value the setting is summed up by. */
    value(): unknown
  }>()
</script>

<template>
  <i
    v-if="open"
    class="az az-chevron-down text-body-xs text-(--text-default)"
    aria-hidden="true"
  />
  <i
    v-else
    class="az az-chevron-right text-body-xs text-(--text-default) rtl:-scale-x-100"
    aria-hidden="true"
  />
  <span class="flex min-w-0 flex-col">
    <span class="text-label-md text-(--text-default)"><slot name="title" /></span>
    <span class="flex gap-(--spacing-2xs)">
      <span class="text-body-sm text-(--text-muted)"><slot name="label" /></span>
      <span class="text-label-sm text-(--text-default)"><slot name="value" /></span>
    </span>
  </span>
</template>
