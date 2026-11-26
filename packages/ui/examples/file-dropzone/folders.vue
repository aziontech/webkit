<script setup>
  import Button from '@aziontech/ui/button'
  import FileDropzone from '@aziontech/ui/file-dropzone'
  import FileTokenGroup from '@aziontech/ui/file-token-group'
  import { useFilePicker } from '@aziontech/ui/use-file-picker'
  import { ref } from 'vue'

  const filePicker = useFilePicker({ multiple: true })
  const folderPicker = useFilePicker({ directory: true })
  const items = ref([])

  const add = (files) => {
    items.value = [...items.value, ...Array.from(files, (file) => ({ file }))]
  }
  const browseFiles = async () => add(await filePicker.open())
  const browseFolder = async () => add(await folderPicker.open())
  const remove = (index) => {
    items.value = items.value.filter((_, position) => position !== index)
  }
</script>

<template>
  <div class="flex w-full max-w-(--container-md) flex-col gap-(--spacing-md)">
    <FileDropzone
      directories
      title="Upload files or folders"
      description="Folders keep their structure: each file goes up with its path."
      @drop="(event, files) => add(files)"
    >
      <div class="flex flex-wrap justify-center gap-(--spacing-xs)">
        <Button
          label="Browse files"
          variant="secondary"
          size="medium"
          @click="browseFiles"
        />
        <span class="contents pointer-coarse:hidden">
          <Button
            label="Browse folder"
            variant="secondary"
            size="medium"
            icon="az az-folder-open"
            @click="browseFolder"
          />
        </span>
      </div>
    </FileDropzone>
    <FileTokenGroup
      v-if="items.length"
      :items="items"
      :limit="6"
      aria-label="Files to upload"
      @remove="(_event, { index }) => remove(index)"
    />
  </div>
</template>
