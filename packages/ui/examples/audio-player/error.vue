<script setup>
  import AudioPlayer from '@aziontech/ui/audio-player'
  import { ref } from 'vue'

  const error = ref('The speech service did not answer, so this summary has no audio yet.')
  const loading = ref(false)

  const onRetry = () => {
    error.value = ''
    loading.value = true
  }
</script>

<template>
  <AudioPlayer
    src="https://example.com/audio/deployment-summary.mp3"
    title="Deployment summary"
    :error="error"
    :loading="loading"
    @retry="onRetry"
  />
</template>
