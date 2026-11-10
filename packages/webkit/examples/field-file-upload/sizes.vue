<script setup>
  import { ref } from 'vue'
  import FieldFileUpload from '@aziontech/webkit/field-file-upload'

  const small = ref([])
  const medium = ref([])
  const large = ref([])
</script>

<template>
  <div class="flex w-full max-w-(--container-md) flex-col gap-(--spacing-lg)">
    <FieldFileUpload
      v-model="small"
      size="small"
      label="Certificate (small)"
      helper-text="PEM or CRT, up to 1 MB."
    />
    <FieldFileUpload
      v-model="medium"
      size="medium"
      label="Certificate (medium)"
      helper-text="PEM or CRT, up to 1 MB."
    />
    <FieldFileUpload
      v-model="large"
      size="large"
      label="Certificate (large)"
      helper-text="PEM or CRT, up to 1 MB."
    />
  </div>
</template>
