<script setup>
  import speech from '@aziontech/webkit/assets/placeholder-clip.webm'
  import AudioPlayer from '@aziontech/webkit/audio-player'
</script>

<template>
  <AudioPlayer
    :src="speech"
    title="Deployment summary"
    :duration="1.9"
    transcript="Your application acme-store is live. The last deploy finished in 42 seconds and every check passed."
  />
</template>
