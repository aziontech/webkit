<script setup lang="ts">
  import Button from '../../../action/button/button.vue'
  import type { CapabilityGridSectionAction } from '../capability-grid-section.vue'

  defineOptions({ name: 'CapabilityGridSectionActions' })

  interface Props {
    /** The actions to draw as large buttons, in order. */
    actions: CapabilityGridSectionAction[]
  }

  defineProps<Props>()
</script>

<template>
  <Button
    v-for="action in actions"
    :key="action.label"
    :label="action.label"
    :href="action.href"
    :target="action.target"
    :variant="action.variant"
    size="large"
    :icon="action.trailing ? 'az az-chevron-right' : ''"
    icon-position="trailing"
    :animated="Boolean(action.trailing)"
  />
</template>
