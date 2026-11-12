<script setup>
  import { ref } from 'vue'

  import Button from '@aziontech/webkit/button'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import FileTokenGroup from '@aziontech/webkit/file-token-group'

  const filesInput = ref(null)
  const folderInput = ref(null)
  const items = ref([])

  const add = (files) => {
    items.value = [...items.value, ...Array.from(files, (file) => ({ file }))]
  }
  const onPick = (event) => {
    add(event.target.files ?? [])
    event.target.value = ''
  }
  const remove = (index) => {
    items.value = items.value.filter((_, position) => position !== index)
  }
</script>

<template>
  <div class="flex w-full max-w-(--container-md) flex-col gap-(--spacing-md)">
    <FileDropzone
      directories
      title="Drop files or folders to upload"
      description="Folders keep their structure: each file goes up with its path."
      @drop="(event, files) => add(files)"
    >
      <div class="flex flex-wrap justify-center gap-(--spacing-xs)">
        <Button
          label="Browse files"
          kind="secondary"
          size="medium"
          @click="filesInput?.click()"
        />
        <Button
          label="Browse folder"
          kind="secondary"
          size="medium"
          icon="pi pi-folder-open"
          @click="folderInput?.click()"
        />
      </div>
    </FileDropzone>
    <input
      ref="filesInput"
      type="file"
      multiple
      class="hidden"
      aria-hidden="true"
      tabindex="-1"
      @change="onPick"
    />
    <input
      ref="folderInput"
      type="file"
      webkitdirectory
      class="hidden"
      aria-hidden="true"
      tabindex="-1"
      @change="onPick"
    />
    <FileTokenGroup
      v-if="items.length"
      :items="items"
      :limit="6"
      aria-label="Files to upload"
      @dismiss="remove"
    />
  </div>
</template>
