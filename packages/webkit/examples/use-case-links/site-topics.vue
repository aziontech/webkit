<script setup>
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'
  import UseCaseLinks from '@aziontech/webkit/use-case-links'

  const items = [
    {
      icon: 'pi pi-code',
      title: 'Accelerate REST and GraphQL APIs',
      description:
        'Cache API responses with query string and cookie-based segmentation for faster client applications.',
      href: 'https://www.azion.com/en/solutions/api-gateway/'
    },
    {
      icon: 'pi pi-shopping-cart',
      title: 'Optimize product catalogs',
      description:
        'Segment listings by category, region, and user preferences with cache key rules.',
      href: 'https://www.azion.com/en/solutions/application-acceleration/'
    },
    {
      icon: 'ai ai-layers',
      title: 'Personalize multi-tenant apps',
      description: 'Serve tenant-specific content with cookie-based cache variation rules.',
      href: 'https://www.azion.com/en/documentation/'
    },
    {
      icon: 'ai ai-live-ingest',
      title: 'Stream content faster',
      description:
        'Cache playlists and user preferences while serving browsing content efficiently.',
      href: 'https://www.azion.com/en/documentation/'
    },
    {
      icon: 'pi pi-bolt',
      title: 'Reduce API latency',
      description: 'Short TTLs for rapidly changing data endpoints and real-time applications.',
      href: 'https://www.azion.com/en/documentation/products/build/applications/application-accelerator/'
    },
    {
      icon: 'pi pi-user',
      title: 'Deliver personalized experiences',
      description:
        'Cache user-specific content with session-based cookie variation for tailored delivery.',
      href: 'https://www.azion.com/en/documentation/'
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <UseCaseLinks
      eyebrow="Use Cases"
      title="What teams use Application Accelerator for"
      description="Cache what standard CDN caching cannot, with the methods, query strings and cookies you choose."
      :items="items"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
