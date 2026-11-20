<script setup>
  import Progress from '@aziontech/webkit/progress'
</script>

<template>
  <div class="flex w-[320px] flex-col gap-4">
    <Progress
      :value="60"
      size="small"
    />
    <Progress
      :value="60"
      size="medium"
    />
    <Progress
      :value="60"
      size="large"
    />
  </div>
</template>
