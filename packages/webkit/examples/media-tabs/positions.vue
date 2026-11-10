<script setup>
  import Illustration from '@aziontech/webkit/illustration'
  import MediaTabs from '@aziontech/webkit/media-tabs'

  const scenes = [
    'ai-applications',
    'live-debugging',
    'deploy-secure-mcp-server',
    'modern-frontends',
    'content-and-media-delivery'
  ]

  const items = [
    {
      title: 'Run AI models close to users',
      description: 'Answer in under 30 ms from the location closest to the user who asked.'
    },
    {
      title: 'Watch every request live',
      description: 'Traces arrive as the traffic does, with no agent to install.'
    },
    {
      title: 'Deploy secure MCP servers',
      description: 'Put a server next to every user, behind the same policies.'
    },
    {
      title: 'Ship modern frontends',
      description: 'Render pages beside the reader and keep the origin quiet.'
    },
    {
      title: 'Deliver media at scale',
      description: 'Serve video and images from a cache that is already warm.'
    }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <MediaTabs
      position="left"
      :autoplay="false"
      :items="items"
    >
      <template #media="{ index }">
        <Illustration :name="scenes[index]" />
      </template>
    </MediaTabs>
    <MediaTabs
      position="right"
      :autoplay="false"
      :items="items"
    >
      <template #media="{ index }">
        <Illustration :name="scenes[index]" />
      </template>
    </MediaTabs>
    <MediaTabs
      position="top"
      :autoplay="false"
      :items="items"
    >
      <template #media="{ index }">
        <Illustration :name="scenes[index]" />
      </template>
    </MediaTabs>
    <MediaTabs
      position="bottom"
      :autoplay="false"
      :items="items"
    >
      <template #media="{ index }">
        <Illustration :name="scenes[index]" />
      </template>
    </MediaTabs>
  </div>
</template>
