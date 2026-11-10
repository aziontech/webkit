<script setup>
  import ProgressBar from '@aziontech/webkit/progress-bar'
</script>

<template>
  <div class="flex w-[320px] flex-col gap-4">
    <ProgressBar
      :value="60"
      size="small"
    />
    <ProgressBar
      :value="60"
      size="medium"
    />
    <ProgressBar
      :value="60"
      size="large"
    />
  </div>
</template>
