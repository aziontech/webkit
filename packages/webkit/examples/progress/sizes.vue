<script setup>
  import Progress from '@aziontech/webkit/progress'
</script>

<template>
  <div class="flex w-[320px] flex-col gap-4">
    <Progress
      :value="60"
      size="small"
      aria-label="Uploading logo.svg"
    />
    <Progress
      :value="60"
      size="medium"
      aria-label="Uploading site-assets.zip"
    />
    <Progress
      :value="60"
      size="large"
      aria-label="Uploading backup.tar.gz"
    />
  </div>
</template>
