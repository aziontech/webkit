<script setup>
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import { ref } from 'vue'

  const accepted = ref([])
  const rejected = ref([])
  const onDrop = (event, files) => {
    accepted.value = [...accepted.value, ...files.map((file) => file.name)]
  }
  const onReject = (event, files) => {
    rejected.value = [...rejected.value, ...files.map((file) => file.name)]
  }
</script>

<template>
  <div class="flex w-full max-w-(--container-md) flex-col gap-(--spacing-md)">
    <FileDropzone
      accept="image/*"
      description="Images only. Other file types are rejected."
      @drop="onDrop"
      @reject="onReject"
    />
    <div class="flex flex-col gap-(--spacing-xxs) text-body-sm">
      <p class="text-(--text-default)">
        Accepted: {{ accepted.length ? accepted.join(', ') : 'none yet' }}
      </p>
      <p class="text-(--text-muted)">
        Rejected: {{ rejected.length ? rejected.join(', ') : 'none yet' }}
      </p>
    </div>
  </div>
</template>
