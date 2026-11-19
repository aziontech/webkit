<script setup>
  import placeholderClip from '@aziontech/webkit/assets/placeholder-clip.webm'
  import placeholderImage from '@aziontech/webkit/assets/placeholder-image.svg'
  import VideoPlayer from '@aziontech/webkit/video-player'

  const captionsVtt = [
    'WEBVTT',
    '',
    '00:00.000 --> 00:03.000',
    'Open Acme Store and choose Create application.',
    '',
    '00:03.000 --> 00:06.000',
    'Import the repository and deploy.'
  ].join('\n')

  const captions = [
    {
      src: `data:text/vtt;charset=utf-8,${encodeURIComponent(captionsVtt)}`,
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
