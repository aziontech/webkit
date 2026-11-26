<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Tag from '@aziontech/ui/tag'

  export interface DeployActionProps {
    /** How many topology changes wait for the next deploy; a warning tag counts them. */
    stagedCount?: number
    /** A deployment is in flight. */
    loading?: boolean
  }

  withDefaults(defineProps<DeployActionProps>(), {
    stagedCount: 0,
    loading: false
  })

  const emit = defineEmits<{
    deploy: [event: MouseEvent]
  }>()
</script>

<template>
  <div class="flex items-center gap-(--spacing-xs)">
    <Tag
      v-if="stagedCount"
      :label="`${stagedCount} ${stagedCount === 1 ? 'change' : 'changes'}`"
      severity="warning"
      size="small"
    />
    <Button
      label="Deploy"
      variant="outline"
      size="medium"
      icon="az az-cloud-upload"
      :loading="loading"
      @click="(event: MouseEvent) => emit('deploy', event)"
    />
  </div>
</template>
