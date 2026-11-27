<script setup>
  import speech from '@aziontech/ui/assets/placeholder-clip.webm'
  import AudioPlayer from '@aziontech/ui/audio-player'
</script>

<template>
  <AudioPlayer
    :src="speech"
    title="Weekly traffic report"
    :playback-rates="[0.75, 1, 1.5, 2]"
    downloadable
    file-name="weekly-traffic-report.webm"
  />
</template>
