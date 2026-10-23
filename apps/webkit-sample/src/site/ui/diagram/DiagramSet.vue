<script setup lang="ts">
  import { computed } from 'vue'

  import Diagram from './Diagram.vue'
  import type { DiagramSpec } from './types'

  defineOptions({ name: 'DiagramSet', inheritAttrs: false })

  export interface DiagramSetEntry {
    /** Tab value that shows this diagram. */
    value: string
    /** The diagram. */
    spec: DiagramSpec
    /** Accessible description of the diagram. */
    ariaLabel: string
  }

  interface Props {
    /** The diagrams, one per tab; the first shows when no tab is set. */
    diagrams: DiagramSetEntry[]
    /** Value of the open tab. */
    tab?: string
  }

  const props = withDefaults(defineProps<Props>(), { tab: '' })

  const entry = computed(
    () => props.diagrams.find((diagram) => diagram.value === props.tab) ?? props.diagrams[0]
  )
</script>

<template>
  <Diagram
    v-if="entry"
    :key="entry.value"
    v-bind="$attrs"
    :spec="entry.spec"
    :label="entry.ariaLabel"
  />
</template>
