<script setup>
  import Button from '@aziontech/webkit/button'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import { ref } from 'vue'

  const LIMIT = 300 * 1024 * 1024

  const input = ref(null)
  const items = ref([
    { file: { name: 'logo.svg', size: 4210, type: 'image/svg+xml' } },
    { file: { name: 'index.html', size: 18432, type: 'text/html' } },
    { file: { name: 'site-backup.tar', size: 412_000_000 }, error: 'Larger than 300 MB' },
    { file: { name: 'notes.txt', size: 0, type: 'text/plain' }, warning: 'This file is empty' }
  ])

  const toItem = (file) => ({
    file,
    error: file.size > LIMIT ? 'Larger than 300 MB' : undefined,
    warning: file.size === 0 ? 'This file is empty' : undefined
  })

  const add = (files) => {
    items.value = [...items.value, ...Array.from(files).map(toItem)]
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
  <div class="flex w-full max-w-(--container-md) flex-col gap-(--spacing-sm)">
    <FileDropzone
      description="Up to 300 MB per file."
      @drop="(event, files) => add(files)"
    >
      <Button
        label="Browse files"
        kind="secondary"
        size="medium"
        @click="input?.click()"
      />
    </FileDropzone>
    <input
      ref="input"
      type="file"
      multiple
      class="hidden"
      aria-hidden="true"
      tabindex="-1"
      @change="onPick"
    />
    <FileTokenGroup
      :items="items"
      @dismiss="remove"
    />
  </div>
</template>
