<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'NodeDiagramDescription',
    inheritAttrs: false
  })

  defineSlots<{
    /** A secondary line, such as a location or a short message. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'node-diagram-description'
  )
</script>

<template>
  <p
    v-bind="$attrs"
    data-slot="node-diagram-description"
    :data-testid="testId"
    dir="auto"
    class="m-0 -mt-(--spacing-2xs) min-w-0 truncate px-(--spacing-md) pb-(--spacing-sm) text-body-xs text-(--text-muted)"
  >
    <slot />
  </p>
</template>
