<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'FlowDiagramFooter',
    inheritAttrs: false
  })

  defineSlots<{
    /** The figures of the node, as items. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'flow-diagram-footer'
  )
</script>

<template>
  <dl
    v-bind="$attrs"
    data-slot="flow-diagram-footer"
    :data-testid="testId"
    class="m-0 flex flex-wrap gap-x-(--spacing-md) gap-y-(--spacing-2xs) border-t border-solid border-(--border-muted) px-(--spacing-md) py-(--spacing-xs)"
  >
    <slot />
  </dl>
</template>
