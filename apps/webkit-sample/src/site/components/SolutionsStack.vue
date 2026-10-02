<script setup>
  import quickStartWithTemplates from '@aziontech/webkit/assets/quick-start-with-templates.svg'
  import BandStack from '@aziontech/webkit/band-stack'
  import Button from '@aziontech/webkit/button'
  import Illustration from '@aziontech/webkit/illustration'
  import MediaSplit from '@aziontech/webkit/media-split'
  import { useRouter } from 'vue-router'

  defineProps({
    /** Pins each card under the site nav as the page scrolls, stacking them. */
    sticky: { type: Boolean, default: false }
  })

  const router = useRouter()

  const followSolution = (event, href) => {
    if (!href.startsWith('/') || event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    if (!event.target.closest('a') && globalThis.getSelection()?.toString()) return
    event.preventDefault()
    router.push(href)
  }

  const SOLUTIONS = [
    {
      key: 'build',
      art: quickStartWithTemplates,
      title: 'Build and Run Applications',
      description:
        'Deploy applications and static sites straight from Git, and run them on a distributed network with no servers to manage.',
      href: '/site/solutions/web-apps',
      media: { fill: 'canvas', texture: 'pixelate', textureSize: 'small', textureFade: 'top' }
    },
    {
      key: 'performance',
      illustration: 'improve-application-performance-and-reliability',
      title: 'Improve Application Performance and Reliability',
      description:
        'Cache, route and optimize every request close to your users, so applications stay fast and available under any load.',
      href: '/site/solutions/performance',
      media: { fill: 'canvas', texture: 'pixelate', textureSize: 'small', textureFade: 'top' }
    },
    {
      key: 'ai',
      illustration: 'ai-applications',
      title: 'Build and Run AI Workloads',
      description:
        'Run inference, vector search and AI agents on distributed infrastructure, close to the data and the users that need them.',
      href: '/site/solutions/ai',
      media: { fill: 'canvas', texture: 'pixelate', textureSize: 'small', textureFade: 'top' }
    },
    {
      key: 'security',
      illustration: 'automate-threat-mitigation',
      title: 'Secure Applications and Networks',
      description:
        'Stop DDoS attacks, bots and exploits before they reach your origin, with WAF and network rules managed from one console.',
      href: '/site/solutions/security',
      media: { fill: 'canvas', texture: 'pixelate', textureSize: 'small', textureFade: 'top' }
    },
    {
      key: 'media',
      illustration: 'low-latency',
      title: 'Deliver Media and Streaming Content',
      description:
        'Stream video and deliver large files at low latency to audiences of any size, with media processed at the edge.',
      href: '/site/solutions/streaming',
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
      @click="followSolution($event, solution.href)"
    >
      <template #media>
        <div
          v-if="solution.art"
          class="flex aspect-592/300 w-full items-center justify-center"
        >
          <img
            :src="solution.art"
            alt=""
            width="360"
            height="165"
            decoding="async"
            class="block h-auto w-[60.81%]"
          />
        </div>
        <Illustration
          v-else
          :name="solution.illustration"
        />
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
