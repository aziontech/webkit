<script setup>
  import Progress from '@aziontech/webkit/progress'
</script>

<template>
  <div class="flex w-[320px] flex-col gap-4">
    <Progress
      :value="60"
      shape="rounded"
    />
    <Progress
      :value="60"
      shape="flat"
    />
  </div>
</template>
