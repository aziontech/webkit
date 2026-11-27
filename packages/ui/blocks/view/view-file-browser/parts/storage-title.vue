<script setup lang="ts">
  defineProps<{ name: string }>()
</script>

<template>
  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
    <i
      class="az az-database shrink-0 text-body-lg text-(--text-muted)"
      aria-hidden="true"
    />
    <h1 class="min-w-0 truncate text-heading-2xs text-(--text-default)">
      {{ name }}
    </h1>
  </div>
</template>
