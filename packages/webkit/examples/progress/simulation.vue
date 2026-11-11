<script setup>
  import Progress from '@aziontech/webkit/progress'
  import Button from '@aziontech/webkit/button'
  import IconButton from '@aziontech/webkit/icon-button'
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
  <div class="flex w-[320px] flex-col gap-4">
    <Progress :value="value" />
    <div class="flex items-center gap-2">
      <Button
        label="Next"
        kind="primary"
        size="small"
        @click="advance"
      />
      <IconButton
        icon="pi pi-refresh"
        aria-label="Reset"
        size="small"
        kind="outlined"
        @click="reset"
      />
      <span class="ms-auto">{{ value }}%</span>
    </div>
  </div>
</template>
