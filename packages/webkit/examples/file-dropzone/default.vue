<script setup>
  import Button from '@aziontech/webkit/button'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import { useFilePicker } from '@aziontech/webkit/use-file-picker'

  const picker = useFilePicker({ multiple: true })
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <FileDropzone description="Or browse for files on your computer.">
      <Button
        label="Browse files"
        variant="secondary"
        size="medium"
        @click="picker.open()"
      />
    </FileDropzone>
  </div>
</template>
