<script setup>
  import VideoPlayer from '@aziontech/webkit/video-player'
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
      status="error"
      error="The model stopped before the video was done, so nothing was saved."
      aria-label="Product tour, failed"
    />
  </div>
</template>
