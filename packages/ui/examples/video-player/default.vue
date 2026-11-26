<script setup>
  import placeholderClip from '@aziontech/ui/assets/placeholder-clip.webm'
  import placeholderImage from '@aziontech/ui/assets/placeholder-image.svg'
  import VideoPlayer from '@aziontech/ui/video-player'

  const vtt = 'WEBVTT\n\n00:00.000 --> 00:05.000\nCreate an application for Acme Store.'
  const captions = [
    {
      src: `data:text/vtt,${encodeURIComponent(vtt)}`,
      srclang: 'en',
      label: 'English',
      default: true
    }
  ]
</script>

<template>
  <VideoPlayer
    class="max-w-(--container-xl)"
    :src="placeholderClip"
    mime-type="video/webm"
    :poster="placeholderImage"
    :captions="captions"
    aria-label="Creating an application for Acme Store"
  />
</template>
