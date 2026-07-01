<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'InputGroupAddon', inheritAttrs: false })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-group-addon')
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex items-center self-stretch shrink-0 bg-[var(--bg-canvas)] px-[var(--spacing-md)] text-label-sm text-[color:var(--text-muted)] [&:not(:last-child)]:border-r [&:not(:first-child)]:border-l border-[var(--border-default)]"
  >
    <slot />
  </div>
</template>
