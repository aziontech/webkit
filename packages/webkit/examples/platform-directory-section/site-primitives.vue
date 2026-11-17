<script setup>
  import PlatformDirectorySection from '@aziontech/webkit/platform-directory-section'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionGap from '@aziontech/webkit/section-gap'

  const groups = [
    {
      title: 'Build',
      items: [
        {
          icon: 'az az-functions',
          title: 'Functions',
          description: 'Run code globally with no cold starts',
          href: '/products/functions'
        },
        {
          icon: 'az az-rules-engine',
          title: 'Rules Engine',
          description: 'Automate request handling with rules',
          href: 'https://www.azion.com/en/documentation/products/build/applications/rules-engine/'
        },
        {
          icon: 'az az-image-processor',
          title: 'Image Processor',
          description: 'Resize and convert images on demand',
          href: 'https://www.azion.com/en/products/image-processor/'
        },
        {
          icon: 'az az-layers',
          title: 'Cache',
          description: 'Speed up content delivery and reduce origin load',
          href: 'https://www.azion.com/en/products/cache/'
        },
        {
          icon: 'az az-ai-inference',
          title: 'AI Inference',
          description: 'Run models close to the user',
          href: 'https://www.azion.com/en/products/ai-inference/'
        },
        {
          icon: 'az az-ai-gateway',
          title: 'AI Gateway',
          description: 'Route, secure and log every model call',
          href: 'https://www.azion.com/en/solutions#ai'
        }
      ]
    },
    {
      title: 'Store',
      items: [
        {
          icon: 'az az-object-storage',
          title: 'Object Storage',
          description: 'Store and serve objects close to users',
          href: 'https://www.azion.com/en/products/object-storage/'
        },
        {
          icon: 'az az-sql-database',
          title: 'SQL Database',
          description: 'Run SQL on a distributed database',
          href: 'https://www.azion.com/en/products/sql-database/'
        },
        {
          icon: 'az az-kv-store',
          title: 'KV Store',
          description: 'Store key-value data with low latency',
          href: 'https://www.azion.com/en/products/kv-store/'
        }
      ]
    },
    {
      title: 'Secure',
      items: [
        {
          icon: 'az az-waf',
          title: 'WAF',
          description: 'Block common attacks close to traffic',
          href: 'https://www.azion.com/en/products/web-application-firewall/'
        },
        {
          icon: 'az az-azion-api',
          title: 'API Gateway',
          description: 'Secure, manage, and scale API traffic',
          href: 'https://www.azion.com/en/solutions/api-gateway/'
        },
        {
          icon: 'az az-bot-manager',
          title: 'Bot Manager',
          description: 'Detect and stop automated traffic',
          href: 'https://www.azion.com/en/products/bot-manager/'
        },
        {
          icon: 'az az-edge-dns',
          title: 'Edge DNS',
          description: 'Authoritative DNS, distributed globally',
          href: 'https://www.azion.com/en/products/edge-dns/'
        },
        {
          icon: 'az az-load-balancer',
          title: 'Load Balancer',
          description: 'Spread traffic across origins for availability',
          href: 'https://www.azion.com/en/products/load-balancer/'
        }
      ]
    },
    {
      title: 'Observe',
      items: [
        {
          icon: 'az az-real-time-metrics',
          title: 'Real-Time Metrics',
          description: 'Watch traffic, errors and latency as they happen',
          href: 'https://www.azion.com/en/products/real-time-metrics/'
        }
      ]
    }
  ]
</script>

<template>
  <SectionContainer max-width="site">
    <SectionGap hatch />

    <PlatformDirectorySection
      title="Everything you need to build and run applications"
      aria-label="Azion products"
      :groups="groups"
    />

    <SectionGap hatch />
  </SectionContainer>
</template>
