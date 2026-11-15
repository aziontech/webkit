<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import { ref } from 'vue'

  const folderInputEl = ref<HTMLInputElement | null>(null)
  const received = ref(0)

  const chooseFolder = () => folderInputEl.value?.click()

  const onFolderChosen = (event: Event) => {
    received.value = (event.target as HTMLInputElement).files?.length ?? 0
  }

  const onDrop = (_event: DragEvent, files: File[]) => {
    received.value = files.length
  }
</script>

<template>
  <div class="layout-boundary flex min-h-full flex-1 flex-col">
    <FileDropzone
      directories
      title="Drop your project to deploy it"
      description="A project folder, or the files inside one. We detect what it is built with."
      class="flex-1"
      @drop="onDrop"
    >
      <Button
        label="Choose a folder"
        variant="outline"
        size="medium"
        icon="ai ai-folder-open"
        @click="chooseFolder"
      />
      <input
        ref="folderInputEl"
        type="file"
        webkitdirectory
        multiple
        hidden
        aria-label="Project folder"
        @change="onFolderChosen"
      />
    </FileDropzone>
    <p
      class="sr-only"
      role="status"
    >
      {{ received ? `${received} files received.` : '' }}
    </p>
  </div>
</template>
