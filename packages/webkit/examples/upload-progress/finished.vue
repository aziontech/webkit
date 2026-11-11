<script setup>
  import Button from '@aziontech/webkit/button'
  import UploadProgress from '@aziontech/webkit/upload-progress'

  const items = [
    { id: 'logo', name: 'logo.svg', size: 4210, status: 'done' },
    { id: 'app', name: 'app.js', size: 248_320, status: 'done' },
    { id: 'video', name: 'intro.mp4', size: 96_400_000, status: 'error', error: 'Connection lost' },
    { id: 'styles', name: 'styles.css', size: 52_100, status: 'done' }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-xs)">
    <UploadProgress
      :items="items"
      :floating="false"
    >
      <template #actions>
        <Button
          label="Open folder"
          kind="secondary"
          size="small"
        />
      </template>
    </UploadProgress>
  </div>
</template>
