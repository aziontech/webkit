<script setup lang="ts">
  import FilePreview from '@aziontech/webkit/file-preview'
</script>

<template>
  <FilePreview
    class="max-w-(--container-md)"
    file-name="settings.json"
    mime-type="application/json"
    :bytes="182"
    loading
  />
</template>
