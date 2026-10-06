<script setup lang="ts">
  defineSlots<{
    default(): unknown
    actions(): unknown
  }>()
</script>

<template>
  <header class="flex items-center gap-(--layout-group-gap)">
    <div class="flex min-w-0 grow items-center gap-(--spacing-xs)">
      <slot />
    </div>
    <div
      v-if="$slots.actions"
      class="flex shrink-0 items-center gap-(--spacing-xs)"
    >
      <slot name="actions" />
    </div>
  </header>
</template>
