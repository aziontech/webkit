<script setup>
  import Illustration from '@aziontech/webkit/illustration'
  import MediaTabs from '@aziontech/webkit/media-tabs'

  const items = [
    {
      title: 'Run AI models close to users',
      description:
        'Execute models on the Azion Web Platform across hundreds of locations to deliver real-time responses with median latency under 30 ms.'
    },
    {
      title: 'Watch every inference as it happens',
      description:
        'Tokens, latency and error rate per model arrive as the traffic does, with no agent to install and no sampling window to wait out.'
    },
    {
      title: 'Ship a model the way you ship code',
      description:
        'One command puts a new revision in every location at once, and the one before it stays a rollback away.'
    }
  ]
</script>

<template>
  <MediaTabs :items="items">
    <template #media>
      <Illustration />
    </template>
  </MediaTabs>
</template>
