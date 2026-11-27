<script setup lang="ts">
  import FilePreview from '@aziontech/ui/file-preview'

  const paths = ['/', '/products', '/cart', '/checkout', '/api/orders']
  const log = Array.from(
    { length: 60 },
    (_, index) =>
      `2026-11-09T10:${String(index % 60).padStart(2, '0')}:00Z GET ${paths[index % paths.length]} ${index % 7 === 0 ? 404 : 200} ${12 + (index % 9) * 7}ms`
  ).join('\n')
</script>

<template>
  <FilePreview
    class="max-w-(--container-md)"
    file-name="access-2026-11-09.log"
    mime-type="text/plain"
    :bytes="48210"
    :content="log"
    :max-length="600"
  />
</template>
