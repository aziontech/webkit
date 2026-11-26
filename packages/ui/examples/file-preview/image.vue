<script setup lang="ts">
  import illustration from '@aziontech/ui/assets/ai-gateway.svg'
  import FilePreview from '@aziontech/ui/file-preview'
</script>

<template>
  <FilePreview
    class="max-w-(--container-md)"
    file-name="ai-gateway.svg"
    mime-type="image/svg+xml"
    :bytes="18432"
    :src="illustration"
  />
</template>
