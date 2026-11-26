<script setup lang="ts">
  import Tag from '@aziontech/webkit/tag'
  import { computed } from 'vue'

  /** One gate of the production checklist. */
  export interface ProductionStep {
    /** Stable key; a topology slot key when the step binds one. */
    id: string
    /** The step glyph class. */
    icon: string
    /** The step title. */
    title: string
    /** What the step does. */
    description: string
    /** The label of the step action. */
    actionLabel: string
    /** The step is done. */
    done: boolean
    /** What the done tag says. */
    doneNote?: string
  }

  export interface ProductionProgressTagProps {
    /** The steps of the checklist. */
    steps: ProductionStep[]
  }

  const props = defineProps<ProductionProgressTagProps>()

  const doneCount = computed(() => props.steps.filter((step) => step.done).length)
  const complete = computed(() => props.steps.length > 0 && doneCount.value === props.steps.length)
</script>

<template>
  <Tag
    :label="complete ? 'Ready for production' : `${doneCount} of ${steps.length}`"
    :severity="complete ? 'success' : 'neutral'"
    size="small"
    class="shrink-0"
  />
</template>
