<script setup>
  import quickStartWithTemplates from '@aziontech/webkit/assets/quick-start-with-templates.svg'
  import MediaSplitStack from '@aziontech/webkit/media-split-stack'

  const bands = [
    {
      image: quickStartWithTemplates,
      title: 'Modern applications',
      description: 'Build static sites, run serverless applications, or modernize legacy systems.',
      action: {
        label: 'Learn more',
        href: '/en/solutions/web-apps/'
      }
    },
    {
      illustration: 'improve-application-performance-and-reliability',
      title: 'Optimized workloads',
      description:
        'Speed up applications, deliver content through the CDN, and process images on demand.',
      action: {
        label: 'Learn more',
        href: '/en/solutions/performance/'
      }
    },
    {
      illustration: 'ai-applications',
      title: 'AI applications',
      description:
        'Build and deploy AI agents and AI-powered applications on a distributed platform, with inference close to users.',
      action: {
        label: 'Learn more',
        href: '/en/solutions/ai/'
      }
    },
    {
      illustration: 'automate-threat-mitigation',
      title: 'Protected applications and APIs',
      description:
        'Protect web applications and APIs (WAAP), manage bots, and enforce programmable security policies at scale.',
      action: {
        label: 'Learn more',
        href: '/en/solutions/security/'
      }
    },
    {
      illustration: 'content-and-media-delivery',
      title: 'Media and streaming content',
      description:
        'Stream video and deliver large files at low latency to audiences of any size, with media processed close to viewers.',
      action: {
        label: 'Learn more',
        href: '/en/solutions/streaming/'
      }
    }
  ]
</script>

<template>
  <MediaSplitStack
    kind="media-end"
    :bands="bands"
  />
</template>
