<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'NodeDiagramGroup',
    inheritAttrs: false
  })

  export interface NodeDiagramGroupProps {
    /** Name of the column for assistive technology, e.g. `Storage`. */
    label?: string
  }

  withDefaults(defineProps<NodeDiagramGroupProps>(), {
    label: ''
  })

  defineSlots<{
    /** The nodes that sit side by side in one step. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'node-diagram-group'
  )
</script>

<template>
  <div
    role="listitem"
    data-slot="node-diagram-group"
    :data-testid="testId"
    class="flex flex-col"
    :class="attrs.class"
  >
    <span
      v-if="label"
      class="sr-only"
      >{{ label }}</span
    >
    <div
      role="list"
      :data-testid="`${testId}__list`"
      class="flex w-full flex-col items-stretch gap-(--spacing-md)"
    >
      <slot />
    </div>
  </div>
</template>
