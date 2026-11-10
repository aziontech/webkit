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
      helper-text="PEM or CRT, up to 1 MB."
    />
  </div>
</template>
