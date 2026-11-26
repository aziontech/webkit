<script setup>
  import speech from '@aziontech/ui/assets/placeholder-clip.webm'
  import AudioPlayer from '@aziontech/ui/audio-player'
</script>

<template>
  <AudioPlayer
    :src="speech"
    title="Deployment summary"
    :duration="1.9"
    transcript="Your application acme-store is live. The last deploy finished in 42 seconds and every check passed."
  />
</template>
