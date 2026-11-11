<script setup>
  import FileTokenGroup from '@aziontech/webkit/file-token-group'

  const items = [
    {
      file: { name: 'hero.webp', size: 1_482_000, type: 'image/webp', lastModified: 1762790400000 },
      loading: false
    },
    {
      file: { name: 'app.js', size: 248_320, type: 'text/javascript' },
      loading: true,
      progress: 64
    },
    { file: { name: 'styles.css', size: 52_100, type: 'text/css' }, loading: true },
    {
      file: { name: 'archive.zip', size: 512_000_000, type: 'application/zip' },
      error: 'Larger than 300 MB'
    }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <FileTokenGroup
      :items="items"
      show-file-last-modified
      aria-label="Files to upload"
    />
  </div>
</template>
