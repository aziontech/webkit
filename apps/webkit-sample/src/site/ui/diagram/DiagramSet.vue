<script setup lang="ts">
  import Diagram, { type DiagramName } from '@aziontech/webkit/diagram'
  import { computed } from 'vue'

  defineOptions({ name: 'DiagramSet', inheritAttrs: false })

  export interface DiagramSetEntry {
    /** Tab value that shows this diagram. */
    value: string
    /** Name of the official diagram in webkit's library. */
    name: DiagramName
    /** Accessible description that replaces the one the diagram carries. */
    ariaLabel?: string
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
    :name="entry.name"
    :ariaLabel="entry.ariaLabel"
  />
</template>
