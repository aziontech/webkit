<script setup lang="ts">
  import Button from '../../action/button/button.vue'
  import type { SectionAction } from '../lib/section-actions'

  defineOptions({ name: 'SectionActions' })

  interface SectionActionsProps {
    /** The header buttons, in order. */
    actions: SectionAction[]
  }

  defineProps<SectionActionsProps>()
</script>

<template>
  <Button
    v-for="action in actions"
    :key="action.label"
    :label="action.label"
    :href="action.href"
    :target="action.target"
    :variant="action.variant"
    :icon="action.trailing ? 'az az-chevron-right' : ''"
    icon-position="trailing"
    :animated="Boolean(action.trailing)"
  />
</template>
