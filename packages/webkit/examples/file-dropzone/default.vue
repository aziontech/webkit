<script setup>
  import { ref } from 'vue'

  import Button from '@aziontech/webkit/button'
  import FileDropzone from '@aziontech/webkit/file-dropzone'

  const input = ref(null)
  const browse = () => input.value?.click()
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <FileDropzone description="Or browse for files on your computer.">
      <Button
        label="Browse files"
        kind="secondary"
        size="medium"
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
