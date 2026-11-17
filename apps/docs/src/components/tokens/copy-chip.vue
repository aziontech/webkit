<script setup lang="ts">
  import { copyValue } from '../../lib/tokens'

  defineProps<{ value: string }>()
</script>

<template>
  <button
    type="button"
    class="group inline-flex max-w-full min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface) px-(--spacing-2xs) text-start text-label-code-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:border-(--border-default) hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
    @click="copyValue(value)"
  >
    <span class="min-w-0 truncate">{{ value }}</span>
    <i
      class="az az-copy shrink-0 text-(--text-muted) opacity-0 transition-opacity duration-fast-02 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
      aria-hidden="true"
    />
  </button>
</template>
