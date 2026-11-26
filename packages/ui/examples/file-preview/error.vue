<script setup lang="ts">
  import FilePreview from '@aziontech/webkit/file-preview'
</script>

<template>
  <FilePreview
    class="max-w-(--container-md)"
    file-name="invoices-2026.csv"
    mime-type="text/csv"
    :bytes="91342"
    error="The preview service timed out. Download the file to open it."
  />
</template>
