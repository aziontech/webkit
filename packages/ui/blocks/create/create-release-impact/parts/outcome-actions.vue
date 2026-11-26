<script setup lang="ts">
  import Button from '@aziontech/ui/button'

  const emit = defineEmits<{
    edit: [event: MouseEvent]
    redeploy: [event: MouseEvent]
  }>()
</script>

<template>
  <div class="flex shrink-0 items-center gap-(--spacing-xs)">
    <Button
      label="Edit"
      variant="outline"
      size="small"
      @click="(event: MouseEvent) => emit('edit', event)"
    />
    <Button
      label="Redeploy"
      variant="outline"
      size="small"
      icon="az az-refresh"
      @click="(event: MouseEvent) => emit('redeploy', event)"
    />
  </div>
</template>
