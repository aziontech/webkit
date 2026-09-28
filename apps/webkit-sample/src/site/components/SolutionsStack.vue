<script setup>
  import BandStack from '@aziontech/webkit/band-stack'
  import Button from '@aziontech/webkit/button'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'

  defineProps({
    /** Pins each card under the site nav as the page scrolls, stacking them. */
    sticky: { type: Boolean, default: false }
  })

  const SOLUTIONS = [
    {
      key: 'build',
      illustration: 'fastest-path-to-live-website',
      title: 'Build and Run Applications',
      description:
        'Deploy applications and static sites straight from Git, and run them on a distributed network with no servers to manage.',
      href: 'https://www.azion.com/en/solutions/#development',
      media: { fill: 'canvas', texture: 'pixelate', textureSize: 'small', textureFade: 'top' }
    },
    {
      key: 'performance',
      illustration: 'improve-application-performance-and-reliability',
      title: 'Improve Application Performance and Reliability',
      description:
        'Cache, route and optimize every request close to your users, so applications stay fast and available under any load.',
      href: 'https://www.azion.com/en/solutions/#performance',
      media: { fill: 'canvas', texture: 'pixelate', textureSize: 'small', textureFade: 'top' }
    },
    {
      key: 'ai',
      illustration: 'ai-applications',
      title: 'Build and Run AI Workloads',
      description:
        'Run inference, vector search and AI agents on distributed infrastructure, close to the data and the users that need them.',
      href: 'https://www.azion.com/en/solutions/#ai',
      media: { fill: 'canvas', texture: 'pixelate', textureSize: 'small', textureFade: 'top' }
    },
    {
      key: 'security',
      illustration: 'automate-threat-mitigation',
      title: 'Secure Applications and Networks',
      description:
        'Stop DDoS attacks, bots and exploits before they reach your origin, with WAF and network rules managed from one console.',
      href: 'https://www.azion.com/en/solutions/#security',
      media: { fill: 'canvas', texture: 'pixelate', textureSize: 'small', textureFade: 'top' }
    },
    {
      key: 'media',
      illustration: 'low-latency',
      title: 'Deliver Media and Streaming Content',
      description:
        'Stream video and deliver large files at low latency to audiences of any size, with media processed at the edge.',
      href: 'https://www.azion.com/en/solutions/',
      media: { fill: 'canvas', texture: 'none', textureSize: 'medium', textureFade: 'top' }
    }
  ]
</script>

<template>
  <BandStack
    :sticky="sticky"
    flush
  >
    <MediaSplit
      v-for="solution in SOLUTIONS"
      :key="solution.key"
      kind="media-end"
      :divided="true"
      :heading-level="1"
      align="center"
      size="large"
      :media-fill="solution.media.fill"
      :texture="solution.media.texture"
      :texture-size="solution.media.textureSize"
      :texture-fade="solution.media.textureFade"
      :title="solution.title"
      :description="solution.description"
      :media-href="solution.href"
    >
      <template #media>
        <Illustration :name="solution.illustration" />
      </template>
      <template #actions>
        <Button
          label="Learn more"
          kind="outlined"
          size="medium"
          icon="pi pi-chevron-right"
          icon-position="trailing"
          animated
          :href="solution.href"
        />
      </template>
    </MediaSplit>
  </BandStack>
</template>
