<script setup>
  import { ref } from 'vue'
  import FieldFileUpload from '@aziontech/webkit/field-file-upload'

  const files = ref([
    new File([new Uint8Array(1468006)], 'report.pdf', { type: 'application/pdf' }),
    new File(
      [new Uint8Array(24576)],
      'q3-infrastructure-cost-breakdown-by-region-and-product.csv',
      { type: 'text/csv' }
    )
  ])
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <FieldFileUpload
      v-model="files"
      multiple
      label="Attachments"
      helper-text="Add as many files as you need."
    />
  </div>
</template>
