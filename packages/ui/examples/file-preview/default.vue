<script setup lang="ts">
  import FilePreview from '@aziontech/webkit/file-preview'

  const settings = JSON.stringify({
    name: 'acme-store',
    domains: ['www.example.com', 'shop.example.com'],
    cache: { ttl: 3600, browser: true },
    origin: { host: 'origin.example.com', protocol: 'https' }
  })

  const onDownload = (event: MouseEvent) => {
    event.preventDefault()
  }
</script>

<template>
  <FilePreview
    class="max-w-(--container-md)"
    file-name="settings.json"
    mime-type="application/json"
    :bytes="182"
    :content="settings"
    @download="onDownload"
  />
</template>
