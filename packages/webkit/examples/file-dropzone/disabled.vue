<script setup>
  import Button from '@aziontech/webkit/button'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import { ref } from 'vue'

  const input = ref(null)
  const browse = () => input.value?.click()
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <FileDropzone
      description="Or browse for files on your computer."
      disabled
    >
      <Button
        label="Browse files"
        kind="secondary"
        size="medium"
        disabled
        @click="browse"
      />
    </FileDropzone>
    <input
      ref="input"
      type="file"
      multiple
      class="hidden"
    />
  </div>
</template>
