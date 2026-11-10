<script setup>
  import ProgressBar from '@aziontech/webkit/progress-bar'
</script>

<template>
  <div class="flex w-[320px] flex-col gap-4">
    <ProgressBar
      :value="60"
      shape="rounded"
    />
    <ProgressBar
      :value="60"
      shape="flat"
    />
  </div>
</template>
