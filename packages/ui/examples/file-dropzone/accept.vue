<script setup>
  import Button from '@aziontech/webkit/button'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import { useFilePicker } from '@aziontech/webkit/use-file-picker'
  import { ref } from 'vue'

  const accept = 'image/*'
  const picker = useFilePicker({ accept, multiple: true })
  const accepted = ref([])
  const rejected = ref([])

  const addAccepted = (files) => {
    accepted.value = [...accepted.value, ...files.map((file) => file.name)]
  }
  const addRejected = (files) => {
    rejected.value = [...rejected.value, ...files.map((file) => file.name)]
  }
  const browse = async () => {
    const files = await picker.open()
    addAccepted(files.filter((file) => file.type.startsWith('image/')))
    addRejected(files.filter((file) => !file.type.startsWith('image/')))
  }
</script>

<template>
  <div class="flex w-full max-w-(--container-md) flex-col gap-(--spacing-md)">
    <FileDropzone
      :accept="accept"
      description="Images only. Other file types are rejected."
      @drop="(event, files) => addAccepted(files)"
      @reject="(event, files) => addRejected(files)"
    >
      <Button
        label="Browse images"
        variant="secondary"
        size="medium"
        @click="browse"
      />
    </FileDropzone>
    <div class="flex flex-col gap-(--spacing-2xs) text-body-sm">
      <p class="text-(--text-default)">
        Accepted: {{ accepted.length ? accepted.join(', ') : 'none yet' }}
      </p>
      <p class="text-(--text-muted)">
        Rejected: {{ rejected.length ? rejected.join(', ') : 'none yet' }}
      </p>
    </div>
  </div>
</template>
