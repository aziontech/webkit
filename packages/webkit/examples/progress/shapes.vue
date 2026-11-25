<script setup>
  import Progress from '@aziontech/webkit/progress'
</script>

<template>
  <div class="flex w-[320px] flex-col gap-4">
    <Progress
      :value="60"
      variant="rounded"
      aria-label="Uploading site-assets.zip"
    />
    <Progress
      :value="60"
      variant="flat"
      aria-label="Building docs-site"
    />
  </div>
</template>
