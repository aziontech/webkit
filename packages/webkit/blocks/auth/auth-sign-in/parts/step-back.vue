<script setup lang="ts">
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'

  export interface StepBackProps {
    /** The name of the back control, also its tooltip. */
    label: string
    /** The text beside the control. */
    text: string
  }

  defineProps<StepBackProps>()

  const emit = defineEmits<{
    back: [event: MouseEvent]
  }>()
</script>

<template>
  <div class="flex items-center gap-(--spacing-sm)">
    <Tooltip :content="label">
      <IconButton
        icon="az az-chevron-left"
        :aria-label="label"
        variant="outline"
        size="small"
        @click="(event: MouseEvent) => emit('back', event)"
      />
    </Tooltip>
    <span class="truncate text-label-sm text-(--text-default)">{{ text }}</span>
  </div>
</template>
