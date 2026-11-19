<script setup lang="ts">
  import aiGateway from '@aziontech/webkit/assets/ai-gateway.svg'
  import ImageGallery from '@aziontech/webkit/image-gallery'

  const items = [
    {
      key: 'gateway',
      src: aiGateway,
      alt: 'AI gateway illustration',
      fileName: 'acme-ai-gateway.svg'
    }
  ]
</script>

<template>
  <ImageGallery :items="items" />
</template>
