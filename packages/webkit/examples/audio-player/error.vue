<script setup>
  import AudioPlayer from '@aziontech/webkit/audio-player'
</script>

<template>
  <AudioPlayer
    src="https://example.com/audio/deployment-summary.mp3"
    title="Deployment summary"
    error="The speech service did not answer. Try again in a moment."
  />
</template>
