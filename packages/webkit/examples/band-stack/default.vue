<script setup>
  import BandStack from '@aziontech/webkit/band-stack'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
</script>

<template>
  <BandStack>
    <MediaSplit
      title="Build and Run Applications"
      description="Deploy applications and static sites straight from Git."
      size="large"
      align="center"
      :heading-level="3"
    >
      <template #media>
        <Illustration name="ai-applications" />
      </template>
    </MediaSplit>
    <MediaSplit
      title="Secure Applications and Networks"
      description="Stop DDoS attacks, bots and exploits before they reach your origin."
      size="large"
      align="center"
      :heading-level="3"
    >
      <template #media>
        <Illustration name="deploy-secure-mcp-server" />
      </template>
    </MediaSplit>
    <MediaSplit
      title="Observe Every Request"
      description="Follow logs, metrics and events from every location as they happen."
      size="large"
      align="center"
      :heading-level="3"
    >
      <template #media>
        <Illustration name="live-debugging" />
      </template>
    </MediaSplit>
  </BandStack>
</template>
