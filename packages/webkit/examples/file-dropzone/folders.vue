<script setup>
  import Button from '@aziontech/webkit/button'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import { ref } from 'vue'

  const filesInputEl = ref(null)
  const folderInputEl = ref(null)
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
          variant="secondary"
          size="medium"
          @click="filesInputEl?.click()"
        />
        <Button
          label="Browse folder"
          variant="secondary"
          size="medium"
          icon="ai ai-folder-open"
          @click="folderInputEl?.click()"
        />
      </div>
    </FileDropzone>
    <input
      ref="filesInputEl"
      type="file"
      multiple
      class="hidden"
      aria-hidden="true"
      tabindex="-1"
      @change="onPick"
    />
    <input
      ref="folderInputEl"
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
      @remove="(_event, { index }) => remove(index)"
    />
  </div>
</template>
