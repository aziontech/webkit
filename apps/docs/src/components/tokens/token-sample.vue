<script setup lang="ts">
  defineProps<{
    name: string
    sample: 'swatch' | 'bar' | 'radius' | 'shadow' | 'none'
    theme?: 'light' | 'dark'
  }>()
</script>

<template>
  <span
    v-if="sample === 'swatch'"
    :data-theme="theme"
    class="inline-block size-8 shrink-0 rounded-(--shape-elements) border border-(--border-default)"
    :style="{ background: `var(${name})` }"
    aria-hidden="true"
  />
  <span
    v-else-if="sample === 'bar'"
    class="inline-block h-4 shrink-0 rounded-(--shape-flat) bg-(--primary)"
    :style="{ width: `min(var(${name}), 6rem)`, minWidth: '2px' }"
    aria-hidden="true"
  />
  <span
    v-else-if="sample === 'radius'"
    class="inline-block size-8 shrink-0 border-2 border-(--primary) bg-(--bg-surface)"
    :style="{ borderRadius: `var(${name})` }"
    aria-hidden="true"
  />
  <span
    v-else-if="sample === 'shadow'"
    class="inline-block size-8 shrink-0 rounded-(--shape-elements) bg-(--bg-surface-raised)"
    :style="{ boxShadow: `var(${name})` }"
    aria-hidden="true"
  />
</template>
