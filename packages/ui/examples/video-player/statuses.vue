<script setup>
  import VideoPlayer from '@aziontech/ui/video-player'
  import { ref } from 'vue'

  const failedStatus = ref('error')

  const onRetry = () => {
    failedStatus.value = 'pending'
  }
</script>

<template>
  <div class="grid w-full gap-(--spacing-md) md:grid-cols-3">
    <VideoPlayer
      status="pending"
      aria-label="Product tour, waiting to generate"
    />
    <VideoPlayer
      status="running"
      :progress="42"
      aria-label="Product tour, generating"
    />
    <VideoPlayer
      :status="failedStatus"
      error="The model stopped before the video was done, so nothing was saved."
      aria-label="Product tour, failed"
      @retry="onRetry"
    />
  </div>
</template>
