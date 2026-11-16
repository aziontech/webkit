<script setup lang="ts">
  import FilePreview from '@aziontech/webkit/file-preview'
</script>

<template>
  <FilePreview
    class="max-w-(--container-md)"
    file-name="invoices-2026.csv"
    mime-type="text/csv"
    :bytes="91342"
    error="Access denied (403). Ask the bucket owner for read access."
  />
</template>
