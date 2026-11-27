<script setup>
  import Illustration from '@aziontech/ui/illustration'
  import MediaSplit from '@aziontech/ui/media-split'
  import SplitStack from '@aziontech/ui/split-stack'
</script>

<template>
  <SplitStack
    sticky
    flush
  >
    <MediaSplit
      title="Build and run applications"
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
      title="Secure applications and networks"
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
      title="Observe every request"
      description="Follow logs, metrics and events from every location as they happen."
      size="large"
      align="center"
      :heading-level="3"
    >
      <template #media>
        <Illustration name="live-debugging" />
      </template>
    </MediaSplit>
  </SplitStack>
</template>
