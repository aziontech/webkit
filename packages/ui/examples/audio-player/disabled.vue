<script setup>
  import speech from '@aziontech/ui/assets/placeholder-clip.webm'
  import AudioPlayer from '@aziontech/ui/audio-player'
</script>

<template>
  <AudioPlayer
    :src="speech"
    title="Deployment summary"
    disabled
  />
</template>
