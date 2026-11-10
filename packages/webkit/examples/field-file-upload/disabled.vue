<script setup>
  import { ref } from 'vue'
  import FieldFileUpload from '@aziontech/webkit/field-file-upload'

  const files = ref([
    new File([new Uint8Array(1468006)], 'report.pdf', { type: 'application/pdf' })
  ])
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <FieldFileUpload
      v-model="files"
      label="Report"
      helper-text="Uploads are paused while the report is reviewed."
      disabled
    />
  </div>
</template>
