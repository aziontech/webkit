<script setup>
  import Button from '@aziontech/ui/button'
  import IconButton from '@aziontech/ui/icon-button'
  import Progress from '@aziontech/ui/progress'
  import { ref } from 'vue'

  const value = ref(0)

  const advance = () => {
    value.value = Math.min(100, value.value + 20)
  }

  const reset = () => {
    value.value = 0
  }
</script>

<template>
  <div class="flex w-(--container-2xs) flex-col gap-(--spacing-md)">
    <Progress
      :value="value"
      aria-label="Deploying acme-store"
    />
    <div class="flex items-center gap-(--spacing-xs)">
      <Button
        label="Next"
        variant="primary"
        size="small"
        @click="advance"
      />
      <IconButton
        icon="az az-refresh"
        aria-label="Reset"
        size="small"
        variant="outline"
        @click="reset"
      />
      <span class="ms-auto">{{ value }}%</span>
    </div>
  </div>
</template>
