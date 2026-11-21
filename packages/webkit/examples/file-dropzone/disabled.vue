<script setup>
  import Button from '@aziontech/webkit/button'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import { ref } from 'vue'

  const inputEl = ref(null)
  const browse = () => inputEl.value?.click()
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <FileDropzone
      description="Or browse for files on your computer."
      disabled
    >
      <Button
        label="Browse files"
        variant="secondary"
        size="medium"
        disabled
        @click="browse"
      />
    </FileDropzone>
    <input
      ref="inputEl"
      type="file"
      multiple
      aria-label="Browse files"
      class="hidden"
    />
  </div>
</template>
