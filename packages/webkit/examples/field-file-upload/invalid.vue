<script setup>
  import { ref } from 'vue'
  import FieldFileUpload from '@aziontech/webkit/field-file-upload'

  const files = ref([])
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <FieldFileUpload
      v-model="files"
      label="Certificate"
      helper-text="Upload a certificate to continue."
      invalid
    />
  </div>
</template>
