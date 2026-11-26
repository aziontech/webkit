<script setup lang="ts">
  import ddosProtection from '@aziontech/webkit/assets/ddos-protection.svg'
  import ImageGallery from '@aziontech/webkit/image-gallery'

  const items = [{ key: 'ddos', src: ddosProtection, alt: 'DDoS protection illustration' }]
</script>

<template>
  <ImageGallery
    class="max-w-(--container-md)"
    :items="items"
    loading
    :expected-count="4"
  />
</template>
