<script setup lang="ts">
  import ImageGallery from '@aziontech/ui/image-gallery'
  import { ref } from 'vue'

  const error = ref('The image model was busy, so no images were generated.')
  const loading = ref(false)

  const onRetry = () => {
    error.value = ''
    loading.value = true
  }
</script>

<template>
  <ImageGallery
    class="max-w-(--container-md)"
    :error="error"
    :loading="loading"
    :expected-count="4"
    @retry="onRetry"
  />
</template>
