<script setup>
  import speech from '@aziontech/webkit/assets/placeholder-clip.webm'
  import AudioPlayer from '@aziontech/webkit/audio-player'
</script>

<template>
  <AudioPlayer
    :src="speech"
    title="Deployment summary"
    disabled
  />
</template>
