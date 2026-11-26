<script setup>
  import Button from '@aziontech/ui/button'
  import FileDropzone from '@aziontech/ui/file-dropzone'
  import { useFilePicker } from '@aziontech/ui/use-file-picker'

  const picker = useFilePicker({ multiple: true })
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
        @click="picker.open()"
      />
    </FileDropzone>
  </div>
</template>
